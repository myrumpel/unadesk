import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';

@Component({
  selector: 'uk-input',
  imports: [NgTemplateOutlet],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Input {
  readonly value = model<string>('');
  readonly invalid = input(false);
  readonly touched = input(false);
  readonly errors = input<ValidationError.WithOptionalFieldTree[]>([]);
  readonly touchedChange = output();
  readonly labelText = input.required<string>();
  readonly multiline = input<boolean>(false);
  readonly placeholder = input<string | null>(null);

  protected readonly onValueInput = (event: Event): void => {
    const el = event.target;
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      this.value.set(el.value);
    }
  };
}
