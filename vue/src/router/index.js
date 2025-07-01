import { createRouter, createWebHistory } from 'vue-router'

// Menggunakan Lazy Loading untuk mempercepat waktu muat awal
const ProdukView = () => import('../views/Produk.vue')
const TransaksiView = () => import('../views/Transaksi.vue')
const RiwayatView = () => import('../views/Riwayat.vue')
const LaporanView = () => import('../views/Laporan.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/transaksi'
    },
    {
      path: '/produk',
      name: 'produk',
      component: ProdukView,
      meta: { title: 'Manajemen Produk' }
    },
    {
      path: '/transaksi',
      name: 'transaksi',
      component: TransaksiView,
      meta: { title: 'Buat Transaksi' }
    },
    {
      path: '/transaksi/riwayat',
      name: 'riwayat',
      component: RiwayatView,
      meta: { title: 'Riwayat Transaksi' }
    },
    {
      path: '/laporan',
      name: 'laporan',
      component: LaporanView,
      meta: { title: 'Laporan Penjualan' }
    }
  ]
})

// Menambahkan judul halaman secara dinamis dari meta route
router.beforeEach((to, from, next) => {
  document.title = `Cafe D' Cat - ${to.meta.title || 'Welcome'}`;
  next();
});

export default router
