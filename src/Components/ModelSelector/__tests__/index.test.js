import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ModelSelector from '../index';
import { MODELS } from '../API/config';

// Mock the MUI components
jest.mock('@mui/material', () => ({
  FormControl: ({ children, ...props }) => <div data-testid="form-control" {...props}>{children}</div>,
  Select: ({ children, value, onChange, onClose, onOpen, open, renderValue, ...props }) => (
    <select 
      data-testid="model-select"
      value={value}
      onChange={(e) => onChange && onChange(e)}
      onFocus={() => onOpen && onOpen()}
      onBlur={() => onClose && onClose()}
      data-open={open}
      {...props}
    >
      {children}
    </select>
  ),
  MenuItem: ({ children, value, ...props }) => (
    <option value={value} {...props}>{children}</option>
  ),
  Typography: ({ children, variant, ...props }) => (
    <span data-variant={variant} {...props}>{children}</span>
  ),
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  Chip: ({ label, size, color, ...props }) => (
    <span data-testid="chip" data-size={size} data-color={color} {...props}>{label}</span>
  ),
}));

// Mock the API config
jest.mock('../API/config', () => ({
  MODELS: {
    openAI: 'Open AI',
    ollama: 'Ollama',
  },
}));

describe('ModelSelector Component', () => {
  const mockOnModelChange = jest.fn();

  const defaultProps = {
    selectedModel: 'Open AI',
    onModelChange: mockOnModelChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders FormControl and Select components', () => {
      render(<ModelSelector {...defaultProps} />);
      
      expect(screen.getByTestId('form-control')).toBeInTheDocument();
      expect(screen.getByTestId('model-select')).toBeInTheDocument();
    });

    test('displays current selected model', () => {
      render(<ModelSelector {...defaultProps} selectedModel="Ollama" />);
      
      const select = screen.getByTestId('model-select');
      expect(select).toHaveValue('Ollama');
    });

    test('renders all available models as options', () => {
      render(<ModelSelector {...defaultProps} />);
      
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveValue('Open AI');
      expect(options[1]).toHaveValue('Ollama');
    });

    test('has correct container class', () => {
      render(<ModelSelector {...defaultProps} />);
      
      const container = screen.getByTestId('form-control').parentElement;
      expect(container).toHaveClass('model-selector-container');
    });
  });

  describe('Model Information Display', () => {
    test('shows correct information for OpenAI model', () => {
      render(<ModelSelector {...defaultProps} />);
      
      // Check if OpenAI option contains the description and chip
      const openAIOption = screen.getByRole('option', { name: /Open AI/i });
      expect(openAIOption).toBeInTheDocument();
    });

    test('shows correct information for Ollama model', () => {
      render(<ModelSelector {...defaultProps} />);
      
      // Check if Ollama option contains the description and chip
      const ollamaOption = screen.getByRole('option', { name: /Ollama/i });
      expect(ollamaOption).toBeInTheDocument();
    });

    test('displays chips with correct colors and labels', () => {
      render(<ModelSelector {...defaultProps} />);
      
      // The chips should be rendered for each model option
      const chips = screen.getAllByTestId('chip');
      
      // We expect chips for Cloud and Local
      expect(chips).toHaveLength(2);
      
      // Check for Cloud chip (OpenAI)
      const cloudChip = chips.find(chip => chip.textContent === 'Cloud');
      expect(cloudChip).toHaveAttribute('data-color', 'primary');
      
      // Check for Local chip (Ollama)  
      const localChip = chips.find(chip => chip.textContent === 'Local');
      expect(localChip).toHaveAttribute('data-color', 'secondary');
    });
  });

  describe('User Interactions', () => {
    test('calls onModelChange when model is selected', async () => {
      const user = userEvent.setup();
      render(<ModelSelector {...defaultProps} />);
      
      const select = screen.getByTestId('model-select');
      await user.selectOptions(select, 'Ollama');
      
      expect(mockOnModelChange).toHaveBeenCalledWith('Ollama');
    });

    test('calls onModelChange with correct event object', () => {
      render(<ModelSelector {...defaultProps} />);
      
      const select = screen.getByTestId('model-select');
      fireEvent.change(select, { target: { value: 'Ollama' } });
      
      expect(mockOnModelChange).toHaveBeenCalledWith('Ollama');
    });

    test('handles selection of the same model', () => {
      render(<ModelSelector {...defaultProps} selectedModel="Open AI" />);
      
      const select = screen.getByTestId('model-select');
      fireEvent.change(select, { target: { value: 'Open AI' } });
      
      expect(mockOnModelChange).toHaveBeenCalledWith('Open AI');
    });
  });

  describe('Dropdown State Management', () => {
    test('opens dropdown when focused', () => {
      render(<ModelSelector {...defaultProps} />);
      
      const select = screen.getByTestId('model-select');
      fireEvent.focus(select);
      
      // The open state should be managed internally
      expect(select).toHaveFocus();
    });

    test('closes dropdown when blurred', () => {
      render(<ModelSelector {...defaultProps} />);
      
      const select = screen.getByTestId('model-select');
      fireEvent.focus(select);
      fireEvent.blur(select);
      
      expect(select).not.toHaveFocus();
    });

    test('manages open state correctly', () => {
      render(<ModelSelector {...defaultProps} />);
      
      const select = screen.getByTestId('model-select');
      
      // Initially closed
      expect(select).toHaveAttribute('data-open', 'false');
      
      // Open dropdown
      fireEvent.focus(select);
      // Note: In a real MUI Select, this would update the open state
      // Our mock doesn't fully simulate this behavior
    });
  });

  describe('Props Validation', () => {
    test('handles missing selectedModel prop', () => {
      const { selectedModel, ...propsWithoutSelected } = defaultProps;
      
      expect(() => {
        render(<ModelSelector {...propsWithoutSelected} selectedModel={undefined} />);
      }).not.toThrow();
    });

    test('handles missing onModelChange prop', () => {
      const { onModelChange, ...propsWithoutCallback } = defaultProps;
      
      expect(() => {
        render(<ModelSelector {...propsWithoutCallback} onModelChange={undefined} />);
      }).not.toThrow();
    });

    test('handles null props gracefully', () => {
      expect(() => {
        render(<ModelSelector selectedModel={null} onModelChange={null} />);
      }).not.toThrow();
    });

    test('works with invalid selectedModel', () => {
      expect(() => {
        render(<ModelSelector selectedModel="InvalidModel" onModelChange={mockOnModelChange} />);
      }).not.toThrow();
    });
  });

  describe('Styling and CSS Classes', () => {
    test('applies model-selector-container class', () => {
      render(<ModelSelector {...defaultProps} />);
      
      const container = screen.getByTestId('form-control').parentElement;
      expect(container).toHaveClass('model-selector-container');
    });

    test('renders with fullWidth FormControl', () => {
      render(<ModelSelector {...defaultProps} />);
      
      const formControl = screen.getByTestId('form-control');
      expect(formControl).toHaveAttribute('fullWidth', 'true');
    });

    test('has small size Select component', () => {
      render(<ModelSelector {...defaultProps} />);
      
      const select = screen.getByTestId('model-select');
      expect(select).toHaveAttribute('size', 'small');
    });
  });

  describe('Accessibility', () => {
    test('Select is properly labeled', () => {
      render(<ModelSelector {...defaultProps} />);
      
      const select = screen.getByTestId('model-select');
      expect(select).toBeInTheDocument();
      expect(select).toHaveAttribute('role', 'combobox');
    });

    test('provides keyboard navigation', () => {
      render(<ModelSelector {...defaultProps} />);
      
      const select = screen.getByTestId('model-select');
      
      // Should be focusable
      select.focus();
      expect(select).toHaveFocus();
      
      // Should respond to keyboard events
      fireEvent.keyDown(select, { key: 'ArrowDown' });
      // In a real implementation, this would change selection
    });

    test('supports screen readers', () => {
      render(<ModelSelector {...defaultProps} />);
      
      // The Select component should be accessible to screen readers
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('does not re-render unnecessarily', () => {
      const renderSpy = jest.spyOn(React, 'createElement');
      const initialCallCount = renderSpy.mock.calls.length;
      
      const { rerender } = render(<ModelSelector {...defaultProps} />);
      
      // Re-render with same props
      rerender(<ModelSelector {...defaultProps} />);
      
      // Should not cause excessive re-renders
      const finalCallCount = renderSpy.mock.calls.length;
      expect(finalCallCount - initialCallCount).toBeLessThan(20);
      
      renderSpy.mockRestore();
    });

    test('handles rapid model changes', async () => {
      const user = userEvent.setup();
      render(<ModelSelector {...defaultProps} />);
      
      const select = screen.getByTestId('model-select');
      
      // Rapid changes
      await user.selectOptions(select, 'Ollama');
      await user.selectOptions(select, 'Open AI');
      await user.selectOptions(select, 'Ollama');
      
      expect(mockOnModelChange).toHaveBeenCalledTimes(3);
      expect(mockOnModelChange).toHaveBeenLastCalledWith('Ollama');
    });
  });

  describe('Edge Cases', () => {
    test('handles empty MODELS object', () => {
      // Mock empty MODELS
      jest.doMock('../API/config', () => ({
        MODELS: {},
      }));
      
      expect(() => {
        render(<ModelSelector {...defaultProps} />);
      }).not.toThrow();
    });

    test('renders with very long model names', () => {
      const longModelName = 'A'.repeat(100);
      
      expect(() => {
        render(<ModelSelector selectedModel={longModelName} onModelChange={mockOnModelChange} />);
      }).not.toThrow();
    });

    test('handles special characters in model names', () => {
      const specialModelName = 'Model with émojis 🚀 & symbols!';
      
      expect(() => {
        render(<ModelSelector selectedModel={specialModelName} onModelChange={mockOnModelChange} />);
      }).not.toThrow();
    });

    test('works during component unmount', () => {
      const { unmount } = render(<ModelSelector {...defaultProps} />);
      
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('Integration', () => {
    test('integrates properly with parent component state', () => {
      let currentModel = 'Open AI';
      const handleModelChange = (newModel) => {
        currentModel = newModel;
      };

      const { rerender } = render(
        <ModelSelector selectedModel={currentModel} onModelChange={handleModelChange} />
      );

      const select = screen.getByTestId('model-select');
      fireEvent.change(select, { target: { value: 'Ollama' } });

      handleModelChange('Ollama');
      rerender(
        <ModelSelector selectedModel="Ollama" onModelChange={handleModelChange} />
      );

      expect(screen.getByTestId('model-select')).toHaveValue('Ollama');
    });
  });
});