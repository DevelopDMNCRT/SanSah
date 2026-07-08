<template>
  <AdminLayout>
    <div class="space-y-6 max-w-6xl mx-auto pb-12">
      <!-- Title row -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800 dark:text-white/90">Registrar Nueva Compra</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ingresa los datos de la factura y los productos para sumar al inventario</p>
        </div>
        <router-link to="/compras" class="px-4 py-2 text-sm font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Cancelar
        </router-link>
      </div>

      <!-- Main Form Card -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-theme-sm p-6 space-y-6">
        
        <!-- Header details -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Número de Factura <span class="text-error-500">*</span></label>
            <input
              v-model="formData.factura"
              type="text"
              placeholder="Ej. FAC-10293"
              class="w-full h-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Proveedor <span class="text-error-500">*</span></label>
            <input
              v-model="formData.proveedor"
              type="text"
              placeholder="Ej. Distribuidora del Norte"
              class="w-full h-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Forma de Pago <span class="text-error-500">*</span></label>
            <select
              v-model="formData.formaPago"
              class="w-full h-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Fecha de Compra <span class="text-error-500">*</span></label>
            <flat-pickr
              v-model="formData.fecha"
              :config="dateConfig"
              class="w-full h-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
            />
          </div>
        </div>

        <!-- Items Table Section -->
        <div class="space-y-4">
          <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-6">
            <h3 class="text-base font-bold text-gray-800 dark:text-white">Productos en Factura</h3>
            <button
              @click="addItemRow"
              type="button"
              class="text-sm font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
            >
              + Agregar Producto
            </button>
          </div>

          <!-- Table -->
          <div class="border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50/30 dark:bg-white/[0.01]">
            <div class="overflow-visible">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <th class="px-4 py-2 text-left w-16"><span class="text-xs font-bold text-gray-400 uppercase">Cant.</span></th>
                    <th class="px-4 py-2 text-left"><span class="text-xs font-bold text-gray-400 uppercase">Producto</span></th>
                    <th class="px-4 py-2 text-right w-36"><span class="text-xs font-bold text-gray-400 uppercase">Precio Unitario</span></th>
                    <th class="px-4 py-2 text-right w-24"><span class="text-xs font-bold text-gray-400 uppercase">IVA (%)</span></th>
                    <th class="px-4 py-2 text-right w-28"><span class="text-xs font-bold text-gray-400 uppercase">Descuento</span></th>
                    <th class="px-4 py-2 text-right w-32"><span class="text-xs font-bold text-gray-400 uppercase">Total</span></th>
                    <th class="px-4 py-2 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr v-if="!formData.items.length">
                    <td colspan="7" class="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                      No hay productos agregados. Usa "+ Agregar Producto" para comenzar.
                    </td>
                  </tr>
                  
                  <tr v-for="(item, index) in formData.items" :key="index" class="relative hover:bg-gray-50/30 dark:hover:bg-white/[0.01]">
                    <!-- Cantidad -->
                    <td class="px-2 py-3">
                      <input
                        v-model.number="item.cantidad"
                        type="number"
                        min="1"
                        class="w-full h-9 text-center rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-2 text-sm text-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </td>

                    <!-- Producto Autocomplete -->
                    <td class="px-2 py-3 relative">
                      <div class="flex items-center gap-1.5">
                        <div class="relative flex-1">
                          <input
                            v-model="item.producto"
                            type="text"
                            placeholder="Buscar producto..."
                            @input="onSearchInput(index)"
                            @focus="onSearchFocus(index)"
                            @blur="onSearchBlur(index)"
                            class="w-full h-9 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm text-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                          />
                          
                          <!-- Autocomplete Dropdown -->
                          <div
                            v-if="item.showDropdown && item.searchResults.length"
                            class="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-50 divide-y divide-gray-100 dark:divide-gray-800"
                          >
                            <button
                              v-for="p in item.searchResults"
                              :key="p.id"
                              type="button"
                              @mousedown="selectProduct(index, p)"
                              class="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
                            >
                              {{ p.nombre }} <span class="text-gray-400 font-normal">({{ p.tienda || 'General' }} - ${{ p.precio }} MXN)</span>
                            </button>
                          </div>
                        </div>

                        <!-- Pill Status -->
                        <span
                          v-if="item.productId"
                          class="shrink-0 px-2 py-1 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                          title="Se sumará al stock existente"
                        >
                          Existente
                        </span>
                        

                      </div>

                      <!-- Variation Selector if variable product -->
                      <div v-if="item.isVariable && item.variaciones?.length" class="mt-2 flex items-center gap-2">
                        <span class="text-[11px] text-gray-400 font-bold uppercase">Variación:</span>
                        <select
                          v-model="item.variationId"
                          class="h-7 rounded border border-gray-200 dark:border-gray-700 bg-transparent px-2 text-xs text-gray-800 dark:text-white"
                        >
                          <option :value="null">Selecciona...</option>
                          <option v-for="v in item.variaciones" :key="v.id" :value="v.id">
                            {{ v.valor }} (Stock: {{ v.stock || 0 }})
                          </option>
                        </select>
                      </div>
                    </td>

                    <!-- Precio Unitario -->
                    <td class="px-2 py-3 text-right">
                      <div class="relative">
                        <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                        <input
                          v-model.number="item.precioUnitario"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          class="w-full h-9 text-right rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent pl-6 pr-2 text-sm text-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                    </td>

                    <!-- IVA -->
                    <td class="px-2 py-3 text-right">
                      <input
                        v-model.number="item.iva"
                        type="number"
                        min="0"
                        placeholder="16"
                        class="w-full h-9 text-center rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-2 text-sm text-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </td>

                    <!-- Descuento -->
                    <td class="px-2 py-3 text-right">
                      <div class="relative">
                        <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                        <input
                          v-model.number="item.descuento"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          class="w-full h-9 text-right rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent pl-6 pr-2 text-sm text-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                    </td>

                    <!-- Line Total -->
                    <td class="px-2 py-3 text-right">
                      <span class="text-sm font-semibold text-gray-800 dark:text-white">
                        {{ formatCurrency(calculateRowTotal(item)) }}
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="px-2 py-3 text-center">
                      <button @click="removeRow(index)" type="button" class="text-gray-400 hover:text-error-500 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Totals Footer -->
            <div class="flex justify-end border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50/50 dark:bg-white/[0.01]">
              <div class="w-full max-w-xs space-y-2 text-sm">
                <div class="flex justify-between items-center">
                  <span class="font-medium text-gray-500 dark:text-gray-400">SUBTOTAL</span>
                  <span class="font-semibold text-gray-800 dark:text-white/90">{{ formatCurrency(totalSubtotal) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="font-medium text-gray-500 dark:text-gray-400">IVA</span>
                  <span class="font-semibold text-gray-800 dark:text-white/90">{{ formatCurrency(totalIva) }}</span>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span class="text-base font-bold text-gray-800 dark:text-white">Total Factura</span>
                  <span class="text-lg font-black text-brand-500">{{ formatCurrency(grandTotal) }} MXN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Submission Buttons -->
        <div class="flex justify-end gap-3 pt-4">
          <router-link to="/compras" class="px-5 py-2.5 text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancelar
          </router-link>
          <button
            @click="submitCompra"
            :disabled="submitting"
            type="button"
            class="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-theme-xs hover:bg-brand-600 transition-colors disabled:opacity-50"
          >
            <span v-if="submitting">Guardando...</span>
            <span v-else>Guardar Compra</span>
          </button>
        </div>

      </div>
    </div>

    <!-- New Products Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showSuccessModal" class="fixed inset-0 z-[999999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" @click.self="closeSuccessModal">
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800 overflow-hidden animate-modal-in">
          <div class="p-6 text-center">
            <div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-amber-50 dark:bg-amber-500/10 mb-4">
              <svg class="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Productos Creados</h3>
            
            <p class="text-sm text-gray-600 dark:text-gray-400">
              <span class="font-bold text-brand-500">{{ newProductsCount }}</span> {{ newProductsCount === 1 ? 'producto' : 'productos' }} de la nueva compra no se encuentran en nuestra base de datos y han sido creados en su forma más básica.
            </p>
          </div>
          
          <div class="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 flex gap-3">
            <button
              @click="closeSuccessModal"
              type="button"
              class="flex-1 py-2.5 text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Aceptar
            </button>
            <button
              @click="goToProducts"
              type="button"
              class="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl bg-brand-500 hover:bg-brand-600 transition-colors shadow-theme-xs"
            >
              Ir a productos
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Spanish } from 'flatpickr/dist/l10n/es.js'
import axios from 'axios'

const router = useRouter()

const dateConfig = {
  locale: Spanish,
  dateFormat: 'Y-m-d',
}

const formData = reactive({
  factura: '',
  proveedor: '',
  formaPago: 'Efectivo',
  fecha: new Date().toISOString().split('T')[0],
  items: []
})

const catalogProducts = ref([])
const textCategorias = ref([])
const categorias = ref([])
const loading = ref(true)
const submitting = ref(false)

const activeRowIndex = ref(null)

const showSuccessModal = ref(false)
const newProductsCount = ref(0)

const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push('/compras')
}

const goToProducts = () => {
  showSuccessModal.value = false
  router.push('/productos')
}

const fetchInitialData = async () => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || ''
    
    // Fetch products
    const prodRes = await axios.get(`${API_URL}/api/products`)
    catalogProducts.value = prodRes.data

    // Fetch categories
    const catRes = await axios.get(`${API_URL}/api/categorias`)
    categorias.value = catRes.data

  } catch (error) {
    console.error('Error fetching initial data for compras:', error)
  } finally {
    loading.value = false
  }
}

