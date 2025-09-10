'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, UserProfile } from '@prisma/client';
import { updateUser, isUsernameAvailable } from '@/actions/userActions';
import { useSession } from 'next-auth/react';
import { useDebounce } from 'use-debounce';
import { CheckCircle, XCircle, Loader, Upload, Globe } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { CountrySelect } from './CountrySelect';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import 'react-phone-number-input/style.css';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FaWhatsapp, FaTelegram, FaViber, FaGithub, FaLinkedin } from "react-icons/fa6";
import { FaSignalMessenger } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import PhoneVerificationForm from './PhoneVerificationForm';

const PhoneInput = dynamic(() => import('react-phone-number-input'), {
    ssr: false,
    loading: () => <div className="h-[42px] w-full bg-gray-200 rounded-md animate-pulse" />,
});

type UserWithProfile = User & {
    profile: UserProfile | null;
};

const BIO_MAX_LENGTH = 300;

export default function AccountForm({ user }: { user: UserWithProfile }) {
    const { update } = useSession();
    const [firstName, setFirstName] = useState(user.firstName || '');
    const [lastName, setLastName] = useState(user.lastName || '');
    const [username, setUsername] = useState(user.username || '');
    const [debouncedUsername] = useDebounce(username, 500);
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

    const [email, setEmail] = useState(user.email || '');
    const [phone] = useState(user.phone || '');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState(user.image || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Profile fields
    const [bio, setBio] = useState(user.profile?.bio || '');
    const [website, setWebsite] = useState(user.profile?.website || '');
    const [x, setX] = useState(user.profile?.x || '');
    const [github, setGithub] = useState(user.profile?.github || '');
    const [linkedin, setLinkedin] = useState(user.profile?.linkedin || '');

    // Messaging fields
    const [useSameNumber, setUseSameNumber] = useState(user.profile?.useSameNumberForApps ?? true);
    const [whatsappEnabled, setWhatsappEnabled] = useState(user.profile?.whatsappEnabled ?? false);
    const [whatsappNumber, setWhatsappNumber] = useState(user.profile?.whatsappNumber || '');
    const [viberEnabled, setViberEnabled] = useState(user.profile?.viberEnabled ?? false);
    const [viberNumber, setViberNumber] = useState(user.profile?.viberNumber || '');
    const [telegramEnabled, setTelegramEnabled] = useState(user.profile?.telegramEnabled ?? false);
    const [telegramNumber, setTelegramNumber] = useState(user.profile?.telegramNumber || '');
    const [signalEnabled, setSignalEnabled] = useState(user.profile?.signalEnabled ?? false);
    const [signalNumber, setSignalNumber] = useState(user.profile?.signalNumber || '');


    const checkUsername = useCallback(async () => {
        if (!debouncedUsername || debouncedUsername === user.username) {
            setUsernameStatus('idle');
            return;
        }
        setUsernameStatus('checking');
        const isAvailable = await isUsernameAvailable(debouncedUsername);
        setUsernameStatus(isAvailable ? 'available' : 'taken');
    }, [debouncedUsername, user.username]);

    useEffect(() => {
        checkUsername();
    }, [checkUsername]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const fiveMB = 5 * 1024 * 1024;

            if (file.size > fiveMB) {
                toast.error('File size cannot exceed 5MB.');
                return;
            }

            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (usernameStatus === 'taken') {
            toast.error('Please choose a different username.');
            return;
        }
        if (bio.length > BIO_MAX_LENGTH) {
            toast.error(`Bio cannot exceed ${BIO_MAX_LENGTH} characters.`);
            return;
        }
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('phone', phone);
        if (image) {
            formData.append('image', image);
        }
        // Append profile data
        formData.append('bio', bio);
        formData.append('website', website);
        formData.append('x', x);
        formData.append('github', github);
        formData.append('linkedin', linkedin);

        // Append messaging data
        formData.append('useSameNumberForApps', useSameNumber ? 'on' : 'off');
        formData.append('whatsappEnabled', whatsappEnabled ? 'on' : 'off');
        formData.append('whatsappNumber', whatsappNumber);
        formData.append('viberEnabled', viberEnabled ? 'on' : 'off');
        formData.append('viberNumber', viberNumber);
        formData.append('telegramEnabled', telegramEnabled ? 'on' : 'off');
        formData.append('telegramNumber', telegramNumber);
        formData.append('signalEnabled', signalEnabled ? 'on' : 'off');
        formData.append('signalNumber', signalNumber);

        const result = await updateUser(formData);

        if (result.success) {
            toast.success('Profile updated successfully!');
            await update();
            setUsernameStatus('idle');
        } else {
            toast.error(result.error || 'An error occurred.');
        }
        setIsSubmitting(false);
    };

    const isButtonDisabled = isSubmitting || usernameStatus === 'taken' || usernameStatus === 'checking';

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* ... existing form fields ... */}
            <div className="flex items-center gap-6">
                <div className="relative">
                    <Image src={preview || ''} alt="Profile preview" width={96} height={96} className="rounded-full object-cover" />
                    <label
                        htmlFor="image"
                        className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 bg-primary rounded-full text-white cursor-pointer hover:bg-primary-700 transition-colors"
                    >
                        <Upload size={16} />
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="sr-only"
                        />
                    </label>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">{`${user.firstName} ${user.lastName}`}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                    </label>
                    <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                    </label>
                    <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
            </div>
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                </label>
                <div className="relative">
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {usernameStatus === 'checking' && <Loader className="h-5 w-5 text-gray-400 animate-spin" />}
                        {usernameStatus === 'available' && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {usernameStatus === 'taken' && <XCircle className="h-5 w-5 text-red-500" />}
                    </div>
                </div>
                {usernameStatus === 'taken' && <p className="mt-2 text-sm text-red-600">Username is already taken.</p>}
            </div>
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                    </label>
                    <span className={`text-sm ${bio.length > BIO_MAX_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
                        {bio.length} / {BIO_MAX_LENGTH}
                    </span>
                </div>
                <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a little about yourself"
                    rows={4}
                    maxLength={BIO_MAX_LENGTH}
                />
            </div>
            <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800">Social Links</h4>
                <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website" className="pl-10" />
                </div>
                <div className="relative">
                    <FaXTwitter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input id="x" value={x} onChange={(e) => setX(e.target.value)} placeholder="X Profile URL" className="pl-10" />
                </div>
                <div className="relative">
                    <FaGithub className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input id="github" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="GitHub Profile URL" className="pl-10" />
                </div>
                <div className="relative">
                    <FaLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="LinkedIn Profile URL" className="pl-10" />
                </div>
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                </label>
                <PhoneVerificationForm phone={user.phone || ''} phoneVerified={user.phoneVerified || false} />
            </div>

            {/* Messaging Availability Section */}
            <div className="space-y-6">
                <div>
                    <h4 className="text-md font-medium text-gray-800">Messaging Availability</h4>
                    <p className="text-sm text-gray-500">Let others know how they can reach you.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="useSameNumber" checked={useSameNumber} onCheckedChange={setUseSameNumber} />
                    <label htmlFor="useSameNumber" className="text-sm font-medium text-gray-700">
                        Use my main phone number for all messaging apps
                    </label>
                </div>

                <div className="space-y-4">
                    {/* WhatsApp */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaWhatsapp className="h-6 w-6 text-green-500" />
                            <label htmlFor="whatsappEnabled" className="font-medium">WhatsApp</label>
                        </div>
                        <Switch id="whatsappEnabled" checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} />
                    </div>
                    {!useSameNumber && whatsappEnabled && (
                        <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            value={whatsappNumber}
                            onChange={(value) => setWhatsappNumber(value || '')}
                            inputComponent={Input}
                            countrySelectComponent={CountrySelect}
                            placeholder="Enter WhatsApp number"
                        />
                    )}

                    {/* Viber */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaViber className="h-6 w-6 text-purple-600" />
                            <label htmlFor="viberEnabled" className="font-medium">Viber</label>
                        </div>
                        <Switch id="viberEnabled" checked={viberEnabled} onCheckedChange={setViberEnabled} />
                    </div>
                    {!useSameNumber && viberEnabled && (
                        <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            value={viberNumber}
                            onChange={(value) => setViberNumber(value || '')}
                            inputComponent={Input}
                            countrySelectComponent={CountrySelect}
                            placeholder="Enter Viber number"
                        />
                    )}

                    {/* Telegram */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaTelegram className="h-6 w-6 text-blue-500" />
                            <label htmlFor="telegramEnabled" className="font-medium">Telegram</label>
                        </div>
                        <Switch id="telegramEnabled" checked={telegramEnabled} onCheckedChange={setTelegramEnabled} />
                    </div>
                    {!useSameNumber && telegramEnabled && (
                        <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            value={telegramNumber}
                            onChange={(value) => setTelegramNumber(value || '')}
                            inputComponent={Input}
                            countrySelectComponent={CountrySelect}
                            placeholder="Enter Telegram number"
                        />
                    )}

                    {/* Signal */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaSignalMessenger className="h-6 w-6 text-blue-600" />
                            <label htmlFor="signalEnabled" className="font-medium">Signal</label>
                        </div>
                        <Switch id="signalEnabled" checked={signalEnabled} onCheckedChange={setSignalEnabled} />
                    </div>
                    {!useSameNumber && signalEnabled && (
                        <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            value={signalNumber}
                            onChange={(value) => setSignalNumber(value || '')}
                            inputComponent={Input}
                            countrySelectComponent={CountrySelect}
                            placeholder="Enter Signal number"
                        />
                    )}
                </div>
            </div>


            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isButtonDisabled}
                >
                    {isSubmitting ? (
                        <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
}
