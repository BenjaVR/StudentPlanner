import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import "./index.scss";
import { SchoolsPage } from "./pages/SchoolsPage";
import { FirebaseInitializer } from "./services/firebase/FirebaseInitializer";

FirebaseInitializer.initialize();

ReactDOM.render(
    <Layout>
        <BrowserRouter>
            <Route exact={true} path="/" component={SchoolsPage}/>
        </BrowserRouter>
    </Layout>,
    document.getElementById("root"),
);
