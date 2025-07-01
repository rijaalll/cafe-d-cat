<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Manajemen Produk</h1>
      <button class="btn btn-primary" @click="openModal()">
        <i class="bi bi-plus-circle me-2"></i>Tambah Produk
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">Gambar</th>
                <th scope="col">Nama Produk</th>
                <th scope="col">Kategori</th>
                <th scope="col">Harga</th>
                <th scope="col" class="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="5" class="text-center p-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="products.length === 0">
                <td colspan="5" class="text-center p-4 text-muted">Belum ada produk. Silakan tambahkan produk baru.</td>
              </tr>
              <tr v-for="product in products" :key="product.id">
                <td>
                  <img :src="product.image_url || 'https://placehold.co/80x80/34495e/ecf0f1?text=N/A'" 
                       :alt="`Gambar ${product.nama}`" 
                       width="80" 
                       height="80"
                       class="rounded object-fit-cover shadow-sm">
                </td>
                <td>{{ product.nama }}</td>
                <td><span class="badge bg-secondary">{{ product.nama_kategori || 'Tidak ada kategori' }}</span></td>
                <td>{{ formatCurrency(product.harga) }}</td>
                <td class="text-end">
                  <button class="btn btn-sm btn-warning me-2" @click="openModal(product)" title="Edit">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="confirmDelete(product.id)" title="Hapus">
                    <i class="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ProdukModal ref="produkModalRef" :produk="selectedProduct" @saved="onSaveSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProdukModal from '../components/ProdukModal.vue';
import ApiService from '../services/ApiService';

const products = ref([]);
const loading = ref(true);
const produkModalRef = ref(null);
const selectedProduct = ref(null);

const fetchProducts = async () => {
  loading.value = true;
  products.value = [];
  try {
    const response = await ApiService.getAllProduk();
    products.value = response.data;
  } catch (error) {
    // Jika 404, berarti tidak ada produk, itu bukan error aplikasi
    if (error.response?.status !== 404) {
      alert('Gagal memuat data produk. Periksa koneksi atau backend.');
    }
  } finally {
    loading.value = false;
  }
};

const openModal = (product = null) => {
  selectedProduct.value = product;
  produkModalRef.value?.show();
};

const onSaveSuccess = () => {
  fetchProducts(); // Muat ulang data setelah sukses menyimpan
};

const confirmDelete = (id) => {
  if (window.confirm('Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.')) {
    deleteProduct(id);
  }
};

const deleteProduct = async (id) => {
  try {
    await ApiService.deleteProduk(id);
    alert('Produk berhasil dihapus.');
    fetchProducts(); // Muat ulang data
  } catch (error) {
    alert('Gagal menghapus produk.');
  }
};

const formatCurrency = (value) => {
  if (isNaN(value)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

onMounted(fetchProducts);
</script>
