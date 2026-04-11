function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="flex items-center gap-3">{action}</div> : null}
    </div>
  );
}

export default PageHeader;
