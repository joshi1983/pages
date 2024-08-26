let groups = new Map();

console.log(`About to export DialogGroups class.`);
export class DialogGroups {
	static HELP = 0;
	static CONFIRMATION = 2;

	static loadDependencies() {
		// setTimeout is used to prevent JavaScript dependency cycles.
		// showIndexSearchDialog depends on DialogGroups and vice versa.
		console.log('about to start setTimeout.');
		setTimeout(function() {
			console.log(`about to import showIndexSearchDialog module`);
			import('../../help/showIndexSearchDialog.js').then(function(showIndexModule) {
				console.log(`got showIndexSearchDialog module and now setting click on groups map.`);
				/*const showIndexSearchDialog = showIndexModule.showIndexSearchDialog;
				const obj = groups.get(DialogGroups.HELP);
				console.log(`obj = ${obj}`, obj);
				if (obj !== null && typeof obj === 'object')
					obj.click = showIndexSearchDialog;
				*/console.log(`set the key-value pair in the groups Map.`);
			});
			console.log(`The import call was invoked.  Now, waiting for the then call back to be invoked.`);
		}, 0);
		console.log(`setTimeout was called.  Now, we'll wait for an interval of 0 miliseconds.`);
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

groups.set(DialogGroups.CONFIRMATION, {
	'width': 350,
	'height': 200,
	'icon': 'dialog-icon confirmation',
	'iconTitle': 'Confirmation'
});
console.log(`About to export DialogGroups class.`);
