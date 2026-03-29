import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'uk-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  readonly open = input<boolean>(false);
  readonly closeModal = output();
}
