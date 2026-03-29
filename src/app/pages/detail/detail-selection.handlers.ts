import { TextAnnotation } from '@core/models/annotation.model';
import { Article } from '@core/models/article.model';
import { hasLiveRangeInRoot, offsetInRoot, panelContains } from '@core/utils/article-root-selection';

import { ANNOTATION_HEX } from '@shared/constants';

export interface DetailSelectionDeps {
  getRoot(): HTMLElement | undefined;
  getPanel(): HTMLElement | undefined;
  getArticle(): Article | null;
  getPanelOpen(): boolean;
  setPanelOpen(v: boolean): void;
  setDraft(v: TextAnnotation): void;
}

export function onDetailDocumentClick(deps: DetailSelectionDeps, ev: Event): void {
  if (!deps.getPanelOpen()) return;
  const t = ev.target;
  if (!(t instanceof Node)) return;
  if (panelContains(deps.getPanel(), t)) return;

  const root = deps.getRoot();
  if (root != null && root.contains(t) && hasLiveRangeInRoot(root)) return;

  deps.setPanelOpen(false);
  window.getSelection()?.removeAllRanges();
}

export function onDetailSelectionChange(deps: DetailSelectionDeps): void {
  const s = window.getSelection();
  if (s == null || s.rangeCount === 0 || s.isCollapsed) return;

  const root = deps.getRoot();
  const anchor = s.anchorNode;
  if (root == null || anchor == null || !root.contains(anchor)) return;

  const range = s.getRangeAt(0);
  let start = offsetInRoot(root, range.startContainer, range.startOffset);
  let end = offsetInRoot(root, range.endContainer, range.endOffset);
  if (start > end) [start, end] = [end, start];

  const art = deps.getArticle();
  if (art == null || end > art.body.length) return;

  deps.setDraft({
    id: '',
    start,
    end,
    note: '',
    color: ANNOTATION_HEX[0] ?? '#000000',
  });
  deps.setPanelOpen(true);
}
