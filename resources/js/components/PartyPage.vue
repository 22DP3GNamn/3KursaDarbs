<template>
  <AppLayout>
    <div class="container mx-auto p-8 max-w-xl">
      <h1 class="text-3xl font-bold mb-8 text-center">Party Management</h1>

      <!-- Create Party Button -->
      <div v-if="!party" class="flex flex-col items-center">
        <button
          @click="showCreate = true"
          class="bg-blue-600 text-white text-2xl px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition mb-4"
        >
          Create Party
        </button>
        <div v-if="showCreate" class="w-full mt-4">
          <form @submit.prevent="createParty" class="flex flex-col items-center">
            <input
              v-model="partyName"
              type="text"
              placeholder="Party Name"
              class="border border-gray-300 px-4 text-white py-2 rounded w-full mb-2"
              required
            />
            <button
              type="submit"
              class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Confirm Create
            </button>
          </form>
          <div v-if="message" class="text-green-500 mt-2">{{ message }}</div>
        </div>
      </div>

      <!-- Party Info -->
      <div v-else>
        <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-2 text-white">Party: {{ party.name }}</h2>
          <button
            @click="disbandParty"
            class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Disband Party
          </button>
        </div>

        <!-- Party Members -->
        <div class="mb-6">
          <h3 class="text-xl font-semibold mb-2">Members</h3>
          <ul class="bg-gray-100 rounded p-4">
            <li
              v-for="member in party.users"
              :key="member.id"
              class="flex justify-between items-center mb-2"
            >
              <span>
                <span v-if="member.id === party.owner_id" title="Party Owner" style="color:gold; font-size:1.2em; vertical-align:middle;">&#x1F451;</span>
                {{ member.name || member.username || member.email }}
              </span>
              <button
                v-if="canKick(member)"
                @click="kickMember(member.id)"
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Kick
              </button>
            </li>
          </ul>
        </div>

        <!-- Invite Section -->
        <div class="mb-6">
          <h3 class="text-xl font-semibold mb-2 text-white">Invite Member</h3>
          <form @submit.prevent="inviteMember" class="flex" v-if="!isPartyFull">
            <input
              v-model="inviteUsername"
              type="text"
              placeholder="Enter username"
              class="border border-gray-300 px-4 py-2 rounded w-full text-white"
              required
            />
            <button
              type="submit"
              class="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Invite
            </button>
          </form>
          <div v-if="isPartyFull" class="text-red-500 mt-2">Party is full (max 5 users)!</div>
          <div v-if="inviteMessage" class="text-green-500 mt-2">{{ inviteMessage }}</div>
        </div>
      </div>

      <!-- Invitation Popup -->
      <transition name="fade">
        <div
          v-if="invitePopup.visible"
          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
        >
          <div class="relative bg-white text-gray-900 p-8 rounded-lg shadow-lg w-[350px] text-center">
            <div
              class="absolute top-0 left-0 h-1 bg-blue-500 rounded-t-lg transition-all"
              :style="{ width: invitePopup.progress + '%' }"
            ></div>
            <h2 class="text-xl font-bold mb-2">Party Invitation</h2>
            <p class="mb-4">
              You have been invited to join <strong>{{ invitePopup.party?.name }}</strong>.
            </p>
            <div class="flex justify-center gap-4">
              <button
                :disabled="invitePopup.responding || !invitePopup.invitationId"
                @click="respondToInvitation('accepted')"
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                Accept
              </button>
              <button
                :disabled="invitePopup.responding || !invitePopup.invitationId"
                @click="respondToInvitation('rejected')"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
            <div class="mt-4 text-xs text-gray-500">
              This invitation will expire in {{ invitePopup.secondsLeft }}s
            </div>
            <div v-if="!invitePopup.invitationId" class="text-red-500 mt-2">
              Invitation is invalid or missing. Please refresh the page.
            </div>
          </div>
        </div>
      </transition>

      <!-- Kicked Popup -->
      <transition name="fade">
        <div
          v-if="kickedPopup.visible"
          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
        >
          <div class="bg-white text-red-600 p-8 rounded-lg shadow-lg text-center text-xl font-bold">
            {{ kickedPopup.message }}
            <div class="mt-4 text-xs text-gray-500">
              This will close in {{ kickedPopup.secondsLeft }}s
            </div>
          </div>
        </div>
      </transition>

      <!-- Top-right notifications -->
      <div class="fixed top-4 right-4 z-50 space-y-2" style="pointer-events:none;">
        <div
          v-for="n in notifications"
          :key="n.id"
          class="bg-green-600 text-white px-6 py-3 rounded shadow-lg font-semibold animate-fade-in"
          style="pointer-events:auto;"
        >
          {{ n.message }}
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
export default {
  data() {
    return {
      party: null,
      partyName: "",
      message: "",
      showCreate: false,
      inviteUsername: "",
      inviteMessage: "",
      invitePopup: {
        visible: false,
        invitationId: null,
        party: null,
        secondsLeft: 30,
        progress: 100,
        timer: null,
        responding: false,
      },
      kickedPopup: {
        visible: false,
        message: '',
        timer: null,
        secondsLeft: 5,
      },
      notifications: [],
      currentPartyChannelId: null,
    };
  },
  mounted() {
    this.fetchParty();
    this.listenForInvites();
    this.listenForKicked();
  },
  computed: {
    isPartyFull() {
      return this.party && this.party.users && this.party.users.length >= 5;
    },
  },
  methods: {
    async fetchParty() {
      const res = await fetch("/party/current");
      const data = await res.json();
      const oldPartyId = this.currentPartyChannelId;
      this.party = data.party;
      // Always (re)subscribe to the party channel if party exists
      if (this.party && this.party.id) {
        if (oldPartyId !== this.party.id) {
          if (oldPartyId) {
            window.Echo.leave('party.' + oldPartyId);
          }
          this.currentPartyChannelId = this.party.id;
          this.listenForPartyChannel();
        }
      } else if (oldPartyId) {
        window.Echo.leave('party.' + oldPartyId);
        this.currentPartyChannelId = null;
      }
    },
    async createParty() {
      this.message = "";
      const res = await fetch("/party", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
        },
        body: JSON.stringify({ name: this.partyName }),
      });
      const data = await res.json();
      this.message = data.message || "Party created!";
      this.partyName = "";
      this.showCreate = false;
      await this.fetchParty();
    },
    async disbandParty() {
      if (!this.party) return;
      const res = await fetch(`/party/${this.party.id}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
        },
      });
      const data = await res.json();
      this.message = data.message || "Party disbanded!";
      this.party = null;
      this.inviteUsername = "";
      this.inviteMessage = "";
    },
    async kickMember(userId) {
      if (!this.party) return;
      const res = await fetch(`/party/${this.party.id}/kick/${userId}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
        },
      });
      const data = await res.json();
      this.message = data.message || "Member kicked!";
      await this.fetchParty();
    },
    async inviteMember() {
      this.inviteMessage = "";
      if (!this.party) return;
      try {
        const res = await fetch(`/party/${this.party.id}/invite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
          },
          body: JSON.stringify({ username: this.inviteUsername }),
        });
        let data;
        try {
          data = await res.json();
        } catch (e) {
          const text = await res.text();
          this.inviteMessage = "Server error: " + text.slice(0, 100);
          return;
        }
        if (res.ok) {
          this.inviteMessage = data.message || "User invited successfully!";
          this.inviteUsername = "";
        } else {
          this.inviteMessage = data.message || "Failed to invite user.";
        }
      } catch (error) {
        this.inviteMessage = "Error sending invitation: " + error.message;
      }
    },
    canKick(member) {
      // Only the party owner can kick, and not themselves
      return (
        this.party &&
        this.party.owner_id === this.getUserId() &&
        member.id !== this.getUserId()
      );
    },
    getUserId() {
      return window.Laravel?.user?.id;
    },
    listenForInvites() {
      if (window.Laravel?.user?.id && window.Echo) {
        window.Echo.channel('user.' + window.Laravel.user.id)
          .listen('PartyInvitationSent', (e) => {
            this.showInvitePopup(e);
          })
          .listen('.App\\Events\\PartyInvitationSent', (e) => {
            this.showInvitePopup(e);
          })
          .listen('App\\Events\\PartyInvitationSent', (e) => {
            this.showInvitePopup(e);
          });
      }
    },
    listenForKicked() {
      if (window.Laravel?.user?.id && window.Echo) {
        window.Echo.channel('user.' + window.Laravel.user.id)
          .listen('PartyKicked', (e) => {
            this.showKickedPopup(e.message);
          })
          .listen('.App\\Events\\PartyKicked', (e) => {
            this.showKickedPopup(e.message);
          })
          .listen('App\\Events\\PartyKicked', (e) => {
            this.showKickedPopup(e.message);
          });
      }
    },
    listenForPartyChannel() {
      if (this.party && this.party.id && window.Echo) {
        window.Echo.channel('party.' + this.party.id)
          .listen('PartyJoined', (e) => {
            this.showNotification(e.message);
            this.fetchParty();
          })
          .listen('.App\\Events\\PartyJoined', (e) => {
            this.showNotification(e.message);
            this.fetchParty();
          })
          .listen('App\\Events\\PartyJoined', (e) => {
            this.showNotification(e.message);
            this.fetchParty();
          })
          .listen('PartyKicked', (e) => {
            this.fetchParty();
          })
          .listen('.App\\Events\\PartyKicked', (e) => {
            this.fetchParty();
          })
          .listen('App\\Events\\PartyKicked', (e) => {
            this.fetchParty();
          });
      }
    },
    showInvitePopup(e) {
      this.invitePopup.visible = true;
      this.invitePopup.party = e.party;
      this.invitePopup.invitationId = e.invitation_id || e.invitation?.id;
      this.invitePopup.secondsLeft = 30;
      this.invitePopup.progress = 100;
      this.invitePopup.responding = false;
      if (this.invitePopup.timer) clearInterval(this.invitePopup.timer);
      this.invitePopup.timer = setInterval(() => {
        this.invitePopup.secondsLeft--;
        this.invitePopup.progress = (this.invitePopup.secondsLeft / 30) * 100;
        if (this.invitePopup.secondsLeft <= 0) {
          this.closeInvitePopup();
        }
      }, 1000);
    },
    async respondToInvitation(status) {
      if (!this.invitePopup.invitationId || this.invitePopup.responding) {
        return;
      }
      this.invitePopup.responding = true;
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
        const response = await fetch(`/invitation/${this.invitePopup.invitationId}/respond`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
          },
          body: JSON.stringify({ status }),
        });
        if (response.ok) {
          if (status === "accepted") {
            await this.fetchParty();
          }
        }
      } catch (error) {
        // Optionally show an error notification here
      }
      this.closeInvitePopup();
    },
    closeInvitePopup() {
      this.invitePopup.visible = false;
      this.invitePopup.party = null;
      this.invitePopup.invitationId = null;
      this.invitePopup.secondsLeft = 30;
      this.invitePopup.progress = 100;
      this.invitePopup.responding = false;
      if (this.invitePopup.timer) clearInterval(this.invitePopup.timer);
      this.invitePopup.timer = null;
    },
    showKickedPopup(message) {
      this.kickedPopup.visible = true;
      this.kickedPopup.message = message || 'You have been kicked from the party!';
      this.kickedPopup.secondsLeft = 5;
      if (this.kickedPopup.timer) clearInterval(this.kickedPopup.timer);
      this.kickedPopup.timer = setInterval(() => {
        this.kickedPopup.secondsLeft--;
        if (this.kickedPopup.secondsLeft <= 0) {
          this.closeKickedPopup();
        }
      }, 1000);
      // Clear party state so user no longer sees the party
      this.party = null;
    },
    showNotification(message) {
      const id = Date.now();
      this.notifications.push({ id, message });
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.id !== id);
      }, 5000);
    },
    closeKickedPopup() {
      this.kickedPopup.visible = false;
      this.kickedPopup.message = '';
      if (this.kickedPopup.timer) clearInterval(this.kickedPopup.timer);
      this.kickedPopup.timer = null;
    },
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px);}
  to { opacity: 1; transform: translateY(0);}
}
.animate-fade-in {
  animation: fade-in 0.3s;
}
</style>