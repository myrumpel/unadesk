import { Injectable, signal } from '@angular/core';

import { TextAnnotation } from '@core/models/annotation.model';
import { Article } from '@core/models/article.model';
import { annotationOverlapsAny } from '@core/utils/article-body-segments';

const STORAGE_KEY = 'uk.articles.v1';
const ARTICLE_ID_LEN = 6;

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private readonly _articles = signal<Article[]>(this._loadFromStorage());

  readonly articles = this._articles.asReadonly();

  add(payload: Pick<Article, 'title' | 'body'>): Article {
    const article: Article = {
      id: crypto.randomUUID().slice(0, ARTICLE_ID_LEN),
      title: payload.title.trim(),
      body: payload.body.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: null,
      annotations: [],
    };
    this._articles.update(list => [article, ...list]);
    this._updateLocalStorage();
    return article;
  }

  deleteArticle(id: string): void {
    this._articles.update(list => list.filter(a => a.id !== id));
    this._updateLocalStorage();
  }

  tryAddAnnotation(articleId: string, annotation: TextAnnotation): boolean {
    let saved = false;
    this._articles.update(list => {
      return list.map(a => {
        if (a.id !== articleId) return a;
        const existing = [...(a.annotations ?? [])];
        if (annotation.start < 0 || annotation.end > a.body.length || annotation.start >= annotation.end) {
          return a;
        }
        if (annotationOverlapsAny(existing, annotation)) {
          return a;
        }
        existing.push(annotation);
        saved = true;
        return { ...a, annotations: existing };
      });
    });
    if (saved) {
      this._updateLocalStorage();
    }
    return saved;
  }

  editArticle(id: string, data: Pick<Article, 'title' | 'body'>): void {
    const title = data.title.trim();
    const body = data.body.trim();
    this._articles.update(list =>
      list.map(a => {
        if (a.id !== id) return a;
        const bodyChanged = body !== a.body;
        return {
          ...a,
          title,
          body,
          updatedAt: new Date().toISOString(),
          annotations: bodyChanged ? [] : a.annotations,
        };
      }),
    );
    this._updateLocalStorage();
  }

  private _updateLocalStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._articles()));
    } catch (e) {
      console.error('Не удалось сохранить статьи в Local Storage', e);
    }
  }

  private _loadFromStorage(): Article[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw == null) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed as Article[];
    } catch (e) {
      if (e instanceof Error) {
        console.error('Произошла ошибка загрузки статей:', e.message);
        return [];
      }
      console.error('Произошла ошибка загрузки статей');
      return [];
    }
  }
}
