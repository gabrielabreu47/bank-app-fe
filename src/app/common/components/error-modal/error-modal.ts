import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {ErrorService} from '../../services/error-service';

@Component({
  selector: 'app-error-modal',
  imports: [],
  templateUrl: './error-modal.html',
  styleUrl: './error-modal.scss'
})
export class ErrorModal implements OnInit, OnDestroy {
  errorMessage: string | null = null;
  isVisible = false;
  private subscription!: Subscription;

  constructor(private errorService: ErrorService) {}

  ngOnInit() {
    this.subscription = this.errorService.error$.subscribe((message: string | null) => {
      this.errorMessage = message;
      this.isVisible = !!message;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  closeModal() {
    this.errorService.clearError();
  }
}
