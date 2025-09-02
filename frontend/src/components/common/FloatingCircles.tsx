import React from 'react';
import { FLOATING_ANIMATIONS } from '../../constants';

/**
 * FloatingCircles Component
 * Animated background circles for glass-morphism pages
 */
export const FloatingCircles: React.FC = () => {
  return (
    <>
      <style>{FLOATING_ANIMATIONS.keyframes}</style>
      {/* Large circle */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: FLOATING_ANIMATIONS.circle.large.width,
          height: FLOATING_ANIMATIONS.circle.large.height,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: FLOATING_ANIMATIONS.circle.large.animation,
          zIndex: 1,
        }}
      />
      {/* Medium circle */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-3%',
          width: FLOATING_ANIMATIONS.circle.medium.width,
          height: FLOATING_ANIMATIONS.circle.medium.height,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          animation: FLOATING_ANIMATIONS.circle.medium.animation,
          zIndex: 1,
        }}
      />
      {/* Small circle */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '85%',
          width: FLOATING_ANIMATIONS.circle.small.width,
          height: FLOATING_ANIMATIONS.circle.small.height,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.06)',
          animation: FLOATING_ANIMATIONS.circle.small.animation,
          zIndex: 1,
        }}
      />
    </>
  );
};

export default FloatingCircles;
