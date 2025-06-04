<template>
  <AppLayout>
    <div class="container mt-25 mx-auto p-5 max-w-[900px] text-white">
      <div v-if="loading" class="text-center">
        <p>Loading users...</p>
      </div>
      <div v-else>
        <!-- Search and Sort Controls -->
        <div class="flex items-center mb-4 mt-20">
          <!-- Search Bar -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by username..."
            class="border border-gray-300 px-4 py-2 rounded w-full text-white bg-black placeholder-white"
          />
          <!-- Sort Dropdown -->
          <select
            v-model="sortKey"
            @change="sortUsers"
            class="border border-gray-300 px-4 py-2 rounded ml-4 text-white bg-black"
          >
            <option value="username" class="text-black bg-white">Sort by Username</option>
            <option value="email" class="text-black bg-white">Sort by Email</option>
            <option value="role" class="text-black bg-white">Sort by Role</option>
          </select>
        </div>

        <!-- User Table -->
        <table class="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200 text-black">
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
                'bg-red-900 text-white': user.markedForDeletion, // Dark red for marked users
                'bg-gray-900': user.roleChanged && !user.markedForDeletion,
              }"
            >
              <!-- Editable Username -->
              <td class="border border-gray-300 px-4 py-2 text-center">
                <input
                  v-model="user.username"
                  type="text"
                  class="border border-gray-300 px-2 py-1 rounded text-white w-full"
                  @input="updateField(user.id, 'username', user.username)"
                />
              </td>
              <!-- Editable Email -->
              <td class="border border-gray-300 px-4 py-2 text-center">
                <input
                  v-model="user.email"
                  type="email"
                  class="border border-gray-300 px-2 py-1 rounded text-white w-full"
                  @input="updateField(user.id, 'email', user.email)"
                />
              </td>
              <!-- Role Dropdown -->
              <td class="border border-gray-300 px-4 py-2 text-center">
                <select
                  v-model="user.role"
                  @change="updateField(user.id, 'role', user.role)"
                  class="border border-gray-300 px-2 py-1 rounded text-white bg-black"
                  :disabled="user.markedForDeletion"
                >
                  <option value="user" class="text-black bg-white">User</option>
                  <option value="admin" class="text-black bg-white">Admin</option>
                </select>
              </td>
              <!-- Actions -->
              <td class="border border-gray-300 px-4 py-2 text-center">
                <button
                  @click="toggleDelete(index)"
                  class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
                  {{ user.markedForDeletion ? 'Undo' : 'Delete' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-end mt-4">
          <button 
            @click="confirmChanges"
            :disabled="!hasChanges"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save Changes
          </button>
        </div>
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