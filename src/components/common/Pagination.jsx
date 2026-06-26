export function usePagination(items, perPage = 10) {
  return { perPage };
}

export function paginate(items, page, perPage = 10) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page: safePage,
    totalPages,
    total,
    start: start + 1,
    end: Math.min(start + perPage, total),
  };
}

export function Pagination({ page, totalPages, total, start, end, onPage }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i);
    }
  }
  // Insert ellipsis markers
  const withGaps = [];
  let prev = null;
  for (const p of pages) {
    if (prev !== null && p - prev > 1) withGaps.push('...');
    withGaps.push(p);
    prev = p;
  }

  const btnBase = {
    padding: '5px 10px', borderRadius: 6, border: '1.5px solid #d8e2ef',
    cursor: 'pointer', fontSize: 12, fontWeight: 700, minWidth: 32, textAlign: 'center',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 4px', flexWrap: 'wrap', gap: 8 }}>
      <span style={{ fontSize: 12, color: '#6b7a90', fontWeight: 600 }}>
        Showing <strong style={{ color: '#0b1e3d' }}>{start}–{end}</strong> of <strong style={{ color: '#0b1e3d' }}>{total}</strong>
      </span>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          style={{ ...btnBase, background: page === 1 ? '#f3f7fc' : 'white', color: page === 1 ? '#b0b8c8' : '#0d7377', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
        >‹ Prev</button>

        {withGaps.map((p, i) =>
          p === '...'
            ? <span key={`gap-${i}`} style={{ padding: '5px 4px', fontSize: 12, color: '#6b7a90' }}>…</span>
            : <button
                key={p}
                onClick={() => onPage(p)}
                style={{ ...btnBase, background: p === page ? '#0d7377' : 'white', color: p === page ? 'white' : '#334155', borderColor: p === page ? '#0d7377' : '#d8e2ef' }}
              >{p}</button>
        )}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          style={{ ...btnBase, background: page === totalPages ? '#f3f7fc' : 'white', color: page === totalPages ? '#b0b8c8' : '#0d7377', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
        >Next ›</button>
      </div>
    </div>
  );
}
