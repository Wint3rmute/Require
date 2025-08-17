import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InterfacesList from '../interfaces_list';
import { type Interface } from '../interfaces_list';
import React from 'react';
import CableIcon from '@mui/icons-material/Cable';
import UsbIcon from '@mui/icons-material/Usb';

// Create mock data that matches the component's expected props
const mockIconMap = {
  cable: <CableIcon />,
  usb: <UsbIcon />,
};

const mockInterfaces: Interface[] = [
  { id: '1', name: 'Test Interface 1', description: 'Description for test 1', icon: 'cable' },
  { id: '2', name: 'Test Interface 2', description: 'Description for test 2', icon: 'usb' },
  { id: '3', name: 'Another Interface', description: 'Another description', icon: 'cable' },
];

describe('InterfacesList', () => {
  it('renders without crashing and displays the title', () => {
    render(<InterfacesList interfaces={mockInterfaces} iconMap={mockIconMap} />);
    expect(screen.getByRole('heading', { name: /system interfaces/i })).toBeInTheDocument();
  });

  it('renders the correct number of interfaces', () => {
    render(<InterfacesList interfaces={mockInterfaces} iconMap={mockIconMap} />);
    const listItems = screen.getAllByRole('listitem'); // MUI ListItem role
    expect(listItems).toHaveLength(mockInterfaces.length);
  });

  it('displays the names and descriptions of the interfaces', () => {
    render(<InterfacesList interfaces={mockInterfaces} iconMap={mockIconMap} />);
    
    // Check for the first mock interface
    expect(screen.getByText('Test Interface 1')).toBeInTheDocument();
    expect(screen.getByText('Description for test 1')).toBeInTheDocument();

    // Check for the second mock interface
    expect(screen.getByText('Test Interface 2')).toBeInTheDocument();
    expect(screen.getByText('Description for test 2')).toBeInTheDocument();
  });

  it('renders the correct icons for each interface', () => {
    render(<InterfacesList interfaces={mockInterfaces} iconMap={mockIconMap} />);
    // The icons themselves don't have accessible names, but we can check for their presence
    // by looking for the parent ListItemIcon component.
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0].querySelector('[data-testid="CableIcon"]')).toBeInTheDocument();
    expect(listItems[1].querySelector('[data-testid="UsbIcon"]')).toBeInTheDocument();
  });

  it('has clickable interface items', () => {
    render(<InterfacesList interfaces={mockInterfaces} iconMap={mockIconMap} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeEnabled();
    });
    expect(buttons.length).toBe(mockInterfaces.length);
  });

  it('renders the default fallback icon when an icon key is not in the map', () => {
    const interfacesWithFallback = [
      ...mockInterfaces,
      { id: '4', name: 'Fallback Interface', description: 'This one has a bad icon key', icon: 'non-existent-icon' }
    ];
    render(<InterfacesList interfaces={interfacesWithFallback} iconMap={mockIconMap} />);
  
    const fallbackItem = screen.getByText('Fallback Interface').closest('li');
    expect(fallbackItem).not.toBeNull();
    // The default icon is CableIcon
    expect(fallbackItem!.querySelector('[data-testid="CableIcon"]')).toBeInTheDocument();
  });
});
