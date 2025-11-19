export const USER_PROFILES = [
  'Admin Master',
  'Gerente Comercial',
  'Calculista Sênior',
  'Operador Logístico',
  'Analista Financeiro',
  'Cliente Externo',
  'Auditor',
  'Read-Only',
] as const

export type UserProfile = (typeof USER_PROFILES)[number]

export interface User {
  id: number
  name: string
  email: string
  profile: UserProfile
  status: 'Ativo' | 'Inativo'
  lastAccess?: string
  avatarSeed?: string
}
