import type { TextAnnotation } from './annotation.model';

export interface Article {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly createdAt: string;
  readonly updatedAt: string | null;
  readonly annotations?: readonly TextAnnotation[];
}

export interface EditableArticle {
  title: string;
  body: string;
}
