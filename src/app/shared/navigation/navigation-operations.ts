export class OperationsRoutes {
	public getOperationListUrl(): string {
		return `/operations`;
	}

	public operationDetailsUrl(operationId: number | String | null): string {
		return `/operations/${operationId == null ? 'new' : operationId}`;
	}
}

export class NavigationServiceForOperations {
	public getRoutes(): OperationsRoutes {
		return new OperationsRoutes();
	}
}
