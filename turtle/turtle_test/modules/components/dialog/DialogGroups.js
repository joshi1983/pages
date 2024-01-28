let groups = new Map();

export class DialogGroups {
	static HELP = 0;
	static ASSETS = 1;
	static CONFIRMATION = 2;

	static loadDependencies() {
		// setTimeout is used to prevent JavaScript dependency cycles.
		// showIndexSearchDialog depends on DialogGroups and vice versa.
		setTimeout(async function() {
			const showIndexSearchDialog = (await import('../../help/showIndexSearchDialog.js')).showIndexSearchDialog;
			const showAssetIndex = (await import('../../file/assets/showAssetIndex.js')).showAssetIndex;
			groups.get(DialogGroups.HELP).click = showIndexSearchDialog;
			groups.get(DialogGroups.ASSETS).click = showAssetIndex;
		}, 0);
	}

	static getInfoForGroup(id) {
		DialogGroups.validateId(id);
		return groups.get(id);
	}

	static validateId(id) {
		if (!groups.has(id))
			throw new Error('Invalid id(' + id + ').  Must be one of ' + JSON.stringify(Array.from(groups.keys())) + ' and should be specified using a DialogGroupss constant.');
	}
};

groups.set(DialogGroups.HELP, {
	'width': 450,
	'height': 330,
	'icon': 'dialog-icon help-index',
	'iconTitle': 'Help index'
});

groups.set(DialogGroups.ASSETS, {
	'width': 450,
	'height': 330,
	'icon': 'dialog-icon asset-index',
	'iconTitle': 'Asset Index'
});

groups.set(DialogGroups.CONFIRMATION, {
	'width': 350,
	'height': 200,
	'icon': 'dialog-icon confirmation',
	'iconTitle': 'Confirmation'
});
