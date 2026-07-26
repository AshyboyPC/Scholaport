import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealTextProps {
  paragraphs?: {
    text: string;
    className?: string;
    highlightText?: string;
    highlightClassName?: string;
  }[];
  children?: React.ReactNode;
  containerClassName?: string;
}

export function revealText(str: string, baseClass: string = "") {
  return str.split(" ").map((word, i) => (
    <span key={word + i} className={`reveal-word inline-block ${baseClass}`}>
      {word}&nbsp;
    </span>
  ));
}

export function ScrollRevealText({ paragraphs, children, containerClassName = "" }: ScrollRevealTextProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    const words = container.current.querySelectorAll('.reveal-word');
    
    gsap.fromTo(words, 
      { opacity: 0.15 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
          end: "bottom 45%",
          scrub: true,
        }
      }
    );
  }, { scope: container });

  const renderWords = (str: string, baseClass: string) => {
    return str.split(" ").map((word, i) => (
      <span key={word + i} className={`reveal-word inline-block ${baseClass}`}>
        {word}&nbsp;
      </span>
    ));
  };

  return (
    <div ref={container} className={containerClassName}>
      {children}
      {paragraphs && paragraphs.map((p, index) => (
        <p key={index} className={p.className || ""}>
          {renderWords(p.text, "")}
          {p.highlightText && renderWords(p.highlightText, p.highlightClassName || "")}
        </p>
      ))}
    </div>
  );
}
