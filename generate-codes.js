const fs = require('fs');

const NUM_CODES = 100; // Jumlah kode yang ingin dibuat
const PREFIX = 'NR-';

function generateRandomCode() {
  // Menggunakan huruf dan angka yang mudah dibaca (tanpa I, 1, O, 0)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return PREFIX + result;
}

const codes = new Set();
while(codes.size < NUM_CODES) {
  codes.add(generateRandomCode());
}

// Buat format CSV
const csvContent = "code\n" + Array.from(codes).join("\n");
fs.writeFileSync('voucher_codes.csv', csvContent);

console.log(`✅ Berhasil membuat ${NUM_CODES} kode voucher unik!`);
console.log(`📂 Kode telah disimpan di file: voucher_codes.csv`);
