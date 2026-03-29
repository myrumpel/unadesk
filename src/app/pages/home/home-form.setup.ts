import { WritableSignal } from '@angular/core';
import { type FieldTree, form, maxLength, minLength, required } from '@angular/forms/signals';

import { EditableArticle } from '@core/models/article.model';

import {
  ARTICLE_BODY_MAX,
  ARTICLE_BODY_MIN,
  ARTICLE_TITLE_MAX,
  ARTICLE_TITLE_MIN,
} from '@shared/constants';

export function createNewArticleForm(model: WritableSignal<EditableArticle>): FieldTree<EditableArticle> {
  return form(model, f => {
    required(f.title);
    required(f.body);
    minLength(f.title, ARTICLE_TITLE_MIN, { message: 'Минимум 5 символа' });
    maxLength(f.title, ARTICLE_TITLE_MAX, { message: 'Максимум 100 символов' });
    minLength(f.body, ARTICLE_BODY_MIN, { message: 'Минимум 5 символов' });
    maxLength(f.body, ARTICLE_BODY_MAX, { message: 'Максимум 300 символов' });
  });
}
