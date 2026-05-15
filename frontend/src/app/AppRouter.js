import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home/home";
import { Menu } from "../components/Menu/menu";
import { SignUp } from "../pages/SignUp";
import { GmachBycategory } from "../pages/GmachBycategory";
import { Kategory } from "../pages/Kategory/kategory";
import { AddGmach } from "../pages/AddGmach";
import { Login } from "../pages/Login";
import { About } from "../pages/About/about";
import { LoginOrSighUp } from "../pages/LoginOrSighUp";
import "./app.css";

import { GmachDetails } from "../pages/GmachDetails";
import { MyGmaches } from "../pages/MyGmaches";
import { ROUTES, ROUTE_SEGMENTS } from "../constants/routes";

const S = ROUTE_SEGMENTS;

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={ROUTES.HOME} element={<Menu />}>
                    <Route index element={<Home />} />
                    <Route path={S.SIGN_UP} element={<SignUp />} />
                    <Route path={S.MY_GMACHES} element={<MyGmaches />} />
                    <Route path={S.LOGIN} element={<Login />} />
                    <Route path={S.ADD_GMACH} element={<AddGmach />} />
                    <Route path={S.ABOUT} element={<About />} />
                    <Route path={S.LOGIN_OR_SIGN_UP} element={<LoginOrSighUp />} />
                    <Route path={S.KATEGORY} element={<Kategory />} />
                    <Route path={`${S.KATEGORY}/:id`} element={<GmachBycategory />} />
                    <Route path={`${S.KATEGORY}/:id/:itemId`} element={<GmachDetails />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
