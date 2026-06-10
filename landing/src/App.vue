<script setup lang="ts">
import { ref } from 'vue'

const bgX = ref(0)
const bgY = ref(0)

const handleMouseMove = (e: MouseEvent) => {
  // Desplazamiento máximo de 30px en cada dirección
  const x = (e.clientX / window.innerWidth - 0.5) * 60
  const y = (e.clientY / window.innerHeight - 0.5) * 60
  bgX.value = x
  bgY.value = y
}
</script>

<template>
  <main class="simple-landing" @mousemove="handleMouseMove">
    <!-- Imagen de fondo con animación vinculada al puntero -->
    <div 
      class="background-parallax" 
      :style="{ transform: `translate(${-bgX}px, ${-bgY}px) scale(1.07)` }"
    ></div>
    
    <!-- Capa oscura/semitransparente con los colores de la marca -->
    <div class="brand-overlay"></div>
    
    <div class="content">
      <!-- Logo centrado y grande con transparencia general si se desea -->
      <div class="logo-container">
        <img src="/logo.png" alt="SanSah Bikes Logo" class="main-logo" />
      </div>

      <!-- Iconos de Redes Sociales: FB, IG, TikTok -->
      <div class="social-links">
        <!-- Facebook -->
        <a href="https://www.facebook.com/share/1BRAxHXine/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
        </a>
        
        <!-- Instagram -->
        <a href="https://www.instagram.com/sansahbikes?igsh=MWxyZWtjazRteWIzbA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>

        <!-- TikTok -->
        <a href="https://www.tiktok.com/@sansahbikes?_r=1&_t=ZS-95XUXJdaK2O" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="TikTok">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
        </a>
      </div>
    </div>
  </main>
</template>

<style>
/* Reset global para evitar cualquier tipo de scroll o padding */
*, *::before, *::after {
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: #000; /* Fondo negro base */
}
</style>

<style scoped>
.simple-landing {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  overflow: hidden;
}

/* La imagen tiene scale(1.07) por defecto desde el style para que los bordes no se vean al moverse */
.background-parallax {
  position: absolute;
  inset: 0;
  background-image: url('/extreme_mtb_bg.png');
  background-size: cover;
  background-position: center;
  /* Transición ultra suave para interpolar movimientos del mouse y que se vea natural */
  transition: transform 0.1s ease-out;
  border-radius: 0;
  z-index: 1;
}

/* 
  Gran composición: Overlay semi transparente que mezcla azul oscuro (#082f49), 
  negro (#000000) y destellos anaranjados (#c2410c), dando un toque elegante 
  y permitiendo que el logo y los íconos destaquen con claridad. 
*/
.brand-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg, 
    rgba(2, 6, 23, 0.95) 0%,   /* Slate negro/azul casi opaco */
    rgba(8, 47, 73, 0.70) 50%, /* Azul oscuro de la marca transparente */
    rgba(194, 65, 12, 0.50) 100% /* Anaranjado vibrante translúcido en esquina inferior */
  );
  z-index: 2;
  /* Añadimos sutil blur de fondo para darle el efecto de transparencia cristalina/premium */
  backdrop-filter: blur(2px);
}

.content {
  position: relative;
  z-index: 3;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  /* El contenido entra suave y permanece siempre fijo y centrado */
  animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.logo-container {
  max-width: 90vw;
  /* Un sutil aura anaranjada en el contenedor del logo para potenciar la marca */
  padding: 1rem;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(234, 88, 12, 0.1) 0%, transparent 70%);
}

.main-logo {
  width: clamp(250px, 45vw, 550px);
  height: auto;
  object-fit: contain;
  /* Sombra para despegar el logo del fondo */
  filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 40px rgba(14, 165, 233, 0.15));
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease;
}

.main-logo:hover {
  transform: scale(1.03);
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 50px rgba(234, 88, 12, 0.3));
}

.social-links {
  display: flex;
  gap: 2.5rem;
  justify-content: center;
  align-items: center;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: rgba(2, 6, 23, 0.6); /* Negro transparente puro */
  color: #ffffff; /* Blanco puro */
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
}

.social-icon:hover {
  background: rgba(234, 88, 12, 0.9); /* Naranja fuerte al pasar mouse */
  color: #ffffff;
  border-color: #ea580c;
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(234, 88, 12, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

