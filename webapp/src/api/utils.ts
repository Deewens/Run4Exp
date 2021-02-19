const updateOptions = (options:  RequestInit) => {
  const update = { ...options };

  if (localStorage.authorization_token) {
    update.headers = {
      ...update.headers,
      Authorization: `Bearer ${localStorage.authorization_token}`,
    };
  }

  return update;
}

export const unauthFetch = (input: Request | string, init?: RequestInit | undefined) => {
  return fetch(input, init).then(checkStatus)
}

export const authFetch = (input: Request | string, init?: RequestInit | undefined) => {
  if (init) return fetch(input, updateOptions(init)).then(checkStatus)
  else return fetch(input).then(checkStatus)
}


/**
 * @typedef Error
 * @property {string} message of the error
 * @property {number} HTTP status code
 */

/**
 * @param {Response} res
 * @return {Response | Promise<Error>} Promise object
 */
export const checkStatus = (res: Response) => {
  if (res.ok) {
    return res;
  } else {
    return res.text()
      .then(msg => { throw new Error(msg) });
  }
};

export const urlPrefix = 'http://localhost:8080';