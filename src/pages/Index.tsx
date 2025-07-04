import { useState } from "react";
import { FormSelector } from "@/components/FormSelector";
import { SmartFormBuilder } from "@/components/SmartFormBuilder";
import { DynamicFormRenderer } from "@/components/DynamicFormRenderer";
import { FormSchema } from "@/types/form";

const Index = () => {
  const [currentView, setCurrentView] = useState<'selector' | 'builder' | 'renderer'>('selector');
  const [selectedSchema, setSelectedSchema] = useState<FormSchema | null>(null);

  const handleFormGenerated = (schema: FormSchema) => {
    setSelectedSchema(schema);
    setCurrentView('renderer');
  };

  const handleBackToSelector = () => {
    setCurrentView('selector');
    setSelectedSchema(null);
  };

  const handleShowBuilder = () => {
    setCurrentView('builder');
  };

  if (currentView === 'builder') {
    return (
      <SmartFormBuilder 
        onFormGenerated={handleFormGenerated}
        onBack={handleBackToSelector}
      />
    );
  }

  if (currentView === 'renderer' && selectedSchema) {
    return (
      <DynamicFormRenderer 
        schema={selectedSchema}
        onSubmit={(data) => {
          console.log("Form submitted with data:", data);
        }}
      />
    );
  }

  return (
    <FormSelector 
      onShowBuilder={handleShowBuilder}
    />
  );
};

export default Index;
