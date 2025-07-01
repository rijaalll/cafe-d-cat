<template>
  <div class="sidebar d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
      <img src="/logo-2.png" alt="Cat Logo" width="40" height="40" class="me-2">
      <span class="fs-4">Cafe D' Cat</span>
    </a>
    <hr>
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item">
        <router-link to="/transaksi" class="nav-link text-white" active-class="active">
          <i class="bi bi-cart3 me-2"></i> Transaksi
        </router-link>
      </li>
      <li>
        <router-link to="/produk" class="nav-link text-white" active-class="active">
          <i class="bi bi-box-seam me-2"></i> Produk
        </router-link>
      </li>
      <li>
        <router-link to="/transaksi/riwayat" class="nav-link text-white" active-class="active">
          <i class="bi bi-clock-history me-2"></i> Riwayat
        </router-link>
      </li>
      <li>
        <router-link to="/laporan" class="nav-link text-white" active-class="active">
          <i class="bi bi-bar-chart-line me-2"></i> Laporan
        </router-link>
      </li>
    </ul>
    <hr>
    <div class="dropdown">
      <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
        <img src="https://placehold.co/32x32/f3a683/2c3e50?text=A" alt="" width="32" height="32" class="rounded-circle me-2">
        <strong>Admin</strong>
      </a>
      <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
        <li><a class="dropdown-item" href="#">Settings</a></li>
        <li><a class="dropdown-item" href="#">Profile</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#">Sign out</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
.nav-pills .nav-link.active, .nav-pills .show > .nav-link {
  background-color: var(--primary-color);
  color: #000 !important;
}
.nav-link:hover {
    background-color: var(--hover-color);
}
</style>
