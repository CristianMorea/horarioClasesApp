import supabase from '../supabase';

export const obtenerExamenes = async (idClase) => {
  const { data, error } = await supabase
    .from('examenes')
    .select('id, descripcion, fecha_examen, nombre, estado, "Periodo"')
    .eq('id_clase', idClase);

  if (error) {
    console.error('Error al obtener los exámenes:', error.message);
    return [];
  }

  return data || [];
};

export const eliminarExamen = async (idExamen) => {
  const { error } = await supabase
    .from('examenes')
    .delete()
    .eq('id', idExamen);

  if (error) {
    console.error('Error al eliminar el examen:', error.message);
    return false;
  }

  return true;
};
