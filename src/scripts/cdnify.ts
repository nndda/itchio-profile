// user/repo@main
// user/repo@version

export default function (
  str: string,
  userRepo: string,
  version: string,
): string {
  return str.replace(/https:\/\/cdn\.jsdelivr\.net\/.+?\/(.+?\/.+?)@(main)\//g, (
      match,
      userRepoMatch,
      verMainMatch,
    ): string => {
    return match.replace(`${userRepoMatch}@${verMainMatch}`, `${userRepo}@${version}`);
  });
}
