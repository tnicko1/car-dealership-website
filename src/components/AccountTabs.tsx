'use client';

import { useState } from 'react';
import { User, UserProfile } from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountForm from '@/components/AccountForm';
import SecuritySettingsForm from './SecuritySettingsForm';
import NotificationSettingsForm from './NotificationSettingsForm';

type UserWithProfile = User & {
    profile: UserProfile | null;
};

interface AccountTabsProps {
    user: UserWithProfile;
    userHasPassword?: boolean;
}

export default function AccountTabs({ user, userHasPassword }: AccountTabsProps) {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-8">
            <TabsList className="flex md:flex-col md:w-1/4 lg:w-1/5 bg-transparent p-0 h-full">
                <TabsTrigger value="profile" className="justify-start w-full text-left px-4 py-2">Profile</TabsTrigger>
                <TabsTrigger value="security" className="justify-start w-full text-left px-4 py-2">Security</TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start w-full text-left px-4 py-2">Notifications</TabsTrigger>
            </TabsList>
            <div className="flex-1">
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>This is how others will see you on the site.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AccountForm user={user} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="security">
                    <SecuritySettingsForm userHasPassword={userHasPassword} />
                </TabsContent>
                <TabsContent value="notifications">
                    <NotificationSettingsForm user={user} />
                </TabsContent>
            </div>
        </Tabs>
    );
}