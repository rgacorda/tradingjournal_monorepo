// Check if running on actual production domain (not localhost)
const isProduction = process.env.NODE_ENV === "production";
const isLocalhost =
  process.env.CORS_ORIGIN && process.env.CORS_ORIGIN.includes("localhost");

const commonOptions = {
  httpOnly: true,
  secure: isProduction && !isLocalhost,
  sameSite: isProduction && !isLocalhost ? "None" : "Lax",
  domain: isProduction && !isLocalhost ? ".trade2learn.site" : undefined,
  path: "/",
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
