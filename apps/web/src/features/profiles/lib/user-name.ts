import { PROFILE_VALIDATIONS } from "./profile-validations";

export const USER_NAME_REGEX = new RegExp(
  `^[a-z0-9_]{${PROFILE_VALIDATIONS.userNameMinLength},${PROFILE_VALIDATIONS.userNameMaxLength}}$`,
);

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
