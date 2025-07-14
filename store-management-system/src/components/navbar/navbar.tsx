"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home as Dashboard,
  User as Profile,
  Users as Customers,
  Settings,
  Building2 as Cities,
  LayoutGrid as Whatsapp,
  LogOut,
  ListCollapse as Products,
  StretchHorizontal as Categories,
  BadgeDollarSign as Sales,
} from "lucide-react";
import cn from "classnames";
import Navitem from "./navItem";
import { usePathname } from "next/navigation";

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const [menuVisible, setMenuVisible] = useState(false);
  const [fallbackImage, setFallbackImage] = useState<string | null>(null);
  const [fallbackName, setFallbackName] = useState<string | null>(null);

  // const Admin = useSelector((store: RootState) => store.Admin);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleMenuVisibility = () => setMenuVisible(!menuVisible);

  useEffect(() => {
    // Load fallback data for SSR
    setFallbackImage(localStorage.getItem("imageURL"));
    setFallbackName(localStorage.getItem("name"));
  }, []);

  // const profileImage =
  //   Admin.user?.Personaldata?.imageURL || fallbackImage || "/default.jpg";
  // const profileName = Admin.user?.name || fallbackName || "User";

  return (
    <div className="flex top-0 overflow-hidden max-md:fixed max-md:right-0 bottom-0 md:fixed z-50">
      <div
        className={cn(
          "h-screen bg-gray-900 text-white p-5 transition-all duration-300 flex flex-col justify-between",
          isOpen ? "w-64" : "w-20 max-md:bg-transparent",
        )}
      >
        <div className="overflow-hidden">
          <button
            className={`mb-6 flex items-center ${
              isOpen ? "justify-end" : "justify-center"
            } w-full text-gray-300 overflow-hidden transition-all duration-300`}
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
              icon={<Dashboard size={24} />}
              label="Dashboard"
              isOpen={isOpen}
              linkTo="/home/features/dashboard"
            />
            <Navitem
              icon={<Customers size={24} />}
              label="Customers"
              isOpen={isOpen}
              linkTo="/home/features/customers"
            />
            <Navitem
              icon={<Products size={24} />}
              label="Products"
              isOpen={isOpen}
              linkTo="/home/features/product"
            />
            <Navitem
              icon={<Categories size={24} />}
              label="Categories"
              isOpen={isOpen}
              linkTo="/home/features/categories"
            />
            <Navitem
              icon={<Cities size={24} />}
              label="Cities"
              isOpen={isOpen}
              linkTo="/home/features/cities"
            />
            <Navitem
              icon={<Sales size={24} />}
              label="sales"
              isOpen={isOpen}
              linkTo="/home/features/sales"
            />
            <Navitem
              icon={<Whatsapp size={24} />}
              label="whatsapp Groups"
              isOpen={isOpen}
              linkTo="/home/features/whatsapp"
            />
          </nav>
        </div>

        <nav className={`flex flex-col gap-6 ${isOpen ? "" : "max-md:hidden"}`}>
          <Navitem
            icon={<Settings size={24} />}
            label="Settings"
            isOpen={isOpen}
            linkTo="/home/settings"
          />

          {menuVisible && (
            <nav className="flex flex-col gap-6">
              <Navitem
                icon={<LogOut size={24} />}
                label="Logout"
                isOpen={isOpen}
                linkTo="/home/logout"
                menu={toggleMenuVisibility}
              />
              <Navitem
                icon={
                  <img
                    src={fallbackImage || "/default.jpg"}
                    alt="Profile Picture"
                    className="object-fill w-[30px] h-[24px]"
                  />
                }
                label={"User"}
                isOpen={isOpen}
                linkTo="/home/profile"
                menu={toggleMenuVisibility}
              />
            </nav>
          )}

          <Navitem
            icon={<Profile size={24} />}
            label="Profile"
            isOpen={isOpen}
            linkTo={""}
            menu={toggleMenuVisibility}
          />
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
