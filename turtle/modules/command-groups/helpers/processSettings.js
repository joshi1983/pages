import { noop } from '../../noop.js';
import { valueToString } from '../../valueToString.js';

/*
processSettings is a small optimization for slightly faster performance.
processSettings also helps move a bit of code out of Turtle since Turtle.js is getting cumbersomely long.

A few methods perform checks on the settings.
These checks are slightly more efficient if the functions are set
below instead of frequently looking at settings every time they're called.
*/
export function processSettings(turtle) {
	if (typeof turtle.settings.warn === 'function')
		turtle._warn = turtle.settings.warn;
	else
		turtle._warn = noop;

	if (typeof turtle.settings.error === 'function')
		turtle._error = turtle.settings.error;
	else
		turtle._error = noop;
	if (typeof turtle.settings.print === 'function') {
		turtle.print = function(value) {
			let argValuesStr = '';
			for (let i = 0; i < arguments.length; i++) {
				if (i !== 0)
					argValuesStr += ' ';
				argValuesStr += valueToString(arguments[i]);
			}
			turtle.settings.print(turtle._printBuffer.toString() + argValuesStr);
			turtle._printBuffer.clear();
		};
		turtle.type = function(value) {
			turtle._printBuffer.append(valueToString(value));
		};
	}
	else {
		turtle.print = noop;
		turtle.type = noop;
	}
};