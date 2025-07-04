import { useState, useCallback } from 'react';
import { AIValidationResult } from '@/types/form';

// Mock AI validation service - in production, this would call an actual AI API
const mockAIValidation = async (field: string, value: string, context: any): Promise<AIValidationResult> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const validations: Record<string, (value: string) => AIValidationResult> = {
    email: (val) => ({
      field,
      isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      suggestion: val.includes('@') ? 'Consider adding a proper domain extension' : 'Email should contain @ symbol',
      confidence: 0.95,
      rule: 'email_format'
    }),
    firstName: (val) => ({
      field,
      isValid: val.length >= 2 && /^[a-zA-Z\s]+$/.test(val),
      suggestion: val.length < 2 ? 'Name should be at least 2 characters' : 'Name should only contain letters',
      confidence: 0.88,
      rule: 'name_validation'
    }),
    lastName: (val) => ({
      field,
      isValid: val.length >= 2 && /^[a-zA-Z\s]+$/.test(val),
      suggestion: val.length < 2 ? 'Last name should be at least 2 characters' : 'Last name should only contain letters',
      confidence: 0.88,
      rule: 'name_validation'
    }),
    phone: (val) => ({
      field,
      isValid: /^\+?[\d\s\-()]{10,}$/.test(val),
      suggestion: 'Phone number should be at least 10 digits with optional country code',
      confidence: 0.82,
      rule: 'phone_validation'
    })
  };

  const validator = validations[field] || (() => ({
    field,
    isValid: true,
    suggestion: 'No specific validation rules for this field',
    confidence: 0.5,
    rule: 'generic'
  }));

  return validator(value);
};

export const useAIValidation = () => {
  const [validationResults, setValidationResults] = useState<Record<string, AIValidationResult>>({});
  const [isValidating, setIsValidating] = useState<Record<string, boolean>>({});

  const validateField = useCallback(async (field: string, value: string, context?: any) => {
    if (!value.trim()) {
      setValidationResults(prev => ({ ...prev, [field]: undefined }));
      return;
    }

    setIsValidating(prev => ({ ...prev, [field]: true }));
    
    try {
      const result = await mockAIValidation(field, value, context);
      setValidationResults(prev => ({ ...prev, [field]: result }));
    } catch (error) {
      console.error('AI validation error:', error);
    } finally {
      setIsValidating(prev => ({ ...prev, [field]: false }));
    }
  }, []);

  const getFieldValidation = useCallback((field: string) => {
    return validationResults[field];
  }, [validationResults]);

  const isFieldValidating = useCallback((field: string) => {
    return Boolean(isValidating[field]);
  }, [isValidating]);

  return {
    validateField,
    getFieldValidation,
    isFieldValidating,
    validationResults
  };
};