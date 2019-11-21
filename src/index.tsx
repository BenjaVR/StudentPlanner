import "./polyfill";

import { LocaleProvider, notification } from "antd";
import nlBE from "antd/lib/locale-provider/nl_BE";
import moment from "moment";
import "moment/locale/nl-be";
import React from "react";
import ReactDOM from "react-dom";
import Root from "./components/Root";
import "./index.scss";
import { FirebaseInitializer } from "./services/FirebaseInitializer";

// Firebase initialization
FirebaseInitializer.initialize();

// Locales initialization
moment.locale("nl-be");

// Ant design global notification config
notification.config({
    duration: 8,
    placement: "bottomRight",
    bottom: 0,
});

ReactDOM.render(
    <LocaleProvider locale={nlBE}>
        <Root />
    </LocaleProvider>,
    document.getElementById("root")
);
