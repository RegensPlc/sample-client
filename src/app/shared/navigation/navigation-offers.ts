export class OffersRoutes {
	public getOfferListUrl(): string {
		return `/offers`;
	}
	public offerDetailsUrl(offerId: number | null): string {
		return `/offers/${offerId == null ? 'new' : offerId}`;
	}
}

export class NavigationServiceForOffers {
	public getRoutes(): OffersRoutes {
		return new OffersRoutes();
	}
}
