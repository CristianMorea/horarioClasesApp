<template>
  <ion-header>
    <ion-toolbar>
      <ion-title class="text-center text-2xl font-bold custom-title">NOTAS</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <div class="button-container">
      <ion-button 
        @click="mostrarInput = !mostrarInput" 
        class="custom-button"
      >
        {{ mostrarInput ? 'Cancelar' : 'Agregar Nota' }}
      </ion-button>

      <ion-button 
        @click="cerrar" 
        class="custom-button"
      >
        Cerrar
      </ion-button>
    </div>

    <div v-if="mostrarInput" class="input-container">
      <ion-textarea
        v-model="nuevaNota"
        placeholder="Escribe tu nota aquí..."
        rows="6"  
        auto-grow   
        @keyup.enter="agregarNota"
        class="textarea-styled"
      ></ion-textarea>
      <ion-button @click="agregarNota" class="add-button">Agregar</ion-button>
    </div>

    <ion-list>
      <ion-item v-for="(nota, index) in notas" :key="index">
        <ion-label>{{ nota }}</ion-label>
        <ion-button slot="end" color="danger" @click="eliminarNota(index)">Eliminar</ion-button>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script>
import { useRouter } from 'vue-router'; // Importar useRouter para la navegación

export default {
  data() {
    return {
      nuevaNota: '',
      notas: JSON.parse(localStorage.getItem('notas')) || [], // Recuperar notas del localStorage
      mostrarInput: false, // Controlar la visibilidad del input
    };
  },

  setup() {
    const router = useRouter(); // Obtener el router para la navegación

    const cerrar = () => {
      router.push('/horario'); // Redirigir a la lista de horarios
    };

    return { cerrar }; // Hacer la función cerrar disponible en la plantilla
  },

  methods: {
    agregarNota() {
      if (this.nuevaNota.trim() !== '') {
        this.notas.push(this.nuevaNota);
        this.nuevaNota = ''; // Limpiar el campo de entrada
        this.guardarNotas(); // Guardar en localStorage
        this.mostrarInput = false; // Ocultar el input después de agregar
      }
    },
    eliminarNota(index) {
      this.notas.splice(index, 1); // Eliminar la nota
      this.guardarNotas(); // Guardar en localStorage
    },
    guardarNotas() {
      localStorage.setItem('notas', JSON.stringify(this.notas)); // Guardar notas en localStorage
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

body {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a todo el cuerpo */
}

/* Estilo para el botón Agregar */
ion-button {
  display: block; /* Hace que el botón se trate como un bloque */
  margin: 20px auto; /* Centra el botón y le da un margen superior e inferior */
  --background: #6c1e1e; /* Cambia el color de fondo */
  --color: white; /* Cambia el color del texto */
  --border-radius: 17px; /* Bordes redondeados */
  --height: 40px; /* Establece una altura para el botón */
  --min-width: 150px; /* Establece un ancho mínimo */
  --font-size: 16px; /* Ajusta el tamaño de la fuente */
}

.input-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 10px 0; /* Espaciado superior e inferior */
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

/* Aplica la fuente a todos los componentes de Ionic */
ion-title, ion-label, ion-input, ion-button, ion-card-title, ion-card-header {
  font-family: 'Architects Daughter', cursive; /* Asegura que estos componentes también usen la fuente */
}

ion-textarea {
  width: 80%; /* Cambié el ancho a 80% */
  margin-bottom: 10px; /* Espacio debajo del área de texto */
}

/* Personalización de los botones */
.custom-button {
  --height: 40px; /* Establece una altura más pequeña para los botones */
  --min-width: 120px; /* Establece un ancho mínimo */
  --border-radius: 15px; /* Redondeo de los bordes */
  --background: #6c1e1e; /* Cambia el color de fondo a un rojo más oscuro */
  --color: white; /* Cambia el color del texto */
  --box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Sombra suave */
  --font-size: 14px; /* Ajusta el tamaño de la fuente */
}

.custom-button:hover {
  --background: #6a1515; /* Cambia el color cuando el botón esté en hover */
}

/* Alineación de los botones al centro */
.button-container {
  display: flex;
  justify-content: center; /* Centra los botones */
  gap: 10px; /* Espacio entre los botones */
}

/* Estilo para el textarea */
.textarea-styled {
  border: 2.5px solid #6c1e1e; /* Bordes rojos */
  border-radius: 17px; /* Bordes redondeados */
  padding: 10px; /* Espaciado interno */
  width: 95%; /* Establece un ancho del 80% (puedes ajustarlo como desees) */
  font-size: 16px; /* Tamaño de fuente */
  background-color: transparent; /* Color de fondo */
  margin: 0 auto; /* Centra el textarea horizontalmente */
  display: block; /* Asegura que el margin auto funcione */
}

.textarea-styled:focus {
  outline: none; /* Elimina el borde azul por defecto al enfocar */
  border-color: #6e1919; /* Cambia el color del borde al enfocar */
}


/* Estilo para el botón "Agregar" */
.add-button {
  --height: 40px; /* Altura del botón */
  --min-width: 120px; /* Ancho mínimo */
  --border-radius: 15px; /* Bordes redondeados */
  --background: #6c1e1e; /* Color de fondo rojo */
  --color: white; /* Color de texto blanco */
  --font-size: 14px; /* Tamaño de la fuente */
  --box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Sombra */
}

.add-button:hover {
  --background: #8a2424; /* Color de fondo al pasar el mouse sobre el botón */
}
</style>
