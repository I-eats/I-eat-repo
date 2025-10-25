# Order Placement System
*Comprehensive food ordering system for I-Eat University Food Delivery Platform*

## 📋 Overview

The I-Eat order placement system enables students to browse restaurants, select menu items, customize orders, and place food orders with campus-specific delivery locations. The system integrates with the points system for payment and provides real-time order tracking.

## 🎯 **Core Requirements**

### Order Process
- **Restaurant Browsing**: View available restaurants and their menus
- **Menu Selection**: Browse menu items with descriptions, prices, and images
- **Customization**: Modify items (size, toppings, special instructions)
- **Cart Management**: Add/remove items, update quantities
- **Checkout Process**: Review order, select payment method, place order
- **Order Confirmation**: Receive order confirmation and tracking information

### Payment Integration
- **Points Payment**: Use earned points for full or partial payment
- **Credit/Debit Cards**: Traditional payment methods via Stripe
- **Split Payment**: Combine points and card payment
- **Payment Validation**: Real-time payment processing and validation

## 🏗️ **Technical Architecture**

### Frontend Components
- **RestaurantList**: Display available restaurants
- **MenuDisplay**: Show restaurant menu items
- **MenuItem**: Individual menu item with customization options
- **ShoppingCart**: Cart management and checkout
- **CheckoutForm**: Payment and delivery information
- **OrderConfirmation**: Order summary and tracking

### Backend Services
- **Menu API**: Restaurant and menu data management
- **Order API**: Order creation and management
- **Payment API**: Payment processing integration
- **Points API**: Points balance and redemption
- **Location API**: Campus delivery locations

### Database Schema
```sql
-- Restaurants table
CREATE TABLE public.restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  cuisine_type TEXT,
  rating DECIMAL(3,2),
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  minimum_order DECIMAL(10,2) DEFAULT 0,
  estimated_delivery_time INTEGER, -- minutes
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items table
CREATE TABLE public.menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  preparation_time INTEGER, -- minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES public.restaurants(id),
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  points_used DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  special_instructions TEXT,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎨 **User Interface**

### Restaurant Browsing
- **Grid Layout**: Card-based restaurant display
- **Filter Options**: Cuisine type, rating, delivery time
- **Search Functionality**: Search by restaurant name or cuisine
- **Sort Options**: By rating, delivery time, or distance
- **Restaurant Cards**: Name, image, rating, delivery time, minimum order

### Menu Display
- **Category Tabs**: Organize menu items by category
- **Item Cards**: Image, name, description, price, availability
- **Customization Modal**: Size options, toppings, special instructions
- **Add to Cart**: Quantity selector and add button
- **Nutritional Info**: Optional nutritional information display

### Shopping Cart
- **Item List**: Selected items with quantities and prices
- **Modify Options**: Edit quantities, remove items, update customizations
- **Price Breakdown**: Subtotal, delivery fee, tax, total
- **Points Display**: Available points and redemption options
- **Checkout Button**: Proceed to checkout

### Checkout Process
- **Order Summary**: Review all items and prices
- **Delivery Information**: Select campus location and special instructions
- **Payment Method**: Choose between points, card, or split payment
- **Points Redemption**: Select amount of points to use
- **Place Order**: Final order submission

## 🔄 **User Flows**

### Basic Order Flow
1. **Browse Restaurants**: User views available restaurants
2. **Select Restaurant**: User chooses a restaurant
3. **Browse Menu**: User views menu items and categories
4. **Add Items**: User adds items to cart with customizations
5. **Review Cart**: User reviews selected items and prices
6. **Checkout**: User proceeds to checkout
7. **Payment**: User selects payment method and pays
8. **Confirmation**: User receives order confirmation

### Points Redemption Flow
1. **View Points**: User sees available points balance
2. **Select Redemption**: User chooses to use points
3. **Enter Amount**: User specifies points to redeem
4. **Calculate Balance**: System calculates remaining balance
5. **Complete Payment**: User pays remaining amount if any
6. **Update Points**: System updates points balance

### Order Customization Flow
1. **Select Item**: User clicks on menu item
2. **Open Customization**: Customization modal opens
3. **Choose Options**: User selects size, toppings, etc.
4. **Add Instructions**: User adds special instructions
5. **Update Price**: System calculates updated price
6. **Add to Cart**: User adds customized item to cart

## 🧪 **Testing Requirements**

### Unit Tests
- **Cart Management**: Add, remove, update cart items
- **Price Calculations**: Subtotal, tax, delivery fee calculations
- **Points Redemption**: Points balance and redemption logic
- **Order Validation**: Order data validation and error handling

### Integration Tests
- **Menu API**: Restaurant and menu data retrieval
- **Order API**: Order creation and management
- **Payment API**: Payment processing integration
- **Points API**: Points balance and redemption

### E2E Tests
- **Complete Order Flow**: Full order placement process
- **Payment Processing**: Successful and failed payment scenarios
- **Points Redemption**: Points-based payment flow
- **Error Handling**: Network errors and validation failures

## 📊 **Performance Requirements**

### Response Times
- **Menu Loading**: < 2 seconds for restaurant menus
- **Cart Updates**: < 500ms for cart modifications
- **Order Placement**: < 3 seconds for order submission
- **Payment Processing**: < 5 seconds for payment completion

### Scalability
- **Concurrent Orders**: Support 1,000+ simultaneous orders
- **Menu Updates**: Real-time menu availability updates
- **Cart Persistence**: Maintain cart across browser sessions
- **Order Processing**: Handle peak order volumes

## 🔧 **Implementation Guide**

### Frontend Components
```javascript
// src/components/ordering/RestaurantList.jsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false })

      if (error) throw error
      setRestaurants(data)
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="restaurant-list">
      {loading ? (
        <div>Loading restaurants...</div>
      ) : (
        restaurants.map(restaurant => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))
      )}
    </div>
  )
}

