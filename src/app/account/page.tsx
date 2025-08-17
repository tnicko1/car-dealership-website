import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AccountForm from "@/components/AccountForm";

export default async function AccountPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) {
        redirect('/');
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
            <div className="max-w-2xl mx-auto">
                <AccountForm user={user} />
            </div>
        </div>
    );
}
