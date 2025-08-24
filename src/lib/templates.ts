/**
 * Template Registry for Project Creation
 * 
 * This file contains template definitions and a registry system
 * for creating projects with predefined component structures.
 */

import { Project } from './models';
import { createCarTemplate } from './car_template';

export interface Template {
  id: string;
  name: string;
  description: string;
  category?: string;
  createProject: (name: string, description?: string) => Project;
}

/**
 * Registry of available templates
 */
export const AVAILABLE_TEMPLATES: Template[] = [
  {
    id: 'car',
    name: 'Car Template',
    description: 'Creates a project with automotive components including Engine, Transmission, Electrical System, Braking, Steering, Infotainment, and Body Control modules to help you explore the system modeling features.',
    category: 'Automotive',
    createProject: createCarTemplate
  }
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): Template | undefined {
  return AVAILABLE_TEMPLATES.find(template => template.id === id);
}

/**
 * Get all available templates
 */
export function getAllTemplates(): Template[] {
  return AVAILABLE_TEMPLATES;
}