<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Crear Nueva Tarea</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <form @submit.prevent="guardarTarea">
        <ion-list>
          <ion-item>
            <ion-label position="floating">Nombre de la Tarea</ion-label>
            <ion-input 
              v-model="tarea.nombre" 
              type="text" 
              required
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Descripción</ion-label>
            <ion-textarea 
              v-model="tarea.descripcion" 
              required
            ></ion-textarea>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Fecha de Entrega</ion-label>
            <ion-datetime 
              v-model="tarea.fecha_entrega"
              display-format="DD/MM/YYYY"
              picker-format="DD MMM YYYY"
              required
            ></ion-datetime>
          </ion-item>

          <ion-item>
            <ion-label>Número de Período</ion-label>
            <ion-select 
              v-model="tarea.numeroPeriodo"
              placeholder="Seleccionar Período"
              required
            >
              <ion-select-option :value="1">Período 1</ion-select-option>
              <ion-select-option :value="2">Período 2</ion-select-option>
              <ion-select-option :value="3">Período 3</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label>Estado</ion-label>
            <ion-toggle 
              v-model="tarea.estado"
            ></ion-toggle>
          </ion-item>

          <!-- Campo para seleccionar la clase asociada -->
          <ion-item>
            <ion-label>Clase</ion-label>
            <ion-select 
              v-model="tarea.id_clase"
              placeholder="Seleccionar Clase"
              required
            >
              <ion-select-option 
                v-for="clase in clases" 
                :key="clase.id" 
                :value="clase.id"
              >
                {{ clase.nombre }}
              </ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>

        <div class="ion-padding">
          <ion-button 
            expand="block" 
            type="submit" 
            color="primary"
          >
            Guardar Tarea
          </ion-button>
        </div>
      </form>
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
  toastController
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
    IonButton
  },
  data() {
    return {
      tarea: {
        nombre: "",
        descripcion: "",
        fecha_entrega: "",
        estado: false,
        numeroPeriodo: null,
        id_clase: null, // Nuevo campo para la clase
      },
      clases: [] // Lista de clases disponibles
    };
  },
  methods: {
    async guardarTarea() {
      try {
        // Validación de campos
        if (!this.tarea.nombre || !this.tarea.descripcion || 
            !this.tarea.fecha_entrega || this.tarea.numeroPeriodo == null || !this.tarea.id_clase) {
          const toast = await toastController.create({
            message: 'Por favor, completa todos los campos.',
            duration: 2000,
            color: 'warning'
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
          Periodo: this.tarea.numeroPeriodo,
          id_clase: this.tarea.id_clase, // Insertamos el id_clase como la clave foránea
        }]);

        if (error) {
          const toast = await toastController.create({
            message: 'Error al guardar la tarea: ' + error.message,
            duration: 3000,
            color: 'danger'
          });
          await toast.present();
        } else {
          const toast = await toastController.create({
            message: 'Tarea guardada exitosamente',
            duration: 2000,
            color: 'success'
          });
          await toast.present();

          // Resetear formulario
          this.tarea = {
            nombre: "",
            descripcion: "",
            fecha_entrega: "",
            estado: false,
            numeroPeriodo: null,
            id_clase: null, // Limpiamos el campo de clase
          };

          // Opcional: navegar a otra página o realizar otra acción
          this.$router.push('/verDeveres');
        }
      } catch (error) {
        const toast = await toastController.create({
          message: 'Ocurrió un error inesperado: ' + error,
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    },

    async obtenerClases() {
      try {
        // Obtenemos las clases disponibles para el usuario autenticado
        const { data, error } = await supabase.from('clases').select('id, nombre');
        if (error) {
          const toast = await toastController.create({
            message: 'Error al obtener las clases: ' + error.message,
            duration: 3000,
            color: 'danger'
          });
          await toast.present();
          return;
        }
        this.clases = data || [];
      } catch (err) {
        console.error('Error al obtener las clases:', err);
      }
    }
  },

  // Cargar las clases disponibles al montar el componente
  mounted() {
    this.obtenerClases();
  }
});
</script>

<style scoped>
ion-list {
  background: transparent;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  margin-bottom: 16px;
}

ion-button {
  margin-top: 20px;
}
</style>
