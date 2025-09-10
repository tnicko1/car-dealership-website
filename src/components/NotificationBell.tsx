"use client";

import { useCallback, useEffect, useState, useTransition } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import { getNotifications, markNotificationsAsRead } from "@/actions/notificationActions";
import { Notification } from "@prisma/client";
import Link from "next/link";
import { useWebSocket } from '@/providers/WebSocketProvider';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { lastMessage } = useWebSocket();

    const fetchNotifications = useCallback(() => {
        startTransition(async () => {
            const fetchedNotifications = await getNotifications();
            setNotifications(fetchedNotifications);
            setUnreadCount(fetchedNotifications.filter(n => !n.read).length);
        });
    }, [startTransition]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        if (lastMessage?.type === 'new_notification') {
            fetchNotifications();
        }
    }, [lastMessage, fetchNotifications]);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open && unreadCount > 0) {
            // Optimistically update the UI
            setUnreadCount(0);
            // Mark as read on the server
            startTransition(() => {
                markNotificationsAsRead().then(() => {
                    // Fetch again to ensure consistency
                    fetchNotifications();
                });
            });
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 bg-white" align="end">
                <div className="grid gap-4">
                    <div className="space-y-2 p-4 border-b">
                        <h4 className="font-medium leading-none">Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                            You have {unreadCount} unread notifications.
                        </p>
                    </div>
                    <div className="grid gap-1 max-h-96 overflow-y-auto p-2">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <Link
                                    key={notification.id}
                                    href={notification.link || '#'}
                                    className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <p className="font-semibold text-sm">{notification.title}</p>
                                    <p className="text-sm text-gray-600 truncate">{notification.body}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </Link>
                            ))
                        ) : (
                            <p className="text-sm text-center text-muted-foreground py-8">You're all caught up!</p>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
