import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TextEditor from '../index';

describe('TextEditor Component', () => {
  // Mock props
  const mockProps = {
    input: '',
    handleRun: jest.fn(),
    setInput: jest.fn(),
    isProcessingQuery: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders textarea and button', () => {
      render(<TextEditor {...mockProps} />);
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('renders with correct CSS classes', () => {
      render(<TextEditor {...mockProps} />);
      
      const container = screen.getByRole('textbox').parentElement;
      expect(container).toHaveClass('text-editor-container');
      expect(screen.getByRole('textbox')).toHaveClass('text-editor-textarea');
      expect(screen.getByRole('button')).toHaveClass('text-editor-button');
    });

    test('textarea has correct attributes', () => {
      render(<TextEditor {...mockProps} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('name', 'prompt');
      expect(textarea).toHaveAttribute('id', 'prompt');
      expect(textarea).toHaveAttribute('placeholder', 'Type your message...');
    });

    test('displays input value correctly', () => {
      const testInput = 'Hello, world!';
      render(<TextEditor {...mockProps} input={testInput} />);
      
      expect(screen.getByDisplayValue(testInput)).toBeInTheDocument();
    });

    test('shows Send button when not processing', () => {
      render(<TextEditor {...mockProps} isProcessingQuery={false} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Send');
      
      // Check for play icon (triangle)
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg.querySelector('polygon')).toBeInTheDocument();
    });

    test('shows Stop button when processing', () => {
      render(<TextEditor {...mockProps} isProcessingQuery={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Stop');
      
      // Check for stop icon (rectangle)
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg.querySelector('rect')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('calls setInput when user types', async () => {
      const user = userEvent.setup();
      render(<TextEditor {...mockProps} />);
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Hello');
      
      expect(mockProps.setInput).toHaveBeenCalledTimes(5); // One call per character
      expect(mockProps.setInput).toHaveBeenLastCalledWith('Hello');
    });

    test('calls handleRun when button is clicked', async () => {
      const user = userEvent.setup();
      render(<TextEditor {...mockProps} />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockProps.handleRun).toHaveBeenCalledTimes(1);
      expect(mockProps.handleRun).toHaveBeenCalledWith(expect.any(Object));
    });

    test('calls handleRun when Enter is pressed without Shift', () => {
      render(<TextEditor {...mockProps} />);
      
      const textarea = screen.getByRole('textbox');
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
      
      expect(mockProps.handleRun).toHaveBeenCalledTimes(1);
    });

    test('does not call handleRun when Shift+Enter is pressed', () => {
      render(<TextEditor {...mockProps} />);
      
      const textarea = screen.getByRole('textbox');
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
      
      expect(mockProps.handleRun).not.toHaveBeenCalled();
    });

    test('prevents default behavior when Enter is pressed without Shift', () => {
      render(<TextEditor {...mockProps} />);
      
      const textarea = screen.getByRole('textbox');
      const mockPreventDefault = jest.fn();
      
      fireEvent.keyDown(textarea, { 
        key: 'Enter', 
        shiftKey: false,
        preventDefault: mockPreventDefault,
      });
      
      expect(mockPreventDefault).toHaveBeenCalled();
    });

    test('allows newline when Shift+Enter is pressed', () => {
      render(<TextEditor {...mockProps} />);
      
      const textarea = screen.getByRole('textbox');
      const mockPreventDefault = jest.fn();
      
      fireEvent.keyDown(textarea, { 
        key: 'Enter', 
        shiftKey: true,
        preventDefault: mockPreventDefault,
      });
      
      expect(mockPreventDefault).not.toHaveBeenCalled();
    });

    test('ignores other key presses', () => {
      render(<TextEditor {...mockProps} />);
      
      const textarea = screen.getByRole('textbox');
      
      ['Tab', 'Escape', 'ArrowUp', 'Space'].forEach(key => {
        fireEvent.keyDown(textarea, { key });
      });
      
      expect(mockProps.handleRun).not.toHaveBeenCalled();
    });
  });

  describe('Processing State', () => {
    test('disables textarea when processing', () => {
      render(<TextEditor {...mockProps} isProcessingQuery={true} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });

    test('enables textarea when not processing', () => {
      render(<TextEditor {...mockProps} isProcessingQuery={false} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).not.toBeDisabled();
    });

    test('button remains clickable during processing', () => {
      render(<TextEditor {...mockProps} isProcessingQuery={true} />);
      
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('SVG Icons', () => {
    test('play icon has correct attributes', () => {
      render(<TextEditor {...mockProps} isProcessingQuery={false} />);
      
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toHaveAttribute('width', '28');
      expect(svg).toHaveAttribute('height', '28');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
      expect(svg).toHaveAttribute('strokeWidth', '2.2');
      
      const polygon = svg.querySelector('polygon');
      expect(polygon).toHaveAttribute('points', '5 3 19 12 5 21 5 3');
      expect(polygon).toHaveAttribute('fill', '#e0e0e3');
    });

    test('stop icon has correct attributes', () => {
      render(<TextEditor {...mockProps} isProcessingQuery={true} />);
      
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toHaveAttribute('width', '28');
      expect(svg).toHaveAttribute('height', '28');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
      expect(svg).toHaveAttribute('strokeWidth', '2.2');
      
      const rect = svg.querySelector('rect');
      expect(rect).toHaveAttribute('x', '6');
      expect(rect).toHaveAttribute('y', '6');
      expect(rect).toHaveAttribute('width', '12');
      expect(rect).toHaveAttribute('height', '12');
      expect(rect).toHaveAttribute('fill', '#e74c3c');
      expect(rect).toHaveAttribute('stroke', '#e0e0e3');
    });
  });

  describe('forwardRef Functionality', () => {
    test('forwards ref to textarea element', () => {
      const ref = React.createRef();
      render(<TextEditor {...mockProps} ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
      expect(ref.current).toHaveAttribute('id', 'prompt');
    });

    test('ref can be used to focus textarea', () => {
      const ref = React.createRef();
      render(<TextEditor {...mockProps} ref={ref} />);
      
      ref.current.focus();
      expect(ref.current).toHaveFocus();
    });

    test('ref can be used to get textarea value', () => {
      const ref = React.createRef();
      const testValue = 'Test input value';
      render(<TextEditor {...mockProps} input={testValue} ref={ref} />);
      
      expect(ref.current.value).toBe(testValue);
    });
  });

  describe('Edge Cases', () => {
    test('handles empty input', () => {
      render(<TextEditor {...mockProps} input="" />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('');
    });

    test('handles very long input', () => {
      const longInput = 'a'.repeat(10000);
      render(<TextEditor {...mockProps} input={longInput} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(longInput);
    });

    test('handles multiline input', () => {
      const multilineInput = 'Line 1\nLine 2\nLine 3';
      render(<TextEditor {...mockProps} input={multilineInput} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(multilineInput);
    });

    test('handles special characters', () => {
      const specialInput = '🚀 Hello! "World" & <test>';
      render(<TextEditor {...mockProps} input={specialInput} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(specialInput);
    });

    test('handles null/undefined props gracefully', () => {
      const propsWithNulls = {
        input: null,
        handleRun: null,
        setInput: null,
        isProcessingQuery: undefined,
      };
      
      expect(() => {
        render(<TextEditor {...propsWithNulls} />);
      }).not.toThrow();
    });
  });

  describe('Event Handling Edge Cases', () => {
    test('handles onChange with null event', () => {
      const mockSetInput = jest.fn();
      render(<TextEditor {...mockProps} setInput={mockSetInput} />);
      
      const textarea = screen.getByRole('textbox');
      
      // This shouldn't happen in real scenarios, but test defensive programming
      expect(() => {
        fireEvent.change(textarea, { target: { value: null } });
      }).not.toThrow();
    });

    test('handles keyDown with missing event properties', () => {
      render(<TextEditor {...mockProps} />);
      
      const textarea = screen.getByRole('textbox');
      
      // Test with incomplete event object
      expect(() => {
        fireEvent.keyDown(textarea, { key: undefined });
      }).not.toThrow();
    });

    test('handles rapid consecutive events', async () => {
      const user = userEvent.setup();
      render(<TextEditor {...mockProps} />);
      
      const textarea = screen.getByRole('textbox');
      
      // Rapid typing
      await user.type(textarea, 'fast');
      
      // Multiple Enter presses
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
      
      expect(mockProps.handleRun).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    test('textarea is properly labeled', () => {
      render(<TextEditor {...mockProps} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('placeholder', 'Type your message...');
    });

    test('button has proper aria-label', () => {
      render(<TextEditor {...mockProps} isProcessingQuery={false} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Send');
    });

    test('button aria-label changes based on processing state', () => {
      const { rerender } = render(<TextEditor {...mockProps} isProcessingQuery={false} />);
      
      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Send');
      
      rerender(<TextEditor {...mockProps} isProcessingQuery={true} />);
      
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Stop');
    });

    test('supports keyboard navigation', () => {
      render(<TextEditor {...mockProps} />);
      
      const textarea = screen.getByRole('textbox');
      const button = screen.getByRole('button');
      
      // Both elements should be focusable
      textarea.focus();
      expect(textarea).toHaveFocus();
      
      button.focus();
      expect(button).toHaveFocus();
    });
  });
});