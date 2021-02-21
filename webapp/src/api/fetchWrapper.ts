const Api = {
  get,
  post
}

export default Api

const apiUrl: string = 'http://localhost:8080/api'
console.log(apiUrl)
const localStorageKey = 'AUTH_TOKEN'

function get<T>(input: Request | string, init?: RequestInit) {
  const token = localStorage.getItem(localStorageKey)

  const requestInit: RequestInit = {
    method: 'GET',
    ...init
  }

  if (token) {
    requestInit.headers = {
      Authorization: `Bearer ${token}`,
      ...requestInit.headers,
    }
  }


  return fetch(apiUrl + input, requestInit).then(handleResponse).then(res => res.json()).then(data => data as T)
}

function post<T>(input: Request | string, body: object, init?: RequestInit) {
  const token = localStorage.getItem(localStorageKey)

  const requestInit: RequestInit = {
    method: 'POST',
    body: JSON.stringify(body),
    ...init
  }

  // Content-Type JSON: can be replaced if a Content-Type is passed in the headers of the init object
  requestInit.headers = {
    'Content-Type': 'application/json',
    ...requestInit.headers
  }

  if (token) {
    requestInit.headers = {
      Authorization: `Bearer ${token}`,
      ...requestInit.headers,
    }
  }

  return fetch(apiUrl + input, requestInit).then(handleResponse).then(res => res.json()).then(data => data as T)
}

// Throw une exception si la requête renvoie une erreur
export const handleResponse = (res: Response) => {
  if (!res.ok) {
    return res.text()
      .then(msg => {
        try {
          msg = JSON.parse(msg);
        } catch (err) {
          console.error("JSON Parse failed for error");
        }

        throw {
          message: msg,
          status: res.status
        };
      });
  }

  return res
};

