// hooks/useRealtime.js
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../services/api'

export const useRealtime = (table, filter = {}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const filterEntries = useMemo(
    () => Object.entries(filter ?? {}),
    [filter]
  )
  const channelFilter = useMemo(
    () => filterEntries.map(([key, value]) => `${key}=eq.${value}`).join(','),
    [filterEntries]
  )

  useEffect(() => {
    // Initial fetch
    const fetchData = async () => {
      let query = supabase.from(table).select('*')
      
      filterEntries.forEach(([key, value]) => {
        query = query.eq(key, value)
      })

      const { data, error } = await query
      if (error) console.error('Error fetching data:', error)
      else setData(data || [])
      setLoading(false)
    }

    fetchData()

    // Set up real-time subscription
    const subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table,
          filter: channelFilter || undefined
        }, 
        (payload) => {
          setData(prevData => {
            switch (payload.eventType) {
              case 'INSERT':
                return [...prevData, payload.new]
              case 'UPDATE':
                return prevData.map(item => 
                  item.id === payload.new.id ? payload.new : item
                )
              case 'DELETE':
                return prevData.filter(item => item.id !== payload.old.id)
              default:
                return prevData
            }
          })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [table, filterEntries, channelFilter])

  return { data, loading }
}
