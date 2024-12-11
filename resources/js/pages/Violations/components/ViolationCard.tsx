import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Violation } from '@/types/violation';

interface ViolationCardProps {
    violation: Violation;
    onEdit: (violation: Violation) => void;
    onDelete: (violation: Violation) => void;
}

const statusColorMap: Record<string, { light: string; dark: string }> = {
    pending: {
        light: "bg-yellow-50/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200",
        dark: "dark:bg-yellow-900/30 dark:text-yellow-200"
    },
    paid: {
        light: "bg-green-50/80 text-green-700 dark:bg-green-900/30 dark:text-green-200",
        dark: "dark:bg-green-900/30 dark:text-green-200"
    },
    cancelled: {
        light: "bg-red-50/80 text-red-700 dark:bg-red-900/30 dark:text-red-200",
        dark: "dark:bg-red-900/30 dark:text-red-200"
    }
};

export default function ViolationCard({ violation, onEdit, onDelete }: ViolationCardProps) {
    return (
        <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 dark:bg-slate-950/40 dark:border-slate-800/50">
            <CardContent className="p-6 flex flex-col gap-6">
                {/* Header Section */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1.5">
                        <h3 className="text-xl font-semibold dark:text-slate-100">
                            {violation.violator_name}
                        </h3>
                        <p className="text-sm text-muted-foreground dark:text-slate-400">
                            Ticket #{violation.ticket_number}
                        </p>
                    </div>
                    <Badge
                        variant="secondary"
                        className={`px-4 py-1.5 capitalize ${
                            statusColorMap[violation.status]?.light ?? 
                            "bg-violet-50/80 text-violet-700 dark:bg-violet-900/30 dark:text-violet-200"
                        }`}
                    >
                        {violation.status}
                    </Badge>
                </div>

                {/* Details */}
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Violation Type</span>
                            <span className="font-medium">{violation.violation_type}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Location</span>
                            <span className="font-medium">{violation.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Amount</span>
                            <span className="font-medium">₱{violation.amount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                        onClick={() => onEdit(violation)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        onClick={() => onDelete(violation)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 