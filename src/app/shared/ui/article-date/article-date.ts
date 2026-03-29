import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'uk-article-date',
  imports: [DatePipe],
  templateUrl: './article-date.html',
  styleUrl: './article-date.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDate {
  public readonly createdAt = input.required<string>();
  public readonly updatedAt = input.required<string | null>();
}
