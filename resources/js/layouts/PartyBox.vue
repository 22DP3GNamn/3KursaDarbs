<template>
    <div>
        <!-- Party Section -->
        <div v-if="party" class="mx-auto mt-50 p-5 border border-gray-300 rounded-lg bg-gray-100 w-2/5 justify-center">
            <h3>Party: {{ party.name }}</h3>
            <h4>Members:</h4>
            <ul>
                <li v-for="user in party.users" :key="user.id">
                    {{ user.name }} <span v-if="user.id === party.owner_id">(Owner)</span>
                </li>
            </ul>
            <input v-model="inviteUsername" placeholder="Username to invite" />
            <button @click="inviteUser">Invite</button>
            <button @click="disbandParty" class="">Disband Party</button>
        </div>

        <!-- Create Party Section -->
        <div v-else>
            <input v-model="partyName" placeholder="Party Name" class="mx-auto mt-50 p-5 border border-gray-300 rounded-lg bg-gray-100 w-2/5 justify-center" />
            <button @click="createParty">Create Party</button>
        </div>

        <!-- Invitations Section -->
        <div v-if="pendingInvitations.length" class="mt-5 p-5 border border-gray-300 rounded-lg bg-gray-100 w-2/5 mx-auto">
            <h3>Pending Invitations</h3>
            <ul>
                <li v-for="invitation in pendingInvitations" :key="invitation.id">
                    You are invited to join "{{ invitation.party.name }}"
                    <button @click="respondToInvitation(invitation.id, 'accepted')">Accept</button>
                    <button @click="respondToInvitation(invitation.id, 'rejected')">Deny</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            party: null,
            partyName: '',
            inviteUsername: '',
            pendingInvitations: [],
        };
    },
    methods: {
        async fetchCurrentParty() {
            const response = await axios.get('/party/current');
            this.party = response.data.party;
        },
        async fetchInvitations() {
            const response = await axios.get('/invitations');
            this.pendingInvitations = response.data;
        },
        async respondToInvitation(invitationId, status) {
            await axios.post(`/invitation/${invitationId}/respond`, { status });
            this.fetchInvitations();
        },
        async createParty() {
            const response = await axios.post('/party', { name: this.partyName });
            this.party = response.data.party;
        },
        async inviteUser() {
            try {
                await axios.post(`/party/${this.party.id}/invite`, { username: this.inviteUsername });
                alert('User invited successfully!');
            } catch (error) {
                alert('Failed to invite user. Please check the username.');
            }
        },
        async disbandParty() {
            await axios.delete(`/party/${this.party.id}`);
            this.party = null;
        },
    },
    mounted() {
        this.fetchCurrentParty();
        this.fetchInvitations();
    },
};
</script>