import { supabase } from './api.js'

export const realtimeService = {
  // Subscribe to student updates
  subscribeToStudentUpdates(callback) {
    console.log('Setting up real-time subscription for student updates')
    
    const subscription = supabase
      .channel('student_updates')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'students' 
        },
        (payload) => {
          console.log('Real-time student update received:', payload)
          callback(payload)
        }
      )
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'students'
        },
        (payload) => {
          console.log('Real-time student insert received:', payload)
          callback(payload)
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status)
      })

    return subscription
  },

  // Subscribe to class updates
  subscribeToClassUpdates(callback) {
    console.log('Setting up real-time subscription for class updates')
    
    const subscription = supabase
      .channel('class_updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'classes' 
        },
        (payload) => {
          console.log('Real-time class update received:', payload)
          callback(payload)
        }
      )
      .subscribe((status) => {
        console.log('Real-time class subscription status:', status)
      })

    return subscription
  },

  // Subscribe to transaction updates
  subscribeToTransactionUpdates(callback) {
    console.log('Setting up real-time subscription for transaction updates')
    
    const subscription = supabase
      .channel('transaction_updates')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'point_transactions' 
        },
        (payload) => {
          console.log('Real-time transaction insert received:', payload)
          callback(payload)
        }
      )
      .subscribe((status) => {
        console.log('Real-time transaction subscription status:', status)
      })

    return subscription
  },

  // Unsubscribe from all channels
  unsubscribe(subscription) {
    if (subscription) {
      console.log('Unsubscribing from real-time updates')
      supabase.removeChannel(subscription)
    }
  },

  // Get current connection status
  getConnectionStatus() {
    return supabase.getChannels()
  }
}

export default realtimeService
