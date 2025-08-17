import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ButtonAppBar from '../navbar';

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }) => {
    return <a href={href} {...props}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('ButtonAppBar', () => {
  it('renders without crashing', () => {
    render(<ButtonAppBar />);
    expect(screen.getByText('Require')).toBeInTheDocument();
  });

  it('displays the application title', () => {
    render(<ButtonAppBar />);
    const title = screen.getByText('Require');
    expect(title).toBeInTheDocument();
    expect(title.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders all navigation links', () => {
    render(<ButtonAppBar />);
    
    expect(screen.getByText('Subsystems')).toBeInTheDocument();
    expect(screen.getByText('Interfaces')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('has correct link destinations', () => {
    render(<ButtonAppBar />);
    
    const subsystemsLink = screen.getByText('Subsystems').closest('a');
    const interfacesLink = screen.getByText('Interfaces').closest('a');
    const homeLink = screen.getByText('Require').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(subsystemsLink).toHaveAttribute('href', '/subsystems');
    expect(interfacesLink).toHaveAttribute('href', '/interfaces');
  });

  it('renders navigation links as clickable elements', () => {
    render(<ButtonAppBar />);
    
    const subsystemsLink = screen.getByText('Subsystems');
    const interfacesLink = screen.getByText('Interfaces');
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    expect(subsystemsLink).toBeInTheDocument();
    expect(interfacesLink).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it('has proper Material-UI AppBar structure', () => {
    render(<ButtonAppBar />);
    
    // Should have AppBar role (banner)
    const appBar = screen.getByRole('banner');
    expect(appBar).toBeInTheDocument();
  });

  it('renders menu icon button and login button', () => {
    render(<ButtonAppBar />);
    
    // Should have menu icon button and login button
    const iconButtons = screen.getAllByRole('button');
    expect(iconButtons.length).toBe(2); // Menu icon button and Login button
    
    // Check for menu button specifically
    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
  });
});