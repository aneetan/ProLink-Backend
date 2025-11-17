export interface RequirementFormData {
  title: string;
  description: string;
  workType: 'remote' | 'onsite';
  minimumBudget: number;
  maximumBudget: number;
  category: string;
  timeline: string;
  skills: string[];
  attachment: '';
  urgency: 'low' | 'medium' | 'high';
}