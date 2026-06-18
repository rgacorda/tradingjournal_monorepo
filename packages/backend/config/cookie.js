const isProduction = process.env.NODE_ENV === 'production';
// COOKIE_SECURE must be explicitly set to "true" — requires HTTPS to be live.
// Keep it unset (or "false") while the server is HTTP-only; set it to "true"
// after SSL is provisioned (Part 7 of deployment guide).
const useSecureCookies = process.env.COOKIE_SECURE === 'true';
const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

const commonOptions = {
  httpOnly: true,
  secure: useSecureCookies,
  sameSite: useSecureCookies ? "None" : "Lax",
  domain: isProduction ? cookieDomain : undefined,
  path: '/',
};

const accessTokenCookieConfig = {
  ...commonOptions,
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshTokenCookieConfig = {
  ...commonOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

module.exports = {
  accessTokenCookieConfig,
  refreshTokenCookieConfig,
};