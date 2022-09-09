export interface PublicRegistration {
    doc: string
    email: string
    first_name: string
    last_name: string
    password: string
    confirmPassword: string
}

export interface PublicActivation {
    code: string
}