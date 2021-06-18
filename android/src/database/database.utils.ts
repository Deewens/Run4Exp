export let stringifyData = (value) => {
  return JSON.stringify(value)
    .replace(/"x"/g, "x")
    .replace(/"y"/g, "y")
    .replace(/{/g, "\\{")
    .replace(/,/g, "\\,");
};
