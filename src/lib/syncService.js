// src/lib/syncService.js
import { supabase } from './supabase'

/**
 * Service untuk menangani sinkronisasi data antar modul (Budget, Vendor, dll)
 * Menghindari duplikasi logika di level komponen (Frontend).
 * 
 * FLOW:
 * - Budget Planner → syncFromBudget() → Update module tables
 * - Module Pages  → syncToBudget()   → Update budget_items
 * 
 * Infinite loop dicegah oleh parameter `source`:
 * - syncFromBudget hanya dipanggil dari BudgetPlanner (source='budget')
 * - syncToBudget hanya dipanggil dari module pages (source='module')
 * - _upsert() juga memiliki guard `hasChanged` untuk menghindari write yang tidak perlu
 */
export const syncService = {
  /**
   * Sync data dari Budget Planner ke modul terkait
   * @param {string} weddingId 
   * @param {string} type - Tipe budget (katering, mua, foto, dll)
   * @param {string} category - Nama kategori/vendor
   * @param {number} estimation - Jumlah estimasi
   * @param {number} actual - Jumlah aktual
   */
  async syncFromBudget(weddingId, type, category, estimation, actual) {
    if (!type || !weddingId) return null

    const est = Number(estimation) || 0
    const akt = Number(actual) || 0
    const wid = weddingId

    try {
      switch (type) {
        case 'katering':
          return await this._upsert('katering_vendor', { wedding_id: wid }, { 
            total_kontrak: est, 
            dp_dibayar: akt, 
            nama_vendor: category 
          })

        case 'mua':
          return await this._upsert('mua_detail', { wedding_id: wid }, { 
            total: est, 
            dp: akt, 
            nama_mua: category 
          })

        case 'foto':
        case 'video':
          return await this._upsert('dokumentasi_vendor', { wedding_id: wid, tipe: type }, { 
            total: est, 
            dp: akt, 
            nama: category 
          })

        case 'dekorasi':
          return await this._upsert('dekorasi_items', { wedding_id: wid, nama: category }, { 
            estimasi: est, 
            area: 'Seluruh Area' 
          })

        case 'undangan':
          return await this._upsert('undangan_vendor', { wedding_id: wid }, { 
            harga: est, 
            nama_vendor: category, 
            layanan: 'Paket Undangan' 
          })

        case 'souvenir':
          return await this._upsert('souvenir_vendor', { wedding_id: wid }, { 
            harga_satuan: est, 
            total_dipesan: 1, 
            nama_vendor: category 
          })

        case 'seserahan':
          return await this._upsert('seserahan_items', { wedding_id: wid, nama: category }, { 
            estimasi: est, 
            aktual: akt, 
            kategori: 'Lainnya' 
          })

        case 'honeymoon':
          return await this._upsert('honeymoon_info', { wedding_id: wid }, { 
            total_budget: est, 
            destinasi: category 
          })

        case 'venue':
        case 'hiburan':
        case 'lainnya':
          const katName = type === 'venue' ? 'Venue' : type === 'hiburan' ? 'Hiburan' : 'Lainnya'
          return await this._upsert('vendors', { wedding_id: wid, kategori: katName }, { 
            total: est, 
            dp: akt, 
            nama: category 
          })

        default:
          return null
      }
    } catch (error) {
      console.error(`[SyncService] Error syncing ${type}:`, error)
      throw error
    }
  },

  /**
   * Sync data DARI modul spesifik KEMBALI KE Budget Planner
   * Dipanggil oleh module pages (Katering, MUA, Souvenir, dll)
   * 
   * @param {string} weddingId
   * @param {string} type - Tipe budget (katering, mua, dll)
   * @param {string} category - Label kategori
   * @param {number} estimation - Total estimasi
   * @param {number} actual - Total realisasi
   */
  async syncToBudget(weddingId, type, category, estimation, actual) {
    if (!type || !weddingId) return null

    const est = Number(estimation) || 0
    const akt = Number(actual) || 0

    try {
      // Cari item di budget_items yang memiliki tipe yang sama
      const { data: existing } = await supabase
        .from('budget_items')
        .select('*')
        .eq('wedding_id', weddingId)
        .eq('tipe', type)
        .maybeSingle()

      const payload = {
        jumlah_estimasi: est,
        jumlah_aktual: akt,
        kategori: category, 
        tipe: type
      }

      if (existing) {
        // Hanya update jika ada data yang berubah
        const hasChanged = existing.jumlah_estimasi !== est || 
                           existing.jumlah_aktual !== akt || 
                           existing.kategori !== category

        if (!hasChanged) return { data: existing, error: null }

        return await supabase.from('budget_items').update(payload).eq('id', existing.id)
      } else {
        return await supabase.from('budget_items').insert({
          ...payload,
          wedding_id: weddingId
        })
      }
    } catch (error) {
      console.error(`[SyncService] Error:`, error.message)
      throw new Error('Gagal sinkronisasi ke Budget Planner.')
    }
  },

  /**
   * Helper internal untuk melakukan Upsert (Update or Insert) berdasarkan kriteria tertentu
   * Termasuk guard `hasChanged` untuk mencegah write yang tidak perlu
   */
  async _upsert(table, matchCriteria, payload) {
    try {
      const { data: existing } = await supabase
        .from(table)
        .select('*')
        .match(matchCriteria)
        .maybeSingle()

      if (existing) {
        // Cek apakah ada perubahan nyata untuk menghindari redundancy
        const hasChanged = Object.keys(payload).some(key => existing[key] !== payload[key])
        if (!hasChanged) return { data: existing, error: null }

        return await supabase.from(table).update(payload).eq('id', existing.id)
      } else {
        return await supabase.from(table).insert({ ...matchCriteria, ...payload })
      }
    } catch (error) {
      console.error(`[SyncService Internal] Database Error:`, error.message)
      throw new Error('Gagal menyinkronkan data ke database.')
    }
  }
}
