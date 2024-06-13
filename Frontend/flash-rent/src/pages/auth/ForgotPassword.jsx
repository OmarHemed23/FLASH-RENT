import { useState } from "react";
import GuestLayout from "../../layout/GuestLayout";
import PrimaryButton from "../../components/PrimaryButton";
import FormField from "../../components/FormField";
import Label from "../../components/Label";
import Alert from "../../components/Alert";

export default function ForgotPassword () {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [otpSent, setOtpSent] = useState(false);

    const handleOtpChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Email:', email);
        console.log('OTP:', otp.join(''));
    };

    const handleSendOtp = () => {
        console.log('OTP sent to:', email);
        setOtpSent(true);
    };

    return (
        <GuestLayout showingNavigation = {false}>
            <h1 className="text-center text-lg text-gray-700 dark:text-white underline font-bold">FORGOT PASSWORD</h1>
            <Alert type="success" message="Otp sent successfully. Check your email" />
            <form action="" onSubmit={handleSubmit}>
                <div className='mt-4'>
                    <FormField label="Email" type="email" name="email" id="email" placeholder="Email" required
                    onChange={(e) => setEmail(e.target.value)} />
                </div>
                {!otpSent && (
                    <div className="flex items-center justify-center mt-4">
                        <PrimaryButton onClick={handleSendOtp}>
                            Send OTP
                        </PrimaryButton>
                    </div>
                )}
                {otpSent && (
                    <div className="mx-auto mt-4">
                        <Label>
                            Enter OTP
                        </Label>
                        <div className="flex justify-center mt-2">
                            {otp.map((digit, index) => (
                                <div key={index} className="mx-2">
                                    <FormField
                                        type="text"
                                        name={`digit-${index}`}
                                        id={`digit-${index}`}
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="mt-4">
                    <FormField label="New Password" type="password" name="new-password" id="new-password" placeholder="New Password" required />
                </div>
                <div className="mt-4">
                    <FormField label="Confirm Password" type="password" name="confirm-password" id="confirm-password" placeholder="Confirm Password" required />
                </div>
                <div className="flex flex-col items-center justify-center mt-4">
                    <div className="mt-4">
                        <PrimaryButton type="submit">
                            SUBMIT
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
};