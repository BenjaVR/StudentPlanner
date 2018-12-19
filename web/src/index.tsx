import { LocaleProvider, notification } from "antd";
import nlBE from "antd/lib/locale-provider/nl_BE";
import es6promise from "es6-promise";
import moment from "moment";
import "moment/locale/nl-be";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "whatwg-fetch";
import App from "./components/App/App";
import { FirebaseInitializer } from "./config/FirebaseInitializer";
import { I18nextInitializer } from "./config/I18nextInitializer";
import "./index.scss";
import store from "./stores";

// Polyfills
es6promise.polyfill();
/* the "whatwg-fetch" import will automatically polyfill window.fetch */

// Firebase initialization
FirebaseInitializer.initialize();

// Locales initialization
const enabledLocale = nlBE;
moment.locale("nl-be");
I18nextInitializer.initialize("nl");

// Ant design global notification config
notification.config({
    duration: 8,
});

ReactDOM.render(
    <LocaleProvider locale={enabledLocale}>
        <Provider store={store}>
            <App/>
        </Provider>
    </LocaleProvider>,
    document.getElementById("root"),
);
