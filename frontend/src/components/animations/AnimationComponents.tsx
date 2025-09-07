import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useInViewAnimation } from '../../hooks/useAnimations.js';
import { FLOATING_ANIMATIONS } from '../../constants';

// Animation variants
const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const scaleOnHover: Variants = {
  rest: {
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

const slideInLeft: Variants = {
  hidden: {
    x: -100,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const slideInRight: Variants = {
  hidden: {
    x: 100,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Animation components
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ children, className }) => {
  const { ref, inView } = useInViewAnimation();

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
}

export const HoverCard: React.FC<HoverCardProps> = ({ children, className }) => {
  return (
    <motion.div
      variants={scaleOnHover}
      initial="rest"
      whileHover="hover"
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up';
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({ 
  children, 
  direction = 'up', 
  className 
}) => {
  const { ref, inView } = useInViewAnimation();
  
  const variants = direction === 'left' ? slideInLeft : 
                  direction === 'right' ? slideInRight : 
                  fadeInUp;

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface PageTransitionProps {
  children: React.ReactNode;
  pageKey?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, pageKey }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  color = '#1976d2' 
}) => {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        border: `3px solid ${color}20`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  from, 
  to, 
  duration = 2 
}) => {
  const [count, setCount] = React.useState(from);
  const { ref, inView } = useInViewAnimation();

  React.useEffect(() => {
    if (inView) {
      let startTime: number;
      const animateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);
        
        if (progress < 1) {
          setCount(Math.floor(from + (to - from) * progress));
          requestAnimationFrame(animateCount);
        } else {
          setCount(to);
        }
      };
      requestAnimationFrame(animateCount);
    }
  }, [inView, from, to, duration]);

  return (
    <span ref={ref}>
      {count}
    </span>
  );
};

interface FloatingCirclesProps {
  variant?: 'default' | 'dense' | 'minimal' | 'login';
}

export const FloatingCircles: React.FC<FloatingCirclesProps> = ({ 
  variant = 'default' 
}) => {
  const getCircleConfig = () => {
    switch (variant) {
      case 'login':
        return [
          { top: '10%', left: '15%', size: 120, opacity: 0.1, delay: 0 },
          { top: '60%', left: '5%', size: 80, opacity: 0.08, delay: 2 },
          { top: '20%', right: '10%', size: 100, opacity: 0.06, delay: 1 },
          { bottom: '20%', right: '20%', size: 60, opacity: 0.12, delay: 3 },
          { top: '70%', left: '60%', size: 90, opacity: 0.05, delay: 4 },
        ];
      case 'dense':
        return [
          { top: '-20%', right: '-10%', size: 300, opacity: 0.1, delay: 0 },
          { bottom: '-15%', left: '-5%', size: 200, opacity: 0.08, delay: 0 },
          { top: '30%', left: '80%', size: 150, opacity: 0.06, delay: 0 },
          { top: '60%', right: '70%', size: 100, opacity: 0.04, delay: 2 },
        ];
      case 'minimal':
        return [
          { top: '-10%', right: '-5%', size: 250, opacity: 0.1, delay: 0 },
          { bottom: '-10%', left: '-3%', size: 180, opacity: 0.08, delay: 0 },
        ];
      default:
        return [
          { top: '-10%', right: '-5%', size: 250, opacity: 0.1, delay: 0 },
          { bottom: '-10%', left: '-3%', size: 180, opacity: 0.08, delay: 0 },
          { top: '40%', left: '85%', size: 120, opacity: 0.06, delay: 0 },
        ];
    }
  };

  const circles = getCircleConfig();

  return (
    <>
      <style>{FLOATING_ANIMATIONS.keyframes}</style>
      {circles.map((circle, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            ...(circle.top && { top: circle.top }),
            ...(circle.bottom && { bottom: circle.bottom }),
            ...(circle.left && { left: circle.left }),
            ...(circle.right && { right: circle.right }),
            width: circle.size,
            height: circle.size,
            borderRadius: '50%',
            background: `rgba(255, 255, 255, ${circle.opacity})`,
            animation: `${
              circle.size >= 200 ? 'float' : 
              circle.size >= 150 ? 'floatSlow' : 'floatMedium'
            } ${
              circle.size >= 200 ? '6s' : 
              circle.size >= 150 ? '8s' : '7s'
            } ease-in-out infinite`,
            animationDelay: `${circle.delay}s`,
            zIndex: 1,
          }}
        />
      ))}
    </>
  );
};
