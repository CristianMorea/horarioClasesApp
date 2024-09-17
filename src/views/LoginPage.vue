<template>
    <div class="login">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login" ref="loginForm">
        <div class="user-box">
          <input type="email" v-model="email" required>
          <label>Correo Electrónico</label>
        </div>
        <div class="user-box">
          <input type="password" v-model="password" required>
          <label>Contraseña</label>
        </div>
        <button type="submit" :disabled="submitting">Iniciar Sesión</button>
      </form>
      <button @click="showRegisterForm">Registrarse</button>
    </div>
  </template>
  
  <script>
 
  </script>
  
  <style scoped>
  .login {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    padding: 40px;
    transform: translate(-50%,-50%);
    background: rgba(0, 0, 0, 0.719);
    box-sizing: border-box;
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
    border-radius: 10px;
    font-family: sans-serif;
  }
  
  .login h2 {
    margin: 0 0 30px;
    padding: 0;
    color: #fff;
    text-align: center;
  }
  
  .user-box {
    position: relative;
  }
  
  .user-box input {
    width: 100%;
    padding: 10px 0;
    font-size: 16px;
    color: #fff;
    margin-bottom: 30px;
    border: none;
    border-bottom: 1px solid #fff;
    outline: none;
    background: transparent;
  }
  
  .user-box label {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px 0;
    font-size: 16px;
    color: #fff;
    pointer-events: none;
    transition: .5s;
  }
  
  .user-box input:focus ~ label,
  .user-box input:valid ~ label {
    top: -20px;
    left: 0;
    color: #03e9f4;
    font-size: 12px;
  }
  
  button[type="submit"],
  button {
    display: block;
    width: 100%;
    padding: 10px 0;
    color: #03e9f4;
    font-size: 16px;
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    transition: .5s;
    margin-top: 40px;
    letter-spacing: 4px;
    background: transparent;
    border: none;
    cursor: pointer;
  }
  
  button[type="submit"]:hover,
  button:hover {
    background: #03e9f4;
    color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px #03e9f4,
                0 0 25px #03e9f4,
                0 0 50px #03e9f4,
                0 0 100px #03e9f4;
  }
  </style>
  