import supabase from '../supabase';

export const requireAuth = async (to, from, next) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      // Si hay un error o no hay usuario autenticado, redirigir a la página de inicio de sesión
      next({ path: '/login' });
    } else {
      next(); // Si está autenticado, permitir la navegación
    }
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    next({ path: '/login' }); // Redirigir al login en caso de fallo
  }
};

