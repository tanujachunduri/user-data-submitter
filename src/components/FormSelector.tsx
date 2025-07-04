import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicFormRenderer } from "@/components/DynamicFormRenderer";
import { contactFormSchema, surveyFormSchema, jobApplicationSchema } from "@/data/formSchemas";
import { FormSchema } from "@/types/form";

const formOptions = [
  {
    schema: contactFormSchema,
    title: "Contact Form",
    description: "Simple contact information form",
  },
  {
    schema: surveyFormSchema,
    title: "Customer Survey",
    description: "Comprehensive survey with multiple field types",
  },
  {
    schema: jobApplicationSchema,
    title: "Job Application",
    description: "Professional job application form",
  },
];

interface FormSelectorProps {
  onShowBuilder?: () => void;
}

export const FormSelector = ({ onShowBuilder }: FormSelectorProps) => {
  const [selectedSchema, setSelectedSchema] = useState<FormSchema | null>(null);

  if (selectedSchema) {
    return (
      <div>
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            onClick={() => setSelectedSchema(null)}
            className="bg-card/80 backdrop-blur-sm"
          >
            ← Back to Forms
          </Button>
        </div>
        <DynamicFormRenderer 
          schema={selectedSchema}
          onSubmit={(data) => {
            console.log("Form submitted with data:", data);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Smart Dynamic Form System
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            Choose a template or create your own intelligent form with AI validation
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={onShowBuilder}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              🧠 Create Smart Form
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {formOptions.map((option) => (
            <Card 
              key={option.schema.id}
              className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-glow transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedSchema(option.schema)}
            >
              <CardHeader>
                <CardTitle className="text-xl text-foreground">
                  {option.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {option.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Fields: {option.schema.fields.length}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {option.schema.fields.slice(0, 4).map((field) => (
                      <span
                        key={field.id}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                      >
                        {field.type}
                      </span>
                    ))}
                    {option.schema.fields.length > 4 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                        +{option.schema.fields.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
                <Button className="w-full mt-4 bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  Try This Form
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};