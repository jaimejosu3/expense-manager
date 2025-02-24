import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private snackBar: MatSnackBar) { }

  handleError(error: any) {
    let message = 'Ha ocurrido un error';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      message = error.error.message;
    } else if (error.error?.message) {
      // Error del servidor con mensaje
      message = error.error.message;
    } else if (error.status === 0) {
      message = 'No se puede conectar con el servidor';
    } else if (error.status === 401) {
      message = 'Sesión expirada. Por favor, vuelva a iniciar sesión';
    }

    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}