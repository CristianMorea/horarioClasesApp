<template>
    <div class="form-container">
      <form @submit.prevent="guardarTarea" class="form">
        <label for="nombre">Nombre de la tarea:</label>
        <input 
          type="text" 
          v-model="tarea.nombre" 
          id="nombre" 
          required 
          class="input-field" 
        />
  
        <label for="descripcion">Descripción:</label>
        <textarea 
          v-model="tarea.descripcion" 
          id="descripcion" 
          required 
          class="input-field"
        ></textarea>
  
        <label for="fecha_entrega">Fecha de entrega:</label>
        <input 
          type="date" 
          v-model="tarea.fecha_entrega" 
          id="fecha_entrega" 
          required 
          class="input-field" 
        />
  
        <label for="estado">Estado:</label>
        <select 
          v-model="tarea.estado" 
          id="estado" 
          required 
          class="input-field"
        >
          <option :value="true">Completada</option>
          <option :value="false">Pendiente</option>
        </select>
  
        <label for="numeroPeriodo">Periodo (ID numérico):</label>
        <input 
          type="number" 
          v-model="tarea.numeroPeriodo" 
          id="numeroPeriodo" 
          required 
          class="input-field" 
        />
  
        <button 
          type="submit" 
          class="submit-button"
        >
          Guardar tarea
        </button>
      </form>
    </div>
  </template>
  
  <script>
  import supabase from "@/supabase";
  
  export default {
    data() {
      return {
        tarea: {
          nombre: "",
          descripcion: "",
          fecha_entrega: "",
          estado: false,
          numeroPeriodo: null,  // Se mantiene el tipo numérico
        },
      };
    },
    methods: {
      async guardarTarea() {
        try {
          // Validar datos antes de enviarlos
          if (!this.tarea.nombre || !this.tarea.descripcion || !this.tarea.fecha_entrega || this.tarea.numeroPeriodo == null) {
            alert("Por favor, completa todos los campos.");
            return;
          }
  
          // Enviar datos a la tabla `tareas` en Supabase
          const { data, error } = await supabase.from("tareas").insert([
            {
              nombre: this.tarea.nombre,
              descripcion: this.tarea.descripcion,
              fecha_entrega: this.tarea.fecha_entrega,
              estado: this.tarea.estado,
              Periodo: this.tarea.numeroPeriodo,  // Usando 'Periodo' correctamente
            }
          ]);
  
          if (error) {
            console.error("Error al insertar tarea:", error.message);
            alert("Hubo un error al guardar la tarea.");
          } else {
            console.log("Tarea guardada exitosamente:", data);
            alert("Tarea guardada exitosamente.");
  
            // Resetear formulario
            this.tarea = {
              nombre: "",
              descripcion: "",
              fecha_entrega: "",
              estado: false,
              numeroPeriodo: null,  // Restablecer al valor inicial
            };
          }
        } catch (error) {
          console.error("Error al guardar tarea:", error);
          alert("Ocurrió un error inesperado.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos ya presentes, no se modifican */
  </style>
  