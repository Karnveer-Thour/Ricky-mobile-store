import React from "react";
import {
  Home as Dashboard,
  Users as Customers,
  ListCollapse as Products,
  StretchHorizontal as Categories,
  Building2 as Cities,
  Archive as InventoryIcon,
  Columns3 as DispatchIcon,
  BadgeDollarSign as Sales,
  MessageSquare as ChatIcon,
  LayoutGrid as Whatsapp,
  User as Profile,
  Settings,
} from "lucide-react";

export interface NavItemConfig {
  id: string;
  label: string;
  linkTo: string;
  icon: React.ReactNode;
  badge?: string;
  roles?: string[];
}

export interface NavSectionConfig {
  id: string;
  label: string;
  items: NavItemConfig[];
}

export interface ProfileMenuItemConfig {
  id: string;
  label: string;
  linkTo: string;
  icon: React.ReactNode;
}

/**
 * Declarative navigation sections configuration for the Admin Sidebar.
 * Eliminates redundant JSX declarations and simplifies adding/modifying routes.
 */
export const NAV_SECTIONS: NavSectionConfig[] = [
  {
    id: "main",
    label: "Main",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        linkTo: "/home/features/dashboard",
        icon: <Dashboard size={18} />,
      },
    ],
  },
  {
    id: "management",
    label: "Management",
    items: [
      {
        id: "customers",
        label: "Customers",
        linkTo: "/home/features/customers",
        icon: <Customers size={18} />,
      },
      {
        id: "products",
        label: "Products",
        linkTo: "/home/features/product",
        icon: <Products size={18} />,
      },
      {
        id: "categories",
        label: "Categories",
        linkTo: "/home/features/categories",
        icon: <Categories size={18} />,
      },
      {
        id: "cities",
        label: "Cities",
        linkTo: "/home/features/cities",
        icon: <Cities size={18} />,
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      {
        id: "inventory",
        label: "Inventory",
        linkTo: "/home/features/inventory",
        icon: <InventoryIcon size={18} />,
      },
      {
        id: "dispatch",
        label: "Dispatch",
        linkTo: "/home/features/dispatch",
        icon: <DispatchIcon size={18} />,
      },
      {
        id: "sales",
        label: "Sales",
        linkTo: "/home/features/sales",
        icon: <Sales size={18} />,
      },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    items: [
      {
        id: "support-chat",
        label: "Support Chat",
        linkTo: "/home/features/chat",
        icon: <ChatIcon size={18} />,
      },
      {
        id: "whatsapp",
        label: "WhatsApp",
        linkTo: "/home/features/whatsapp",
        icon: <Whatsapp size={18} />,
      },
    ],
  },
];

/**
 * Declarative profile popover menu configuration.
 */
export const PROFILE_MENU_ITEMS: ProfileMenuItemConfig[] = [
  {
    id: "profile",
    label: "My Profile",
    linkTo: "/home/profile",
    icon: <Profile size={15} className="text-cyan-500 shrink-0" />,
  },
  {
    id: "settings",
    label: "Account Settings",
    linkTo: "/home/settings",
    icon: <Settings size={15} className="text-blue-500 shrink-0" />,
  },
];
