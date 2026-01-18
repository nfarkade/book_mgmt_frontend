import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from '../../components/ConfirmDialog';

describe('ConfirmDialog Component', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when isOpen is false', () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
    expect(screen.queryByText('Are you sure you want to proceed?')).not.toBeInTheDocument();
  });

  test('renders when isOpen is true', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
  });

  test('displays title correctly', () => {
    const title = 'Delete Item';
    render(<ConfirmDialog {...defaultProps} title={title} />);
    
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  test('displays message correctly', () => {
    const message = 'This action cannot be undone.';
    render(<ConfirmDialog {...defaultProps} message={message} />);
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test('displays default confirm and cancel button text', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('displays custom confirm button text', () => {
    render(<ConfirmDialog {...defaultProps} confirmText="Delete" />);
    
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('displays custom cancel button text', () => {
    render(<ConfirmDialog {...defaultProps} cancelText="No, keep it" />);
    
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('No, keep it')).toBeInTheDocument();
  });

  test('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);
    
    const confirmButton = screen.getByText('Confirm');
    await user.click(confirmButton);
    
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when overlay is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    
    const overlay = document.querySelector('.modal-overlay');
    await user.click(overlay);
    
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('does not call onCancel when dialog content is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    
    const dialog = document.querySelector('.modal-dialog');
    await user.click(dialog);
    
    expect(onCancel).not.toHaveBeenCalled();
  });

  test('applies danger variant class by default', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toHaveClass('btn-danger');
  });

  test('applies primary variant class when specified', () => {
    render(<ConfirmDialog {...defaultProps} variant="primary" />);
    
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toHaveClass('btn-primary');
  });

  test('applies warning variant class when specified', () => {
    render(<ConfirmDialog {...defaultProps} variant="warning" />);
    
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toHaveClass('btn-warning');
  });

  test('cancel button always has secondary class', () => {
    render(<ConfirmDialog {...defaultProps} variant="danger" />);
    
    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toHaveClass('btn-secondary');
  });

  test('renders modal structure correctly', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    expect(document.querySelector('.modal-overlay')).toBeInTheDocument();
    expect(document.querySelector('.modal-dialog')).toBeInTheDocument();
    expect(document.querySelector('.modal-content')).toBeInTheDocument();
    expect(document.querySelector('.modal-header')).toBeInTheDocument();
    expect(document.querySelector('.modal-body')).toBeInTheDocument();
    expect(document.querySelector('.modal-footer')).toBeInTheDocument();
  });

  test('handles multiple rapid clicks on confirm button', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);
    
    const confirmButton = screen.getByText('Confirm');
    await user.click(confirmButton);
    await user.click(confirmButton);
    await user.click(confirmButton);
    
    expect(onConfirm).toHaveBeenCalledTimes(3);
  });

  test('handles multiple rapid clicks on cancel button', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    await user.click(cancelButton);
    
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  test('renders with long title text', () => {
    const longTitle = 'This is a very long title that might wrap to multiple lines';
    render(<ConfirmDialog {...defaultProps} title={longTitle} />);
    
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  test('renders with long message text', () => {
    const longMessage = 'This is a very long message that contains a lot of text and might wrap to multiple lines in the dialog.';
    render(<ConfirmDialog {...defaultProps} message={longMessage} />);
    
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
});
