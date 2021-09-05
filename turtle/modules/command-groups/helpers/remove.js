export function remove(thingToRemove, things) {
	if (typeof things === 'string') {
		if (typeof thingToRemove !== 'string')
			return things;
		if (thingToRemove.length === 1) {
			return things.replaceAll(thingToRemove, '');
		}
		return things;
	}
	else {
		return things.filter(thing => thingToRemove !== thing);
	}
};