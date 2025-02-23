import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    constructor(private snackBar: MatSnackBar) { }

    handleError(error: any): void {
        let message = 'Ha ocurrido un error';

        if (error.error?.message) {
            message = error.error.message;
        } else if (error.message) {
            message = error.message;
        }

        this.snackBar.open(message, 'Cerrar', {
            duration: 3000
        });
    }
}