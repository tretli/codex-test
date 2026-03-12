import { registerServiceModuleAdapter } from '../../models/models';
import { advancedMenuModuleDefinition } from './definitions/advanced-menu.definition';
import { contactLookupModuleDefinition } from './definitions/contact-lookup.definition';
import { groupModuleDefinition } from './definitions/group.definition';
import { hangupModuleDefinition } from './definitions/hangup.definition';
import { macroModuleDefinition } from './definitions/macro.definition';
import { multiSwitchModuleDefinition } from './definitions/multi-switch.definition';
import { numberListMatchModuleDefinition } from './definitions/number-list-match.definition';
import { playSoundModuleDefinition } from './definitions/play-sound.definition';
import { queueModuleDefinition } from './definitions/queue.definition';
import { readDtmfModuleDefinition } from './definitions/read-dtmf.definition';
import { sessionFieldsModuleDefinition } from './definitions/session-fields.definition';
import { setVarModuleDefinition } from './definitions/set-var.definition';
import { switchModuleDefinition } from './definitions/switch.definition';
import { timeControlModuleDefinition } from './definitions/time-control.definition';
import { waitModuleDefinition } from './definitions/wait.definition';
import { IvrModuleDefinition } from './ivr-module-definition';

export const IVR_MODULE_DEFINITIONS: ReadonlyArray<IvrModuleDefinition> = [
  hangupModuleDefinition,
  playSoundModuleDefinition,
  timeControlModuleDefinition,
  queueModuleDefinition,
  numberListMatchModuleDefinition,
  macroModuleDefinition,
  switchModuleDefinition,
  waitModuleDefinition,
  setVarModuleDefinition,
  groupModuleDefinition,
  readDtmfModuleDefinition,
  multiSwitchModuleDefinition,
  advancedMenuModuleDefinition,
  sessionFieldsModuleDefinition,
  contactLookupModuleDefinition
];

IVR_MODULE_DEFINITIONS.forEach((definition) => {
  if (definition.model) {
    registerServiceModuleAdapter(definition.typeId, definition.model);
  }
});
