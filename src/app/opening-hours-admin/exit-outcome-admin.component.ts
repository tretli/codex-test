import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ExitOutcomeDefinitionForm,
  ExitOutcomeDefinitionsComponent
} from './exit-outcome-definitions.component';
import {
  ExitOutcomeDefinition,
  ExitOutcomeId,
  normalizeExitOutcomes
} from './opening-hours.model';
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
    this.hydrateExitOutcomes(
      normalizeExitOutcomes(this.service.scheduleV2().exitOutcomes)
    );
  }

  save(): void {
    if (this.exitOutcomeForms.invalid) {
      this.exitOutcomeForms.markAllAsTouched();
      return;
    }
    this.service.updateExitOutcomes(this.buildExitOutcomesFromForm());
  }

  private createExitOutcomeForm(outcome: ExitOutcomeDefinition): ExitOutcomeDefinitionForm {
    return this.fb.group({
      id: this.fb.nonNullable.control<ExitOutcomeId>(outcome.id, Validators.required),
      name: this.fb.nonNullable.control(outcome.name, Validators.required),
      color: this.fb.nonNullable.control(outcome.color, Validators.required)
    });
  }

  private hydrateExitOutcomes(exitOutcomes: ExitOutcomeDefinition[]): void {
    this.exitOutcomeForms.clear();
    exitOutcomes.forEach((outcome) =>
      this.exitOutcomeForms.push(this.createExitOutcomeForm(outcome))
    );
  }

  private buildExitOutcomesFromForm(): ExitOutcomeDefinition[] {
    return this.exitOutcomeForms.getRawValue().map((outcome) => ({
      id: outcome.id,
      name: outcome.name.trim() || `Outcome ${outcome.id}`,
      color: outcome.color || '#546e7a'
    }));
  }
}

