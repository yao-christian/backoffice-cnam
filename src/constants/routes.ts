/**
 * An array of routes that are accessible to the public
 * These routes do not require authentification
 * @type {string[]}
 */
export const publicRoutes = [
  "/new-verification",
  "/api/sales",
  "/api/users/auth",
  "/PREPAY/buisness/session",
  "/PREPAY/buisness/notifpay",
  "/PREPAY/buisness/solde",
];

/**
 * An array of routes that are used for authentification
 * These routes will redirect logged in users to /
 * @type {string[]}
 */
export const authRoutes = [
  "/login",
  "/register",
  "/reset-password",
  "/new-password",
  "/email-verification",
  "/new-verification",
];

/**
 * The prefix for API authentification routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
/**
 * The prefix for API authentification routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
