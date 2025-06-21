export const numberFormat = (value: number) => {
  return new Intl.NumberFormat("vi").format(value);
};
