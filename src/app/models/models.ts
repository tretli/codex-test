
export enum CallModuleType {
    Unkown = 0,
    Unknown = 0,
    Hangup = 1,
    Info = 2,
    Dial = 3,
    Transfer = 4,
    Time = 5,
    Menu = 6,
    Queue = 7,
    Conference = 8,
    Voicemail = 9,
    Context = 10,
    NumberListMatch = 11,
    NoOp = 12,
    Macro = 13,
    Switch = 14,
    VarSwitch = 15,
    Random = 16,
    Wait = 17,
    Loop = 18,
    SetVar = 19,
    GroupExit = 20,
    Group = 21,
    Load = 22,
    ReadDtmf = 23,
    MultiSwitch = 24,
    Answer = 25,
    Ringing = 26,
    SurveyStart = 27,
    SurveyQuestion = 28,
    SurveyEnd = 29,
    AdvancedMenu = 30,
    GroupGoto = 31,
    Comment = 32,
    RoutingApi = 33,
    SessionFields = 34,
    BankId = 35,
    AbsenceInfo = 36,
    IvrMacro = 37,
    Script = 38,
    ContactLookup = 39,
    ReturningCaller = 40,
    ReturnOutbound = 41,
}

export enum CallModuleType2 {
    Unkown = 'Unkown',
    Hangup = 'Hangup',
    Info = 'Info',
    Dial = 'Dial',
    Transfer = 'Transfer',
    Time = 'Time',
    Menu = 'Menu',
    Queue = 'Queue',
    Conference = 'Conference',
    Voicemail = 'Voicemail',
    Context = 'Context',
    NumberListMatch = 'NumberListMatch',
    NoOp = 'NoOp',
    NOOP = 'NOOP',
    Macro = 'Macro',
    Switch = 'Switch',
    VarSwitch = 'VarSwitch',
    Random = 'Random',
    Wait = 'Wait',
    Loop = 'Loop',
    SetVar = 'SetVar',
    GroupExit = 'GroupExit',
    Group = 'Group',
    Load = 'Load',
    ReadDtmf = 'ReadDtmf',
    MultiSwitch = 'MultiSwitch',
    Answer = 'Answer',
    Ringing = 'Ringing',
    SurveyStart = 'SurveyStart',
    SurveyQuestion = 'SurveyQuestion',
    SurveyEnd = 'SurveyEnd',
    AdvancedMenu = 'AdvancedMenu',
    GroupGoto = 'GroupGoto',
    GroupGoTo = 'GroupGoTo',
    Comment = 'Comment',
    RoutingApi = 'RoutingApi',
    RoutingAPI = 'RoutingAPI',
    SessionVariables = 'SessionVariables',
    BankId = 'BankId',
    BankID = 'BankID',
    AbsenceInfo = 'AbsenceInfo',
    IvrMacro = 'IvrMacro',
    IVRMacro = 'IVRMacro',
}

export interface IvBuilderModule{
    toIvrModuleRecord(): IvrModuleRecord;
    toServiceModuleCanvasElement(
        index: number,
        defaultLinkFieldResolver: (module: IvrModuleRecord) => string
    ): ServiceModuleCanvasElement<IvrModuleRecord>;
}

export interface ServiceModule extends IvBuilderModule {
    id: number;
    customerId: number;
    locationId: number;
    serviceModuleTypeId: CallModuleType;
    name: string;
    order: number;
    serviceGroupId: number;
    callLogVisible: boolean;
    propertyBase?: string;
}

export type ServiceModuleLike = {
    id: number;
    serviceModuleTypeId: number;
    order?: number;
    name?: string;
    [key: string]: unknown;
};

export type IvrModuleRecord =
    ServiceModuleLike &
    Partial<Pick<IvBuilderModule, 'toIvrModuleRecord' | 'toServiceModuleCanvasElement'>>;

export interface ServiceModuleCanvasElement<TModule extends ServiceModuleLike = ServiceModuleLike> {
    module: TModule;
    x: number;
    y: number;
    linkField: string;
}

