<template>
    <div class="form-container">
      <form @submit.prevent="guardarTarea" class="form">
        <label for="nombre">Nombre de la tarea:</label>
        <input type="text" v-model="nombre" id="nombre" required class="input-field" />
  
        <label for="descripcion">Descripción:</label>
        <textarea v-model="descripcion" id="descripcion" required class="input-field"></textarea>
  
        <label for="fecha_entrega">Fecha de entrega:</label>
        <input type="date" v-model="fecha_entrega" id="fecha_entrega" required class="input-field" />
  
        <label for="estado">Estado:</label>
        <select v-model="estado" id="estado" required class="input-field">
          <option value="true">Completada</option>
          <option value="false">Pendiente</option>
        </select>
  
        <label for="periodo">Periodo (UUID):</label>
        <input type="text" v-model="periodo" id="periodo" required class="input-field" />
  
        <button type="submit" class="submit-button">Guardar tarea</button>
      </form>
    </div>
  </template>
  
  <script>
  import supabase from '@/supabase';
  
  export default {
    data() {
      return {
        nombre: '',
        descripcion: '',
        fecha_entrega: '',
        estado: false,
        periodo: '', // Aquí se asume que el periodo es un UUID que debes obtener previamente
      };
    },
    methods: {
      async guardarTarea() {
        const { data, error } = await supabase
          .from('tareas')
          .insert([
            {
              nombre: this.nombre,
              descripcion: this.descripcion,
              fecha_entrega: this.fecha_entrega,
              estado: this.estado,
              periodo: this.periodo,
            },
          ]);
  
        if (error) {
          console.error('Error al insertar tarea:', error.message);
        } else {
          console.log('Tarea guardada exitosamente:', data);
          // Resetear el formulario si lo deseas
          this.nombre = '';
          this.descripcion = '';
          this.fecha_entrega = '';
          this.estado = false;
          this.periodo = '';
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos generales */
  .form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f4f4f4;
  }
  
  .form {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #333;
  }
  
  .input-field {
    width: 100%;
    padding: 8px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    box-sizing: border-box;
  }
  
  .input-field:focus {
    border-color: #007bff;
    outline: none;
  }
  
  .submit-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 4px;
    width: 100%;
  }
  
  .submit-button:hover {
    background-color: #0056b3;
  }
  
  .submit-button:focus {
    outline: none;
  }
  </style>
  