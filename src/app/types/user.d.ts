export interface User {
  name: string,
  image: string,
  email: string,
  id: string
}

export interface UserState {
  user: User | null,
  setUser: (user: User) => void,
  clearUser: () => void
}