export function checkForDuplicateProperty(array: [], objectProperty: string) {
  let seen = new Set();
  let hasDuplicates = array.some(currentObject => {
    return seen.size === seen.add(currentObject[objectProperty]).size;
  });

  return hasDuplicates;
}

export function isEmpty(str: string) {
  return !str.trim().length
}

export function isEmailValid(mail: string) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)
}