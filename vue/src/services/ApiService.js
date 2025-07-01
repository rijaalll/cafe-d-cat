import axios from 'axios';

// Membuat instance axios dengan konfigurasi dasar
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    'Accept': 'application/json',
  }
});

// Menambahkan interceptor untuk menangani error secara global
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Log error atau tampilkan notifikasi
    console.error('API Error:', error.response || error.message);
    // Melempar kembali error agar bisa ditangani di komponen
    return Promise.reject(error);
  }
);


export default {
  /**
   * MENU / PRODUK
   * Berdasarkan file backend Anda, tidak ada endpoint untuk mengambil semua menu.
   * Route yang ada adalah /menu/search/:query.
   * Saya akan menambahkan fungsi getAllProduk yang menggunakan query kosong untuk mencari semua.
   * Sebaiknya, tambahkan route GET /menu/all di backend Anda untuk performa lebih baik.
   */
  getAllProduk() {
    return apiClient.get('/menu/search/'); // Query kosong untuk mendapat semua
  },
  searchProduk(query) {
    return apiClient.get(`/menu/search/${query}`);
  },
  addProduk(formData) {
    return apiClient.post('/menu/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateProduk(id, formData) {
    return apiClient.put(`/menu/edit/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteProduk(id) {
    return apiClient.delete(`/menu/delete/${id}`);
  },

  /**
   * KATEGORI
   */
  getKategori() {
    return apiClient.get('/kategori/all');
  },

  /**
   * TRANSAKSI
   */
  createTransaksi(transaksiData) {
    return apiClient.post('/transaksi/add', transaksiData, {
        headers: { 'Content-Type': 'application/json' }
    });
  },
  getAllTransaksi() {
    return apiClient.get('/transaksi/get/all');
  }
};
