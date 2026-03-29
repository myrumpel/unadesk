import { WritableSignal } from '@angular/core';
import { type FieldTree, form, maxLength, minLength, required } from '@angular/forms/signals';

import { TextAnnotation } from '@core/models/annotation.model';
import { EditableArticle } from '@core/models/article.model';

import {
  ANNOTATION_NOTE_MAX,
  ARTICLE_BODY_MAX,
  ARTICLE_BODY_MIN,
  ARTICLE_TITLE_MAX,
  ARTICLE_TITLE_MIN,
} from '@shared/constants';

export function createAnnotationForm(model: WritableSignal<TextAnnotation>): FieldTree<TextAnnotation> {
  return form(model, e => {
    required(e.note);
    required(e.color);
    minLength(e.note, 1, { message: 'Длина аннотации должна быть более 1 символа' });
    maxLength(e.note, ANNOTATION_NOTE_MAX, {
      message: 'Длина аннотации должна быть не более 50 символов',
    });
  });
}

export function createEditArticleForm(model: WritableSignal<EditableArticle>): FieldTree<EditableArticle> {
  return form(model, f => {
    required(f.title);
    required(f.body);
    minLength(f.title, ARTICLE_TITLE_MIN, { message: 'Минимум 5 символа' });
    maxLength(f.title, ARTICLE_TITLE_MAX, { message: 'Максимум 100 символов' });
    minLength(f.body, ARTICLE_BODY_MIN, { message: 'Минимум 5 символов' });
    maxLength(f.body, ARTICLE_BODY_MAX, { message: 'Максимум 300 символов' });
  });
}