export function toServiceModuleCanvasElement<TModule extends ServiceModuleLike>(
    module: TModule,
    index: number,
    defaultLinkFieldResolver: (module: TModule) => string
): ServiceModuleCanvasElement<TModule> {
    return {
        module: { ...module },
        x: 80 + (index % 3) * 360,
        y: 120 + Math.floor(index / 3) * 250,
        linkField: defaultLinkFieldResolver(module)
    };
}

type IvrBuilderModuleMethods = Pick<IvBuilderModule, 'toIvrModuleRecord' | 'toServiceModuleCanvasElement'>;

function withIvrBuilderModuleMethods<TModule extends IvrModuleRecord>(module: TModule): TModule & IvrBuilderModuleMethods {
    const withMethods = module as TModule & IvrBuilderModuleMethods;
    withMethods.toIvrModuleRecord = () => ({ ...withMethods });
    withMethods.toServiceModuleCanvasElement = (index, defaultLinkFieldResolver) =>
        toServiceModuleCanvasElement(withMethods, index, defaultLinkFieldResolver);
    return withMethods;
}

function implementHangupModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementInfoModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementDialModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementTransferModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementTimeModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementMenuModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementQueueModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementConferenceModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementVoicemailModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementContextModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementNumberListMatchModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementNoOpModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementMacroModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementSwitchModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementVarSwitchModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementRandomModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementWaitModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementLoopModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementSetVarModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementGroupExitModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementGroupModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementLoadModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementReadDtmfModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementMultiSwitchModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementAnswerModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementRingingModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementSurveyStartModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementSurveyQuestionModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementSurveyEndModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementAdvancedMenuModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementGroupGotoModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementCommentModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementRoutingApiModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementSessionFieldsModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementBankIdModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementAbsenceInfoModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementIvrMacroModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementScriptModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementContactLookupModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementReturningCallerModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }
function implementReturnOutboundModule<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods { return withIvrBuilderModuleMethods(module); }

export function implementServiceModuleTransforms<T extends IvrModuleRecord>(module: T): T & IvrBuilderModuleMethods {
    switch (module.serviceModuleTypeId) {
        case CallModuleType.Hangup: return implementHangupModule(module);
        case CallModuleType.Info: return implementInfoModule(module);
        case CallModuleType.Dial: return implementDialModule(module);
        case CallModuleType.Transfer: return implementTransferModule(module);
        case CallModuleType.Time: return implementTimeModule(module);
        case CallModuleType.Menu: return implementMenuModule(module);
        case CallModuleType.Queue: return implementQueueModule(module);
        case CallModuleType.Conference: return implementConferenceModule(module);
        case CallModuleType.Voicemail: return implementVoicemailModule(module);
        case CallModuleType.Context: return implementContextModule(module);
        case CallModuleType.NumberListMatch: return implementNumberListMatchModule(module);
        case CallModuleType.NoOp: return implementNoOpModule(module);
        case CallModuleType.Macro: return implementMacroModule(module);
        case CallModuleType.Switch: return implementSwitchModule(module);
        case CallModuleType.VarSwitch: return implementVarSwitchModule(module);
        case CallModuleType.Random: return implementRandomModule(module);
        case CallModuleType.Wait: return implementWaitModule(module);
        case CallModuleType.Loop: return implementLoopModule(module);
        case CallModuleType.SetVar: return implementSetVarModule(module);
        case CallModuleType.GroupExit: return implementGroupExitModule(module);
        case CallModuleType.Group: return implementGroupModule(module);
        case CallModuleType.Load: return implementLoadModule(module);
        case CallModuleType.ReadDtmf: return implementReadDtmfModule(module);
        case CallModuleType.MultiSwitch: return implementMultiSwitchModule(module);
        case CallModuleType.Answer: return implementAnswerModule(module);
        case CallModuleType.Ringing: return implementRingingModule(module);
        case CallModuleType.SurveyStart: return implementSurveyStartModule(module);
        case CallModuleType.SurveyQuestion: return implementSurveyQuestionModule(module);
        case CallModuleType.SurveyEnd: return implementSurveyEndModule(module);
        case CallModuleType.AdvancedMenu: return implementAdvancedMenuModule(module);
        case CallModuleType.GroupGoto: return implementGroupGotoModule(module);
        case CallModuleType.Comment: return implementCommentModule(module);
        case CallModuleType.RoutingApi: return implementRoutingApiModule(module);
        case CallModuleType.SessionFields: return implementSessionFieldsModule(module);
        case CallModuleType.BankId: return implementBankIdModule(module);
        case CallModuleType.AbsenceInfo: return implementAbsenceInfoModule(module);
        case CallModuleType.IvrMacro: return implementIvrMacroModule(module);
        case CallModuleType.Script: return implementScriptModule(module);
        case CallModuleType.ContactLookup: return implementContactLookupModule(module);
        case CallModuleType.ReturningCaller: return implementReturningCallerModule(module);
        case CallModuleType.ReturnOutbound: return implementReturnOutboundModule(module);
        default: return withIvrBuilderModuleMethods(module);
    }
}

