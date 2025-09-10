"use server";

import prisma from "@/lib/prisma";
import {User, UserProfile} from "@prisma/client";

export async function getRecipientProfile(userId: string): Promise<(User & { UserProfile: UserProfile | null }) | null> {
    return await prisma.user.findUnique({
      where: {id: userId},
      include: {
          UserProfile: true,
      },
  });
}