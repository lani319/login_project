<template>
  <div>
    <form v-on:submit.prevent="submitForm">
      <div class="regist" style="background-color: #cccccc">REGIST USER</div>
      <div class="regist">
        <label>id:</label>
        <input type="text" name="userId" v-model="userData.userId" />
      </div>
      <div class="regist">
        <label>name:</label>
        <input type="text" name="userName" v-model="userData.userName" />
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
        <button type="submit">가입</button>
        <hr />
        {{ this.message }}
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
          userName: "",
          userPassword: "",
        },
        message: "",
      };
    },
    methods: {
      submitForm: function () {
        axios
          .post("/api/member/regist/", this.userData)
          .then((response) => {
            if (response.status == 200) {
              this.message = response.data.message;
            }
          })
          .catch(() => {
            this.message = "회원가입 실패. 중복 아이디가 있습니다.";
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
