export interface FormDataMember {
  username: string
  name: string
  img_file: File | null
  email: string
  phone?: string
  role: string
}

export interface FormErrors {
  username?: string
  name?: string
  img_file?: string
  email?: string
  phone?: string
}