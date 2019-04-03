export class LoginRoutes {
	public loginUrl(): string {
		return `/login`;
	}
}

export class NavigationServiceForLogin {
	public getRoutes(): LoginRoutes {
		return new LoginRoutes();
	}
}
