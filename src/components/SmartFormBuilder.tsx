import { useState } from 'react';
import { Plus, Trash2, Brain, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { FormField, FormSchema } from '@/types/form';

interface SmartFormBuilderProps {
  onFormGenerated: (schema: FormSchema) => void;
  currentSchema?: FormSchema;
}

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' }
];

export const SmartFormBuilder = ({ onFormGenerated, currentSchema }: SmartFormBuilderProps) => {
  const [formTitle, setFormTitle] = useState(currentSchema?.title || '');
  const [formDescription, setFormDescription] = useState(currentSchema?.description || '');
  const [fields, setFields] = useState<FormField[]>(currentSchema?.fields || []);
  const [aiValidationEnabled, setAiValidationEnabled] = useState<boolean>(currentSchema?.aiValidation?.enabled ?? true);

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: '',
      required: false,
      aiSuggestions: []
    };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const updatedFields = fields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    );
    setFields(updatedFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const generateAISuggestions = (field: FormField) => {
    // Mock AI suggestions based on field type and label
    const suggestions = {
      email: [
        { validationType: 'format', suggestion: 'Validate email format with regex', confidence: 0.95 },
        { validationType: 'domain', suggestion: 'Check for common domain typos', confidence: 0.75 }
      ],
      text: [
        { validationType: 'length', suggestion: 'Set minimum length of 2 characters', confidence: 0.8 },
        { validationType: 'pattern', suggestion: 'Use alphabetic characters only for names', confidence: 0.7 }
      ],
      number: [
        { validationType: 'range', suggestion: 'Set reasonable min/max values', confidence: 0.85 },
        { validationType: 'format', suggestion: 'Validate numeric input only', confidence: 0.9 }
      ]
    };

    const fieldSuggestions = suggestions[field.type as keyof typeof suggestions] || [];
    updateField(fields.indexOf(field), { aiSuggestions: fieldSuggestions });
  };

  const generateForm = () => {
    const schema: FormSchema = {
      id: `form_${Date.now()}`,
      title: formTitle,
      description: formDescription,
      fields,
      aiValidation: {
        enabled: aiValidationEnabled,
        rules: ['format', 'length', 'pattern', 'custom']
      }
    };
    onFormGenerated(schema);
  };

  return (
    <Card className="w-full max-w-4xl bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          Smart Form Builder
        </CardTitle>
        <CardDescription>
          Create dynamic forms with AI-powered validation suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="form-title">Form Title</Label>
            <Input
              id="form-title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Enter form title"
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-validation" className="flex items-center gap-2">
              AI Validation
              <Badge variant="secondary" className="text-xs">SMART</Badge>
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="ai-validation"
                checked={aiValidationEnabled}
                onCheckedChange={(checked: boolean) => setAiValidationEnabled(checked)}
              />
              <span className="text-sm text-muted-foreground">
                Enable AI-powered validation
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="form-description">Form Description</Label>
          <Textarea
            id="form-description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Describe what this form is for"
            className="bg-input border-border"
          />
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Form Fields</h3>
            <Button onClick={addField} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id} className="p-4 bg-muted/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Field Type</Label>
                  <Select
                    value={field.type}
                    onValueChange={(value) => updateField(index, { type: value as FormField['type'] })}
                  >
                    <SelectTrigger className="bg-input">
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

                <div className="space-y-2">
                  <Label>Field Label</Label>
                  <Input
                    value={field.label}
                    onChange={(e) => updateField(index, { label: e.target.value })}
                    placeholder="Enter field label"
                    className="bg-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Placeholder</Label>
                  <Input
                    value={field.placeholder || ''}
                    onChange={(e) => updateField(index, { placeholder: e.target.value })}
                    placeholder="Enter placeholder text"
                    className="bg-input"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={field.required || false}
                      onCheckedChange={(checked: boolean) => updateField(index, { required: checked })}
                    />
                    <Label className="text-sm">Required</Label>
                  </div>
                  <Button
                    onClick={() => generateAISuggestions(field)}
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => removeField(index)}
                    variant="destructive"
                    size="sm"
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* AI Suggestions */}
              {field.aiSuggestions && field.aiSuggestions.length > 0 && (
                <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    AI Validation Suggestions
                  </h4>
                  <div className="space-y-2">
                    {field.aiSuggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span>{suggestion.suggestion}</span>
                        <Badge variant="secondary">
                          {Math.round(suggestion.confidence * 100)}% confidence
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Generate Button */}
        <div className="flex justify-end">
          <Button 
            onClick={generateForm}
            disabled={!formTitle || fields.length === 0}
            className="bg-gradient-primary hover:shadow-glow"
          >
            Generate Smart Form
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};