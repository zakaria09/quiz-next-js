import {User, getServerSession} from 'next-auth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const session = async ({session, token}: any) => {
  session.user.id = token.id;
  session.user.tenant = token.tenant;
  return session;
};

export const getUserSession = async (): Promise<User | null> => {
  const authUserSession = await getServerSession({
    callbacks: {
      session,
    },
  });
  console.log('authUserSession', authUserSession);
  if (!authUserSession) return null;
  return authUserSession.user;
};
