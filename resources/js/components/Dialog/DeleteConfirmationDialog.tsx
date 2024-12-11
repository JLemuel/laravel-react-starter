import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  form: any;
  title: string;
  description: string;
  warningMessage: string;
  itemId: number;
  routeName: string;
}

export default function DeleteConfirmationDialog({ 
  isOpen, 
  onClose, 
  form, 
  title,
  description,
  warningMessage,
  itemId,
  routeName
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 dark:text-slate-200">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {title}
          </DialogTitle>
          <DialogDescription className="dark:text-slate-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => {
          e.preventDefault();
          form.submit(route(routeName, itemId), {
            preserveScroll: true,
            method: 'delete'
          });
        }}>
          <div className="mt-4 bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/50 rounded-lg p-4">
            <p className="text-sm text-red-600 dark:text-red-400">
              {warningMessage}
            </p>
          </div>

          <DialogFooter className="mt-6 gap-2 sm:gap-0">
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
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-800"
            >
              {form.processing ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}