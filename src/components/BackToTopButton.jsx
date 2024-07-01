// BackToTopButton.jsx
import React, { useState, useEffect } from "react";
import { ArrowUpCircleFill } from "react-bootstrap-icons";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to a certain distance
  const toggleVisibility = () => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="back-to-top">
      {isVisible && (
        <div onClick={scrollToTop}>
          <ArrowUpCircleFill size={48} className="text-primary" />
        </div>
      )}
    </div>
  );
};

export default BackToTopButton;
