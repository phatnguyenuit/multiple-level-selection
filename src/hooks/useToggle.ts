import { useState } from 'react';

const useToggle = (
  initialValue = false,
): [
  boolean,
  () => void,
  () => void,
  () => void,
  React.Dispatch<React.SetStateAction<boolean>>,
] => {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue((prev) => !prev);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  return [value, toggle, setTrue, setFalse, setValue];
};

export default useToggle;
