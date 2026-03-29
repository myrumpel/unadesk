export function offsetInRoot(root: HTMLElement, node: Node, offset: number): number {
  const r = document.createRange();
  r.setStart(root, 0);
  r.setEnd(node, offset);
  return r.toString().length;
}

export function hasLiveRangeInRoot(root: HTMLElement): boolean {
  const s = window.getSelection();
  if (s == null || s.rangeCount === 0 || s.isCollapsed) return false;
  const a = s.anchorNode;
  const f = s.focusNode;
  return a != null && root.contains(a) && f != null && root.contains(f);
}

export function panelContains(panel: HTMLElement | undefined, n: Node | null): boolean {
  return panel != null && n != null && panel.contains(n);
}
