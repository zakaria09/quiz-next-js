import {NextAuthOptions} from 'next-auth';
import Google from 'next-auth/providers/google';
import {PrismaAdapter} from '@auth/prisma-adapter';
import {prisma} from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({token, user}) {
      // Ensure token.id exists if user is available
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({session, token}) {
      // Ensure token.id exists before assigning
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({user, account}) {
      if (!user.email) return false; // Ensure email exists
      if (!account) return false; // Ensure email exists

      const existingUser = await prisma.user.findUnique({
        where: {email: user.email},
        include: {accounts: true},
      });

      if (existingUser) {
        const hasSameProvider = existingUser.accounts.some(
          (acc) => acc.provider === account.provider
        );

        if (!hasSameProvider) {
          // Link new provider to existing account
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              id_token: account.id_token,
              scope: account.scope,
              session_state: account.session_state,
            },
          });
        }
      }

      return true;
    },
  },
  session: {
    strategy: 'jwt',
  },
};
