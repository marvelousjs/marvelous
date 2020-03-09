export const getQuery = (query: { [key: string]: string }) => {
  const queryParts: string[] = [];
  Object.entries(query).forEach(([key, value]) => {
    queryParts.push(`${key}=${value}`);
  });
  if (queryParts.length === 0) {
    return '';
  }
  return `?${queryParts.join('&')}`;
};
