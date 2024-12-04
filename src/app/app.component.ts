import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegistrarProductoComponent } from './component/registrar-producto/registrar-producto.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegistrarProductoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '242CC341AngularSigvitFrontend';
}
