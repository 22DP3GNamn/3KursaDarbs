export default {
  data() {
    return {
      party: null,
      partyName: "",
      disbandedPopup: { visible: false, message: "", timer: null },
      showCreate: false,
      inviteUsername: "",
      invitePopup: { visible: false, invitationId: null, party: null, secondsLeft: 30, progress: 100, timer: null, responding: false },
      kickedPopup: { visible: false, message: '', timer: null, secondsLeft: 5 },
      notifications: [],
      currentPartyChannelId: null,
      inviteSuccessPopup: { visible: false, message: "", timer: null },
    };
  },
  mounted() {
    this.fetchParty();
    this.listenForInvites();
    this.listenForKicked();
  },
  computed: {
    isPartyFull() {
      return this.party?.users?.length >= 5;
    },
  },
  methods: {
    async fetchParty() {
      const res = await fetch("/party/current");
      const data = await res.json();
      const oldPartyId = this.currentPartyChannelId;
      this.party = data.party;

      if (this.party?.id) {
        if (oldPartyId !== this.party.id) {
          if (oldPartyId) window.Echo.leave('party.' + oldPartyId);
          this.currentPartyChannelId = this.party.id;
          this.listenForPartyChannel();
        }
      } else if (oldPartyId) {
        window.Echo.leave('party.' + oldPartyId);
        this.currentPartyChannelId = null;
      }
    },
    async createParty() {
      const res = await fetch("/party", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
        },
        body: JSON.stringify({ name: this.partyName }),
      });
      const data = await res.json();
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
      this.showDisbandedPopup(data.message || "Party disbanded successfully!");
      this.party = null;
      this.inviteUsername = "";
      this.inviteMessage = "";
    },
    showDisbandedPopup(message) {
      this.disbandedPopup.message = message;
      this.disbandedPopup.visible = true;
      if (this.disbandedPopup.timer) clearTimeout(this.disbandedPopup.timer);
      this.disbandedPopup.timer = setTimeout(() => {
        this.disbandedPopup.visible = false;
        this.disbandedPopup.message = "";
      }, 3000);
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
          this.showInviteSuccess("Server error: " + text.slice(0, 100));
          return;
        }
        // Always use a fallback message if data.message is missing
        let msg = "";
        if (typeof data.message === "string" && data.message.trim()) {
          msg = data.message;
        } else if (res.ok) {
          msg = "User invited successfully!";
        } else {
          msg = "Failed to invite user.";
        }
        if (msg) this.showInviteSuccess(msg);
        if (res.ok) {
          this.inviteUsername = "";
        }
      } catch (error) {
        this.showInviteSuccess("Error sending invitation: " + error.message);
      }
    },
    showInviteSuccess(message) {
      if (!message || typeof message !== "string" || !message.trim()) {
        return; // Don't show popup if message is empty/undefined
      }
      this.inviteSuccessPopup.message = message;
      this.inviteSuccessPopup.visible = true;
      if (this.inviteSuccessPopup.timer) clearTimeout(this.inviteSuccessPopup.timer);
      this.inviteSuccessPopup.timer = setTimeout(() => {
        this.inviteSuccessPopup.visible = false;
        this.inviteSuccessPopup.message = "";
      }, 3000);
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
            this.showInvitePopup(e); // Do NOT use e.message here!
          });
      }
    },
    listenForKicked() {
      if (window.Laravel?.user?.id && window.Echo) {
        window.Echo.channel('user.' + window.Laravel.user.id)
          .listen('PartyKicked', (e) => {
            this.showKickedPopup(e.message);
          });
      }
    },
    listenForPartyChannel() {
      if (this.party?.id && window.Echo) {
        window.Echo.channel('party.' + this.party.id)
          .listen('PartyJoined', (e) => {
            this.showNotification(e.message);
            this.fetchParty();
          })
          .listen('PartyKicked', (e) => {
            this.showNotification(e.message || 'A player was kicked from the party.');
            this.fetchParty();
          })
          .listen('PartyLeft', (e) => {
            this.showNotification(e.message || `${e.user.name || e.user.username || 'A user'} left the party.`);
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
      this.showNotification(this.kickedPopup.message); // Show top-right notification
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
      if (!this.notifications.some(n => n.message === message)) {
        this.notifications.push({ id, message });
        setTimeout(() => {
          this.notifications = this.notifications.filter(n => n.id !== id);
        }, 5000);
      }
    },
    closeKickedPopup() {
      this.kickedPopup.visible = false;
      this.kickedPopup.message = '';
      if (this.kickedPopup.timer) clearInterval(this.kickedPopup.timer);
      this.kickedPopup.timer = null;
    },
    async leaveParty() {
      if (!this.party) return;
      try {
        const res = await fetch(`/party/${this.party.id}/leave`, {
          method: "POST",
          headers: { "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content") },
        });
        const data = await res.json();
        this.party = data.party;
        this.inviteUsername = "";
        this.showNotification(data.message || "You have left the party.");
        await this.fetchParty();
      } catch {
        this.showNotification("Failed to leave the party. Please try again.");
      }
    },
  },
};