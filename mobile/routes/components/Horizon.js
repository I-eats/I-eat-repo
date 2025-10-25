import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useState } from "react"

export default function Horizon({ size, direction, color, style }) {
  const [colors, setColors] = useState([])

  const hexToRgba = (hex, alpha) => {
    if (!hex) return null
    const usable = hex?.length === 3 ? `${hex}${hex}` : hex

    const r = parseInt(usable.slice(1, 3), 16)
    const g = parseInt(usable.slice(3, 5), 16)
    const b = parseInt(usable.slice(5, 7), 16)

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  useEffect(() => {
    if (direction === "top" || direction === "right") {
      setColors([
        hexToRgba(color, 1),
        hexToRgba(color, 0.7),
        hexToRgba(color, 0),
      ])
    } else if (direction === "bottom" || direction === "left") {
      setColors([
        hexToRgba(color, 0),
        hexToRgba(color, 0.7),
        hexToRgba(color, 1),
      ])
    }
  }, [direction, color])

  let start = undefined, end = undefined;
  if (direction === "left" || direction === "right") {
    start = { x: 1, y: 0.5 }
    end = { x: 0, y: 0.5 }
  }

  return (
    <>
      {colors.length > 0 && (
        <LinearGradient
          colors={colors}
          start={start}
          end={end}
          style={[
            style, 
            (direction === 'top' || direction === 'bottom') && { height: size },
            (direction === 'left' || direction === 'right') && { width: size },
          ]}
        />
      )}
    </>
  )
}
