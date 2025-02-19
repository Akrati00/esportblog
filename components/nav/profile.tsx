import React from "react";
import Image from "next/image";
import { useUser } from "@/lib/store/user";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DashboardIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import ManageBiling from "../stripe/ManageBiling";

export default function Profile() {
    const user = useUser((state) => state.user);
    
    const setUser = useUser((state) => state.setUser);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const isAdmin = user?.role === "admin";
    const isSub = user?.subscription_status;

    return (
        <Popover>
            <PopoverTrigger>
               
                    <Image
                        src={user?.image_url || ""}
                        alt={user?.display_name || ""}
                        width={50}
                        height={50}
                        className="rounded-full ring-2 ring-green-500"
                    />
               
            </PopoverTrigger>
            <PopoverContent className="p-2 space-y-3 divide-y">
                <div className="px-4 text-sm">
                    <p>{user?.display_name}</p>
                    <p className="text-gray-500">{user?.email}</p>
                </div>
                {isAdmin && (
                    <Link href="/dashboard" className="block">
                        <Button variant="ghost" className="w-full flex items-center justify-between">
                            Dashboard
                            <DashboardIcon />
                        </Button>
                    </Link>
                )}
                {isSub && <ManageBiling/>}
                <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between"
                    onClick={handleLogout}
                >
                    Log Out
                    <LockOpen1Icon />
                </Button>
            </PopoverContent>
        </Popover>
    );
}
