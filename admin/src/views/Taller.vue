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
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
                  {{ orden.bicicleta || 'Bicicleta' }}
                </div>
                <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01M7 11h.01M7 15h.01M11 7h6M11 11h6M11 15h6"/></svg>
                  {{ orden.numero }}
                </div>
              </div>
              
              <!-- Description & Service -->
              <div class="space-y-1">
                <div v-if="orden.servicio" class="text-[13px] font-bold text-brand-600 dark:text-brand-400 leading-snug">{{ orden.servicio }}</div>
                <p class="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{{ orden.descripcion }}</p>
              </div>
              
              <!-- Bottom Row -->
              <div class="mt-1 flex items-center justify-between">
                <span class="text-xl font-black text-gray-900 dark:text-white tracking-tight">${{ orden.costo }}</span>
                <button @click="abrirDetalles(orden)" class="bg-brand-500 hover:bg-brand-600 active:scale-95 transition-all text-white px-4 py-2 rounded-xl font-bold text-[13px] shadow-sm flex items-center gap-1.5">
                  Detalles <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
                  {{ orden.bicicleta || 'Bicicleta' }}
                </div>
                <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01M7 11h.01M7 15h.01M11 7h6M11 11h6M11 15h6"/></svg>
                  {{ orden.numero }}
                </div>
              </div>
              
              <div class="space-y-1">
                <div v-if="orden.servicio" class="text-[13px] font-bold text-brand-600 dark:text-brand-400 leading-snug">{{ orden.servicio }}</div>
                <p class="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{{ orden.descripcion }}</p>
              </div>
              
              <div class="mt-1 flex items-center justify-between">
                <span class="text-xl font-black text-gray-900 dark:text-white tracking-tight">${{ orden.costo }}</span>
                <button @click="abrirActualizarOrden(orden)" class="bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white px-4 py-2 rounded-xl font-bold text-[13px] shadow-sm flex items-center gap-1.5">
                  Actualizar <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
                  {{ orden.bicicleta || 'Bicicleta' }}
                </div>
                <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01M7 11h.01M7 15h.01M11 7h6M11 11h6M11 15h6"/></svg>
                  {{ orden.numero }}
                </div>
              </div>
              
              <div class="space-y-1">
                <div v-if="orden.servicio" class="text-[13px] font-bold text-brand-600 dark:text-brand-400 leading-snug">{{ orden.servicio }}</div>
                <p class="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{{ orden.descripcion }}</p>
              </div>
              
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

    <!-- Modal de Confirmación (Resumen de Entrega) -->
    <Modal v-if="showModal" :fullScreenBackdrop="true" @close="cancelarEntrega">
      <template #body>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white/90">Resumen de Orden</h2>
            <button @click="cancelarEntrega" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          
          <div class="space-y-4 text-left">
            <div>
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Cliente</p>
              <p class="text-base font-bold text-gray-900 dark:text-white">{{ ordenSeleccionada?.cliente }} <span v-if="ordenSeleccionada?.bicicleta">- {{ ordenSeleccionada.bicicleta }}</span></p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
              <div class="flex justify-between items-center mb-2">
                <span class="text-[13px] font-bold text-gray-700 dark:text-gray-200">{{ ordenSeleccionada?.servicio || 'Servicio General' }}</span>
                <span class="text-[13px] font-bold text-gray-900 dark:text-white">${{ Number(ordenSeleccionada?.costo || 0).toFixed(2) }}</span>
              </div>
              
              <template v-if="ordenSeleccionada?.piezas?.length > 0">
                <div class="border-t border-gray-200 dark:border-gray-700 my-2 pt-2 space-y-1.5">
                  <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Refacciones y Extras</p>
                  <div v-for="(pieza, index) in ordenSeleccionada.piezas" :key="index" class="flex justify-between items-center">
                    <span class="text-[13px] text-gray-600 dark:text-gray-400">- {{ pieza.nombre }}</span>
                    <span class="text-[13px] font-medium text-gray-800 dark:text-gray-300">${{ Number(pieza.precio || 0).toFixed(2) }}</span>
                  </div>
                </div>
              </template>
            </div>
            
            <div class="flex justify-between items-center pt-2 border-b border-gray-100 dark:border-gray-800 pb-3 mb-3">
              <span class="text-sm font-bold text-gray-800 dark:text-gray-200">Total Estimado</span>
              <span class="text-xl font-black text-brand-600 dark:text-brand-400">
                ${{ (Number(ordenSeleccionada?.costo || 0) + (ordenSeleccionada?.piezas || []).reduce((acc, p) => acc + Number(p.precio || 0), 0)).toFixed(2) }}
              </span>
            </div>
            
            <div v-if="ordenSeleccionada?.descripcion" class="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-100 dark:border-yellow-500/20 rounded-xl p-3 shadow-sm">
              <p class="text-[11px] font-black text-yellow-800 dark:text-yellow-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                Notas de la Orden
              </p>
              <p class="text-[13px] text-yellow-900 dark:text-yellow-200 whitespace-pre-wrap leading-snug">{{ ordenSeleccionada.descripcion }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 w-full mt-5">
            <button @click="cancelarEntrega" class="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancelar
            </button>
            <button @click="confirmarEntrega" class="flex-1 py-2.5 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-colors shadow-sm flex items-center justify-center gap-2">
              Cobrar
            </button>
          </div>
        </div>
      </template>
    </Modal>

    <!-- Modal Detalles del Servicio -->
    <Modal v-if="showDetallesModal" :fullScreenBackdrop="true" @close="cerrarDetalles">
      <template #body>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl border border-gray-100 dark:border-gray-700 relative">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white/90">Detalles del Servicio</h2>
            <button @click="cerrarDetalles" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          
          <div class="space-y-4 text-left">
            <div>
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Cliente</p>
              <p class="text-base font-bold text-gray-900 dark:text-white">{{ ordenEnDetalle?.cliente }}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Bicicleta</p>
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ ordenEnDetalle?.bicicleta || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Teléfono</p>
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ ordenEnDetalle?.telefono || 'N/A' }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div v-if="ordenEnDetalle?.servicio" class="col-span-2">
                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Servicio Solicitado</p>
                <p class="text-base font-black text-brand-600 dark:text-brand-400">{{ ordenEnDetalle.servicio }}</p>
              </div>

              <div>
                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Costo Estimado</p>
                <p class="text-lg font-black text-gray-900 dark:text-white">${{ ordenEnDetalle?.costo }}</p>
              </div>
            </div>

            <div>
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Notas / Descripción</p>
              <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ ordenEnDetalle?.descripcion }}</p>
              </div>
            </div>
          </div>

          <div class="pt-6 flex items-center justify-end gap-3">
            <button @click="cerrarDetalles" class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
              Cerrar
            </button>
            <button @click="empezarTrabajo" class="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all flex items-center gap-2 shadow-sm text-sm active:scale-95">
              Comenzar Reparación
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
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
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Servicio a realizar:</label>
              <select v-model="nuevoServicioForm.servicioSeleccionado" required class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                <option :value="null" disabled selected>Selecciona un servicio</option>
                <option v-for="s in serviciosList" :key="s.id" :value="s">
                  {{ s.nombre }} - ${{ Number(s.precio || 0).toFixed(2) }}
                </option>
              </select>
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

    <!-- Modal Actualizar Orden -->
    <Modal v-if="showActualizarModal" :fullScreenBackdrop="true" @close="cerrarActualizarOrden">
      <template #body>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white/90">Actualizar Orden</h2>
            <button @click="cerrarActualizarOrden" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="space-y-4 text-left">
            <div>
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Cliente</p>
              <p class="text-base font-bold text-gray-900 dark:text-white">{{ ordenAActualizar?.cliente }} <span v-if="ordenAActualizar?.bicicleta">- {{ ordenAActualizar.bicicleta }}</span></p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Añadir Refacciones:</label>
              <div class="relative flex gap-2 mb-3">
                <div class="flex-1 relative">
                  <input 
                    v-model="busquedaRefaccion" 
                    @focus="showRefaccionesDropdown = true" 
                    @blur="hideRefaccionesDropdown" 
                    type="text" 
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm" 
                    placeholder="Escribe para buscar una refacción..."
                  >
                  <ul 
                    v-if="showRefaccionesDropdown && refaccionesBuscadas.length > 0" 
                    class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto custom-scrollbar"
                  >
                    <li 
                      v-for="r in refaccionesBuscadas" 
                      :key="r.id" 
                      @mousedown="seleccionarRefaccionBuscada(r)" 
                      class="px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-white transition-colors"
                    >
                      {{ r.nombre }} - <span class="font-bold text-brand-600 dark:text-brand-400">${{ Number(r.precio || 0).toFixed(2) }}</span>
                    </li>
                  </ul>
                  <div v-if="showRefaccionesDropdown && refaccionesBuscadas.length === 0" class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 text-center text-sm text-gray-500">
                    No se encontraron resultados
                  </div>
                </div>
              </div>
              
              <div v-if="piezasActuales.length > 0" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-2">
                <div v-for="(pieza, i) in piezasActuales" :key="i" class="flex items-center justify-between p-2.5 border-b border-gray-200 dark:border-gray-700 last:border-0 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <span class="text-[13px] font-medium text-gray-700 dark:text-gray-200">{{ pieza.nombre }}</span>
                  <div class="flex items-center gap-3">
                    <span class="text-[13px] font-bold text-gray-900 dark:text-white">${{ Number(pieza.precio).toFixed(2) }}</span>
                    <button type="button" @click="quitarRefaccion(i)" class="text-red-500 hover:text-red-600 p-1 bg-white dark:bg-gray-900 rounded-md shadow-sm border border-red-100 dark:border-red-900/30">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Añadir Nota a la Orden:</label>
              <textarea v-model="nuevaNota" rows="2" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm" placeholder="Ej. Se encontraron frenos gastados..."></textarea>
            </div>
            
            <div class="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800 mt-4">
              <button type="button" @click="guardarCambiosActualizar(false)" class="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-[13px]">
                Guardar Cambios
              </button>
              <button type="button" @click="guardarCambiosActualizar(true)" class="px-4 py-2.5 rounded-lg bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors text-[13px] shadow-sm flex items-center gap-1.5">
                Finalizar Reparación <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
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
const serviciosList = computed(() => {
  return productosList.value.filter(p => (p.tienda || '').toLowerCase() === 'servicios');
});
const refaccionesList = computed(() => {
  return productosList.value.filter(p => (p.tienda || '').toLowerCase() === 'refacciones');
});
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

