import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axiosInstance from '../../../../utils/axiosInstance';

const handler = NextAuth({
    secret: 'ecourt',
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
                user_code: {label: 'User Code', type: 'password'}
            },
            async authorize(credentials) {
                const response = await axiosInstance.post('/api/auth', { username: credentials?.username, password: credentials?.password, user_code: credentials?.user_code });

                const { data: user } = response.data;

                if (response.status === 200) {
                    return user;
                }

                if (response.status === 500) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    username: user.username,
                    type: user.type,
                    user_code: user.user_code,
                    user_rank: user.user_rank
                };
            }

            return token;
        },
        async session({ session, user, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username,
                    type: token.type,
                    user_code: token.user_code,
                    user_rank: token.user_rank
                }
            };
        }
    },
    pages: {
        signIn: '/auth/login',
    }
});

export { handler as GET, handler as POST };
