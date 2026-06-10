import axios from 'axios';
import { getDB, saveDB } from './db';

// Helper to delay response to simulate network
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Rutas que van al backend REAL (no se mockean) ──────────────────────────
const REAL_ROUTES = [
  '/api/users',
  '/api/products',
  '/api/upload',
  '/api/categorias',
  '/api/tiendas',      // alias de categorias
  '/api/clientes',
  '/api/pedidos',
  '/api/inventario',
  '/api/taller',
  '/api/reportes',
];

function isRealRoute(url: string): boolean {
  return REAL_ROUTES.some(r => url.includes(r));
}

function handleRequest(url: string, method: string, body?: any) {
  const db = getDB();
  
  // -- AUTH --
  if (url.includes('/api/auth/login')) {
    return { token: 'fake-jwt-token', user: db.users[0] };
  }
  if (url.includes('/api/auth/me')) {
    return db.users[0];
  }

  // -- TIENDAS (Categorías) --
  if (url.match(/\/api\/tiendas\/?$/) && method === 'GET') return db.tiendas;
  if (url.match(/\/api\/tiendas\/?$/) && method === 'POST') {
    const nueva = { ...body, id: Date.now() };
    db.tiendas.push(nueva);
    saveDB(db);
    return nueva;
  }
  if (url.match(/\/api\/tiendas\/(\d+)/) && method === 'DELETE') {
    const id = parseInt(url.split('/').pop()!);
    db.tiendas = db.tiendas.filter((t: any) => t.id !== id);
    saveDB(db);
    return { success: true };
  }
  if (url.match(/\/api\/tiendas\/(\d+)/) && method === 'GET') {
    const id = parseInt(url.split('/').pop()!);
    return db.tiendas.find((t: any) => t.id === id) || null;
  }

  // -- CLIENTES --
  if (url.match(/\/api\/clientes\/?$/) && method === 'GET') return db.clientes;
  
  // -- PEDIDOS --
  if (url.match(/\/api\/pedidos\/?$/) && method === 'GET') return db.pedidos;

  // -- REPORTES --
  if (url.includes('/api/reportes/ventas')) return db.reportes_ventas;
  if (url.includes('/api/reportes/inventario')) {
    return db.products.map((p: any) => ({
      id: p.id,
      producto_nombre: p.nombre,
      producto_stock: p.stock,
      variaciones: p.variaciones || []
    }));
  }

  // -- BOLETINES --
  if (url.match(/\/api\/boletines\/?$/) && method === 'GET') return db.boletines;
  if (url.match(/\/api\/suscriptores\/?$/) && method === 'GET') return db.suscriptores;

  // Fallback
  throw new Error(`Mock endpoint not found: ${method} ${url}`);
}

export function initMock() {
  const originalFetch = window.fetch.bind(window);

  // 1. Monkey-patch window.fetch
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : (input as Request).url;
    
    // Rutas reales → pasar directo sin mock
    if (isRealRoute(url)) {
      return originalFetch(input, init);
    }
    
    // Solo mockear /api/
    if (url.includes('/api/')) {
      await delay(300);
      const method = init?.method || 'GET';
      let body;
      if (init?.body) {
        try {
          body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
        } catch(e) {}
      }
      
      try {
        const data = handleRequest(url, method, body);
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    return originalFetch(input, init);
  };

  // 2. Monkey-patch Axios — para rutas reales, usar fetch nativo directamente
  axios.defaults.adapter = async (config: any) => {
    const { url, method = 'get', data } = config;
    
    // ── Rutas REALES → usar fetch nativo ─────────────────────────────────
    if (isRealRoute(url)) {
      const fetchInit: RequestInit = {
        method: method.toUpperCase(),
        // Copiar solo headers que no conflicten con FormData
        headers: {} as Record<string, string>,
      };

      // Copiar headers de axios, pero NO Content-Type si es FormData
      // (el browser lo pone automáticamente con el boundary correcto)
      const axiosHeaders = config.headers || {};
      const isFormData = data instanceof FormData;
      for (const [key, value] of Object.entries(axiosHeaders)) {
        if (isFormData && key.toLowerCase() === 'content-type') continue;
        if (typeof value === 'string') {
          (fetchInit.headers as Record<string, string>)[key] = value;
        }
      }

      // Add JWT token
      const token = localStorage.getItem('amigo_admin_token');
      if (token) {
        (fetchInit.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }

      if (data) {
        if (isFormData) {
          fetchInit.body = data; // FormData nativo → fetch lo maneja
        } else if (typeof data === 'string') {
          fetchInit.body = data;
        } else {
          fetchInit.body = JSON.stringify(data);
        }
      }

      const API_URL = import.meta.env.VITE_API_URL || '';
      const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
      const res = await fetch(fullUrl, fetchInit);
      const resData = res.headers.get('content-type')?.includes('json')
        ? await res.json()
        : await res.text();
      
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('amigo_admin_token');
          window.location.href = '/signin';
        }
        const error: any = new Error(`Request failed with status ${res.status}`);
        error.response = {
          data: resData,
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
          config,
        };
        throw error;
      }
      
      return {
        data: resData,
        status: res.status,
        statusText: res.statusText,
        headers: {},
        config,
        request: {}
      };
    }

    // ── Rutas MOCK ────────────────────────────────────────────────────────
    if (url.includes('/api/')) {
      await delay(300);
      let parsedData: any;
      
      if (data) {
        try { parsedData = JSON.parse(data); } catch(e) { parsedData = data; }
      }

      try {
        const responseData = handleRequest(url, method.toUpperCase(), parsedData);
        return {
          data: responseData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          request: {}
        };
      } catch (err: any) {
        const error: any = new Error(err.message);
        error.config = config;
        error.response = {
          data: { error: err.message },
          status: 404,
          statusText: 'Not Found',
          headers: {},
          config,
        };
        throw error;
      }
    }

    // Para rutas no-API, usar fetch nativo
    const res = await fetch(url, { method: method.toUpperCase(), body: data });
    const resData = await res.json().catch(() => res.text());
    return {
      data: resData,
      status: res.status,
      statusText: res.statusText,
      headers: {},
      config,
      request: {}
    };
  };
}
