"use client";

import { useState } from 'react';
import { User, UserProfile } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FaWhatsapp, FaTelegram, FaViber, FaEnvelope, FaPhone } from "react-icons/fa6";
import { FaSignalMessenger } from "react-icons/fa6";
import Link from 'next/link';

interface OffPlatformModalProps {
  recipient: User & { UserProfile: UserProfile | null };
}

export default function OffPlatformModal({ recipient }: OffPlatformModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const messagingApps = [
    {
      name: 'WhatsApp',
      enabled: recipient.UserProfile?.whatsappEnabled,
      href: `https://wa.me/${recipient.UserProfile?.whatsappNumber || recipient.phone}`,
      icon: FaWhatsapp,
    },
    {
      name: 'Telegram',
      enabled: recipient.UserProfile?.telegramEnabled,
      href: `https://t.me/${recipient.UserProfile?.telegramNumber || recipient.phone}`,
      icon: FaTelegram,
    },
    {
      name: 'Viber',
      enabled: recipient.UserProfile?.viberEnabled,
      href: `viber://chat?number=${recipient.UserProfile?.viberNumber || recipient.phone}`,
      icon: FaViber,
    },
    {
      name: 'Signal',
      enabled: recipient.UserProfile?.signalEnabled,
      href: `sgnl://signal.me/#p/${recipient.UserProfile?.signalNumber || recipient.phone}`,
      icon: FaSignalMessenger,
    },
  ];

  const enabledApps = messagingApps.filter(app => app.enabled);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Move Off-Platform</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Continue Conversation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {recipient.email && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaEnvelope className="h-6 w-6" />
                <span>{recipient.email}</span>
              </div>
              <Button asChild>
                <Link href={`mailto:${recipient.email}`}>Email</Link>
              </Button>
            </div>
          )}
          {recipient.phone && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaPhone className="h-6 w-6" />
                <span>{recipient.phone}</span>
              </div>
              <Button asChild>
                <Link href={`tel:${recipient.phone}`}>Call</Link>
              </Button>
            </div>
          )}
          {enabledApps.length > 0 ? (
            enabledApps.map(app => (
              <div key={app.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <app.icon className="h-6 w-6" />
                  <span>{app.name}</span>
                </div>
                <Button asChild>
                  <Link href={app.href} target="_blank" rel="noopener noreferrer">
                    Continue on {app.name}
                  </Link>
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              This user has not specified any off-platform contact methods.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
