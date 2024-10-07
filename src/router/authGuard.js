// src/router/authGuard.js
import supabase from '../supabase';

export const requireAuth = async (to, from, next) => {
  const { data: { user } } = await supabase.auth.getUser(); // Obtener el usuario autenticado

  if (!user) {
    // Si no hay usuario autenticado, redirigir a la página de inicio de sesión
    next({ path: '/login' });
  } else {
    next(); // Si está autenticado, permitir la navegación
  }
};
