<template>
  <article class="login">
    <el-card class="login-wrapper" :body-style="{ 'padding-top': 0 }">
      <h2>登录</h2>
      <el-form ref="form" class="login-form" :model="form" :rules="formRules" @submit.native.prevent>
        <el-form-item prop="name">
          <el-input v-model="form.name" placeholder="请输入你的名字" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </article>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        name: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入你的名字' }]
      }
    }
  },
  created() {
    if (localStorage.getItem('name')) {
      this.$router.push('/type')
    }
  },
  methods: {
    handleLogin() {
      this.$refs.form.validate().then(() => {
        localStorage.setItem('name', this.form.name)
        this.$router.push('/type')
      })
    }
  }
}
</script>

<style scoped>
.login {
  overflow: hidden;
  height: 100%;
  background: #f0f2f5 url('../assets/imgs/bg.svg') no-repeat 50%;
  background-size: 100%;
}

.login-wrapper {
  width: 400px;
  margin: 200px auto;
  text-align: center;
}
</style>
