export interface User {
  id:         string
  firstName:  string
  lastName:   string
  /** firstName + lastName */
  name:       string
  email:      string
  phone?:     string
  role?:      string
  gender?:    string
  age?:       number
  avatar:     string | null
}

export interface AuthState {
  user:            User | null
  token:           string | null
  isAuthenticated: boolean
}
