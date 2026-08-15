/**
 * Componente raiz de la aplicacion.
 *
 * Se reduce deliberadamente a un unico <router-outlet>: toda la interfaz
 * real vive en los componentes de features/ (login, dashboards), cargados
 * segun la ruta activa. Mantener el componente raiz minimo evita logica
 * duplicada o acoplada aqui que deberia vivir en un feature especifico.
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
