import Swal from 'sweetalert2'

export const confirmDelete = (title = 'Hapus item ini?', text = 'Data yang dihapus tidak bisa dikembalikan!') => {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#C9956C', // Warna Brown/Rose Gold kita
        cancelButtonColor: '#D4756B', // Warna Rose/Danger kita
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal',
        background: '#fff',
        color: '#5D4037',
        borderRadius: '20px',
        customClass: {
            popup: 'rounded-3xl border-none shadow-2xl',
            title: 'font-playfair font-bold',
            confirmButton: 'rounded-xl px-6 py-3 font-bold uppercase tracking-widest text-xs',
            cancelButton: 'rounded-xl px-6 py-3 font-bold uppercase tracking-widest text-xs'
        }
    })
}

export const alertSuccess = (title, text) => {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'success',
        confirmButtonColor: '#8BAF8B',
        timer: 2000,
        borderRadius: '20px',
    })
}
