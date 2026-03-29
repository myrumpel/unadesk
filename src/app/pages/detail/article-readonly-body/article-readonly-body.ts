import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';

import { ArticleBodySegment } from '@core/utils/article-body-segments';

@Component({
  selector: 'uk-article-readonly-body',
  imports: [],
  templateUrl: './article-readonly-body.html',
  styleUrl: './article-readonly-body.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleReadonlyBody {
  readonly segments = input.required<ArticleBodySegment[]>();
  private readonly rootRef = viewChild<ElementRef<HTMLElement>>('root');

  rootElement(): HTMLElement | undefined {
    return this.rootRef()?.nativeElement;
  }
}
