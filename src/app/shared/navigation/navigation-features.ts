import { OffersRoutes, NavigationServiceForOffers } from './navigation-offers';
import { OperationsRoutes, NavigationServiceForOperations } from './navigation-operations';
import { CostsRoutes, NavigationServiceForCosts } from './navigation-costs';

export class FeaturesRoutes {

	public offers(): OffersRoutes {
		return new NavigationServiceForOffers().getRoutes();
	}

	public operations(): OperationsRoutes {
		return new NavigationServiceForOperations().getRoutes();
	}

	public costs(): CostsRoutes {
		return new NavigationServiceForCosts().getRoutes();
	}

}

export class NavigationServiceForFeatures {
	public getRoutes(): FeaturesRoutes {
		return new FeaturesRoutes();
	}
}
