'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
}

export const AppContextProvider = (props) => {
    // Initialize cart from localStorage if available
    const getInitialCart = () => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : {};
        }
        return {};
    };

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(true)
    const [cartItems, setCartItems] = useState({})

    const fetchProductData = async () => {
        try {
            const {data} = await axios.get('/api/product/list')
            if(data.success){
                setProducts(data.products)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
             toast.error(error.message)
        }
    } 

    const fetchUserData = async () => {
        try {
            // Using dummy data for now since auth is not set up
            setUserData(userDummyData);
            // Get cart data from localStorage for offline support
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Error loading user data");
        }
    }

    const addToCart = async (itemId) => {
        try {
            let cartData = structuredClone(cartItems);
            if (cartData[itemId]) {
                cartData[itemId] += 1;
            }
            else {
                cartData[itemId] = 1;
            }
            
            // Update local state and storage
            setCartItems(cartData);
            localStorage.setItem('cart', JSON.stringify(cartData));

            // Update database if user exists
            if (userData && userData.id) {
                const { data } = await axios.post('/api/cart/update', {
                    cartData,
                    userId: userData.id
                });
                
                if (data.success) {
                    toast.success("Added to cart");
                } else {
                    throw new Error(data.message);
                }
            } else {
                toast.success("Added to cart");
            }
        } catch (error) {
            // Revert local changes on error
            setCartItems(cartItems);
            localStorage.setItem('cart', JSON.stringify(cartItems));
            toast.error(error.message || "Failed to add to cart");
            console.error(error);
        }
    };

    const updateCartQuantity = async (itemId, quantity) => {
        try {
            let cartData = structuredClone(cartItems);
            if (quantity === 0) {
                delete cartData[itemId];
            } else {
                cartData[itemId] = quantity;
            }
            
            // Update local state and storage
            setCartItems(cartData);
            localStorage.setItem('cart', JSON.stringify(cartData));

            // Update database if user exists
            if (userData && userData.id) {
                const { data } = await axios.post('/api/cart/update', {
                    cartData,
                    userId: userData.id
                });
                
                if (data.success) {
                    toast.success("Cart updated");
                } else {
                    throw new Error(data.message);
                }
            } else {
                toast.success("Cart updated");
            }
        } catch (error) {
            // Revert local changes on error
            setCartItems(cartItems);
            localStorage.setItem('cart', JSON.stringify(cartItems));
            toast.error(error.message || "Failed to update cart");
            console.error(error);
        }
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product.id === items);
            if (cartItems[items] > 0 && itemInfo) {
                // Parse offerPrice as it might be a string from the database
                const price = parseFloat(itemInfo.offerPrice);
                if (!isNaN(price)) {
                    totalAmount += price * cartItems[items];
                }
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        fetchUserData()
    }, [])

    const value = {
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}