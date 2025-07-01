<template>
  <div class="row g-4">
    <!-- Kolom Produk -->
    <div class="col-lg-7 col-xl-8">
      <h1>Pilih Menu</h1>
      <div class="mb-3">
        <input type="text" class="form-control" placeholder="Cari menu berdasarkan nama..." v-model="searchQuery">
      </div>

      <div v-if="loading" class="text-center p-5">
        <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
      </div>
      <div v-else-if="filteredProducts.length === 0" class="text-center p-5 text-muted">
        Produk tidak ditemukan.
      </div>
      <div v-else class="row g-3">
        <div v-for="product in filteredProducts" :key="product.id" class="col-md-6 col-lg-4 col-xl-3">
          <div class="card h-100 product-card" @click="addToCart(product)" role="button">
            <img :src="product.image_url || 'https://placehold.co/300x200/34495e/ecf0f1?text=N/A'" 
                 class="card-img-top" 
                 :alt="`Gambar ${product.nama}`"
                 height="150">
            <div class="card-body d-flex flex-column">
              <h6 class="card-title flex-grow-1">{{ product.nama }}</h6>
              <p class="card-text text-primary fw-bold mb-0">{{ formatCurrency(product.harga) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Kolom Keranjang -->
    <div class="col-lg-5 col-xl-4">
      <div class="card sticky-top shadow-sm" style="top: 20px;">
        <div class="card-body">
          <h4 class="card-title mb-3">Keranjang Pesanan</h4>
          <div class="mb-3">
              <label for="customerName" class="form-label">Nama Pelanggan</label>
              <input type="text" id="customerName" class="form-control" v-model="customerName" placeholder="Contoh: Budi">
          </div>
          <hr>
          
          <div v-if="cart.length === 0" class="text-center text-muted p-4">
            Keranjang masih kosong.
          </div>
          
          <div v-else class="cart-items mb-3">
             <div v-for="item in cart" :key="item.menu_id" class="d-flex align-items-center mb-3">
                <div class="flex-grow-1">
                    <div>{{ item.nama }}</div>
                    <small class="text-muted">{{ formatCurrency(item.harga) }}</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary" @click="updateQuantity(item, -1)">-</button>
                    <span class="mx-2">{{ item.quantity }}</span>
                    <button class="btn btn-sm btn-outline-secondary" @click="updateQuantity(item, 1)">+</button>
                </div>
                <button class="btn btn-sm btn-outline-danger ms-3" @click="removeFromCart(item.menu_id)">
                    <i class="bi bi-x-lg"></i>
                </button>
             </div>
          </div>
          
          <hr v-if="cart.length > 0">
          <div v-if="cart.length > 0" class="d-flex justify-content-between fs-5 fw-bold mb-3">
            <span>Total:</span>
            <span>{{ formatCurrency(totalPrice) }}</span>
          </div>
          <button class="btn btn-primary w-100" :disabled="!isReadyToSubmit" @click="submitTransaction">
            <i class="bi bi-check-circle me-2"></i> Buat Pesanan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ApiService from '../services/ApiService';

const allProducts = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const cart = ref([]);
const customerName = ref('');

const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await ApiService.getAllProduk();
    allProducts.value = response.data;
  } catch (error) {
    if (error.response?.status !== 404) {
      alert("Gagal mengambil data produk.");
    }
  } finally {
    loading.value = false;
  }
};

const filteredProducts = computed(() => {
  if (!searchQuery.value) return allProducts.value;
  return allProducts.value.filter(p => 
    p.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const addToCart = (product) => {
  const existingItem = cart.value.find(item => item.menu_id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.value.push({ menu_id: product.id, nama: product.nama, harga: product.harga, quantity: 1 });
  }
};

const updateQuantity = (item, change) => {
    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(item.menu_id);
    }
}

const removeFromCart = (productId) => {
  cart.value = cart.value.filter(item => item.menu_id !== productId);
};

const totalPrice = computed(() => {
  return cart.value.reduce((total, item) => total + (item.harga * item.quantity), 0);
});

const isReadyToSubmit = computed(() => cart.value.length > 0 && !loading.value);

const submitTransaction = async () => {
  if (!isReadyToSubmit.value) return;

  const transactionData = {
    nama_pelanggan: customerName.value.trim() || 'Guest',
    items: cart.value.map(item => ({
      menu_id: item.menu_id,
      quantity: item.quantity,
      harga: item.harga,
    })),
  };

  try {
    await ApiService.createTransaksi(transactionData);
    alert('Transaksi berhasil dibuat!');
    cart.value = [];
    customerName.value = '';
  } catch (error) {
    alert('Gagal membuat transaksi. Silakan coba lagi.');
  }
};

const formatCurrency = (value) => {
  if (isNaN(value)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

onMounted(fetchProducts);
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(243, 166, 131, 0.2);
}
.card-img-top {
  object-fit: cover;
}
.cart-items {
    max-height: 300px;
    overflow-y: auto;
}
</style>
