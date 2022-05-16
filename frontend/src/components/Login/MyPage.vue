<template>
  <div>
    <H3>MY PAGE</H3>
    <div>
      <label>아이디 : </label>
      <label>{{ this.userData.userId }}</label>
    </div>
    <div>
      <label>이름 : </label>
      <label>{{ this.userData.userName }}</label>
    </div>
    <div>
      <label>가입경로 : </label>
      <label>{{ this.userData.userLoginType }}</label>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    data() {
      return {
        userData: {
          userId: "",
          userName: "",
          userLoginType: "",
        },
        message: "",
      };
    },
    methods: {
      getMypage: function () {
        //const userId = this.$store.state.userId;

        if (this.$store.state.isLogin) {
          axios
            .get("/api/member/mypage/")
            .then((response) => {
              if (response.status == 200) {
                console.log(response.data[0]);
                this.userData.userId = response.data[0].userId;
                this.userData.userName = response.data[0].userName;
                this.userData.userLoginType = response.data[0].loginType;
              }
            })
            .catch(() => {
              this.message = "로딩 실패. 아이디 또는 비밀번호를 확인해주세요";
            });
        }
      },
    },
    beforeMount() {
      this.getMypage();
    },
  };
</script>

<style></style>
