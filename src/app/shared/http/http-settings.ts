export interface HttpSettings {
	suppressErrorMessage?: boolean;
	contentType?: string;
	/**If not specified text because the whole "response" is observed not just the "body"
	 * if observe is "body" --> responseType should be "json"
	 */
	responseType?: string;
}
