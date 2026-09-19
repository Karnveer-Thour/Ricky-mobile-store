/**
 * toast.ts — Centralised toast service for store-web
 *
 * All toast calls go through this module instead of calling Sonner directly.
 * This gives us:
 *   - A single place to change styling / provider in the future
 *   - Consistent message formats across the whole app
 *   - Typed helper functions instead of free-form strings
 *
 * Usage (inside a component via useToast hook):
 *   const { toastSuccess, toastError, toastLoading, toastDismiss } = useToast();
 *
 * Usage (outside React — e.g. AppContext):
 *   import { toastService } from '../services/toast';
 *   toastService.error('Could not load products', 'Check backend is running');
 */
import { toast, type ExternalToast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastId = string | number;

// ─── Core helpers ─────────────────────────────────────────────────────────────

function success(message: string, description?: string, opts?: ExternalToast): ToastId {
  return toast.success(message, { description, duration: 3000, ...opts });
}

function error(message: string, description?: string, opts?: ExternalToast): ToastId {
  return toast.error(message, { description, duration: 5000, ...opts });
}

function warning(message: string, description?: string, opts?: ExternalToast): ToastId {
  return toast.warning(message, { description, duration: 4500, ...opts });
}

function info(message: string, description?: string, opts?: ExternalToast): ToastId {
  return toast.info(message, { description, duration: 3500, ...opts });
}

function loading(message: string, opts?: ExternalToast): ToastId {
  return toast.loading(message, opts);
}

function dismiss(id?: ToastId): void {
  toast.dismiss(id);
}

/**
 * Resolve a loading toast — replaces it with a success or error.
 * @example
 *   const id = toastService.loading('Saving…');
 *   // … async work …
 *   toastService.resolve(id, true, 'Saved!', 'Could not save', 'Server error');
 */
function resolve(
  id: ToastId,
  ok: boolean,
  successMsg: string,
  errorMsg: string,
  errorDesc?: string,
  successDesc?: string,
): void {
  if (ok) {
    toast.success(successMsg, { id, description: successDesc, duration: 3000 });
  } else {
    toast.error(errorMsg, { id, description: errorDesc, duration: 5000 });
  }
}

// ─── Domain-specific helpers (pre-wired messages) ─────────────────────────────

const api = {
  /** Backend returned a network-level error */
  networkError(): ToastId {
    return error(
      "Connection error",
      "Could not reach the server. Please check your network.",
    );
  },

  /** Generic API failure with optional server message */
  serverError(message?: string): ToastId {
    return error(message || "Something went wrong", "Please try again later.");
  },
};

const auth = {
  loginSuccess(name?: string): ToastId {
    return success(
      "Welcome back! 👋",
      name ? `Signed in as ${name}` : undefined,
    );
  },

  loginError(message?: string): ToastId {
    return error(
      message || "Sign-in failed",
      "Check your email and password and try again.",
    );
  },

  registerSuccess(name?: string): ToastId {
    return success(
      "Account created 🎉",
      name ? `Welcome, ${name}!` : "Welcome to Ricky Mobile Store!",
    );
  },

  registerError(message?: string): ToastId {
    return error(
      message || "Registration failed",
      "This email may already be registered.",
    );
  },

  googleSuccess(): ToastId {
    return success("Signed in with Google 🚀");
  },

  googleError(message?: string): ToastId {
    return error(
      message || "Google sign-in failed",
      "Ensure VITE_GOOGLE_CLIENT_ID is configured.",
    );
  },

  logoutSuccess(): ToastId {
    return info("Signed out", "See you next time!");
  },
};

const cart = {
  added(colorName?: string, qty?: number): ToastId {
    return success("Added to cart 🛒", colorName && colorName !== "Default"
      ? `Color: ${colorName}${qty ? ` · Qty: ${qty}` : ""}`
      : qty ? `Quantity: ${qty}` : undefined,
      { duration: 2500 },
    );
  },

  updated(): ToastId {
    return success("Cart updated", undefined, { duration: 2000 });
  },

  cleared(): ToastId {
    return info("Cart cleared");
  },
};

const wishlist = {
  added(): ToastId {
    return success("Added to wishlist ❤️", undefined, { duration: 2000 });
  },

  removed(): ToastId {
    return info("Removed from wishlist", undefined, { duration: 2000 });
  },
};

const profile = {
  saved(): ToastId {
    return success("Profile saved ✅", "Your changes have been updated.");
  },

  saveError(message?: string): ToastId {
    return error(message || "Could not save profile", "Please try again.");
  },

  avatarSuccess(): ToastId {
    return success("Avatar updated!");
  },

  avatarError(message?: string): ToastId {
    return error(message || "Avatar upload failed", "Please try a different image.");
  },
};

const order = {
  placed(orderId: string): ToastId {
    return success("Order placed! 🎉", `Order ID: ${orderId}`);
  },

  otpInvalid(): ToastId {
    return error("Invalid OTP", "Hint: use 1234 for this demo.");
  },

  otpSuccess(): ToastId {
    return success("OTP verified ✅", "Processing your order…");
  },

  handoverSuccess(): ToastId {
    return success("Order delivered!", "Thank you for shopping with Ricky Mobile Store.");
  },

  handoverError(): ToastId {
    return error("Invalid handover OTP", "Hint: use 1234 for this demo.");
  },
};

const payment = {
  verified(): ToastId {
    return success("Payment verified ✅", "Your payment has been confirmed.");
  },
};

const delivery = {
  serviceable(city: string, speed?: string): ToastId {
    return success(
      `Delivery available in ${city} 🚚`,
      speed || "Express shipping available for this pincode.",
      { duration: 3500 },
    );
  },

  unserviceable(cityOrPin: string): ToastId {
    return warning(
      `Pincode ${cityOrPin} not serviceable`,
      "Delivery is currently not available to this location.",
      { duration: 4500 },
    );
  },

  addressAdded(label?: string): ToastId {
    return success(
      "Delivery address saved ✅",
      label ? `Added to your ${label} addresses.` : undefined,
    );
  },

  addressDeleted(): ToastId {
    return info("Delivery address deleted 🗑️");
  },

  addressDefaultSet(): ToastId {
    return success("Default address updated ⭐");
  },
};

const review = {
  submitted(): ToastId {
    return success(
      "Review submitted! ⭐",
      "Thank you for sharing your feedback with the community.",
    );
  },

  submitError(message?: string): ToastId {
    return error(
      message || "Could not submit review",
      "Please check your input and try again.",
    );
  },
};

// ─── Exported service object ───────────────────────────────────────────────────

export const toastService = {
  // primitives
  success,
  error,
  warning,
  info,
  loading,
  dismiss,
  resolve,
  // domain helpers
  api,
  auth,
  cart,
  wishlist,
  profile,
  order,
  payment,
  delivery,
  review,
};

