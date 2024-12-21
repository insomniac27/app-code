//  working code with reducer api
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import RazorpayCheckout from 'react-native-razorpay';
import Lottie from 'lottie-react-native';
import auth from '@react-native-firebase/auth';

const Cart = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [cartList, setCartList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('No Selected Address');
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [loading, setLoading] = useState(true);  // State for loader


  useEffect(() => {
    getCartItems();
    getAddressList();
    // Set loader to false after 5 seconds
        const timer = setTimeout(() => {
          setLoading(false);
        }, 5000);

        // Clean up the timer when the component is unmounted
        return () => clearTimeout(timer);
  }, [isFocused]);




const getCartItems = async () => {
  try {
    const currentUser = auth().currentUser;

    if (currentUser) {
      const userId = currentUser.uid;

      // Fetch the user's cart from Firestore
      const userDoc = await firestore().collection('users').doc(userId).get();
      const userCart = userDoc.data()?.cart || [];

      // Combine items with the same title and size
      const mergedCart = userCart.reduce((acc, item) => {
        const existingItem = acc.find(
          cartItem => cartItem.title === item.title && cartItem.size === item.size // Check both title and size
        );

        if (existingItem) {
          existingItem.quantity += item.quantity || 1; // Increase quantity if same title and size
        } else {
          acc.push({ ...item, quantity: item.quantity || 1 }); // Add new item if title or size differs
        }
        return acc;
      }, []);

      setCartList(mergedCart); // Update the cart with merged items
    } else {
      console.error('No user is signed in');
      alert('Please sign in to view your cart.');
    }
  } catch (error) {
    console.error('Error fetching cart items:', error);
    alert('Failed to load cart items. Please try again later.');
  }
};






  const reduceProductQuantity = async (itemId, quantity) => {
    try {
      await fetch(`http://139.59.68.117:4000/api/new/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: quantity }),
      });
    } catch (error) {
      console.error('Error reducing product quantity in API:', error);
    }
  };

  const clearCart = async () => {
    try {
      const userId = await AsyncStorage.getItem('USERID');
      await firestore().collection('users').doc(userId).update({ cart: [] });

      // Reduce quantity for each item in the cart
      for (const item of cartList) {
        const { id, quantity } = item;
        await reduceProductQuantity(id, quantity);
      }

      setCartList([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const updateOrderHistory = async (paymentId) => {
    try {
      const userId = await AsyncStorage.getItem('USERID');
      const userRef = firestore().collection('users').doc(userId);
      await userRef.update({
        orders: firestore.FieldValue.arrayUnion({
          paymentId: paymentId,
          items: cartList,
          date: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error updating order history:', error);
    }
  };

  const getAddressList = async () => {
    try {
      const userId = await AsyncStorage.getItem('USERID');
      const addressId = await AsyncStorage.getItem('ADDRESS');
      const userDoc = await firestore().collection('users').doc(userId).get();

      let addressList = userDoc.data()?.address;

      if (Array.isArray(addressList)) {
        addressList.map(item => {
          if (item.addressId === addressId) {
            setSelectedAddress(
              `${item.street}, ${item.city}, ${item.pincode}, ${item.mobile}`
            );
          }
        });
      }
    } catch (error) {
      console.error('Error fetching address list:', error);
    }
  };

  const getTotal = () => {
    return cartList.reduce((total, item) => {
      const qty = item.quantity || 0;
      const price = item.price || 0;
      return total + qty * price;
    }, 0);
  };

const sendOrderDetailsToAPI = async (paymentId) => {
  try {
    const userId = await AsyncStorage.getItem('USERID');
    const userEmail = await AsyncStorage.getItem('EMAIL');
    const orderDate = new Date().toISOString();

    // Log cartList and other variables for debugging
    console.log("cartList:", cartList);
    console.log("userId:", userId);
    console.log("userEmail:", userEmail);
    console.log("orderDate:", orderDate);
    console.log("paymentId:", paymentId);

    // Map through cartList and structure each item for the API
    const orderDetails = cartList.map(item => {
      const title = item.title || "No Title"; // Get the title from item
      const description = item.orderItem ? item.orderItem.description || "No Description" : "No Description"; // Get description
      const price = item.price || 0; // Get price
      const quantity = item.quantity || 0; // Get quantity
      const size = item.size || 'N/A'; // Get size

      console.log("Item Details:", { title, description, price, quantity, size }); // Log item details

      return {
        title: title,
        description: description,
        price: price,
        quantity: quantity,
        size: size,
      };
    });

    // Create a payload object to send
    const payload = {
      userId: userId || "No User ID",
      userEmail: userEmail || "No Email",
      orderDate: orderDate || "No Order Date",
      paymentId: paymentId || "No Payment ID",
      title: orderDetails.length > 0 ? orderDetails[0].title : "No Title", // First item's title
      description: orderDetails.length > 0 ? orderDetails[0].description : "No Description", // First item's description
      price: orderDetails.length > 0 ? orderDetails[0].price : 0, // First item's price
      quantity: orderDetails.length > 0 ? orderDetails[0].quantity : 0, // First item's quantity
      size: orderDetails.length > 0 ? orderDetails[0].size : 'N/A', // First item's size
      orderDetails: orderDetails, // Include the order details array
    };

    console.log("Payload to send:", payload);

    // First API call
    await fetch('http://139.59.68.117:4000/api/newOrderAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload), // Send the entire payload object
    });

    // Second API call to another endpoint
    await fetch('http://139.59.68.117:4000/api/newOrderUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload), // Send the same payload object
    });

    console.log("Order details sent to the second API.");

  } catch (error) {
    console.error('Error sending order details to API:', error);
  }
};


// New function to send the final order details
const sendFinalOrderDetailsToAPI = async (paymentId) => {
  try {
    const userId = await AsyncStorage.getItem('USERID');
    const userEmail = await AsyncStorage.getItem('EMAIL');
    const orderDate = new Date().toISOString();

    const orderDetails = cartList.map(item => ({
      image: item.image || 'defaultCategoryId',
      quantity: item.quantity || 0,
      size: item.size || 'N/A',
    }));

    const payload = {
      userId: userId || "No User ID",
      orderDate: orderDate || "No Order Date",
      paymentId: paymentId || "No Payment ID",
      userEmail: userEmail || "No Email",
      orderDetails: orderDetails,
    };

    await fetch('http://139.59.68.117:4000/api/reducer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log("Final order details sent to http://139.59.68.117:4000:4000/api/reducer");

  } catch (error) {
    console.error('Error sending final order details to API:', error);
  }
};




const sendToShiprocket = async (paymentId) => {
  try {
    const userId = await AsyncStorage.getItem("USERID");
    const userDoc = await firestore().collection("users").doc(userId).get();
    const user = userDoc.data();

    // Fetching user details
    const name = user.name || "No Name";
    const email = user.email || "No Email";
    const phone = user.phone || "No Phone";
    const address = user.address?.[0] || {}; // Assuming first address is used
    const cart = user.cart || []; // User's cart items

    // Aggregate items by SKU and size
    const aggregatedItems = cart.reduce((acc, item) => {
      const uniqueKey = `${item.sku || "No SKU"}_${item.size || "No Size"}`; // Unique key for SKU and size

      if (!acc[uniqueKey]) {
        acc[uniqueKey] = {
          name: item.name || "No Item Name",
          sku: uniqueKey,
          //sku: orderDetails.title,
          size: item.size || "No Size",
          units: item.quantity || 1,
          selling_price: item.price || 0,
          discount: "",
          tax: "",
          hsn: item.hsn || 0,
        };
      } else {
        acc[uniqueKey].units += item.quantity || 1; // Increase the quantity
      }

      return acc;
    }, {});

    // Convert aggregated items to an array
    const orderItems = Object.values(aggregatedItems);

    // Dynamically get the current date and time
    const formatOrderDate = (isoDate) => {
      const dateObj = new Date(isoDate);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const orderDate = new Date().toISOString(); // Current date in ISO format
    const formattedOrderDate = formatOrderDate(orderDate);

    // Payload for Shiprocket
    const payload = {
      order_id: `${paymentId}`,
      order_date: formattedOrderDate,
      pickup_location: "Home",
      channel_id: "5711518",
      comment: "Order placed via app",
      billing_customer_name: name,
      billing_last_name: "",
      billing_address: address.street || "No Street",
      billing_address_2: address.landmark || "",
      billing_city: address.city || "No City",
      billing_pincode: address.pincode || "000000",
      billing_state: address.state || "No State",
      billing_country: "India",
      billing_email: email,
      billing_phone: address.mobile,
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: "Prepaid",
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: orderItems.reduce((total, item) => total + item.selling_price * item.units, 0),
      length: 10,
      breadth: 15,
      height: 20,
      weight: 2.5,
    };

    console.log("Sending payload to Shiprocket:", payload);

    // API call to Shiprocket
    const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUzNzM4NzgsInNvdXJjZSI6InNyLWF1dGgtaW50IiwiZXhwIjoxNzM0NTI3MjQ2LCJqdGkiOiJlWFJ4R3MzSFR2M0xKaGFIIiwiaWF0IjoxNzMzNjYzMjQ2LCJpc3MiOiJodHRwczovL3NyLWF1dGguc2hpcHJvY2tldC5pbi9hdXRob3JpemUvdXNlciIsIm5iZiI6MTczMzY2MzI0NiwiY2lkIjo1MTc3MzI5LCJ0YyI6MzYwLCJ2ZXJib3NlIjpmYWxzZSwidmVuZG9yX2lkIjowLCJ2ZW5kb3JfY29kZSI6IiJ9.flCR9qrIfFfKj9rUilBsupSS3RheuXf3ptfOjPdAj_Y", // Replace with valid token
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log("Shiprocket response:", responseData);

    if (!response.ok) {
      throw new Error(`Shiprocket API error: ${responseData.message || response.statusText}`);
    }

    console.log("Order successfully sent to Shiprocket.");
  } catch (error) {
    console.error("Error sending data to Shiprocket:", error);
  }
};




  const payNow = async () => {
    const email = await AsyncStorage.getItem("EMAIL");
    const name = await AsyncStorage.getItem("NAME");
    const mobile = await AsyncStorage.getItem("MOBILE");

    const totalAmount = getTotal() * 100; // Convert to paise
    const options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.jpg',
      currency: 'INR',
      key: 'rzp_test_mQinADxZJLDkJf',
      amount: totalAmount.toString(),
      name: 'Acme Corp',
      prefill: {
        email: email,
        contact: mobile,
        name: name,
      },
      theme: { color: '#53a20e' },
    };

    RazorpayCheckout.open(options)
      .then(async (data) => {
        setPaymentSuccess(true);
        await updateOrderHistory(data.razorpay_payment_id);
        await sendOrderDetailsToAPI(data.razorpay_payment_id);
        await sendFinalOrderDetailsToAPI(data.razorpay_payment_id);
              await sendToShiprocket(data.razorpay_payment_id); // New Shiprocket API call

        await clearCart();
      })
      .catch((error) => {
        console.error("Payment error:", error);
        setPaymentSuccess(false);
      });
  };



const getCurrentUserId = () => {
  const user = auth().currentUser;
  return user ? user.uid : null;
};


const [cart, setCart] = useState([]); // State to store cart items


useEffect(() => {
  // Fetch the cart data when the component is mounted
  const fetchCart = async () => {
    const userId = getCurrentUserId();
    if (userId) {
      const userRef = firestore().collection('users').doc(userId);
      const userSnapshot = await userRef.get();
      if (userSnapshot.exists) {
        setCart(userSnapshot.data().cart || []);
      }
    }
  };

  fetchCart();
}, []); // This effect will run only once when the component mounts

const updateCartQuantity = async (itemTitle, change) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.log('User not logged in');
      return;
    }

    const userRef = firestore().collection('users').doc(userId);
    const userSnapshot = await userRef.get();

    if (userSnapshot.exists) {
      const cart = userSnapshot.data().cart || [];
      console.log('Cart from Firestore:', cart); // Log the cart to inspect the data structure

      const itemIndex = cart.findIndex(item => item.title === itemTitle); // Find item by title (or another unique field)
      console.log('Item index:', itemIndex); // Check the item index

      if (itemIndex !== -1) {
        const currentQuantity = cart[itemIndex]?.quantity || 0;
        const newQuantity = Math.max(0, currentQuantity + change);

        if (newQuantity === 0) {
          cart.splice(itemIndex, 1); // Remove item from cart if quantity is 0
        } else {
          cart[itemIndex] = { ...cart[itemIndex], quantity: newQuantity }; // Update quantity
        }

        // Update Firestore with the modified cart
        await userRef.update({ cart });

        // Update the local state to reflect the changes immediately in the frontend
        setCart([...cart]); // Assuming setCart is the state updater function for the cart

        console.log('Cart updated successfully:', cart);
      } else {
        console.log('Item not found in cart');
      }
    } else {
      console.log('User not found:', userId);
    }
  } catch (error) {
    console.error('Error updating cart quantity:', error);
  }
};


const renderItem = ({ item }) => {
  console.log("Rendered item:", item); // Log the item being passed to check its structure
  return (
    <ScrollView>
      <View style={styles.itemView}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.nameView}>
          {/* Ensure all text values are wrapped inside <Text> components */}
          <Text style={styles.nameText}>{item.title}</Text>
          <Text style={styles.descText}>{item.description}</Text>
          <Text style={styles.nameText}>{item.quantity}</Text>
          <Text style={styles.sizeText}>{`Size: ${item.size || 'N/A'}`}</Text>

          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => updateCartQuantity(item.title, -1)}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => updateCartQuantity(item.title, 1)}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.priceView}>
            {/* Make sure price is inside a Text component */}
            <Text style={styles.priceText}>{'Rs ' + item.price}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};


  return (
    <View style={styles.container}>
      {paymentSuccess !== null && (
        <View style={styles.gifContainer}>
          <Lottie
            source={paymentSuccess ? require('./src/animations/failed.json') : require('./src/animations/success.json')}
            autoPlay
            loop={false}
            style={styles.paymentGif}
          />
        </View>
      )}

      <FlatList
        data={cartList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
      />

      <View style={styles.totalView}>
        <Text style={styles.selected}>Selected Address</Text>
        <Text style={styles.editAddress} onPress={() => navigation.navigate('Address')}>
          Change Address
        </Text>
      </View>
    <Text style={styles.selectedAddressText}>{selectedAddress}</Text>

<View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.heading}>Payment Details</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.textLeft}>Subtotal</Text>
        <Text style={styles.textRight}>{'Rs. '+getTotal()}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.textLeft}>Shipping</Text>
        <Text style={styles.textRight}>0</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.textLeft}>Grand Total</Text>
        <Text style={styles.textRight}>{'Rs. '+getTotal()}</Text>
      </View>
    </View>

      {cartList.length > 0 && (
        <View style={styles.checkoutView}>
        <View>
          <Text style={styles.totalText}>
            {'Rs. ' + getTotal()}
          </Text>
          <Text style={styles.subheading}>Price Inclusive of all taxes</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={payNow}>
            <Text style={styles.checkout}>CHECKOUT</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
checkout: {
color: '#000',
fontWeight: '400',
fontFamily: 'sans-serif',
//paddingTop: ,
paddingHorizontal: '10%',

},
subheading: {
color: '#fff',
paddingLeft: 10,
paddingBottom: 10,
fontSize: 8,
},
heading: {
color: '#000',
fontWeight: '500',
fontSize: 16,
},
container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    paddingHorizontal: 10
  },
  textLeft: {
    fontSize: 16,
    fontWeight: '300',
    color: '#000',
  },
  textRight: {
    fontSize: 16,
  },
quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // adds border around the entire container
    borderColor: '#ccc', // set border color for the whole control
    borderRadius: 0, // optional, for rounded corners around the container
    width: '50%',
    height: '17%',
  },
  button: {
    //backgroundColor: '#e0e0e0',
    borderRadius: 4,
   paddingHorizontal: '20%',
   //paddingBottom: '5%',
    //paddingVertical: 5,
    //alignItems: 'center',
    //justifyContent: 'center',
   // marginHorizontal: 5,
   height: '160%',
  },

  buttonText: {
    fontSize: 20,
    fontWeight: 'medium',
    color: '#333',
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    //padding: 16,
    backgroundColor: '#fff',
  },
  gifContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  paymentGif: {
    width: 200,
    height: 200,
  },
  itemView: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  nameView: {
    flex: 1,
    paddingLeft: 16,
  },
  nameText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'sans-serif',
    color: '#000',
    //paddingHorizontal: 10
  },
  selected: {
      fontSize: 12,
      fontWeight: '700',
      fontFamily: 'sans-serif',
      color: '#000',
      paddingHorizontal: 10
    },
  descText: {
    fontSize: 12,
//    color: '#666',
    fontFamily: 'sans-serif',
    color: '#000',
  },
  sizeText: {
    fontSize: 12,
    color: '#888',
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  totalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  selectedAddressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 10
  },
  editAddress: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
    paddingHorizontal: 10
  },
  checkoutView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#000',
    marginHorizontal: 10,
    marginVertical: 10
  },
  totalText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'sans-serif',
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 3

  },
  checkoutBtn: {
    backgroundColor: '#fff',
    //padding: 12,
    borderRadius: 4,
    height: '40%',
    marginRight: '2%',
  },
});

export default Cart;







