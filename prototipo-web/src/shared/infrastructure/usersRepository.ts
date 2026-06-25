import type { User } from '@/shared/domain/entities'
import { store } from './store'

/** Operaciones de persistencia sobre la colección de usuarios. */
export const usersRepository = {
  add(user: User) {
    store.update((data) => ({ ...data, users: [...data.users, user] }))
  },

  mutate(id: string, updater: (u: User) => User) {
    store.update((data) => ({
      ...data,
      users: data.users.map((u) => (u.id === id ? updater(u) : u)),
    }))
  },
}
