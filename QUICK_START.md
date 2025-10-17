# 快速启动指南

## 项目说明

这是一个基于 PrimeVue 的表单验证库，使用 async-validator 作为验证引擎，API 设计兼容 Element Plus 和 Ant Design Vue。

## 目录结构

```
prime-vue-async-validator/
├── src/                      # 库源代码
│   ├── components/          # 组件
│   │   ├── Form.vue        # 表单容器
│   │   ├── FormItem.vue    # 表单项
│   │   └── fields/         # 表单字段组件
│   ├── composables/        # 可组合函数
│   ├── types/              # TypeScript 类型
│   └── index.ts            # 导出入口
├── example/                 # 示例代码
│   ├── FormExample.vue     # 完整示例
│   └── main.js             # 示例入口
├── README.md               # 详细文档
└── package.json            # 项目配置
```

## 运行示例

1. **安装依赖**
```bash
npm install
```

2. **运行开发服务器**
```bash
npm run dev
```

3. **访问示例**
浏览器会自动打开 `http://localhost:3000`，展示完整的表单验证示例。

## 在项目中使用

### 方式一：直接复制源码

将 `src` 目录复制到你的项目中，然后导入使用：

```vue
<template>
  <Form ref="formRef" :model="formData" :rules="rules">
    <FormItem prop="username" label="用户名">
      <FInputText v-model="formData.username" />
    </FormItem>
  </Form>
</template>

<script setup>
import { Form, FormItem, FInputText } from '@/path-to-src'
</script>
```

### 方式二：作为库构建

1. **构建库文件**
```bash
npm run build:lib
```

2. **在其他项目中使用**
```javascript
import { Form, FormItem, FInputText } from 'primevue-form-validator'
```

## 核心功能

### 1. 表单验证
- 支持所有 async-validator 规则类型
- 支持同步和异步验证
- 支持自定义验证器
- 验证规则格式兼容 Element Plus / Ant Design Vue

### 2. 表单组件
- **Form**: 表单容器，管理整体验证
- **FormItem**: 表单项，管理单个字段
- **FInputText**: 文本输入
- **FInputNumber**: 数字输入
- **FDropdown**: 下拉选择
- **FCalendar**: 日期选择
- **FTextarea**: 多行文本

### 3. 表单方法
- `validate()`: 验证整个表单
- `validateField()`: 验证指定字段
- `resetFields()`: 重置表单
- `clearValidate()`: 清除验证状态

## 示例代码

查看 `example/FormExample.vue` 获取完整示例，包括：
- 基本验证
- 异步验证
- 自定义验证器
- 表单联动
- 动态表单

## 自定义扩展

### 创建自定义表单组件

```vue
<template>
  <YourComponent
    v-model="modelValue"
    v-bind="mergedAttrs"
    :disabled="isDisabled"
  />
</template>

<script setup>
import { computed, useAttrs } from 'vue'
import { useFormItemBindings } from '@/composables/useFormItem'

const props = defineProps({
  modelValue: {},
  validateEvent: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()

const { mergedAttrs, formItem } = useFormItemBindings(attrs, {
  validateEvent: props.validateEvent
})

const isDisabled = computed(() => {
  return formItem?.value?.formContext?.disabled?.value || false
})

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
```

## 注意事项

1. **PrimeVue 依赖**: 确保项目中已安装 PrimeVue 和相关样式
2. **Vue 3**: 本库仅支持 Vue 3 Composition API
3. **TypeScript**: 提供完整的类型支持，建议使用 TypeScript
4. **样式**: 使用 PrimeVue 的默认样式，可通过 CSS 变量自定义

## 问题反馈

如有问题或建议，请在项目中创建 Issue。

## License

MIT