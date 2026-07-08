<template>
  <AdminLayout>
    <div class="space-y-6">
      
      <!-- Top controls -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-gray-800 dark:text-white/90">Compras</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Historial y registro de facturas de compras de inventario</p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Search -->
          <div class="relative w-full sm:w-60">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por factura o proveedor..."
              class="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <!-- Add Button -->
          <router-link
            to="/compras/nueva"
            class="flex items-center gap-2 rounded-xl bg-brand-500 px-4 h-10 text-sm font-semibold text-white shadow-theme-xs hover:bg-brand-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Registrar Compra
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-24">
        <svg class="animate-spin h-8 w-8 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <template v-else>
        <!-- Table -->
        <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-theme-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th class="px-5 py-3 text-left"><span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Factura</span></th>
                  <th class="px-5 py-3 text-left"><span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</span></th>
                  <th class="px-5 py-3 text-left"><span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Proveedor</span></th>
                  <th class="px-5 py-3 text-left"><span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Forma de Pago</span></th>
                  <th class="px-5 py-3 text-right"><span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</span></th>
                  <th class="px-5 py-3 text-center"><span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Detalles</span></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-if="!filteredCompras.length">
                  <td colspan="6" class="px-5 py-8 text-center text-gray-400 dark:text-gray-500">
                    No se encontraron compras registradas.
                  </td>
                </tr>
                <tr v-for="compra in filteredCompras" :key="compra.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td class="px-5 py-4">
                    <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ compra.factura }}</span>
                  </td>
                  <td class="px-5 py-4">
                    <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(compra.fecha) }}</span>
                  </td>
                  <td class="px-5 py-4">
                    <span class="text-sm text-gray-800 dark:text-gray-200">{{ compra.proveedor }}</span>
                  </td>
                  <td class="px-5 py-4">
                    <span class="text-sm text-gray-500 dark:text-gray-400">{{ compra.forma_pago }}</span>
                  </td>
                  <td class="px-5 py-4 text-right">
                    <span class="text-sm font-bold text-gray-800 dark:text-white">{{ formatCurrency(compra.total) }}</span>
                  </td>
                  <td class="px-5 py-4 text-center">
                    <button
                      @click="viewDetails(compra)"
                      class="text-brand-500 hover:text-brand-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 inline-flex items-center justify-center"
                      title="Ver detalles de la compra"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- Details Modal -->
      <Teleport to="body">
        <div v-if="selectedCompra" class="fixed inset-0 z-[999999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" @click.self="selectedCompra = null">
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Factura #{{ selectedCompra.factura }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Proveedor: {{ selectedCompra.proveedor }} | Pago: {{ selectedCompra.forma_pago }}</p>
              </div>
              <button @click="selectedCompra = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <!-- Modal Content -->
            <div class="p-6 max-h-[400px] overflow-y-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                    <th class="px-4 py-2 text-left"><span class="text-xs font-bold text-gray-400">Producto</span></th>
                    <th class="px-4 py-2 text-right"><span class="text-xs font-bold text-gray-400">Cant.</span></th>
                    <th class="px-4 py-2 text-right"><span class="text-xs font-bold text-gray-400">P. Unitario</span></th>
                    <th class="px-4 py-2 text-right"><span class="text-xs font-bold text-gray-400">IVA</span></th>
                    <th class="px-4 py-2 text-right"><span class="text-xs font-bold text-gray-400">Desc.</span></th>
                    <th class="px-4 py-2 text-right"><span class="text-xs font-bold text-gray-400">Total</span></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr v-for="item in selectedCompra.items" :key="item.id">
                    <td class="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 font-semibold">{{ item.producto }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-right">{{ item.cantidad }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-right">{{ formatCurrency(item.precio_unitario) }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-right">{{ item.iva }}%</td>
                    <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-right">{{ formatCurrency(item.descuento) }}</td>
                    <td class="px-4 py-3 text-sm text-gray-800 dark:text-white font-bold text-right">
                      {{ formatCurrency((item.cantidad * item.precio_unitario * (1 + item.iva / 100)) - item.descuento) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Modal Footer -->
            <div class="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 flex justify-between items-center">
              <span class="text-sm font-semibold text-gray-500 dark:text-gray-400">Gran Total Factura</span>
              <span class="text-xl font-black text-brand-500">{{ formatCurrency(selectedCompra.total) }} MXN</span>
            </div>
          </div>
        </div>
      </Teleport>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import axios from 'axios'

const compras = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCompra = ref(null)

const fetchCompras = async () => {
  loading.value = true
  try {
    const API_URL = import.meta.env.VITE_API_URL || ''
    const res = await axios.get(`${API_URL}/api/compras`)
    compras.value = res.data
  } catch (error) {
    console.error('Error fetching compras:', error)
  } finally {
    loading.value = false
  }
}

const filteredCompras = computed(() => {
  if (!searchQuery.value.trim()) return compras.value
  const q = searchQuery.value.toLowerCase()
  return compras.value.filter(c => 
    c.factura.toLowerCase().includes(q) || 
    c.proveedor.toLowerCase().includes(q)
  )
})

const formatDate = (isoString) => {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: '2-digit' })
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(val || 0)
}

const viewDetails = (compra) => {
  selectedCompra.value = compra
}

onMounted(fetchCompras)
</script>
