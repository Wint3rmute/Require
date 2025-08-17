import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InterfacesPage from '../interfaces/page';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Interfaces Page with localStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('renders the form and the default list of interfaces', () => {
    render(<InterfacesPage />);

    // Check for the form
    expect(screen.getByRole('heading', { name: /create new interface/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/interface name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add interface/i })).toBeInTheDocument();

    // Check for default items from the initial list
    expect(screen.getByText('UART')).toBeInTheDocument();
    expect(screen.getByText('CAN Bus')).toBeInTheDocument();
  });

  it('allows a user to create a new interface and saves it to localStorage', async () => {
    const setItemSpy = jest.spyOn(localStorageMock, 'setItem');
    render(<InterfacesPage />);

    const nameInput = screen.getByLabelText(/interface name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const addButton = screen.getByRole('button', { name: /add interface/i });

    // Fill out the form
    fireEvent.change(nameInput, { target: { value: 'New Test Interface' } });
    fireEvent.change(descriptionInput, { target: { value: 'A test description.' } });

    // Submit the form
    fireEvent.click(addButton);

    // Wait for the new interface to appear in the list
    await waitFor(() => {
      expect(screen.getByText('New Test Interface')).toBeInTheDocument();
      expect(screen.getByText('A test description.')).toBeInTheDocument();
    });

    // Check that localStorage was updated
    expect(setItemSpy).toHaveBeenCalledWith('interfaces', expect.stringContaining('New Test Interface'));
    
    setItemSpy.mockRestore();
  });

  it('loads interfaces from localStorage on initial render', () => {
    // Pre-populate localStorage
    const storedInterfaces = [
      { id: 'stored-1', name: 'Stored Interface 1', description: 'Loaded from LS.', icon: 'default' },
    ];
    localStorageMock.setItem('interfaces', JSON.stringify(storedInterfaces));

    render(<InterfacesPage />);

    // Check that the stored interface is rendered
    expect(screen.getByText('Stored Interface 1')).toBeInTheDocument();
    expect(screen.getByText('Loaded from LS.')).toBeInTheDocument();

    // Check that the default interfaces are NOT rendered
    expect(screen.queryByText('UART')).not.toBeInTheDocument();
  });

  it('does not add an interface if the name is empty', async () => {
    render(<InterfacesPage />);
    
    const initialItemCount = screen.getAllByRole('listitem').length;
    
    const addButton = screen.getByRole('button', { name: /add interface/i });
    fireEvent.click(addButton);

    // Give React a moment to process, though nothing should happen
    await new Promise(resolve => setTimeout(resolve, 100));

    const finalItemCount = screen.getAllByRole('listitem').length;
    expect(finalItemCount).toBe(initialItemCount);
  });
});