export function toIvrModuleRecord(input: unknown): IvrModuleRecord | null {
    if (!input || typeof input !== 'object') {
        return null;
    }
    const candidate = input as Record<string, unknown>;
    const id = candidate['id'];
    const serviceModuleTypeId = candidate['serviceModuleTypeId'];
    if (
        typeof id !== 'number' ||
        !Number.isFinite(id) ||
        typeof serviceModuleTypeId !== 'number' ||
        !Number.isFinite(serviceModuleTypeId)
    ) {
        return null;
    }

    const mapped: IvrModuleRecord = {
        ...(candidate as IvrModuleRecord),
        id,
        serviceModuleTypeId
    };

    if (candidate['name'] !== undefined && candidate['name'] !== null && typeof candidate['name'] !== 'string') {
        mapped.name = String(candidate['name']);
    }
    if (candidate['order'] !== undefined && typeof candidate['order'] !== 'number') {
        const parsedOrder = Number(candidate['order']);
        if (Number.isFinite(parsedOrder)) {
            mapped.order = parsedOrder;
        } else {
            delete mapped.order;
        }
    }

    return implementServiceModuleTransforms(mapped);
}


export interface ServiceModuleAbsenceInfo extends ServiceModule {
    serviceModuleTypeId: CallModuleType.AbsenceInfo;
    number: string;
    variable: string;
    timezone: string;
    nextModuleId: number;
}

export interface ServiceModuleAnswer extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Answer;
    nextModuleId: number;
}

export interface ServiceModuleBankId extends ServiceModule {
    serviceModuleTypeId: CallModuleType.BankId;
    successModuleId: number;
    failureModuleId: number;
}

export interface ServiceModuleComment extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Comment;
    comment: string;
    nextModuleId: number;
}

export interface ServiceModuleContactLookup extends ServiceModule {
    serviceModuleTypeId: CallModuleType.ContactLookup;
    internalLookup: boolean;
    yellowPagesLookup: boolean;
    nextModuleId: number;
}

export interface ServiceModuleGroup extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Group;
    targetServiceGroupId: number;
}

export interface ServiceModuleIvrMacro extends ServiceModule {
    serviceModuleTypeId: CallModuleType.IvrMacro;
    macro: string;
    args: string;
    successModuleId: number;
    failureModuleId: number;
}

export interface ServiceModuleRinging extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Ringing;
    mode: string;
    nextModuleId: number;
}

export interface ServiceModuleRoutingApi extends ServiceModule {
    serviceModuleTypeId: CallModuleType.RoutingApi;
    url: string;
    apiVersion: string;
    authToken: string;
    successModuleId: number;
    failureModuleId: number;
}

