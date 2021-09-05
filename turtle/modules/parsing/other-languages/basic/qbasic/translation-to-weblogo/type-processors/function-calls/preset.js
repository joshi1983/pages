import { pset, getToName as psetGetToName } from './pset.js';

export function getToName(token) {
	return psetGetToName(token);
};

/*
Basically the same as pset.
The only difference I could find is the default color used 
if no color is explicitly indicated in the argument list.

preset defaults to the background color.
pset defaults to the current pen or fill color.
That default color might be implemented later but it is not here as I type this comment.
*/
export function preset(token, result, options) {
	pset(token, result, options);
};