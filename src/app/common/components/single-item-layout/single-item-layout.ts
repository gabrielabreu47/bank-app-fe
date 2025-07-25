import {Component, inject, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-single-item-layout',
  imports: [],
  templateUrl: './single-item-layout.html',
  styleUrl: './single-item-layout.scss'
})
export class SingleItemLayout {
  private readonly router = inject(Router)
  @Input({required: true}) backRoute!: string

  handleBack() {
    this.router.navigate([this.backRoute])
  }
}
