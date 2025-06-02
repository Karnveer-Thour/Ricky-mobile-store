"use client";
import { useState } from "react";
import {
  Menu,
  X,
  Home,
  User,
  Settings,
  UserSearch,
  ClipboardList,
  UserCog,
  LogOut,
} from "lucide-react";
import classNames from "classnames";
import Navitem from "./navItem";
// import Navitem from "./Navitem";
// import { useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function Navbar({ isOpen, setIsOpen }: NavbarProps) {
//   const location = useLocation();
  const [Menuvisible, setMenuvisible] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const toggleMenuvisibility = () => {
    setMenuvisible(!Menuvisible);
  };

  return (
    <div className="flex top-0 overflow-hidden max-md:fixed max-md:right-0 bottom-0 md:fixed z-50">
      <div
        className={classNames(
          "h-screen bg-gray-900 text-white p-5 transition-all duration-300 flex flex-col justify-between",
          isOpen ? "w-64" : "w-20 max-md:bg-transparent"
        )}
      >
        <div className="overflow-hidden ">
          <button
            className={`mb-6 flex items-center ${isOpen?"justify-end":"justify-center"} w-full text-gray-300 overflow-hidden transition-all duration-300`}
            onClick={toggleSidebar}
          >
            {isOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} className="max-md:text-black" />
            )}
          </button>
          <nav
            className={`flex flex-col gap-6 overflow-hidden ${
              isOpen ? "" : "max-md:hidden"
            }`}
          >
            <Navitem
              icon={<Home size={24} />}
              label="Dashboard"
              isOpen={isOpen}
              linkTo="/dashboard"
            />
            <Navitem
              icon={<UserSearch size={24} />}
              label="Customers"
              linkTo="/customers"
              isOpen={isOpen}
            />
            <Navitem
              icon={<User size={24} />}
              label="Providers"
              linkTo="/providers"
              isOpen={isOpen}
            />
            <Navitem
              icon={<ClipboardList size={24} />}
              label="Jobs"
              linkTo="/jobs"
              isOpen={isOpen}
            />
            <Navitem
              icon={<UserCog size={24} />}
              label="Services"
              linkTo="/services"
              isOpen={isOpen}
            />
          </nav>
        </div>
        <nav className={`flex flex-col gap-6 ${isOpen ? "" : "max-md:hidden"}`}>
          <Navitem
            icon={<Settings size={24} />}
            label="Settings"
            isOpen={isOpen}
            linkTo="/settings"
          />
          {Menuvisible && (
            <nav className={`flex flex-col gap-6`}>
              <Navitem
                icon={<LogOut size={24} />}
                label="Logout"
                isOpen={isOpen}
                linkTo="/logout"
                menu={toggleMenuvisibility}
              />
              <Navitem
                icon={
                  <img
                    className=" object-fill w-[30px] h-[24px]"
                    // src={`${
                    //   Admin.user.Personaldata.imageURL ||
                    //   localStorage.getItem("imageURL")
                    // }`}
                    alt="Profile Picture"
                  />
                }
                // label={Admin.user?.name || localStorage.getItem("name")}
                isOpen={isOpen}
                linkTo="/profile"
                menu={toggleMenuvisibility}
              />
            </nav>
          )}
          <Navitem
            icon={<User size={24} />}
            label="Profile"
            isOpen={isOpen}
            linkTo={location.pathname}
            menu={toggleMenuvisibility}
          />
        </nav>
      </div>
    </div>
  );
}

export default Navbar;