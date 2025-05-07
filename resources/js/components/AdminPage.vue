<template>
  <AppLayout>
    <div class="container mt-25 mx-auto p-5 max-w-[900px]">
      <div class="flex mb-6">
        <h1 class="text-3xl font-bold">Admin Dashboard</h1>
        <button @click="resetChanges" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-auto" :disabled="!hasChanges">Reset</button>
        <button @click="confirmChanges" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2" :disabled="!hasChanges">Confirm Changes</button>
      </div>

      <div v-if="loading" class="text-center">
        <p>Loading users...</p>
      </div>
      <div v-else>
        <!-- Search and Sort Controls -->
        <div class="flex items-center mb-4">
          <!-- Search Bar -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by username..."
            class="border border-gray-300 px-4 py-2 rounded w-full"
          />
          <!-- Sort Dropdown -->
          <select
            v-model="sortKey"
            @change="sortUsers"
            class="border border-gray-300 px-4 py-2 rounded ml-4"
          >
            <option value="username">Sort by Username</option>
            <option value="email">Sort by Email</option>
            <option value="role">Sort by Role</option>
          </select>
        </div>

        <!-- User Table -->
        <table class="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 px-4 py-2">Username</th>
              <th class="border border-gray-300 px-4 py-2">Email</th>
              <th class="border border-gray-300 px-4 py-2">Role</th>
              <th class="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in filteredAndSortedUsers"
              :key="user.id"
              :class="{
                'bg-red-100': user.markedForDeletion,
                'bg-cyan-100': user.roleChanged && !user.markedForDeletion,
              }"
            >
              <td class="border border-gray-300 px-4 py-2 text-center">{{ user.username }}</td>
              <td class="border border-gray-300 px-4 py-2 text-center">{{ user.email }}</td>
              <td class="border border-gray-300 px-4 py-2 text-center">
                <select
                  v-model="user.role"
                  @change="updateRole(user.id, $event.target.value)"
                  class="border border-gray-300 px-2 py-1 rounded"
                  :disabled="user.markedForDeletion"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td class="border border-gray-300 px-4 py-2 text-center">
                <button @click="toggleDelete(index)" class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
                  {{ user.markedForDeletion ? 'Undo' : 'Delete' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import AdminPageJS from '../scripts/AdminPage.js';

export default {
  mixins: [AdminPageJS],
  };
</script>

<style>
/* Add a cyan background color for rows with changed roles */
.bg-cyan-100 {
  background-color: #e0f7fa;
}
</style>
