import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { signIn } from 'next-auth/react';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  jwt: {
    encryption: true,
  },
  secret: 'TODO: Add better secret',
  callbacks: {
    async jwt(token, account) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token.token;
    },
    redirect: async (url, _baseUrl) => {
      if (url === '/request') {
        return Promise.resolve('/');
      }
      return Promise.resolve('/');
    },
  },
});
