export interface User {
    id: string
    createdTimestamp: number
    enabled: boolean
    emailVerified: boolean
    username: string
    email?: string
    phone?: string
    doc?: string
    firstName?: string
    lastName?: string
    groups?: string[]
    roles?: string[]
    effective_roles?: string[]
}