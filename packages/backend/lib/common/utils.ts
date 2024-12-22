export const toKebabCase = (str: string) =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g)
    ?.map((x) => x.toLowerCase())
    .join('-');

export const toCamelCase = (str?: string) => {
  if (!str) return '';
  const s = str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g)
    ?.map((x: string) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
    .join('');
  return s && s.slice(0, 1).toLowerCase() + s.slice(1);
};

export const toUpperSnakeCase = (str?: string) => {
  if (!str) return '';
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x: string) => x.toUpperCase())
    .join('_');
};

export const capitalize = (str?: string) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');
export const uncapitalize = (str?: string) => (str ? str.charAt(0).toLowerCase() + str.slice(1) : '');
