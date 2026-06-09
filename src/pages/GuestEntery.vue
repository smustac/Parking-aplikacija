<template>
  <q-page class="flex flex-center q-pa-xl">
    <q-card class="glass-card q-pa-lg">
      <q-card-section class="text-center">
        <q-icon name="local_parking" size="64px" color="primary" />
        <div class="text-h5 text-white q-mt-md">Gost ulaz</div>
        <p class="text-grey-7 q-mt-sm">
          Parking će biti naplaćen prilikom ulaska.
        </p>
      </q-card-section>

      <q-card-section>
        <q-btn
          label="Nastavi kao gost"
          color="primary"
          size="lg"
          unelevated
          class="full-width"
          icon-right="arrow_forward"
          :loading="loading"
          @click="enterAsGuest"
        />

        <div v-if="message" class="q-mt-lg text-center">
          <q-banner dense class="bg-grey-9 text-white rounded-borders">
            {{ message }}
          </q-banner>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      loading: false
    }
  },

  computed: {
    hasGuest () {
      return !!localStorage.getItem('guest_user')
    }
  },

  methods: {
    async enterAsGuest () {
      // Ako gost već postoji lokalno -> ne zovi backend
      const stored = localStorage.getItem('guest_user')
      if (stored) {
        try {
          const guest = JSON.parse(stored)
          if (guest?.id) {
            localStorage.setItem('user', JSON.stringify(guest))
            this.$router.push('/parking')
            return
          }
        } catch {
          localStorage.removeItem('guest_user')
        }
      }

      
      let token = localStorage.getItem('guest_token')
      if (!token) {
        token =
          (crypto?.randomUUID?.()) ||
          (Math.random().toString(36).slice(2) + Date.now().toString(36))
        localStorage.setItem('guest_token', token)
      }

      try {
        this.loading = true
        const res = await this.$api.post('/guest', { guest_token: token })

        const guest = res.data.user
        if (!guest?.id) {
          throw new Error('Backend nije vratio user.id')
        }

        localStorage.setItem('guest_user', JSON.stringify(guest))
        localStorage.setItem('user', JSON.stringify(guest))

        this.$router.push('/parking')
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'Ne mogu kreirati gosta'

        this.$q.notify({ type: 'negative', message: msg })
        console.error('Guest error:', err)
      } finally {
        this.loading = false
      }
    },

    async resetGuest () {
      try {
        const token = localStorage.getItem('guest_token')
        if (token) {
          await this.$api.delete('/guest', { data: { guest_token: token } })
        }

        localStorage.removeItem('guest_token')
        localStorage.removeItem('guest_user')
        localStorage.removeItem('user')

        this.$q.notify({ type: 'info', message: 'Gost resetiran' })
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'Ne mogu obrisati gosta iz baze'

        this.$q.notify({ type: 'negative', message: msg })
        console.error('Reset guest error:', err)
      }
    },
  }
}
</script>


<style scoped>
.glass-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  color: white;
}
</style>
