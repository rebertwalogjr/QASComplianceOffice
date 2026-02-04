import { ReactNode } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { cn } from "@/lib/utils";

interface ActionDialogProps {
  title: string;
  description?: string;
  trigger: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function ActionDialog({
  title,
  description,
  trigger,
  children,
  footer,
  className
}: ActionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className={cn("sm:max-w-sm", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>
          {children}
        </div>
        {footer && (
          <DialogFooter>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}