import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubsystemsList from '../subsystems_list';

describe('SubsystemsList', () => {
  it('renders without crashing', () => {
    render(<SubsystemsList />);
    expect(screen.getByRole('heading', { name: /system subsystems/i })).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    render(<SubsystemsList />);
    expect(screen.getByText('System Subsystems')).toBeInTheDocument();
  });

  it('renders all 10 subsystems', () => {
    render(<SubsystemsList />);
    const listItems = screen.getAllByRole('button');
    expect(listItems).toHaveLength(10);
  });

  it('displays expected subsystem names', () => {
    render(<SubsystemsList />);
    
    const expectedSubsystems = [
      'Engine',
      'Processing Unit', 
      'Tires',
      'Power System',
      'Cooling System',
      'Memory Storage',
      'Security Module',
      'Storage System',
      'Communication',
      'Control System'
    ];

    expectedSubsystems.forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('displays subsystem descriptions', () => {
    render(<SubsystemsList />);
    
    expect(screen.getByText(/primary propulsion system/i)).toBeInTheDocument();
    expect(screen.getByText(/central computational core/i)).toBeInTheDocument();
    expect(screen.getByText(/ground contact interface/i)).toBeInTheDocument();
  });

  it('renders icons for each subsystem', () => {
    render(<SubsystemsList />);
    const icons = screen.getAllByTestId(/.*icon$/i);
    expect(icons.length).toBeGreaterThan(0);
  });

  it('has clickable subsystem items', () => {
    render(<SubsystemsList />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeEnabled();
    });
  });

  it('applies correct styling structure', () => {
    render(<SubsystemsList />);
    const container = screen.getByRole('heading').parentElement;
    expect(container).toHaveStyle({ width: '100%' });
  });
});