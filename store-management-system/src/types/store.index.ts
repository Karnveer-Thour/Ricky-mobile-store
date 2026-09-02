import { alert } from "./alert.index";
import { darkMode } from "./darkMode";
import { ConfirmState } from "@/store/slices/confirm.slice";

export interface storeType {
  Alert: alert;
  DarkMode: darkMode;
  Confirm: ConfirmState;
}
