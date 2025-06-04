<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 class="text-xl font-bold mb-4">Party Invitation</h2>
      <p>You have been invited to join <strong>{{ invitation.party.name }}</strong>.</p>
      <div class="mt-4">
        <button
          @click="respondToInvitation('accepted')"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
        >
          Accept
        </button>
        <button
          @click="respondToInvitation('rejected')"
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Decline
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    invitation: Object,
  },
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    async respondToInvitation(status) {
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
        const response = await fetch(`/invitation/${this.invitation.id}/respond`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
          },
          body: JSON.stringify({ status }),
        });
        if (response.ok) {
          this.visible = false;
        } else {
          alert("Failed to respond to the invitation.");
        }
      } catch (error) {
        console.error("Error responding to invitation:", error);
      }
    },
  },
};
</script>
