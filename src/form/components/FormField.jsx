function FormField({ id, label, required = false, error, children }) {
  return (
    <div className="form-row">
      <label htmlFor={id}>
        {label}
        {required ? <span className="required-mark"> *</span> : null}
      </label>
      {children}
      {error ? <p className="error-text">{error}</p> : null}
    </div>
  );
}

export default FormField;
