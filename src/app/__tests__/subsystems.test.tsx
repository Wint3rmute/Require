import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubsystemsPage from '../subsystems/page';

describe('Subsystems Page', () => {
  it('renders without crashing', () => {
    render(<SubsystemsPage />);
    expect(screen.getByRole('heading', { name: /system subsystems/i })).toBeInTheDocument();
  });

  it('displays the subsystems list component', () => {
    render(<SubsystemsPage />);
    
    // Check that the subsystems list is rendered
    expect(screen.getByText('System Subsystems')).toBeInTheDocument();
    expect(screen.getByText('Engine')).toBeInTheDocument();
    expect(screen.getByText('Processing Unit')).toBeInTheDocument();
  });

  it('has proper page structure', () => {
    render(<SubsystemsPage />);
    
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });

  it('renders all expected subsystems from the list', () => {
    render(<SubsystemsPage />);
    
    // Verify key subsystems are present
    expect(screen.getByText('Tires')).toBeInTheDocument();
    expect(screen.getByText('Power System')).toBeInTheDocument();
    expect(screen.getByText('Control System')).toBeInTheDocument();
  });
});