import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import PropertyDetails from "../pages/PropertyDetails";
import RentalApplication from "../pages/RentalApplication";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";

const Router = createBrowserRouter (
    createRoutesFromElements (
        <>
        <Route path='/' element={<HomePage />} />
        <Route path='/property/:id' element={<PropertyDetails />} />
        <Route path='/property/:id/apply' element={<RentalApplication />} />
        <Route path='/auth/*'>
            <Route path='login' element={<Login />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
        </Route>
        </>
    )
);
export default Router;

