// Simulates physics
// Lets blade speed affect elevation
function simulateRealWorld(a) {
	// Simulate effect of blade speed on vertical acceleration and vertical position.
	const bladeSpeedLiftCoefficient = 0.02;
	var lift = a.controlState.bladeSpeed * bladeSpeedLiftCoefficient;
	var droneMass = 5;
	var g = 9.8;
	var weight = droneMass * g;
	var verticalForce = lift - weight;
	var verticalAcceleration = verticalForce / droneMass;
	var deltaVerticalVelocity = verticalAcceleration * a.timeInterval;
	a.realWorld.verticalAcceleration = verticalAcceleration;
	a.realWorld.verticalVelocity += deltaVerticalVelocity;
	a.realWorld.elevation += a.realWorld.verticalVelocity * a.timeInterval;
	a.t += a.timeInterval; // simulate passage of time.

	// if hitting the ground, simulate drone completely stopping vertical movement.
	if (a.realWorld.elevation < 0) {
		a.realWorld.verticalVelocity = 0;
		a.realWorld.verticalAcceleration = 0;
		a.realWorld.elevation = 0;
	}
	return a;
}

// Turns real world data into simulated IMU sensor values.
// A real IMU sensor isn't perfect so we offset with some random values 
// to make them different from their realWorld counterparts.
function simulateIMU(a) {
	// adding a random value to simulate a little error of -0.1 to 0.1.
	a.imu.elevation = a.realWorld.elevation + Math.random() * 0.1;
	a.imu.verticalVelocity = a.realWorld.verticalVelocity + Math.random() * 0.05;
	return a;
}

// Looks at IMU sensor values and updates 
// blade speed to achieve next goal elevation.
function makeControlDecisions(a) {
	if (a.controlState.goal.elevation === 0 && a.imu.elevation < 0.1) {
		a.isComplete = true; // end the simulation loop.
	}
	else {
		// record how long we're close to the goal elevation.
		if (Math.abs(a.imu.elevation - a.controlState.goal.elevation) < 5) {
			a.controlState.goal.achievementTime += a.timeInterval;
			
			// If we spend over a second at close to the desired elevation, land.
			if (a.controlState.goal.achievementTime > 1) {
				a.controlState.goal.elevation = 0; // go back to ground.
			}
		}
		else {
			a.controlState.goal.achievementTime = 0;
		}
		
		var desiredElevationChange = a.controlState.goal.elevation - a.imu.elevation;
		// Calculate a velocity that should reach the desired elevation soon enough.
		var desiredVerticalVelocity = desiredElevationChange * 0.1;
		var bladeSpeedChange = (desiredVerticalVelocity - a.imu.verticalVelocity) * 0.5;

		// Accelerate the blades faster when we're sure the drone isn't getting off the ground
		// and our goal elevation is off the ground.
		if (a.imu.elevation < 0.1 && a.controlState.goal.elevation > 1 
		&& a.controlState.bladeSpeed < 2400) {
			bladeSpeedChange *= 10;
		}

		// Adjust the blade speed to reach that velocity.
		a.controlState.bladeSpeed += bladeSpeedChange;
		

		// There is no good reason to have a negative blade speed so eliminate that case.
		if (a.controlState.bladeSpeed < 0)
			a.controlState.bladeSpeed = 0;
	}
	return a;
}



// Each call simulates 1 full cycle of the simulation loop and passage 
// of a short time interval.
function updateInterval(a, drawing, csvRecorder) {
	if (!a.isComplete) {
		a = simulateRealWorld(a);
		a = simulateIMU(a);
		a = makeControlDecisions(a);

		csvRecorder.record(a);
		drawing.draw(a);
		requestAnimationFrame(function() {
			updateInterval(a, drawing, csvRecorder);
		});
	}
}

function startSimulationLoop(drawing, csvRecorder) {
	var a = {
		'imu': {},
		'realWorld': {
			'verticalVelocity': 0, // start with vertical velocity of 0.
			'elevation': 0 // start on the ground
		},
		'controlState': {
			'goal': {
				'elevation': 20 // initial goal is 20 units off ground.
			},
			'bladeSpeed': 0 // initially, blade is not rotating.
		},
		't': 0,
		'timeInterval': 0.01,
		'isComplete': false
	};
	updateInterval(a, drawing, csvRecorder);
}