import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ErrorModal} from './common/components/error-modal/error-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorModal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('bank-app');
}
