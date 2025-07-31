/*
	Updated version of ScrollReveal for broader usage in sections or blocks
	- No longer restricted to only text animations
	- Ensures visibility of children content (videos, divs, spans, etc.)
	- Applies smooth fade-in and slight slide-up on scroll
*/

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollReveal.css";

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = false,
  baseOpacity = 0.1,
  baseY = 30,
  blurStrength = 5,
  containerClassName = "",
  animationStart = "top 90%",
  animationEnd = "top 40%",
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef?.current || window;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        scroller,
        start: animationStart,
        end: animationEnd,
        scrub: true,
      },
    });

    // Animate opacity and position
    timeline.fromTo(
      el,
      {
        opacity: baseOpacity,
        y: baseY,
        filter: enableBlur ? `blur(${blurStrength}px)` : "none",
      },
      {
        opacity:1,
        y: 0,
        filter: "blur(0px)",
        duration: 3,
        ease: "power2.out",
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [scrollContainerRef, baseOpacity, baseY, blurStrength, enableBlur, animationStart, animationEnd]);

  return (
    <div ref={containerRef} className={`scroll-reveal-container ${containerClassName}`}>
      {children}
    </div>
  );
};

export default ScrollReveal;
