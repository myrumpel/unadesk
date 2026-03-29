import { WritableSignal } from '@angular/core';
import { submit } from '@angular/forms/signals';

import { TextAnnotation } from '@core/models/annotation.model';
import { Article } from '@core/models/article.model';

import { ArticlesService } from '@services/articles.service';

import {
  ANNOTATION_ID_LEN,
  ARTICLE_ANNOTATION_SAVE_FAILED_MESSAGE,
} from '@shared/constants';

import { createAnnotationForm } from './detail-form.setup';

type AnnotationForm = ReturnType<typeof createAnnotationForm>;

export async function saveAnnotationFromForm(
  article: Article,
  annotationForm: AnnotationForm,
  annotationModel: WritableSignal<TextAnnotation>,
  articlesService: ArticlesService,
  onSuccess: () => void,
): Promise<void> {
  if (!(await submit(annotationForm, { action: async () => null }))) return;

  const m = annotationModel();
  const ok = articlesService.tryAddAnnotation(article.id, {
    id: crypto.randomUUID().slice(0, ANNOTATION_ID_LEN),
    start: m.start,
    end: m.end,
    color: m.color,
    note: m.note.trim(),
  });
  if (!ok) {
    window.alert(ARTICLE_ANNOTATION_SAVE_FAILED_MESSAGE);
    return;
  }
  onSuccess();
}
