<template>
  <ion-page class="h-screen bg-white flex">
    <MenuComponent content-id="main-content" />
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title class="text-center text-2xl font-bold custom-title">CALENDARIO</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content id="main-content" ref="content">
      <!-- Selección de Fecha -->
      <div class="fecha-eventos-container">
        <ion-item>
          <ion-datetime
            display-format="DDD, MMM, D"
            v-model="selectedDate"
            @ionChange="onDateChange"
          ></ion-datetime>
        </ion-item>
      </div>

      <!-- Lista de Pendientes -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Pendientes para {{ formattedDate }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div v-if="filteredEvents.length">
            <ion-item
              v-for="event in filteredEvents"
              :key="event.id"
              class="event-item"
            >
              <ion-label>
                <h2>{{ event.description }}</h2>
                <p>{{ event.time }}</p>
              </ion-label>
              <ion-button
                color="danger"
                @click="deleteEvent(event.id)"
                slot="end"
              >
                Eliminar
              </ion-button>
            </ion-item>
          </div>
          <div v-else>
            <p>No hay pendientes para esta fecha.</p>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Formulario para Agregar Pendientes -->
      <ion-card v-if="showAddForm" ref="addForm">
        <ion-card-header>
          <ion-card-title>Agregar Nuevo Pendiente</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">Descripción</ion-label>
            <ion-input
              placeholder="Escribe una descripción"
              v-model="newEvent.description"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Hora</ion-label>
            <ion-input
              type="time"
              placeholder="Selecciona una hora"
              v-model="newEvent.time"
            ></ion-input>
          </ion-item>
          <ion-button expand="block" @click="addEvent">Agregar Pendiente</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
    
    <div class="bottom-image-container2">
      <img :src="horarioImage" @click="horarioPage" class="button-image2" style="cursor: pointer;"/>
    </div>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonDatetime,
  IonInput,
  IonButton,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonButtons,
} from "@ionic/vue";
import { useRouter } from 'vue-router';
import MenuComponent from "../components/MenuComponent.vue";
import horarioImage from '@/assets/img/botonCalendario.png';

export default defineComponent({
  name: "CalendarioPage",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    MenuComponent,
    IonMenuButton,
    IonContent,
    IonItem,
    IonLabel,
    IonContent,
    IonDatetime,
    IonInput,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonButtons,
  },
  setup() {
    const selectedDate = ref(new Date().toISOString().split("T")[0]); // Fecha actual
    const events = ref<{ id: number; date: string; description: string; time: string }[]>([]);
    const newEvent = ref({ description: "", time: "" });
    const showAddForm = ref(false); // Controla la visibilidad del formulario
    const addFormRef = ref(null); // Referencia al formulario
    const contentRef = ref(null); // Referencia al contenido principal
    const horarioImageRef = ref(horarioImage);
    const router = useRouter();

    // Formato de fecha
    const formattedDate = computed(() =>
      new Date(selectedDate.value).toLocaleDateString()
    );

    const horarioPage = () => {
      router.push('/'); 
    };

    // Filtrar eventos por fecha seleccionada
    const filteredEvents = computed(() =>
      events.value.filter((event) => event.date === selectedDate.value)
    );

    // Agregar nuevo pendiente
    const addEvent = () => {
      if (newEvent.value.description && newEvent.value.time) {
        events.value.push({
          id: Date.now(),
          date: selectedDate.value,
          description: newEvent.value.description,
          time: newEvent.value.time,
        });
        newEvent.value.description = "";
        newEvent.value.time = "";
      }
      showAddForm.value = false; // Oculta el formulario después de agregar
    };

    // Eliminar pendiente
    const deleteEvent = (id: number) => {
      events.value = events.value.filter((event) => event.id !== id);
    };

    // Mostrar formulario al cambiar la fecha
    const onDateChange = () => {
      showAddForm.value = true;
    };

    // Guardar y cerrar formulario si se hace clic fuera de él
    const handleClickOutside = (event: MouseEvent) => {
      const addFormElement = addFormRef.value;
      const contentElement = contentRef.value;

      if (
        showAddForm.value &&
        addFormElement &&
        !addFormElement.contains(event.target as Node) &&
        contentElement &&
        contentElement.contains(event.target as Node)
      ) {
        addEvent();
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      selectedDate,
      formattedDate,
      events,
      filteredEvents,
      newEvent,
      showAddForm,
      horarioImage: horarioImageRef,
      horarioPage,
      addEvent,
      deleteEvent,
      onDateChange,
      handleClickOutside,
      addFormRef,
      contentRef,
    };
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

body {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a todo el cuerpo */
}

.fecha-eventos-container {
  margin: 20px;
}

ion-title, ion-label, ion-button, ion-item, ion-card-title, ion-card-content {
  font-family: 'Architects Daughter', cursive;
}


:root {
  --ion-color-step-50: #ffffff; /* Fondo blanco para temas claros */
}

.dark {
  --ion-color-step-50: #000000; /* Fondo negro para temas oscuros */
}

/* Personalizar el ion-datetime */
ion-datetime {
  --background: var(--ion-color-step-50); /* Fondo dinámico según el tema */
  --color: var(--ion-color-step-900); /* Texto visible según el tema */
}

.bottom-image-container2 {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  z-index: 100; /* Prioriza sobre otros elementos */
  padding: 10px;
  height: auto;
  border-radius: 15px;
  width: 70px; /* Ajusta el ancho según tus necesidades */
}

.event-item ion-label {
  flex: 1;
}

.event-item ion-button {
  margin-left: 10px;
}

.custom-title {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente al título */
}

.text-materia {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a los títulos de las materias */
}

.text-ponde {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a los títulos de las materias */
}
</style>
