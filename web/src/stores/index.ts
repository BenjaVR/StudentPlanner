import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { authReducer, IAuthState } from "./Auth/reducer";

export interface IApplicationState {
    auth: IAuthState;
}

const rootReducer = combineReducers<IApplicationState>({
    auth: authReducer,
});

const store = createStore(
    rootReducer,
    composeWithDevTools(
        applyMiddleware(thunk),
    ),
);

export default store;
