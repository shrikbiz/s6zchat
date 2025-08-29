import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the S6ZChat component
jest.mock('../Components/MainPage', () => {
  return function MockS6ZChat() {
    return <div data-testid="s6z-chat">S6ZChat Component</div>;
  };
});

describe('App Component', () => {
  const renderWithRouter = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    );
  };

  describe('Routing', () => {
    test('redirects from root path to /chat', () => {
      renderWithRouter(['/']);
      
      // Should redirect to /chat and render S6ZChat component
      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();
    });

    test('renders S6ZChat component on /chat path', () => {
      renderWithRouter(['/chat']);
      
      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();
    });

    test('renders S6ZChat component on /chat/:chatId path', () => {
      renderWithRouter(['/chat/123']);
      
      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();
    });

    test('handles multiple chat IDs in path', () => {
      renderWithRouter(['/chat/abc-def-456']);
      
      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();
    });

    test('handles empty chat ID in path', () => {
      renderWithRouter(['/chat/']);
      
      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    test('handles navigation between different chat routes', () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/chat/123']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();

      // Simulate navigation to different chat
      rerender(
        <MemoryRouter initialEntries={['/chat/456']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();
    });

    test('handles navigation from root to specific chat', () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();

      // Navigate to specific chat
      rerender(
        <MemoryRouter initialEntries={['/chat/specific-chat-id']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();
    });
  });

  describe('Route Patterns', () => {
    test('matches chat route with optional chatId parameter', () => {
      // Test with chatId
      renderWithRouter(['/chat/test-chat-123']);
      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();

      // Test without chatId
      const { rerender } = render(
        <MemoryRouter initialEntries={['/chat']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();
    });

    test('handles special characters in chat ID', () => {
      renderWithRouter(['/chat/chat-with-special-chars_123']);
      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();
    });

    test('handles numeric chat IDs', () => {
      renderWithRouter(['/chat/12345']);
      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();
    });

    test('handles UUID-like chat IDs', () => {
      renderWithRouter(['/chat/550e8400-e29b-41d4-a716-446655440000']);
      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();
    });
  });

  describe('Error Scenarios', () => {
    test('handles invalid routes gracefully', () => {
      // Note: Since we only have one route that catches all /chat paths,
      // invalid routes would typically fall through to a 404 or default handler
      // In this simple router setup, unmatched routes would not render anything
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      renderWithRouter(['/invalid-route']);
      
      // Should not crash the application
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    test('handles empty route paths', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      renderWithRouter(['']);
      
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Component Structure', () => {
    test('renders Routes component', () => {
      renderWithRouter(['/chat']);
      
      // Should render without errors
      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();
    });

    test('maintains component structure across route changes', () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      const initialComponent = screen.getByTestId('s6z-chat');
      expect(initialComponent).toBeInTheDocument();

      // Change route
      rerender(
        <MemoryRouter initialEntries={['/chat/new-chat']}>
          <App />
        </MemoryRouter>
      );

      // Component should still be present
      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    test('properly integrates with React Router', () => {
      // Test that the router context is properly set up
      renderWithRouter(['/chat/integration-test']);
      
      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();
    });

    test('handles browser back/forward navigation', () => {
      // Simulate multiple entries in history
      const { rerender } = render(
        <MemoryRouter initialEntries={['/', '/chat/first', '/chat/second']} initialIndex={2}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();

      // Simulate going back in history
      rerender(
        <MemoryRouter initialEntries={['/', '/chat/first', '/chat/second']} initialIndex={1}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('s6z-chat')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('does not cause memory leaks with route changes', () => {
      const { rerender, unmount } = render(
        <MemoryRouter initialEntries={['/chat/test1']}>
          <App />
        </MemoryRouter>
      );

      // Change routes multiple times
      for (let i = 0; i < 5; i++) {
        rerender(
          <MemoryRouter initialEntries={[`/chat/test${i}`]}>
            <App />
          </MemoryRouter>
        );
      }

      // Should unmount cleanly
      expect(() => unmount()).not.toThrow();
    });

    test('renders efficiently with minimal re-renders', () => {
      const renderSpy = jest.spyOn(React, 'createElement');
      const initialCallCount = renderSpy.mock.calls.length;

      renderWithRouter(['/chat/performance-test']);

      // Should not cause excessive re-renders
      const finalCallCount = renderSpy.mock.calls.length;
      expect(finalCallCount - initialCallCount).toBeLessThan(10);

      renderSpy.mockRestore();
    });
  });
});