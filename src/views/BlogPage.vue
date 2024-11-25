<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="$router.push('/horario')" color="primary">
            <img src='@/assets/img/back.png' name="arrow-back" alt="Botón Horario" style="width: 24px; height: 24px;" />
          </ion-button>
        </ion-buttons>
        <ion-title class="text-center text-2xl font-bold custom-title">NOTA</ion-title>
     
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card class="recordatorio-card">
        <ion-card-header>
          <ion-card-title>Configura tu nota</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">Escribe tu nota</ion-label>
            <ion-input
              v-model="nota"
              type="text"  
              @ionChange="onNotaChange"
            ></ion-input>
          </ion-item>
          <ion-button class="butonR" @click="guardarNota">Guardar Nota</ion-button>
          <p v-if="mensaje">{{ mensaje }}</p>
        </ion-card-content>
      </ion-card>


      <!-- Lista de notas guardadas -->
      <ion-title>Notas Guardadas</ion-title>
      <div class="scrollable-content">
        <ion-item v-for="(item, index) in notas" :key="index"> 
          <ion-card class="recordatorio-card2">
            <ion-card-content>
              <ion-label>
                  <h2 class="text-lg font-bold">{{ item.nota }}</h2>
                  <p class="text-gray-400">Creada el: {{ item.fecha_creacion }}</p>
                  <p class="text-gray-400">Vence el: {{ item.fecha_vencimiento }}</p>
              </ion-label>
              <ion-button 
                  slot="end" 
                  color="danger" 
                  @click="eliminarNota(item.id_notas)"
                >
                  Eliminar
              </ion-button>
            </ion-card-content>
          </ion-card>
        </ion-item>
            <p v-if="notas.length === 0" class="text-center text-gray-500">
              No hay notas guardadas.
            </p>
      </div>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import supabase from '@/supabase';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
} from '@ionic/vue';

export default defineComponent({
  components: {
    IonButtons,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
  },
  setup() {
    const router = useRouter();
    const nota = ref('');
    const mensaje = ref('');
    const notas = ref([]); // Cambiar de string a array

    // Método para cargar las notas guardadas
    const cargarNotas = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        router.push('/');
        return;
      }

      const usuarioId = sessionData.session.user.id;
      const { data, error } = await supabase
        .from('Notas')
        .select('*')
        .eq('usuario_id', usuarioId);

      if (error) {
        console.error('Error al cargar las notas:', error);
        mensaje.value = 'Error al cargar las notas.';
      } else {
        console.log('Notas cargadas desde Supabase:', data);
        notas.value = data || [];
      }
    };

    // Método para eliminar una nota
    const eliminarNota = async (id: string) => {
      const { error } = await supabase.from('Notas').delete().eq('id_notas', id);

      if (error) {
        console.error('Error al eliminar la nota:', error);
        mensaje.value = 'Error al eliminar la nota.';
      } else {
        mensaje.value = 'Nota eliminada con éxito.';
        cargarNotas(); // Recargar las notas después de eliminar
      }
    };

    // Método para guardar una nueva nota
    const guardarNota = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        router.push('/');
        return;
      }

      const usuarioId = sessionData.session.user.id;

      if (!nota.value) {
        mensaje.value = 'Por favor ingresa la nota.';
        return;
      }

      const { error } = await supabase
        .from('Notas')
        .insert([
          {
            nota: nota.value,
            usuario_id: usuarioId,
            fecha_vencimiento: new Date().toISOString().split('T')[0],
            fecha_creacion: new Date().toLocaleTimeString('en-US', { hour12: false }),
          },
        ]);

      if (error) {
        console.error('Error al guardar la nota:', error);
        mensaje.value = `Error al guardar la nota: ${error.message}`;
      } else {
        mensaje.value = 'Nota guardada con éxito.';
        nota.value = '';
        cargarNotas(); // Recargar la lista de notas después de guardar
      }
    };

    // Invocar la carga de notas al montar el componente
    onMounted(async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.error('Error al obtener la sesión:', error);
        router.push('/');
        return;
      }
      await cargarNotas(); // Corrección del typo
    });

    return {
      nota,
      mensaje,
      notas,
      guardarNota,
      eliminarNota,
    };
  },
});
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

body {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a todo el cuerpo */
}

ion-title, ion-label, ion-button, ion-item, ion-card-title, ion-card-content {
  font-family: 'Architects Daughter', cursive;
}

.butonR {
  color: white;
}

ion-button {
  --background: #a22626;
  --background-activated: #a22626;
  --border-radius: 20px;
  margin-top: 1rem;
}

ion-card-title {
  color: rgb(124, 124, 124);

}

.scrollable-content {
  border: 3px solid transparent;
  max-height: 480px; /* Ajusta la altura máxima de la lista de materias */
  overflow-y: auto;  /* Habilita el scroll solo verticalmente */
  padding-right: 10px; /* Agrega un poco de espacio si es necesario para la barra de desplazamiento */
  border-radius: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 0px;
  margin-left: 10px; /* Reduce el espacio a la izquierda */
  margin-right: 10px; /* Reduce el espacio a la derecha */
}


.recordatorio-card {
  border-radius: 10px; /* Bordes redondeados */
  padding: 0px; /* Espaciado interno */
  margin-left: 10px; /* Espaciado lateral izquierdo */
  margin-right: 10px; /* Espaciado lateral derecho */
  
}

.recordatorio-card2 {
  width: 500px;
  height: auto; /* Ajusta según lo necesites */
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
