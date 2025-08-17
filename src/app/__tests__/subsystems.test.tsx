import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubsystemsPage from '../subsystems/page';

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

describe('Subsystems Page', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('renders the form and the default list when localStorage is empty', () => {
    const getItemSpy = jest.spyOn(localStorageMock, 'getItem');
    render(<SubsystemsPage />);

    expect(getItemSpy).toHaveBeenCalledWith('subsystems');
    expect(screen.getByRole('heading', { name: /create new subsystem/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/subsystem name/i)).toBeInTheDocument();
    expect(screen.getByText('Engine')).toBeInTheDocument();
    expect(screen.getByText('Processing Unit')).toBeInTheDocument();
    getItemSpy.mockRestore();
  });

  it('allows a user to create a new subsystem', async () => {
    render(<SubsystemsPage />);
    fireEvent.change(screen.getByLabelText(/subsystem name/i), { target: { value: 'New Subsystem' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'A test description.' } });
    fireEvent.click(screen.getByRole('button', { name: /add subsystem/i }));

    await waitFor(() => {
      expect(screen.getByText('New Subsystem')).toBeInTheDocument();
      expect(screen.getByText('A test description.')).toBeInTheDocument();
    });
  });

  it('loads subsystems from localStorage', () => {
    const storedSubsystems = [
      { id: 'stored-1', name: 'Stored Subsystem', description: 'Loaded from LS.', icon: 'default' },
    ];
    localStorageMock.setItem('subsystems', JSON.stringify(storedSubsystems));
    render(<SubsystemsPage />);
    expect(screen.getByText('Stored Subsystem')).toBeInTheDocument();
    expect(screen.queryByText('Engine')).not.toBeInTheDocument();
  });

  it('allows a user to confirm and delete a subsystem', async () => {
    render(<SubsystemsPage />);
    const itemToDelete = screen.getByText('Engine');
    expect(itemToDelete).toBeInTheDocument();

    const deleteButton = itemToDelete.closest('li')!.querySelector('[aria-label="delete"]');
    fireEvent.click(deleteButton!);

    const dialogTitle = await screen.findByRole('heading', { name: /confirm deletion/i });
    expect(dialogTitle).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByText('Engine')).not.toBeInTheDocument();
    });
  });

  it('allows a user to cancel a deletion', async () => {
    render(<SubsystemsPage />);
    const itemToDelete = screen.getByText('Engine');
    expect(itemToDelete).toBeInTheDocument();

    const deleteButton = itemToDelete.closest('li')!.querySelector('[aria-label="delete"]');
    fireEvent.click(deleteButton!);

    const dialogTitle = await screen.findByRole('heading', { name: /confirm deletion/i });
    expect(dialogTitle).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(dialogTitle).not.toBeInTheDocument();
    });

    expect(screen.getByText('Engine')).toBeInTheDocument();
  });

  it('does not save to localStorage when the last subsystem is deleted', async () => {
    // Start with one item
    const initialData = [{ id: 'single', name: 'Single Subsystem', description: 'desc', icon: 'default' }];
    localStorageMock.setItem('subsystems', JSON.stringify(initialData));
    const setItemSpy = jest.spyOn(localStorageMock, 'setItem');

    render(<SubsystemsPage />);

    const itemToDelete = screen.getByText('Single Subsystem');
    expect(itemToDelete).toBeInTheDocument();

    const deleteButton = itemToDelete.closest('li')!.querySelector('[aria-label="delete"]');
    fireEvent.click(deleteButton!);

    const confirmButton = await screen.findByRole('button', { name: /delete/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByText('Single Subsystem')).not.toBeInTheDocument();
    });

    // setItem should have been called for the initial load, but not for the deletion that empties the list
    // We check that it was called once for the initial data, and then we check the content of the storage
    expect(localStorage.getItem('subsystems')).toBe('[]');

    setItemSpy.mockRestore();
  });
});
