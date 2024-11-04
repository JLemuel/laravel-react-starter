import React, { useState } from 'react';
// import { Inertia } from '@inertiajs/react';
import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Role {
  id: number;
  name: string;
}

interface Props {
  roles: Role[];
}

export default function Index({ roles }: Props) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    name: '',
  });

  const deleteRole = (id: number) => {
    if (confirm('Are you sure you want to delete this role?')) {
    //   Inertia.delete(route('roles.destroy', id));
    }
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('roles.store'), {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setData('name', '');
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Roles</h1>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create New Role</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Enter the name for the new role.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateRole}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                <div className="flex justify-end space-x-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={processing}>
                    Create
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  <Button variant="outline" asChild className="mr-2">
                    {/* <InertiaLink href={route('roles.edit', role.id)}>
                      Edit
                    </InertiaLink> */}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" onClick={() => setSelectedRole(role)}>
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this role?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete the role
                          "{selectedRole?.name}" and remove it from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={() => setSelectedRole(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => {
                          if (selectedRole) {
                            deleteRole(selectedRole.id);
                            setSelectedRole(null);
                          }
                        }}>
                          Delete
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AuthenticatedLayout>
  );
}
