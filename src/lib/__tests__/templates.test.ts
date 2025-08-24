/**
 * Template Registry Tests
 */

import { getAllTemplates, getTemplateById, AVAILABLE_TEMPLATES } from '../templates';

describe('Template Registry', () => {
  describe('getAllTemplates', () => {
    it('should return all available templates', () => {
      const templates = getAllTemplates();
      expect(templates).toBeDefined();
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should include car template', () => {
      const templates = getAllTemplates();
      const carTemplate = templates.find(t => t.id === 'car');
      expect(carTemplate).toBeDefined();
      expect(carTemplate?.name).toBe('Car Template');
      expect(carTemplate?.category).toBe('Automotive');
    });

    it('should return templates with required properties', () => {
      const templates = getAllTemplates();
      templates.forEach(template => {
        expect(template.id).toBeDefined();
        expect(template.name).toBeDefined();
        expect(template.description).toBeDefined();
        expect(typeof template.createProject).toBe('function');
      });
    });
  });

  describe('getTemplateById', () => {
    it('should return car template by id', () => {
      const template = getTemplateById('car');
      expect(template).toBeDefined();
      expect(template?.id).toBe('car');
      expect(template?.name).toBe('Car Template');
    });

    it('should return undefined for non-existent template', () => {
      const template = getTemplateById('non-existent');
      expect(template).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const template = getTemplateById('');
      expect(template).toBeUndefined();
    });
  });

  describe('Template Creation', () => {
    it('should create project from car template', () => {
      const template = getTemplateById('car');
      expect(template).toBeDefined();
      
      const project = template!.createProject('Test Car', 'Test Description');
      expect(project).toBeDefined();
      expect(project.name).toBe('Test Car');
      expect(project.description).toBe('Test Description');
      expect(project.components.length).toBeGreaterThan(0);
      
      // Should have root system component
      const rootComponent = project.components.find(c => c.type === 'system');
      expect(rootComponent).toBeDefined();
      expect(rootComponent?.name).toBe('Test Car System');
    });

    it('should create project from car template without description', () => {
      const template = getTemplateById('car');
      const project = template!.createProject('Test Car');
      expect(project).toBeDefined();
      expect(project.name).toBe('Test Car');
      expect(project.description).toBeUndefined();
    });
  });

  describe('Registry Consistency', () => {
    it('should have consistent data between direct access and functions', () => {
      const directTemplates = AVAILABLE_TEMPLATES;
      const functionalTemplates = getAllTemplates();
      
      expect(functionalTemplates).toEqual(directTemplates);
    });

    it('should have all templates accessible by id', () => {
      const templates = getAllTemplates();
      templates.forEach(template => {
        const foundTemplate = getTemplateById(template.id);
        expect(foundTemplate).toEqual(template);
      });
    });
  });
});