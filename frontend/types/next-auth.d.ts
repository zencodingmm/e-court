import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface User {
        username: string;
        type: string;
        user_code: string;
        user_rank: string;
    }
    interface Session {
        user: User & {
            username: string;
        };
        token: {
            username: string;
        };
    }
}
