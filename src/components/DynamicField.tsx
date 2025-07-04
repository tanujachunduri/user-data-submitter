import { FormField } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, User, Mail, MessageSquare, Hash, Calendar as CalendarLucide } from "lucide-react";
import { UseFormRegister, FieldErrors, Control, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

interface DynamicFieldProps {
  field: FormField;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  control: Control<any>;
}

const getFieldIcon = (type: string, iconName?: string) => {
  if (iconName === "user") return <User className="w-4 h-4" />;
  if (iconName === "mail") return <Mail className="w-4 h-4" />;
  if (iconName === "message") return <MessageSquare className="w-4 h-4" />;
  if (iconName === "hash") return <Hash className="w-4 h-4" />;
  if (iconName === "calendar") return <CalendarLucide className="w-4 h-4" />;
  
  // Default icons based on field type
  switch (type) {
    case 'email': return <Mail className="w-4 h-4" />;
    case 'textarea': return <MessageSquare className="w-4 h-4" />;
    case 'number': return <Hash className="w-4 h-4" />;
    case 'date': return <CalendarLucide className="w-4 h-4" />;
    default: return <User className="w-4 h-4" />;
  }
};

export const DynamicField = ({ field, register, errors, control }: DynamicFieldProps) => {
  const error = errors[field.id];
  const icon = getFieldIcon(field.type, field.icon);

  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            {...register(field.id)}
            className="bg-input border-border focus:border-primary focus:ring-primary"
          />
        );

      case 'select':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField }) => (
              <Select onValueChange={controllerField.onChange} value={controllerField.value}>
                <SelectTrigger className="bg-input border-border focus:border-primary focus:ring-primary">
                  <SelectValue placeholder={field.placeholder || "Select an option"} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={field.id}
                  checked={controllerField.value}
                  onCheckedChange={controllerField.onChange}
                />
                <Label htmlFor={field.id} className="text-sm font-normal">
                  {field.placeholder || field.label}
                </Label>
              </div>
            )}
          />
        );

      case 'date':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-input border-border focus:border-primary",
                      !controllerField.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {controllerField.value ? (
                      format(controllerField.value, "PPP")
                    ) : (
                      <span>{field.placeholder || "Pick a date"}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={controllerField.value}
                    onSelect={controllerField.onChange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        );

      default:
        return (
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            {...register(field.id)}
            className="bg-input border-border focus:border-primary focus:ring-primary"
          />
        );
    }
  };

  if (field.type === 'checkbox') {
    return (
      <div className="space-y-2">
        {renderField()}
        {error && (
          <p className="text-destructive text-sm">{error.message as string}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id} className="text-foreground flex items-center gap-2">
        {icon}
        {field.label}
        {field.required && <span className="text-destructive">*</span>}
      </Label>
      {renderField()}
      {error && (
        <p className="text-destructive text-sm">{error.message as string}</p>
      )}
    </div>
  );
};