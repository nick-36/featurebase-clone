import { useEffect, useRef } from "react";

export const useIntersectionObserver = (
    callback: () => void,
    options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }
  ) => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const targetRef = useRef<HTMLDivElement | null>(null);
  
    useEffect(() => {
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      }, options);
  
      if (targetRef.current) {
        observerRef.current.observe(targetRef.current);
      }
  
      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }, [callback, options]);
  
    return targetRef;
  };