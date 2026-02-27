
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

export interface ServiceModule {
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