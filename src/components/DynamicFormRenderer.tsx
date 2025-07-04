import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormSchema } from "@/types/form";
import { DynamicField } from "@/components/DynamicField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface DynamicFormRendererProps {
  schema: FormSchema;
  onSubmit?: (data: Record<string, any>) => void;
}

const createValidationSchema = (schema: FormSchema) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  schema.fields.forEach((field) => {
    let validator: z.ZodTypeAny;

    switch (field.type) {
      case 'email':
        validator = z.string().email("Please enter a valid email address");
        break;
      case 'number':
        validator = z.coerce.number();
        if (field.validation?.min !== undefined) {
          validator = (validator as z.ZodNumber).min(field.validation.min);
        }
        if (field.validation?.max !== undefined) {
          validator = (validator as z.ZodNumber).max(field.validation.max);
        }
        break;
      case 'date':
        validator = z.date({
          required_error: `${field.label} is required`,
        });
        break;
      case 'checkbox':
        validator = z.boolean().optional();
        break;
      default:
        validator = z.string();
        if (field.validation?.minLength) {
          validator = (validator as z.ZodString).min(field.validation.minLength, `${field.label} must be at least ${field.validation.minLength} characters`);
        }
        if (field.validation?.maxLength) {
          validator = (validator as z.ZodString).max(field.validation.maxLength, `${field.label} must be no more than ${field.validation.maxLength} characters`);
        }
        if (field.validation?.pattern) {
          validator = (validator as z.ZodString).regex(new RegExp(field.validation.pattern), `Invalid ${field.label.toLowerCase()} format`);
        }
        break;
    }

    if (field.required && field.type !== 'checkbox') {
      if (field.type === 'date') {
        // Date validation is already handled above
      } else {
        validator = (validator as z.ZodString).min(1, `${field.label} is required`);
      }
    } else if (!field.required && field.type !== 'checkbox' && field.type !== 'date') {
      validator = (validator as z.ZodString).optional();
    }

    schemaObject[field.id] = validator;
  });

  return z.object(schemaObject);
};

export const DynamicFormRenderer = ({ schema, onSubmit }: DynamicFormRendererProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validationSchema = createValidationSchema(schema);
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
  });

  const handleFormSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    console.log("Form submitted:", data);
    
    if (onSubmit) {
      onSubmit(data);
    } else {
      toast({
        title: "Success!",
        description: "Form has been submitted successfully.",
      });
    }
    
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm border-border/50 shadow-glow">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {schema.title}
          </CardTitle>
          {schema.description && (
            <CardDescription className="text-muted-foreground">
              {schema.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {schema.fields.map((field) => (
              <DynamicField
                key={field.id}
                field={field}
                register={register}
                errors={errors}
                control={control}
              />
            ))}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 font-semibold"
            >
              {isSubmitting ? "Submitting..." : (schema.submitLabel || "Submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};