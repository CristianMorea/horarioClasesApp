
import { createStore } from 'vuex';
import supabase from '../supabase';


const store = createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async logout({ commit }) {
      await supabase.auth.signOut();
      commit('setUser', null); // Limpiar el usuario en el estado
      console.log('Usuario deslogueado y estado actualizado'); // Para ver en la consola
    },
  },
});

export default store;
