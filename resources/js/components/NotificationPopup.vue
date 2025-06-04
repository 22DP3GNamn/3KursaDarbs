<template>
  <div v-if="visible" class="fixed bottom-5 right-5 bg-gray-800 text-white p-4 rounded shadow-lg">
    <p>{{ message }}</p>
    <button @click="visible = false" class="mt-2 bg-red-500 px-3 py-1 rounded">Close</button>
  </div>
</template>

<script>
export default {
  props: { message: String },
  data() {
    return { visible: true };
  },
};
</script>
