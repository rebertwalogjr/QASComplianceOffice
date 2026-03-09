import { LucideHistory } from "lucide-react";

export default function Maintenance({ moduleName } : { moduleName : string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center border-2 border-dashed rounded-xl bg-muted/30 border-muted-foreground/20 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-orange-100 animate-ping opacity-25" />
        <div className="relative p-4 bg-orange-50 rounded-full border border-orange-200">
          <LucideHistory size={32} className="text-orange-500" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-foreground">{moduleName}</h3>
      <p className="max-w-[250px] mt-1 text-sm text-muted-foreground">
        This module is currently being optimized to handle high-volume transaction logs.
      </p>

      <div className="mt-6 inline-flex items-center px-3 py-1 rounded-full bg-orange-100/50 border border-orange-200 text-[10px] font-bold uppercase tracking-wider text-orange-700">
        Coming Soon
      </div>
    </div>
  )
}