<template>
    <swiper
      :slides-per-view="1"
      :space-between="20"
      :loop="notas.length > 1"
      :autoplay="{ delay: 3000 }"
    >
      <swiper-slide v-for="nota in notas" :key="nota.id_notas">
        <ion-card class="nota-card">
          <ion-card-header>
            <ion-card-title>{{ nota.nota }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>Creada: {{ formatDate(nota.fecha_creacion) }}</p>
            <p>Vence: {{ formatDate(nota.fecha_vencimiento) }}</p>
          </ion-card-content>
        </ion-card>
      </swiper-slide>
    </swiper>
    <p v-if="mensaje">{{ mensaje }}</p>
  </template>
  
  <script>
  import {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
  } from '@ionic/vue';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import 'swiper/css';
  import 'swiper/css/autoplay';
  import { ref, onMounted } from 'vue';
  import supabase from '@/supabase';
  
  export default {
    name: 'NotesCarousel',
    components: {
      IonCard,
      IonCardHeader,
      IonCardTitle,
      IonCardContent,
      Swiper,
      SwiperSlide,
    },
    setup() {
      const notas = ref([]);
      const mensaje = ref('');
  
      onMounted(async () => {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session) {
          const usuarioId = sessionData.session.user.id;
  
          const { data, error } = await supabase
            .from('Notas')
            .select('*')
            .eq('usuario_id', usuarioId);
  
          if (error) {
            console.error('Error al obtener las notas:', error);
            mensaje.value = 'Error al cargar tus notas.';
          } else {
            notas.value = data;
          }
        }
      });
  
      const formatDate = (date) => new Date(date).toLocaleDateString();
  
      return {
        notas,
        mensaje,
        formatDate,
      };
    },
  };
  </script>
  
  <style>
  .nota-card {
    background-color: #fef3c7; /* Amarillo claro */
    border: 1px dashed #f59e0b; /* Línea de borde tipo papel */
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombras suaves */
    font-family: 'Architects Daughter', cursive; /* Fuente manuscrita */
    padding: 16px;
  }
  
  .nota-card ion-card-title {
    color: #92400e; /* Tono oscuro */
    font-weight: bold;
  }
  
  .nota-card ion-card-content p {
    margin: 4px 0;
    font-size: 14px;
  }
  </style>
  