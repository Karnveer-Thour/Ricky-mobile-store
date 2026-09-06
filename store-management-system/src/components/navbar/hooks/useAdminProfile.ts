import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { SUCCESSALERT } from "@/store/slices/alert.slice";
import { openGlobalConfirm } from "@/store/slices/confirm.slice";

export function useAdminProfile() {
  const [adminName, setAdminName] = useState<string>("Ricky Thour");
  const [adminEmail, setAdminEmail] = useState<string>("ricky@rickymobile.com");
  const [adminRole, setAdminRole] = useState<string>("Super Admin");
  const [adminAvatar, setAdminAvatar] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const loadAdminProfile = () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("ricky_admin_profile");
      if (stored) {
        const p = JSON.parse(stored);
        if (p.first_name || p.last_name)
          setAdminName(`${p.first_name || ""} ${p.last_name || ""}`.trim());
        if (p.email) setAdminEmail(p.email);
        if (p.role) setAdminRole(p.role);
        if (p.imageURL) setAdminAvatar(p.imageURL);
      } else {
        const legacy = localStorage.getItem("name");
        if (legacy) setAdminName(legacy);
      }
    } catch {}
  };

  useEffect(() => {
    loadAdminProfile();
    const handleStorage = () => loadAdminProfile();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("admin_profile_updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("admin_profile_updated", handleStorage);
    };
  }, []);

  useEffect(() => {
    loadAdminProfile();
  }, [pathname]);

  const handleLogout = (onComplete?: () => void) => {
    if (onComplete) onComplete();
    openGlobalConfirm(dispatch, {
      title: "Sign Out of Ricky Mobile Store?",
      message:
        "Are you sure you want to end your current administrative session?",
      confirmText: "Yes, Sign Out",
      cancelText: "Stay Logged In",
      variant: "danger",
      onConfirm: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("auth");
        }
        dispatch(SUCCESSALERT("Logged out successfully. See you soon!"));
        router.push("/auth/login");
      },
    });
  };

  const adminInitials =
    adminName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "RA";

  return {
    adminName,
    adminEmail,
    adminRole,
    adminAvatar,
    adminInitials,
    handleLogout,
  };
}
