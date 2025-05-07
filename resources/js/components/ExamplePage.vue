<template>
<AppLayout>
    <div>
      <p v-if="isLoggedIn">Welcome back, user!</p>
      <p v-else>Please log in to continue.</p>
    </div>
</AppLayout>
</template>
<script setup>
import { ref } from 'vue';

const isLoggedIn = ref(false);
</script>
