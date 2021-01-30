pointsData = [];

function addPointToModel(pointInfo) {
	var scale = pointInfo.radius/255;
	pointInfo.r *= scale;
	pointInfo.g *= scale;
	pointInfo.b *= scale;
	pointsData.push(new Point([pointInfo.cx, pointInfo.cy, pointInfo.cz], pointInfo.r, pointInfo.g, pointInfo.b));
}

function addExtremelyTiny(cx, cy, cz) {
	addPointToModel({
		'cx': cx,
		'cy': cy,
		'cz': cz,
		'radius': 0.1,
		"r": 0xff,
		"g": 0xff,
		"b": 0xff
	});
}

function addSuperTiny(cx, cy, cz) {
	addPointToModel({
		'cx': cx,
		'cy': cy,
		'cz': cz,
		'radius': 0.6,
		"r": 0,
		"g": 0,
		"b": 0x88
	});
	var tinyRadius = 1.2;
	for (var i = 0; i < 3; i++) {
		var angle = i * Math.PI * 2 / 3;
		var x = cx + tinyRadius * Math.cos(angle);
		var z = cz + tinyRadius * Math.sin(angle);
		addExtremelyTiny(x, cy + tinyRadius, z);
		addExtremelyTiny(x, cy - tinyRadius, z);
	}
}

function addTiny(cx, cy, cz) {
	addPointToModel({
		'cx': cx,
		'cy': cy,
		'cz': cz,
		'radius': 1,
		'r': 0x44,
		'g': 0xbb,
		'b': 0,
	});
	
	var smallRadius = 3;
	for (var i = 0; i < 4; i++) {
		var angle = i * Math.PI / 2;
		var x = cx + smallRadius * Math.cos(angle);
		var z = cz + smallRadius * Math.sin(angle);
		addSuperTiny(x, cy + smallRadius, z);
		addSuperTiny(x, cy - smallRadius, z);
	}
}

function addSmall(cx, cy, cz) {
	addPointToModel({
		'cx': cx,
		'cy': cy,
		'cz': cz,
		'radius': 3,
		'r': 0xff,
		'g': 0x55,
		'b': 0xff
	});
	var smallRadius = 10;
	for (var i = 0; i < 8; i++) {
		var angle = i * Math.PI / 4;
		var x = cx + smallRadius * Math.cos(angle);
		var z = cz + smallRadius * Math.sin(angle);
		addTiny(x, cy + smallRadius, z);
		addTiny(x, cy - smallRadius, z);
	}
}

function addGlowing(cx, cy, cz) {
	addPointToModel({
		'cx': cx,
		'cy': cy,
		'cz': cz,
		'radius': 6,
		'r': 0xff,
		'g': 0xdd,
		'b': 0xff
	});
	var smallRadius = 30;
	for (var i = 0; i < 8; i++) {
		var angle = i * Math.PI / 4;
		var x = cx + smallRadius * Math.cos(angle);
		var z = cz + smallRadius * Math.sin(angle);
		addSmall(x, cy + smallRadius, z);
		addSmall(x, cy - smallRadius, z);
	}
}

function initializeModel() {
	addPointToModel({
		"cx": 0,
		"cy": 0,
		"cz": 0,
		"radius": 20,
		"r": 0xff,
		"g": 0xff,
		"b": 0xee
	});

	var radius = 100;        
	for (var i = 0; i < 8; i++) {
		var angle = i * Math.PI / 4;
		var x = radius * Math.cos(angle);
		var z = radius * Math.sin(angle);
		addGlowing(x, 100, z);
		addGlowing(x, -100, z);
	}
}

initializeModel();

