<template>
  <q-page class="q-pa-lg bg-grey-2">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Upravljanje korisnicima</div>
        
      </div>

      <q-btn
        label="Logout"
        color="negative"
        icon="logout"
        flat
        @click="logOutUser"
      />
    </div>

    <!--tablica-->
    <q-card flat bordered>
      <q-card-section>
        <q-table
          :rows="users"
          :columns="columns"
          row-key="id"
          flat
          separator="horizontal"
          :rows-per-page-options="[5, 10, 20]"
        >

          <!--dropdown meni, mora biti i u heidi i tu-->
          <template v-slot:body-cell-role="props">
            <q-td :props="props" align="center">
              <q-select
                v-model="props.row.role"
                :options="roleOptions"
                emit-value
                map-options
                dense
                outlined
                rounded
                color="primary"
                style="min-width: 130px"
                @update:model-value="
                  newRole => confirmRoleChange(props.row.id, newRole)
                "
              />
            </q-td>
          </template>

          <!--brisanje-->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" align="center">
              <q-btn
                icon="delete"
                color="negative"
                flat
                round
                dense
                @click="confirmDelete(props.row.id)"
              >
                <q-tooltip>Delete user</q-tooltip>
              </q-btn>
            </q-td>
          </template>

        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const users = ref([])

const roleOptions = [
  { label: 'Student', value: 'student' },
  { label: 'Invalid', value: 'invalid' },
  { label: 'VIP', value: 'vip' },
  { label: 'Admin', value: 'admin' }
]

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'username', label: 'Username', field: 'username', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'role', label: 'Role', field: 'role', align: 'center' },
  { name: 'actions', label: 'Actions', align: 'center', sortable: false }
]

async function fetchUsers () {
  try {
    const res = await axios.get('http://localhost:3000/api/users')
    users.value = res.data
  } catch (err) {
    console.error('Failed to fetch users:', err)
  }
}

onMounted(fetchUsers)

async function confirmDelete (userId) {
  if (!window.confirm('Delete this user?')) return

  try {
    await axios.delete(`http://localhost:3000/api/users/${userId}`)
    users.value = users.value.filter(u => u.id !== userId)
  } catch (err) {
    console.error('Failed to delete user:', err)
  }
}

async function confirmRoleChange (userId, newRole) {
  if (!window.confirm(`Change role to "${newRole}"?`)) {
    await fetchUsers()
    return
  }

  try {
    await axios.put(`http://localhost:3000/api/users/${userId}/role`, {
      role: newRole
    })
  } catch (err) {
    console.error('Failed to update role:', err)
    await fetchUsers()
  }
}

function logOutUser () {
  localStorage.removeItem('adminToken')
  router.push('/adminlogin')
}
</script>
