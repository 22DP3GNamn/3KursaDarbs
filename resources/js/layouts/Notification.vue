<template>
  <div :class="['px-6 py-3 rounded shadow-lg', bgColor]" class="text-center max-w-full whitespace-nowrap">
    <p class="text-white">{{ message }}</p>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    bgColor: {
      type: String,
      default: 'bg-green-500',
    },
  },
};
</script>
