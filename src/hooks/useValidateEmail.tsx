export function useValidateEmail(value: string) {
  const stricter = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i
  return { email: value, validation: stricter.test(value) }
}