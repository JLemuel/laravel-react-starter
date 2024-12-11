import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateUserDialogProps {
  form: any;
  availableRoles: string[];
  onClose: () => void;
}

export default function CreateUserDialog({ form, availableRoles, onClose }: CreateUserDialogProps) {
  return (
    <DialogContent className="sm:max-w-md dark:bg-slate-900">
      <DialogHeader>
        <DialogTitle className="dark:text-slate-200">Create New User</DialogTitle>
      </DialogHeader>
      <form onSubmit={(e) => {
        e.preventDefault();
        form.submit(route('users.store'));
      }} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={form.data.name}
            onChange={e => form.setData('name', e.target.value)}
            className="dark:bg-slate-800 dark:border-slate-700"
          />
          {form.errors.name && (
            <p className="text-sm text-red-500">{form.errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={form.data.username}
            onChange={e => form.setData('username', e.target.value)}
            className="dark:bg-slate-800 dark:border-slate-700"
          />
          {form.errors.username && (
            <p className="text-sm text-red-500">{form.errors.username}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={form.data.password}
            onChange={e => form.setData('password', e.target.value)}
            className="dark:bg-slate-800 dark:border-slate-700"
          />
          {form.errors.password && (
            <p className="text-sm text-red-500">{form.errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Roles</Label>
          <Select
            value={form.data.roles.join(',')}
            onValueChange={(value) => form.setData('roles', value.split(',').filter(Boolean))}
          >
            <SelectTrigger className="w-full dark:bg-slate-800 dark:border-slate-700">
              <SelectValue placeholder="Select roles" />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-800">
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role} className="dark:text-slate-200">
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={form.processing}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            {form.processing ? 'Creating...' : 'Create User'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}