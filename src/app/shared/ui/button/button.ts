import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonType, ButtonVariant, ButtonVariantId } from '@shared/ui/button/models';
import { DefineVariantPipe } from '@shared/ui/button/pipes/define-variant.pipe';

type ButtonSize = 'middle' | 'small';

@Component({
  selector: 'uk-button',
  imports: [DefineVariantPipe, NgStyle],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly variant = input<ButtonVariantId>(ButtonVariant.SECONDARY);
  readonly type = input<ButtonType>('button');
  readonly disabled = input<boolean>(false);
  readonly size = input<ButtonSize>('middle');

  readonly clicked = output<MouseEvent>();
}
