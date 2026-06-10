<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">

      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Inventario</h1>
        
        <div class="flex items-center gap-3">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input v-model="busqueda" type="text" placeholder="Buscar producto..."
              class="pl-9 pr-4 py-2 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.03] text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10 w-56" />
          </div>
          <button @click="downloadPDF" class="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 h-9 text-sm font-medium text-white shadow-theme-xs hover:bg-red-600 transition-colors" title="Descargar PDF">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9l2 2m0 0l2-2m-2 2v-5"/></svg>
            PDF
          </button>
          
          <div v-if="!loading" class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] px-4 py-2 flex items-center gap-3">
            <div class="h-8 w-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Piezas</p>
              <h3 class="text-lg font-bold text-gray-800 dark:text-white/90">{{ totalPiezasStock }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Card -->
      <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

        <!-- Loading state -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <svg class="animate-spin h-8 w-8 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        </div>

        <!-- Table -->
        <div v-else class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-5 py-3 text-left sm:px-6 w-14"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Img</p></th>
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Producto</p></th>
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Categoría</p></th>
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Tipo</p></th>
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Stock</p></th>
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Estado</p></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="p in productosFiltrados" :key="p.id" class="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                <!-- Img -->
                <td class="px-5 py-3 sm:px-6">
                  <div class="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <img v-if="p.imagen_url" :src="p.imagen_url" :alt="p.nombre" class="w-full h-full object-cover" />
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-gray-400"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                </td>
                <!-- Nombre -->
                <td class="px-5 py-4 sm:px-6 min-w-[180px]">
                  <p class="font-semibold text-gray-800 text-theme-sm dark:text-white/90">{{ p.nombre }}</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-mono">{{ p.slug }}</p>
                </td>
                <!-- Categoría -->
                <td class="px-5 py-4 sm:px-6">
                  <span class="text-theme-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                    {{ p.tienda || 'General' }}
                  </span>
                </td>
                <!-- Tipo -->
                <td class="px-5 py-4 sm:px-6">
                  <span :class="p.es_variable ? 'bg-blue-light-50 text-blue-light-700 dark:bg-blue-light-500/15 dark:text-blue-light-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
                    class="rounded-full px-2.5 py-0.5 text-theme-xs font-medium">
                    {{ p.es_variable ? 'Variable' : 'Simple' }}
                  </span>
                </td>
                <!-- Stock -->
                <td class="px-5 py-4 sm:px-6">
                  <span :class="p.stock > 10 ? 'text-success-600 dark:text-success-500' : p.stock > 0 ? 'text-warning-600 dark:text-warning-400' : 'text-error-500'"
                    class="text-theme-sm font-medium">
                    {{ p.es_variable ? `${p.variaciones_count} var.` : (p.stock > 0 ? p.stock : 'Sin stock') }}
                  </span>
                </td>
                <!-- Estado -->
                <td class="px-5 py-4 sm:px-6">
                  <span :class="p.es_publico ? 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
                    class="rounded-full px-2.5 py-0.5 text-theme-xs font-medium">
                    {{ p.es_publico ? 'Publicado' : 'Borrador' }}
                  </span>
                </td>
              </tr>

              <tr v-if="productosFiltrados.length === 0 && !loading">
                <td colspan="6" class="px-5 py-16 text-center">
                  <svg class="mx-auto mb-3 text-gray-300 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  <p class="text-sm text-gray-400 dark:text-gray-500">No hay productos aún.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SANSAH_LOGO_B64, SANSAH_COLORS } from '@/utils/pdfBrand';

const busqueda     = ref('');
const loading      = ref(true);
const productos    = ref([]);

const fetchProductos = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/api/products');
    productos.value = res.data;
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProductos);

const productosFiltrados = computed(() => {
  let lista = productos.value;
  if (busqueda.value) {
    lista = lista.filter(p => p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()));
  }
  return lista;
});

const totalPiezasStock = computed(() => {
  return productosFiltrados.value.reduce((total, p) => {
    return total + (Number(p.stock) || 0);
  }, 0);
});

const downloadPDF = () => {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // ── Header band ──────────────────────────────────────────────
  doc.setFillColor(...SANSAH_COLORS.negro);
  doc.rect(0, 0, pageW, 28, 'F');

  // Logo Sansah
  doc.addImage(SANSAH_LOGO_B64, 'PNG', 10, 3, 52, 22);

  // Título a la derecha del header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Reporte de Inventario', pageW - 14, 13, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, pageW - 14, 21, { align: 'right' });

  // ── Sub-header info ───────────────────────────────────────────
  doc.setTextColor(...SANSAH_COLORS.negro);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total de piezas en stock: ${totalPiezasStock.value}`, 14, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Productos listados: ${productosFiltrados.value.length}`, 14, 48);

  // ── Línea separadora naranja ──────────────────────────────────
  doc.setDrawColor(...SANSAH_COLORS.naranja);
  doc.setLineWidth(1.2);
  doc.line(14, 52, pageW - 14, 52);

  // ── Tabla ─────────────────────────────────────────────────────
  const tableData = [];
  productosFiltrados.value.forEach(p => {
    tableData.push([
      p.nombre,
      p.tienda || 'General',
      p.es_variable ? 'Variable' : 'Simple',
      String(p.stock)
    ]);
  });

  autoTable(doc, {
    head: [['Producto', 'Categoría', 'Tipo', 'Unidades']],
    body: tableData,
    startY: 57,
    theme: 'grid',
    headStyles: {
      fillColor: SANSAH_COLORS.naranja,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    styles: { fontSize: 9, cellPadding: 3 },
    alternateRowStyles: { fillColor: SANSAH_COLORS.grisClaro },
    columnStyles: {
      3: { halign: 'right', fontStyle: 'bold' }
    },
    didDrawPage: (data) => {
      // Footer en cada página
      const pageH = doc.internal.pageSize.getHeight();
      doc.setFillColor(...SANSAH_COLORS.negro);
      doc.rect(0, pageH - 10, pageW, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.text('Sansah Bikes® — Documento interno', pageW / 2, pageH - 3, { align: 'center' });
    }
  });

  doc.save(`inventario_sansah_${new Date().toISOString().split('T')[0]}.pdf`);
};
</script>