const addItemRow = () => {
  formData.items.push({
    producto: '',
    cantidad: 1,
    precioUnitario: 0,
    iva: 16,
    descuento: 0,
    productId: null,
    variationId: null,
    isVariable: false,
    variaciones: [],
    showDropdown: false,
    searchResults: []
  })
}

const removeRow = (index) => {
  formData.items.splice(index, 1)
}

// Autocomplete Logic
const onSearchInput = (index) => {
  const item = formData.items[index]
  const q = item.producto.toLowerCase().trim()
  
  // Clear IDs if they edit the name
  item.productId = null
  item.variationId = null
  item.isVariable = false
  item.variaciones = []

  if (q.length < 1) {
    item.searchResults = []
    return
  }

  // Filter local catalog by similarity
  item.searchResults = catalogProducts.value.filter(p => 
    (p.nombre || '').toLowerCase().includes(q)
  ).slice(0, 8)
  item.showDropdown = true
}

const onSearchFocus = (index) => {
  formData.items[index].showDropdown = true
}

const onSearchBlur = (index) => {
  // Delay slightly to allow click event on dropdown to fire first
  setTimeout(() => {
    formData.items[index].showDropdown = false
  }, 200)
}

const selectProduct = (index, product) => {
  const item = formData.items[index]
  item.producto = product.nombre
  item.productId = product.id
  item.precioUnitario = product.costo_real || product.precio || 0
  item.isVariable = product.es_variable
  item.variaciones = product.variaciones || []
  
  if (product.es_variable && product.variaciones?.length > 0) {
    item.variationId = product.variaciones[0].id
  } else {
    item.variationId = null
  }
  
  item.searchResults = []
  item.showDropdown = false
}



