export const ifNull = (message: string | null | undefined) => {
  return message ? message : "-";
};
