import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import WelcomeScreen from '../index';

// Mock the dependencies
jest.mock('@mui/material', () => ({
  CircularProgress: ({ size, thickness, sx, ...props }) => (
    <div 
      data-testid="circular-progress" 
      data-size={size}
      data-thickness={thickness}
      style={sx}
      {...props}
    >
      Loading...
    </div>
  )
}));

jest.mock('../../Animations/GradientText', () => {
  return function GradientText({ colors, animationSpeed, showBorder, className, children }) {
    return (
      <div 
        data-testid="gradient-text"
        data-colors={JSON.stringify(colors)}
        data-animation-speed={animationSpeed}
        data-show-border={showBorder}
        className={className}
      >
        {children}
      </div>
    );
  };
});

jest.mock('../../Animations/Threads', () => {
  return function Threads({ amplitude, distance, enableMouseInteraction }) {
    return (
      <div 
        data-testid="threads"
        data-amplitude={amplitude}
        data-distance={distance}
        data-enable-mouse-interaction={enableMouseInteraction}
      >
        Threads Animation
      </div>
    );
  };
});

jest.mock('../../config', () => ({
  app: {
    name: 'S6ZChat'
  }
}));

// Mock timers
jest.useFakeTimers();

describe('WelcomeScreen Component', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Loading State', () => {
    test('renders loading screen initially', () => {
      render(<WelcomeScreen />);
      
      const loadingProgress = screen.getByTestId('circular-progress');
      expect(loadingProgress).toBeInTheDocument();
      expect(loadingProgress).toHaveAttribute('data-size', '60');
      expect(loadingProgress).toHaveAttribute('data-thickness', '4');
      expect(loadingProgress).toHaveTextContent('Loading...');
    });

    test('loading container has correct CSS class', () => {
      render(<WelcomeScreen />);
      
      const loadingContainer = screen.getByTestId('circular-progress').parentElement;
      expect(loadingContainer).toHaveClass('welcome-loading-container');
    });

    test('circular progress has correct styling', () => {
      render(<WelcomeScreen />);
      
      const loadingProgress = screen.getByTestId('circular-progress');
      expect(loadingProgress).toHaveStyle({ color: '#40ffaa' });
    });

    test('does not render main content during loading', () => {
      render(<WelcomeScreen />);
      
      expect(screen.queryByTestId('gradient-text')).not.toBeInTheDocument();
      expect(screen.queryByTestId('threads')).not.toBeInTheDocument();
      expect(screen.queryByText(/Welcome to/)).not.toBeInTheDocument();
    });
  });

  describe('Main Content State', () => {
    test('renders main content after loading timeout', async () => {
      render(<WelcomeScreen />);
      
      // Fast-forward time to trigger the timeout
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('circular-progress')).not.toBeInTheDocument();
        expect(screen.getByTestId('gradient-text')).toBeInTheDocument();
        expect(screen.getByTestId('threads')).toBeInTheDocument();
      });
    });

    test('renders welcome message with app name from config', async () => {
      render(<WelcomeScreen />);
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.getByText('Welcome to S6ZChat')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome to S6ZChat');
      });
    });

    test('main container has correct CSS classes', async () => {
      render(<WelcomeScreen />);
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        const mainContainer = screen.getByTestId('gradient-text').closest('.welcome-main-container');
        const backgroundContainer = screen.getByTestId('threads').closest('.welcome-background-container');
        const contentContainer = screen.getByTestId('gradient-text').closest('.welcome-content-container');
        
        expect(mainContainer).toHaveClass('welcome-main-container');
        expect(backgroundContainer).toHaveClass('welcome-background-container');
        expect(contentContainer).toHaveClass('welcome-content-container');
      });
    });

    test('GradientText component receives correct props', async () => {
      render(<WelcomeScreen />);
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        const gradientText = screen.getByTestId('gradient-text');
        
        expect(gradientText).toHaveAttribute('data-colors', JSON.stringify([
          '#40ffaa',
          '#40ffaa', 
          '#4079ff',
          '#40ffaa',
          '#4079ff'
        ]));
        expect(gradientText).toHaveAttribute('data-animation-speed', '20');
        expect(gradientText).toHaveAttribute('data-show-border', 'false');
        expect(gradientText).toHaveClass('custom-class');
      });
    });

    test('Threads component receives correct props', async () => {
      render(<WelcomeScreen />);
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        const threads = screen.getByTestId('threads');
        
        expect(threads).toHaveAttribute('data-amplitude', '0.2');
        expect(threads).toHaveAttribute('data-distance', '0.1');
        expect(threads).toHaveAttribute('data-enable-mouse-interaction', 'true');
      });
    });
  });

  describe('Timer Management', () => {
    test('clears timeout on component unmount', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      
      const { unmount } = render(<WelcomeScreen />);
      unmount();
      
      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    test('handles early timeout if component unmounts before 500ms', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      
      const { unmount } = render(<WelcomeScreen />);
      
      // Unmount before timeout
      act(() => {
        jest.advanceTimersByTime(200);
        unmount();
      });
      
      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    test('does not set state after component unmounts', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const { unmount } = render(<WelcomeScreen />);
      unmount();
      
      // Try to trigger the timeout after unmount
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      // Should not cause any React warnings about setting state on unmounted component
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('setState'),
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('Component Memoization', () => {
    test('component is memoized with React.memo', () => {
      // Test that the component doesn't re-render with same props
      const { rerender } = render(<WelcomeScreen />);
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Mock React.memo behavior - component should not re-render
      const renderSpy = jest.spyOn(React, 'createElement');
      const initialCallCount = renderSpy.mock.calls.length;
      
      // Re-render with same props (no props in this case)
      rerender(<WelcomeScreen />);
      
      // Should not create new elements due to memoization
      expect(renderSpy).toHaveBeenCalledTimes(initialCallCount);
      
      renderSpy.mockRestore();
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    test('handles missing config gracefully', async () => {
      // Mock config with missing app name
      jest.doMock('../../config', () => ({
        app: {
          name: undefined
        }
      }));
      
      // Re-import component with new mock
      jest.resetModules();
      const WelcomeScreenWithBadConfig = require('../index').default;
      
      render(<WelcomeScreenWithBadConfig />);
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.getByText('Welcome to')).toBeInTheDocument();
      });
    });

    test('handles different timeout values', async () => {
      // Test with longer loading time
      const { rerender } = render(<WelcomeScreen />);
      
      // Should still be loading at 400ms
      act(() => {
        jest.advanceTimersByTime(400);
      });
      
      expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
      
      // Should finish loading at 500ms
      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('circular-progress')).not.toBeInTheDocument();
        expect(screen.getByTestId('gradient-text')).toBeInTheDocument();
      });
    });

    test('renders correctly with null or undefined children in GradientText', async () => {
      render(<WelcomeScreen />);
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        const gradientText = screen.getByTestId('gradient-text');
        expect(gradientText).toBeInTheDocument();
        expect(gradientText).toHaveTextContent('Welcome to S6ZChat');
      });
    });
  });

  describe('Accessibility', () => {
    test('has proper heading structure', async () => {
      render(<WelcomeScreen />);
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Welcome to S6ZChat');
      });
    });

    test('loading state has appropriate content for screen readers', () => {
      render(<WelcomeScreen />);
      
      const loadingElement = screen.getByTestId('circular-progress');
      expect(loadingElement).toHaveTextContent('Loading...');
    });
  });

  describe('CSS and Styling', () => {
    test('loading container uses correct CSS class', () => {
      render(<WelcomeScreen />);
      
      const loadingContainer = screen.getByTestId('circular-progress').parentElement;
      expect(loadingContainer).toHaveClass('welcome-loading-container');
    });

    test('main content uses correct CSS classes', async () => {
      render(<WelcomeScreen />);
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(document.querySelector('.welcome-main-container')).toBeInTheDocument();
        expect(document.querySelector('.welcome-background-container')).toBeInTheDocument();
        expect(document.querySelector('.welcome-content-container')).toBeInTheDocument();
      });
    });

    test('GradientText has custom class applied', async () => {
      render(<WelcomeScreen />);
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        const gradientText = screen.getByTestId('gradient-text');
        expect(gradientText).toHaveClass('custom-class');
      });
    });
  });
});