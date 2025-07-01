<template>
  <div class="bottom-nav bg-dark">
    <router-link to="/transaksi" class="nav-item" active-class="active">
      <i class="bi bi-cart3"></i>
      <span>Transaksi</span>
    </router-link>
    <router-link to="/produk" class="nav-item" active-class="active">
      <i class="bi bi-box-seam"></i>
      <span>Produk</span>
    </router-link>
    <router-link to="/transaksi/riwayat" class="nav-item" active-class="active">
      <i class="bi bi-clock-history"></i>
      <span>Riwayat</span>
    </router-link>
    <router-link to="/laporan" class="nav-item" active-class="active">
      <i class="bi bi-bar-chart-line"></i>
      <span>Laporan</span>
    </router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #4e4e4e;
  z-index: 1000;
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  text-decoration: none;
  font-size: 0.75rem;
}
.nav-item i {
  font-size: 1.5rem;
}
.nav-item.active {
  color: var(--primary-color);
}
</style>
