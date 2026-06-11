//ovdje nam se ucitava adminpage kao komponenta

<template>
  <div v-if="isAdmin">
    <AdminPage />
  </div>
</template>

<script setup>
import AdminPage from './AdminPage.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const isAdmin = ref(false)
const router = useRouter()

onMounted(() => {
  const token = localStorage.getItem('adminToken')
  if (!token) return router.replace('/adminlogin')

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.role !== 'admin') return router.replace('/')
    isAdmin.value = true
  } catch {
    router.replace('/adminlogin')
  }
})
</script>
