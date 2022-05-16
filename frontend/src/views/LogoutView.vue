<template>
  <div class="logout">
    <LogOut></LogOut>
  </div>
</template>

<script>
  // @ is an alias to /src

  import LogOut from "@/components/Login/LogOut.vue";

  export default {
    name: "Logout",
    components: {
      LogOut,
    },
  };
</script>

<style></style>
