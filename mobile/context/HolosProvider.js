import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getUserCredits, getUserInformation } from "../util/authentication";
import DeliverUs from "../routes/DeliverUs";
import supabase from "../util/supa";

const HolosContext = createContext()

export default function FontProvider({ children }) {
  const [user, setUser] = useState(null)
  const [creditCount, setCreditCount] = useState(0)

  const [cart, setCart] = useState({ })
  const [order, setOrder] = useState(null)
  const [listen, setListen] = useState(false)

  const [isViewingCart, setIsViewingCart] = useState(false)
  const [isViewingOrder, setIsViewingOrder] = useState(false)

  const totalItemsInCart = useMemo(() => {
    return Object.values(cart).reduce((acc, curr) => acc + curr, 0);
  }, [cart]);

  useEffect(() => {
    const init = async () => {
      const { data, error } = await getUserInformation()
    
      if (error) {
        console.log("error getting user information in HolosProvider: ", error);
      } else {
        setUser(data)

        if (data?.role === 3 || data?.role === "labor") {
          setListen(true)
        }

        console.log("getting this user_credit_id: ", data.user_credit_id)
        const { credit_count, error: creditError } = await getUserCredits({ user_credit_id: data.user_credit_id })
        console.log("fetched user credits: ", credit_count, creditError)
        if (!creditError) {
          setCreditCount(credit_count)
        }
      }
    }

    init()
  }, [])

  useEffect(() => {
    if (order && order.status === 'pending') {
      // listen to updates of the order to open the order view
      supabase
        .channel('realtime:orders')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'order' }, payload => {
          console.log('CUSTOMER Change received!', payload)
          const newStatus = payload.new.status
          
          setOrder(prev => ({
            ...prev,
            status: newStatus
          }))
        })
        .subscribe()
    }
  }, [order])

  const theState = useMemo(() => ({
    user,
    setUser,
    cart, 
    setCart,
    totalItemsInCart,

    isViewingCart,
    setIsViewingCart,
    isViewingOrder,
    setIsViewingOrder,

    order,
    setOrder,

    creditCount,
    setCreditCount
  }), [
    user,
    cart,
    totalItemsInCart,
    isViewingCart,
    isViewingOrder,
    order,
    creditCount
  ])

  return (
    <HolosContext.Provider value={theState}>
      {!listen ? children : (
        <DeliverUs user={user} />
      )}
    </HolosContext.Provider>
  )
}

export const useHolos = () => {
  return useContext(HolosContext)
}