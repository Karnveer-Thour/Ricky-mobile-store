/**
 * useToast.ts — React hook for toast notifications
 *
 * Provides a stable reference to the toastService so components don't need
 * to import from two different places (sonner + toast.ts).
 *
 * Usage inside any React component:
 * ─────────────────────────────────
 *   import { useToast } from '../hooks/useToast';
 *
 *   function MyComponent() {
 *     const toast = useToast();
 *
 *     const handleSave = async () => {
 *       const id = toast.loading('Saving…');
 *       const ok = await saveData();
 *       toast.resolve(id, ok, 'Saved!', 'Save failed');
 *     };
 *
 *     const handleAdd = () => {
 *       toast.cart.added('Midnight Black', 1);
 *     };
 *
 *     return …;
 *   }
 *
 * Outside React (AppContext, apiService, etc.):
 * ─────────────────────────────────────────────
 *   import { toastService } from '../services/toast';
 *   toastService.error('Network error');
 */
import { useCallback } from "react";
import { toastService, type ToastId } from "../services/toast";

export function useToast() {
  // Wrap the service in useCallback so the reference is stable across renders.
  // All toast functions are pure (no component state) so this is safe.

  const success = useCallback(
    (msg: string, desc?: string) => toastService.success(msg, desc),
    [],
  );

  const error = useCallback(
    (msg: string, desc?: string) => toastService.error(msg, desc),
    [],
  );

  const warning = useCallback(
    (msg: string, desc?: string) => toastService.warning(msg, desc),
    [],
  );

  const info = useCallback(
    (msg: string, desc?: string) => toastService.info(msg, desc),
    [],
  );

  const loading = useCallback(
    (msg: string) => toastService.loading(msg),
    [],
  );

  const dismiss = useCallback(
    (id?: ToastId) => toastService.dismiss(id),
    [],
  );

  const resolve = useCallback(
    (
      id: ToastId,
      ok: boolean,
      successMsg: string,
      errorMsg: string,
      errorDesc?: string,
      successDesc?: string,
    ) => toastService.resolve(id, ok, successMsg, errorMsg, errorDesc, successDesc),
    [],
  );

  return {
    // ── Primitives ─────────────────────────────────────────────────────
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    resolve,

    // ── Domain helpers — same API as toastService ───────────────────
    api: toastService.api,
    auth: toastService.auth,
    cart: toastService.cart,
    wishlist: toastService.wishlist,
    profile: toastService.profile,
    order: toastService.order,
    payment: toastService.payment,
    delivery: toastService.delivery,
    review: toastService.review,
  };
}
