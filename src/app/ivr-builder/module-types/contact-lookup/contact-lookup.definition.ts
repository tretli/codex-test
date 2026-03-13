import { CallModuleType, ServiceModuleContactLookup } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsContactLookupComponent } from './contact-lookup.details.component';

export const contactLookupModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.ContactLookup,
  key: 'contact-lookup',
  label: 'Contact lookup',
  color: '#4338ca',
  component: IvrModuleDetailsContactLookupComponent,
  model: {
    toServiceModule: (input) => new ServiceModuleContactLookup(input)
  },
  supportsBackendLookups: true
});
