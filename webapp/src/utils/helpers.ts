/**
 * Get the value of a cookie
 * Source: https://gist.github.com/wpsmith/6cf23551dd140fb72ae7
 * @param  {String} name  The name of the cookie
 * @return {String}       The cookie value
 */
export function getCookie (name: string) {
  let value = '; ' + document.cookie;
  let parts = value.split(`; ${name}=`);
  if (parts.length == 2) return parts.pop()?.split(';').shift();
}