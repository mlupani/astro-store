import { DefaultSession, defaultUser } from '@auth/core/types'

declare module '@auth/core/types' {
    interface User extends defaultUser {
        role?: string;
    }

    interface Session extends DefaultSession {
        user: User;
    }
}