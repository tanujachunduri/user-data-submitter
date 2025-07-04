import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Wand2, Brain } from 'lucide-react';
import { FormField, FormSchema } from '@/types/form';
import { useAIValidation } from '@/hooks/useAIValidation';
import { useToast } from '@/hooks/use-toast';

interface SmartFormBuilderProps {
  onFormGenerated: (schema: FormSchema) => void;
  onBack: () => void;
}

export const SmartFormBuilder = ({ onFormGenerated, onBack }: SmartFormBuilderProps) => {
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { generateFieldSuggestion } = useAIValidation();
  const { toast } = useToast();

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Select Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
  ];

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: 'New Field',
      placeholder: 'Enter value',
      required: false,
    };
    setFields([...fields, newField]);
  };

  const removeField = (fieldId: string) => {
    setFields(fields.filter(field => field.id !== fieldId));
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const generateAIField = async (context: string) => {
    setIsGenerating(true);
    try {
      const suggestedField = await generateFieldSuggestion('text', context);
      setFields([...fields, suggestedField]);
      toast({
        title: 'AI Field Generated',
        description: 'A new field has been suggested based on the context.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate AI field suggestion.',
        variant: 'destructive',
      });
    }
    setIsGenerating(false);
  };

  const generateForm = () => {
    if (!formTitle.trim()) {
      toast({
        title: 'Missing Title',
        description: 'Please provide a form title.',
        variant: 'destructive',
      });
      return;
    }

    if (fields.length === 0) {
      toast({
        title: 'No Fields',
        description: 'Please add at least one field to the form.',
        variant: 'destructive',
      });
      return;
    }

    const schema: FormSchema = {
      id: `custom_form_${Date.now()}`,
      title: formTitle,
      description: formDescription,
      fields: fields,
      submitLabel: 'Submit Form',
    };

    onFormGenerated(schema);
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Smart Form Builder
            </h1>
            <p className="text-muted-foreground">
              Create intelligent forms with AI-powered suggestions
            </p>
          </div>
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Configuration */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Form Configuration
              </CardTitle>
              <CardDescription>
                Set up your form details and structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Form Title</Label>
                <Input
                  id="title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter form title"
                  className="bg-input border-border"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe your form purpose"
                  className="bg-input border-border"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={addField} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
                <Button
                  variant="outline"
                  onClick={() => generateAIField('personal_info')}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'AI Suggest'}
                </Button>
              </div>

              <Button 
                onClick={generateForm} 
                className="w-full bg-gradient-primary hover:shadow-glow"
                disabled={!formTitle.trim() || fields.length === 0}
              >
                Generate Smart Form
              </Button>
            </CardContent>
          </Card>

          {/* Field Editor */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Form Fields ({fields.length})</CardTitle>
              <CardDescription>
                Configure your form fields with intelligent validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {fields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No fields added yet</p>
                    <p className="text-sm">Click "Add Field" to get started</p>
                  </div>
                ) : (
                  fields.map((field) => (
                    <Card key={field.id} className="border border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="secondary">{field.type}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeField(field.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <Label>Field Label</Label>
                            <Input
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              className="bg-input border-border"
                            />
                          </div>
                          
                          <div>
                            <Label>Field Type</Label>
                            <Select 
                              value={field.type} 
                              onValueChange={(value) => updateField(field.id, { type: value as any })}
                            >
                              <SelectTrigger className="bg-input border-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Placeholder</Label>
                            <Input
                              value={field.placeholder || ''}
                              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                              className="bg-input border-border"
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`required-${field.id}`}
                              checked={field.required || false}
                              onCheckedChange={(checked) => updateField(field.id, { required: !!checked })}
                            />
                            <Label htmlFor={`required-${field.id}`}>Required field</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};