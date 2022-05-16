<template>
  <div class="mypage">
    <MyPage></MyPage>
  </div>
</template>

<script>
  // @ is an alias to /src

  import MyPage from "@/components/Login/MyPage.vue";

  export default {
    name: "Mypage",
    components: {
      MyPage,
    },
  };
</script>

<style></style>
