<template>
  <div>
    <h1 class="mb-4">Riwayat Transaksi</h1>
    <div v-if="loading" class="text-center p-5">
      <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
    </div>
    <div v-else-if="groupedTransactions.length === 0" class="text-center p-5 text-muted">
      Belum ada riwayat transaksi.
    </div>
    <div v-else class="accordion" id="accordionRiwayat">
      <div v-for="transaction in groupedTransactions" :key="transaction.transaksi_id" class="accordion-item shadow-sm mb-2">
        <h2 class="accordion-header" :id="'heading' + transaction.transaksi_id">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + transaction.transaksi_id">
            <div class="w-100 d-flex flex-column flex-md-row justify-content-between pe-3">
              <span class="fw-bold mb-1 mb-md-0">
                #{{ transaction.transaksi_id }} - {{ transaction.nama_pelanggan }}
              </span>
              <span class="text-muted small mb-1 mb-md-0">{{ formatDate(transaction.tanggal) }}</span>
              <span class="fw-bold text-primary">{{ formatCurrency(transaction.total) }}</span>
            </div>
          </button>
        </h2>
        <div :id="'collapse' + transaction.transaksi_id" class="accordion-collapse collapse" data-bs-parent="#accordionRiwayat">
          <div class="accordion-body">
            <h6>Detail Pesanan:</h6>
            <ul class="list-group list-group-flush">
              <li v-for="item in transaction.items" :key="item.menu_id" class="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                <div>
                  {{ item.nama_menu }} 
                  <span class="text-muted">x {{ item.quantity }}</span>
                </div>
                <span>{{ formatCurrency(item.harga_saat_transaksi * item.quantity) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ApiService from '../services/ApiService';

const transactions = ref([]);
const loading = ref(true);

const fetchTransactions = async () => {
  loading.value = true;
  try {
    const response = await ApiService.getAllTransaksi();
    transactions.value = response.data;
  } catch (error) {
    alert("Gagal mengambil riwayat transaksi.");
  } finally {
    loading.value = false;
  }
};

const groupedTransactions = computed(() => {
  if (!transactions.value) return [];
  const groups = transactions.value.reduce((acc, item) => {
    if (!acc[item.transaksi_id]) {
      acc[item.transaksi_id] = {
        transaksi_id: item.transaksi_id,
        nama_pelanggan: item.nama_pelanggan,
        tanggal: item.tanggal,
        status: item.status,
        items: [],
        total: 0
      };
    }
    acc[item.transaksi_id].items.push(item);
    acc[item.transaksi_id].total += item.quantity * item.harga_saat_transaksi;
    return acc;
  }, {});
  
  return Object.values(groups).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
});

const formatCurrency = (value) => {
  if (isNaN(value)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

onMounted(fetchTransactions);
</script>

<style scoped>
.accordion-item {
  background-color: var(--surface-color);
  border: 1px solid #466079;
}
.accordion-button {
  background-color: var(--surface-color);
  color: var(--text-color);
}
.accordion-button:not(.collapsed) {
  background-color: var(--hover-color);
  color: var(--primary-color);
  box-shadow: none;
}
.accordion-button:focus {
  box-shadow: 0 0 0 0.25rem rgba(243, 166, 131, 0.25);
}
</style>
