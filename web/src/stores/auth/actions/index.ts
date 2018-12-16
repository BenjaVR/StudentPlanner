import { CheckLoggedInAction } from "./checkLoggedInAction";
import { LoginAction } from "./loginActions";
import { LogoutAction } from "./logoutActions";

export type AuthAction =
    LoginAction |
    LogoutAction |
    CheckLoggedInAction;
