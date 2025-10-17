<template>
  <div class="form-example-container">
    <h2>PrimeVue Form with async-validator Example</h2>

    <Form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <!-- 文本输入 -->
      <FormItem prop="username" label="用户名" required>
        <FInputText v-model="formData.username" placeholder="请输入用户名" />
      </FormItem>

      <!-- 邮箱输入 -->
      <FormItem prop="email" label="邮箱">
        <FInputText v-model="formData.email" type="email" placeholder="请输入邮箱" />
      </FormItem>

      <!-- 密码输入 -->
      <FormItem prop="password" label="密码">
        <FInputText v-model="formData.password" type="password" placeholder="请输入密码" />
      </FormItem>

      <!-- 确认密码 -->
      <FormItem prop="confirmPassword" label="确认密码">
        <FInputText v-model="formData.confirmPassword" type="password" placeholder="请再次输入密码" />
      </FormItem>

      <!-- 数字输入 -->
      <FormItem prop="age" label="年龄">
        <FInputNumber v-model="formData.age" :min="1" :max="120" />
      </FormItem>

      <!-- 日期选择 -->
      <FormItem prop="birthday" label="生日">
        <FCalendar v-model="formData.birthday" dateFormat="yy-mm-dd" />
      </FormItem>

      <!-- 单选下拉 -->
      <FormItem prop="city" label="城市">
        <FDropdown
          v-model="formData.city"
          :options="cities"
          optionLabel="name"
          optionValue="code"
          placeholder="请选择城市"
        />
      </FormItem>

      <!-- 多选下拉 -->
      <FormItem prop="tags" label="标签">
        <FDropdown
          v-model="formData.tags"
          :options="tagOptions"
          optionLabel="label"
          optionValue="value"
          multiple
          placeholder="请选择标签"
        />
      </FormItem>

      <!-- 文本域 -->
      <FormItem prop="description" label="个人简介">
        <FTextarea
          v-model="formData.description"
          rows="4"
          placeholder="请输入个人简介"
          :autoResize="false"
        />
      </FormItem>

      <!-- 操作按钮 -->
      <FormItem>
        <div class="button-group">
          <Button @click="handleSubmit" label="提交" severity="primary" />
          <Button @click="handleReset" label="重置" severity="secondary" />
          <Button @click="handleValidate" label="验证表单" severity="info" />
          <Button @click="handleClear" label="清除验证" severity="warning" />
        </div>
      </FormItem>
    </Form>

    <!-- 表单数据展示 -->
    <div class="form-data-display">
      <h3>表单数据</h3>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Button from 'primevue/button'
import { Form, FormItem, FInputText, FInputNumber, FDropdown, FCalendar, FTextarea } from '@primevue-form/validator'
import type { FormExpose, FormRules } from '@primevue-form/validator'

// 表单引用
const formRef = ref<FormExpose>()

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: null,
  birthday: null,
  city: null,
  tags: [],
  description: ''
})

// 城市选项
const cities = ref([
  { name: '北京', code: 'BJ' },
  { name: '上海', code: 'SH' },
  { name: '广州', code: 'GZ' },
  { name: '深圳', code: 'SZ' },
  { name: '杭州', code: 'HZ' }
])

// 标签选项
const tagOptions = ref([
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JavaScript', value: 'javascript' }
])

// 自定义验证器：验证两次密码是否一致
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 自定义异步验证器：模拟检查用户名是否存在
const checkUsername = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('用户名不能为空'))
  }

  // 模拟异步检查
  setTimeout(() => {
    if (value === 'admin' || value === 'test') {
      callback(new Error('用户名已存在'))
    } else {
      callback()
    }
  }, 500)
}

// 表单验证规则（完全兼容 Element Plus / Ant Design）
const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    { validator: checkUsername, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  // password: [
  //   { required: true, message: '请输入密码', trigger: 'blur' },
  //   { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  // ],
  // confirmPassword: [
  //   { required: true, message: '请再次输入密码', trigger: 'blur' },
  //   { validator: validateConfirmPassword, trigger: 'blur' }
  // ],
  // age: [
  //   { required: true, message: '请输入年龄', trigger: 'blur' },
  //   { type: 'number', min: 1, max: 120, message: '年龄必须在 1-120 之间', trigger: 'change' }
  // ],
  // birthday: [
  //   { required: true, message: '请选择生日', trigger: 'change' },
  //   { type: 'date', message: '请选择有效的日期', trigger: 'change' }
  // ],
  // city: [
  //   { required: true, message: '请选择城市', trigger: 'change' }
  // ],
  // tags: [
  //   { type: 'array', min: 1, message: '请至少选择一个标签', trigger: 'change' },
  //   { type: 'array', max: 3, message: '最多选择3个标签', trigger: 'change' }
  // ],
  description: [
    { max: 200, message: '个人简介不能超过200个字符', trigger: 'blur' }
  ]
}

// 提交表单
const handleSubmit = async () => {
  try {
    const valid = await formRef.value!.validate()
    console.log('验证通过，提交数据:', valid)
    // alert('表单验证通过！')
  } catch (error) {
    console.log('验证失败:', error)
    // alert('表单验证失败，请检查输入！')
  }
}

// 重置表单
const handleReset = () => {
  formRef.value!.resetFields()
  console.log('表单已重置')
}

// 验证表单
const handleValidate = async () => {
  try {
    await formRef.value!.validate()
    alert('表单验证通过！')
  } catch (error) {
    alert('表单验证失败！')
  }
}

// 清除验证
const handleClear = () => {
  formRef.value!.clearValidate()
  console.log('已清除所有验证')
}
</script>

<style scoped>
.form-example-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: var(--primary-color);
  margin-bottom: 30px;
}

.button-group {
  display: flex;
  gap: 10px;
}

.form-data-display {
  margin-top: 40px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.form-data-display h3 {
  margin-top: 0;
  color: #666;
}

.form-data-display pre {
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>