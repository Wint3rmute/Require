import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubsystemsList from '../subsystems_list';
import { type Subsystem } from '../subsystems_list';
import React from 'react';
import BuildIcon from '@mui/icons-material/Build';
import ComputerIcon from '@mui/icons-material/Computer';

// Create mock data for the tests
const mockIconMap = {
  build: <BuildIcon />,
  computer: <ComputerIcon />,
};

const mockSubsystems: Subsystem[] = [
  { id: '1', name: 'Test Subsystem 1', description: 'Description for test 1', icon: 'build' },
  { id: '2', name: 'Test Subsystem 2', description: 'Description for test 2', icon: 'computer' },
];

describe('SubsystemsList', () => {
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnDelete.mockClear();
  });

  it('renders the title and the correct number of subsystems', () => {
    render(<SubsystemsList subsystems={mockSubsystems} iconMap={mockIconMap} onDelete={mockOnDelete} />);
    expect(screen.getByRole('heading', { name: /subsystems/i })).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(mockSubsystems.length);
  });

  it('displays the names and descriptions', () => {
    render(<SubsystemsList subsystems={mockSubsystems} iconMap={mockIconMap} onDelete={mockOnDelete} />);
    expect(screen.getByText('Test Subsystem 1')).toBeInTheDocument();
    expect(screen.getByText('Description for test 1')).toBeInTheDocument();
    expect(screen.getByText('Test Subsystem 2')).toBeInTheDocument();
    expect(screen.getByText('Description for test 2')).toBeInTheDocument();
  });

  it('calls onDelete with the correct ID when the delete button is clicked', () => {
    render(<SubsystemsList subsystems={mockSubsystems} iconMap={mockIconMap} onDelete={mockOnDelete} />);
    const deleteButtons = screen.getAllByLabelText('delete');
    fireEvent.click(deleteButtons[0]);
    expect(mockOnDelete).toHaveBeenCalledWith(mockSubsystems[0].id);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('renders the correct icons', () => {
    render(<SubsystemsList subsystems={mockSubsystems} iconMap={mockIconMap} onDelete={mockOnDelete} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0].querySelector('[data-testid="BuildIcon"]')).toBeInTheDocument();
    expect(listItems[1].querySelector('[data-testid="ComputerIcon"]')).toBeInTheDocument();
  });

  it('renders a fallback icon if the icon key is not in the map', () => {
    const subsystemsWithFallback = [...mockSubsystems, { id: '3', name: 'Fallback', description: 'desc', icon: 'invalid' }];
    render(<SubsystemsList subsystems={subsystemsWithFallback} iconMap={mockIconMap} onDelete={mockOnDelete} />);
    const fallbackItem = screen.getByText('Fallback').closest('li');
    expect(fallbackItem!.querySelector('[data-testid="SettingsIcon"]')).toBeInTheDocument();
  });
});
