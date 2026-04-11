function SocietyCard({ society, childClubs = [], schoolName = '' }) {
  return (
    <article className="card-surface overflow-hidden">
      <div
        className="h-44 w-full"
        style={{
          background: society.logoUrl
            ? `url(${society.logoUrl}) center/cover no-repeat`
            : 'linear-gradient(135deg, var(--color-brand-soft) 0%, var(--color-surface-soft) 100%)',
        }}
      />
      <div className="p-5">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
          {society.name}
        </h3>
        {schoolName ? (
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{schoolName}</p>
        ) : null}
        {society.description ? (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            {society.description}
          </p>
        ) : null}

        {childClubs.length > 0 ? (
          <div className="mt-4 border-t border-[var(--color-border)] pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Clubs
            </p>
            <div className="space-y-2">
              {childClubs.slice(0, 3).map((club) => (
                <div key={club._id} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-primary)]">{club.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default SocietyCard;
