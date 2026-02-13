import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ExitOutcomeDefinitionForm,
  ExitOutcomeDefinitionsComponent
} from './exit-outcome-definitions.component';
import { ExitOutcomeDefinition } from './opening-hours.model';
import { OpeningHoursService } from './opening-hours.service';

@Component({
  selector: 'app-exit-outcome-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ExitOutcomeDefinitionsComponent],
  templateUrl: './exit-outcome-admin.component.html',
  styleUrl: './exit-outcome-admin.component.scss'
})
export class ExitOutcomeAdminComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(OpeningHoursService);

  readonly exitOutcomeForms = this.fb.array<ExitOutcomeDefinitionForm>([]);
  readonly serializedOutcomes = computed(() =>
    JSON.stringify(this.buildExitOutcomesFromForm(), null, 2)
  );

  constructor() {
    this.hydrateExitOutcomes(this.service.scheduleV2().exitOutcomes);
  }

  addExitOutcome(): void {
    this.exitOutcomeForms.push(
      this.createExitOutcomeForm({
        id: `outcome-${this.exitOutcomeForms.length + 1}`,
        name: `Outcome ${this.exitOutcomeForms.length + 1}`,
        color: '#546e7a'
      })
    );
  }

  removeExitOutcome(index: number): void {
    if (this.exitOutcomeForms.length <= 1) {
      return;
    }
    this.exitOutcomeForms.removeAt(index);
  }

  save(): void {
    if (this.exitOutcomeForms.invalid) {
      this.exitOutcomeForms.markAllAsTouched();
      return;
    }
    this.service.updateExitOutcomes(this.buildExitOutcomesFromForm());
  }

  private createExitOutcomeForm(outcome: ExitOutcomeDefinition): ExitOutcomeDefinitionForm {
    return this.fb.nonNullable.group({
      id: [outcome.id, Validators.required],
      name: [outcome.name, Validators.required],
      color: [outcome.color, Validators.required]
    });
  }

  private hydrateExitOutcomes(exitOutcomes: ExitOutcomeDefinition[]): void {
    this.exitOutcomeForms.clear();
    exitOutcomes.forEach((outcome) =>
      this.exitOutcomeForms.push(this.createExitOutcomeForm(outcome))
    );
  }

  private buildExitOutcomesFromForm(): ExitOutcomeDefinition[] {
    return this.exitOutcomeForms.getRawValue().map((outcome, index) => ({
      id: outcome.id.trim() || `outcome-${index + 1}`,
      name: outcome.name.trim() || outcome.id.trim() || `Outcome ${index + 1}`,
      color: outcome.color || '#546e7a'
    }));
  }
}

