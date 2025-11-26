export function isInstitutionalEmail(email: string) {
  const domain = "@modyuniversity.ac.in";
  return email.toLowerCase().endsWith(domain);
}
