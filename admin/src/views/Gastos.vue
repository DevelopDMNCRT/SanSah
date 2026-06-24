<template>
  <AdminLayout title="Gastos">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <!-- Encabezado / Controles -->
      <div class="flex flex-col lg:flex-row gap-4 items-center bg-white dark:bg-gray-900 p-3 rounded-3xl border border-gray-200 dark:border-gray-800">
        
        <!-- Total -->
        <div class="flex items-center gap-3 shrink-0 px-4 lg:border-r border-gray-100 dark:border-gray-800 w-full lg:w-auto justify-center lg:justify-start">
          <div class="text-center lg:text-left">
            <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Total de Gastos</p>
            <span class="text-2xl font-black text-gray-900 dark:text-white leading-none block">{{ formatCurrency(totalGastos) }}</span>
          </div>
        </div>

        <!-- Filtros y Botón -->
        <div class="flex flex-col md:flex-row gap-3 w-full flex-1">
          <!-- Buscador -->
          <div class="relative w-full flex-1">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input v-model="searchQuery" type="text" placeholder="Buscar concepto o categoría..." class="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent rounded-2xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900 dark:text-white transition-all" />
          </div>
          
          <!-- Categorías -->
          <div class="w-full md:w-56 shrink-0">
            <select v-model="filterCategory" class="block w-full py-3 px-4 bg-gray-50 dark:bg-gray-800 border border-transparent rounded-2xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900 dark:text-white font-medium transition-all">
              <option value="">Todas las Categorías</option>
              <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <!-- Botón -->
          <div class="w-full md:w-auto shrink-0">
            <button @click="openModal()" class="w-full md:w-auto h-[46px] px-6 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex justify-center items-center gap-2 active:scale-95">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              Registrar Gasto
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla de Gastos -->
      <div class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th class="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Fecha</th>
                <th class="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Concepto</th>
                <th class="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoría</th>
                <th class="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Monto</th>
                <th class="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right w-24">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="cargando">
                <td colspan="5" class="py-12 text-center text-gray-500">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    Cargando gastos...
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredGastos.length === 0">
                <td colspan="5" class="py-12 text-center text-gray-500">
                  No hay gastos registrados que coincidan con la búsqueda.
                </td>
              </tr>
              <tr v-else v-for="gasto in filteredGastos" :key="gasto.id" class="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td class="py-4 px-6 text-sm text-gray-500">{{ formatDate(gasto.fecha) }}</td>
                <td class="py-4 px-6">
                  <div class="font-medium text-gray-900 dark:text-white">{{ gasto.concepto }}</div>
                  <div class="text-xs text-gray-500 mt-1" v-if="gasto.notas">{{ gasto.notas }}</div>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                    {{ gasto.categoria }}
                  </span>
                </td>
                <td class="py-4 px-6 text-sm font-bold text-gray-900 dark:text-white text-right">
                  {{ formatCurrency(gasto.monto) }}
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openModal(gasto)" class="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors" title="Editar">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                    </button>
                    <button @click="confirmDelete(gasto)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Eliminar">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Registrar/Editar Gasto -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md" @click.self="closeModal">
        <div class="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-slide-up">
          <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ isEditing ? 'Editar Gasto' : 'Registrar Gasto' }}</h3>
            <button @click="closeModal" class="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Concepto</label>
              <input v-model="form.concepto" type="text" placeholder="Ej. Recibo de luz" class="w-full h-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Monto ($)</label>
              <input v-model="form.monto" type="number" step="0.01" placeholder="0.00" class="w-full h-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Categoría</label>
              <select v-model="form.categoria" class="w-full h-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none">
                <option value="" disabled>Selecciona una categoría</option>
                <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fecha</label>
              <input v-model="form.fecha" type="date" class="w-full h-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notas (Opcional)</label>
              <textarea v-model="form.notas" rows="2" placeholder="Detalles adicionales..." class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"></textarea>
            </div>
          </div>
          <div class="p-6 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
            <button @click="closeModal" class="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Cancelar</button>
            <button @click="saveGasto" :disabled="guardando" class="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm shadow-md hover:bg-brand-600 transition flex items-center gap-2">
              <span v-if="guardando" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ guardando ? 'Guardando...' : 'Guardar Gasto' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import AdminLayout from '@/components/layout/AdminLayout.vue';

const gastos = ref([]);
const cargando = ref(true);
const searchQuery = ref('');
const filterCategory = ref('');

const categorias = ['Servicios', 'Nómina', 'Insumos', 'Mantenimiento', 'Publicidad', 'Otros'];

// Modal State
const showModal = ref(false);
const guardando = ref(false);
const isEditing = ref(false);
const form = ref({ id: null, concepto: '', monto: '', categoria: '', fecha: '', notas: '' });

const fetchGastos = async () => {
  cargando.value = true;
  try {
    const res = await axios.get((import.meta.env.VITE_API_URL || '') + '/api/gastos');
    gastos.value = res.data;
  } catch (error) {
    console.error('Error fetching gastos:', error);
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  fetchGastos();
});

const filteredGastos = computed(() => {
  return gastos.value.filter(g => {
    const matchSearch = g.concepto.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                        g.categoria.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCat = filterCategory.value ? g.categoria === filterCategory.value : true;
    return matchSearch && matchCat;
  });
});

const totalGastos = computed(() => {
  // Opcionalmente se puede filtrar solo los del mes actual.
  return filteredGastos.value.reduce((sum, g) => sum + Number(g.monto), 0);
});

// Modal Logic
const openModal = (gasto = null) => {
  if (gasto) {
    isEditing.value = true;
    form.value = { 
      ...gasto, 
      fecha: gasto.fecha ? new Date(gasto.fecha).toISOString().slice(0, 10) : '' 
    };
  } else {
    isEditing.value = false;
    form.value = { 
      id: null, 
      concepto: '', 
      monto: '', 
      categoria: '', 
      fecha: new Date().toISOString().slice(0, 10), 
      notas: '' 
    };
  }
  showModal.value = true;
  document.body.classList.add('modal-open');
};

const closeModal = () => {
  showModal.value = false;
  document.body.classList.remove('modal-open');
};

const saveGasto = async () => {
  if (!form.value.concepto || !form.value.monto || !form.value.categoria) {
    alert('Llena los campos obligatorios (Concepto, Monto, Categoría)');
    return;
  }

  guardando.value = true;
  try {
    if (isEditing.value) {
      await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/gastos/${form.value.id}`, form.value);
    } else {
      await axios.post((import.meta.env.VITE_API_URL || '') + '/api/gastos', form.value);
    }
    await fetchGastos();
    closeModal();
  } catch (error) {
    console.error('Error saving gasto:', error);
    alert('Hubo un error al guardar el gasto');
  } finally {
    guardando.value = false;
  }
};

const confirmDelete = async (gasto) => {
  if (confirm(`¿Seguro que deseas eliminar el gasto: "${gasto.concepto}"?`)) {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/gastos/${gasto.id}`);
      await fetchGastos();
    } catch (error) {
      console.error('Error deleting gasto:', error);
      alert('Error al eliminar el gasto');
    }
  }
};

const formatCurrency = (val) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
};
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
