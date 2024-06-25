import { useState, useEffect } from "react";

const useDelayedText = (showSidebar, delay = 150) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (showSidebar) {
      const timeout = setTimeout(() => setShowText(true), delay);
      return () => clearTimeout(timeout);
    } else {
      setShowText(false);
    }
  }, [showSidebar, delay]);

  return showText;
};

export default useDelayedText;
