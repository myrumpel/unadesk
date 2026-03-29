import { Pipe, PipeTransform } from '@angular/core';

import { ButtonVariant, ButtonVariantId } from '@shared/ui/button/models';

type ButtonClasses = Record<ButtonVariantId, ButtonVariantId>;
const buttonClasses: ButtonClasses = {
  primary: 'primary',
  secondary: 'secondary',
  danger: 'danger',
};

@Pipe({
  name: 'defineVariant',
})
export class DefineVariantPipe implements PipeTransform {
  transform(value: ButtonVariantId): string {
    const baseClass = 'button--';
    switch (value) {
      case ButtonVariant.PRIMARY:
        return baseClass + buttonClasses.primary;

      case ButtonVariant.SECONDARY:
        return baseClass + buttonClasses.secondary;

      case ButtonVariant.DANGER:
        return baseClass + buttonClasses.danger;
    }
  }
}
