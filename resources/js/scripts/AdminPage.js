import NotificationManager from './NotificationManager.js'; // Import NotificationManager

export default {
  data() {
    return {
      users: [],
      originalUsers: [],
      loading: true,
      hasChanges: false,
      signedInUserId: null,
      sortKey: "username",
      sortOrder: "asc",
      searchQuery: "",
    };
  },

  mounted() {
    this.fetchSignedInUser();
    this.fetchUsers();
  },

  computed: {
    filteredAndSortedUsers() {
      let filteredUsers = this.users.filter((user) =>
        user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      return filteredUsers.sort((a, b) => {
        const valueA = a[this.sortKey]?.toString().toLowerCase() || "";
        const valueB = b[this.sortKey]?.toString().toLowerCase() || "";
        let result = 0;
        if (valueA < valueB) result = -1;
        if (valueA > valueB) result = 1;

        return this.sortOrder === "asc" ? result : -result;
      });
    },
  },

  methods: {
    async fetchSignedInUser() {
      try {
        const response = await fetch("/api/user-session");
        if (response.ok) {
          const data = await response.json();
          this.signedInUserId = data.user.id;
        } else {
          NotificationManager.showNotification("Failed to fetch signed-in user.");
        }
      } catch (error) {
        NotificationManager.showNotification("Error fetching signed-in user: " + error.message);
      }
    },

    async fetchUsers() {
      try {
        const response = await fetch("/users");
        if (response.ok) {
          const data = await response.json();
          this.users = data.map((user) => ({
            ...user,
            markedForDeletion: false,
          }));
          this.originalUsers = JSON.parse(JSON.stringify(this.users));
        } else {
          NotificationManager.showNotification("Failed to fetch users.");
        }
      } catch (error) {
        NotificationManager.showNotification("Error fetching users: " + error.message);
      } finally {
        this.loading = false;
      }
    },

    markAsChanged() {
      this.hasChanges = !this.users.every((user, index) =>
        JSON.stringify(user) === JSON.stringify(this.originalUsers[index])
      );
    },

    updateField(userId, field, value) {
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        user[field] = value;
        user.roleChanged = true; // Mark as changed
        this.hasChanges = true; // Enable save button
      }
    },

    toggleDelete(index) {
      const sortedUser = this.filteredAndSortedUsers[index];
      const originalIndex = this.users.findIndex((user) => user.id === sortedUser.id);
      if (this.users[originalIndex].id === this.signedInUserId) {
        NotificationManager.showNotification("You cannot delete your own profile.", 'bg-red-500');
        return;
      }
      this.users[originalIndex].markedForDeletion = !this.users[originalIndex].markedForDeletion;
      this.markAsChanged();
    },

    async confirmChanges() {
      const updatedUsers = this.users.filter((user) => user.roleChanged || user.markedForDeletion);
      // Send updatedUsers to the backend
      this.saveChangesToBackend(updatedUsers);
    },

    async saveChangesToBackend(updatedUsers) {
      // Use Axios for the API call
      axios.post('/save-users', { users: updatedUsers }) // Updated endpoint
        .then(() => {
          // Remove deleted users from the users array
          this.users = this.users.filter((user) => !user.markedForDeletion);
          this.originalUsers = JSON.parse(JSON.stringify(this.users)); // Update originalUsers
          this.hasChanges = false; // Reset changes tracker
          NotificationManager.showNotification('Changes saved successfully!', 'bg-green-500');
        })
        .catch((error) => {
          console.error(error);
          NotificationManager.showNotification('Failed to save changes.', 'bg-red-500');
        });
    },

    resetChanges() {
      this.users = JSON.parse(JSON.stringify(this.originalUsers));
      this.hasChanges = false;
    },

    sortUsers() {
      this.markAsChanged();
    },
  },
};