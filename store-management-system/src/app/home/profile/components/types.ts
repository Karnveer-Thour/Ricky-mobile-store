export interface AdminProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  store_name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  imageURL: string;
  joined_date: string;
}

export const DEFAULT_PROFILE: AdminProfileData = {
  first_name: "Karanveer",
  last_name: "Thour",
  email: "ricky@rickymobile.com",
  phone: "+91 98765 43210",
  role: "Super Administrator",
  store_name: "Ricky Mobile Store (Main Hub)",
  address: "Shop 14-16, Mobile Market Commercial Complex",
  city: "Ludhiana",
  state: "Punjab",
  pincode: "141001",
  gstin: "03AAAAA0000A1Z5",
  imageURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ricky",
  joined_date: "January 2024",
};

export const STORAGE_KEY = "ricky_admin_profile";

export type ProfileTabId = "general" | "store" | "security";
