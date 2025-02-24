import { AbstractControl, ValidationErrors } from '@angular/forms';

export const passwordValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);

    const valid = hasUpperCase && hasLowerCase && hasNumeric;

    return !valid ? { password: true } : null;
};