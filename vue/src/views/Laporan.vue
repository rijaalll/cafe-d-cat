<template>
  <div>
    <h1 class="mb-4">Laporan Penjualan</h1>
    <div v-if="loading" class="text-center p-5">
        <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
        <p class="mt-2">Menganalisis data...</p>
    </div>
    <div v-else-if="!transactions.length" class="text-center p-5 text-muted">
        Tidak ada data transaksi untuk ditampilkan dalam laporan.
    </div>
    <div v-else class="row g-4">
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title mb-3">Pendapatan Harian (7 Hari Terakhir)</h5>
            <Bar v-if="dailySalesData.labels.length" :data="dailySalesData" :options="chartOptions" />
            <p v-else class="text-muted text-center p-4">Tidak ada data penjualan dalam 7 hari terakhir.</p>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title mb-3">Top 5 Produk Terlaris</h5>
             <Doughnut v-if="bestSellerData.labels.length" :data="bestSellerData" :options="doughnutOptions" />
             <p v-else class="text-muted text-center p-4">Tidak ada data produk terjual.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Bar, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import ApiService from '../services/ApiService';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const loading = ref(true);
const transactions = ref([]);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#ecf0f1' } }
  },
  scales: {
    y: {
      ticks: { color: '#ecf0f1' },
      grid: { color: 'rgba(236, 240, 241, 0.1)' }
    },
    x: {
      ticks: { color: '#ecf0f1' },
      grid: { color: 'rgba(236, 240, 241, 0.1)' }
    }
  }
};

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: { color: '#ecf0f1' }
        }
    }
};

const dailySalesData = computed(() => {
  const salesByDay = {};
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  transactions.value.forEach(item => {
    const transactionDate = new Date(item.tanggal);
    if (transactionDate >= sevenDaysAgo) {
        const date = transactionDate.toISOString().split('T')[0];
        const total = item.quantity * item.harga_saat_transaksi;
        salesByDay[date] = (salesByDay[date] || 0) + total;
    }
  });

  const labels = Object.keys(salesByDay).sort((a,b) => new Date(a) - new Date(b));
  const data = labels.map(date => salesByDay[date]);

  return {
    labels: labels.map(date => new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Pendapatan (IDR)',
      backgroundColor: '#f3a683',
      borderColor: '#e59471',
      borderWidth: 1,
      data: data
    }]
  };
});

const bestSellerData = computed(() => {
  const salesByProduct = transactions.value.reduce((acc, item) => {
    acc[item.nama_menu] = (acc[item.nama_menu] || 0) + item.quantity;
    return acc;
  }, {});
  
  const sortedProducts = Object.entries(salesByProduct)
    .sort(([,a],[,b]) => b-a)
    .slice(0, 5);

  return {
    labels: sortedProducts.map(item => item[0]),
    datasets: [{
      backgroundColor: ['#f3a683', '#f7d794', '#778beb', '#e77f67', '#cf6a87'],
      data: sortedProducts.map(item => item[1])
    }]
  };
});

onMounted(async () => {
  loading.value = true;
  try {
    const response = await ApiService.getAllTransaksi();
    transactions.value = response.data || [];
  } catch (error) {
    alert("Gagal mengambil data untuk laporan.");
  } finally {
    loading.value = false;
  }
});
</script>
