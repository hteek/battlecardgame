import { AppSyncResolverEvent } from 'aws-lambda';

export const appSyncResolverEvent = <T>(props?: { roles?: string[]; sub?: string; userId?: string }, args?: T) => {
  const { roles, sub, userId } = props || {};
  return {
    ...(args ? { arguments: args } : {}),
    identity: {
      claims: {
        ...(roles ? { roles: JSON.stringify(roles) } : {}),
        userId,
      },
      sub,
    },
  } as AppSyncResolverEvent<T>;
};
