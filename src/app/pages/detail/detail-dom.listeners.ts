import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent } from 'rxjs';

import { SELECTION_DEBOUNCE_MS } from '@shared/constants';

export function bindDetailDomListeners(
  destroyRef: DestroyRef,
  onSelectionChange: () => void,
  onDocumentClick: (ev: Event) => void,
): void {
  fromEvent(document, 'selectionchange')
    .pipe(debounceTime(SELECTION_DEBOUNCE_MS), takeUntilDestroyed(destroyRef))
    .subscribe(onSelectionChange);

  fromEvent(document, 'click', { capture: true })
    .pipe(takeUntilDestroyed(destroyRef))
    .subscribe(onDocumentClick);
}
