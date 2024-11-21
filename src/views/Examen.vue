<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Crear Nuevo Examen</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <form @submit.prevent="guardarExamen">
        <ion-list>
          <ion-item>
            <ion-label position="floating">Nombre del Examen</ion-label>
            <ion-input 
              v-model="examen.nombre" 
              type="text" 
              required
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Descripción</ion-label>
            <ion-textarea 
              v-model="examen.descripcion" 
              required
            ></ion-textarea>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Fecha del Examen</ion-label>
            <ion-datetime 
              v-model="examen.fecha_examen"
              display-format="DD/MM/YYYY"
              picker-format="DD MMM YYYY"
              required
            ></ion-datetime>
          </ion-item>

          <ion-item>
            <ion-label>Período</ion-label>
            <ion-select 
              v-model="examen.Periodo"
              placeholder="Seleccionar Período"
              required
            >
              <ion-select-option :value="1">Período 1</ion-select-option>
              <ion-select-option :value="2">Período 2</ion-select-option>
              <ion-select-option :value="3">Período 3</ion-select-option>
           
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label>Clase</ion-label>
            <ion-select 
              v-model="examen.id_clase"
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

          <ion-item>
            <ion-label>Estado</ion-label>
            <ion-toggle 
              v-model="examen.estado"
            ></ion-toggle>
          </ion-item>
        </ion-list>

        <div class="ion-padding">
          <ion-button 
            expand="block" 
            type="submit" 
            color="primary"
          >
            Guardar Examen
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
import { defineComponent } from 'vue';
import supabase from "@/supabase";

export default defineComponent({
  name: 'CrearExamenPage',
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
      examen: {
        nombre: "",
        descripcion: "",
        fecha_examen: "",
        estado: false,
        Periodo: null,
        id_clase: null,  // Nuevo campo para almacenar la clase seleccionada
      },
      clases: [],  // Array para almacenar las clases obtenidas desde la base de datos
    };
  },
  methods: {
    // Método para obtener las clases desde la base de datos
    async obtenerClases() {
      try {
        const { data, error } = await supabase.from('clases').select('id, nombre');
        if (error) throw error;
        this.clases = data;
      } catch (error) {
        const toast = await toastController.create({
          message: 'Error al cargar las clases: ' + error.message,
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    },

    // Método para guardar el examen en la base de datos
    async guardarExamen() {
      try {
        // Validación de campos
        if (!this.examen.nombre || !this.examen.descripcion || 
            !this.examen.fecha_examen || this.examen.Periodo == null || this.examen.id_clase == null) {
          const toast = await toastController.create({
            message: 'Por favor, completa todos los campos.',
            duration: 2000,
            color: 'warning'
          });
          await toast.present();
          return;
        }

        // Inserción en Supabase
        const { data, error } = await supabase.from("examenes").insert([{
          nombre: this.examen.nombre,
          descripcion: this.examen.descripcion,
          fecha_examen: this.examen.fecha_examen,
          estado: this.examen.estado,
          Periodo: this.examen.Periodo,
          id_clase: this.examen.id_clase,  // Guardamos la relación con la clase
        }]);

        if (error) {
          const toast = await toastController.create({
            message: 'Error al guardar el examen: ' + error.message,
            duration: 3000,
            color: 'danger'
          });
          await toast.present();
        } else {
          const toast = await toastController.create({
            message: 'Examen guardado exitosamente',
            duration: 2000,
            color: 'success'
          });
          await toast.present();

          // Resetear formulario
          this.examen = {
            nombre: "",
            descripcion: "",
            fecha_examen: "",
            estado: false,
            Periodo: null,
            id_clase: null,
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
  },
  created() {
    // Cargar las clases al cargar la página
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
