import {
  getDefaultServiceModuleExitField,
  getServiceModuleExitFields,
  getServiceModuleExitLinks,
  registerServiceModuleAdapter,
  ServiceModule,
  toServiceModule
} from './models';

describe('service module adapters', () => {
  it('uses registered adapters for parsing and exit metadata', () => {
    const typeId = 987654;
    const sentinel = {} as ServiceModule;

    registerServiceModuleAdapter(typeId, {
      toServiceModule: () => sentinel,
      getExitFields: () => ['nextModuleId'],
      getExitLinks: () => [{ field: 'nextModuleId', toId: 42 }]
    });

    const parsed = toServiceModule({ id: 1, serviceModuleTypeId: typeId });
    expect(parsed).toBe(sentinel);

    const fields = getServiceModuleExitFields({
      id: 1,
      serviceModuleTypeId: typeId
    });
    expect(fields).toEqual(['nextModuleId']);
    expect(getDefaultServiceModuleExitField({ id: 1, serviceModuleTypeId: typeId })).toBe(
      'nextModuleId'
    );

    const links = getServiceModuleExitLinks({
      id: 1,
      serviceModuleTypeId: typeId
    });
    expect(links).toEqual([{ field: 'nextModuleId', toId: 42 }]);
  });
});
