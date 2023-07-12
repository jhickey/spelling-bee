import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserRanking from '../src/components/userRanking';

const mockProps = {};

describe('UserRanking component', () => {
  beforeEach(() => {
    render(<UserRanking {...mockProps} />);
  });
  it('Renders', () => {
    const userRanking = screen.getByTestId('');
    expect(userRanking).toBeInTheDocument();
  });
});
