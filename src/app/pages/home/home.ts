import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormField, FormRoot } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { EditableArticle } from '@core/models/article.model';

import { ArticlesService } from '@services/articles.service';

import { ArticleDate } from '@shared/ui/article-date/article-date';
import { Button } from '@shared/ui/button/button';
import { ButtonVariant } from '@shared/ui/button/models';
import { Card } from '@shared/ui/card/card';
import { Input } from '@shared/ui/input/input';
import { Modal } from '@shared/ui/modal/modal';

import { submitNewArticle } from './home-create-article';
import { createNewArticleForm } from './home-form.setup';

@Component({
  selector: 'uk-home',
  imports: [Button, Card, RouterOutlet, Modal, FormRoot, FormsModule, FormField, Input, ArticleDate],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  readonly newArticleModel = signal<EditableArticle>({ title: '', body: '' });
  readonly newArticleForm = createNewArticleForm(this.newArticleModel);
  protected readonly articlesService = inject(ArticlesService);
  protected readonly newArticleOpen = signal(false);
  protected readonly ButtonVariant = ButtonVariant;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  onCreateArticle = async (): Promise<void> => {
    await submitNewArticle(this.newArticleForm, this.newArticleModel, this.articlesService, () => {
      this.newArticleModel.set({ title: '', body: '' });
      this.newArticleOpen.set(false);
    });
  };

  closeNewArticleModal(): void {
    this.newArticleOpen.set(false);
  }

  protected openDetail(id: string): void {
    void this.router.navigate([id], { relativeTo: this.route });
  }
}
