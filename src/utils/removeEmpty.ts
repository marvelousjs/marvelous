export const removeEmpty = (object: any) => {
  Object.entries(object).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      delete object[key];
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      object[key] = removeEmpty(value);
    }
  });
  return object;
};
