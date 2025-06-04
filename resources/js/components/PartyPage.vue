<template>
  <AppLayout>
    <div class="container mx-auto p-5 max-w-[900px] bg-gray-900 text-white rounded-lg shadow-lg mt-50">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold">Party Management</h1>
        <p class="text-gray-300 mt-2">Manage your party members and send invitations.</p>
      </div>

      <!-- Party Members -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Party Members</h2>
        <ul class="bg-gray-800 rounded-lg p-4">
          <li
            v-for="member in partyMembers || []"
            :key="member.id"
            class="flex justify-between items-center bg-gray-700 p-3 rounded mb-2"
          >
            <span>{{ member.name }}</span>
            <button
              @click="kickMember(member.id)"
              class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Kick
            </button>
          </li>
          <li v-if="!partyMembers || partyMembers.length === 0" class="text-center text-gray-400">
            No members in the party.
          </li>
        </ul>
      </div>

      <!-- Invitation Form -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Invite a Member</h2>
        <form @submit.prevent="sendInvitation" class="flex items-center">
          <input
            v-model="inviteEmail"
            type="email"
            placeholder="Enter email address"
            class="border border-gray-300 px-4 py-2 rounded w-full text-black"
            required
          />
          <button
            type="submit"
            class="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Invite
          </button>
        </form>
      </div>

      <!-- Disband Party -->
      <div class="text-center">
        <button
          @click="disbandParty"
          class="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
        >
          Disband Party
        </button>
      </div>

      <!-- Invitation Popup -->
      <div v-if="popupVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 class="text-xl font-bold mb-4">Party Invitation</h2>
          <p>You have been invited to join <strong>{{ popupInvitation?.party?.name }}</strong>.</p>
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
    </div>
  </AppLayout>
</template>

<script>
import NotificationManager from "../scripts/NotificationManager.js";

export default {
  data() {
    return {
      partyMembers: [],
      inviteEmail: "",
      popupVisible: false,
      popupInvitation: null,
    };
  },
  mounted() {
    this.startPolling();
  },
  methods: {
    async fetchPartyMembers() {
      try {
        const response = await fetch("/party/current"); // Ensure this is pointing to /party/current
        if (response.ok) {
          const data = await response.json();
          this.partyMembers = data.party?.users || [];
        } else if (response.status === 404) {
          this.partyMembers = [];
          console.warn("No active party found.");
        } else {
          console.error("Failed to fetch party members.");
        }
      } catch (error) {
        console.error("Error fetching party members:", error);
      }
    },
    async sendInvitation() {
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
        const response = await fetch(`/party/invite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
          },
          body: JSON.stringify({ email: this.inviteEmail }),
        });
        if (response.ok) {
          NotificationManager.showNotification("Invitation sent successfully!", "bg-green-500");
          this.inviteEmail = "";
        } else {
          NotificationManager.showNotification("Failed to send invitation.", "bg-red-500");
        }
      } catch (error) {
        NotificationManager.showNotification("Error sending invitation: " + error.message, "bg-red-500");
      }
    },
    async disbandParty() {
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
        const response = await fetch("/party", {
          method: "DELETE",
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
        });
        if (response.ok) {
          this.partyMembers = [];
          NotificationManager.showNotification("Party disbanded successfully!", "bg-green-500");
        } else {
          NotificationManager.showNotification("Failed to disband party.", "bg-red-500");
        }
      } catch (error) {
        NotificationManager.showNotification("Error disbanding party: " + error.message, "bg-red-500");
      }
    },
    async kickMember(memberId) {
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
        const response = await fetch(`/party/kick/${memberId}`, {
          method: "DELETE",
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
        });
        if (response.ok) {
          this.partyMembers = this.partyMembers.filter((member) => member.id !== memberId);
          NotificationManager.showNotification("Member kicked successfully!", "bg-green-500");
        } else {
          NotificationManager.showNotification("Failed to kick member.", "bg-red-500");
        }
      } catch (error) {
        NotificationManager.showNotification("Error kicking member: " + error.message, "bg-red-500");
      }
    },
    async respondToInvitation(status) {
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
        const response = await fetch(`/invitation/${this.popupInvitation.id}/respond`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
          },
          body: JSON.stringify({ status }),
        });
        if (response.ok) {
          NotificationManager.showNotification(
            `Invitation ${status === "accepted" ? "accepted" : "rejected"} successfully!`,
            "bg-green-500"
          );
          this.popupVisible = false;
          this.popupInvitation = null;
        } else {
          NotificationManager.showNotification("Failed to respond to invitation.", "bg-red-500");
        }
      } catch (error) {
        NotificationManager.showNotification("Error responding to invitation: " + error.message, "bg-red-500");
      }
    },
    startPolling() {
      this.fetchPartyMembers();
      setInterval(this.fetchPartyMembers, 5000); // Poll every 5 seconds
    },
  },
};
</script>

