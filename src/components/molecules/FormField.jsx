import React from "react";
import { cn } from "@/utils/cn";
import Label from "@/components/atoms/Label";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";

function FormField({ label, type, multiline, className, error, accept, ...props }) {
  // Defensive check for component availability
  if (!Input || !Textarea) {
    console.error('FormField: Required components not available')
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={props.id || props.name}>
            {label}
          </Label>
        )}
        <div className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-gray-100">
          Component unavailable
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }

const InputComponent = multiline ? Textarea : Input
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={props.id || props.name}>
          {label}
        </Label>
      )}
<InputComponent
        type={type}
        accept={accept}
        className={cn(
          error && "border-red-500 focus:border-red-500"
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

export default FormField