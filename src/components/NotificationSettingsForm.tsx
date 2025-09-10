'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { updateNotificationSettings } from '@/actions/settingsActions';
import { User } from '@prisma/client';

interface NotificationSettingsFormProps {
    user: User;
}

export default function NotificationSettingsForm({ user }: NotificationSettingsFormProps) {
    const [emailNotifications, setEmailNotifications] = useState(user.emailNotifications ?? true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await updateNotificationSettings({ emailNotifications });

        if (result.success) {
            toast.success('Notification settings updated successfully!');
        } else {
            toast.error(result.error || 'An error occurred.');
        }
        setIsSubmitting(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center justify-between">
                        <label htmlFor="emailNotifications" className="font-medium">
                            Email Notifications
                        </label>
                        <Switch
                            id="emailNotifications"
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
