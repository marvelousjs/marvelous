const removeEmptyFromArray = (array: any[]) => {
  const newArray: any[] = array
    .filter(value => value !== undefined && value !== null)
    .map(value => {
      if (value instanceof Buffer) {
        return value;
      }
      if (Array.isArray(value)) {
        return removeEmptyFromArray(value);
      }
      if (typeof value === 'object') {
        return removeEmpty(value);
      }
      return value;
    });
  return newArray;
};

export const removeEmpty = (object: any) => {
  const newObject: any = {};
  Object.entries(object).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (value instanceof Buffer) {
      newObject[key] = value;
    } else if (Array.isArray(value)) {
      newObject[key] = removeEmptyFromArray(value);
    } else if (typeof value === 'object') {
      newObject[key] = removeEmpty(value);
    } else {
      newObject[key] = value;
    }
  });
  return newObject;
};
