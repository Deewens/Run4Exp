
export const colorList: IColors = {
  brand: "#00373E",
  light: "#FFFFFF",
  gray: "gray",
  green: "#6DC852",
  greenDark: "#679e57",
  greenLight: "#6FD750",
  blue: "#509AD7",
  blueDark: "#4884b5",
  blueLight: "#2D9BF0",
  red: "#F24726",
  redDark: "#d1482d",
  redLight: "#FF8F70",
  black: "#000000",
};

export interface IColors {
  black: string,
  brand: string,
  light: string,
  gray: string,
  green: string,
  greenDark: string,
  greenLight: string,
  blue: string,
  blueDark: string,
  blueLight: string,
  red: string,
  redDark: string,
  redLight: string,
}

export type BaseColors =
  | "brand"
  | "light"
  | "gray"
  | "green"
  | "blue"
  | "red";

export type Colors =
  BaseColors
  | "greenDark"
  | "greenLight"
  | "blueDark"
  | "blueLight"
  | "redDark"
  | "redLight";

export let getColor = (colorName: Colors): string => {
  return colorList[colorName];
}

export let getDarkColor = (colorName: BaseColors): string => {
  return colorList[colorName + "Dark" as Colors];
}

export let getLightColor = (colorName: BaseColors): string => {
  return colorList[colorName + "Light" as Colors];
}