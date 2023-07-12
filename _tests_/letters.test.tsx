import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Letters from '../src/components/input/letters';

const mockProps = {
  setLetter: jest.fn(),
  shuffledLetters: ['A', 'B', 'C', 'E', 'F', 'G'],
  centerLetter: 'Z',
};

describe('Letters component', () => {
  beforeEach(() => {
    render(<Letters {...mockProps} />);
  });
  it('Renders', () => {
    const lettersDiv = screen.getByTestId('letters-div');
    expect(lettersDiv).toBeInTheDocument();
  });
  it('All letters are in the document', () => {
    const lettersDiv = screen.getByTestId('letters-div');
    for (let i = 0; i < mockProps.shuffledLetters.length; i++) {
      expect(lettersDiv.textContent).toMatch(mockProps.shuffledLetters[i]);
    }
    expect(lettersDiv.textContent).toMatch(mockProps.centerLetter);
  });
  it('Each letter calls setLetter onClick with expected arg', () => {
    const centerLetter = screen.getByText(mockProps.centerLetter);
    act(() => {
      fireEvent.click(centerLetter);
    });
    expect(mockProps.setLetter).toBeCalledWith(mockProps.centerLetter);

    for (let i = 0; i < mockProps.shuffledLetters.length; i++) {
      const letter = screen.getByText(mockProps.shuffledLetters[i]);
      act(() => {
        fireEvent.click(letter);
      });
      expect(mockProps.setLetter).toBeCalledWith(mockProps.shuffledLetters[i]);
    }
  });
});
