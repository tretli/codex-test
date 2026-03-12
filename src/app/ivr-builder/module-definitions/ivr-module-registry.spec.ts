import { CallModuleType } from '../../models/models';
import { IVR_MODULE_REGISTRY } from './ivr-module-registry';

describe('IvrModuleRegistry', () => {
  it('exposes creatable definitions from the registry', () => {
    const creatable = IVR_MODULE_REGISTRY.getCreatableDefinitions();
    expect(creatable.length).toBeGreaterThan(0);
    expect(creatable.every((item) => item.canvas.creatable)).toBeTrue();
  });

  it('returns canvas metadata for known module types', () => {
    const meta = IVR_MODULE_REGISTRY.getCanvasMeta(CallModuleType.Queue);
    expect(meta.label).toBe('Queue');
    expect(meta.color).toBe('#eab308');
  });

  it('returns fallback metadata for unknown module types', () => {
    const meta = IVR_MODULE_REGISTRY.getCanvasMeta(999999);
    expect(meta.label).toBe('Type 999999');
    expect(meta.color).toBe('#475569');
  });

  it('creates modules using definition defaults', () => {
    const module = IVR_MODULE_REGISTRY.createModuleRecord(CallModuleType.Wait, 101, 7);
    expect(module).not.toBeNull();
    expect(module?.id).toBe(101);
    expect(module?.serviceModuleTypeId).toBe(CallModuleType.Wait);
    expect(module?.name).toContain('Wait');
    expect(module?.['wait']).toBe(1000);
  });
});
