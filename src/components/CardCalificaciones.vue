<script lang="ts">
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonLabel, IonInput, IonDatetime } from '@ionic/vue';
import { defineComponent } from 'vue';
import supabase from '../supabase';

export default defineComponent({
  components: {
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonLabel, IonInput, IonDatetime
  },
  data() {
    return {
      // Datos de la clase
      clase: {
        id: '', 
        nombre: '',
        ubicacion: '',
        hora_inicio: '',
        hora_fin: '',
        profesor_id: '',
      },
      profesor: {
        nombre: '',
      },
    };
  },
  async created() {
    try {
      // Obtén el usuario autenticado
      const user = supabase.auth.user();
      if (user) {
        // Consulta para obtener las clases asociadas al profesor del usuario autenticado
        const { data, error } = await supabase
          .from('clases')
          .select('id, nombre, ubicacion, hora_inicio, hora_fin, profesor_id')
          .eq('profesor_id', user.id)  // Filtra por el ID del profesor (usuario autenticado)
          .limit(1); // Limita a un solo registro si solo necesitas uno

        if (error) throw error;

        if (data && data.length > 0) {
          this.clase = {
            id: data[0].id,
            nombre: data[0].nombre || '',
            ubicacion: data[0].ubicacion || '',
            hora_inicio: data[0].hora_inicio || '',
            hora_fin: data[0].hora_fin || '',
            profesor_id: data[0].profesor_id || '',
          };

          // Ahora que tenemos el ID de la clase, obtenemos los datos del profesor
          await this.getProfesor(data[0].profesor_id);
        } else {
          console.error('No se encontraron clases para este usuario.');
        }
      } else {
        console.error('No hay usuario autenticado.');
      }
    } catch (err) {
      console.error('Error al obtener los datos desde Supabase:', err);
    }
  },
  methods: {
    // Obtener el nombre del profesor
    async getProfesor(profesorId: string) {
      try {
        const { data, error } = await supabase
          .from('profesores')
          .select('nombre')
          .eq('id', profesorId)
          .single(); // Traemos solo un profesor

        if (error) throw error;

        if (data) {
          this.profesor.nombre = data.nombre || '';
        } else {
          console.error('No se encontró el profesor.');
        }
      } catch (err) {
        console.error('Error al obtener los datos del profesor:', err);
      }
    },
  }
});
</script>
