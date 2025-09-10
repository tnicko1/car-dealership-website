"use server";

import prisma from "@/lib/prisma";
import { UserProfile } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  return prisma.userProfile.findUnique({
    where: { userId },
  });
}

export async function createUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
  const userProfile = await prisma.userProfile.create({
    data: {
      userId,
      ...data,
    },
  });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    revalidatePath(`/users/${user.username}`);
  }
  return userProfile;
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
  const userProfile = await prisma.userProfile.update({
    where: { userId },
    data,
  });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    revalidatePath(`/users/${user.username}`);
  }
  return userProfile;
}
