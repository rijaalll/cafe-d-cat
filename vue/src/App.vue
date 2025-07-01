<template>
  <div class="d-flex">
    <!-- Sidebar untuk Desktop -->
    <Sidebar class="d-none d-md-flex" />

    <!-- Konten Utama -->
    <div class="main-content flex-grow-1">
      <div class="container-fluid p-4">
        <router-view />
      </div>
    </div>

    <!-- Bottom Nav untuk Mobile -->
    <BottomNav class="d-md-none" />
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
import BottomNav from './components/BottomNav.vue';
</script>

<style>
.main-content {
  /* Memberi ruang untuk bottom nav di mobile */
  padding-bottom: 70px; 
}

@media (min-width: 768px) {
  .main-content {
    padding-bottom: 0;
  }
}
</style>
