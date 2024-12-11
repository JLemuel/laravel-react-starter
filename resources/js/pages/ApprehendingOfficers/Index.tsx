import { router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonStanding, Plus, Pencil, Trash2 } from "lucide-react";
import { useDialog } from '@/hooks/useDialog';
import DeleteConfirmationDialog from '@/components/Dialog/DeleteConfirmationDialog';
import { useFormWithToast } from '@/hooks/useFormWithToast';
import { ActionButton } from "@/components/ui/action-button";

interface Officer {
  id: number;
  name: string;
  email: string;
  username: string;
  designation: string | null;
  contact_number: string | null;
  status: 'active' | 'inactive';
}

interface Props {
  officers: {
    data: Officer[];
  };
}

export default function Index({ officers }: Props) {
  const dialog = useDialog();
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [officerToDelete, setOfficerToDelete] = useState<Officer | null>(null);

  const form = useFormWithToast({
    initialData: {
      name: '',
      email: '',
      password: '',
      username: '',
      designation: '',
      contact_number: '',
      status: 'active' as 'active' | 'inactive'
    },
    onSuccess: () => {
      dialog.close();
      setEditingOfficer(null);
      form.reset();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingOfficer 
      ? `/apprehending-officers/${editingOfficer.id}` 
      : '/apprehending-officers';
    
    if (editingOfficer) {
      form.setData({
        ...form.data,
        password: ''
      });
    }
    
    form.submit(url, {
      method: editingOfficer ? 'put' : 'post',
      onSuccess: () => {
        dialog.close();
        setEditingOfficer(null);
        form.reset();
      }
    });
  };

  const handleCreate = () => {
    setEditingOfficer(null);
    form.reset();
    dialog.open();
  };

  const handleEdit = (officer: Officer) => {
    setEditingOfficer(officer);
    form.setData({
      name: officer.name,
      email: officer.email,
      username: officer.username,
      designation: officer.designation || '',
      contact_number: officer.contact_number || '',
      status: officer.status,
      password: ''
    });
    dialog.open();
  };

  const handleDelete = (officer: Officer) => {
    setOfficerToDelete(officer);
  };

  return (
    <AuthenticatedLayout header="Apprehending Officers">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Apprehending Officers</h1>
            <p className="text-muted-foreground">Manage apprehending officers and their access.</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Officer
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {officers.data.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/50">
              <PersonStanding className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Officers Found</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-sm">
                Get started by adding your first apprehending officer to the system.
              </p>
              <Button onClick={handleCreate} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Your First Officer
              </Button>
            </div>
          ) : (
            officers.data.map((officer) => (
              <Card key={officer.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <PersonStanding className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          {officer.name}
                        </CardTitle>
                        <Badge 
                          variant={officer.status === 'active' ? 'default' : 'secondary'}
                          className="mt-1"
                        >
                          {officer.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <ActionButton
                        variant="edit"
                        icon={Pencil}
                        label="Edit officer"
                        onClick={() => handleEdit(officer)}
                      />
                      <ActionButton
                        variant="delete"
                        icon={Trash2}
                        label="Delete officer"
                        onClick={() => handleDelete(officer)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid gap-3">
                    <div className="flex items-center gap-2">
                      <div className="min-w-[100px] text-sm text-muted-foreground">Email</div>
                      <div className="text-sm font-medium">{officer.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="min-w-[100px] text-sm text-muted-foreground">Username</div>
                      <div className="text-sm font-medium">{officer.username}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="min-w-[100px] text-sm text-muted-foreground">Designation</div>
                      <div className="text-sm font-medium">{officer.designation || 'N/A'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="min-w-[100px] text-sm text-muted-foreground">Contact</div>
                      <div className="text-sm font-medium">{officer.contact_number || 'N/A'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Dialog 
          open={dialog.isOpen} 
          onOpenChange={(open) => {
            if (!open) {
              dialog.close();
              setEditingOfficer(null);
              form.reset();
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingOfficer ? 'Edit Officer' : 'Add New Officer'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={form.data.name}
                      onChange={e => form.setData('name', e.target.value)}
                      placeholder="John Doe"
                      className="h-9"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.data.email}
                      onChange={e => form.setData('email', e.target.value)}
                      placeholder="john@example.com"
                      className="h-9"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Account Credentials */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Account Credentials</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={form.data.username}
                      onChange={e => form.setData('username', e.target.value)}
                      placeholder="johndoe"
                      className="h-9"
                      required
                    />
                  </div>
                  {!editingOfficer && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={form.data.password}
                        onChange={e => form.setData('password', e.target.value)}
                        placeholder="••••••••"
                        className="h-9"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Additional Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      value={form.data.designation}
                      onChange={e => form.setData('designation', e.target.value)}
                      placeholder="Traffic Enforcer"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_number">Contact Number</Label>
                    <Input
                      id="contact_number"
                      value={form.data.contact_number}
                      onChange={e => form.setData('contact_number', e.target.value)}
                      placeholder="+63 XXX XXX XXXX"
                      className="h-9"
                    />
                  </div>
                </div>
              </div>

              {/* Status (Only for editing) */}
              {editingOfficer && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Account Status</h3>
                  <Select
                    value={form.data.status}
                    onValueChange={(value: string) => form.setData('status', value as 'active' | 'inactive')}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    dialog.close();
                    setEditingOfficer(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingOfficer ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <DeleteConfirmationDialog
          isOpen={officerToDelete !== null}
          onClose={() => setOfficerToDelete(null)}
          form={form}
          title="Delete Officer"
          description={`Are you sure you want to delete ${officerToDelete?.name}?`}
          warningMessage="This action will permanently remove the officer from the system and cannot be undone."
          itemId={officerToDelete?.id ?? 0}
          routeName="apprehending-officers.destroy"
        />
      </div>
    </AuthenticatedLayout>
  );
} 