// ── Detalles Servicio ────────────────────────────────────────────────────────
const showDetallesModal = ref(false);
const ordenEnDetalle = ref(null);

const abrirDetalles = (orden) => {
  ordenEnDetalle.value = orden;
  showDetallesModal.value = true;
};

const cerrarDetalles = () => {
  showDetallesModal.value = false;
  ordenEnDetalle.value = null;
};

const empezarTrabajo = () => {
  if (ordenEnDetalle.value) {
    moverA(ordenEnDetalle.value, 'en_progreso');
    cerrarDetalles();
  }
};

// ── Actualizar Orden (En Progreso) ──────────────────────────────────────────
const showActualizarModal = ref(false);
const ordenAActualizar = ref(null);
const nuevaNota = ref('');
const piezasActuales = ref([]);
const busquedaRefaccion = ref('');
const showRefaccionesDropdown = ref(false);

const refaccionesBuscadas = computed(() => {
  if (!busquedaRefaccion.value.trim()) return refaccionesList.value;
  const q = busquedaRefaccion.value.toLowerCase();
  return refaccionesList.value.filter(r => r.nombre.toLowerCase().includes(q));
});

const seleccionarRefaccionBuscada = (refaccion) => {
  piezasActuales.value.push({
    id: refaccion.id,
    nombre: refaccion.nombre,
    precio: parseFloat(refaccion.precio) || 0,
    imagen_url: refaccion.imagen_url || null
  });
  busquedaRefaccion.value = '';
  showRefaccionesDropdown.value = false;
};

