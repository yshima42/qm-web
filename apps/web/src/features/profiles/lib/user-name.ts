export const USER_NAME_REGEX = /^[a-z0-9_]{3,20}$/;

export function generateUserName(userId: string) {
  return userId.replace(/-/g, "").substring(0, 10);
}

export function normalizeUserNameInput(userName?: string | null) {
  if (!userName) return null;
  const trimmed = userName.trim().toLowerCase();
  return trimmed.length ? trimmed : null;
}

export function isValidUserName(userName: string) {
  return USER_NAME_REGEX.test(userName);
}
