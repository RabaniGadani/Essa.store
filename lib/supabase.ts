import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Order {
  id: number
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_address: string
  customer_city: string
  customer_postal_code: string
  subtotal: number
  savings: number
  promo_code?: string | null
  promo_discount: number
  shipping: number
  tax: number
  total: number
  status: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: string
  name: string
  price: number
  original_price?: number | null
  image?: string
  color?: string
  size?: string
  quantity: number
  category?: string
  created_at: string
}

// Helper functions for orders
export const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single()

  if (error) {
    return { data: null, error: { message: error.message } }
  }
  return { data, error: null }
}

export const createOrderItems = async (orderItems: Omit<OrderItem, 'id' | 'created_at'>[]) => {
  const { data, error } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select()

  if (error) {
    return { data: null, error: { message: error.message } }
  }
  return { data, error: null }
}

export const getOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getOrderById = async (id: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
} 