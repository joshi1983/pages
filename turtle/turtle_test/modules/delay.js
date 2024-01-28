export function delay(timeMilliseconds) {
	return new Promise((resolve) => setTimeout(resolve, timeMilliseconds));
}