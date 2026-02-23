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
  openPaletteForIndex: number | null = null;

  readonly predefinedColors: ReadonlyArray<{ name: string; value: string }> = [
    { name: 'Forest', value: '#2e7d32' },
    { name: 'Lime', value: '#7cb342' },
    { name: 'Mint', value: '#26a69a' },
    { name: 'Teal', value: '#00897b' },
    { name: 'Cyan', value: '#00acc1' },
    { name: 'Sky', value: '#0288d1' },
    { name: 'Blue', value: '#1e88e5' },
    { name: 'Indigo', value: '#3949ab' },
    { name: 'Purple', value: '#5e35b1' },
    { name: 'Violet', value: '#8e24aa' },
    { name: 'Pink', value: '#d81b60' },
    { name: 'Rose', value: '#ad1457' },
    { name: 'Red', value: '#c62828' },
    { name: 'Coral', value: '#f4511e' },
    { name: 'Orange', value: '#ef6c00' },
    { name: 'Amber', value: '#ff8f00' },
    { name: 'Brown', value: '#6d4c41' },
    { name: 'Slate', value: '#546e7a' },
    { name: 'Gray', value: '#455a64' },
    { name: 'Charcoal', value: '#263238' }
  ] as const;

  onPresetColorSelected(index: number, color: string): void {
    if (!color) {
      return;
    }
    this.outcomes.at(index).controls.color.setValue(color);
    this.openPaletteForIndex = null;
  }

  isPresetSelected(selectedColor: string, presetColor: string): boolean {
    return selectedColor.toLowerCase() === presetColor.toLowerCase();
  }

  togglePalette(index: number): void {
    this.openPaletteForIndex = this.openPaletteForIndex === index ? null : index;
  }

  isPaletteOpen(index: number): boolean {
    return this.openPaletteForIndex === index;
  }
}

