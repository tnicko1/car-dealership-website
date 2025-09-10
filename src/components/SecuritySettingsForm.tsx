'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { changePassword, setPassword } from '@/actions/settingsActions';

interface SecuritySettingsFormProps {
    userHasPassword?: boolean;
}

export default function SecuritySettingsForm({ userHasPassword: initialUserHasPassword }: SecuritySettingsFormProps) {
    const [userHasPassword, setUserHasPassword] = useState(initialUserHasPassword);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match.');
            return;
        }
        if (newPassword.length < 8) {
            toast.error('New password must be at least 8 characters long.');
            return;
        }
        setIsSubmitting(true);

        const result = userHasPassword
            ? await changePassword({ currentPassword, newPassword })
            : await setPassword({ newPassword });

        if (result.success) {
            toast.success(`Password ${userHasPassword ? 'updated' : 'set'} successfully!`);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            if (!userHasPassword) {
                setUserHasPassword(true); // User now has a password
            }
        } else {
            toast.error(result.error || 'An error occurred.');
        }
        setIsSubmitting(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                    {userHasPassword ? 'Manage your password and account security.' : 'Create a password to sign in directly.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {userHasPassword && (
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <Input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <Input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <Input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                    {userHasPassword ? 'Changing...' : 'Setting...'}
                                </>
                            ) : (userHasPassword ? 'Change Password' : 'Set Password')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
