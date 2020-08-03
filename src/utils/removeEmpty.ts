const removeEmptyFromArray = (array: any[]) => {
  const newArray: any[] = array
    .filter(v => v !== undefined && v !== null)
    .map(v => {
      if (Array.isArray(v)) {
        return removeEmptyFromArray(v);
      }
      if (typeof v === 'object') {
        return removeEmpty(v);
      }
      return v;
    });
  return newArray;
};

export const removeEmpty = (object: any) => {
  const newObject: any = {};
  Object.entries(object).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      newObject[key] = removeEmptyFromArray(value);
    } else if (typeof value === 'object') {
      newObject[key] = removeEmpty(value);
    } else {
      newObject[key] = value;
    }
  });
  return newObject;
};
