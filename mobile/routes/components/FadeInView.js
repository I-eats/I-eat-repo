import { memo, useEffect, useRef } from "react"
import { Animated } from "react-native"

const FadeInView = memo(({ children, style, time = 300, delay=0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (delay > 0) {
      const timeout = setTimeout(() => {
        fadeIn()
      }, delay)
      return () => clearTimeout(timeout)
    } else {
      fadeIn()
    }
  }, [fadeAnim])
  
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: time,
      useNativeDriver: true,
    }).start()
  }

  return (
      <Animated.View
        style={[style, { opacity: fadeAnim }]}
      >
        {children && children}
      </Animated.View>
  )
})

export default FadeInView