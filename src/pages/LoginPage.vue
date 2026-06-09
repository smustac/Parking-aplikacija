<template>

<q-card class="glass-card q-pa-lg">
  <q-card-section class="text-center">
    <div class="text-h5 text-white">Prijava</div>
  </q-card-section>

  <q-card-section>
     <div class="text-center q-mb-lg">
        <q-icon name="lock" size="48px" color="primary" />
        <h4 class="q-mt-sm q-mb-xs">Dobrodošli</h4>
        <p class="text-grey-7">Molimo ulogirajte se</p>
      </div>

      <q-input
        v-model="email"
        label="Email"
        filled
        type="email"
        class="q-mb-md"
        prepend-icon="email"
        label-color="white"
        input-class="text-white"
      />

      <q-input
        v-model="password"
        type="password"
        label="Password"
        filled
        class="q-mb-lg"
        prepend-icon="lock"
        label-color="white"
        input-class="text-white"
      />

      <q-btn
        label="Login"
        color="primary"
        class="full-width q-mb-md"
        size="lg"
        @click="loginUser"
      />

      <q-btn
        label="Admin Access"
        flat
        color="primary"
        class="full-width"
        @click="goToAdmin"
      />

      <q-btn 
        label="Continue as Guest" 
        flat color="primary" 
        class="full-width q-mb-md" 
        @click="loginGuest"/>




    <div v-if="message" class="q-mt-xl text-center">
      <h5>{{ message }}</h5>
    </div>

  </q-card-section>

  
</q-card>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '../boot/api'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const message = ref('')
const router = useRouter()

async function loginUser() {
  if (!email.value || !password.value) {
    message.value = 'Please fill in all fields'
    return
  }

  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value
    })

    // spremi user za auth header-e u svim requestovima
    localStorage.setItem('user', JSON.stringify(response.data.user))

    message.value = response.data.message
    router.push('/parking')

  } catch (err) {
    console.error('Login error:', err)
    message.value = err.response?.data?.message || 'Login failed'
  }
}

function goToAdmin() {
  router.push('/adminlogin')
}

function loginGuest() {
  localStorage.removeItem('guest_token')
  localStorage.removeItem('guest_user')
  localStorage.removeItem('user') 
  router.push('/guest')
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
