/* tslint:disable */

export interface AccountInfo {
    displayName: string;
    username: string;
    customer: string;
    roles: RoleType[];
}

export interface CityInfo {
    id: number;
    zipCode: string;
    country: string;
    city: string;
}

export interface CitySearchRequest {
    searchTerm: string;
}

export interface CoworkerInfo extends NameIdPair {
    userCode: string;
}

export interface BarchartInfo {
    x: string;
    values: number[];
}

export interface BuildInfo {
    environment: string;
    version: string;
}

export interface NameCodePair {
    code: string;
    displayName: string;
}

export interface NameIdPair {
    id: number;
    displayName: string;
}

export interface PagedRequest {
    page: number;
    pageSize: number;
}

export interface PagedResponse<T> {
    data: T[];
    totalCount: number;
}

export interface ServerInfo {
    buildInfo: BuildInfo;
    maxFileSize: number;
}

export interface SortablePagedRequest extends PagedRequest {
    sortField: string;
    asc: boolean;
}

export interface DocumentCreateData {
    fileId: string;
    type: string;
    fileName: string;
    tasktype: TaskType;
    note: string;
}

export interface DocumentDetails {
    id: number;
    fileName: string;
    fullPath: string;
    taskType: TaskType;
    type: string;
    note: string;
}

export interface DocumentsUpdateRequest {
    deletedDocumentIds: number[];
    newDocuments: DocumentCreateData[];
}

export interface FileDeleteRequest {
    fileIds: string[];
}

export interface MachineSearchRequest {
    searchTerm: string;
}

export interface PartnerSearchRequest {
    searchTerm: string;
}

export interface TaskTypeOptions {
    exciseOptions: NameIdPair[];
    nctsOptions: NameIdPair[];
    trackOptions: NameIdPair[];
    storeOptions: NameIdPair[];
}

export interface PartnerAdministratorEmailInfo {
    email: string;
}

export interface PartnerAdministratorInfo extends NameIdPair {
    partnerId: number;
}

export interface WarehouseInfo {
    id: string;
    name: string;
}

export interface ConsumptionData {
    machineId: number;
    consumption: number;
    unitPrice: number;
    operationHours: number;
    use: boolean;
}

export interface ConsumptionInfo {
    machineId: number;
    machineName: string;
    consumption: number;
    unitPrice: number;
    operationHours: number;
    use: boolean;
}

export interface ConsumptionResponse extends PagedResponse<ConsumptionInfo> {
}

export interface CostAnalysisListResponse extends PagedResponse<CostAnalysisSummary> {
    totalIncome: number;
    totalExpense: number;
    barchartInfo: BarchartInfo[];
}

export interface CostAnalysisOperationDetailsRequest {
    operationId: string;
    partnerCode: string;
}

export interface CostAnalysisOperationDetailsResponse {
    operationType: string;
    warehouseCode: string;
    gift: boolean;
    equipment: string;
    comment: string;
    expense: number;
}

export interface CostAnalysisPartnerDetailsRequest {
    partnerCode: string;
}

export interface CostAnalysisPartnerDetailsResponse {
    partnerCode: string;
    operationName: string;
    operationId: string;
    euvamFlag: boolean;
    trackFlag: boolean;
    raktarFlag: boolean;
    warehouseCode: string;
    income: number;
    expense: number;
    operationCostDetails: CostAnalysisOperationDetailsResponse[];
}

export interface CostAnalysisSearchRequest extends SortablePagedRequest {
    partnerCode: string;
    warehouseCode: string;
}

export interface CostAnalysisSummary {
    partner: NameCodePair;
    income: number;
    expense: number;
    costDetails: CostAnalysisPartnerDetailsResponse[];
}

export interface CostTypeInfo {
    id: string;
    name: string;
    warehouseRequired: boolean;
    baseHourRequired: boolean;
    clientRequired: boolean;
    deviceRequired: boolean;
    buildingRequired: boolean;
}

export interface CostDiaryMonthInfo {
    diaryId: number;
    month: number;
    status: string;
    end: DateAsString;
    lastModified: DateAsString;
    openPerAllOperationsCount: string;
}

export interface CostDiaryGeneralInfo {
    year: number;
    month: number;
    processes: { [index: string]: ProcessStatus };
}

export interface DiaryProcessInfo {
    type: ProcessType;
    status: ProcessStatus;
}

export interface MonthlyCostInfo {
    title: string;
    comment: string;
    cost: number;
    children: MonthlyCostInfo[];
}

export interface CostBaseNumberInfo {
    storeCode: string;
    euvamDb: number;
    trackDb: number;
    storeDb: number;
    allDb: number;
}

export interface CostMonthlyBaseDataInfo {
    device: string;
    consumption: number;
    unitPrice: number;
    gepkonyvUzemora: number;
    haviElmUzemora: number;
    haviMkonyvUzemora: number;
    haviRezsiUzemora: number;
    haviUzemanyagKoltseg: number;
    haviUzemanyagOradij: number;
}

export interface CostMonthlyWorkhoursInfo {
    storeCode: string;
    type: string;
    device: string;
    workingHours: number;
}

export interface RegisteredCostData {
    id: number;
    fromDate: DateAsString;
    toDate: DateAsString;
    type: string;
    name: string;
    value: number;
    warehouseCode: string;
    buildingId: number;
    baseHours: number;
    clientId: string;
    clientName: string;
    deviceId: number;
    deviceName: string;
}

export interface RegisteredCostPagedRequest extends SortablePagedRequest {
    type: string;
}

export interface RegisteredCostRequest {
    newElements: RegisteredCostData[];
    deletedElements: number[];
    updatedElements: RegisteredCostData[];
}

