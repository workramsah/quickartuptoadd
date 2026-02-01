import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <img src="/imga.png" className="h-14"></img>
          <p className="mt-6 text-sm">
           Welcome to Buy Xito, your ultimate destination for stylish watches, cutting-edge gadgets, and exquisite jewelry. Explore our curated collections designed to elevate your everyday look. Enjoy seamless shopping and exceptional quality. Discover your perfect accessory with Buy Xito today!
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Social Media</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href={"https://www.facebook.com/profile.php?id=61586939520048&mibextid=wwXIfr&rdid=oSjf2K17z8omQYBa&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F17q2HNdigd%2F%3Fmibextid%3DwwXIfr#"}>Fabook</a>
              </li>
              <li>
                <a className="hover:underline transition" href={"https://www.instagram.com/buy.xito?utm_source=qr&igsh=bmsyNmJicXR6bG9l"}>Instagram</a>
              </li>
              <li>
                <a className="hover:underline transition" href={"https://www.tiktok.com/@buyxito.com?_r=1&_t=ZS-93S3Ckz2kuv"}>TikTok</a>
              </li>
              <li>
                <a className="hover:underline transition" href={"https://www.youtube.com/@buyxito"}>Youtubek</a>
              </li>
              
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+9779743630860</p>
              <p>xitobuy@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2026 © buyxito  All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;