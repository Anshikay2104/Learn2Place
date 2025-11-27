// utils/requireAuth.ts
export const requireAuth = (
  user: any,
  router: any,
  redirectTo = "/auth/signup"
) => {
  if (!user) {
    router.push(redirectTo);
    return false;
  }
  return true;
};
