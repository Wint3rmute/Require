'use client';

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Project } from '@/lib/models';
import { Box, Typography } from '@mui/material';

interface MermaidDiagramProps {
  project: Project;
}

/**
 * Convert project component hierarchy to Mermaid flowchart syntax
 */
function generateMermaidSyntax(project: Project): string {
  const components = project.components;
  
  if (components.length === 0) {
    return `flowchart TD
    A[No Components]
    style A fill:#f9f9f9,stroke:#ddd`;
  }

  // Build the flowchart syntax
  let mermaidSyntax = 'flowchart TD\n';
  
  // First, define all nodes
  components.forEach(component => {
    const nodeId = component.id.replace(/-/g, '_'); // Mermaid doesn't like hyphens in IDs
    const nodeLabel = component.name;
    
    if (component.type === 'system') {
      mermaidSyntax += `    ${nodeId}[["${nodeLabel}"]]\n`;
    } else {
      mermaidSyntax += `    ${nodeId}["${nodeLabel}"]\n`;
    }
  });

  // Add connections based on parent-child relationships
  components.forEach(component => {
    if (component.parentId) {
      const parentId = component.parentId.replace(/-/g, '_');
      const childId = component.id.replace(/-/g, '_');
      mermaidSyntax += `    ${parentId} --> ${childId}\n`;
    }
  });

  // Add styling
  mermaidSyntax += '\n    %% Styling\n';
  components.forEach(component => {
    const nodeId = component.id.replace(/-/g, '_');
    if (component.type === 'system') {
      mermaidSyntax += `    style ${nodeId} fill:#e3f2fd,stroke:#1976d2,stroke-width:2px\n`;
    } else {
      mermaidSyntax += `    style ${nodeId} fill:#f3e5f5,stroke:#7b1fa2\n`;
    }
  });

  return mermaidSyntax;
}

/**
 * Mermaid Diagram Component
 * 
 * Renders a Mermaid flowchart diagram showing the component hierarchy
 */
export default function MermaidDiagram({ project }: MermaidDiagramProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = React.useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mermaidRef.current) return;

    // Initialize Mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      }
    });

    const renderDiagram = async () => {
      if (!mermaidRef.current) return;

      const mermaidSyntax = generateMermaidSyntax(project);
      
      try {
        // Clear previous content
        mermaidRef.current.innerHTML = '';
        
        // Generate a unique ID for this diagram
        const diagramId = `mermaid-${Date.now()}`;
        
        // Render the diagram
        const { svg } = await mermaid.render(diagramId, mermaidSyntax);
        mermaidRef.current.innerHTML = svg;
      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        mermaidRef.current.innerHTML = '<p>Error rendering diagram</p>';
      }
    };

    renderDiagram();
  }, [project, isClient]);

  if (!isClient) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Loading diagram...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', 
      overflow: 'auto',
      textAlign: 'center',
      '& svg': {
        maxWidth: '100%',
        height: 'auto'
      }
    }}>
      <div ref={mermaidRef} />
    </Box>
  );
}