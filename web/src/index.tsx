import { LocaleProvider } from "antd";
import nlBE from "antd/lib/locale-provider/nl_BE";
import es6promise from "es6-promise";
import moment from "moment";
import "moment/locale/nl-be";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.scss";
import { FirebaseInitializer } from "./services/firebase/FirebaseInitializer";

// Polyfills
es6promise.polyfill();

// Firebase initialization
FirebaseInitializer.initialize();

// Locales initialization
const enabledLocale = nlBE;
moment.locale("nl-be");

ReactDOM.render(
    <LocaleProvider locale={enabledLocale}>
        <App />
    </LocaleProvider>,
    document.getElementById("root"),
);