export interface ServiceModuleQueue extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Queue;
    queueId: number;
    queuePriority: number;
    queueTimeout: number;
    queueOptions: string;
    answer: boolean;
    extraTime: number;
    timeoutModuleId: number;
    joinEmptyModuleId: number;
    leaveEmptyModuleId: number;
    joinUnavailModuleId: number;
    leaveUnavailModuleId: number;
    fullModuleId: number;
    continueModuleId: number;
    surveyModuleId: number;
}

export interface ServiceModuleSetVar extends ServiceModule {
    serviceModuleTypeId: CallModuleType.SetVar;
    variable: string;
    value: string;
    permanent: boolean;
    nextModuleId: number;
}

export interface ServiceModuleMacro extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Macro;
    macro: string;
    macroArgs: string;
    nextModuleId: number;
}

export interface ServiceModuleWait extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Wait;
    wait: number;
    nextModuleId: number;
}

export interface ServiceModuleContext extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Context;
    context: string;
}


export interface ServiceModuleVoicemail extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Voicemail;
    readonly voicemailId: number;
    readonly voicemailOptions: string;
}

export interface ServiceModuleReadDtmf extends ServiceModule {
    serviceModuleTypeId: CallModuleType.ReadDtmf;
    soundFile: string;
    variable: string;
    maxDigits: number;
    timeout: number;
    acceptableDigits: string;
    terminateDigits: string;
    terminateStartDigits: string;
    keepTerminateDigit: boolean;
    nextModuleId: number;
    timeoutModuleId: number;
}

export interface ServiceModuleDial extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Dial;
    callerIdNum: string;
    callerIdName: string;
    diversionNum: string;
    number: string;
    timeout: number;
    dialOptions: string;
    successModuleId: number;
    failureModuleId: number;
}

export interface ServiceModuleGroup extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Group;
    targetServiceGroupId: number;
}

export interface ServiceModuleHangup extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Hangup;
    cause: string;
}

export interface ServiceModuleInfo extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Info;
    soundFile: string;
    answer: boolean;
    background: boolean;
    nextModuleId: number;
}


export interface ServiceModuleLoad extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Load;
    aCount: number;
    bCount: number;
    aModuleId: number;
    bModuleId: number;
}

export interface ServiceModuleNoOp extends ServiceModule {
    serviceModuleTypeId: CallModuleType.NoOp;
    nextModuleId: number;
}

export interface ServiceModuleLoop extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Loop;
    count: number;
    loopModuleId: number;
    outModuleId: number;
}

export interface ServiceModuleNumberListMatch extends ServiceModule {
    serviceModuleTypeId: CallModuleType.NumberListMatch;
    numberListId: number;
    matchModuleId: number;
    noMatchModuleId: number;
}

export interface ServiceModuleReadDtmf extends ServiceModule {
    serviceModuleTypeId: CallModuleType.ReadDtmf;
    soundFile: string;
    variable: string;
    maxDigits: number;
    timeout: number;
    acceptableDigits: string;
    terminateDigits: string;
    terminateStartDigits: string;
    keepTerminateDigit: boolean;
    nextModuleId: number;
    timeoutModuleId: number;
}


export interface ServiceModuleRequest {
    moduleId: number;
}

export interface ServiceModuleSwitch extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Switch;
    variable: string;
    onModuleId: number;
    offModuleId: number;
}

export interface ServiceModuleSurveyStart extends ServiceModule {
    serviceModuleTypeId: CallModuleType.SurveyStart;
    number: string;
    force: boolean;
    surveyModule: boolean;
    quarantineTime: number;
    languageId: number;
    allowedRegions: string;
    nextModuleId: number;
}

export interface ServiceModuleSurveyQuestion extends ServiceModule {
    serviceModuleTypeId: CallModuleType.SurveyQuestion;
    message: string;
    min: number;
    max: number;
    nextModuleId: number;
}

