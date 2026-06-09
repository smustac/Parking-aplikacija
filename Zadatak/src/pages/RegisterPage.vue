<template>

<q-card class="glass-card q-pa-lg">
  <q-card-section class="text-center">
    <div class="text-h5 text-white">Prijava</div>
  </q-card-section>

  <q-card-section>
     <div class="text-center q-mb-lg">
        <q-icon name="person_add" size="48px" color="primary" />
        <h4 class="q-mt-sm q-mb-xs">Napravi profil</h4>
        <p class="text-grey-7">Registrirajte se za početak</p>
      </div>

      <!-- Inputs -->
      <q-input 
      v-model="username" 
      label="Username" 
      filled class="q-mb-md" 
      prepend-icon="person" 
      label-color="white"
      input-class="text-white"/>
      <q-input 
      v-model="email" 
      label="Email" 
      type="email" 
      filled class="q-mb-md" 
      prepend-icon="email" 
      label-color="white"
      input-class="text-white"/>
      <q-input 
      v-model="password" 
      type="password" 
      label="Password" 
      filled class="q-mb-lg" 
      prepend-icon="lock" 
      label-color="white"
      input-class="text-white"/>

      <!-- Nicely positioned checkbox -->
      <div class="q-mb-lg q-pt-sm">
        <q-checkbox
          v-model="isInvalid"
          label="Invalid"
          class="q-mt-none"
          label-color="white"
        
        />
      </div>

      
      <q-btn label="Register" color="primary" size="lg" class="full-width q-mb-md" @click="registerUser" />





    <div v-if="message" class="q-mt-xl text-center">
      <h5>{{ message }}</h5>
    </div>

  </q-card-section>

  
</q-card>
</template>


<script setup>
import { ref } from 'vue'
import { api } from '../boot/api'

const username = ref('')
const email = ref('')
const password = ref('')
const isInvalid = ref(false)
const message = ref('')

async function registerUser() {
  if (!username.value || !email.value || !password.value) {
    message.value = 'Please fill in all fields'
    return
  }

  try {
    const response = await api.post('/register', {
      username: username.value,
      email: email.value,
      password: password.value,
      role: isInvalid.value ? 'Invalid' : 'Student'
    })

    message.value = response.data.message

    
    username.value = ''
    email.value = ''
    password.value = ''
    isInvalid.value = false

  } catch (err) {
    console.error('Registration error:', err)
    message.value = err.response?.data?.message || 'Registration failed'
  }
}
</script>

<style scoped>
.glass-card {
  width: 100%;
  max-width: 380px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  color: white
}
</style>
