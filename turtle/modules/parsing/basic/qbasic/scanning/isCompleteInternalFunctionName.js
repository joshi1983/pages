/*
I experimented with calculating all useful names from 
the QBasicInternalFunctions.

That caused this function to return true too many times to be helpful for the scanner.
For example "value" starts with "val" but we don't really want the scanner to split "val" from "ue".
"integer" also shouldn't be split into "int" and "eger".
A list of all exceptions makes this code too unmaintainable and unreliable to includes
every exception that really should be included.

Below lists a few function names that we're very confident should cause the scanner to split
any tokens prefixed with them.
*/
const names = new Set([
]);

export function isCompleteInternalFunctionName(s) {
	s = s.toLowerCase();
	return names.has(s);
};