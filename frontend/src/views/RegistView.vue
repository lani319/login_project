<template>
  <div class="regist">
    <RegistUser></RegistUser>
  </div>
</template>

<script>
  // @ is an alias to /src

  import RegistUser from "@/components/Login/RegistUser.vue";

  export default {
    name: "Regist",
    components: {
      RegistUser,
    },
  };
</script>

<style></style>
