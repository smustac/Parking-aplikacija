<template>
  <q-layout view="hHh lpR fFf" class="bg-layout">

    <!-- HEADER -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold">
          VelePark
        </q-toolbar-title>
        <q-btn flat dense label="Login" @click="$router.push('/')" /> 
        <q-btn flat dense label="Registracija" @click="$router.push('/register')" />
        <q-btn flat dense icon="help" label="Pomoć" @click="openHelp" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="page-wrapper">
        <router-view />
      </div>
    </q-page-container>

  </q-layout>
</template>

<script setup>
function openHelp() {
  const path = window.location.hash

  if (path === '#/' || path === '') {
    window.open('/prva_str.pdf', '_blank')
  } else if (path === '#/adminlogin') {
    window.open('/admin_login.pdf', '_blank')
  } else if (path === '#/adminpage') {
    window.open('/admin_page.pdf', '_blank')
  } else if (path === '#/register') {
    window.open('/register.pdf', '_blank')
  } else if (path === '#/parking') {
    window.open('/parking.pdf', '_blank')
  } else if (path === '#/guest') {
    window.open('/prva_str.pdf', '_blank')
  } else {
    window.open('/parking-pomoc.pdf', '_blank') 
  }
}
</script>

<style scoped>
.bg-layout {
  background: linear-gradient(
      rgba(15, 23, 42, 0.75),
      rgba(15, 23, 42, 0.85)
    ),
    url('../assets/parking-bg.jpg') no-repeat center center;
  background-size: cover;
  min-height: 100vh;
}

.page-wrapper {
  min-height: calc(100vh - 50px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
</style>