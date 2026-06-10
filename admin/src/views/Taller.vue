<template>
  <AdminLayout>
    <div class="space-y-6 h-full flex flex-col bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Órdenes del Taller</h1>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="hidden sm:flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-success-500"></span>
            </span>
            Monitoreo Activo
          </div>
          <button @click="abrirNuevoServicio" class="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo Servicio
          </button>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden mt-2">
        
        <!-- ================= COL 1: RECIBIDO ================= -->
        <div class="flex flex-col rounded-2xl bg-[#F8F9FA] dark:bg-gray-800/40 p-4 border border-gray-100 dark:border-gray-800 h-full overflow-hidden">
          <!-- Column Header -->
          <div class="flex items-center justify-between mb-5 px-1">
            <div class="flex items-center gap-2.5">
              <div class="text-red-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h2 class="font-extrabold text-[#2D3A4A] dark:text-white text-lg">Recibido</h2>
            </div>
            <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg px-2.5 py-1 flex items-center justify-center">
              <span class="text-[#2D3A4A] dark:text-white text-sm font-black">{{ recibidos.length }}</span>
            </div>
          </div>
          
          <!-- Column Body -->
          <div class="flex-1 overflow-y-auto space-y-4 custom-scrollbar px-1 pb-4">
            <div v-if="recibidos.length === 0" class="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 flex items-center justify-center text-center">
              <span class="text-gray-400 font-medium text-sm">Sin órdenes recibidas</span>
            </div>
            
            <!-- Cards -->
            <div v-for="orden in recibidos" :key="orden.id" class="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <!-- Top Row -->
              <div class="flex justify-between items-start gap-2">
                <h3 class="font-bold text-gray-900 dark:text-white text-[17px] leading-tight">{{ orden.cliente }}</h3>
                <div class="bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg px-2 py-1 text-xs font-bold flex items-center gap-1.5 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ orden.fecha }}
                </div>
              </div>
              
              <!-- Badges -->
              <div class="flex flex-wrap gap-2">
                <div class="bg-[#E6F3F2] dark:bg-teal-500/10 text-[#2D5A5A] dark:text-teal-400 border border-[#D0EBE8] dark:border-teal-500/20 rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ orden.bicicleta || 'Bicicleta' }}
                </div>
                <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01M7 11h.01M7 15h.01M11 7h6M11 11h6M11 15h6"/></svg>
                  {{ orden.numero }}
                </div>
              </div>
              
              <!-- Description -->
              <p class="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{{ orden.descripcion }}</p>
              
              <!-- Bottom Row -->
              <div class="mt-1 flex items-center justify-between">
                <span class="text-xl font-black text-gray-900 dark:text-white tracking-tight">${{ orden.costo }}</span>
                <button @click="moverA(orden, 'en_progreso')" class="bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white px-4 py-2 rounded-xl font-bold text-[13px] shadow-sm flex items-center gap-1.5">
                  Trabajar <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= COL 2: EN PROGRESO ================= -->
        <div class="flex flex-col rounded-2xl bg-[#F8F9FA] dark:bg-gray-800/40 p-4 border border-gray-100 dark:border-gray-800 h-full overflow-hidden">
          <div class="flex items-center justify-between mb-5 px-1">
            <div class="flex items-center gap-2.5">
              <div class="text-[#f97316] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              </div>
              <h2 class="font-extrabold text-[#2D3A4A] dark:text-white text-lg">En Progreso</h2>
            </div>
            <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg px-2.5 py-1 flex items-center justify-center">
              <span class="text-[#2D3A4A] dark:text-white text-sm font-black">{{ enProgreso.length }}</span>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto space-y-4 custom-scrollbar px-1 pb-4">
            <div v-if="enProgreso.length === 0" class="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 flex items-center justify-center text-center">
              <span class="text-gray-400 font-medium text-sm">Sin órdenes en progreso</span>
            </div>
            
            <div v-for="orden in enProgreso" :key="orden.id" class="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start gap-2">
                <h3 class="font-bold text-gray-900 dark:text-white text-[17px] leading-tight">{{ orden.cliente }}</h3>
                <div class="bg-orange-50 dark:bg-orange-500/10 text-orange-500 rounded-lg px-2 py-1 text-xs font-bold flex items-center gap-1.5 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ orden.fecha }}
                </div>
              </div>
              
              <div class="flex flex-wrap gap-2">
                <div class="bg-[#E6F3F2] dark:bg-teal-500/10 text-[#2D5A5A] dark:text-teal-400 border border-[#D0EBE8] dark:border-teal-500/20 rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ orden.bicicleta || 'Bicicleta' }}
                </div>
                <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01M7 11h.01M7 15h.01M11 7h6M11 11h6M11 15h6"/></svg>
                  {{ orden.numero }}
                </div>
              </div>
              
              <p class="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{{ orden.descripcion }}</p>
              
              <div class="mt-1 flex items-center justify-between">
                <span class="text-xl font-black text-gray-900 dark:text-white tracking-tight">${{ orden.costo }}</span>
                <button @click="moverA(orden, 'para_entrega')" class="bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white px-4 py-2 rounded-xl font-bold text-[13px] shadow-sm flex items-center gap-1.5">
                  Finalizar <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= COL 3: PARA ENTREGA ================= -->
        <div class="flex flex-col rounded-2xl bg-[#F8F9FA] dark:bg-gray-800/40 p-4 border border-gray-100 dark:border-gray-800 h-full overflow-hidden">
          <div class="flex items-center justify-between mb-5 px-1">
            <div class="flex items-center gap-2.5">
              <div class="text-green-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <h2 class="font-extrabold text-[#2D3A4A] dark:text-white text-lg">Para Entrega</h2>
            </div>
            <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg px-2.5 py-1 flex items-center justify-center">
              <span class="text-[#2D3A4A] dark:text-white text-sm font-black">{{ paraEntrega.length }}</span>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto space-y-4 custom-scrollbar px-1 pb-4">
            <div v-if="paraEntrega.length === 0" class="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 flex items-center justify-center text-center">
              <span class="text-gray-400 font-medium text-sm">Sin órdenes para entregar</span>
            </div>
            
            <div v-for="orden in paraEntrega" :key="orden.id" class="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start gap-2">
                <h3 class="font-bold text-gray-900 dark:text-white text-[17px] leading-tight">{{ orden.cliente }}</h3>
                <div class="bg-green-50 dark:bg-green-500/10 text-green-500 rounded-lg px-2 py-1 text-xs font-bold flex items-center gap-1.5 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ orden.fecha }}
                </div>
              </div>
              
              <div class="flex flex-wrap gap-2">
                <div class="bg-[#E6F3F2] dark:bg-teal-500/10 text-[#2D5A5A] dark:text-teal-400 border border-[#D0EBE8] dark:border-teal-500/20 rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ orden.bicicleta || 'Bicicleta' }}
                </div>
                <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01M7 11h.01M7 15h.01M11 7h6M11 11h6M11 15h6"/></svg>
                  {{ orden.numero }}
                </div>
              </div>
              
              <p class="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{{ orden.descripcion }}</p>
              
              <div class="mt-1 flex items-center justify-between">
                <span class="text-xl font-black text-gray-900 dark:text-white tracking-tight">${{ orden.costo }}</span>
                <button @click="solicitarEntrega(orden)" class="bg-green-500 hover:bg-green-600 active:scale-95 transition-all text-white px-4 py-2 rounded-xl font-bold text-[13px] shadow-sm flex items-center gap-1.5">
                  Entregado <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal de Confirmación -->
    <Modal v-if="showModal" :fullScreenBackdrop="true" @close="cancelarEntrega">
      <template #body>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100 dark:border-gray-700 text-center">
          <div class="w-16 h-16 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center mx-auto mb-4 text-success-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h2 class="text-xl font-bold text-gray-800 dark:text-white/90 mb-2">¿Marcar como Entregado?</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Vas a finalizar la orden <strong class="text-gray-800 dark:text-gray-200">{{ ordenSeleccionada?.numero }}</strong> de <strong class="text-gray-800 dark:text-gray-200">{{ ordenSeleccionada?.cliente }}</strong>. Esta acción la quitará del tablero Kanban.
          </p>
          <div class="flex items-center gap-3 w-full">
            <button @click="cancelarEntrega" class="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancelar
            </button>
            <button @click="confirmarEntrega" class="flex-1 py-2.5 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors">
              Confirmar
            </button>
          </div>
        </div>
      </template>
    </Modal>

    <!-- Modal Nuevo Servicio -->
    <Modal v-if="showNuevoServicioModal" :fullScreenBackdrop="true" @close="cerrarNuevoServicio">
      <template #body>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl border border-gray-100 dark:border-gray-700 relative">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white/90">Nuevo Servicio</h2>
            <button @click="cerrarNuevoServicio" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          
          <form @submit.prevent="guardarNuevoServicio" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">A nombre de:</label>
              <input v-model="nuevoServicioForm.cliente" type="text" required class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" placeholder="Ej. Juan Pérez">
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bicicleta / Marca:</label>
                <input 
                  v-model="nuevoServicioForm.bicicleta" 
                  type="text" 
                  required 
                  class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" 
                  placeholder="Ej. Trek Marlin 7, Specialized Rockhopper..."
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono:</label>
                <input v-model="nuevoServicioForm.telefono" @input="nuevoServicioForm.telefono = nuevoServicioForm.telefono.replace(/[^0-9]/g, '').slice(0, 10)" type="text" maxlength="10" minlength="10" pattern="[0-9]{10}" title="Debe contener exactamente 10 dígitos" required class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" placeholder="Ej. 5512345678">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción del servicio:</label>
              <textarea v-model="nuevoServicioForm.descripcion" required rows="3" class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" placeholder="Detalles de la reparación o mantenimiento..."></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Costo Estimado ($):</label>
              <input v-model="nuevoServicioForm.costo" type="number" min="0" step="0.01" required class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" placeholder="0.00">
            </div>

            <div class="pt-4 flex items-center justify-end gap-3">
              <button type="button" @click="cerrarNuevoServicio" class="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Cancelar
              </button>
              <button type="submit" class="px-4 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors">
                Guardar Servicio
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import Modal from '@/components/ui/Modal.vue';

const router = useRouter();

// Productos para el datalist
const productosList = ref([]);
const fetchProductos = async () => {
  try {
    const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/products');
    if (res.ok) productosList.value = await res.json();
  } catch (e) {
    console.error('Error al cargar productos:', e);
  }
};

// ── Estado Real ─────────────────────────────────────────────────────────────
const ordenes = ref([]);
const loading = ref(true);

const fetchOrdenes = async () => {
  loading.value = true;
  try {
    const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/taller');
    if (res.ok) ordenes.value = await res.json();
  } catch (e) {
    console.error('Error al cargar órdenes de taller:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProductos();
  fetchOrdenes();
});

const recibidos = computed(() => ordenes.value.filter(o => o.estado === 'recibido'));
const enProgreso = computed(() => ordenes.value.filter(o => o.estado === 'en_progreso'));
const paraEntrega = computed(() => ordenes.value.filter(o => o.estado === 'para_entrega'));

// ── Mover Kanban ────────────────────────────────────────────────────────────
const moverA = async (orden, nuevoEstado) => {
  // Optimistic update
  const index = ordenes.value.findIndex(o => o.id === orden.id);
  const estadoAnterior = orden.estado;
  if (index !== -1) ordenes.value[index].estado = nuevoEstado;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/taller/${orden.id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    });
    if (!res.ok) throw new Error();
  } catch (e) {
    console.error('Error al actualizar estado:', e);
    // Rollback
    if (index !== -1) ordenes.value[index].estado = estadoAnterior;
    alert('No se pudo actualizar el estado.');
  }
};

// ── Confirmación Entrega ────────────────────────────────────────────────────
const showModal = ref(false);
const ordenSeleccionada = ref(null);

const solicitarEntrega = (orden) => {
  ordenSeleccionada.value = orden;
  showModal.value = true;
};

const cancelarEntrega = () => {
  showModal.value = false;
  ordenSeleccionada.value = null;
};

const confirmarEntrega = async () => {
  if (!ordenSeleccionada.value) return;
  const orden = ordenSeleccionada.value;

  try {
    // Delete from DB since it's finished
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/taller/${orden.id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();

    // Guardar para que el POS lo lea
    localStorage.setItem('sansah_pending_service', JSON.stringify({
      id: orden.id,
      cliente: orden.cliente,
      bicicleta: orden.bicicleta || 'Servicio General',
      descripcion: orden.descripcion,
      costo: orden.costo
    }));

    // Remove from UI
    ordenes.value = ordenes.value.filter(o => o.id !== orden.id);
    
    showModal.value = false;
    ordenSeleccionada.value = null;
    
    router.push('/pos');
  } catch (e) {
    console.error('Error al confirmar entrega:', e);
    alert('No se pudo finalizar la orden.');
  }
};

// ── Nuevo Servicio ──────────────────────────────────────────────────────────
const showNuevoServicioModal = ref(false);
const guardandoServicio = ref(false);
const nuevoServicioForm = reactive({
  cliente: '',
  bicicleta: '',
  descripcion: '',
  telefono: '',
  costo: ''
});

const abrirNuevoServicio = () => {
  nuevoServicioForm.cliente = '';
  nuevoServicioForm.bicicleta = '';
  nuevoServicioForm.descripcion = '';
  nuevoServicioForm.telefono = '';
  nuevoServicioForm.costo = '';
  showNuevoServicioModal.value = true;
};

const cerrarNuevoServicio = () => {
  showNuevoServicioModal.value = false;
};

const guardarNuevoServicio = async () => {
  if (guardandoServicio.value) return;
  guardandoServicio.value = true;
  
  const ahora = new Date();
  const horas = ahora.getHours().toString().padStart(2, '0');
  const minutos = ahora.getMinutes().toString().padStart(2, '0');
  
  try {
    const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/taller', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente: nuevoServicioForm.cliente,
        bicicleta: nuevoServicioForm.bicicleta,
        descripcion: nuevoServicioForm.descripcion,
        telefono: nuevoServicioForm.telefono,
        costo: nuevoServicioForm.costo,
        fecha: `${horas}:${minutos}`
      })
    });
    
    if (!res.ok) throw new Error();
    const nuevaOrden = await res.json();
    
    ordenes.value.unshift(nuevaOrden); // Agregarlo al principio
    cerrarNuevoServicio();
  } catch (e) {
    console.error('Error al guardar nuevo servicio:', e);
    alert('Error al crear el servicio.');
  } finally {
    guardandoServicio.value = false;
  }
};

// ── Autocomplete Logic (removida — campo libre) ─────────────────────────────
// El campo bicicleta ahora es texto libre, no necesita dropdown
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569; 
}
</style>