export interface ServiceModuleSurveyQuestionResponse {
    id?: number;
    customerId?: number;
    surveyQuestionModuleId: number;
    valueFrom: number;
    valueTo: number;
    nextModuleId: number;
}

export interface ServiceModuleSurveyEnd extends ServiceModule {
    serviceModuleTypeId: CallModuleType.SurveyEnd;
    message: string;
}

export enum OperatorEnum {
    Equal,
    NotEqual,
    LessThan,
    LessThanOrEqual,
    GreaterThan,
    GreaterThanOrEqual,
}

export interface ServiceModuleVarSwitch extends ServiceModule {
    serviceModuleTypeId: CallModuleType.VarSwitch;
    operator: OperatorEnum;
    value: string;
    variable: string;
    trueModuleId: number;
    falseModuleId: number;
}

export interface ServiceModuleMultiSwitch extends ServiceModule {
    serviceModuleTypeId: CallModuleType.MultiSwitch;
    variable: string;
    noMatchModuleId: number;
}

export interface ServiceModuleAdvancedMenu extends ServiceModule {
    serviceModuleTypeId: CallModuleType.AdvancedMenu;
    answer: boolean;
    background: boolean;
    soundFile: string;
    interval: number;
    count: number;
    key0ModuleId: number;
    key1ModuleId: number;
    key2ModuleId: number;
    key3ModuleId: number;
    key4ModuleId: number;
    key5ModuleId: number;
    key6ModuleId: number;
    key7ModuleId: number;
    key8ModuleId: number;
    key9ModuleId: number;
    keyStarModuleId: number;
    keyHashModuleId: number;
    loopExhaustedModuleId: number;
    surveyModule: boolean;
}


export interface ServiceModuleRandom extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Random;
    variable: string;
    percent: number;
    aModuleId: number;
    bModuleId: number;
    // origId: number;
}

export interface ServiceModuleReturningCaller extends ServiceModule {
    serviceModuleTypeId: CallModuleType.ReturningCaller;
    threshold: number;
    timeSpan: number;
    serviceNumberUnique: boolean;
    answeredOnly: boolean;
    setSessionFields: boolean;
    aboveThresholdModuleId: number;
    belowThresholdModuleId: number;
}


export interface ServiceModuleLayoutInfo {
    id: number;
    description: string;
    shape: string;
    coords: string;
    typeId: CallModuleType;
    type: string;
}

export interface IvrMacroType {
    id: number;
    name: string;
    description: string;
    help: string;
    schema: string;
}


export interface EntryContainer {
    queueId: number;
    entries: QueueCallbackWeekDayEntry[];
}

export interface QueueCallbackWeekDayEntry {
    id: number;
    queueId: number;
    weekDay: number;
    startTime: string;
    endTime: string;
}



export interface ServiceModuleMultiSwitchEntry {
    readonly id: number;
    readonly multiSwitchModuleId: number;
    readonly valueFrom: string;
    readonly valueTo: string;
    readonly nextModuleId: number;
}




export interface ServiceModuleAdvancedMenuPhrase {
    readonly id: number;
    readonly advancedMenuModuleId: number;
    readonly phrase: string;
    readonly voiceLanguage: number;
    readonly nextModuleId: number;
}

export interface ServiceModuleSessionFields extends ServiceModule {
    serviceModuleTypeId: CallModuleType.SessionFields;
    nextModuleId: number;
}

export interface ServiceModuleSessionVariablesData {
    id: number;
    sessionVariablesModuleId: number;
    channelVariable: string;
    name: string;
    writeChannel: boolean; // true = write to channel, false = read from channel
    jsonPath: string;
}


export interface ServiceModuleTime extends ServiceModule {
    serviceModuleTypeId: CallModuleType.Time;
    timeRule: string;
    exitModuleId1: number;
    exitModuleId2: number;
    exitModuleId3: number;
    exitModuleId4: number;
    exitModuleId5: number;
    exitModuleId6: number;
    exitModuleId7: number;
    exitModuleId8: number; 
    exitModuleId9: number;
    
}
