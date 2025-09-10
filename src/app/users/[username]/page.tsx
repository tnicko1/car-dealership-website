import { getUserProfile, createUserProfile } from "@/actions/userProfileActions";
import { getReviewsForSeller } from "@/actions/reviewActions";
import prisma from "@/lib/prisma";
import { notFound } from 'next/navigation';
import UserProfileClient from "@/components/UserProfileClient";

export default async function UserProfilePage({ params }: { params: { username: string } }) {
    const user = await prisma.user.findUnique({
        where: { username: params.username },
    });

    if (!user) {
        notFound();
    }

    let userProfile = await getUserProfile(user.id);
    if (!userProfile) {
        userProfile = await createUserProfile(user.id, {});
    }

    const reviews = await getReviewsForSeller(user.id);

    const userCars = await prisma.car.findMany({
        where: {
            userId: user.id,
                         Transaction: null, // Car is not sold if it has no transaction
        },
        include: {
            images: true,
        },
    });

    const carsSold = await prisma.transaction.count({
        where: { sellerId: user.id },
    });

    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0;

    return (
        <UserProfileClient
            user={user}
            userProfile={userProfile}
            reviews={reviews}
            userCars={userCars}
            averageRating={averageRating}
            carsSold={carsSold}
        />
    );
}
