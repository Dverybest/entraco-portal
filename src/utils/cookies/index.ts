import Cookies from "universal-cookie";

/**
 * Retrieves the value of a cookie by its name.
 * @param name - The name of the cookie to retrieve.
 * @returns The cookie value as a string or undefined if not found.
 */
export const getCookieValue = <T>(name: string): T | undefined => {
  const cookies = new Cookies(null, { path: "/", sameSite: "strict" });
  return cookies.get(name);
};

export const hasCookieKey = (name: string): boolean => {
  return !!getCookieValue(name);
};

/**
 * Sets a cookie with the specified name and value.
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 * @param maxAge - The maximum age of the cookie in seconds (default: 3600 seconds).
 */
export const setCookieValue = (name: string, value: string | object): void => {
  const cookies = new Cookies(null, { path: "/", sameSite: "strict" });
  cookies.set(name, value);
};

/**
 * Removes a cookie by its name.
 * @param name - The name of the cookie to remove.
 */
export const removeCookie = (name: string): void => {
  const cookies = new Cookies(null, { path: "/", sameSite: "strict" });
  cookies.remove(name);
};
