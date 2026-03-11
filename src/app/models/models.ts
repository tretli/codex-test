
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

export interface IvBuilderModule {
    toServiceModuleCanvasElement(
        index: number,
        defaultLinkFieldResolver?: (module: IvrModuleRecord) => string
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
    Pick<IvBuilderModule, 'toServiceModuleCanvasElement'> &
    Partial<Pick<ExitFieldProvider, 'getExitFields'>>;

export interface ServiceModuleCanvasElement<TModule extends ServiceModuleLike = ServiceModuleLike> {
    module: TModule;
    x: number;
    y: number;
    linkField: string;
}

const EXIT_FIELD_PATTERN = /(moduleid$|^exits\d+$)/i;

export function getServiceModuleExitFields(module: ServiceModuleLike): string[] {
    const custom = getCustomExitFields(module);
    if (custom.length > 0) {
        return [...new Set(custom)];
    }
    const existing = Object.keys(module).filter((key) => EXIT_FIELD_PATTERN.test(key));
    return [...new Set(existing)];
}

export function getServiceModuleExitLinks(module: ServiceModuleLike): Array<{ field: string; toId: number }> {
    const links: Array<{ field: string; toId: number }> = [];
    const seen = new Set<string>();
    const addLink = (field: string, rawValue: unknown): void => {
        const toId = asPositiveServiceModuleId(rawValue);
        if (toId === null) {
            return;
        }
        const key = `${field}:${toId}`;
        if (seen.has(key)) {
            return;
        }
        seen.add(key);
        links.push({ field, toId });
    };

    getServiceModuleExitFields(module).forEach((field) => addLink(field, module[field]));

    const visit = (value: unknown, path: string, depth: number): void => {
        if (depth > 4 || value === null || value === undefined) {
            return;
        }
        if (Array.isArray(value)) {
            value.forEach((item, index) => visit(item, `${path}[${index}]`, depth + 1));
            return;
        }
        if (typeof value !== 'object') {
            return;
        }
        Object.entries(value as Record<string, unknown>).forEach(([key, nested]) => {
            const nextPath = path ? `${path}.${key}` : key;
            if (EXIT_FIELD_PATTERN.test(key)) {
                addLink(nextPath, nested);
            }
            visit(nested, nextPath, depth + 1);
        });
    };

    Object.entries(module).forEach(([key, value]) => {
        if (!EXIT_FIELD_PATTERN.test(key)) {
            visit(value, key, 1);
        }
    });

    return links;
}

export function getDefaultServiceModuleExitField(module: ServiceModuleLike): string {
    return getServiceModuleExitFields(module)[0] ?? '';
}

function asPositiveServiceModuleId(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        return value;
    }
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) {
            return null;
        }
        const parsed = Number(trimmed);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }
    return null;
}

function toFiniteNumber(value: unknown): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export function toServiceModuleCanvasElement<TModule extends ServiceModuleLike>(
    module: TModule,
    index: number,
    defaultLinkFieldResolver?: (module: TModule) => string
): ServiceModuleCanvasElement<TModule> {
    return {
        module: { ...module },
        x: 80 + (index % 3) * 500,
        y: 120 + Math.floor(index / 3) * 250,
        linkField: defaultLinkFieldResolver ? defaultLinkFieldResolver(module) : getDefaultServiceModuleExitField(module)
    };
}

interface ExitFieldProvider {
    getExitFields(): string[];
}

function getCustomExitFields(module: ServiceModuleLike): string[] {
    const maybeProvider = module as ServiceModuleLike & Partial<ExitFieldProvider>;
    return typeof maybeProvider.getExitFields === 'function' ? maybeProvider.getExitFields() : [];
}

function withCanvasElementMethod(module: ServiceModuleLike): IvrModuleRecord {
    const plain = toPlainModule(module);
    const record = plain as IvrModuleRecord;
    record.toServiceModuleCanvasElement = (index, defaultLinkFieldResolver) =>
        toServiceModuleCanvasElement(record, index, defaultLinkFieldResolver);
    return {
        ...plain,
        toServiceModuleCanvasElement: record.toServiceModuleCanvasElement
    };
}

function toPlainModule(module: ServiceModuleLike | Partial<Pick<IvBuilderModule, 'toServiceModuleCanvasElement'>>): ServiceModuleLike {
    const { toServiceModuleCanvasElement: _ignored, ...plain } = module as Record<string, unknown>;
    return plain as ServiceModuleLike;
}

