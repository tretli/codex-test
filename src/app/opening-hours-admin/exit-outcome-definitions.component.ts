import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExitOutcomeId } from './opening-hours.model';

export type ExitOutcomeDefinitionForm = FormGroup<{
  id: FormControl<ExitOutcomeId>;
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
}

