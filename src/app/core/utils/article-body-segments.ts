import { TextAnnotation } from '@core/models/annotation.model';

export type ArticleBodySegment =
  | { kind: 'text'; text: string; key: string }
  | { kind: 'annotated'; text: string; annotation: TextAnnotation; key: string };

export function annotationRangesOverlap(a: TextAnnotation, b: TextAnnotation): boolean {
  return a.start < b.end && b.start < a.end;
}

export function annotationOverlapsAny(existing: readonly TextAnnotation[], next: TextAnnotation): boolean {
  return existing.some(e => annotationRangesOverlap(e, next));
}

export function buildArticleBodySegments(
  body: string,
  annotations: readonly TextAnnotation[] | undefined,
): ArticleBodySegment[] {
  if (body.length === 0) {
    return [];
  }

  if (annotations == null || annotations.length === 0) {
    return [{ kind: 'text', text: body, key: 't-0-' + body.length }];
  }

  const clamped = annotations
    .filter(a => a.start >= 0 && a.end <= body.length && a.start < a.end)
    .sort((x, y) => x.start - y.start || x.end - y.end);

  const nonOverlapping: TextAnnotation[] = [];
  for (const ann of clamped) {
    const last = nonOverlapping[nonOverlapping.length - 1];
    if (last != null && ann.start < last.end) {
      continue;
    }
    nonOverlapping.push(ann);
  }

  const out: ArticleBodySegment[] = [];
  let cursor = 0;
  for (const ann of nonOverlapping) {
    if (ann.start > cursor) {
      const text = body.slice(cursor, ann.start);
      out.push({ kind: 'text', text, key: `t-${cursor}-${text.length}` });
    }
    const text = body.slice(ann.start, ann.end);
    out.push({
      kind: 'annotated',
      text,
      annotation: ann,
      key: `a-${ann.id}`,
    });
    cursor = ann.end;
  }
  if (cursor < body.length) {
    const text = body.slice(cursor);
    out.push({ kind: 'text', text, key: `t-${cursor}-${text.length}` });
  }
  return out;
}
