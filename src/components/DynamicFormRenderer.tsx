import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormSchema } from "@/types/form";
import { DynamicField } from "@/components/DynamicField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAIValidation } from "@/hooks/useAIValidation";
import { Brain, CheckCircle, AlertTriangle, Info } from "lucide-react";

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
  const [aiValidationResults, setAiValidationResults] = useState<any>(null);
  const { toast } = useToast();
  const { validateWithAI, isValidating, suggestions } = useAIValidation();

  const validationSchema = createValidationSchema(schema);
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
  });

  const formData = watch();

  // AI validation on form data changes
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (Object.keys(formData).length > 0) {
        const results = await validateWithAI(formData, schema.fields);
        setAiValidationResults(results);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData, validateWithAI, schema.fields]);

  const handleFormSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);
    
    // Final AI validation before submission
    const finalValidation = await validateWithAI(data, schema.fields);
    
    if (!finalValidation.isValid) {
      toast({
        title: "Validation Issues",
        description: "Please address the validation issues before submitting.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    console.log("Form submitted:", data);
    console.log("AI Validation Confidence:", finalValidation.confidence);
    
    if (onSubmit) {
      onSubmit(data);
    } else {
      toast({
        title: "Success!",
        description: `Form submitted with ${Math.round(finalValidation.confidence * 100)}% AI confidence.`,
      });
    }
    
    reset();
    setIsSubmitting(false);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
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
          {/* AI Validation Status */}
          {(isValidating || aiValidationResults) && (
            <Card className="mb-6 border-border/50 bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-primary" />
                  <span className="font-medium">AI Validation</span>
                  {isValidating && (
                    <Badge variant="secondary" className="animate-pulse">
                      Analyzing...
                    </Badge>
                  )}
                  {aiValidationResults && (
                    <Badge 
                      variant={aiValidationResults.isValid ? "default" : "destructive"}
                    >
                      {Math.round(aiValidationResults.confidence * 100)}% Confidence
                    </Badge>
                  )}
                </div>
                
                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 rounded bg-background/50">
                        {getSeverityIcon(suggestion.severity)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {schema.fields.find(f => f.id === suggestion.field)?.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {suggestion.suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
              disabled={isSubmitting || isValidating}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 font-semibold"
            >
              {isSubmitting ? "Submitting..." : 
               isValidating ? "AI Validating..." : 
               (schema.submitLabel || "Submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};