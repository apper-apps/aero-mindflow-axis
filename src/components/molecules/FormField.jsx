import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const FormField = ({
  label,
  type = "text",
  multiline = false,
  error,
  className,
  ...props
}) => {
  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <InputComponent
        type={type}
        className={cn(
          error && "border-error focus:border-error focus:ring-error/20"
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;