// 登录页面
<template>
  <div class="login" status-icon>
    <el-form
      ref="loginFormRef"
      class="login-form"
      :model="loginForm"
      :rules="loginRules"
    >
      <div class="login-title"><h3>用户登录</h3></div>
      <!-- 用户 -->
      <el-form-item prop="userName">
        <span class="svg-container">
          <i class="iconfont icon-icon-user"></i>
        </span>
        <el-input
          placeholder="用户账号"
          v-model="loginForm.userName"
          name="userName"
          type="text"
        />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <i class="iconfont icon-mima"></i>
        </span>

        <el-input
          placeholder="密码"
          v-model="loginForm.password"
          name="password"
          :type="PwdType"
          @keyup.enter="handleLogin"
        />
        <span class="pwd" @click="handleShowPwd">
          <i
            class="iconfont"
            :class="PwdType === 'text' ? 'icon-yanjing' : 'icon-eye'"
          ></i>
        </span>
      </el-form-item>
      <!-- 登录 -->
      <el-form-item>
        <el-button
          type="primary"
          style="width: 100%"
          @click="handleLogin"
          :loading="loading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
    <div class="tootip">
      <p>用户名：admin</p>
      <p>密码：123456</p>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { ref } from 'vue'
import { Loading } from 'element-plus/es/components/loading/src/service'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
// 定义表单数据
const loginForm = ref({
  userName: '',
  password: ''
})
// 验证表单规则
const loginRules = ref({
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码在6到16位之间', trigger: 'blur' }
  ]
})
// 显示隐藏密码
const PwdType = ref('password')
const handleShowPwd = () => {
  // 如果为true,则显示密码，否则隐藏密码
  if (PwdType.value === 'password') {
    PwdType.value = 'text'
  } else {
    PwdType.value = 'password'
  }
}
// 登录操作
const store = useStore()
const loginFormRef = ref(null)
const loading = ref(false)
const router = useRouter()
const handleLogin = () => {
  loginFormRef.value.validate(async (valid) => {
    // 验证表单是否输入
    if (!valid) return
    loading.value = true
    try {
      const res = await store.dispatch('user/login', loginForm.value)
      ElMessage.success('登录成功')
      // 登录成功操作
      loading.value = false
      // 跳转到首页
      router.push('/')
    } catch (error) {
      ElMessage.error(error.message)
    }
  })
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
