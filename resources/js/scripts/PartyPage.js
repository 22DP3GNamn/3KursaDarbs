import NotificationManager from "./NotificationManager.js";

export default {
    data() {
        return {
            partyMembers: [],
            inviteEmail: "",
        };
    },

    mounted() {
        this.fetchPartyMembers();
    },

    methods: {
        async fetchPartyMembers() {
            try {
                const response = await fetch("/party/current");
                if (response.ok) {
                    const data = await response.json();
                    if (data.party) {
                        this.partyMembers = data.party.users;
                    } else {
                        this.partyMembers = [];
                        NotificationManager.showNotification(data.message || "No active party found.", "bg-yellow-500");
                    }
                } else if (response.status === 404) {
                    NotificationManager.showNotification("No active party found.", "bg-yellow-500");
                } else {
                    NotificationManager.showNotification("Failed to fetch party members.", "bg-red-500");
                }
            } catch (error) {
                NotificationManager.showNotification("Error fetching party members: " + error.message, "bg-red-500");
            }
        },

        async sendInvitation() {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
                const response = await fetch(`/party/invite`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken, // Include CSRF token
                    },
                    body: JSON.stringify({ email: this.inviteEmail }),
                });
                if (response.ok) {
                    NotificationManager.showNotification("Invitation sent successfully!", "bg-green-500");
                    this.inviteEmail = ""; // Clear the input field
                } else {
                    NotificationManager.showNotification("Failed to send invitation.", "bg-red-500");
                }
            } catch (error) {
                NotificationManager.showNotification("Error sending invitation: " + error.message, "bg-red-500");
            }
        },

        async kickMember(memberId) {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
                const response = await fetch(`/party/kick/${memberId}`, {
                    method: "DELETE",
                    headers: {
                        "X-CSRF-TOKEN": csrfToken, // Include CSRF token
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

        async disbandParty() {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
                const response = await fetch("/party", {
                    method: "DELETE",
                    headers: {
                        "X-CSRF-TOKEN": csrfToken, // Include CSRF token
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
    },
};
