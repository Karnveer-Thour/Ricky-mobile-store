import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: "danger" | "warning" | "info";
  loading: boolean;
}

const initialState: ConfirmState = {
  isOpen: false,
  title: "",
  message: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  variant: "danger",
  loading: false,
};

// Module-level callback registry
let pendingOnConfirm: (() => void | Promise<void>) | null = null;
let pendingOnCancel: (() => void) | null = null;

export const ConfirmSlice = createSlice({
  name: "Confirm",
  initialState,
  reducers: {
    OPEN_CONFIRM: (
      state,
      action: PayloadAction<{
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        variant?: "danger" | "warning" | "info";
      }>,
    ) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.confirmText = action.payload.confirmText || "Confirm";
      state.cancelText = action.payload.cancelText || "Cancel";
      state.variant = action.payload.variant || "danger";
      state.loading = false;
    },
    SET_CONFIRM_LOADING: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    CLOSE_CONFIRM: (state) => {
      state.isOpen = false;
      state.loading = false;
    },
  },
});

export const { OPEN_CONFIRM, SET_CONFIRM_LOADING, CLOSE_CONFIRM } =
  ConfirmSlice.actions;

/** Helper to dispatch confirm with callback */
export const openGlobalConfirm = (
  dispatch: any,
  options: ConfirmOptions,
) => {
  pendingOnConfirm = options.onConfirm || null;
  pendingOnCancel = options.onCancel || null;
  dispatch(
    OPEN_CONFIRM({
      title: options.title,
      message: options.message,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      variant: options.variant,
    }),
  );
};

export const executeConfirmAction = async (dispatch: any) => {
  if (pendingOnConfirm) {
    try {
      dispatch(SET_CONFIRM_LOADING(true));
      await pendingOnConfirm();
    } finally {
      dispatch(CLOSE_CONFIRM());
      pendingOnConfirm = null;
      pendingOnCancel = null;
    }
  } else {
    dispatch(CLOSE_CONFIRM());
  }
};

export const executeCancelAction = (dispatch: any) => {
  if (pendingOnCancel) {
    pendingOnCancel();
  }
  dispatch(CLOSE_CONFIRM());
  pendingOnConfirm = null;
  pendingOnCancel = null;
};

export default ConfirmSlice.reducer;
