export class ElementUtils {
	static getVerticalPadding(e) {
		if (!(e instanceof Element))
			throw new Error('e must be an Element');
		let result = 0;
		['padding-top', 'padding-bottom'].forEach(function(propertyName) {
			let val = window.getComputedStyle(e, null).getPropertyValue(propertyName);
			if (typeof val === 'string') {
				if (val === '')
					val = 0;
				else {
					if (val.toLowerCase().endsWith('px'))
						val = val.substring(0, val.length - 2);
					val = parseFloat(val);
					if (isNaN(val))
						throw new Error('Unable to get numeric value for ' + propertyName);
				}
			}
			result += val;
		});
		return result;
	}
};