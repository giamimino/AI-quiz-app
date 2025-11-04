export default function validateWord(username: string) {
  const regex = /^[a-zA-Z0-9_\- ]+$/;

  if (regex.test(username)) {
    return { ok: true, value: username.trim() };
  }

  const sanitized = username.replace(/[^a-zA-Z0-9_\- ]/g, "");
  return { ok: false, value: sanitized };
}