<template>
  <article class="layout">
    <nav>
      <span class="logo">
        <img src="../assets/logo.png" alt="logo">
      </span>

      <el-menu :default-active="defaultRoute" mode="horizontal" router>
        <el-menu-item index="/type">类型</el-menu-item>
        <el-menu-item index="/resource">资源</el-menu-item>
      </el-menu>

      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ name }} <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </nav>

    <router-view></router-view>
  </article>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      defaultRoute: '/type'
    }
  },
  computed: {
    name() {
      return localStorage.getItem('name')
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        localStorage.removeItem('name')
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped>
.fr {
  float: right;
}

.layout {
  height: 100%;
  user-select: none;
}

.layout > nav {
  overflow: hidden;
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  padding: 0 20px 0 0;
}

nav > .logo {
  display: inline-block;
  width: 80px;
  margin-right: 10px;
  vertical-align: middle;
}

nav > .el-menu {
  flex: 1;
  margin-right: 40px;
  border: 0;
}

.logo > img {
  width: 50%;
  height: 50%;
  vertical-align: middle;
}

.el-dropdown-link {
  cursor: pointer;
}
</style>
