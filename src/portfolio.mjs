/** @typedef {'work' | 'case-studies'} PortfolioSection */

// 한·영이 같은 slug를 공유하므로 분류도 한곳에서 관리한다.
const workSlugs = new Set([
  'chaisa', 'witim-identity', 'yeosu-saegomak', 'refine-clinic',
  'witim-ax-studio', '3w-website-brochure', '3w-hospital-brochure',
  'wiblog', 'witim-brand-communication', 'witim-rebranding', 'oneq-pivot', 'sga100',
]);

/** @param {string} slug @returns {PortfolioSection} */
export function portfolioSection(slug) {
  return workSlugs.has(slug) ? 'work' : 'case-studies';
}

/**
 * @template {{ id: string }} T
 * @param {T[]} entries
 * @param {PortfolioSection} [section]
 * @returns {T[]}
 */
export function selectPortfolio(entries, section) {
  return entries.filter((entry) => {
    const slug = entry.id.split('/').slice(1).join('/');
    return !section || portfolioSection(slug) === section;
  });
}
