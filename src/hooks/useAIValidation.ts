import { useState, useCallback } from 'react';
import { FormField } from '@/types/form';

interface AIValidationSuggestion {
  field: string;
  suggestion: string;
  severity: 'error' | 'warning' | 'info';
}

interface AIValidationResponse {
  isValid: boolean;
  suggestions: AIValidationSuggestion[];
  confidence: number;
}

export const useAIValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [suggestions, setSuggestions] = useState<AIValidationSuggestion[]>([]);

  const validateWithAI = useCallback(async (
    formData: Record<string, any>,
    formFields: FormField[]
  ): Promise<AIValidationResponse> => {
    setIsValidating(true);
    
    // Simulate AI validation API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const validationResults: AIValidationSuggestion[] = [];
    
    // AI-driven validation logic simulation
    formFields.forEach(field => {
      const value = formData[field.id];
      
      switch (field.type) {
        case 'email':
          if (value && !value.includes('@')) {
            validationResults.push({
              field: field.id,
              suggestion: 'Email format appears invalid. Consider using a proper email format.',
              severity: 'error'
            });
          }
          break;
          
        case 'text':
          if (field.id.toLowerCase().includes('name') && value) {
            if (value.length < 2) {
              validationResults.push({
                field: field.id,
                suggestion: 'Name seems too short. Consider adding more characters.',
                severity: 'warning'
              });
            }
            if (!/^[a-zA-Z\s]+$/.test(value)) {
              validationResults.push({
                field: field.id,
                suggestion: 'Name contains special characters. Consider using only letters.',
                severity: 'warning'
              });
            }
          }
          break;
          
        case 'textarea':
          if (value && value.length > 0) {
            if (value.length < 10) {
              validationResults.push({
                field: field.id,
                suggestion: 'Content seems brief. Consider adding more detail for better context.',
                severity: 'info'
              });
            }
          }
          break;
          
        case 'number':
          if (field.id.toLowerCase().includes('age') && value) {
            if (value < 13 || value > 120) {
              validationResults.push({
                field: field.id,
                suggestion: 'Age value seems unusual. Please verify the entered age.',
                severity: 'warning'
              });
            }
          }
          break;
      }
    });
    
    setSuggestions(validationResults);
    setIsValidating(false);
    
    return {
      isValid: validationResults.filter(s => s.severity === 'error').length === 0,
      suggestions: validationResults,
      confidence: Math.random() * 0.3 + 0.7 // Simulate 70-100% confidence
    };
  }, []);

  const generateFieldSuggestion = useCallback(async (
    fieldType: string,
    context: string
  ): Promise<FormField> => {
    // Simulate AI field generation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const suggestions: Record<string, Partial<FormField>> = {
      'personal_info': {
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
        validation: { minLength: 2 },
        icon: 'user'
      },
      'contact': {
        type: 'email',
        label: 'Email Address',
        placeholder: 'your.email@example.com',
        required: true,
        icon: 'mail'
      },
      'feedback': {
        type: 'textarea',
        label: 'Comments',
        placeholder: 'Share your thoughts...',
        required: false,
        validation: { maxLength: 500 },
        icon: 'message'
      }
    };
    
    const suggestion = suggestions[context] || suggestions['personal_info'];
    
    return {
      id: `ai_field_${Date.now()}`,
      ...suggestion
    } as FormField;
  }, []);

  return {
    validateWithAI,
    generateFieldSuggestion,
    isValidating,
    suggestions,
    setSuggestions
  };
};