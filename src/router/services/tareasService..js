import supabase from '../supabase';

export const obtenerTareas = async (idClase) => {
  const { data, error } = await supabase
    .from('tareas')
    .select('id_tareas, nombre, descripcion, fecha_entrega, estado, "Periodo"')
    .eq('id_clase', idClase);

  if (error) {
    console.error('Error al obtener las tareas:', error.message);
    return [];
  }

  return data || [];
};

export const eliminarTarea = async (idTarea) => {
  const { error } = await supabase
    .from('tareas')
    .delete()
    .eq('id_tareas', idTarea);

  if (error) {
    console.error('Error al eliminar la tarea:', error.message);
    return false;
  }

  return true;
};
