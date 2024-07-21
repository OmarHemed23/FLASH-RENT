import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import Profile from "../../images/profile.jpg";
import PrimaryButton from "../../components/PrimaryButton";
import DangerButton from "../../components/DangerButton";
import FormField from "../../components/FormField";
import { useToken } from '../../hooks/useToken';
import Alert from '../../components/Alert';


export default function TenantProfilePage() {
    const [tenant, setTenant] = useState({});
    const [profilePicture, setProfilePicture] = useState();
    const [profilePicAlert, setProfilePicAlert] = useState({ type: '', message: '' });
    const [infoAlert, setInfoAlert] = useState({ type: '', message: '' });
    const [passwordAlert, setPasswordAlert] = useState({ type: '', message: '' });

    const { token } = useToken();

    useEffect(() => {
        async function fetchTenantData() {
            try {
                const response = await axios.get('http://localhost:8000/api/tenant-profiles/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                const tenantData = response.data[0];
                setTenant(tenantData);
                setProfilePicture(tenantData.profile_picture || Profile);
            } catch (error) {
                console.error('Error fetching tenant data', error);
            }
        }
        fetchTenantData();
    }, [token]);

    const handleProfilePictureUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        try {
            await axios.post(`http://localhost:8000/api/tenants/${tenant.id}/upload-profile-picture/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${token}`
                }
            });
            setProfilePicture(URL.createObjectURL(file));
            setProfilePicAlert({ type: 'success', message: 'Profile picture uploaded successfully.' });
        } catch (error) {
            console.error('Error uploading profile picture', error);
            setProfilePicAlert({ type: 'error', message: 'Error uploading profile picture.' });
        }
    };
      
    const handleProfilePictureDelete = async () => {
        try {
            await axios.post(`http://localhost:8000/api/tenants/${tenant.id}/delete-profile-picture/`, {}, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setProfilePicture(Profile);
            setProfilePicAlert({ type: 'success', message: 'Profile picture deleted successfully.' });
        } catch (error) {
            console.error('Error deleting profile picture', error);
            setProfilePicAlert({ type: 'error', message: 'Error deleting profile picture.' });
        }
    };    
    
    const handleUpdateInfo = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const payload = {};
    
        ['first_name', 'last_name', 'username', 'email', 'phone_number'].forEach((field) => {
            if (data.get(field) !== tenant[field]) {
                payload[field] = data.get(field);
            }
        });
    
        if (Object.keys(payload).length === 0) {
            setInfoAlert({ type: 'info', message: 'No changes detected' });
            return;
        }
    
        try {
            await axios.put(`http://localhost:8000/api/tenant-profiles/${tenant.id}/`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            });
            setInfoAlert({ type: 'success', message: 'Information updated successfully' });
        } catch (error) {
            console.error('Error updating information', error.response.data);
            setInfoAlert({ type: 'error', message: `Error updating information: ${JSON.stringify(error.response.data)}` });
        }
    };
    
    const handleChangePassword = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const payload = {
            current_password: data.get('current_password'),
            new_password: data.get('new_password'),
            confirm_password: data.get('password_confirmation')
        };
    
        try {
            await axios.post('http://localhost:8000/api/tenant-profiles/change-password/', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            });
            setPasswordAlert({ type: 'success', message: 'Password updated successfully' });
        } catch (error) {
            console.error('Error updating password', error);
            setPasswordAlert({ type: 'error', message: 'Error updating password' });
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="flex p-4 sm:p-8 bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-md justify-center items-center sm:rounded-lg">
                        <div className="w-full max-w-sm bg-white border-2 border-gray-100 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                            {profilePicAlert.message && <Alert type={profilePicAlert.type} message={profilePicAlert.message} />}
                            <div className="col-span-full xl:col-auto">
                                <div className="p-4 mb-4 2xl:col-span-2">
                                    <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                                        <img className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0" src={profilePicture} alt="Profile picture"/>
                                        <div>
                                            <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">Profile picture</h3>
                                            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                                JPG, GIF or PNG. Max size of 800K
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <input type="file" onChange={handleProfilePictureUpload}/>
                                                <DangerButton onClick={handleProfilePictureDelete}>
                                                    Delete
                                                </DangerButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 mb-4 bg-white border border-gray-200 sm:rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="text-lg text-center font-medium text-gray-900 dark:text-white">Tenant Information</h2>
                        {infoAlert.message && <Alert type={infoAlert.type} message={infoAlert.message} />}
                        <form onSubmit={handleUpdateInfo}>
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <FormField label="First Name" type="text" name="first_name" id="first_name" placeholder={tenant.first_name}/>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <FormField label="Last Name" type="text" name="last_name" id="last_name" placeholder={tenant.last_name}/>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <FormField label="Username" type="text" name="username" id="username" placeholder={tenant.username}/>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <FormField label="Email" type="email" name="email" id="email" placeholder={tenant.email}/>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <FormField label="Phone Number" type="text" name="phone_number" id="phone_number" placeholder={tenant.phone_number}/>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <FormField label="Address" type="text" name="address" id="address" placeholder={tenant.address || "Address"}/>
                                </div>
                                <div className="col-span-6 sm:col-full">
                                    <PrimaryButton type="submit">Save all</PrimaryButton>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="p-4 sm:p-8 bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-md sm:rounded-lg">
                        <h2 className="text-lg text-center font-medium text-gray-900 dark:text-white">Update Password</h2>
                        {passwordAlert.message && <Alert type={passwordAlert.type} message={passwordAlert.message} />}
                        <form onSubmit={handleChangePassword}>
                            <div className="space-y-4">
                                <FormField label="Current Password" type="password" name="current_password" id="current_password" placeholder="Current Password"/>
                                <FormField label="New Password" type="password" name="new_password" id="new_password" placeholder="New Password"/>
                                <FormField label="Confirm Password" type="password" name="password_confirmation" id="password_confirmation" placeholder="Confirm Password"/>
                                <PrimaryButton type="submit">Update Password</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
    
}
