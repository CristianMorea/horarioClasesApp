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
  import { defineComponent } from 'vue';
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
        }
      };
    },
    methods: {
      async guardarTarea() {
        try {
          // Validación de campos
          if (!this.tarea.nombre || !this.tarea.descripcion || 
              !this.tarea.fecha_entrega || this.tarea.numeroPeriodo == null) {
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
            };
  
            // Opcional: navegar a otra página o realizar otra acción
            this.$router.push('/tareas');
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