import React from 'react';

function Button({
  variant = 'primary',      // 'primary' | 'secondary' | 'danger' | 'icon'
  size = 'normal',          // 'normal' | 'small'
  type = 'button',          // 'button' | 'submit'
  children,
  onClick,
  disabled = false,
  title = '',
  className = '',
}) {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn btn-primary';
      case 'secondary':
        return 'btn btn-secondary';
      case 'danger':
        return 'btn btn-danger';
      case 'icon':
        return 'btn btn-icon';
      default:
        return 'btn btn-primary';
    }
  };

  const getSizeClass = () => {
    return size === 'small' ? 'btn-small' : '';
  };

  return (
    <button
      type={type}
      className={`${getVariantClass()} ${getSizeClass()} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}

export default Button;
