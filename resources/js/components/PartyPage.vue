<template>
  <AppLayout>
    <div class="min-h-screen flex items-center justify-center"
         style="background: linear-gradient(45deg, #000 0%, #222 30%, #bbb 50%, #222 70%, #000 100%);">
      <!-- Popups OUTSIDE the card container -->
      <transition name="fade">
        <div
          v-if="invitePopup.visible"
          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
        >
          <div
            class="relative p-8 rounded-2xl shadow-2xl w-[350px] text-center border border-green-200"
            style="background: rgba(220,220,220,0.92); backdrop-filter: blur(12px);"
          >
            <div
              class="absolute top-0 left-0 h-1 bg-green-500 rounded-t-lg transition-all"
              :style="{ width: invitePopup.progress + '%' }"
            ></div>
            <h2 class="text-xl font-bold mb-2 text-green-900">Party Invitation</h2>
            <p class="mb-4 text-gray-700">
              You have been invited to join <strong class="text-green-700">{{ invitePopup.party?.name }}</strong>.
            </p>
            <div class="flex justify-center gap-4">
              <button
                :disabled="invitePopup.responding || !invitePopup.invitationId"
                @click="respondToInvitation('accepted')"
                class="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 hover:from-green-600 hover:to-green-800 disabled:opacity-50 transition"
              >
                Accept
              </button>
              <button
                :disabled="invitePopup.responding || !invitePopup.invitationId"
                @click="respondToInvitation('rejected')"
                class="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 hover:from-red-600 hover:to-red-800 disabled:opacity-50 transition"
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

      <transition name="fade">
        <div
          v-if="kickedPopup.visible"
          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
        >
          <div class="p-8 rounded-2xl shadow-2xl text-center text-xl font-bold border border-green-200"
               style="background: rgba(220,220,220,0.92); backdrop-filter: blur(12px); color: #166534;">
            {{ kickedPopup.message }}
            <div class="mt-4 text-xs text-gray-500">
              This will close in {{ kickedPopup.secondsLeft }}s
            </div>
          </div>
        </div>
      </transition>

      <!-- Disbanded Success Popup (top middle) -->
      <transition name="fade">
        <div
          v-if="disbandedPopup.visible"
          class="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
          style="pointer-events:none;"
        >
          <div class="bg-green-700 text-white px-8 py-4 rounded-xl shadow-lg font-semibold text-lg">
            {{ disbandedPopup.message }}
          </div>
        </div>
      </transition>

      <!-- Invite Success Popup (top middle) -->
      <transition name="fade">
        <div
          v-if="inviteSuccessPopup.visible && inviteSuccessPopup.message"
          class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          style="pointer-events:none;"
        >
          <div class="bg-green-700 text-white px-8 py-4 rounded-xl shadow-lg font-semibold text-lg">
            {{ inviteSuccessPopup.message }}
          </div>
        </div>
      </transition>

      <!-- Main card container -->
      <div class="w-full max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl shadow-2xl bg-white/70 backdrop-blur-md border border-white/30">
        <h1 class="text-4xl font-extrabold mb-10 text-center text-green-700 drop-shadow">Party Management</h1>

        <!-- Create Party Button -->
        <div v-if="!party" class="flex flex-col items-center">
          <button
            @click="showCreate = true"
            class="bg-gradient-to-r from-green-500 to-green-700 text-white text-2xl px-10 py-4 rounded-xl shadow-lg hover:scale-105 hover:from-green-600 hover:to-green-800 transition-all duration-200 mb-4"
          >
            Create Party
          </button>
          <div v-if="showCreate" class="w-full mt-4">
            <form @submit.prevent="createParty" class="flex flex-col items-center gap-2">
              <input
                v-model="partyName"
                type="text"
                placeholder="Party Name"
                class="border border-green-300 px-4 py-2 rounded-lg w-full mb-2 bg-white/80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <button
                type="submit"
                class="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-2 rounded-lg font-semibold shadow hover:scale-105 hover:from-green-600 hover:to-green-800 transition"
              >
                Confirm Create
              </button>
            </form>
          </div>
        </div>

        <!-- Party Info -->
        <div v-else>
          <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 class="text-2xl font-bold text-green-700 flex items-center gap-2">
              <span class="inline-block w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
              Party: <span class="text-green-900">{{ party.name }}</span>
            </h2>
            <button
              @click="disbandParty"
              class="bg-gradient-to-r from-green-600 to-green-900 text-white px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 hover:from-green-700 hover:to-green-950 transition-all duration-200"
            >
              Disband Party
            </button>
          </div>

          <!-- Party Members -->
          <div class="mb-8">
            <h3 class="text-xl font-semibold mb-3 text-green-900">Members</h3>
            <ul class="bg-white/80 rounded-xl p-4 shadow flex flex-col gap-2">
              <li
                v-for="member in party.users"
                :key="member.id"
                class="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-green-50 transition"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-white font-bold text-lg shadow">
                    {{ (member.name || member.username || member.email).slice(0,2).toUpperCase() }}
                  </div>
                  <span class="font-medium text-gray-900">
                    <span v-if="member.id === party.owner_id" title="Party Owner" class="mr-1 text-yellow-400 text-xl">&#x1F451;</span>
                    {{ member.name || member.username || member.email }}
                  </span>
                </div>
                <button
                  v-if="canKick(member)"
                  @click="kickMember(member.id)"
                  class="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-1 rounded-lg font-semibold shadow hover:scale-105 hover:from-green-600 hover:to-green-800 transition"
                >
                  Kick
                </button>
              </li>
            </ul>
          </div>

          <!-- Invite Section -->
          <div class="mb-8">
            <h3 class="text-xl font-semibold mb-3 text-green-900">Invite Member</h3>
            <form @submit.prevent="inviteMember" class="flex gap-2" v-if="!isPartyFull">
              <input
                v-model="inviteUsername"
                type="text"
                placeholder="Enter username"
                class="border border-green-300 px-4 py-2 rounded-lg w-full bg-white/80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <button
                type="submit"
                class="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 hover:from-green-600 hover:to-green-800 transition-all duration-200"
              >
                Invite
              </button>
            </form>
            <div v-if="isPartyFull" class="text-red-500 mt-2 font-semibold">Party is full (max 5 users)!</div>
          </div>
        </div>

        <!-- Top-right notifications -->
        <div class="fixed top-4 right-4 z-50 space-y-2" style="pointer-events:none;">
          <div
            v-for="n in notifications"
            :key="n.id"
            class="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg font-semibold animate-fade-in"
            style="pointer-events:auto;"
          >
            {{ n.message }}
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import PPage from '../scripts/PartyPage.js';
export default {
  mixins: [PPage],
}
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