abstract class ServiceModuleBase implements ServiceModule, ExitFieldProvider {
    id = 0;
    customerId = 0;
    locationId = 0;
    serviceModuleTypeId = CallModuleType.Unknown;
    name = '';
    order = 0;
    serviceGroupId = 0;
    callLogVisible = false;
    propertyBase?: string;

    protected constructor(input: Record<string, unknown>, type: CallModuleType) {
        this.serviceModuleTypeId = type;
        this.id = toFiniteNumber(input['id']);
        this.customerId = toFiniteNumber(input['customerId']);
        this.locationId = toFiniteNumber(input['locationId']);
        this.name = typeof input['name'] === 'string' ? input['name'] : String(input['name'] ?? '');
        this.order = toFiniteNumber(input['order']);
        this.serviceGroupId = toFiniteNumber(input['serviceGroupId']);
        this.callLogVisible = Boolean(input['callLogVisible']);
        this.propertyBase = typeof input['propertyBase'] === 'string' ? input['propertyBase'] : undefined;
    }

    getExitFields(): string[] {
        return [];
    }

    toServiceModuleCanvasElement(
        index: number,
        defaultLinkFieldResolver?: (module: IvrModuleRecord) => string
    ): ServiceModuleCanvasElement<IvrModuleRecord> {
        const moduleRecord = toIvrModuleRecordFromServiceModule(this);
        return toServiceModuleCanvasElement(
            moduleRecord,
            index,
            defaultLinkFieldResolver ?? (() => this.getExitFields()[0] ?? '')
        );
    }
}

export function toIvrModuleRecordFromServiceModule(serviceModule: ServiceModule | ServiceModuleLike): IvrModuleRecord {
    const plain = toPlainModule(serviceModule);
    const ivBuilderModule = serviceModule as Partial<IvBuilderModule>;
    const exitFieldProvider = serviceModule as Partial<ExitFieldProvider>;
    if (typeof ivBuilderModule.toServiceModuleCanvasElement === 'function') {
        const customMethod = ivBuilderModule.toServiceModuleCanvasElement.bind(serviceModule);
        const customExitFields = typeof exitFieldProvider.getExitFields === 'function'
            ? exitFieldProvider.getExitFields.bind(serviceModule)
            : undefined;
        return {
            ...plain,
            ...(customExitFields ? { getExitFields: customExitFields } : {}),
            toServiceModuleCanvasElement: (index, defaultLinkFieldResolver) =>
                customMethod(index, defaultLinkFieldResolver)
        };
    }
    return withCanvasElementMethod(plain);
}

export function toServiceModule(input: unknown): ServiceModule | null {
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

    const normalizedBase = {
        ...(candidate as Record<string, unknown>),
        id,
        serviceModuleTypeId: serviceModuleTypeId as CallModuleType,
        customerId: typeof candidate['customerId'] === 'number' && Number.isFinite(candidate['customerId']) ? (candidate['customerId'] as number) : 0,
        locationId: typeof candidate['locationId'] === 'number' && Number.isFinite(candidate['locationId']) ? (candidate['locationId'] as number) : 0,
        name: typeof candidate['name'] === 'string' ? (candidate['name'] as string) : String(candidate['name'] ?? ''),
        order: typeof candidate['order'] === 'number' && Number.isFinite(candidate['order']) ? (candidate['order'] as number) : 0,
        serviceGroupId:
            typeof candidate['serviceGroupId'] === 'number' && Number.isFinite(candidate['serviceGroupId'])
                ? (candidate['serviceGroupId'] as number)
                : 0,
        callLogVisible: typeof candidate['callLogVisible'] === 'boolean' ? (candidate['callLogVisible'] as boolean) : false
    };

    switch (serviceModuleTypeId as CallModuleType) {
        case CallModuleType.Queue:
            return new ServiceModuleQueue(normalizedBase);
        case CallModuleType.Info:
            return new ServiceModuleInfo(normalizedBase);
        case CallModuleType.Time:
            return new ServiceModuleTime(normalizedBase);
        case CallModuleType.NumberListMatch:
            return new ServiceModuleNumberListMatch(normalizedBase);
        case CallModuleType.Macro:
            return new ServiceModuleMacro(normalizedBase);
        case CallModuleType.Switch:
            return new ServiceModuleSwitch(normalizedBase);
        case CallModuleType.Wait:
            return new ServiceModuleWait(normalizedBase);
        case CallModuleType.SetVar:
            return new ServiceModuleSetVar(normalizedBase);
        case CallModuleType.ReadDtmf:
            return new ServiceModuleReadDtmf(normalizedBase);
        case CallModuleType.MultiSwitch:
            return new ServiceModuleMultiSwitch(normalizedBase);
        case CallModuleType.AdvancedMenu:
            return new ServiceModuleAdvancedMenu(normalizedBase);
        case CallModuleType.SessionFields:
            return new ServiceModuleSessionFields(normalizedBase);
        case CallModuleType.ContactLookup:
            return new ServiceModuleContactLookup(normalizedBase);
    }

    const serviceModule: ServiceModule = {
        ...normalizedBase,
        toServiceModuleCanvasElement: (index, defaultLinkFieldResolver) =>
            withCanvasElementMethod(toPlainModule(serviceModule)).toServiceModuleCanvasElement(index, defaultLinkFieldResolver)
    };

    return serviceModule;
}

