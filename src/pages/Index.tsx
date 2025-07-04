import { useState } from 'react';
import { SmartFormBuilder } from '@/components/SmartFormBuilder';
import { DynamicFormRenderer } from '@/components/DynamicFormRenderer';
import { FormSchema } from '@/types/form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Index = () => {
  const [currentSchema, setCurrentSchema] = useState<FormSchema | null>(null);
  const [mode, setMode] = useState<'builder' | 'preview'>('builder');

  const handleFormGenerated = (schema: FormSchema) => {
    setCurrentSchema(schema);
    setMode('preview');
  };

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {mode === 'preview' && currentSchema ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setMode('builder')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Builder
              </Button>
              <h2 className="text-xl font-semibold text-foreground">Form Preview</h2>
            </div>
            <div className="flex justify-center">
              <DynamicFormRenderer 
                schema={currentSchema} 
                onSubmit={handleFormSubmit}
              />
            </div>
          </div>
        ) : (
          <SmartFormBuilder 
            onFormGenerated={handleFormGenerated}
            currentSchema={currentSchema || undefined}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
