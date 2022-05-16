<template>
  <div class="login">
    <LoginUser></LoginUser>
  </div>
</template>

<script>
  // @ is an alias to /src

  import LoginUser from "@/components/Login/LoginUser.vue";

  export default {
    name: "Login",
    components: {
      LoginUser,
    },
  };
</script>

<style></style>
