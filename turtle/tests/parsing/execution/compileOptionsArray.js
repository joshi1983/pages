export const compileOptionsArray = [
	{'name': 'Unoptimized', 'translateToJavaScript': false},
	{'name': 'JS Basic', 'translateToJavaScript': true},
	{
		'name': 'JS Merged',
		'mergeJavaScriptInstructions': true,
		'translateToJavaScript': true
	},
	{
		'name': 'Production Merged',
		'forProduction': true,
		'mergeJavaScriptInstructions': true,
		'translateToJavaScript': true
	},
	{
		'name': 'Production Basic',
		'forProduction': true,
		'mergeJavaScriptInstructions': false,
		'translateToJavaScript': true
	},
	{
		'name': 'Production Parse Basic',
		'forProduction': true,
		'mergeJavaScriptInstructions': false,
		'parsedOptimize': true,
		'translateToJavaScript': true
	},
	{
		'name': 'Production Parse Full',
		'forProduction': true,
		'mergeJavaScriptInstructions': true,
		'parsedOptimize': true,
		'translateToJavaScript': true
	}
];