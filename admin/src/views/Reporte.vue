<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">

      <!-- Page Header & Store Selector -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Estadísticas</h1>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Categoría:</label>
            <select v-model="selectedTienda" @change="fetchData" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 pl-3 pr-8 text-sm font-medium text-gray-700 dark:text-gray-300 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10">
              <option value="todas">Todas las categorías</option>
              <option v-for="t in tiendas" :key="t.id" :value="t.id">{{ t.nombre }}</option>
            </select>
          </div>
          
          <button @click="downloadSalesPDF" class="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-green-700 transition-colors" title="Descargar Reporte en PDF">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Exportar PDF
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <svg class="animate-spin h-8 w-8 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <template v-else>
        <!-- Totales Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-2">
          <!-- Ingreso Neto Card -->
          <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="h-14 w-14 rounded-xl bg-success-500/10 flex items-center justify-center text-success-600 dark:text-success-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Ingreso Neto Total</p>
                <h3 class="text-3xl font-bold text-gray-900 dark:text-white/90">${{ (reporteData.ingreso_neto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }} <span class="text-lg text-gray-500">MXN</span></h3>
              </div>
            </div>
          </div>

          <!-- Egreso Total Card -->
          <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="h-14 w-14 rounded-xl bg-error-500/10 flex items-center justify-center text-error-600 dark:text-error-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Gastos y Compras Total</p>
                <h3 class="text-3xl font-bold text-gray-900 dark:text-white/90">${{ (reporteData.egreso_total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }} <span class="text-lg text-gray-500">MXN</span></h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Grid 1 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          
          <!-- Forma de Pago -->
          <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
            <h2 class="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">Ingresos por Forma de Pago</h2>
            <div class="min-h-[300px] flex items-center justify-center">
              <VueApexCharts type="donut" height="320" :options="pagoOptions" :series="pagoSeries" />
            </div>
          </div>

          <!-- Canales de Venta -->
          <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
            <h2 class="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">Ingresos por Canal de Venta</h2>
            <div class="min-h-[300px] flex items-center justify-center">
              <VueApexCharts type="donut" height="320" :options="canalOptions" :series="canalSeries" />
            </div>
          </div>

          <!-- Gastos y Compras -->
          <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
            <h2 class="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">Desglose de Gastos y Compras</h2>
            <div class="min-h-[300px] flex items-center justify-center">
              <VueApexCharts type="donut" height="320" :options="egresosOptions" :series="egresosSeries" />
            </div>
          </div>
          
        </div>

        <!-- Charts Grid 2 -->
        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
          <h2 class="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">Top 5 Productos Más Vendidos</h2>
          <div class="min-h-[320px]">
            <VueApexCharts type="bar" height="320" :options="topProductsOptions" :series="topProductsSeries" />
          </div>
        </div>

      </template>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import VueApexCharts from 'vue3-apexcharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SANSAH_LOGO_B64, SANSAH_COLORS } from '@/utils/pdfBrand';

// --- Estado ---
const loading = ref(true);
const tiendas = ref([]);
const selectedTienda = ref('todas');
const reporteData = ref({});

// --- Fetch tiendas reales ---
const fetchTiendas = async () => {
  try {
    const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/tiendas');
    if (res.ok) tiendas.value = await res.json();
  } catch (e) { console.error('Error fetching tiendas:', e); }
};

// --- Fetch datos del reporte ---
const fetchData = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (selectedTienda.value !== 'todas') params.append('tienda_id', selectedTienda.value);
    
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/reportes/ventas?${params}`);
    if (res.ok) {
      reporteData.value = await res.json();
    }
  } catch (e) { console.error('Error fetching reporte:', e); }
  finally { loading.value = false; }
};

// --- Opciones Gráfica Formas de Pago ---
const pagoSeries = computed(() => reporteData.value?.ingresos_forma_pago?.series || []);
const pagoOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'inherit', background: 'transparent' },
  labels: reporteData.value?.ingresos_forma_pago?.labels || [],
  colors: ['#3b82f6', '#14b8a6', '#f59e0b', '#8b5cf6'],
  stroke: { width: 0 },
  dataLabels: { 
    enabled: true, 
    formatter: (val) => val.toFixed(1) + "%",
    style: { fontSize: '16px', fontWeight: 'bold', colors: ['#000000', '#000000', '#000000', '#000000', '#000000'] },
    dropShadow: { enabled: false }
  },
  legend: { position: 'bottom', labels: { colors: '#9CA3AF' } },
  tooltip: {
    theme: 'light',
    y: { formatter: (val) => `$${val.toLocaleString('es-MX')} MXN` }
  }
}));

// --- Opciones Gráfica Canal de Venta ---
const canalSeries = computed(() => reporteData.value?.ingresos_canal?.series || []);
const canalOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'inherit', background: 'transparent' },
  labels: reporteData.value?.ingresos_canal?.labels || [],
  colors: ['#f97316', '#237650'],
  stroke: { width: 0 },
  dataLabels: { 
    enabled: true, 
    formatter: (val) => val.toFixed(1) + "%",
    style: { fontSize: '16px', fontWeight: 'bold', colors: ['#000000'] },
    dropShadow: { enabled: false }
  },
  legend: { position: 'bottom', labels: { colors: '#9CA3AF' } },
  tooltip: {
    theme: 'light',
    y: { formatter: (val) => `$${val.toLocaleString('es-MX')} MXN` }
  }
}));

// --- Opciones Gráfica Egresos (Gastos y Compras) ---
const egresosSeries = computed(() => reporteData.value?.egresos_desglose?.series || []);
const egresosOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'inherit', background: 'transparent' },
  labels: reporteData.value?.egresos_desglose?.labels || [],
  colors: ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'],
  stroke: { width: 0 },
  dataLabels: { 
    enabled: true, 
    formatter: (val) => val.toFixed(1) + "%",
    style: { fontSize: '16px', fontWeight: 'bold', colors: ['#000000'] },
    dropShadow: { enabled: false }
  },
  legend: { position: 'bottom', labels: { colors: '#9CA3AF' } },
  tooltip: {
    theme: 'light',
    y: { formatter: (val) => `$${val.toLocaleString('es-MX')} MXN` }
  }
}));

// --- Opciones Gráfica Top Productos ---
const topProductsSeries = computed(() => [{
  name: 'Unidades Vendidas',
  data: reporteData.value?.top_productos?.series || []
}]);

const topProductsOptions = computed(() => ({
  chart: { type: 'bar', fontFamily: 'inherit', toolbar: { show: false }, background: 'transparent' },
  colors: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'],
  plotOptions: { 
    bar: { 
      horizontal: true, 
      borderRadius: 4,
      distributed: true
    } 
  },
  dataLabels: { enabled: true, style: { colors: ['#000000'] }, dropShadow: { enabled: false } },
  legend: { show: false },
  xaxis: {
    categories: reporteData.value?.top_productos?.labels || [],
    labels: { style: { colors: '#9CA3AF' } },
  },
  yaxis: {
    labels: { style: { colors: '#6B7280', fontWeight: 600 } }
  },
  grid: { borderColor: '#F3F4F6', strokeDashArray: 4 },
  tooltip: {
    theme: 'light'
  }
}));

// --- Generador PDF Estilo Excel ---
const downloadSalesPDF = () => {
  const doc = new jsPDF('landscape');
  const pageW = doc.internal.pageSize.getWidth();

  // ── Header band ───────────────────────────────────────────────────────────
  doc.setFillColor(...SANSAH_COLORS.negro);
  doc.rect(0, 0, pageW, 30, 'F');

  // Logo Sansah (más grande en landscape)
  doc.addImage(SANSAH_LOGO_B64, 'PNG', 10, 4, 62, 24);

  // Título a la derecha
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Reporte General de Ventas', pageW - 14, 15, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-MX')}`, pageW - 14, 24, { align: 'right' });

  // ── Sub-header info ────────────────────────────────────────────
  doc.setTextColor(...SANSAH_COLORS.negro);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  const ingresoFmt = `$${(reporteData.value.ingreso_neto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
  doc.text(`Ingreso Neto Total: ${ingresoFmt}`, 14, 44);

  // ── Línea separadora naranja ──────────────────────────────────
  doc.setDrawColor(...SANSAH_COLORS.naranja);
  doc.setLineWidth(1.2);
  doc.line(14, 50, pageW - 14, 50);

  // ── Tabla ─────────────────────────────────────────────────────
  const rowsData = reporteData.value.rows || [];
  const tableData = rowsData.map((r) => [
    r.fecha,
    r.producto,
    r.canal,
    r.pago,
    `$${r.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
  ]);

  autoTable(doc, {
    head: [['Fecha', 'Producto', 'Canal de Venta', 'Forma de Pago', 'Total (MXN)']],
    body: tableData,
    startY: 55,
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
      4: { halign: 'right', fontStyle: 'bold' }
    },
    didDrawPage: () => {
      // Footer en cada página
      const pageH = doc.internal.pageSize.getHeight();
      doc.setFillColor(...SANSAH_COLORS.negro);
      doc.rect(0, pageH - 10, pageW, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.text('Sansah Bikes® — Reporte Confidencial', pageW / 2, pageH - 3, { align: 'center' });
    }
  });

  doc.save(`reporte_ventas_sansah_${new Date().toISOString().split('T')[0]}.pdf`);
};

onMounted(async () => {
  await fetchTiendas();
  await fetchData();
});
</script>

<style scoped>
:deep(.apexcharts-pie-label),
:deep(.apexcharts-datalabel),
:deep(.apexcharts-datalabel-value) {
  fill: #000000 !important;
  filter: none !important;
  text-shadow: none !important;
}
</style>
