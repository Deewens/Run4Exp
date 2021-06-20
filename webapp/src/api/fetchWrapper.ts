import {ErrorApi} from "./type";
// File not used anymore, still there just for backup
//
// const Api = {
//   get,
//   post,
//   put,
//   putImg,
//   getImage,
// }
//
// export default Api
//
// const apiUrl: string = 'http://localhost:8080/api'
// console.log(apiUrl)
// const localStorageKey = 'AUTH_TOKEN'
//
// function get<T>(input: Request | string, auth = true, init?: RequestInit): Promise<T> {
//   const token = localStorage.getItem(localStorageKey)
//
//   const requestInit: RequestInit = {
//     method: 'GET',
//     ...init
//   }
//
//   if (token && auth) {
//     requestInit.headers = {
//       Authorization: `Bearer ${token}`,
//       ...requestInit.headers,
//     }
//   }
//
//
//   return fetch(apiUrl + input, requestInit).then(handleResponse).then(res => res.json()).then(res => res as Promise<T>)
// }
//
// function getImage(input: Request | string, auth = true, init?: RequestInit): Promise<string | null> {
//   const token = localStorage.getItem(localStorageKey)
//
//   const requestInit: RequestInit = {
//     method: 'GET',
//     ...init
//   }
//
//   if (token && auth) {
//     requestInit.headers = {
//       Authorization: `Bearer ${token}`,
//       ...requestInit.headers,
//     }
//   }
//
//
//   return fetch(apiUrl + input, requestInit).then(handleResponse)
//     .then(res => res.arrayBuffer())
//     .then(img => {
//       if (img.byteLength === 0) {
//         return null
//       } else {
//         return URL.createObjectURL(new Blob([img], {type: 'image/png'}))
//       }
//     })
// }
//
// type FetchParams = Parameters<typeof window.fetch>
//
// function post<T, U>(input: Request | string, body: T, auth = true, init?: RequestInit): Promise<U> {
//   const token = localStorage.getItem(localStorageKey)
//
//   const requestInit: RequestInit = {
//     method: 'POST',
//     body: JSON.stringify(body),
//     ...init
//   }
//
//   // Content-Type JSON: can be replaced if a Content-Type is passed in the headers of the init object
//   requestInit.headers = {
//     'Content-Type': 'application/json',
//     ...requestInit.headers
//   }
//
//   if (token && auth) {
//     requestInit.headers = {
//       Authorization: `Bearer ${token}`,
//       ...requestInit.headers,
//     }
//   }
//
//   return window.fetch(apiUrl + input, requestInit).then(handleResponse).then(res => res.json()).then(res => res as Promise<U>)
// }
//
// function put<T, U>(input: Request | string, body: T, auth = true, init?: RequestInit): Promise<U> {
//   const token = localStorage.getItem(localStorageKey)
//
//   if (body instanceof Blob) {
//     const formData = new FormData();
//     formData.append('file', body);
//
//     const requestInit = {
//       method: 'PUT',
//       body: formData,
//       ...init
//     }
//
//
//     if (token && auth) {
//       requestInit.headers = {
//         Authorization: `Bearer ${token}`,
//         ...requestInit.headers,
//       }
//     }
//
//     return window.fetch(apiUrl + input, requestInit).then(handleResponse).then()
//
//   } else {
//     const requestInit = {
//       method: 'PUT',
//       body: JSON.stringify(body),
//       ...init
//     }
//
//     // Content-Type JSON: can be replaced if a Content-Type is passed in the headers of the init object
//     requestInit.headers = {
//       'Content-Type': 'application/json',
//       ...requestInit.headers
//     }
//
//
//     if (token && auth) {
//       requestInit.headers = {
//         Authorization: `Bearer ${token}`,
//         ...requestInit.headers,
//       }
//     }
//
//     return window.fetch(apiUrl + input, requestInit).then(handleResponse).then(res => res.json()).then(res => res as Promise<U>)
//
//   }
// }
//
// function putImg(input: Request | string, body: Blob, auth = true, init?: RequestInit) {
//   const token = localStorage.getItem(localStorageKey)
//   const formData = new FormData();
//   formData.append('file', body);
//
//   const requestInit: RequestInit = {
//     method: 'PUT',
//     body: formData,
//     ...init
//   }
//
//
//   if (token && auth) {
//     requestInit.headers = {
//       Authorization: `Bearer ${token}`,
//       ...requestInit.headers,
//     }
//   }
//
//   return window.fetch(apiUrl + input, requestInit).then(handleResponse)
// }
//
// // Throw une exception si la requête renvoie une erreur
// export const handleResponse = (res: Response) => {
//   if (!res.ok) {
//     return res.text()
//       .then(msg => {
//         try {
//           msg = JSON.parse(msg);
//         } catch (err) {
//           console.error("JSON Parse failed for error");
//         }
//
//         const errorObj: ErrorApi = {
//           message: msg,
//           status: res.status
//         }
//         throw errorObj;
//       });
//   }
//
//   return res
// }
//
