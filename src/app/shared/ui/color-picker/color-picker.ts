import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';

@Component({
  selector: 'uk-color-picker',
  imports: [NgStyle, NgClass],
  templateUrl: './color-picker.html',
  styleUrl: './color-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPicker {
  public readonly colors = input<string[]>([]);
  public readonly value = model<string>('');
  protected readonly customInputFacadeColor = signal<string | null>(null);

  protected pickColor(color: string): void {
    this.value.set(color);
    this.customInputFacadeColor.set(null);
  }

  protected onValueInput(e: Event): void {
    const el = e.target as HTMLInputElement;
    this.value.set(el.value);
    this.customInputFacadeColor.set(el.value);
  }
}
