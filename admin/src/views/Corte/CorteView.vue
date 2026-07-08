<template>
  <AdminLayout>
    <div class="space-y-6 sm:space-y-8">
      
      <!-- Header Row -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-gray-800 dark:text-white/90">Corte de Caja</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Resumen diario de ingresos por método de pago y canal</p>
        </div>

        <!-- Date Filter -->
        <div class="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-theme-xs max-w-xs">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          <flat-pickr
            v-model="selectedDate"
            :config="dateConfig"
            class="bg-transparent border-none text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-0 cursor-pointer w-28 text-center"
            placeholder="Seleccionar fecha"
          />
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
        <!-- Resumen Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <!-- Efectivo -->
          <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 flex items-center gap-4">
            <div class="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Efectivo</p>
              <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{{ formatCurrency(resumen.efectivo) }}</h3>
            </div>
          </div>

          <!-- Tarjetas -->
          <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 flex items-center gap-4">
            <div class="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tarjetas</p>
              <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{{ formatCurrency(resumen.tarjetas) }}</h3>
            </div>
          </div>

          <!-- Transferencias -->
          <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 flex items-center gap-4">
            <div class="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transferencias</p>
              <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{{ formatCurrency(resumen.transferencias) }}</h3>
            </div>
          </div>

          <!-- Sitio Web -->
          <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 flex items-center gap-4">
            <div class="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9c1.657 0 3 4.03 3 9s-1.343 9-3 9m0-18c-1.657 0-3 4.03-3 9s1.343 9 3 9m-9-9h18"/></svg>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sitio Web</p>
              <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{{ formatCurrency(resumen.sitio_web) }}</h3>
            </div>
          </div>

        </div>

        <!-- Total de Venta General -->
        <div class="rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.01] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-gray-800 dark:text-white">Ingreso Neto Total</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">Suma total de ingresos recaudados en este día (excluye cancelados/devueltos)</p>
          </div>
          <h1 class="text-3xl font-black text-emerald-600 dark:text-emerald-400">{{ formatCurrency(resumen.total) }} MXN</h1>
        </div>

        <!-- Detalle de Movimientos / Ventas -->
        <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-theme-sm overflow-hidden">
          <div class="p-5 border-b border-gray-50 dark:border-gray-700">
            <h2 class="text-base font-bold text-gray-800 dark:text-white">Ventas del Día</h2>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th class="px-5 py-3 text-left"><span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Orden</span></th>
                  <th class="px-5 py-3 text-left"><span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Cliente</span></th>
                  <th class="px-5 py-3 text-left"><span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Método de Pago</span></th>
                  <th class="px-5 py-3 text-left"><span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Procedencia</span></th>
                  <th class="px-5 py-3 text-right"><span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</span></th>
                  <th class="px-5 py-3 text-right"><span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Hora</span></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-if="!ventas.length">
                  <td colspan="6" class="px-5 py-8 text-center text-gray-400 dark:text-gray-500">
                    No se registraron ventas en este día.
                  </td>
                </tr>
                <tr v-for="venta in ventas" :key="venta.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td class="px-5 py-4">
                    <router-link :to="`/pedidos/${venta.id}`" class="text-sm font-semibold text-brand-500 hover:underline">
                      #{{ venta.orden }}
                    </router-link>
                  </td>
                  <td class="px-5 py-4">
                    <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ venta.nombre }}</span>
                  </td>
                  <td class="px-5 py-4">
                    <span class="text-sm text-gray-500 dark:text-gray-400">{{ venta.metodo_pago }}</span>
                  </td>
                  <td class="px-5 py-4">
                    <span v-if="venta.canal_venta === 'Tienda en Línea'" class="rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                      Página Web
                    </span>
                    <span v-else class="rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
                      POS / Mostrador
                    </span>
                  </td>
                  <td class="px-5 py-4 text-right">
                    <span class="text-sm font-bold text-gray-800 dark:text-white">{{ formatCurrency(venta.total) }}</span>
                  </td>
                  <td class="px-5 py-4 text-right">
                    <span class="text-xs text-gray-400 dark:text-gray-500 font-mono">{{ formatTime(venta.created_at) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </template>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Spanish } from 'flatpickr/dist/l10n/es.js'
import axios from 'axios'

// Configuración de fecha por defecto (Hoy)
const getTodayDateString = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().split('T')[0]
}

const selectedDate = ref(getTodayDateString())
const loading = ref(true)

const dateConfig = {
  locale: Spanish,
  dateFormat: 'Y-m-d',
  maxDate: 'today',
  altInput: true,
  altFormat: 'd/m/Y',
}

const resumen = ref({
  efectivo: 0,
  tarjetas: 0,
  transferencias: 0,
  sitio_web: 0,
  total: 0
})

const ventas = ref([])

const fetchCorte = async () => {
  if (!selectedDate.value) return
  loading.value = true
  try {
    const API_URL = import.meta.env.VITE_API_URL || ''
    const res = await axios.get(`${API_URL}/api/corte?fecha=${selectedDate.value}`)
    resumen.value = res.data.resumen
    ventas.value = res.data.ventas
  } catch (error) {
    console.error('Error fetching corte:', error)
  } finally {
    loading.value = false
  }
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(val || 0)
}

const formatTime = (isoString) => {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

watch(selectedDate, fetchCorte)
onMounted(fetchCorte)
</script>
