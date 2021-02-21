import {User} from "@acrobatt";

export interface UserSignup {
  name: string
  firstName: string
  email: string
  password: string
  passwordConfirmation: string
}

export interface UserSignin {
  email: string
  password: string
}

interface UserWithtoken extends User {
  token: string
}
