export function getAuthErrorMessage(error: {
  message?: string;
  code?: string;
}): string {
  const message = (error.message || "").toLowerCase();
  const code = (error.code || "").toLowerCase();

  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid_credentials") ||
    code === "invalid_credentials"
  ) {
    return "Incorrect email or password.";
  }

  if (
    message.includes("user already registered") ||
    message.includes("already been registered") ||
    code === "user_already_exists"
  ) {
    return "An account with this email already exists. Please sign in.";
  }

  if (message.includes("email not confirmed")) {
    return "Please confirm your email before signing in.";
  }

  if (message.includes("password should be at least")) {
    return "Password must be at least 6 characters.";
  }

  if (message.includes("unable to validate email") || message.includes("invalid email")) {
    return "Please enter a valid email address.";
  }

  if (message.includes("signup is disabled")) {
    return "Sign up is currently disabled. Contact support.";
  }

  return error.message || "Something went wrong. Please try again.";
}
