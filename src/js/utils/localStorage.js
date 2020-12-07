export const storeObj = (key, value) => {
  window.localStorage.setItem(`${key}`, JSON.stringify(value));
};

export const getObj = (key) => {
  return JSON.parse(window.localStorage.getItem(`${key}`));
};

export const removeObj = (key) => {
  return window.localStorage.removeItem(`${key}`);
};
