export default function Input({ label, id, type = 'text', error, className = '', ...props }) {
  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} type={type} {...props} />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}
