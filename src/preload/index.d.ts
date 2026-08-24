import type { RelexApi } from './index'

declare global {
  interface Window {
    relex: RelexApi
  }
}

export {}
