import { WritableSignal } from '@angular/core';
import { submit } from '@angular/forms/signals';

import { EditableArticle } from '@core/models/article.model';

import { ArticlesService } from '@services/articles.service';

import { createNewArticleForm } from './home-form.setup';

type NewArticleForm = ReturnType<typeof createNewArticleForm>;

export async function submitNewArticle(
  newArticleForm: NewArticleForm,
  newArticleModel: WritableSignal<EditableArticle>,
  articlesService: ArticlesService,
  onSuccess: () => void,
): Promise<void> {
  if (
    !(await submit(newArticleForm, {
      action: async () => {
        const { title, body } = newArticleModel();
        articlesService.add({ title, body });
        return null;
      },
    }))
  ) {
    return;
  }
  onSuccess();
}
