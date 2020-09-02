import { useState } from 'react';

export const useHanldeSelection = () => {
  const [open, setOpen] = useState(false);

  const toggleClick = () => {
    setOpen((prev) => !prev);
  };

  return {
    open,
    toggleClick,
  };
};
