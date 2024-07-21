import { useState } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import PropertyDetails from "../pages/PropertyDetails";
import RentalApplication from "../pages/RentalApplication";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import TenantDashboard from "../pages/tenant/TenantDashboard";
import LeaseAgreementPage from "../pages/tenant/LeaseAgreementPage";
import MaintenanceRequestPage from "../pages/tenant/MaintenanceRequestPage";
import MaintenanceRequestDetails from "../pages/tenant/partials/MaintenanceRequestDetails";
import PaymentCenterPage from "../pages/tenant/PaymentCenterPage";
import TenantTalk from "../pages/tenant/TenantTalk";
import DocumentPage from "../pages/tenant/DocumentPage";
import ChatArea from "../pages/tenant/partials/ChatArea";
import ChangePassword from "../pages/auth/ChangePassword";
import TenantProfilePage from "../pages/tenant/TenantProfilePage";

const Router = createBrowserRouter (
    createRoutesFromElements (
        <>
        <Route path='/' element={<HomePage />} />
        <Route path='/property/:name' element={<PropertyDetails />} />
        <Route path='/property/:name/apply' element={<RentalApplication />} />
        <Route path='/auth/*'>
            <Route path='login' element={<Login />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='change-password' element={<ChangePassword />} />
        </Route>
        <Route path='/tenant/*'>
            <Route path='dashboard' element={<TenantDashboard />} />
            <Route path='lease-agreement' element={<LeaseAgreementPage />} />
            <Route path='maintenance' element={<MaintenanceRequestPage />} />
            <Route path='maintenance/:id' element={<MaintenanceRequestDetails/> } />
            <Route path='payment-center' element={<PaymentCenterPage />} />
            <Route path='tenant-talk' element={<TenantTalk />} />
            <Route path="tenant-talk/:userId" element={<ChatArea />} />
            <Route path='document' element={<DocumentPage />} />
            <Route path='profile' element={<TenantProfilePage />}/>
        </Route>
        </>
    )
);
export default Router;

