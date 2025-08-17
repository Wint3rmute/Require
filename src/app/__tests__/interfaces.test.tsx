import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InterfacesPage from '../interfaces/page';

describe('Interfaces Page', () => {
  it('renders without crashing', () => {
    render(<InterfacesPage />);
    expect(screen.getByRole('heading', { name: /system interfaces/i })).toBeInTheDocument();
  });

  it('displays the interfaces list component', () => {
    render(<InterfacesPage />);
    
    // Check that the interfaces list is rendered
    expect(screen.getByText('System Interfaces')).toBeInTheDocument();
    expect(screen.getByText('UART')).toBeInTheDocument();
    expect(screen.getByText('USB-C')).toBeInTheDocument();
  });

  it('has proper page structure', () => {
    render(<InterfacesPage />);
    
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });

  it('renders communication interfaces', () => {
    render(<InterfacesPage />);
    
    // Verify key interfaces are present
    expect(screen.getByText('CAN Bus')).toBeInTheDocument();
    expect(screen.getByText('Ethernet')).toBeInTheDocument();
    expect(screen.getByText('Bluetooth')).toBeInTheDocument();
    expect(screen.getByText('HDMI')).toBeInTheDocument();
  });

  it('displays technical protocol descriptions', () => {
    render(<InterfacesPage />);
    
    // Check that technical descriptions are visible
    expect(screen.getByText(/controller area network/i)).toBeInTheDocument();
    expect(screen.getByText(/universal serial bus/i)).toBeInTheDocument();
  });
});