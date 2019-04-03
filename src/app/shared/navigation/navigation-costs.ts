export class CostsRoutes {
	public getCostDiaryUrl(): string {
		return `/costs`;
	}

	public getCostDetailUrl(diaryId: number): string {
		return `${this.getCostDiaryUrl()}/${diaryId}`;
	}

	public getClosingUrl(diaryId: number): string {
		return `${this.getCostDetailUrl(diaryId)}/closing`;
	}

	public getPreparationUrl(diaryId: number): string {
		return `${this.getCostDetailUrl(diaryId)}/preparation`;
	}

	public getActualCostsUrl(diaryId: number): string {
		return `${this.getCostDetailUrl(diaryId)}/actual-costs`;
	}

	public getMonthlyCostsUrl(diaryId: number): string {
		return `${this.getCostDetailUrl(diaryId)}/monthly-costs`;
	}

	public getAnalysisUrl(diaryId: number): string {
		return `${this.getCostDetailUrl(diaryId)}/analysis`;
	}

	public getConsumptionsUrl(diaryId: number): string {
		return `${this.getCostDetailUrl(diaryId)}/consumptions`;
	}
}

export class NavigationServiceForCosts {
	public getRoutes(): CostsRoutes {
		return new CostsRoutes();
	}
}
