import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ivr-json-model-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ivr-json-model-panel.component.html',
  styleUrl: './ivr-json-model-panel.component.scss'
})
export class IvrJsonModelPanelComponent {
  @Input({ required: true }) jsonInput = '';
  @Input() parseError: string | null = null;

  @Output() jsonInputChange = new EventEmitter<string>();
  @Output() importJson = new EventEmitter<void>();
  @Output() loadSample = new EventEmitter<void>();
}
