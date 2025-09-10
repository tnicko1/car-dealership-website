"use server";

import prisma from "@/lib/prisma";
import { Review } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { ReviewWithReviewer } from "@/types/global";

export async function getReviewsForSeller(sellerId: string): Promise<ReviewWithReviewer[]> {
  return prisma.review.findMany({
    where: { sellerId },
    include: {
      reviewer: true,
    },
  });
}

export async function createReview(
  transactionId: string,
  rating: number,
  comment: string,
  reviewerId: string,
  sellerId: string
): Promise<Review> {
  const review = await prisma.review.create({
    data: {
      transactionId,
      rating,
      comment,
      reviewerId,
      sellerId,
    },
  });
  const seller = await prisma.user.findUnique({ where: { id: sellerId } });
  if (seller) {
    revalidatePath(`/users/${seller.username}`);
  }
  return review;
}
