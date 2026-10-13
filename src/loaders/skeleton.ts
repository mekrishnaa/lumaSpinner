import type { LoaderDefinition, ResolvedSpinnerOptions, SkeletonVariant } from '../types/index.js';

function bone(type: 'rect' | 'circle' | 'line', shimmer: boolean, style?: Partial<CSSStyleDeclaration>): HTMLElement {
  const el = document.createElement('div');
  el.className = `luma-spinner-skeleton__bone luma-spinner-skeleton__bone--${type} luma-skeleton__bone luma-skeleton__bone--${type}${shimmer ? ' luma-spinner-skeleton--shimmer luma-skeleton--shimmer' : ''}`;
  if (style) {
    Object.assign(el.style, style);
  }
  return el;
}

interface BuildOptions {
  rows: number;
  lines: number;
  hasAvatar: boolean;
  shimmer: boolean;
}

function buildCard(opts: BuildOptions): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'luma-spinner-skeleton luma-spinner-skeleton--card luma-skeleton luma-skeleton--card';

  // Author / Header mini-row
  const authorRow = document.createElement('div');
  authorRow.className = 'luma-spinner-skeleton__card-header luma-skeleton__card-header';
  const miniAvatar = bone('circle', opts.shimmer, { width: '32px', height: '32px' });
  const authorInfo = document.createElement('div');
  authorInfo.style.cssText = 'display:flex;flex-direction:column;gap:4px;flex:1;';
  const authorName = bone('line', opts.shimmer, { width: '35%', height: '11px' });
  const authorTime = bone('line', opts.shimmer, { width: '20%', height: '9px' });
  authorInfo.appendChild(authorName);
  authorInfo.appendChild(authorTime);
  authorRow.appendChild(miniAvatar);
  authorRow.appendChild(authorInfo);
  wrap.appendChild(authorRow);

  // Media Banner
  const img = bone('rect', opts.shimmer, { height: '130px', borderRadius: '10px' });
  wrap.appendChild(img);

  // Title line
  const title = bone('line', opts.shimmer, { width: '75%', height: '15px' });
  wrap.appendChild(title);

  // Body lines with natural varying lengths
  const widths = ['100%', '85%', '60%'];
  const count = Math.max(1, opts.lines);
  for (let i = 0; i < count; i++) {
    const w = widths[i % widths.length];
    const line = bone('line', opts.shimmer, { width: w, height: '11px' });
    wrap.appendChild(line);
  }

  // Footer action pill
  const footerRow = document.createElement('div');
  footerRow.className = 'luma-spinner-skeleton__card-footer luma-skeleton__card-footer';
  const badge = bone('rect', opts.shimmer, { width: '72px', height: '22px', borderRadius: '9999px' });
  const time = bone('line', opts.shimmer, { width: '48px', height: '10px' });
  footerRow.appendChild(badge);
  footerRow.appendChild(time);
  wrap.appendChild(footerRow);

  return wrap;
}

function buildList(opts: BuildOptions): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'luma-spinner-skeleton luma-spinner-skeleton--list luma-skeleton luma-skeleton--list';
  const rowCount = Math.max(1, opts.rows);

  const titleWidths = ['45%', '55%', '38%', '60%', '50%'];
  const descWidths = ['85%', '72%', '90%', '65%', '80%'];

  for (let r = 0; r < rowCount; r++) {
    const row = document.createElement('div');
    row.className = 'luma-spinner-skeleton__row luma-skeleton__row';

    if (opts.hasAvatar) {
      const avatar = bone('circle', opts.shimmer, { width: '40px', height: '40px', flexShrink: '0' });
      row.appendChild(avatar);
    }

    const lines = document.createElement('div');
    lines.className = 'luma-spinner-skeleton__lines luma-skeleton__lines';
    const titleLine = bone('line', opts.shimmer, {
      width: titleWidths[r % titleWidths.length],
      height: '13px',
    });
    lines.appendChild(titleLine);

    for (let l = 1; l < opts.lines; l++) {
      const line = bone('line', opts.shimmer, {
        width: descWidths[(r + l) % descWidths.length],
        height: '11px',
      });
      lines.appendChild(line);
    }
    row.appendChild(lines);

    // Trailing badge/timestamp pill
    const trailing = bone('rect', opts.shimmer, {
      width: '44px',
      height: '18px',
      borderRadius: '9999px',
      flexShrink: '0',
      marginLeft: 'auto',
    });
    row.appendChild(trailing);

    wrap.appendChild(row);
  }
  return wrap;
}

