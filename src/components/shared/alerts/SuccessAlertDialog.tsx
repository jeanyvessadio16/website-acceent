import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";

export function SuccessAlertDialog({
  open,
  onOpenChange,
  message,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Message envoyé</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>{message}</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
