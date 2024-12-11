import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Key } from "lucide-react";
import { User } from '@/types/user';

interface UserCardProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onEditPassword: (user: User) => void;
}

// Add this color mapping object before the UserCard component
const roleColorMap: Record<string, { light: string; dark: string }> = {
    admin: {
        light: "bg-red-50/80 text-red-700 dark:bg-red-900/30 dark:text-red-200",
        dark: "dark:bg-red-900/30 dark:text-red-200"
    },
    manager: {
        light: "bg-blue-50/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200",
        dark: "dark:bg-blue-900/30 dark:text-blue-200"
    },
    user: {
        light: "bg-green-50/80 text-green-700 dark:bg-green-900/30 dark:text-green-200",
        dark: "dark:bg-green-900/30 dark:text-green-200"
    }
};

export default function UserCard({ user, onEdit, onDelete, onEditPassword }: UserCardProps) {
    return (
        <Card className="group relative overflow-hidden hover:border hover:border-violet-500 transition-all duration-300 dark:bg-slate-950/40 dark:border-slate-800/50">
            {/* Main Content Section */}
            <div className="p-6 flex flex-col gap-6">
                {/* Header Section */}
                <div className="flex justify-between items-start">
                    {/* User Profile Section */}
                    <div className="flex gap-4 items-center">
                        {/* Avatar with larger size and improved contrast */}
                        <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-2xl font-semibold ring-2 ring-violet-200 dark:ring-violet-900/50 text-violet-700 dark:text-violet-300">
                            {user.name.charAt(0)}
                        </div>

                        {/* User Details with improved spacing */}
                        <div className="space-y-1.5">
                            {user.name && (
                                <h3 className="text-xl font-semibold dark:text-slate-100">
                                    {user.name}
                                </h3>
                            )}
                            {user.email && (
                                <p className="text-sm text-muted-foreground dark:text-slate-400 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-violet-400/50 animate-pulse" />
                                    {user.email}
                                </p>
                            )}
                            {user.username && (
                                <p className="text-sm text-muted-foreground dark:text-slate-400 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-violet-400/50 animate-pulse" />
                                    {user.username}
                                </p>
                            )}
                        </div>
                    </div>


                </div>

                {/* Subtle Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

                <div>
                    {/* Action Buttons with improved hover states */}
                    <div className="flex justify-between items-center gap-2">
                        <div className="space-y-2.5">

                            {/* Primary Role Badge with animation */}
                            <Badge
                                variant="secondary"
                                className={`px-4 py-1.5 ${roleColorMap[user.roles[0].toLowerCase()]?.light ??
                                    "bg-violet-50/80 text-violet-700 dark:bg-violet-900/30 dark:text-violet-200"
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                                    {user.roles[0]}
                                </span>
                            </Badge>

                        </div>
                        <div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                                onClick={() => onEdit(user)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                                onClick={() => onEditPassword(user)}
                            >
                                <Key className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                onClick={() => onDelete(user)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
} 