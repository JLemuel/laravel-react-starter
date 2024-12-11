import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/types/user";

interface EditRolesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  form: any;
  user: User | null;
  availableRoles: string[];
}

export default function EditRolesDialog({ isOpen, onClose, form, user, availableRoles }: EditRolesDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="dark:text-slate-200">
            Edit Roles for {user.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => {
          e.preventDefault();
          form.submit(route('users.roles.update', user.id), {
            method: 'patch'
          });
        }} className="space-y-4">
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
                  <SelectItem 
                    key={role} 
                    value={role} 
                    className="dark:text-slate-200"
                  >
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.errors.roles && (
              <p className="text-sm text-red-500">{form.errors.roles}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
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
              {form.processing ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}