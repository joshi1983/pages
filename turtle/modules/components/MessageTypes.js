// responsible for showing recently entered commands and messages related to them.
const ClassNames = [
	'code', 'error', 'printed', 'special', 'tip', 'warning', 'success'
];
const iconClassNames = [];

export class MessageTypes {
	static TypeCodeSnippet = 0;
	static TypeError = 1;
	static TypePrinted = 2;
	static TypeSpecial = 3;
	static TypeTip = 4;
	static TypeWarning = 5;
	static TypeSuccess = 6;
	static urgencyOrder = [
		MessageTypes.TypeError,
		MessageTypes.TypeWarning,
		MessageTypes.TypeTip,
		MessageTypes.TypeSpecial,
		MessageTypes.TypePrinted,
		MessageTypes.TypeSuccess,
		MessageTypes.TypeCodeSnippet
	];

	static compareUrgency(type1, type2) {
		return MessageTypes.urgencyOrder.indexOf(type1) - MessageTypes.urgencyOrder.indexOf(type2);
	}

	static getClassName(type) {
		return ClassNames[type];
	}

	static getIconClassName(type) {
		return iconClassNames[type];
	}

	static getMostUrgentType(type1, type2) {
		if (type1 === type2)
			return type1;
		if (MessageTypes.urgencyOrder.indexOf(type1) > MessageTypes.urgencyOrder.indexOf(type2))
			return type2;
		else
			return type1;
	}
};

iconClassNames[MessageTypes.TypeCodeSnippet] = 'code-snippet-icon';
iconClassNames[MessageTypes.TypeError] = 'fa-ban';
iconClassNames[MessageTypes.TypePrinted] = 'fa-print';
iconClassNames[MessageTypes.TypeTip] = 'fa-info-circle';
iconClassNames[MessageTypes.TypeWarning] = 'fa-exclamation-triangle';