export function toIvrModuleRecord(input: unknown): IvrModuleRecord | null {
    const serviceModule = toServiceModule(input);
    return serviceModule ? toIvrModuleRecordFromServiceModule(serviceModule) : null;
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

export class ServiceModuleContactLookup extends ServiceModuleBase {
    override serviceModuleTypeId: CallModuleType.ContactLookup = CallModuleType.ContactLookup;
    internalLookup = false;
    yellowPagesLookup = false;
    nextModuleId = 0;

    constructor(input: Record<string, unknown>) {
        super(input, CallModuleType.ContactLookup);
        this.internalLookup = Boolean(input['internalLookup']);
        this.yellowPagesLookup = Boolean(input['yellowPagesLookup']);
        this.nextModuleId = toFiniteNumber(input['nextModuleId']);
    }

    override getExitFields(): string[] {
        return ['nextModuleId'];
    }
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

export class ServiceModuleQueue implements ServiceModule, ExitFieldProvider {
    serviceModuleTypeId: CallModuleType.Queue = CallModuleType.Queue;
    id = 0;
    customerId = 0;
    locationId = 0;
    name = '';
    order = 0;
    serviceGroupId = 0;
    callLogVisible = false;
    propertyBase?: string;
    queueId = 0;
    queuePriority = 0;
    queueTimeout = 0;
    queueOptions = '';
    answer = false;
    extraTime = 0;
    timeoutModuleId = 0;
    joinEmptyModuleId = 0;
    leaveEmptyModuleId = 0;
    joinUnavailModuleId = 0;
    leaveUnavailModuleId = 0;
    fullModuleId = 0;
    continueModuleId = 0;
    surveyModuleId = 0;

    constructor(input: Record<string, unknown>) {
        this.id = toFiniteNumber(input['id']);
        this.customerId = toFiniteNumber(input['customerId']);
        this.locationId = toFiniteNumber(input['locationId']);
        this.name = typeof input['name'] === 'string' ? input['name'] : String(input['name'] ?? '');
        this.order = toFiniteNumber(input['order']);
        this.serviceGroupId = toFiniteNumber(input['serviceGroupId']);
        this.callLogVisible = Boolean(input['callLogVisible']);
        this.propertyBase = typeof input['propertyBase'] === 'string' ? input['propertyBase'] : undefined;

        this.queueId = toFiniteNumber(input['queueId']);
        this.queuePriority = toFiniteNumber(input['queuePriority']);
        this.queueTimeout = toFiniteNumber(input['queueTimeout']);
        this.queueOptions = typeof input['queueOptions'] === 'string' ? input['queueOptions'] : '';
        this.answer = Boolean(input['answer']);
        this.extraTime = toFiniteNumber(input['extraTime']);
        this.timeoutModuleId = toFiniteNumber(input['timeoutModuleId']);
        this.joinEmptyModuleId = toFiniteNumber(input['joinEmptyModuleId']);
        this.leaveEmptyModuleId = toFiniteNumber(input['leaveEmptyModuleId']);
        this.joinUnavailModuleId = toFiniteNumber(input['joinUnavailModuleId']);
        this.leaveUnavailModuleId = toFiniteNumber(input['leaveUnavailModuleId']);
        this.fullModuleId = toFiniteNumber(input['fullModuleId']);
        this.continueModuleId = toFiniteNumber(input['continueModuleId']);
        this.surveyModuleId = toFiniteNumber(input['surveyModuleId']);
    }

    getExitFields(): string[] {
        return [
            'timeoutModuleId',
            'joinEmptyModuleId',
            'leaveEmptyModuleId',
            'joinUnavailModuleId',
            'leaveUnavailModuleId',
            'fullModuleId',
            'continueModuleId',
            'surveyModuleId'
        ];
    }

    toServiceModuleCanvasElement(
        index: number,
        defaultLinkFieldResolver?: (module: IvrModuleRecord) => string
    ): ServiceModuleCanvasElement<IvrModuleRecord> {
        const moduleRecord = toIvrModuleRecordFromServiceModule(this);
        return toServiceModuleCanvasElement(
            moduleRecord,
            index,
            defaultLinkFieldResolver ?? (() => 'continueModuleId')
        );
    }
}

export class ServiceModuleSetVar extends ServiceModuleBase {
    override serviceModuleTypeId: CallModuleType.SetVar = CallModuleType.SetVar;
    variable = '';
    value = '';
    permanent = false;
    nextModuleId = 0;

    constructor(input: Record<string, unknown>) {
        super(input, CallModuleType.SetVar);
        this.variable = typeof input['variable'] === 'string' ? input['variable'] : '';
        this.value = typeof input['value'] === 'string' ? input['value'] : '';
        this.permanent = Boolean(input['permanent']);
        this.nextModuleId = toFiniteNumber(input['nextModuleId']);
    }

    override getExitFields(): string[] {
        return ['nextModuleId'];
    }
}

export class ServiceModuleMacro extends ServiceModuleBase {
    override serviceModuleTypeId: CallModuleType.Macro = CallModuleType.Macro;
    macro = '';
    macroArgs = '';
    nextModuleId = 0;

    constructor(input: Record<string, unknown>) {
        super(input, CallModuleType.Macro);
        this.macro = typeof input['macro'] === 'string' ? input['macro'] : '';
        this.macroArgs = typeof input['macroArgs'] === 'string' ? input['macroArgs'] : '';
        this.nextModuleId = toFiniteNumber(input['nextModuleId']);
    }

    override getExitFields(): string[] {
        return ['nextModuleId'];
    }
}

export class ServiceModuleWait extends ServiceModuleBase {
    override serviceModuleTypeId: CallModuleType.Wait = CallModuleType.Wait;
    wait = 0;
    nextModuleId = 0;

    constructor(input: Record<string, unknown>) {
        super(input, CallModuleType.Wait);
        this.wait = toFiniteNumber(input['wait']);
        this.nextModuleId = toFiniteNumber(input['nextModuleId']);
    }

    override getExitFields(): string[] {
        return ['nextModuleId'];
    }
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

export class ServiceModuleReadDtmf extends ServiceModuleBase {
    override serviceModuleTypeId: CallModuleType.ReadDtmf = CallModuleType.ReadDtmf;
    soundFile = '';
    variable = '';
    maxDigits = 0;
    timeout = 0;
    acceptableDigits = '';
    terminateDigits = '';
    terminateStartDigits = '';
    keepTerminateDigit = false;
    nextModuleId = 0;
    timeoutModuleId = 0;

    constructor(input: Record<string, unknown>) {
        super(input, CallModuleType.ReadDtmf);
        this.soundFile = typeof input['soundFile'] === 'string' ? input['soundFile'] : '';
        this.variable = typeof input['variable'] === 'string' ? input['variable'] : '';
        this.maxDigits = toFiniteNumber(input['maxDigits']);
        this.timeout = toFiniteNumber(input['timeout']);
        this.acceptableDigits = typeof input['acceptableDigits'] === 'string' ? input['acceptableDigits'] : '';
        this.terminateDigits = typeof input['terminateDigits'] === 'string' ? input['terminateDigits'] : '';
        this.terminateStartDigits = typeof input['terminateStartDigits'] === 'string' ? input['terminateStartDigits'] : '';
        this.keepTerminateDigit = Boolean(input['keepTerminateDigit']);
        this.nextModuleId = toFiniteNumber(input['nextModuleId']);
        this.timeoutModuleId = toFiniteNumber(input['timeoutModuleId']);
    }

    override getExitFields(): string[] {
        return ['nextModuleId', 'timeoutModuleId'];
    }
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

export class ServiceModuleInfo extends ServiceModuleBase {
    override serviceModuleTypeId: CallModuleType.Info = CallModuleType.Info;
    soundFile = '';
    answer = false;
    background = false;
    nextModuleId = 0;

    constructor(input: Record<string, unknown>) {
        super(input, CallModuleType.Info);
        this.soundFile = typeof input['soundFile'] === 'string' ? input['soundFile'] : '';
        this.answer = Boolean(input['answer']);
        this.background = Boolean(input['background']);
        this.nextModuleId = toFiniteNumber(input['nextModuleId']);
    }

    override getExitFields(): string[] {
        return ['nextModuleId'];
    }
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

export class ServiceModuleNumberListMatch extends ServiceModuleBase {
    override serviceModuleTypeId: CallModuleType.NumberListMatch = CallModuleType.NumberListMatch;
    numberListId = 0;
    matchModuleId = 0;
    noMatchModuleId = 0;

    constructor(input: Record<string, unknown>) {
        super(input, CallModuleType.NumberListMatch);
        this.numberListId = toFiniteNumber(input['numberListId']);
        this.matchModuleId = toFiniteNumber(input['matchModuleId']);
        this.noMatchModuleId = toFiniteNumber(input['noMatchModuleId']);
    }

    override getExitFields(): string[] {
        return ['matchModuleId', 'noMatchModuleId'];
    }
}


export interface ServiceModuleRequest {
    moduleId: number;
}

export class ServiceModuleSwitch extends ServiceModuleBase {
    override serviceModuleTypeId: CallModuleType.Switch = CallModuleType.Switch;
    variable = '';
    onModuleId = 0;
    offModuleId = 0;

    constructor(input: Record<string, unknown>) {
        super(input, CallModuleType.Switch);
        this.variable = typeof input['variable'] === 'string' ? input['variable'] : '';
        this.onModuleId = toFiniteNumber(input['onModuleId']);
        this.offModuleId = toFiniteNumber(input['offModuleId']);
    }

    override getExitFields(): string[] {
        return ['onModuleId', 'offModuleId'];
    }
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

export class ServiceModuleMultiSwitch extends ServiceModuleBase {
    override serviceModuleTypeId: CallModuleType.MultiSwitch = CallModuleType.MultiSwitch;
    guid = '';
    variable = '';
    noMatchModuleId = 0;
    exits: ServiceModuleMultiSwitchExit[] = [];

    constructor(input: Record<string, unknown>) {
        super(input, CallModuleType.MultiSwitch);
        this.guid = typeof input['guid'] === 'string' ? input['guid'] : '';
        this.variable = typeof input['variable'] === 'string' ? input['variable'] : '';
        this.noMatchModuleId = toFiniteNumber(input['noMatchModuleId']);
        this.exits = parseMultiSwitchExits(input['exits']);
    }

    override getExitFields(): string[] {
        const exitFields = this.exits.map((_exit, index) => `exits[${index}].nextModuleId`);
        return ['noMatchModuleId', ...exitFields];
    }
}

export class ServiceModuleAdvancedMenu extends ServiceModuleBase {
    override serviceModuleTypeId: CallModuleType.AdvancedMenu = CallModuleType.AdvancedMenu;
    answer = false;
    background = false;
    soundFile = '';
    interval = 0;
    count = 0;
    key0ModuleId = 0;
    key1ModuleId = 0;
    key2ModuleId = 0;
    key3ModuleId = 0;
    key4ModuleId = 0;
    key5ModuleId = 0;
    key6ModuleId = 0;
    key7ModuleId = 0;
    key8ModuleId = 0;
    key9ModuleId = 0;
    keyStarModuleId = 0;
    keyHashModuleId = 0;
    loopExhaustedModuleId = 0;
    surveyModule = false;

    constructor(input: Record<string, unknown>) {
        super(input, CallModuleType.AdvancedMenu);
        this.answer = Boolean(input['answer']);
        this.background = Boolean(input['background']);
        this.soundFile = typeof input['soundFile'] === 'string' ? input['soundFile'] : '';
        this.interval = toFiniteNumber(input['interval']);
        this.count = toFiniteNumber(input['count']);
        this.key0ModuleId = toFiniteNumber(input['key0ModuleId']);
        this.key1ModuleId = toFiniteNumber(input['key1ModuleId']);
        this.key2ModuleId = toFiniteNumber(input['key2ModuleId']);
        this.key3ModuleId = toFiniteNumber(input['key3ModuleId']);
        this.key4ModuleId = toFiniteNumber(input['key4ModuleId']);
        this.key5ModuleId = toFiniteNumber(input['key5ModuleId']);
        this.key6ModuleId = toFiniteNumber(input['key6ModuleId']);
        this.key7ModuleId = toFiniteNumber(input['key7ModuleId']);
        this.key8ModuleId = toFiniteNumber(input['key8ModuleId']);
        this.key9ModuleId = toFiniteNumber(input['key9ModuleId']);
        this.keyStarModuleId = toFiniteNumber(input['keyStarModuleId']);
        this.keyHashModuleId = toFiniteNumber(input['keyHashModuleId']);
        this.loopExhaustedModuleId = toFiniteNumber(input['loopExhaustedModuleId']);
        this.surveyModule = Boolean(input['surveyModule']);
    }

    override getExitFields(): string[] {
        return [
            'key0ModuleId',
            'key1ModuleId',
            'key2ModuleId',
            'key3ModuleId',
            'key4ModuleId',
            'key5ModuleId',
            'key6ModuleId',
            'key7ModuleId',
            'key8ModuleId',
            'key9ModuleId',
            'keyStarModuleId',
            'keyHashModuleId',
            'loopExhaustedModuleId'
        ];
    }
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

export interface ServiceModuleMultiSwitchExit {
    id: number;
    rule: string;
    nextModuleId: number;
}




export interface ServiceModuleAdvancedMenuPhrase {
    readonly id: number;
    readonly advancedMenuModuleId: number;
    readonly phrase: string;
    readonly voiceLanguage: number;
    readonly nextModuleId: number;
}

export class ServiceModuleSessionFields extends ServiceModuleBase {
    override serviceModuleTypeId: CallModuleType.SessionFields = CallModuleType.SessionFields;
    nextModuleId = 0;

    constructor(input: Record<string, unknown>) {
        super(input, CallModuleType.SessionFields);
        this.nextModuleId = toFiniteNumber(input['nextModuleId']);
    }

    override getExitFields(): string[] {
        return ['nextModuleId'];
    }
}

function parseMultiSwitchExits(value: unknown): ServiceModuleMultiSwitchExit[] {
    if (!Array.isArray(value)) {
        return [];
    }
    return value
        .map((item): ServiceModuleMultiSwitchExit | null => {
            if (!item || typeof item !== 'object') {
                return null;
            }
            const entry = item as Record<string, unknown>;
            return {
                id: toFiniteNumber(entry['id']),
                rule: typeof entry['rule'] === 'string' ? entry['rule'] : String(entry['rule'] ?? ''),
                nextModuleId: toFiniteNumber(entry['nextModuleId'])
            };
        })
        .filter((entry): entry is ServiceModuleMultiSwitchExit => entry !== null);
}

export interface ServiceModuleSessionVariablesData {
    id: number;
    sessionVariablesModuleId: number;
    channelVariable: string;
    name: string;
    writeChannel: boolean; // true = write to channel, false = read from channel
    jsonPath: string;
}


export class ServiceModuleTime extends ServiceModuleBase {
    override serviceModuleTypeId: CallModuleType.Time = CallModuleType.Time;
    timeZone = '';
    closedModuleId = 0;
    exits1 = 0;
    exits2 = 0;
    exits3 = 0;
    exits4 = 0;
    exits5 = 0;
    exits6 = 0;
    exits7 = 0;
    exits8 = 0;
    exits9 = 0;

    constructor(input: Record<string, unknown>) {
        super(input, CallModuleType.Time);
        this.timeZone =
            typeof input['timeZone'] === 'string'
                ? input['timeZone']
                : typeof input['timeRule'] === 'string'
                    ? input['timeRule']
                    : '';
        this.closedModuleId = toFiniteNumber(input['closedModuleId']);
        this.exits1 = toFiniteNumber(input['exits1']);
        this.exits2 = toFiniteNumber(input['exits2']);
        this.exits3 = toFiniteNumber(input['exits3']);
        this.exits4 = toFiniteNumber(input['exits4']);
        this.exits5 = toFiniteNumber(input['exits5']);
        this.exits6 = toFiniteNumber(input['exits6']);
        this.exits7 = toFiniteNumber(input['exits7']);
        this.exits8 = toFiniteNumber(input['exits8']);
        this.exits9 = toFiniteNumber(input['exits9']);
    }

    override getExitFields(): string[] {
        return [
            'closedModuleId',
            'exits1',
            'exits2',
            'exits3',
            'exits4',
            'exits5',
            'exits6',
            'exits7',
            'exits8',
            'exits9'
        ];
    }
}
