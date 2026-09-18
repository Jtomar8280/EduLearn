import { useEffect, useRef, useState } from "react";

function Counter({ count }) {
  const [value, setValue] = useState(1);
  const ref = useRef(null);

  useEffect(() => {
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const startTime = performance.now();
      const animate = (time) => {
        const progress = Math.min((time - startTime) / 1000, 1);
        setValue(Math.floor(1 + (count - 1) * progress));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }, { threshold: 0.5 });

    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [count]);

  return <div ref={ref}>{value.toLocaleString()}+</div>;
}

export default Counter;