function buildProfile(opts: BuildOptions): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'luma-spinner-skeleton luma-spinner-skeleton--profile luma-skeleton luma-skeleton--profile';

  // 1. Cover Banner at top
  const cover = bone('rect', opts.shimmer, {
    height: '64px',
    borderRadius: '8px',
    width: '100%',
  });
  cover.classList.add('luma-spinner-skeleton__profile-cover', 'luma-skeleton__profile-cover');
  wrap.appendChild(cover);

  // 2. Avatar & Action Button Row (aligned in normal document flow below banner)
  const bar = document.createElement('div');
  bar.className = 'luma-spinner-skeleton__profile-bar luma-skeleton__profile-bar';

  const avatar = bone('circle', opts.shimmer, {
    width: '44px',
    height: '44px',
    flexShrink: '0',
    borderRadius: '50%',
  });
  avatar.classList.add('luma-spinner-skeleton__profile-avatar', 'luma-skeleton__profile-avatar');

  const actionBtn = bone('rect', opts.shimmer, {
    width: '76px',
    height: '24px',
    borderRadius: '9999px',
    flexShrink: '0',
  });
  actionBtn.classList.add('luma-spinner-skeleton__profile-btn', 'luma-skeleton__profile-btn');

  bar.appendChild(avatar);
  bar.appendChild(actionBtn);
  wrap.appendChild(bar);

  // 3. Name & Handle
  const info = document.createElement('div');
  info.className = 'luma-spinner-skeleton__lines luma-skeleton__lines';
  info.style.cssText = 'gap: 4px;';
  const name = bone('line', opts.shimmer, { width: '36%', height: '13px' });
  const handle = bone('line', opts.shimmer, { width: '22%', height: '10px' });
  info.appendChild(name);
  info.appendChild(handle);
  wrap.appendChild(info);

  // 4. Bio lines (up to 2 lines)
  const bioCount = Math.min(2, Math.max(1, opts.lines));
  for (let i = 0; i < bioCount; i++) {
    const w = i === bioCount - 1 ? '55%' : '88%';
    const line = bone('line', opts.shimmer, { width: w, height: '10px' });
    wrap.appendChild(line);
  }

  // 5. Stats row (3 clean rounded pills)
  const stats = document.createElement('div');
  stats.className = 'luma-spinner-skeleton__stats-row luma-skeleton__stats-row';
  stats.appendChild(bone('rect', opts.shimmer, { width: '56px', height: '14px', borderRadius: '9999px' }));
  stats.appendChild(bone('rect', opts.shimmer, { width: '56px', height: '14px', borderRadius: '9999px' }));
  stats.appendChild(bone('rect', opts.shimmer, { width: '56px', height: '14px', borderRadius: '9999px' }));
  wrap.appendChild(stats);

  return wrap;
}

