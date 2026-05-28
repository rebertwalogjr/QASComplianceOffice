import { LockIcon } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center border-2 border-dashed rounded-xl bg-muted/30 border-muted-foreground/20 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-25" />
          <div className="relative p-4 bg-red-50 rounded-full border border-red-200">
            <LockIcon size={32} className="text-red-500" />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-foreground">You don't have access</h3>
        <p className="max-w-[250px] mt-1 text-sm text-muted-foreground">
          Page unavailable, contact your administrator to ask for access.
        </p>

        {/* <div className="mt-6 inline-flex items-center px-3 py-1 rounded-full bg-orange-100/50 border border-orange-200 text-[10px] font-bold uppercase tracking-wider text-orange-700">
        Coming Soon
        </div> */}
      </div>
    </div>
  )
}