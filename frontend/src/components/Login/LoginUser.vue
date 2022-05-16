<template>
  <div>
    <form
      v-if="this.$store.state.isLogin === false"
      v-on:submit.prevent="submitForm"
    >
      <div class="regist" style="background-color: #cccccc">LOGIN USER</div>
      <div class="regist">
        <label>id:</label>
        <input type="text" name="userId" v-model="userData.userId" />
      </div>
      <div class="regist">
        <label>password:</label>
        <input
          type="text"
          name="userPassword"
          v-model="userData.userPassword"
        />
      </div>
      <div class="regist_btn">
        <button type="submit">로그인</button>
        <hr />
        {{ this.message }}
      </div>
    </form>
    <form v-else v-on:submit.prevent="logoutForm">
      <div>
        {{ this.message }}
      </div>
      <div>
        <button type="submit">로그아웃</button>
      </div>
    </form>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    data() {
      return {
        userData: {
          userId: "",
          userPassword: "",
        },
        message: "",
      };
    },
    methods: {
      submitForm: function () {
        axios
          .post("/api/member/login/", this.userData)
          .then((response) => {
            if (response.status == 200) {
              console.log(response.data[0]);

              //vuex state에 상태 기록
              this.$store.state.isLogin = true;
              this.$store.state.userId = response.data[0].userId;
              this.$store.state.userName = response.data[0].userName;
              this.message = this.$store.state.userId + "님 로그인";
            }
          })
          .catch(() => {
            this.message = "로그인 실패. 아이디 또는 비밀번호를 확인해주세요";
          });
      },
      logoutForm: function () {
        this.$store.state.isLogin = false;
        this.$store.state.userId = "";
        this.$store.state.userName = "";

        axios.delete("/api/member/logout/", this.userData).then((response) => {
          this.message = "로그아웃 되었습니다.";
        });
      },
    },
  };
</script>

<style>
  .regist {
    width: 400px;
    height: 40px;
    margin-left: 20px;
    padding-top: 10px;
    text-align: center;
  }
  label {
    width: 100px;
    text-align: left;
  }
</style>
