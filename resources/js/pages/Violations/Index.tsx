import React from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useDialog } from '@/hooks/useDialog';
import { useFormWithToast } from '@/hooks/useFormWithToast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { downloadTableAsCSV, downloadTableAsExcel } from '@/lib/export-utils';
import DeleteConfirmationDialog from '@/components/Dialog/DeleteConfirmationDialog';
import { Violation } from '@/types/violation';

interface PageProps {
    violations: Violation[];
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function Index({ violations, flash }: PageProps) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const createDialog = useDialog();
    const editDialog = useDialog();
    const deleteDialog = useDialog();
    const [selectedViolation, setSelectedViolation] = React.useState<Violation | null>(null);

    const form = useFormWithToast({
        initialData: {
            name: '',
            ordinance_number: '',
            penalties: [
                { offense: 'First', amount: 2000 },
                { offense: 'Second', amount: 3000 },
                { offense: 'Third', amount: 5000 },
            ],
        },
        onSuccess: () => {
            createDialog.close();
            editDialog.close();
            form.reset();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = createDialog.isOpen ? '/violations' : `/violations/${selectedViolation?.id}`;
        const method = createDialog.isOpen ? 'post' : 'put';
        form.submit(url, { method });
    };

    const handleEdit = (violation: Violation) => {
        setSelectedViolation(violation)
        form.setData({
            name: violation.name,
            ordinance_number: violation.ordinance_number,
            penalties: violation.penalties,
        })
        editDialog.open()
    }

    const handleDelete = (violation: Violation) => {
        setSelectedViolation(violation)
        deleteDialog.open()
    }

    const handleBulkDelete = async (selectedViolations: Violation[]) => {
        if (confirm(`Are you sure you want to delete ${selectedViolations.length} violations?`)) {
            // Make API call to delete multiple violations
        }
    };

    const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
        switch (format) {
            case 'csv':
                downloadTableAsCSV(violations, 'violations');
                break;
            case 'excel':
                downloadTableAsExcel(violations, 'violations');
                break;
            case 'pdf':
                window.print();
                break;
        }
    };

    return (
        <AuthenticatedLayout header="List of Violation">
            <DataTable 
                columns={columns({ 
                    onEdit: handleEdit, 
                    onDelete: handleDelete 
                })} 
                data={violations}
                onAdd={() => {
                    form.reset()
                    createDialog.open()
                }}
                onExport={handleExport}
            />

            <Dialog open={createDialog.isOpen || editDialog.isOpen} onOpenChange={() => {
                if (createDialog.isOpen) createDialog.close()
                if (editDialog.isOpen) editDialog.close()
            }}>
                <DialogContent className="sm:max-w-[800px] p-6">
                    <DialogHeader className="space-y-3 mb-8">
                        <DialogTitle className="text-2xl font-bold tracking-tight">
                            {createDialog.isOpen ? 'Add New Violation' : 'Edit Violation'}
                        </DialogTitle>
                        <p className="text-muted-foreground text-sm">
                            Fill in the details below to {createDialog.isOpen ? 'create' : 'update'} a violation record.
                        </p>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Top Row - Violation Details */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Violation Name
                                </Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={e => form.setData('name', e.target.value)}
                                    placeholder="e.g., Anti-Road Obstruction Ordinance"
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ordinance_number" className="text-sm font-medium">
                                    Ordinance Number
                                </Label>
                                <Input
                                    id="ordinance_number"
                                    value={form.data.ordinance_number}
                                    onChange={e => form.setData('ordinance_number', e.target.value)}
                                    placeholder="e.g., Ordinance No. 230-2020"
                                    className="h-11"
                                />
                            </div>
                        </div>

                        {/* Bottom Section - Penalties Card */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Penalties</Label>
                                <span className="text-xs text-muted-foreground">All fields are required</span>
                            </div>
                            
                            <div className="space-y-4 rounded-lg border bg-muted/50 p-6">
                                {form.data.penalties.map((penalty, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label 
                                                htmlFor={`offense-${index}`}
                                                className="text-sm font-medium text-muted-foreground"
                                            >
                                                Offense
                                            </Label>
                                            <Input
                                                id={`offense-${index}`}
                                                value={penalty.offense}
                                                onChange={e => {
                                                    const newPenalties = [...form.data.penalties];
                                                    newPenalties[index].offense = e.target.value;
                                                    form.setData('penalties', newPenalties);
                                                }}
                                                className="h-11 bg-background"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label 
                                                htmlFor={`amount-${index}`}
                                                className="text-sm font-medium text-muted-foreground"
                                            >
                                                Amount
                                            </Label>
                                            <Input
                                                id={`amount-${index}`}
                                                type="number"
                                                value={penalty.amount}
                                                onChange={e => {
                                                    const newPenalties = [...form.data.penalties];
                                                    newPenalties[index].amount = parseFloat(e.target.value);
                                                    form.setData('penalties', newPenalties);
                                                }}
                                                className="h-11 bg-background"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="gap-3 pt-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => {
                                    if (createDialog.isOpen) createDialog.close();
                                    if (editDialog.isOpen) editDialog.close();
                                }}
                                className="h-11"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={form.processing}
                                className="h-11 bg-purple-600 hover:bg-purple-700"
                            >
                                {form.processing ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Processing...
                                    </span>
                                ) : createDialog.isOpen ? 'Add Violation' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <DeleteConfirmationDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => {
                    deleteDialog.close();
                    setSelectedViolation(null);
                }}
                form={form}
                title="Delete Violation"
                description="Are you sure you want to delete this violation?"
                warningMessage={`This will permanently delete "${selectedViolation?.name}". This action cannot be undone.`}
                itemId={selectedViolation?.id ?? 0}
                routeName="violations.destroy"
            />
        </AuthenticatedLayout>
    );
}
