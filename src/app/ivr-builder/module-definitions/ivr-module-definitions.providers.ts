import { registerServiceModuleAdapter } from '../../models/models';
import { IvrModuleDefinition } from './ivr-module-definition';
import { absenceInfoModuleDefinition } from '../module-types/absence-info/absence-info.definition';
import { advancedMenuModuleDefinition } from '../module-types/advanced-menu/advanced-menu.definition';
import { answerModuleDefinition } from '../module-types/answer/answer.definition';
import { bankIdModuleDefinition } from '../module-types/bank-id/bank-id.definition';
import { commentModuleDefinition } from '../module-types/comment/comment.definition';
import { conferenceModuleDefinition } from '../module-types/conference/conference.definition';
import { contactLookupModuleDefinition } from '../module-types/contact-lookup/contact-lookup.definition';
import { contextModuleDefinition } from '../module-types/context/context.definition';
import { dialModuleDefinition } from '../module-types/dial/dial.definition';
import { groupExitModuleDefinition } from '../module-types/group-exit/group-exit.definition';
import { groupGotoModuleDefinition } from '../module-types/group-goto/group-goto.definition';
import { groupModuleDefinition } from '../module-types/group/group.definition';
import { hangupModuleDefinition } from '../module-types/hangup/hangup.definition';
import { ivrMacroModuleDefinition } from '../module-types/ivr-macro/ivr-macro.definition';
import { loadModuleDefinition } from '../module-types/load/load.definition';
import { loopModuleDefinition } from '../module-types/loop/loop.definition';
import { macroModuleDefinition } from '../module-types/macro/macro.definition';
import { menuModuleDefinition } from '../module-types/menu/menu.definition';
import { multiSwitchModuleDefinition } from '../module-types/multi-switch/multi-switch.definition';
import { noOpModuleDefinition } from '../module-types/no-op/no-op.definition';
import { numberListMatchModuleDefinition } from '../module-types/number-list-match/number-list-match.definition';
import { playSoundModuleDefinition } from '../module-types/play-sound/play-sound.definition';
import { queueModuleDefinition } from '../module-types/queue/queue.definition';
import { randomModuleDefinition } from '../module-types/random/random.definition';
import { readDtmfModuleDefinition } from '../module-types/read-dtmf/read-dtmf.definition';
import { returnOutboundModuleDefinition } from '../module-types/return-outbound/return-outbound.definition';
import { returningCallerModuleDefinition } from '../module-types/returning-caller/returning-caller.definition';
import { ringingModuleDefinition } from '../module-types/ringing/ringing.definition';
import { routingApiModuleDefinition } from '../module-types/routing-api/routing-api.definition';
import { scriptModuleDefinition } from '../module-types/script/script.definition';
import { sessionFieldsModuleDefinition } from '../module-types/session-fields/session-fields.definition';
import { setVarModuleDefinition } from '../module-types/set-var/set-var.definition';
import { surveyEndModuleDefinition } from '../module-types/survey-end/survey-end.definition';
import { surveyQuestionModuleDefinition } from '../module-types/survey-question/survey-question.definition';
import { surveyStartModuleDefinition } from '../module-types/survey-start/survey-start.definition';
import { switchModuleDefinition } from '../module-types/switch/switch.definition';
import { timeControlModuleDefinition } from '../module-types/time-control/time-control.definition';
import { transferModuleDefinition } from '../module-types/transfer/transfer.definition';
import { varSwitchModuleDefinition } from '../module-types/var-switch/var-switch.definition';
import { voicemailModuleDefinition } from '../module-types/voicemail/voicemail.definition';
import { waitModuleDefinition } from '../module-types/wait/wait.definition';

export const IVR_MODULE_DEFINITIONS: ReadonlyArray<IvrModuleDefinition> = [
  absenceInfoModuleDefinition,
  hangupModuleDefinition,
  playSoundModuleDefinition,
  dialModuleDefinition,
  transferModuleDefinition,
  timeControlModuleDefinition,
  menuModuleDefinition,
  queueModuleDefinition,
  conferenceModuleDefinition,
  voicemailModuleDefinition,
  contextModuleDefinition,
  numberListMatchModuleDefinition,
  noOpModuleDefinition,
  macroModuleDefinition,
  switchModuleDefinition,
  varSwitchModuleDefinition,
  randomModuleDefinition,
  waitModuleDefinition,
  loopModuleDefinition,
  setVarModuleDefinition,
  groupExitModuleDefinition,
  groupModuleDefinition,
  loadModuleDefinition,
  readDtmfModuleDefinition,
  multiSwitchModuleDefinition,
  answerModuleDefinition,
  ringingModuleDefinition,
  surveyStartModuleDefinition,
  surveyQuestionModuleDefinition,
  surveyEndModuleDefinition,
  advancedMenuModuleDefinition,
  groupGotoModuleDefinition,
  commentModuleDefinition,
  routingApiModuleDefinition,
  sessionFieldsModuleDefinition,
  bankIdModuleDefinition,
  ivrMacroModuleDefinition,
  scriptModuleDefinition,
  contactLookupModuleDefinition,
  returningCallerModuleDefinition,
  returnOutboundModuleDefinition
];

IVR_MODULE_DEFINITIONS.forEach((definition) => {
  if (definition.model) {
    registerServiceModuleAdapter(definition.typeId, definition.model);
  }
});
