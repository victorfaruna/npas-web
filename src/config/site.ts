export const siteConfig = {
  name: 'npas',
  description: '',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  links: {
    github: '',
    twitter: '',
  },
} as const

export type SiteConfig = typeof siteConfig