export default RestaurantList
```

### Cart Management
```javascript
// src/hooks/useCart.js
import { useState, useEffect } from 'react'

export const useCart = () => {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)

  const addToCart = (item, customizations = {}) => {
    const cartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItem: item,
      quantity: 1,
      customizations,
      price: item.price
    }

    setCart(prev => [...prev, cartItem])
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCart(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }

  const clearCart = () => {
    setCart([])
  }

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    setTotal(newTotal)
  }, [cart])

  return {
    cart,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  }
}
```

### Order Placement
```javascript
// src/services/orderService.js
import { supabase } from '../lib/supabase'

export const createOrder = async (orderData) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating order:', error)
    return { data: null, error }
  }
}

export const getOrder = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        restaurant:restaurants(*),
        order_items:order_items(
          *,
          menu_item:menu_items(*)
        )
      `)
      .eq('id', orderId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching order:', error)
    return { data: null, error }
  }
}
```

## 🚀 **Deployment Considerations**

### Environment Variables
```bash
# Stripe configuration
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key

# Supabase configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Security Measures
- **Input Validation**: Validate all order data
- **Payment Security**: Use Stripe's secure payment processing
- **Rate Limiting**: Implement order placement rate limiting
- **Data Encryption**: Encrypt sensitive order information

## 📈 **Success Metrics**

### User Engagement
- **Order Completion Rate**: 85%+ successful order completion
- **Cart Abandonment**: < 30% cart abandonment rate
- **Repeat Orders**: 60%+ users place repeat orders
- **Points Usage**: 70%+ of users redeem points

### Business Metrics
- **Order Volume**: 1,000+ orders per month
- **Average Order Value**: $15+ per order
- **Revenue Growth**: 20% month-over-month growth
- **Customer Satisfaction**: 4.5+ star average rating

## 🔗 **Related Documentation**

- **Restaurant Management**: `restaurant-management.md`
- **Menu Management**: `menu-management.md`
- **Order Management**: `order-management.md`
- **Points System**: `../points/points-management.md`
- **Payment Integration**: `../technical/payment-integration.md`

---

**Last Updated**: January 24, 2025  
**Maintained By**: I-Eat Development Team
