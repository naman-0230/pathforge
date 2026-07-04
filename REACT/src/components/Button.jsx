// Button — wraps the .btn / .btn-primary / .btn-sm / .btn-danger classes from global.css.
// Usage: <Button variant="primary" size="sm" onClick={...}>Log in</Button>
export default function Button({
  variant = 'default', // 'default' | 'primary' | 'danger'
  size,                // undefined | 'sm'
  as = 'button',       // render as 'button' or 'a' (for links styled as buttons)
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    variant === 'primary' ? 'btn-primary' : '',
    variant === 'danger' ? 'btn-danger' : '',
    size === 'sm' ? 'btn-sm' : '',
    className,
  ].join(' ').trim();

  const Tag = as; // 'button' or 'a'
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
