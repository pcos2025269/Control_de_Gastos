/**
 * Componente de inicio de sesion.
 *
 * Es un componente standalone (sin NgModule), el enfoque actual de
 * Angular, lo que simplifica la estructura del proyecto: cada componente
 * declara explicitamente sus propias dependencias (ReactiveFormsModule,
 * etc.) en vez de depender de un modulo compartido.
 *
 * Usa Reactive Forms en vez de Template-driven Forms porque la validacion
 * y el manejo de estado del formulario quedan mas explicitos y testeables
 * en el codigo TypeScript, algo deseable en un formulario de credenciales.
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // Se usa inject() en vez de recibir estas dependencias por constructor
  // porque los campos de clase (como loginForm, abajo) se inicializan
  // antes de que el cuerpo del constructor se ejecute; inject() si esta
  // disponible en ese punto dentro del contexto de inyeccion de Angular.
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  readonly errorMessage = signal<string | null>(null);
  readonly isSubmitting = signal(false);

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    const { username, password } = this.loginForm.getRawValue();

    this.authService
      .login({ username: username!, password: password! })
      .subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          // La redireccion post-login depende del rol: cada tipo de
          // usuario aterriza en su propio panel, en lugar de una unica
          // pantalla generica.
          const destination =
            response.user.role === 'admin' ? '/admin' : '/user';
          this.router.navigate([destination]);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            error.status === 401
              ? 'Usuario o contrasena incorrectos'
              : 'Ocurrio un error al iniciar sesion. Intenta de nuevo.'
          );
        },
      });
  }
}
