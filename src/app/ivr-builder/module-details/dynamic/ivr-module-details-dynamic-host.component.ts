import { Component, ComponentRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { BuilderNode } from '../../canvas/ivr-canvas.types';
import { FieldKind } from '../common/detail-field-schema.model';

type DynamicFieldChangeEvent = { field: string; kind: FieldKind; value: unknown };

@Component({
  selector: 'app-ivr-module-details-dynamic-host',
  standalone: true,
  templateUrl: './ivr-module-details-dynamic-host.component.html'
})
export class IvrModuleDetailsDynamicHostComponent implements OnChanges, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  @Input() componentType: Type<unknown> | null = null;
  @Input() node: BuilderNode | null = null;
  @Input() moduleTargets: Array<{ id: number; label: string }> = [];

  @Output() fieldChange = new EventEmitter<DynamicFieldChangeEvent>();

  private componentRef: ComponentRef<unknown> | null = null;
  private currentType: Type<unknown> | null = null;
  private fieldChangeSubscription: Subscription | null = null;

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.componentType || !this.node) {
      this.clearComponent();
      return;
    }

    if (!this.componentRef || this.currentType !== this.componentType) {
      this.mountComponent(this.componentType);
    }
    this.updateInputs();
  }

  ngOnDestroy(): void {
    this.clearComponent();
  }

  private mountComponent(componentType: Type<unknown>): void {
    this.clearComponent();
    this.componentRef = this.container.createComponent(componentType);
    this.currentType = componentType;

    const instance = this.componentRef.instance as { fieldChange?: EventEmitter<DynamicFieldChangeEvent> };
    if (instance.fieldChange && typeof instance.fieldChange.subscribe === 'function') {
      this.fieldChangeSubscription = instance.fieldChange.subscribe((event) => {
        this.fieldChange.emit(event);
      });
    }
  }

  private updateInputs(): void {
    if (!this.componentRef || !this.node) {
      return;
    }
    this.componentRef.setInput('node', this.node);
    this.componentRef.setInput('moduleTargets', this.moduleTargets);
  }

  private clearComponent(): void {
    this.fieldChangeSubscription?.unsubscribe();
    this.fieldChangeSubscription = null;
    this.componentRef?.destroy();
    this.componentRef = null;
    this.currentType = null;
    this.container?.clear();
  }
}
