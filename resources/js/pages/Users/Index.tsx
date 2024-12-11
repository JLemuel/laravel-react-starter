import React from 'react';
import { User, UserPageProps } from '@/types/user';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { useDialog } from '@/hooks/useDialog';
import { useFormWithToast } from '@/hooks/useFormWithToast';    
import CreateUserDialog from '@/components/Dialog/CreateUserDialog';
import EditRolesDialog from '@/components/Dialog/EditRolesDialog';
import DeleteConfirmationDialog from '@/components/Dialog/DeleteConfirmationDialog';
import EditPasswordDialog from '@/components/Dialog/EditPasswordDialog';
import UserCard from './components/UserCard';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

function AddUserCard({ onClick }: { onClick: () => void }) {
  return (
    <Card 
      role="button"
      onClick={onClick}
      className="group relative overflow-hidden  duration-300 dark:bg-slate-950/40 dark:border-slate-800/50 h-full cursor-pointer border-dashed hover:border-violet-200 dark:hover:border-violet-800"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />
      
      <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
        {/* Circle with plus icon */}
        <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-300 ">
          <UserPlus className="w-7 h-7" />
        </div>
        
        {/* Text content */}
        <div className="text-center">
          <h3 className="text-lg font-semibold dark:text-slate-100 mb-1">
            Add New User
          </h3>
          <p className="text-sm text-muted-foreground dark:text-slate-400">
            Create a new user with custom permissions
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function Index({ users, flash, availableRoles = [] }: UserPageProps) {
  const createDialog = useDialog();
  const editDialog = useDialog();
  const deleteDialog = useDialog();
  const passwordDialog = useDialog();
  
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const rolesForm = useFormWithToast({
    initialData: { roles: [] as string[] },
    onSuccess: () => {
      editDialog.close();
      setSelectedUser(null);
    }
  });

  const createForm = useFormWithToast({
    initialData: {
      name: '',
      username: '',
      password: '',
      roles: [] as string[],
    },
    onSuccess: () => createDialog.close()
  });

  const deleteForm = useFormWithToast({
    initialData: {},
    onSuccess: () => {
      deleteDialog.close();
      setSelectedUser(null);
    }
  });

  const passwordForm = useFormWithToast({
    initialData: { password: '' },
    onSuccess: () => {
      passwordDialog.close();
      setSelectedUser(null);
    }
  });

  const handleEditRoles = (user: User) => {
    setSelectedUser(user);
    rolesForm.setData('roles', user.roles);
    editDialog.open();
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    deleteDialog.open();
  };

  const handleEditPassword = (user: User) => {
    setSelectedUser(user);
    passwordForm.reset();
    passwordDialog.open();
  };

  return (
    <AuthenticatedLayout header="Users">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-purple-800 to-violet-600 dark:from-gray-100 dark:via-purple-300 dark:to-violet-200 bg-clip-text text-transparent">
            Users
          </h2>
          <p className="text-muted-foreground mt-2">
            Manage your system users and their permissions.
          </p>
        </div>

        {/* Users Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* Existing User Cards */}
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEditRoles}
              onDelete={handleDeleteUser}
              onEditPassword={handleEditPassword}
            />
          ))}
          {/* Add User Card */}
          <Dialog open={createDialog.isOpen} onOpenChange={createDialog.setIsOpen}>
            <DialogTrigger asChild>
              <div className="h-full">
                <AddUserCard onClick={createDialog.open} />
              </div>
            </DialogTrigger>
            <CreateUserDialog 
              form={createForm}
              availableRoles={availableRoles}
              onClose={createDialog.close}
            />
          </Dialog>
        </div>

        {/* Dialogs */}
        <EditRolesDialog
          isOpen={editDialog.isOpen}
          onClose={editDialog.close}
          form={rolesForm}
          user={selectedUser}
          availableRoles={availableRoles}
        />

        <DeleteConfirmationDialog
          isOpen={deleteDialog.isOpen}
          onClose={deleteDialog.close}
          form={deleteForm}
          title="Delete User"
          description={selectedUser ? `Are you sure you want to delete ${selectedUser.name}? This action cannot be undone.` : ''}
          warningMessage="This will permanently delete the user account and remove all associated data."
          itemId={selectedUser?.id ?? 0}
          routeName="users.destroy"
        />

        <EditPasswordDialog
          isOpen={passwordDialog.isOpen}
          onClose={passwordDialog.close}
          form={passwordForm}
          user={selectedUser}
        />
      </div>
    </AuthenticatedLayout>
  );
}