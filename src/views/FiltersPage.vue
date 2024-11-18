<template>
    <ion-content>
      <ion-header translucent>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="redirigirAhorarioPage" color="primary">
                <img src='@/assets/img/back.png' name="arrow-back" alt="Botón Horario" style="width: 24px; height: 24px;" />
            </ion-button>
          </ion-buttons>
          <ion-title class="text-center text-2xl font-bold custom-title">
            FILTROS
          </ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-searchbar
        v-model="buscar"
        placeholder="Buscar"
        debounce="300"
        animated
      ></ion-searchbar>
  
      <ion-card>
        <ion-item>
          <ion-label>Seleccione una opción</ion-label>
          <ion-select v-model="seleccionado" placeholder="Seleccionar">
            <ion-select-option value="materias">Materias</ion-select-option>
            <ion-select-option value="talleres">Talleres</ion-select-option>
            <ion-select-option value="quizzes">Quizzes</ion-select-option>
            <ion-select-option value="examenes">Exámenes</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-card>
  
      <div v-if="seleccionado === 'materias'">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Materias</ion-card-title>
          </ion-card-header>
          <ion-list>
            <ion-item v-for="(materia, index) in materias" :key="index">
              <ion-label>{{ materia.nombre }}</ion-label>
              <ion-input
                type="number"
                placeholder="Porcentaje Corte 1"
                v-model.number="materia.porcentajeCorte1"
              ></ion-input>
              <ion-input
                type="number"
                placeholder="Porcentaje Corte 2"
                v-model.number="materia.porcentajeCorte2"
              ></ion-input>
              <ion-input
                type="number"
                placeholder="Porcentaje Corte 3"
                v-model.number="materia.porcentajeCorte3"
              ></ion-input>
            </ion-item>
          </ion-list>
        </ion-card>
      </div>
  
      <div v-else-if="['talleres', 'quizzes', 'examenes'].includes(seleccionado)">
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ seleccionado }}</ion-card-title>
          </ion-card-header>
          <ion-list>
            <ion-item
              v-for="(elemento, index) in elementosSeleccionados"
              :key="index"
            >
              <ion-label>{{ elemento.nombre }}</ion-label>
              <ion-input
                type="number"
                placeholder="Nota"
                v-model.number="elemento.nota"
              ></ion-input>
            </ion-item>
          </ion-list>
        </ion-card>
      </div>
  
      <div class="button-container">
        <ion-button expand="block" class="button-guardar" @click="guardarCambios">
          Guardar Cambios
        </ion-button>
        <ion-button expand="block" class="button-agregar" @click="agregar">
          Agregar
        </ion-button>
      </div>
    </ion-content>
  </template>
  
  <script>
  import { ref, computed } from "vue";
  import { useRouter } from 'vue-router';
  
  export default {
    name: "Filtros",
    setup() {
      const router = useRouter(); // Hook de Vue Router para la navegación
      const buscar = ref("");
      const seleccionado = ref("");
      const materias = ref([
        {
          nombre: "Matemáticas",
          porcentajeCorte1: 30,
          porcentajeCorte2: 30,
          porcentajeCorte3: 40,
        },
        {
          nombre: "Ciencias",
          porcentajeCorte1: 25,
          porcentajeCorte2: 30,
          porcentajeCorte3: 45,
        },
      ]);
      const talleres = ref([
        { nombre: "Taller 1", nota: 4.5 },
        { nombre: "Taller 2", nota: 4.0 },
      ]);
      const quizzes = ref([
        { nombre: "Quiz 1", nota: 4.8 },
        { nombre: "Quiz 2", nota: 4.2 },
      ]);
      const examenes = ref([
        { nombre: "Examen 1", nota: 4.9 },
        { nombre: "Examen 2", nota: 4.1 },
      ]);
  
      const elementosSeleccionados = computed(() => {
        if (seleccionado.value === "talleres") return talleres.value;
        if (seleccionado.value === "quizzes") return quizzes.value;
        if (seleccionado.value === "examenes") return examenes.value;
        return [];
      });
  
      const guardarCambios = () => {
        console.log("Cambios guardados:", {
          materias,
          talleres,
          quizzes,
          examenes,
        });
      };
  
      const agregar = () => {
        if (seleccionado.value === "materias") {
          materias.value.push({
            nombre: "Nueva Materia",
            porcentajeCorte1: 0,
            porcentajeCorte2: 0,
            porcentajeCorte3: 0,
          });
        } else if (seleccionado.value === "talleres") {
          talleres.value.push({ nombre: "Nuevo Taller", nota: 0 });
        } else if (seleccionado.value === "quizzes") {
          quizzes.value.push({ nombre: "Nuevo Quiz", nota: 0 });
        } else if (seleccionado.value === "examenes") {
          examenes.value.push({ nombre: "Nuevo Examen", nota: 0 });
        }
      };
  
      const redirigirAhorarioPage = () => {
        router.push('/horario'); // Navega a la página de horario
      };
  
      return {
        buscar,
        seleccionado,
        materias,
        talleres,
        quizzes,
        examenes,
        elementosSeleccionados,
        guardarCambios,
        agregar,
        redirigirAhorarioPage,
      };
    },
  };
  </script>
  
  <style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap");
  
  body {
    font-family: "Architects Daughter", cursive;
  }
  
  .button-container {
    display: flex; /* Activa Flexbox */
    justify-content: center; /* Centra horizontalmente */
    align-items: center; /* Centra verticalmente */
    padding: 1rem; /* Espaciado interno */
    gap: 1rem; /* Espaciado entre los botones */
  }
  
  .custom-title {
    font-family: "Architects Daughter", cursive;
  }
  
  .button-guardar {
    --background: #631818; /* Verde */
    --background-hover: #631818; /* Verde oscuro */
    --color: #ffffff;
    height: 50px; /* Altura ajustada */
    font-size: 12px; /* Tamaño de texto reducido */
    padding: 0 12px; /* Reducción del relleno */
    width: 160px; /* Ancho ajustado */
  }
  
  .button-agregar {
    --background: #631818; /* Azul */
    --background-hover: #631818; /* Azul oscuro */
    --color: #ffffff;
    height: 50px; /* Altura ajustada */
    font-size: 12px; /* Tamaño de texto reducido */
    padding: 0 12px; /* Reducción del relleno */
    width: 160px; /* Ancho ajustado */
  }
  </style>
  