export default {
  title: 'PrimeVue Form Validator',
  description: '基于 PrimeVue 和 async-validator 的表单验证库',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API', link: '/api/form' },
      { text: '示例', link: '/examples/basic' },
      { text: 'GitHub', link: 'https://github.com/yourusername/primevue-form-validator' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
            { text: '基础用法', link: '/guide/basic-usage' },
            { text: '验证规则', link: '/guide/validation-rules' },
            { text: '自定义验证', link: '/guide/custom-validation' },
            { text: '表单联动', link: '/guide/form-interaction' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 文档',
          items: [
            { text: 'Form 组件', link: '/api/form' },
            { text: 'FormItem 组件', link: '/api/form-item' },
            { text: '表单字段组件', link: '/api/form-fields' },
            { text: 'Composables', link: '/api/composables' },
            { text: '类型定义', link: '/api/types' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '示例',
          items: [
            { text: '基础示例', link: '/examples/basic' },
            { text: '异步验证', link: '/examples/async-validation' },
            { text: '动态表单', link: '/examples/dynamic-form' },
            { text: '表单联动', link: '/examples/form-interaction' },
            { text: '自定义组件', link: '/examples/custom-component' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/primevue-form-validator' }
    ]
  }
}