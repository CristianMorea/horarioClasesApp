<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="redirigirAhorarioPage" color="primary">
                <img src='@/assets/img/back.png' name="arrow-back" alt="Botón Horario" style="width: 24px; height: 24px;" />
            </ion-button>
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title class="text-center text-2xl font-bold custom-title">Nueva Tarea</ion-title>
      </ion-toolbar>
    </ion-header>

    
    <ion-content class="ion-padding">
      <div class="scrollable-content">
      <form @submit.prevent="guardarTarea">
        <ion-list>
          <!-- Nombre de la tarea -->
          <ion-item>
            <ion-label position="stacked">Nombre de la Tarea</ion-label>
            <ion-input v-model="tarea.nombre" type="text" required></ion-input>
          </ion-item>

          <!-- Descripción -->
          <ion-item>
            <ion-label position="stacked">Descripción</ion-label>
            <ion-textarea v-model="tarea.descripcion" required></ion-textarea>
          </ion-item>

          <!-- Fecha de entrega -->
          <ion-item>
            <ion-label position="stacked">Fecha de Entrega</ion-label>
            <ion-datetime class="fecha"
              v-model="tarea.fecha_entrega" 
              display-format="DD/MM/YYYY" 
              picker-format="DD MMM YYYY" 
              required>
            </ion-datetime>
          </ion-item>

          <!-- Período -->
          <ion-item>
            <ion-label>Número de Período</ion-label>
            <ion-select 
              v-model="tarea.Periodo" 
              placeholder="Seleccionar Período" 
              required>
              <ion-select-option :value="1">Período 1</ion-select-option>
              <ion-select-option :value="2">Período 2</ion-select-option>
              <ion-select-option :value="3">Período 3</ion-select-option>
            </ion-select>
          </ion-item>

          <!-- Clase asociada -->
          <ion-item>
            <ion-label>Clase</ion-label>
            <ion-select 
              v-model="tarea.id_clase" 
              placeholder="Seleccionar Clase" 
              required>
              <ion-select-option 
                v-for="clase in clases" 
                :key="clase.id" 
                :value="clase.id">
                {{ clase.nombre }}
              </ion-select-option>
            </ion-select>
          </ion-item>

          <!-- Estado -->
          <ion-item>
            <ion-label>Estado</ion-label>
            <ion-toggle v-model="tarea.estado"></ion-toggle>
          </ion-item>

          <!-- Nota (condicional) -->
          <ion-item v-if="tarea.estado">
            <ion-label position="stacked">Nota</ion-label>
            <ion-input 
              v-model.number="tarea.nota" 
              type="number" 
              min="0" 
              max="5" 
              step="0.1">
            </ion-input>
          </ion-item>
        </ion-list>

        <!-- Botón para guardar -->
        <ion-button expand="block" type="submit" >Guardar Tarea</ion-button>
      </form>
    </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonButton,
  toastController,
} from '@ionic/vue';
import { defineComponent, ref, onMounted } from 'vue';
import supabase from "@/supabase";

export default defineComponent({
  name: 'CrearTareaPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonButton,
  },
  data() {
    return {
      tarea: {
        nombre: "",
        descripcion: "",
        fecha_entrega: "",
        estado: false,
        Periodo: null,
        id_clase: null,
        nota: null,
      },
      clases: [],
    };
  },
  methods: {
    async guardarTarea() {
      try {
        // Validación
        if (!this.tarea.nombre || !this.tarea.descripcion || !this.tarea.fecha_entrega || this.tarea.Periodo == null || !this.tarea.id_clase) {
          const toast = await toastController.create({
            message: 'Por favor, completa todos los campos obligatorios.',
            duration: 2000,
            color: 'warning',
          });
          await toast.present();
          return;
        }

        // Inserción en Supabase
        const { data, error } = await supabase.from("tareas").insert([{
          nombre: this.tarea.nombre,
          descripcion: this.tarea.descripcion,
          fecha_entrega: this.tarea.fecha_entrega,
          estado: this.tarea.estado,
          Periodo: this.tarea.Periodo,
          id_clase: this.tarea.id_clase,
          nota: this.tarea.nota,
        }]);

        if (error) {
          const toast = await toastController.create({
            message: 'Error al guardar la tarea: ' + error.message,
            duration: 3000,
            color: 'danger',
          });
          await toast.present();
        } else {
          const toast = await toastController.create({
            message: 'Tarea guardada exitosamente',
            duration: 2000,
            color: 'success',
          });
          await toast.present();

          // Resetear formulario
          this.tarea = {
            nombre: "",
            descripcion: "",
            fecha_entrega: "",
            estado: false,
            Periodo: null,
            id_clase: null,
            nota: null,
          };

          // Navegar
          this.$router.push('/verDeveres');
        }
      } catch (error) {
        const toast = await toastController.create({
          message: 'Error inesperado: ' + error,
          duration: 3000,
          color: 'danger',
        });
        await toast.present();
      }
    },

    async obtenerClases() {
  try {
    // Obtener usuario actual
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!userData) throw new Error('Usuario no autenticado.');

    const user = userData.user;

    // Consulta para obtener las clases asociadas al usuario
    const { data: clasesData, error } = await supabase
      .from('clases')
      .select('id, nombre, ubicacion, hora_inicio, hora_fin, profesor_id')
      .eq('id_usuario', user.id); // Filtramos por el ID del usuario

    if (error) {
      console.error('Error al obtener las clases:', error);
      return;
    }

    if (!clasesData || clasesData.length === 0) {
      console.warn('No se encontraron clases asociadas a este usuario.');
      this.clases = []; // Asigna un arreglo vacío si no hay clases
      return;
    }

    // Asignar las clases obtenidas al estado
    this.clases = clasesData;
  } catch (error) {
    console.error('Error inesperado al obtener las clases:', error);
  }
},
    // Redirigir a la página de horario
    redirigirAhorarioPage() {
      this.$router.push('/calificaciones'); // Navega a la página de horario

  },
},
  mounted() {
    this.obtenerClases();
  },
  
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

body {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a todo el cuerpo */
}

.fecha{
  background: transparent;
}

ion-title, ion-label, ion-button, ion-item, ion-card-title, ion-card-content {
  font-family: 'Architects Daughter', cursive;
}

ion-list {
  background: transparent;
}

ion-item {
  margin-bottom: 16px;
}

.scrollable-content {
  border: 3px solid transparent;
  max-height: 775px; /* Ajusta la altura máxima de la lista de materias */
  overflow-y: auto;  /* Habilita el scroll solo verticalmente */
  padding-right: 10px; /* Agrega un poco de espacio si es necesario para la barra de desplazamiento */
  border-radius: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  padding: 0px;
  margin-left: -10px;
  margin-right: -10px;
  margin-top: -7px;
  background-color: transparent;
}

ion-button {
  margin-top: 10px;
  --background: #bf1a1a ; /* Cambia el color de fondo del botón */
  color: white;
}

</style>
