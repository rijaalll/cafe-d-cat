<template>
  <div class="modal fade" ref="modalRef" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form @submit.prevent="submitForm">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Edit Produk' : 'Tambah Produk Baru' }}</h5>
            <button type="button" class="btn-close" @click="hide" aria-label="Close" :disabled="form.submitting"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="nama" class="form-label">Nama Produk <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="nama" v-model="form.nama" required>
            </div>
            <div class="mb-3">
              <label for="harga" class="form-label">Harga <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text">Rp</span>
                <input type="number" class="form-control" id="harga" v-model="form.harga" required min="0">
              </div>
            </div>
            <div class="mb-3">
              <label for="kategori" class="form-label">Kategori</label>
              <select class="form-select" id="kategori" v-model="form.kategori_id">
                <option :value="null">-- Pilih Kategori --</option>
                <option v-for="kategori in categories" :key="kategori.id" :value="kategori.id">
                  {{ kategori.nama }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="image" class="form-label">Gambar Produk</label>
              <input type="file" class="form-control" id="image" @change="handleFileChange" accept="image/*">
            </div>
            
            <div v-if="imagePreviewUrl" class="mb-3 text-center">
                <p class="mb-1">Pratinjau Gambar:</p>
                <img :src="imagePreviewUrl" class="img-thumbnail" style="max-width: 150px; max-height: 150px;" alt="Image Preview"/>
            </div>
             <small v-else-if="isEditMode && form.existing_image_url" class="form-text text-muted">
                Gambar saat ini: <a :href="form.existing_image_url" target="_blank">Lihat Gambar</a>.
              </small>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="hide" :disabled="form.submitting">Batal</button>
            <button type="submit" class="btn btn-primary" :disabled="form.submitting">
              <span v-if="form.submitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span v-else>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, reactive } from 'vue';
import { Modal } from 'bootstrap';
import ApiService from '../services/ApiService';

// Props and Emits
const props = defineProps({
  produk: {
    type: Object,
    default: null
  }
});
const emit = defineEmits(['saved']);

// Refs
const modalRef = ref(null);
let modalInstance = null;
const categories = ref([]);
const imagePreviewUrl = ref(null);

// Reactive State
const form = reactive({
  id: null,
  nama: '',
  harga: '',
  kategori_id: null,
  imageFile: null,
  existing_image_url: null,
  submitting: false,
});
const isEditMode = ref(false);

// Lifecycle Hooks
onMounted(() => {
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value);
    // Reset form saat modal ditutup
    modalRef.value.addEventListener('hidden.bs.modal', resetForm);
  }
  fetchCategories();
});

// Watchers
watch(() => props.produk, (newVal) => {
  if (newVal) {
    isEditMode.value = true;
    form.id = newVal.id;
    form.nama = newVal.nama;
    form.harga = newVal.harga;
    form.kategori_id = newVal.kategori_id;
    form.existing_image_url = newVal.image_url;
  } else {
    isEditMode.value = false;
  }
});

// Methods
const fetchCategories = async () => {
  try {
    const response = await ApiService.getKategori();
    categories.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil kategori:", error);
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.imageFile = file;
    // Buat URL untuk pratinjau
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    form.imageFile = null;
    imagePreviewUrl.value = null;
  }
};

const submitForm = async () => {
  form.submitting = true;
  const formData = new FormData();
  formData.append('nama', form.nama);
  formData.append('harga', form.harga);
  if (form.kategori_id) {
    formData.append('kategori_id', form.kategori_id);
  }
  if (form.imageFile) {
    formData.append('image', form.imageFile);
  }
  // Penting untuk backend: kirim URL gambar lama agar backend tahu jika tidak ada gambar baru
  if (isEditMode.value && form.existing_image_url) {
    formData.append('existing_image_url', form.existing_image_url);
  }

  try {
    if (isEditMode.value) {
      await ApiService.updateProduk(form.id, formData);
      alert('Produk berhasil diperbarui!');
    } else {
      await ApiService.addProduk(formData);
      alert('Produk berhasil ditambahkan!');
    }
    emit('saved');
    hide();
  } catch (error) {
    alert('Terjadi kesalahan saat menyimpan produk.');
  } finally {
    form.submitting = false;
  }
};

const resetForm = () => {
    isEditMode.value = false;
    form.id = null;
    form.nama = '';
    form.harga = '';
    form.kategori_id = null;
    form.imageFile = null;
    form.existing_image_url = null;
    form.submitting = false;
    imagePreviewUrl.value = null;
    // Reset file input
    const fileInput = document.getElementById('image');
    if(fileInput) fileInput.value = '';
};

const show = () => modalInstance?.show();
const hide = () => modalInstance?.hide();

defineExpose({ show, hide });
</script>
