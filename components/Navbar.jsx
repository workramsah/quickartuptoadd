"use client"
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import AuthButton from "@/components/AuthButton";

const Navbar = () => {

  const { isSeller, router, getCartCount } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <img src="/imga.png" className="cursor-pointer w-28 md:w-32"></img>
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          Contact
        </Link>

        <div className="relative">
          <div
            className="cursor-pointer hover:text-gray-900 transition"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Category
          </div>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 bg-white shadow-md rounded-md py-1 z-10">
              <Link href="/category/clothes" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Clothes</Link>
              <Link href="/category/watch" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Watch</Link>
              <Link href="/category/jewellery" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Jewellery</Link>
              <Link href="/category/shoe" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Shoe</Link>
              <Link href="/category/earbuds" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Earbuds</Link>
              <Link href="/category/accessories" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Accessories</Link>
            </div>
          )}
        </div>



      </div>

      <ul className="hidden md:flex items-center gap-4">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        <div className="relative cursor-pointer" onClick={() => router.push('/cart')}>
          <Image className="w-4 h-4" src={assets.cart_icon} alt="cart icon" />
          {getCartCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </div>
        <AuthButton />
      </ul>

      <div className="flex items-center md:hidden gap-3">

        <div className="relative cursor-pointer" onClick={() => router.push('/cart')}>
          <Image className="w-4 h-4" src={assets.cart_icon} alt="cart icon" />
          {getCartCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </div>
        <AuthButton />
      </div>
    </nav>
  );
};

export default Navbar;