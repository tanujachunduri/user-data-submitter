import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAIValidation } from '@/hooks/useAIValidation';
import { FormSchema, FormField } from '@/types/form';
import { Brain, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DynamicFormRendererProps {
  schema: FormSchema;
  onSubmit?: (data: any) => void;
}

const createZodSchema = (fields: FormField[]) => {
  const schemaObject: Record<string, any> = {};
  
  fields.forEach(field => {
    let fieldSchema: any;
    
    switch (field.type) {
      case 'email':
        fieldSchema = z.string().email('Please enter a valid email address');
        break;
      case 'number':
        fieldSchema = z.coerce.number();
        if (field.validation?.min) fieldSchema = fieldSchema.min(field.validation.min);
        if (field.validation?.max) fieldSchema = fieldSchema.max(field.validation.max);
        break;
      case 'checkbox':
        fieldSchema = z.boolean();
        break;
      default:
        fieldSchema = z.string();
        if (field.validation?.min) fieldSchema = fieldSchema.min(field.validation.min, `Minimum ${field.validation.min} characters required`);
        if (field.validation?.max) fieldSchema = fieldSchema.max(field.validation.max, `Maximum ${field.validation.max} characters allowed`);
        if (field.validation?.pattern) fieldSchema = fieldSchema.regex(new RegExp(field.validation.pattern), 'Invalid format');
    }
    
    if (!field.required) {
      fieldSchema = fieldSchema.optional();
    }
    
    schemaObject[field.id] = fieldSchema;
  });
  
  return z.object(schemaObject);
};

export const DynamicFormRenderer = ({ schema, onSubmit }: DynamicFormRendererProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { validateField, getFieldValidation, isFieldValidating } = useAIValidation();

  const zodSchema = createZodSchema(schema.fields);
  type FormData = z.infer<typeof zodSchema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(zodSchema)
  });

  const watchedValues = watch();

  // AI validation on field changes
  useEffect(() => {
    if (!schema.aiValidation?.enabled) return;

    Object.entries(watchedValues).forEach(([fieldId, value]) => {
      if (value && typeof value === 'string') {
        validateField(fieldId, value);
      }
    });
  }, [watchedValues, validateField, schema.aiValidation?.enabled]);

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "Form submitted successfully with AI validation.",
      });
      
      onSubmit?.(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const aiValidation = getFieldValidation(field.id);
    const isValidating = isFieldValidating(field.id);
    const error = errors[field.id as keyof typeof errors];

    const fieldWrapperClass = "space-y-2";
    const labelClass = "text-foreground flex items-center gap-2";

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.id} className={fieldWrapperClass}>
            <Label htmlFor={field.id} className={labelClass}>
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              {...register(field.id)}
              className="bg-input border-border focus:border-primary focus:ring-primary"
            />
            {renderValidationFeedback(error, aiValidation, isValidating)}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className={fieldWrapperClass}>
            <Label htmlFor={field.id} className={labelClass}>
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select onValueChange={(value) => setValue(field.id, value)}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {renderValidationFeedback(error, aiValidation, isValidating)}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className={fieldWrapperClass}>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                onCheckedChange={(checked) => setValue(field.id, checked)}
              />
              <Label htmlFor={field.id} className="text-foreground">
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
              </Label>
            </div>
            {renderValidationFeedback(error, aiValidation, isValidating)}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className={fieldWrapperClass}>
            <Label className={labelClass}>
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <RadioGroup onValueChange={(value) => setValue(field.id, value)}>
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                  <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            {renderValidationFeedback(error, aiValidation, isValidating)}
          </div>
        );

      default:
        return (
          <div key={field.id} className={fieldWrapperClass}>
            <Label htmlFor={field.id} className={labelClass}>
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.id)}
              className="bg-input border-border focus:border-primary focus:ring-primary"
            />
            {renderValidationFeedback(error, aiValidation, isValidating)}
          </div>
        );
    }
  };

  const renderValidationFeedback = (error: any, aiValidation: any, isValidating: boolean) => {
    return (
      <div className="space-y-1">
        {error && (
          <p className="text-destructive text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error.message}
          </p>
        )}
        {schema.aiValidation?.enabled && (
          <div className="flex items-center gap-2">
            {isValidating ? (
              <div className="text-muted-foreground text-sm flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                AI validating...
              </div>
            ) : aiValidation ? (
              <div className={`text-sm flex items-center gap-1 ${aiValidation.isValid ? 'text-green-600' : 'text-orange-500'}`}>
                {aiValidation.isValid ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <Brain className="w-3 h-3" />
                )}
                {aiValidation.suggestion}
                <Badge variant="outline" className="text-xs">
                  {Math.round(aiValidation.confidence * 100)}%
                </Badge>
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm border-border/50 shadow-glow">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center justify-center gap-2">
          {schema.aiValidation?.enabled && (
            <Brain className="w-6 h-6 text-primary" />
          )}
          {schema.title}
        </CardTitle>
        {schema.description && (
          <CardDescription className="text-muted-foreground">
            {schema.description}
          </CardDescription>
        )}
        {schema.aiValidation?.enabled && (
          <Badge variant="secondary" className="mx-auto w-fit">
            AI-Enhanced Validation
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {schema.fields.map(renderField)}
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};