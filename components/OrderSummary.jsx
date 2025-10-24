import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { useSession } from "next-auth/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {
  const { data: session } = useSession();
  const { currency, router, getCartCount, getCartAmount, userData, cartItems, setCartItems } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const fetchUserAddresses = async () => {
    try {
      setLoadingAddresses(true);
      
      // Use session email first, fallback to userData
      const userEmail = session?.user?.email;
      const userId = userData?._id || userData?.id || userData?.userId;
      
      // Construct query parameter - prefer email over userId
      let queryParam = '';
      if (userEmail) {
        queryParam = `?email=${encodeURIComponent(userEmail)}`;
      } else if (userId) {
        queryParam = `?userId=${encodeURIComponent(userId)}`;
      }
      
      console.log('Fetching addresses with:', { userEmail, userId, queryParam });
      
      const { data } = await axios.get(`/api/user/get-address${queryParam}`);
      
      if (data && data.success) {
        // support multiple possible payload names from API: addresses | address | data
        const addresses = data.addresses ?? data.address ?? data.data ?? [];
        // ensure it's an array
        const addressesArray = Array.isArray(addresses) ? addresses : [];
        console.log('Fetched addresses:', addressesArray);
        setUserAddresses(addressesArray);
        if (addressesArray.length > 0) {
          setSelectedAddress(addressesArray[0]);
        }
      } else {
        console.log('API response not successful:', data);
        toast.error(data?.message || "Failed to fetch addresses");
      }
    } catch (error) {
      console.error('fetchUserAddresses error', error);
      toast.error(error?.response?.data?.message || error.message || 'Error fetching addresses');
    } finally {
      setLoadingAddresses(false);
    }
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select an address before placing order');
      return;
    }

    // TODO: implement order creation (call backend endpoint)
    toast.success('Order flow not implemented yet');
  }

  useEffect(() => {
    // Fetch addresses when session email is available or userData is available
    if (session?.user?.email || userData) {
      fetchUserAddresses();
    }
  }, [session?.user?.email, userData])

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">{currency}{getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
          </div>
        </div>
      </div>

      <button onClick={createOrder} className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700">
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;