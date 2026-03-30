function FormPageLayout({ title, subtitle, children }) {
  return (
    <main className="form-page">
      <section className="form-card" aria-label="Registration form page">
        <header className="form-header">
          <p className="form-kicker">Stall Registration</p>
          <h1>{title}</h1>
          {subtitle ? <p className="form-subtitle">{subtitle}</p> : null}
        </header>
        {children}
      </section>
    </main>
  );
}

export default FormPageLayout;
