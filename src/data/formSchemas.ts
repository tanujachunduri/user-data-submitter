import { FormSchema } from "@/types/form";

export const contactFormSchema: FormSchema = {
  id: "contact-form",
  title: "Contact Information",
  description: "Please fill in your details below",
  submitLabel: "Submit Contact",
  fields: [
    {
      id: "firstName",
      type: "text",
      label: "First Name",
      placeholder: "Enter your first name",
      required: true,
      validation: {
        minLength: 2,
      },
      icon: "user",
    },
    {
      id: "lastName",
      type: "text",
      label: "Last Name",
      placeholder: "Enter your last name",
      required: true,
      validation: {
        minLength: 2,
      },
      icon: "user",
    },
    {
      id: "email",
      type: "email",
      label: "Email",
      placeholder: "Enter your email address",
      required: true,
      icon: "mail",
    },
  ],
};

export const surveyFormSchema: FormSchema = {
  id: "survey-form",
  title: "Customer Survey",
  description: "Help us improve our services",
  submitLabel: "Submit Survey",
  fields: [
    {
      id: "name",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
      validation: {
        minLength: 2,
      },
      icon: "user",
    },
    {
      id: "email",
      type: "email",
      label: "Email Address",
      placeholder: "your.email@example.com",
      required: true,
      icon: "mail",
    },
    {
      id: "age",
      type: "number",
      label: "Age",
      placeholder: "Enter your age",
      required: false,
      validation: {
        min: 13,
        max: 120,
      },
      icon: "hash",
    },
    {
      id: "experience",
      type: "select",
      label: "Experience Level",
      placeholder: "Select your experience",
      required: true,
      options: [
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" },
        { value: "expert", label: "Expert" },
      ],
    },
    {
      id: "birthDate",
      type: "date",
      label: "Date of Birth",
      placeholder: "Select your birth date",
      required: false,
      icon: "calendar",
    },
    {
      id: "feedback",
      type: "textarea",
      label: "Feedback",
      placeholder: "Share your thoughts and suggestions...",
      required: false,
      validation: {
        maxLength: 500,
      },
      icon: "message",
    },
    {
      id: "newsletter",
      type: "checkbox",
      label: "Newsletter Subscription",
      placeholder: "I would like to receive newsletter updates",
      required: false,
    },
  ],
};

export const jobApplicationSchema: FormSchema = {
  id: "job-application",
  title: "Job Application Form",
  description: "Apply for your dream position",
  submitLabel: "Submit Application",
  fields: [
    {
      id: "fullName",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
      validation: {
        minLength: 2,
      },
      icon: "user",
    },
    {
      id: "email",
      type: "email",
      label: "Email Address",
      placeholder: "your.email@example.com",
      required: true,
      icon: "mail",
    },
    {
      id: "phone",
      type: "text",
      label: "Phone Number",
      placeholder: "+1 (555) 123-4567",
      required: true,
      validation: {
        pattern: "^[+]?[1-9]?[0-9]{7,15}$",
      },
    },
    {
      id: "position",
      type: "select",
      label: "Position Applied For",
      placeholder: "Select a position",
      required: true,
      options: [
        { value: "frontend", label: "Frontend Developer" },
        { value: "backend", label: "Backend Developer" },
        { value: "fullstack", label: "Full Stack Developer" },
        { value: "designer", label: "UI/UX Designer" },
        { value: "manager", label: "Project Manager" },
      ],
    },
    {
      id: "experience",
      type: "number",
      label: "Years of Experience",
      placeholder: "Enter years of experience",
      required: true,
      validation: {
        min: 0,
        max: 50,
      },
      icon: "hash",
    },
    {
      id: "startDate",
      type: "date",
      label: "Available Start Date",
      placeholder: "Select your availability",
      required: true,
      icon: "calendar",
    },
    {
      id: "coverLetter",
      type: "textarea",
      label: "Cover Letter",
      placeholder: "Tell us why you're perfect for this role...",
      required: true,
      validation: {
        minLength: 50,
        maxLength: 1000,
      },
      icon: "message",
    },
    {
      id: "terms",
      type: "checkbox",
      label: "Terms and Conditions",
      placeholder: "I agree to the terms and conditions",
      required: true,
    },
  ],
};