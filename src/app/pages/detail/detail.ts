import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, FormRoot } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { TextAnnotation } from '@core/models/annotation.model';
import { Article, EditableArticle } from '@core/models/article.model';
import { ArticleBodySegment, buildArticleBodySegments } from '@core/utils/article-body-segments';

import { ArticlesService } from '@services/articles.service';

import { ANNOTATION_HEX } from '@shared/constants';
import { ArticleDate } from '@shared/ui/article-date/article-date';
import { Button } from '@shared/ui/button/button';
import { ButtonVariant } from '@shared/ui/button/models';
import { Card } from '@shared/ui/card/card';
import { ColorPicker } from '@shared/ui/color-picker/color-picker';
import { Input } from '@shared/ui/input/input';
import { Modal } from '@shared/ui/modal/modal';

import { ArticleReadonlyBody } from './article-readonly-body/article-readonly-body';
import { bindDetailDomListeners } from './detail-dom.listeners';
import { createAnnotationForm, createEditArticleForm } from './detail-form.setup';
import { saveAnnotationFromForm } from './detail-save-annotation';
import { type DetailSelectionDeps, onDetailDocumentClick, onDetailSelectionChange } from './detail-selection.handlers';

@Component({
  selector: 'uk-detail',
  imports: [
    ArticleReadonlyBody,
    Card,
    Button,
    FormsModule,
    Modal,
    ReactiveFormsModule,
    Input,
    FormField,
    FormRoot,
    ArticleDate,
    NgStyle,
    ColorPicker,
  ],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Detail implements OnInit {
  protected ANNOTATION_HEX = ANNOTATION_HEX;
  protected readonly annotationModel = signal<TextAnnotation>({ id: '', start: 0, end: 0, note: '', color: '' });
  protected readonly annotationForm = createAnnotationForm(this.annotationModel);
  protected readonly annotationPanelShow = signal(false);
  protected readonly ButtonVariant = ButtonVariant;
  protected readonly deleteIsOpen = signal(false);
  protected readonly editIsOpen = signal(false);
  protected readonly editModel = signal<EditableArticle>({ title: '', body: '' });
  protected readonly editForm = createEditArticleForm(this.editModel);

  private readonly bodyCmp = viewChild(ArticleReadonlyBody);
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly destroyRef = inject(DestroyRef);
  private readonly articlesService = inject(ArticlesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly articleId = toSignal(this.route.paramMap.pipe(map(m => m.get('id'))), {
    initialValue: null as string | null,
  });

  protected readonly article = computed(() => {
    const id = this.articleId();
    return id == null ? null : (this.articlesService.articles().find(a => a.id === id) ?? null);
  });

  protected readonly bodySegments = computed<ArticleBodySegment[]>(() => {
    const a = this.article();
    return a == null ? [] : buildArticleBodySegments(a.body, a.annotations);
  });

  ngOnInit(): void {
    const deps: DetailSelectionDeps = {
      getRoot: () => this.bodyCmp()?.rootElement(),
      getPanel: () => this.panelRef()?.nativeElement,
      getArticle: () => this.article(),
      getPanelOpen: () => this.annotationPanelShow(),
      setPanelOpen: v => this.annotationPanelShow.set(v),
      setDraft: v => this.annotationModel.set(v),
    };

    bindDetailDomListeners(this.destroyRef, () => onDetailSelectionChange(deps), ev =>
      onDetailDocumentClick(deps, ev),
    );
  }

  editArticle(a: Article): void {
    this.editModel.set({ title: a.title, body: a.body });
    this.editIsOpen.set(true);
  }

  saveEditArticle(id: string): void {
    this.articlesService.editArticle(id, this.editModel());
    this.editModel.set({ title: '', body: '' });
    this.editIsOpen.set(false);
  }

  protected async saveAnnotation(): Promise<void> {
    const art = this.article();
    if (art == null) return;

    await saveAnnotationFromForm(art, this.annotationForm, this.annotationModel, this.articlesService, () =>
      this.resetAnnotationUi(),
    );
  }

  protected goHome(): void {
    void this.router.navigate(['/']);
  }

  protected cancelAnnotation(): void {
    this.resetAnnotationUi();
  }

  protected deleteArticle(id: string): void {
    this.articlesService.deleteArticle(id);
    this.deleteIsOpen.set(false);
    void this.router.navigate(['/']);
  }

  private resetAnnotationUi(): void {
    this.annotationPanelShow.set(false);
    window.getSelection()?.removeAllRanges();
    this.annotationModel.set({ id: '', start: 0, end: 0, note: '', color: '' });
  }
}
