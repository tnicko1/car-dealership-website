'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { sendVerificationCode, verifyCode } from '@/actions/phoneActions';
import PhoneInput from 'react-phone-number-input';
import { CountrySelect } from './CountrySelect';
import 'react-phone-number-input/style.css';

interface PhoneVerificationFormProps {
    phone: string;
    phoneVerified: boolean;
}

export default function PhoneVerificationForm({ phone: initialPhone, phoneVerified: initialPhoneVerified }: PhoneVerificationFormProps) {
    const [phone, setPhone] = useState(initialPhone || '');
    const [isEditing, setIsEditing] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(initialPhoneVerified);
    const [code, setCode] = useState('');
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [codeSent, setCodeSent] = useState(false);

    const handleSendCode = async () => {
        setIsSendingCode(true);
        const result = await sendVerificationCode(phone);
        if (result.success) {
            toast.success('Verification code sent!');
            setCodeSent(true);
        } else {
            toast.error(result.error || 'Failed to send code.');
        }
        setIsSendingCode(false);
    };

    const handleVerifyCode = async () => {
        setIsVerifying(true);
        const result = await verifyCode(phone, code);
        if (result.success) {
            toast.success('Phone number verified!');
            setPhoneVerified(true);
            setIsEditing(false); // Exit editing mode on success
        } else {
            toast.error(result.error || 'Verification failed.');
        }
        setIsVerifying(false);
    };

    if (phoneVerified && !isEditing) {
        return (
            <div className="flex items-center gap-4">
                <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    value={phone}
                    onChange={() => {}}
                    inputComponent={Input}
                    countrySelectComponent={CountrySelect}
                    disabled
                />
                <span className="text-sm font-medium text-green-600">Verified</span>
                <Button variant="outline" onClick={() => setIsEditing(true)}>Change</Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    value={phone}
                    onChange={(value) => setPhone(value || '')}
                    inputComponent={Input}
                    countrySelectComponent={CountrySelect}
                />
                <Button onClick={handleSendCode} disabled={isSendingCode || !phone}>
                    {isSendingCode ? <Loader className="h-4 w-4 animate-spin" /> : 'Send Code'}
                </Button>
            </div>
            {codeSent && (
                <div className="flex items-center gap-4">
                    <Input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                    />
                    <Button onClick={handleVerifyCode} disabled={isVerifying || !code}>
                        {isVerifying ? <Loader className="h-4 w-4 animate-spin" /> : 'Verify'}
                    </Button>
                </div>
            )}
        </div>
    );
}
