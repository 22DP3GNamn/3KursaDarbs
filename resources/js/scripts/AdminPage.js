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
          console.error("Failed to fetch signed-in user");
        }
      } catch (error) {
        console.error("Error fetching signed-in user:", error);
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
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        this.loading = false;
      }
    },

    markAsChanged() {
      this.hasChanges = !this.users.every((user, index) =>
        JSON.stringify(user) === JSON.stringify(this.originalUsers[index])
      );
    },

    updateRole(userId, newRole) {
      const user = this.users.find((u) => u.id === userId);
      const originalUser = this.originalUsers.find((u) => u.id === userId);

      if (user && originalUser) {
        user.role = newRole;
        user.roleChanged = user.role !== originalUser.role;
        this.markAsChanged();
      } else {
        console.error("Failed to find the user for updating role.");
      }
    },

    toggleDelete(index) {
      const sortedUser = this.filteredAndSortedUsers[index];
      const originalIndex = this.users.findIndex((user) => user.id === sortedUser.id);
      if (this.users[originalIndex].id === this.signedInUserId) {
        alert("You cannot delete your own profile.");
        return;
      }
      this.users[originalIndex].markedForDeletion = !this.users[originalIndex].markedForDeletion;
      this.markAsChanged();
    },

    async confirmChanges() {
      try {
        const usersToUpdate = this.users.filter((user) => !user.markedForDeletion && user.roleChanged);
        const usersToDelete = this.users.filter((user) => user.markedForDeletion);

        if (usersToUpdate.length > 0) {
          const updateResponse = await fetch("/api/users/bulk-update", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
            },
            body: JSON.stringify({ users: usersToUpdate }),
          });

          if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            console.error("Failed to update users:", errorData);
            return;
          }
        }

        if (usersToDelete.length > 0) {
          const deleteResponse = await fetch("/api/users/bulk-delete", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
            },
            body: JSON.stringify({ userIds: usersToDelete.map((user) => user.id) }),
          });

          if (!deleteResponse.ok) {
            const errorData = await deleteResponse.json();
            console.error("Failed to delete users:", errorData);
            return;
          }
        }

        await this.fetchUsers();
        this.hasChanges = false;
      } catch (error) {
        console.error("Error confirming changes:", error);
      }
    },

    resetChanges() {
      this.users = JSON.parse(JSON.stringify(this.originalUsers));
      this.hasChanges = false;
    },

    sortUsers() {
      // Sorting is handled by `filteredAndSortedUsers`, no need to modify `id`.
      this.markAsChanged();
    },
  },
};