export const parseEnv = (mapping = {}) => {
  const env: any = {};
  Object.keys(mapping).forEach(key => {
    const name = (mapping as any)[key];
    const value = process.env[name];
    if (value === undefined) {
      console.log(`WARNING: Environment Variable is undefined: ${name}`);
    }
    if (value === '') {
      console.log(`WARNING: Environment Variable is empty: ${name}`);
    }
    env[key] = process.env[name];
  });
  return env;
};
