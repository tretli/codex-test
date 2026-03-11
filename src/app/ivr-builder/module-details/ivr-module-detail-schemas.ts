import { CallModuleType } from '../../models/models';

export type FieldKind = 'string' | 'number' | 'boolean' | 'link';

export type FieldSchema = {
  key: string;
  label: string;
  kind: FieldKind;
};

export const BASE_FIELD_SCHEMAS: ReadonlyArray<FieldSchema> = [
  { key: 'order', label: 'Order', kind: 'number' },
  { key: 'serviceGroupId', label: 'Service group ID', kind: 'number' },
  { key: 'callLogVisible', label: 'Call log visible', kind: 'boolean' }
];

export const MODULE_TYPE_SCHEMAS: Record<number, ReadonlyArray<FieldSchema>> = {
  [CallModuleType.Hangup]: [{ key: 'cause', label: 'Cause', kind: 'string' }],
  [CallModuleType.Info]: [
    { key: 'soundFile', label: 'Sound file', kind: 'string' },
    { key: 'answer', label: 'Answer', kind: 'boolean' },
    { key: 'background', label: 'Background', kind: 'boolean' },
    { key: 'nextModuleId', label: 'Next module', kind: 'link' }
  ],
  [CallModuleType.Time]: [
    { key: 'timeZone', label: 'Time zone', kind: 'string' },
    { key: 'closedModuleId', label: 'Closed module', kind: 'link' },
    { key: 'exits1', label: 'Exit 1', kind: 'link' },
    { key: 'exits2', label: 'Exit 2', kind: 'link' },
    { key: 'exits3', label: 'Exit 3', kind: 'link' },
    { key: 'exits4', label: 'Exit 4', kind: 'link' },
    { key: 'exits5', label: 'Exit 5', kind: 'link' },
    { key: 'exits6', label: 'Exit 6', kind: 'link' },
    { key: 'exits7', label: 'Exit 7', kind: 'link' },
    { key: 'exits8', label: 'Exit 8', kind: 'link' },
    { key: 'exits9', label: 'Exit 9', kind: 'link' }
  ],
  [CallModuleType.Queue]: [
    { key: 'queueId', label: 'Queue ID', kind: 'number' },
    { key: 'queuePriority', label: 'Queue priority', kind: 'number' },
    { key: 'queueTimeout', label: 'Queue timeout', kind: 'number' },
    { key: 'answer', label: 'Answer', kind: 'boolean' },
    { key: 'extraTime', label: 'Extra time', kind: 'number' },
    { key: 'timeoutModuleId', label: 'Timeout module', kind: 'link' },
    { key: 'joinEmptyModuleId', label: 'Join empty module', kind: 'link' },
    { key: 'leaveEmptyModuleId', label: 'Leave empty module', kind: 'link' },
    { key: 'joinUnavailModuleId', label: 'Join unavailable module', kind: 'link' },
    { key: 'leaveUnavailModuleId', label: 'Leave unavailable module', kind: 'link' },
    { key: 'fullModuleId', label: 'Full module', kind: 'link' },
    { key: 'continueModuleId', label: 'Continue module', kind: 'link' },
    { key: 'surveyModuleId', label: 'Survey module', kind: 'link' }
  ],
  [CallModuleType.NumberListMatch]: [
    { key: 'numberListId', label: 'Number list ID', kind: 'number' },
    { key: 'matchModuleId', label: 'Match module', kind: 'link' },
    { key: 'noMatchModuleId', label: 'No match module', kind: 'link' }
  ],
  [CallModuleType.Macro]: [
    { key: 'macro', label: 'Macro', kind: 'string' },
    { key: 'macroArgs', label: 'Macro args', kind: 'string' },
    { key: 'nextModuleId', label: 'Next module', kind: 'link' }
  ],
  [CallModuleType.Switch]: [
    { key: 'variable', label: 'Variable', kind: 'string' },
    { key: 'onModuleId', label: 'On module', kind: 'link' },
    { key: 'offModuleId', label: 'Off module', kind: 'link' }
  ],
  [CallModuleType.Wait]: [
    { key: 'wait', label: 'Wait (ms)', kind: 'number' },
    { key: 'nextModuleId', label: 'Next module', kind: 'link' }
  ],
  [CallModuleType.SetVar]: [
    { key: 'variable', label: 'Variable', kind: 'string' },
    { key: 'value', label: 'Value', kind: 'string' },
    { key: 'permanent', label: 'Permanent', kind: 'boolean' },
    { key: 'nextModuleId', label: 'Next module', kind: 'link' }
  ],
  [CallModuleType.Group]: [{ key: 'targetServiceGroupId', label: 'Target service group ID', kind: 'number' }],
  [CallModuleType.ReadDtmf]: [
    { key: 'soundFile', label: 'Sound file', kind: 'string' },
    { key: 'variable', label: 'Variable', kind: 'string' },
    { key: 'maxDigits', label: 'Max digits', kind: 'number' },
    { key: 'timeout', label: 'Timeout', kind: 'number' },
    { key: 'acceptableDigits', label: 'Acceptable digits', kind: 'string' },
    { key: 'terminateDigits', label: 'Terminate digits', kind: 'string' },
    { key: 'terminateStartDigits', label: 'Terminate start digits', kind: 'string' },
    { key: 'keepTerminateDigit', label: 'Keep terminate digit', kind: 'boolean' },
    { key: 'nextModuleId', label: 'Next module', kind: 'link' },
    { key: 'timeoutModuleId', label: 'Timeout module', kind: 'link' }
  ],
  [CallModuleType.MultiSwitch]: [
    { key: 'variable', label: 'Variable', kind: 'string' },
    { key: 'noMatchModuleId', label: 'No match module', kind: 'link' }
  ],
  [CallModuleType.AdvancedMenu]: [
    { key: 'soundFile', label: 'Sound file', kind: 'string' },
    { key: 'answer', label: 'Answer', kind: 'boolean' },
    { key: 'background', label: 'Background', kind: 'boolean' },
    { key: 'interval', label: 'Interval', kind: 'number' },
    { key: 'count', label: 'Count', kind: 'number' },
    { key: 'surveyModule', label: 'Survey module', kind: 'boolean' },
    { key: 'key0ModuleId', label: 'Key 0', kind: 'link' },
    { key: 'key1ModuleId', label: 'Key 1', kind: 'link' },
    { key: 'key2ModuleId', label: 'Key 2', kind: 'link' },
    { key: 'key3ModuleId', label: 'Key 3', kind: 'link' },
    { key: 'key4ModuleId', label: 'Key 4', kind: 'link' },
    { key: 'key5ModuleId', label: 'Key 5', kind: 'link' },
    { key: 'key6ModuleId', label: 'Key 6', kind: 'link' },
    { key: 'key7ModuleId', label: 'Key 7', kind: 'link' },
    { key: 'key8ModuleId', label: 'Key 8', kind: 'link' },
    { key: 'key9ModuleId', label: 'Key 9', kind: 'link' },
    { key: 'keyStarModuleId', label: 'Key *', kind: 'link' },
    { key: 'keyHashModuleId', label: 'Key #', kind: 'link' },
    { key: 'loopExhaustedModuleId', label: 'Loop exhausted', kind: 'link' }
  ],
  [CallModuleType.SessionFields]: [{ key: 'nextModuleId', label: 'Next module', kind: 'link' }],
  [CallModuleType.ContactLookup]: [
    { key: 'internalLookup', label: 'Internal lookup', kind: 'boolean' },
    { key: 'yellowPagesLookup', label: 'Yellow pages lookup', kind: 'boolean' },
    { key: 'nextModuleId', label: 'Next module', kind: 'link' }
  ]
};
