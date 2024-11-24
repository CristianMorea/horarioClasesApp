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
        <ion-title class="text-center text-2xl font-bold custom-title">Nuevo Examen</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <div class="scrollable-content">
      <form @submit.prevent="guardarExamen">
        <ion-list>
          <!-- Nombre del examen -->
          <ion-item>
            <ion-label position="stacked">Nombre del Examen</ion-label>
            <ion-input 
              v-model="examen.nombre" 
              type="text" 
              required
            ></ion-input>
          </ion-item>

          <!-- Descripción -->
          <ion-item>
            <ion-label position="stacked">Descripción</ion-label>
            <ion-textarea 
              v-model="examen.descripcion" 
              required
            ></ion-textarea>
          </ion-item>

          <!-- Fecha del examen -->
          <ion-item>
            <ion-label position="stacked">Fecha del Examen</ion-label>
            <ion-datetime class="fecha"
              v-model="examen.fecha_examen"
              display-format="DD/MM/YYYY"
              picker-format="DD MMM YYYY"
              required
            ></ion-datetime>
          </ion-item>

          <!-- Período -->
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

          <!-- Clase asociada -->
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

          <!-- Estado -->
          <ion-item>
            <ion-label>Estado</ion-label>
            <ion-toggle 
              v-model="examen.estado"
            ></ion-toggle>
          </ion-item>
        

          <!-- Nota -->
          <ion-item>
            <ion-label position="stacked">Nota</ion-label>
            <ion-input 
              v-model.number="examen.nota" 
              type="number" 
              min="0" 
              max="5" 
              step="0.1" 
              placeholder="Ingresa la nota"
              required
            ></ion-input>
          </ion-item>
        </ion-list>


      </form>
    </div>
    </ion-content>
    <div>
          <ion-button 
            expand="block" 
            type="submit" 
          >
            Guardar Examen
          </ion-button>
        </div>
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
        id_clase: null,
        nota: null,
      },
      clases: [],  // Array para almacenar las clases obtenidas desde la base de datos
    };
  },
  methods: {
    
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

    async guardarExamen() {
      try {
        // Validar que todos los campos estén completos
        if (!this.examen.nombre || !this.examen.descripcion || 
            !this.examen.fecha_examen || this.examen.Periodo == null || 
            this.examen.id_clase == null || this.examen.nota == null) { // Validar nota
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
          id_clase: this.examen.id_clase,
          nota: this.examen.nota,
        }]);

        if (error) {
          const toast = await toastController.create({
            message: 'Error al guardar el examen: ' + error.message,
            duration: 3000,
            color: 'danger',
          });
          await toast.present();
        } else {
          const toast = await toastController.create({
            message: 'Examen guardado exitosamente',
            duration: 2000,
            color: 'success',
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
            nota: null,
          };

          
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
  max-height: 713px; /* Ajusta la altura máxima de la lista de materias */
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
