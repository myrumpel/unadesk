import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'uk-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {}
