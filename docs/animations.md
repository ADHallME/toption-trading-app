# Animation System

This document covers the animation system used in the Virtera Energy landing page, with special focus on the rock animation effect inspired by the GreenHarbor design.

## Overview

The animation system is built using **Framer Motion** and provides smooth, performant animations throughout the application. The centerpiece is the hero slider with its unique rock-like geometric animations that create an engaging user experience.

## Hero Slider Animation

### Rock Animation Effect

The hero section features a distinctive rock animation system that mimics the GreenHarbor design approach:

```tsx
// Geometric shape animation
<motion.div
  animate={{
    rotate: [0, 360],
    scale: [1, 1.1, 1],
  }}
  transition={{
    duration: 20,
    repeat: Infinity,
    ease: "linear"
  }}
  className="w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full border-2 border-white/30 backdrop-blur-sm"
/>
```

### Animation Layers

The rock effect consists of three concentric circles with different animation patterns:

1. **Outer Circle**: 20-second rotation with scale pulsing
2. **Middle Circle**: 15-second counter-rotation with scale shrinking
3. **Inner Circle**: 25-second reverse rotation with scale expansion

### Implementation Details

```tsx
// Hero.tsx - Rock Animation Component
const RockAnimation = () => {
  return (
    <div className="relative">
      {/* Outer ring */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full border-2 border-white/30 backdrop-blur-sm"
      />
      
      {/* Middle ring */}
      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-8 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full border border-white/20"
      />
      
      {/* Inner ring */}
      <motion.div
        animate={{
          rotate: [0, -360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-16 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full border border-white/10"
      />
    </div>
  )
}
```

## Content Transitions

### Slide Transitions

The hero content transitions smoothly between slides using Framer Motion's `AnimatePresence`:

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={currentSlide}
    initial={{ opacity: 0, scale: 1.1 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
    className="absolute inset-0"
  >
    {/* Slide content */}
  </motion.div>
</AnimatePresence>
```

### Text Animations

Text elements animate in with staggered delays:

```tsx
<motion.h1
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.4 }}
  className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
>
  {slides[currentSlide].title}
</motion.h1>
```

## Page Transitions

### Scroll-Triggered Animations

Components animate in as they enter the viewport:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="text-center"
>
  {/* Content */}
</motion.div>
```

### Staggered Animations

Multiple elements animate in sequence:

```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    viewport={{ once: true }}
  >
    {/* Item content */}
  </motion.div>
))}
```

## Performance Optimization

### Animation Best Practices

1. **Use `transform` properties**: Always animate `transform` properties (translate, scale, rotate) instead of layout properties
2. **Limit concurrent animations**: Avoid too many simultaneous animations
3. **Use `will-change` sparingly**: Only when necessary for complex animations
4. **Optimize for 60fps**: Keep animations smooth and performant

### Code Splitting

Animations are code-split to reduce initial bundle size:

```tsx
// Lazy load heavy animations
const HeavyAnimation = dynamic(() => import('./HeavyAnimation'), {
  loading: () => <div>Loading...</div>
})
```

## Custom Hooks

### useAnimationState

Custom hook for managing animation states:

```tsx
const useAnimationState = () => {
  const [isAnimating, setIsAnimating] = useState(false)
  
  const startAnimation = useCallback(() => {
    setIsAnimating(true)
    // Animation logic
  }, [])
  
  const stopAnimation = useCallback(() => {
    setIsAnimating(false)
  }, [])
  
  return { isAnimating, startAnimation, stopAnimation }
}
```

## Animation Variants

### Predefined Animation Variants

```tsx
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 }
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.2 }
}

const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 }
}
```

## Accessibility

### Reduced Motion

Respect user preferences for reduced motion:

```tsx
import { useReducedMotion } from 'framer-motion'

const Component = () => {
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <motion.div
      animate={shouldReduceMotion ? {} : { scale: [1, 1.1, 1] }}
      transition={{ duration: shouldReduceMotion ? 0 : 2 }}
    >
      {/* Content */}
    </motion.div>
  )
}
```

## Testing Animations

### Animation Testing

```tsx
// Test animation completion
const { getByTestId } = render(<AnimatedComponent />)
const element = getByTestId('animated-element')

// Wait for animation to complete
await waitFor(() => {
  expect(element).toHaveStyle({ opacity: '1' })
})
```

## Troubleshooting

### Common Animation Issues

1. **Animation not triggering**
   - Check if component is mounted
   - Verify animation props are correct
   - Ensure viewport conditions are met

2. **Performance issues**
   - Reduce number of concurrent animations
   - Use `transform` instead of layout properties
   - Consider using `will-change` for complex animations

3. **Animation conflicts**
   - Use unique keys for AnimatePresence
   - Avoid overlapping animation states
   - Clear animation timeouts on unmount

## Future Enhancements

### Planned Improvements

1. **Spring animations**: Add natural spring physics
2. **Gesture animations**: Touch and drag interactions
3. **3D animations**: Depth and perspective effects
4. **Animation presets**: Reusable animation configurations

---

*Last updated: June 2024* 