import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GuestLayout from '../../layout/GuestLayout';
import PrimaryButton from '../../components/PrimaryButton';
import FormField from '../../components/FormField';
import Checkbox from '../../components/Checkbox';
import Label from '../../components/Label';
import Alert from '../../components/Alert';
import axios from 'axios';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (rememberMe) {
            localStorage.setItem('rememberedUsername', username);
        } else {
            localStorage.removeItem('rememberedUsername');
        }
        try {
            const response = await axios.post('http://localhost:8000/api-token-auth/', {
                username: username,
                password: password
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                setAlert({ show: true, type: 'success', message: 'You are logged in' });

                setTimeout(() => {
                    if (response.data.first_time_login) {
                        navigate('/auth/change-password');
                    } else {
                        navigate('/tenant/dashboard');
                    }
                }, 3000);
            } else {
                setAlert({ show: true, type: 'error', message: response.data.error || 'Invalid credentials' });
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setAlert({ show: true, type: 'error', message: 'An error occurred. Please try again.' });
        }
    };

    return (
        <GuestLayout showingNavigation={false}>
            {alert.show && <Alert type={alert.type} message={alert.message} />}
            <h1 className='text-center text-lg text-gray-700 dark:text-white underline font-bold'>SIGN IN</h1>
            <form onSubmit={handleSubmit}>
                <div className='mt-4'>
                    <FormField label="Username" type="username" name="username" id="username" placeholder="Username" value={username} required
                        onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className='mt-4'>
                    <FormField label="Password" type="password" name="password" id="password" placeholder="Password" value={password} required
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className='flex flex-col items-center justify-center mt-4'>
                    <div className='flex items-center'>
                        <Checkbox id="remember_me" name="remember_me" checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)} />
                        <Label htmlFor="remember_me" className="ml-2">
                            Remember Me
                        </Label>
                    </div>
                    <Link
                        to='/auth/forgot-password'
                        className='underline text-md text-gray-700 hover:text-gray-800 dark:text-white dark:hover:text-gray-200 mt-2'
                    >
                        Forgot Password?
                    </Link>
                    <div className="mt-4">
                        <PrimaryButton type='submit'>
                            LOGIN
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}

