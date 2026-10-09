export function wrapFeedIndex(index: number, total: number) {
  if (total <= 0) return 0
  return ((index % total) + total) % total
}
