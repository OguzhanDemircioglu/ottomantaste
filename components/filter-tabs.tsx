import Link from 'next/link';

type Tab = { slug: string; label: string; count: number };

type Props = {
  tabs: Tab[];
  active?: string;
  totalAll: number;
  allLabel: string;
  hrefFor: (slug: string | undefined) => string;
};

/**
 * Newspaper-style category tabs — horizontal row, fully justified, with
 * underline indicator on the active one. NOT pill chips. The label of the
 * "All" tab is passed in so the parent can localize it.
 */
export function FilterTabs({ tabs, active, totalAll, allLabel, hrefFor }: Props) {
  return (
    <nav aria-label="Categories" className="border-b border-[#2a1810]/25">
      <div className="mx-auto w-full max-w-7xl px-6">
        <ul className="-mb-px flex flex-wrap items-end gap-x-8 gap-y-3 py-4">
          <li>
            <TabItem href={hrefFor(undefined)} label={allLabel} count={totalAll} active={!active} />
          </li>
          {tabs.map((t) => (
            <li key={t.slug}>
              <TabItem
                href={hrefFor(t.slug)}
                label={t.label}
                count={t.count}
                active={active === t.slug}
              />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function TabItem({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={[
        'group relative inline-flex cursor-pointer items-baseline gap-2 pb-2',
        active ? 'text-[#2a1810]' : 'text-[#2a1810]/55 hover:text-[#2a1810]',
      ].join(' ')}
      style={{
        fontFamily: 'var(--font-display)',
        transition: 'color 320ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <span className="text-base font-medium uppercase tracking-[0.04em]">{label}</span>
      <span className="font-mono text-[10px] tabular-nums text-[#2a1810]/45">{count}</span>
      <span
        aria-hidden
        className={[
          'absolute -bottom-px left-0 right-0 h-[2px] origin-left bg-[var(--color-magenta-deep)]',
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
        ].join(' ')}
        style={{ transition: 'transform 320ms cubic-bezier(0.16,1,0.3,1)' }}
      />
    </Link>
  );
}
