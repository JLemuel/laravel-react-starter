import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface ActionButtonProps {
    variant?: "edit" | "delete"
    onClick: () => void
    icon: LucideIcon
    label: string
}

export function ActionButton({ variant = "edit", onClick, icon: Icon, label }: ActionButtonProps) {
    const styles = {
        edit: "bg-blue-50 text-blue-600",
        delete: "bg-red-50 text-red-600"
    }

    return (
        <Button
            variant="ghost"
            className={`h-8 w-8 p-0 rounded-lg transition-colors ${styles[variant]}`}
            onClick={onClick}
        >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{label}</span>
        </Button>
    )
} 