export interface RegisteredCostResponse extends PagedResponse<RegisteredCostData> {
}

export interface OfferData {
    partnerId: number;
    liablePerson: string;
    partnerAdministrator: number;
    status: string;
    typeId: string;
    resultId: string;
    resultComment: string;
    paymentMethod: string;
    paymentCurrency: string;
    paymentDays: number;
    comment: string;
    date: DateAsString;
    startOfValidity: DateAsString;
    endOfValidity: DateAsString;
    parityCode: string;
    parityComment: string;
    languageCode: string;
}

export interface OfferDetailInfo {
    id: number;
    year: number;
    serial: number;
    partner: NameIdPair;
    liablePerson: string;
    partnerAdministrator: NameIdPair;
    typeId: string;
    statusId: string;
    resultId: string;
    resultComment: string;
    paymentMethodId: string;
    paymentCurrencyId: string;
    paymentDays: number;
    comment: string;
    date: DateAsString;
    startOfValidity: DateAsString;
    endOfValidity: DateAsString;
    parityCode: string;
    parityComment: string;
    languageCode: string;
}

export interface SendOfferData {
    recipients: string;
    message: string;
}

export interface OfferItemData {
    id: number;
    serial: number;
    typeCode: string;
    weight: number;
    volume: number;
    naturalia: string;
    productType: string;
    value: number;
    currencyCode: string;
    comment: string;
    upDate: DateAsString;
    upCode: string;
    upCompany: string;
    upZipCode: string;
    upCityCode: number;
    upCity: string;
    upAddress: string;
    upComment: string;
    downDate: DateAsString;
    downCode: string;
    downCompany: string;
    downZipCode: string;
    downCityCode: number;
    downCity: string;
    downAddress: string;
    downComment: string;
}

export interface OfferItemsRequest {
    newElements: OfferItemData[];
    deletedElements: number[];
    updatedElements: OfferItemData[];
}

export interface OfferListResponse extends PagedResponse<OfferSummary> {
}

export interface OfferSearchRequest extends SortablePagedRequest {
    year: number;
    serial: number;
    type: string;
    status: string;
    result: string;
    partnerName: string;
    dateFrom: DateAsString;
    dateTo: DateAsString;
}

export interface OfferSummary {
    id: number;
    offerId: string;
    year: number;
    serial: number;
    partnerName: string;
    typeName: string;
    typeId: string;
    statusName: string;
    statusId: string;
    resultName: string;
    resultId: string;
    date: DateAsString;
    endOfValidity: DateAsString;
}

export interface OperationData {
    partnerId: number;
    hasExcise: boolean;
    hasTrack: boolean;
    hasStore: boolean;
    coworkerCode: string;
    description: string;
    addedTasks: { [index: string]: number[] };
    deletedTasks: number[];
    date: DateAsString;
}

export interface OperationDetailInfo {
    partner: NameIdPair;
    coworkerUserName: string;
    description: string;
    tasks: { [index: string]: TaskInfo[] };
    creator: string;
    createdAt: DateAsString;
    modifier: string;
    modifiedAt: DateAsString;
    closedDate: DateAsString;
    hasExcise: boolean;
    hasTrack: boolean;
    hasStore: boolean;
    operationIdSerial: string;
    date: DateAsString;
}

export interface TaskInfo {
    id: number;
    text: string;
}

export interface OperationListResponse extends PagedResponse<OperationSummary> {
}

export interface OperationSearchRequest extends SortablePagedRequest {
    operationIdYear: number;
    operationIdSerial: number;
    partnerName: string;
    openedDate: DateAsString;
    closedDate: DateAsString;
    closed: boolean;
    comment: string;
}

export interface OperationSummary {
    id: number;
    operationId: string;
    operationIdYear: number;
    operationIdSerial: number;
    partnerName: string;
    openedDate: DateAsString;
    closedDate: DateAsString;
    euvam: boolean;
    track: boolean;
    raktar: boolean;
    comment: string;
}

export interface OperationNotificationData {
    email: string;
    name: string;
}

export type DateAsString = string;

export const enum RoleType {
    ROLE_COST_READ = "ROLE_COST_READ",
    ROLE_COST_WRITE = "ROLE_COST_WRITE",
    ROLE_COST_ADMIN = "ROLE_COST_ADMIN",
    ROLE_OPERATION_READ = "ROLE_OPERATION_READ",
    ROLE_OPERATION_WRITE = "ROLE_OPERATION_WRITE",
    ROLE_OPERATION_ADMIN = "ROLE_OPERATION_ADMIN",
    ROLE_OFFER_READ = "ROLE_OFFER_READ",
    ROLE_OFFER_WRITE = "ROLE_OFFER_WRITE",
    ROLE_OFFER_ADMIN = "ROLE_OFFER_ADMIN",
}

export const enum ProcessStatus {
    UNDEFINED = "UNDEFINED",
    CLOSED = "CLOSED",
    OPENED = "OPENED",
    REOPENED = "REOPENED",
}

export const enum ProcessType {
    UNDEFINED = "UNDEFINED",
    CLOSE = "CLOSE",
    BASE_NUMBERS = "BASE_NUMBERS",
    BASE_DATA = "BASE_DATA",
    WORKING_HOURS = "WORKING_HOURS",
    REGISTERED_COSTS = "REGISTERED_COSTS",
    MONTHLY_COSTS = "MONTHLY_COSTS",
    OPERATION_COSTS = "OPERATION_COSTS",
}

export const enum TaskType {
    TRACK = "TRACK",
    EXCISE = "EXCISE",
    STORE = "STORE",
    NCTS = "NCTS",
}
