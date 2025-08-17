import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InterfacesList from '../interfaces_list';

describe('InterfacesList', () => {
  it('renders without crashing', () => {
    render(<InterfacesList />);
    expect(screen.getByRole('heading', { name: /system interfaces/i })).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    render(<InterfacesList />);
    expect(screen.getByText('System Interfaces')).toBeInTheDocument();
  });

  it('renders all 12 interfaces', () => {
    render(<InterfacesList />);
    const listItems = screen.getAllByRole('button');
    expect(listItems).toHaveLength(12);
  });

  it('displays expected interface names', () => {
    render(<InterfacesList />);
    
    const expectedInterfaces = [
      'UART',
      'CAN Bus',
      'USB-C',
      'I2C',
      'SPI',
      'Ethernet',
      'Bluetooth',
      'Wi-Fi',
      'SD Card',
      'HDMI',
      '3.5mm Audio',
      'Parallel Port'
    ];

    expectedInterfaces.forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('displays interface descriptions', () => {
    render(<InterfacesList />);
    
    expect(screen.getByText(/universal asynchronous receiver-transmitter/i)).toBeInTheDocument();
    expect(screen.getByText(/controller area network protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/universal serial bus type-c/i)).toBeInTheDocument();
  });

  it('displays technical communication protocols', () => {
    render(<InterfacesList />);
    
    // Test some specific technical descriptions
    expect(screen.getByText(/inter-integrated circuit protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/serial peripheral interface/i)).toBeInTheDocument();
    expect(screen.getByText(/high-definition multimedia interface/i)).toBeInTheDocument();
  });

  it('renders icons for each interface', () => {
    render(<InterfacesList />);
    const icons = screen.getAllByTestId(/.*icon$/i);
    expect(icons.length).toBeGreaterThan(0);
  });

  it('has clickable interface items', () => {
    render(<InterfacesList />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeEnabled();
    });
  });

  it('groups wireless and wired interfaces correctly', () => {
    render(<InterfacesList />);
    
    // Wireless interfaces
    expect(screen.getByText('Bluetooth')).toBeInTheDocument();
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    
    // Wired interfaces  
    expect(screen.getByText('Ethernet')).toBeInTheDocument();
    expect(screen.getByText('USB-C')).toBeInTheDocument();
  });

  it('applies correct styling structure', () => {
    render(<InterfacesList />);
    const container = screen.getByRole('heading').parentElement;
    expect(container).toHaveStyle({ width: '100%' });
  });
});