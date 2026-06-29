<template>
  <q-layout view="hHh lpR fFf" class="bg-layout">

    <!-- HEADER -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold">
          VelePark
        </q-toolbar-title>
        <q-btn flat dense label="Logi" @click="$router.push('/')" /> 
        <q-btn flat dense label="Registracija" @click="$router.push('/register')" />
      </q-toolbar>
    </q-header>

    
    <q-page-container>
      <div class="page-wrapper">
        <router-view />
      </div>
    </q-page-container>

  </q-layout>
</template>

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
