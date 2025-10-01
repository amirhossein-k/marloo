// utils/handleChangeCheckbox.ts
export const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>, setState: (v: string) => void) => {
  const newValue = event.target.checked ? "انتشار" : "عدم انتشار";
  setState(newValue);
};