const hideRefaccionesDropdown = () => {
  setTimeout(() => {
    showRefaccionesDropdown.value = false;
  }, 150);
};

const abrirActualizarOrden = (orden) => {
  ordenAActualizar.value = orden;
  piezasActuales.value = Array.isArray(orden.piezas) ? [...orden.piezas] : [];
  nuevaNota.value = '';
  busquedaRefaccion.value = '';
  showRefaccionesDropdown.value = false;
  showActualizarModal.value = true;
};

const cerrarActualizarOrden = () => {
  showActualizarModal.value = false;
  ordenAActualizar.value = null;
};

const quitarRefaccion = (index) => {
  piezasActuales.value.splice(index, 1);
};

const guardarCambiosActualizar = async (finalizar = false) => {
  if (!ordenAActualizar.value) return;
  
  let descripcionActualizada = ordenAActualizar.value.descripcion;
  if (nuevaNota.value.trim()) {
    descripcionActualizada += `\n\n[Nota extra]: ${nuevaNota.value.trim()}`;
  }
  
  try {
    const API_URL = import.meta.env.VITE_API_URL || '';
    const res = await fetch(`${API_URL}/api/taller/${ordenAActualizar.value.id}/detalles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        descripcion: descripcionActualizada,
        piezas: piezasActuales.value
      })
    });
    if (!res.ok) throw new Error();
    
    // Update local state
    const ordenObj = ordenes.value.find(o => o.id === ordenAActualizar.value.id);
    if (ordenObj) {
      ordenObj.descripcion = descripcionActualizada;
      ordenObj.piezas = [...piezasActuales.value];
    }
    
    if (finalizar && ordenObj) {
      await moverA(ordenObj, 'para_entrega');
    }
    cerrarActualizarOrden();
  } catch (e) {
    console.error(e);
    alert('Error al guardar cambios.');
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
      costo: orden.costo,
      piezas: orden.piezas || []
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
  servicioSeleccionado: null
});

const abrirNuevoServicio = () => {
  nuevoServicioForm.cliente = '';
  nuevoServicioForm.bicicleta = '';
  nuevoServicioForm.descripcion = '';
  nuevoServicioForm.telefono = '';
  nuevoServicioForm.servicioSeleccionado = null;
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
        costo: nuevoServicioForm.servicioSeleccionado?.precio || 0,
        servicio: nuevoServicioForm.servicioSeleccionado?.nombre || '',
        fecha: `${horas}:${minutos}`
      })
    });
    
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }
    const nuevaOrden = await res.json();
    
    ordenes.value.unshift(nuevaOrden); // Agregarlo al principio
    cerrarNuevoServicio();
  } catch (e) {
    console.error('Error al guardar nuevo servicio:', e);
    alert('Error al crear el servicio. ' + e.message);
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
