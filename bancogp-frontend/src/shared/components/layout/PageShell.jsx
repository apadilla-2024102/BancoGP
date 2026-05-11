export const PageShell = ({ title, subtitle, children }) => {
  return (
    <main className="page-shell">
      <section className="page-shell__card">
        <div className="page-shell__header">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {children}
      </section>
    </main>
  );
};
