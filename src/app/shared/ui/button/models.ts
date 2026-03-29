export type ButtonType = 'button' | 'submit' | 'reset';

export const ButtonVariant = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DANGER: 'danger',
} as const;

export type ButtonVariantId = (typeof ButtonVariant)[keyof typeof ButtonVariant];
