import { useState } from 'react';
import { Link } from 'react-router-dom';
import GuestLayout from '../../layout/GuestLayout';
import PrimaryButton from '../../components/PrimaryButton';
import FormField from '../../components/FormField';
import Checkbox from '../../components/Checkbox';
import Label from '../../components/Label';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
        console.log('Form submitted with:', { email, password, rememberMe });
    };

    return (
        <GuestLayout showingNavigation = {false}>
            <h1 className='text-center text-lg text-gray-700 dark:text-white underline font-bold'>SIGN IN</h1>
            <form onSubmit={handleSubmit}>
                <div className='mt-4'>
                    <FormField label="Email" type="email" name="email" id="email" placeholder="Email" value={email}  required
                    onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='mt-4'>
                    <FormField label="Password" type="password" name="password" id="password" placeholder="Password" value={password} required
                    onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className='flex flex-col items-center justify-center mt-4'>
                    <div className='flex items-center'>
                        <Checkbox id="remember_me" name="remember_me" checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}/>
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
};

