import 'async-validator'

declare module 'async-validator' {
  interface RuleItem {
    trigger?: string | string[]
  }
}