// Totals Calculation
const calculateRowTotal = (item) => {
  const qty = Number(item.cantidad) || 0
  const price = Number(item.precioUnitario) || 0
  const disc = Number(item.descuento) || 0
  const sub = (qty * price) - disc
  return sub * (1 + (Number(item.iva) || 0) / 100)
}

const totalSubtotal = computed(() => {
  return formData.items.reduce((sum, item) => {
    const qty = Number(item.cantidad) || 0
    const price = Number(item.precioUnitario) || 0
    const disc = Number(item.descuento) || 0
    return sum + ((qty * price) - disc)
  }, 0)
})

const totalIva = computed(() => {
  return formData.items.reduce((sum, item) => {
    const qty = Number(item.cantidad) || 0
    const price = Number(item.precioUnitario) || 0
    const disc = Number(item.descuento) || 0
    const sub = (qty * price) - disc
    return sum + (sub * (Number(item.iva) || 0) / 100)
  }, 0)
})

const grandTotal = computed(() => {
  return totalSubtotal.value + totalIva.value
})

const formatCurrency = (val) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(val || 0)
}

// Submission
const submitCompra = async () => {
  if (!formData.factura.trim() || !formData.proveedor.trim()) {
    alert('Por favor completa los campos de factura y proveedor.')
    return
  }

  if (!formData.items.length) {
    alert('Agrega al menos un producto a la factura.')
    return
  }

  submitting.value = true
  try {
    const API_URL = import.meta.env.VITE_API_URL || ''
    
    const payload = {
      factura: formData.factura,
      fecha: formData.fecha,
      proveedor: formData.proveedor,
      formaPago: formData.formaPago,
      total: grandTotal.value,
      items: formData.items.map(item => ({
        producto: item.producto,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        iva: item.iva,
        descuento: item.descuento,
        productId: item.productId,
        variationId: item.variationId
      }))
    }

    const res = await axios.post(`${API_URL}/api/compras`, payload)
    const nuevosCount = res.data.nuevosProductosCreados || 0
    
    if (nuevosCount > 0) {
      newProductsCount.value = nuevosCount
      showSuccessModal.value = true
    } else {
      router.push('/compras')
    }

  } catch (error) {
    console.error('Error saving purchase:', error)
    alert(error.response?.data?.error || 'Error al guardar la compra')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await fetchInitialData()
  addItemRow()
})
</script>

<style scoped>
.animate-modal-in {
  animation: modal-in 0.2s ease-out;
}
@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
