export class IndexSearchTopic {
	static TopicTypeCommand = 0;
	static TopicTypeOperator = 1;
	static TopicTypeGeneral = 2;
	static TopicTypeTutorial = 3;
	static TopicTypeDataType = 4;
	static TopicTypeBreakpoint = 5;

	constructor(type, info, click) {
		if (!Number.isInteger(type))
			throw new Error('type must be an integer.  Not: ' + type);
		if (typeof click !== 'function')
			throw new Error('click must be a function');

		this.type = type;
		this.primaryName = info.primaryName;
		this.names = [];
		this.searchKeywords = [];
		this.click = click;
		if (info.names instanceof Array)
			this.names = info.names;
		if (info.searchKeywords instanceof Array)
			this.searchKeywords = info.searchKeywords;
	}

	getIconClasses() {
		return typesInfo[this.type].iconClass;
	}

	getTypeTitle() {
		return typesInfo[this.type].title;
	}
};

const typesInfo = [];
typesInfo[IndexSearchTopic.TopicTypeBreakpoint] = {
	'iconClass': 'breakpoint-icon',
	'title': 'breakpoint'
};
typesInfo[IndexSearchTopic.TopicTypeCommand] = {
	'iconClass': 'command-icon',
	'title': 'command'
};
typesInfo[IndexSearchTopic.TopicTypeOperator] = {
	'iconClass': 'operators-icon',
	'title': 'operator'
};
typesInfo[IndexSearchTopic.TopicTypeDataType] = {
	'iconClass': 'datatypes-icon',
	'title': 'datatypes'
};
typesInfo[IndexSearchTopic.TopicTypeTutorial] = {
	'iconClass': 'fa-graduation-cap',
	'title': 'tutorial'
};
typesInfo[IndexSearchTopic.TopicTypeGeneral] = {
	'iconClass': 'weblogo-icon',
	'title': 'general help topic'
};
