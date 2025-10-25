import { useEffect, useState } from "react"

import Section from "./Section"
import { getPopularItems } from "../../util/db-store"

export default function PopularView() {
  const [popular, setPopular] = useState([])
  
  useEffect(() => {
    const init = async () => {
      const { data, error } = await getPopularItems()

      if (error) {
        console.error("Error fetching popular items:", error)
        return
      }

      setPopular(data)
    }

    init()
  }, [])

  return (
    <Section
      title="Popular near you"
      items={popular}
    />
  )
}
