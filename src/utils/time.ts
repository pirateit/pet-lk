export const convertTime = (date: Date): string | null => {
  if (date) {
    return `${date.toLocaleDateString()} - ${date.toTimeString().slice(0, 5)}`;
  };

  return null;
};
