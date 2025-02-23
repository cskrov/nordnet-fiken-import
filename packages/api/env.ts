export const getEnv = (name: string): string => {
  const value = process.env[name];

  if (typeof value !== 'string') {
    console.error(`Missing environment variable "${name}".`);
    process.exit(1);
  }

  return value;
};
