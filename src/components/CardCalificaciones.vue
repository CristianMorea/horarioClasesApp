<template>
    <ion-card>
      <ion-card-header>
        <!-- Mostrar el nombre de la clase como título -->
        <ion-card-title>{{ clase.nombre }}</ion-card-title>
      </ion-card-header>
  
      <ion-card-content>
        <!-- Mostrar el nombre del profesor -->
        <p><strong>Profesor:</strong> {{ profesor.nombre }}</p>
        <p><strong>Ubicación:</strong> {{ clase.ubicacion }}</p>
        <p><strong>Hora de inicio:</strong> {{ clase.hora_inicio }}</p>
        <p><strong>Hora de fin:</strong> {{ clase.hora_fin }}</p>
  
        <!-- Fila de botones -->
        <div class="button-group">
          <!-- Botón para calificaciones -->
          <ion-button
            id="calificaciones-trigger"
            expand="full"
            color="primary"
            @click="showCalificaciones"
          >
            Calificaciones
          </ion-button>
          <ion-popover trigger="calificaciones-trigger">
            <ion-content class="ion-padding">
              <h2>Calificaciones</h2>
              <form @submit.prevent="submitCalificaciones">
                <ion-item>
                  <ion-label position="floating">Número de Corte</ion-label>
                  <ion-input v-model="calificacion.numero_corte" type="number" required></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Porcentaje Corte</ion-label>
                  <ion-input v-model="calificacion.porcentaje_corte" type="number" step="0.1" required></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Nota Final</ion-label>
                  <ion-input v-model="calificacion.nota_final" type="number" step="0.1" required></ion-input>
                </ion-item>
                <ion-button expand="full" type="submit" color="primary">Guardar</ion-button>
              </form>
            </ion-content>
          </ion-popover>
  
          <!-- Botón para tareas -->
          <ion-button
            id="tareas-trigger"
            expand="full"
            color="secondary"
            @click="showTareas"
          >
            Tareas
          </ion-button>
          <ion-popover trigger="tareas-trigger">
            <ion-content class="ion-padding">
              <h2>Tareas Pendientes</h2>
              <form @submit.prevent="submitTareas">
                <ion-item>
                  <ion-label position="floating">Descripción</ion-label>
                  <ion-input v-model="tarea.descripcion" required></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Fecha de Entrega</ion-label>
                  <ion-datetime v-model="tarea.fecha_entrega" required></ion-datetime>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Nota</ion-label>
                  <ion-input v-model="tarea.nota" type="number" step="0.1" required></ion-input>
                </ion-item>
                <ion-button expand="full" type="submit" color="secondary">Guardar</ion-button>
              </form>
            </ion-content>
          </ion-popover>
  
          <!-- Botón para exámenes -->
          <ion-button
            id="examenes-trigger"
            expand="full"
            color="tertiary"
            @click="showExamenes"
          >
            Exámenes
          </ion-button>
          <ion-popover trigger="examenes-trigger">
            <ion-content class="ion-padding">
              <h2>Exámenes Programados</h2>
              <form @submit.prevent="submitExamenes">
                <ion-item>
                  <ion-label position="floating">Descripción</ion-label>
                  <ion-input v-model="examen.descripcion" required></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Fecha del Examen</ion-label>
                  <ion-datetime v-model="examen.fecha_examen" required></ion-datetime>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Nota</ion-label>
                  <ion-input v-model="examen.nota" type="number" step="0.1" required></ion-input>
                </ion-item>
                <ion-button expand="full" type="submit" color="tertiary">Guardar</ion-button>
              </form>
            </ion-content>
          </ion-popover>
        </div>
      </ion-card-content>
    </ion-card>
  </template>
  
  <script lang="ts">
  import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonPopover, IonContent, IonItem, IonLabel, IonInput, IonDatetime } from '@ionic/vue';
  import { defineComponent } from 'vue';
  import supabase from '../supabase';
  
  export default defineComponent({
    components: {
      IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonPopover, IonContent, IonItem, IonLabel, IonInput, IonDatetime
    },
    data() {
      return {
        // Datos de la clase
        clase: {
          id: '', // Asegúrate de tener un campo para el ID de la clase (UUID)
          nombre: '',
          ubicacion: '',
          hora_inicio: '',
          hora_fin: '',
          profesor_id: '',
        },
        profesor: {
          nombre: '',
        },
        // Datos para las ventanas emergentes
        calificacion: {
          numero_corte: null,
          porcentaje_corte: null,
          nota_final: null,
        },
        tarea: {
          descripcion: '',
          fecha_entrega: '',
          nota: null,
        },
        examen: {
          descripcion: '',
          fecha_examen: '',
          nota: null,
        },
      };
    },
    async created() {
      try {
        // Consulta para obtener los datos de la clase, incluyendo su ID
        const { data, error } = await supabase
          .from('clases')
          .select('id, nombre, ubicacion, hora_inicio, hora_fin, profesor_id')
          .limit(1); // Limita a un solo registro si sólo necesitas uno
  
        if (error) throw error;
  
        if (data && data.length > 0) {
          this.clase = {
            id: data[0].id, // Asegúrate de tener el ID de la clase (UUID)
            nombre: data[0].nombre || '',
            ubicacion: data[0].ubicacion || '',
            hora_inicio: data[0].hora_inicio || '',
            hora_fin: data[0].hora_fin || '',
            profesor_id: data[0].profesor_id || '',
          };
  
          // Ahora que tenemos el ID de la clase, obtenemos los datos del profesor
          await this.getProfesor(data[0].profesor_id);
        } else {
          console.error('No se encontraron registros.');
        }
      } catch (err) {
        console.error('Error al obtener los datos desde Supabase:', err);
      }
    },
    methods: {
      // Obtener el nombre del profesor
      async getProfesor(profesorId: string) {
        try {
          const { data, error } = await supabase
            .from('profesores')
            .select('nombre')
            .eq('id', profesorId)
            .single(); // Traemos solo un profesor
  
          if (error) throw error;
  
          if (data) {
            this.profesor.nombre = data.nombre || '';
          } else {
            console.error('No se encontró el profesor.');
          }
        } catch (err) {
          console.error('Error al obtener los datos del profesor:', err);
        }
      },
  
      // Mostrar calificaciones
      showCalificaciones() {
        console.log('Mostrar calificaciones');
      },
  
      // Mostrar tareas
      showTareas() {
        console.log('Mostrar tareas');
      },
  
      // Mostrar exámenes
      showExamenes() {
        console.log('Mostrar exámenes');
      },
  
      // Guardar calificación
      async submitCalificaciones() {
        // Asegurarse de que tenemos el ID de la clase
        if (!this.clase.id) {
          console.error('No se ha encontrado el ID de la clase.');
          return;
        }
  
        try {
          const { error } = await supabase.from('calificaciones').insert([{
            clase_id: this.clase.id,  // Usamos el ID de la clase (UUID)
            numero_corte: this.calificacion.numero_corte,
            porcentaje_corte: this.calificacion.porcentaje_corte,
            nota_final: this.calificacion.nota_final,
          }]);
  
          if (error) {
            console.error('Error al guardar la calificación:', error);
          } else {
            console.log('Calificación guardada correctamente');
          }
        } catch (err) {
          console.error('Error al intentar guardar la calificación:', err);
        }
      },
  
      // Guardar tarea
      async submitTareas() {
        try {
          const { error } = await supabase.from('tareas').insert([{
            descripcion: this.tarea.descripcion,
            fecha_entrega: this.tarea.fecha_entrega,
            nota: this.tarea.nota,
          }]);
  
          if (error) {
            console.error('Error al guardar la tarea:', error);
          } else {
            console.log('Tarea guardada correctamente');
          }
        } catch (err) {
          console.error('Error al intentar guardar la tarea:', err);
        }
      },
  
      // Guardar examen
      async submitExamenes() {
        try {
          const { error } = await supabase.from('examenes').insert([{
            descripcion: this.examen.descripcion,
            fecha_examen: this.examen.fecha_examen,
            nota: this.examen.nota,
          }]);
  
          if (error) {
            console.error('Error al guardar el examen:', error);
          } else {
            console.log('Examen guardado correctamente');
          }
        } catch (err) {
          console.error('Error al intentar guardar el examen:', err);
        }
      }
    }
  });
  </script>
  
  <style scoped>
  .button-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }
  
  ion-button {
    margin-bottom: 10px;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  </style>