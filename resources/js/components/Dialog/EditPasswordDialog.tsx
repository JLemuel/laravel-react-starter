import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User } from "@/types/user";

interface EditPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  form: any;
  user: User | null;
}

export default function EditPasswordDialog({ isOpen, onClose, form, user }: EditPasswordDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="dark:text-slate-200">
            Change Password for {user.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => {
          e.preventDefault();
          form.submit(route('users.password.update', user.id), {
            method: 'patch'
          });
        }} className="space-y-4">
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input
              type="password"
              value={form.data.password}
              onChange={e => form.setData('password', e.target.value)}
              className="dark:bg-slate-800 dark:border-slate-700"
            />
            {form.errors.password && (
              <p className="text-sm text-red-500">{form.errors.password}</p>
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
              {form.processing ? 'Saving...' : 'Update Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}