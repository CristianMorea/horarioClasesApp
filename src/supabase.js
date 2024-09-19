// src/supabase.js
import { createClient } from '@supabase/supabase-js';

// Acceder a las variables de entorno correctamente en Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

console.log('Supabase URL:', supabaseUrl); // Depuración
console.log('Supabase Key:', supabaseKey); // Depuración

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Exportar como default
export default supabase;
