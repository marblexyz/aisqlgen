export const isRunningLocally = (): boolean => {
  return process.env.NODE_ENV !== "production";
};
