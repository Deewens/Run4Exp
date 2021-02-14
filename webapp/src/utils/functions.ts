export function checkForDuplicateProperty(array: [], objectProperty: string) {
  let seen = new Set();
  let hasDuplicates = array.some(currentObject => {
    return seen.size === seen.add(currentObject[objectProperty]).size;
  });

  return hasDuplicates;
}