function buildTable(opts: BuildOptions): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'luma-spinner-skeleton luma-spinner-skeleton--table luma-skeleton luma-skeleton--table';

  const colWidths = ['45%', '70%', '50%', '60%'];

  // Table header
  const header = document.createElement('div');
  header.className = 'luma-spinner-skeleton__table-row luma-spinner-skeleton__table-row--header luma-skeleton__table-row luma-skeleton__table-row--header';
  for (let c = 0; c < 4; c++) {
    const cell = bone('line', opts.shimmer, { width: colWidths[c], height: '12px' });
    header.appendChild(cell);
  }
  wrap.appendChild(header);

  // Table body rows
  const rowCount = Math.max(1, opts.rows);
  const rowCellWidths = [
    ['60%', '85%', '40%', '75%'],
    ['45%', '70%', '65%', '50%'],
    ['75%', '60%', '55%', '80%'],
    ['50%', '90%', '45%', '60%'],
  ];

  for (let r = 0; r < rowCount; r++) {
    const row = document.createElement('div');
    row.className = 'luma-spinner-skeleton__table-row luma-skeleton__table-row';
    const widths = rowCellWidths[r % rowCellWidths.length];
    for (let c = 0; c < 4; c++) {
      const cell = bone('line', opts.shimmer, { width: widths[c], height: '11px' });
      row.appendChild(cell);
    }
    wrap.appendChild(row);
  }
  return wrap;
}

function buildVariant(variant: SkeletonVariant, opts: BuildOptions): HTMLElement {
  switch (variant) {
    case 'card': return buildCard(opts);
    case 'list': return buildList(opts);
    case 'profile': return buildProfile(opts);
    case 'table': return buildTable(opts);
    case 'avatar': {
      const wrap = document.createElement('div');
      wrap.className = 'luma-spinner-skeleton luma-skeleton';
      wrap.appendChild(bone('circle', opts.shimmer, { width: '52px', height: '52px' }));
      return wrap;
    }
    case 'line': {
      const wrap = document.createElement('div');
      wrap.className = 'luma-spinner-skeleton luma-skeleton';
      for (let i = 0; i < opts.lines; i++) {
        wrap.appendChild(bone('line', opts.shimmer, { width: i === opts.lines - 1 ? '60%' : '100%' }));
      }
      return wrap;
    }
    case 'circle': {
      const wrap = document.createElement('div');
      wrap.className = 'luma-spinner-skeleton luma-skeleton';
      wrap.appendChild(bone('circle', opts.shimmer, { width: '56px', height: '56px' }));
      return wrap;
    }
    case 'rectangle': {
      const wrap = document.createElement('div');
      wrap.className = 'luma-spinner-skeleton luma-skeleton';
      wrap.appendChild(bone('rect', opts.shimmer, { height: '130px', borderRadius: '10px' }));
      return wrap;
    }
    default: return buildCard(opts);
  }
}

export const skeletonLoader: LoaderDefinition = {
  name: 'skeleton',
  create(options: ResolvedSpinnerOptions): HTMLElement {
    const el = document.createElement('div');
    el.className = 'luma-spinner-loader luma-spinner-loader--skeleton luma-loader luma-loader--skeleton';
    el.setAttribute('aria-hidden', 'true');

    const skeletonOpts = options.skeleton ?? {};

    if (skeletonOpts.element) {
      el.appendChild(skeletonOpts.element);
      return el;
    }

    const variant = skeletonOpts.variant ?? 'card';
    const shimmer = skeletonOpts.shimmer !== false;
    const gap = skeletonOpts.gap ?? 14;
    const rows = skeletonOpts.rows ?? 1;
    const lines = skeletonOpts.lines ?? 3;
    const hasAvatar = skeletonOpts.avatar ?? false;

    el.style.setProperty('--luma-spinner-skeleton-gap', `${gap}px`);
    el.style.setProperty('--luma-skeleton-gap', `${gap}px`);
    if (options.color) {
      el.style.setProperty('--luma-spinner-color', options.color);
      el.style.setProperty('--luma-color', options.color);
    }

    const content = buildVariant(variant, { rows, lines, hasAvatar, shimmer });
    el.appendChild(content);
    return el;
  },
  update(element: HTMLElement, options: ResolvedSpinnerOptions): void {
    element.innerHTML = '';
    const newEl = skeletonLoader.create(options);
    while (newEl.firstChild) {
      element.appendChild(newEl.firstChild);
    }
  },
};
