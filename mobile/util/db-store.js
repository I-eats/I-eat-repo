import supabase from "./supa";
import * as FileSystem from 'expo-file-system/legacy'

export const getPopularItems = async () => {
  const { data, error } = await supabase
    .from('store')
    .select()
    .limit(10)

  if (error) {
    console.log("error fetching popular items: ", error);
    return { data: null, error };
  } else {
    return { data, error: null };
  }
}

export const downloadFileWithPath = async (bucket, path, name) => {
  console.log('path: ', path, ' name: ', name)
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .download(`${path}/${name}`)

  if (error) {
    console.log("Error downloading avatar", error)
    return { error }
  }

  const fileUri = FileSystem.documentDirectory + name
  try {
    const reader = new FileReader()
    reader.readAsDataURL(data)
    reader.onloadend = async () => {
      const base64Data = reader.result.split(',')[1]
      await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
    }

    return { uri: fileUri }
  } catch (fileError) {
    console.log("Error saving avatar to local file system", fileError);
    return { error: fileError }
  }
}

export const getLocalUriForFile = (path) => {
  if (path) {
    const pathSections = path.split('/')
    // const fileUri = Paths.cache.uri + pathSections[pathSections.length - 1]
    const fileUri = FileSystem.documentDirectory + pathSections[pathSections.length - 1]
    return fileUri
  }
}

export const checkIfFileExistsWithPath = async (path) => {
  const fileUri = getLocalUriForFile(path)
  // deleteLocalImage(path)

  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri)
    return { exists: fileInfo.exists, uri: fileUri }
  } catch (error) {
    console.log("Error checking if image exists", error)
    return { exists: false, uri: null }
  }
}

export const getStoreItems = async ({ store_id }) => {
  const { data, error } = await supabase
    .from('store_item')
    .select()
    .eq('store', store_id)

  if (error) {
    console.log("error fetching store items: ", error);
    return { data: null, error };
  } else {
    console.log("fetched store items: ", data);
    return { data, error: null };
  }
}

export const getCartItemsByStoreItemIds = async ({ store_item_ids }) => {
  const { data, error } = await supabase
    .from('store_item')
    .select()
    .in('store_item_id', store_item_ids)

  if (error) {
    console.log("error fetching cart items: ", error);
    return { data: null, error };
  } else {
    console.log("fetched cart items: ", data);
    return { data, error: null };
  }
}

export const placeOrder = async ({ cart, user_id, user_credit_id, newCredits }) => {
  // STEP 1. create order
  const { data: orderData, error: orderError } = await supabase
    .from('order')
    .insert([
      { customer: user_id, status: 'pending' }
    ])
    .select()
    .single()

  if (orderError) {
    console.log("Error creating order: ", orderError);
    return { data: null, error: orderError };
  } 

  // STEP 2. create order items
  console.log("step 2")
  console.log("order:", orderData)
  const orderItems = Object.entries(cart).map(([store_item_id, quantity]) => ({
    order_id: orderData.order_id,
    store_item_id: store_item_id,
    quantity
  }))
  console.log("order items to create: ", orderItems)
  const { data: orderItemsData, error: orderItemsError } = await supabase
    .from('order_item')
    .insert(orderItems)

  if (orderItemsError) {
    console.log("Error creating order items: ", orderItemsError);
    return { data: null, error: orderItemsError };
  }

  // STEP 3. deduct user credits
  const { error: userError } = await supabase
    .from('user_credit')
    .update({ points: newCredits })
    .eq('user_credit_id', user_credit_id)

  if (userError) {
    console.log("Error updating user credits: ", userError);
    return { data: null, error: userError };
  }

  return { data: { order: orderData, orderItems: orderItemsData }, error: null };

}

export const findExistingOrder = async () => {
  const { data, error } = await supabase
    .from('order')
    .select()
    .eq('status', 'pending')
    .limit(1)
    .single()

  if (error) {
    console.log("error finding existing order: ", error);
    return { data: null, error };
  } else {
    return { data, error: null };
  }
}

export const getOrderItemsForOrder = async ({ order_id }) => {
  const { data, error } = await supabase
    .from('order_item')
    .select(`store_item_id(*), quantity`)
    .eq('order_id', order_id)

  if (error) {
    console.log("error fetching order items for order: ", error);
    return { data: null, error };
  } else {
    console.log("fetched order items for order: ", data);
    return { data: data.map(i => ({ ...i.store_item_id, quantity: i.quantity })), error: null };
  }
}

export const acceptOrderAsDasher = async ({ order_id, dasher_id }) => {
  const { data, error } = await supabase
    .from('order')
    .update({ status: 'accepted', dasher: dasher_id })
    .eq('order_id', order_id)

  if (error) {
    console.log("error accepting order as dasher: ", error);
    return { data: null, error };
  } else {
    console.log("accepted order as dasher: ", data);
    return { data, error: null };
  }
}

export const updateOrderStatusToPickedUp = async ({ order_id }) => {
  const { data, error } = await supabase
    .from('order')
    .update({ status: 'picked_up' })
    .eq('order_id', order_id)

  if (error) {
    console.log("error updating order status to picked up: ", error);
    return { data: null, error };
  } else {
    console.log("updated order status to picked up: ", data);
    return { data, error: null };
  }
}

export const updateOrderStatusToDelivered = async ({ order_id }) => {
  const { data, error } = await supabase
    .from('order')
    .update({ status: 'delivered' })
    .eq('order_id', order_id)

  if (error) {
    console.log("error updating order status to delivered: ", error);
    return { data: null, error };
  } else {
    console.log("updated order status to delivered: ", data);
    return { data, error: null };
  }
}