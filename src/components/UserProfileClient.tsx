'use client';

import { User, Review, UserProfile } from '@prisma/client';
import { CarWithImages } from '@/types/car';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Clock, CarIcon, CalendarDays, Globe } from 'lucide-react';
import CarCard from '@/components/CarCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { FaWhatsapp, FaTelegram, FaViber, FaGithub, FaLinkedin } from "react-icons/fa6";
import { FaSignalMessenger } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

type ReviewWithReviewer = Review & {
    reviewer: User;
};

interface UserProfileClientProps {
    user: User;
    userProfile: UserProfile;
    reviews: ReviewWithReviewer[];
    userCars: CarWithImages[];
    averageRating: number;
    carsSold: number;
}

export default function UserProfileClient({
    user,
    userProfile,
    reviews,
    userCars,
    averageRating,
    carsSold,
}: UserProfileClientProps) {
    userProfile.createdAt ? formatDistanceToNow(new Date(userProfile.createdAt), { addSuffix: true }) : 'N/A';
    const socialLinks = [
        { href: userProfile.website, icon: Globe, label: 'Website' },
        { href: userProfile.x, icon: FaXTwitter, label: 'X' },
        { href: userProfile.github, icon: FaGithub, label: 'GitHub' },
        { href: userProfile.linkedin, icon: FaLinkedin, label: 'LinkedIn' },
    ].filter(link => link.href);

    const messagingLinks = [
        { enabled: userProfile.whatsappEnabled, number: userProfile.whatsappNumber, icon: FaWhatsapp, label: 'WhatsApp', href: `https://wa.me/${userProfile.whatsappNumber}` },
        { enabled: userProfile.viberEnabled, number: userProfile.viberNumber, icon: FaViber, label: 'Viber', href: `viber://chat?number=${userProfile.viberNumber}` },
        { enabled: userProfile.telegramEnabled, number: userProfile.telegramNumber, icon: FaTelegram, label: 'Telegram', href: `https://t.me/${userProfile.telegramNumber}` },
        { enabled: userProfile.signalEnabled, number: userProfile.signalNumber, icon: FaSignalMessenger, label: 'Signal', href: `sgnl://signal.me/#p/${userProfile.signalNumber}` },
    ].filter(link => link.enabled);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Left Sidebar */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                        <Avatar className="w-32 h-32 border-4 border-gray-200">
                            <AvatarImage src={user.image!} alt={`${user.firstName} ${user.lastName}`} />
                            <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                        </Avatar>
                        <h1 className="text-2xl font-bold mt-4 text-center">{user.firstName} {user.lastName}</h1>
                        <div className="flex items-center mt-2">
                            <Star className="text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 font-bold text-lg">{averageRating.toFixed(1)}</span>
                            <span className="ml-2 text-gray-500">({reviews.length} reviews)</span>
                        </div>
                        <p className="text-gray-600 mt-4 text-center text-sm">{userProfile.bio || 'No bio yet.'}</p>
                        {socialLinks.length > 0 && (
                            <div className="flex items-center justify-center mt-4 space-x-4">
                                {socialLinks.map(social => (
                                    <Link href={social.href!} key={social.label} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                                        <social.icon size={24} />
                                        <span className="sr-only">{social.label}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4">Stats</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-center">
                                <CarIcon className="w-5 h-5 mr-3 text-gray-400" />
                                <span><span className="font-bold">{carsSold}</span> cars sold</span>
                            </li>
                            <li className="flex items-center">
                                <CalendarDays className="w-5 h-5 mr-3 text-gray-400" />
                                <span>Member since <span className="font-bold">{new Date(userProfile.createdAt).toLocaleDateString()}</span></span>
                            </li>
                            <li className="flex items-center">
                                <Clock className="w-5 h-5 mr-3 text-gray-400" />
                                <span>Responds in <span className="font-bold">about an hour</span></span>
                            </li>
                        </ul>
                    </div>
                    {messagingLinks.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">Contact</h3>
                            <div className="flex items-center justify-center space-x-4">
                                {messagingLinks.map(app => (
                                    <Link href={app.href} key={app.label} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                                        <app.icon className="h-8 w-8" />
                                        <span className="sr-only">{app.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Content */}
                <div className="md:col-span-3">
                    <Tabs defaultValue="listings" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="listings">Active Listings ({userCars.length})</TabsTrigger>
                            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="listings">
                            <div className="mt-6">
                                {userCars.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {userCars.map((car) => (
                                            <CarCard key={car.id} car={car} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <p className="text-lg">This user has no active listings.</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="reviews">
                            <div className="mt-6 space-y-6">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review.id} className="bg-white border rounded-lg p-4 flex items-start">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={review.reviewer.image!} />
                                                <AvatarFallback>{review.reviewer.firstName?.[0]}{review.reviewer.lastName?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="ml-4 flex-1">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold">{review.reviewer.firstName} {review.reviewer.lastName}</p>
                                                        <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={16} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-gray-700">{review.comment}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <p className="text-lg">This user has not received any reviews yet.</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
