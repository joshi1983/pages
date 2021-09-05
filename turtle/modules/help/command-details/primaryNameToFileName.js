/*
This is different from getMethodNameForCommand in that 
we don't want to replace dot(.) with underscore(_).

We're forced to replace ? with p because ? is not allowed in file systems, at least not allowed in Windows.
We don't want to replace . because it is allowed in most file systems.  We want to replace only when necessary because
the more similar the file names are to the primary names, the clearer and better.
*/
export function primaryNameToFileName(primaryName) {
	if (primaryName.endsWith('?'))
		primaryName = primaryName.substring(0, primaryName.length - 1) + 'p';
	return primaryName;
};