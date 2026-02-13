import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export type ExitOutcomeDefinitionForm = FormGroup<{
  id: FormControl<string>;
  name: FormControl<string>;
  color: FormControl<string>;
}>;

@Component({
  selector: 'app-exit-outcome-definitions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exit-outcome-definitions.component.html',
  styleUrl: './exit-outcome-definitions.component.scss'
})
export class ExitOutcomeDefinitionsComponent {
  @Input({ required: true }) outcomes!: FormArray<ExitOutcomeDefinitionForm>;
  @Output() add = new EventEmitter<void>();
  @Output() remove = new EventEmitter<number>();

  onAdd(): void {
    this.add.emit();
  }

  onRemove(index: number): void {
    this.remove.emit(index);
  }
}

