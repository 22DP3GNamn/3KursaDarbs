<template>
    <AppLayout>
        <div class="ml-15">

            <h1 class="mt-30 text-3xl font-bold mb-6">
                HOME PAGE
            </h1>
            <div class="h-[200vw]">
                Content
            </div>
        </div>
    </AppLayout>
</template>
<script>
  import Navigation from '../scripts/Navigation.js';
  export default {
      mounted() {
          Navigation()
      },
  };
</script>