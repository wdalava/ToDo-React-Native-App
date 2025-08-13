export const getToday = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};
