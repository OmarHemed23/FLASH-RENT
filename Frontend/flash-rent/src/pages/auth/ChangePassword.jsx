import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/PrimaryButton';
import FormField from '../../components/FormField';
import GuestLayout from '../../layout/GuestLayout';
import Alert from '../../components/Alert';

export default function ChangePassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (password !== confirmPassword) {
            setAlert({ show: true, type: 'error', message: 'Passwords do not match' });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/change-password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({ password })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setAlert({ show: true, type: 'success', message: data.message });
                setTimeout(() => {
                    navigate('/tenant/dashboard');
                }, 3000);
            } else {
                setAlert({ show: true, type: 'error', message: data.error || 'Error changing password' });
            }
        } catch (err) {
            setAlert({ show: true, type: 'error', message: 'An error occurred. Please try again.' });
        }
    };

    return (
        <GuestLayout showingNavigation={false}>
            {alert.show && <Alert type={alert.type} message={alert.message} />}
            <h1 className='text-center text-lg text-gray-700 dark:text-white underline font-bold'>Change Password</h1>
            <form method='POST' onSubmit={handleSubmit}>
                <div className='mt-4'>
                    <FormField label="New Password" type="password" name="password" id="password" placeholder="New Password" value={password} required
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className='mt-4'>
                    <FormField label="Confirm Password" type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" value={confirmPassword} required
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div className="mt-4">
                    <PrimaryButton type='submit'>
                        Change Password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
};

