export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };
  options?: { value: string; label: string }[];
  aiSuggestions?: {
    validationType: string;
    suggestion: string;
    confidence: number;
  }[];
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  aiValidation?: {
    enabled: boolean;
    rules: string[];
  };
}

export interface AIValidationResult {
  field: string;
  isValid: boolean;
  suggestion?: string;
  confidence: number;
  rule: string;
}