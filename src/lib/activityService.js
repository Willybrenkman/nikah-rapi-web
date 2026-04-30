// src/lib/activityService.js
import { supabase } from './supabase'

export const activityService = {
  /**
   * Log an activity to the database
   * @param {string} weddingId - The ID of the wedding
   * @param {string} email - The email of the user performing the action
   * @param {string} action - Brief description (e.g., 'Update Budget', 'Tambah Tamu')
   * @param {string} details - Detailed info (e.g., 'Katering diubah dari 10jt ke 12jt')
   */
  async log(weddingId, email, action, details) {
    if (!weddingId) return
    
    try {
      const { error } = await supabase.from('activity_logs').insert({
        wedding_id: weddingId,
        user_email: email || 'User',
        action: action,
        details: details
      })
      if (error) console.error('Logging Error:', error)
    } catch (err) {
      console.error('Activity Log failed:', err)
    }
  }
}
