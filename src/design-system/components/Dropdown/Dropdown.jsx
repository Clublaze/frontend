export default function Dropdown({ trigger, children, className = '' }) {
  return (
    <div className={`dropdown ${className}`}>
      <div className="dropdown-trigger">{trigger}</div>
      <div className="dropdown-menu">{children}</div>
    </div>
  );
}
