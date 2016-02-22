/***
 * Created by Glen Berseth Feb 5, 2016
 * Created for Project 2 of CPSC314 Introduction to graphics Course.
 */

// Build a visual axis system
function buildAxis( src, dst, colorHex, dashed ) {
        var geom = new THREE.Geometry(),
            mat;

        if(dashed) {
                mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
                mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push( src.clone() );
        geom.vertices.push( dst.clone() );
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line( geom, mat, THREE.LinePieces );

        return axis;

}
var length = 100.0;
// Build axis visuliaztion for debugging.
x_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( length, 0, 0 ),
	    0xFF0000,
	    false
	)
y_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( 0, length, 0 ),
	    0x00ff00,
	    false
	)
z_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( 0, 0, length ),
	    0x0000FF,
	    false
	)
	
// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}
//ASSIGNMENT-SPECIFIC API EXTENSION
// For use with matrix stack
THREE.Object3D.prototype.setMatrixFromStack = function(a) {
  this.matrix=mvMatrix;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// Data to for the two camera view
var mouseX = 0, mouseY = 0;
var windowWidth, windowHeight;
var views = [
	{
		left: 0,
		bottom: 0,
		width: 0.499,
		height: 1.0,
		background: new THREE.Color().setRGB( 0.1, 0.1, 0.1 ),
		eye: [ 80, 20, 80 ],
		up: [ 0, 1, 0 ],
		fov: 45,
		updateCamera: function ( camera, scene, mouseX, mouseY ) {		}
	},
	{
		left: 0.501,
		bottom: 0.0,
		width: 0.499,
		height: 1.0,
		background: new THREE.Color().setRGB( 0.1, 0.1, 0.1 ),
		eye: [ 65, 20, 65 ],
		up: [ 0, 1, 0 ],
		fov: 45,
		updateCamera: function ( camera, scene, mouseX, mouseY ) {		}
	}
];



//SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
// renderer.setClearColor(0xFFFFFF); // white background colour
canvas.appendChild(renderer.domElement);

// Creating the two cameras and adding them to the scene.
var view = views[0];
camera_MotherShip = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
camera_MotherShip.position.x = view.eye[ 0 ];
camera_MotherShip.position.y = view.eye[ 1 ];
camera_MotherShip.position.z = view.eye[ 2 ];
camera_MotherShip.up.x = view.up[ 0 ];
camera_MotherShip.up.y = view.up[ 1 ];
camera_MotherShip.up.z = view.up[ 2 ];
camera_MotherShip.lookAt( scene.position );
view.camera = camera_MotherShip;
scene.add(view.camera);

var view = views[1];
camera_ScoutShip = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
camera_ScoutShip.position.x = view.eye[ 0 ];
camera_ScoutShip.position.y = view.eye[ 1 ];
camera_ScoutShip.position.z = view.eye[ 2 ];
camera_ScoutShip.up.x = view.up[ 0 ];
camera_ScoutShip.up.y = view.up[ 1 ];
camera_ScoutShip.up.z = view.up[ 2 ];
camera_ScoutShip.lookAt( scene.position );
view.camera = camera_ScoutShip;
scene.add(view.camera);


// ADDING THE AXIS DEBUG VISUALIZATIONS
scene.add(x_axis);
scene.add(y_axis);
scene.add(z_axis);


// ADAPT TO WINDOW RESIZE
function resize() {
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
  renderer.setSize(window.innerWidth,window.innerHeight);
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () 
{
     window.scrollTo(0,0);
}

var ambientLight = new THREE.AmbientLight( 0x222222 );
scene.add( ambientLight );

var lights = [];
lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[0].castShadow = true;

lights[0].position.set( 0, 0, 0 ); // IN THE SUN....

scene.add( lights[0] );

// SETUP HELPER GRID
// Note: Press Z to show/hide
var gridGeometry = new THREE.Geometry();
var i;
for(i=-50;i<51;i+=2) {
    gridGeometry.vertices.push( new THREE.Vector3(i,0,-50));
    gridGeometry.vertices.push( new THREE.Vector3(i,0,50));
    gridGeometry.vertices.push( new THREE.Vector3(-50,0,i));
    gridGeometry.vertices.push( new THREE.Vector3(50,0,i));
}

var gridMaterial = new THREE.LineBasicMaterial({color:0xBBBBBB});
var grid = new THREE.Line(gridGeometry,gridMaterial,THREE.LinePieces);

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

//========================================================================================
// PRE DEFINED VARIABLE
// credit
// data: http://www.windows2universe.org/our_solar_system/planets_table.html
//========================================================================================
var sunBasedScaling = 500;
var saturnRingInner = 10;
var saturnRingOutter = 40;
var earthBasedScaling = 5;

// Create Solar System
var planetR = { sun: 696000, mercury: 2440, venus: 6052, earth: 6371, mars: 3389,
	jupiter: 69911, staturn: 58232, urans: 25362, neptune: 24622, earthMoon: 1737
};

var planetDist = {sun: 0, mercury: 57,venus: 108,earth: 150,mars: 228,
	jupiter: 779,staturn: 1430,urans: 2880,neptune: 4500,earthMoon: 10 // from earth
};

var planetRelativeR = {
	sun: 5,
	mercury: (planetR.mercury/planetR.sun)*sunBasedScaling,
	venus: (planetR.venus/planetR.sun)*sunBasedScaling,
	earth: (planetR.earth/planetR.sun)*sunBasedScaling,
	mars: (planetR.mars/planetR.sun)*sunBasedScaling,
	jupiter: (planetR.jupiter/planetR.sun)*sunBasedScaling,
	staturn: (planetR.staturn/planetR.sun)*sunBasedScaling,
	urans: (planetR.urans/planetR.sun)*sunBasedScaling,
	neptune: (planetR.neptune/planetR.sun)*sunBasedScaling, 
	earthMoon: (planetR.earthMoon/planetR.earth)*earthBasedScaling
};

var planetOrbitSpeed = {	// speed relative to earth
	mercury: 1.61,venus: 1.18,earth: 1,mars: 0.81,
	jupiter: 0.44,staturn: 0.32,urans: 0.23,neptune: 0.18,earthMoon: 1
};

var planetRoatationDelta = {
	sun: 0.041, 
	mercury: 0.0171,
	venus: -0.00412,	// retrograde rotation
	earth: 1,
	mars: 0.971,
	jupiter: 2.439,
	staturn: 2.273,
	urans: -1.389,	// retrograde rotation
	neptune: 1.389
};

var inclinationAxis = { // converted to rad
	mercury: 0,venus: 3.096,earth: 0.4093,mars: 0.4185,
	jupiter: 0.054,staturn: 0.467,urans: 1.709,neptune: 0.503
};


// debug ================= made to fit the entire screen
sunBasedScaling = 25;
saturnRingInner = 0.55;
saturnRingOutter = 1.55;
earthBasedScaling = 1.5;
var planetDist = {sun: 0, mercury: 10,venus: 15,earth: 20,mars: 25,
	jupiter: 30,staturn: 35,urans: 40,neptune: 45,earthMoon: 1.5 // from earth
};
var planetRelativeR = {
	sun: 5,
	mercury: (planetR.mercury/planetR.sun)*200,
	venus: (planetR.venus/planetR.sun)*100,
	earth: (planetR.earth/planetR.sun)*75,
	mars: (planetR.mars/planetR.sun)*200,
	jupiter: (planetR.jupiter/planetR.sun)*15,
	staturn: (planetR.staturn/planetR.sun)*15,
	urans: (planetR.urans/planetR.sun)*sunBasedScaling,
	neptune: (planetR.neptune/planetR.sun)*sunBasedScaling, 
	earthMoon: (planetR.earthMoon/planetR.earth)*earthBasedScaling
};
// =========================================================


//========================================================================================
// GEOMETRY
//========================================================================================

// sun
var geometry = new THREE.SphereGeometry(planetRelativeR.sun, 32, 32);
generateVertexColors( geometry );

// planets
var geometryMercury = new THREE.SphereGeometry(planetRelativeR.mercury, 20, 20 );
var geometryVenus = new THREE.SphereGeometry(planetRelativeR.venus, 20, 20 );
var geometryEarth = new THREE.SphereGeometry(planetRelativeR.earth, 20, 20 );
var geometryMars = new THREE.SphereGeometry(planetRelativeR.mars, 20, 20 );
var geometryJupiter = new THREE.SphereGeometry(planetRelativeR.jupiter, 20, 20 );
var geometrySaturn = new THREE.SphereGeometry(planetRelativeR.staturn, 20, 20 );
var geometryUrans = new THREE.SphereGeometry(planetRelativeR.urans, 20, 20 );
var geometryNeptune = new THREE.SphereGeometry(planetRelativeR.neptune, 20, 20 );

// moon
var geometryEarthMoon = new THREE.SphereGeometry(planetRelativeR.earthMoon, 15, 15 );

// circles
var geomertyMercuryCircle = new THREE.RingGeometry(planetDist.mercury-0.15, planetDist.mercury+0.15,60);
var geomertyVenusCircle = new THREE.RingGeometry(planetDist.venus-0.15, planetDist.venus+0.15,60);
var geomertyEarthCircle = new THREE.RingGeometry(planetDist.earth-0.15, planetDist.earth+0.15,60);
var geomertyMarsCircle = new THREE.RingGeometry(planetDist.mars-0.15, planetDist.mars+0.15,60);
var geomertyJupiterCircle = new THREE.RingGeometry(planetDist.jupiter-0.15, planetDist.jupiter+0.15,60);
var geomertySaturnCircle = new THREE.RingGeometry(planetDist.staturn-0.15, planetDist.staturn+0.15,120);
var geomertyUransCircle = new THREE.RingGeometry(planetDist.urans-0.15, planetDist.urans+0.15,120);
var geomertyNeptuneCircle = new THREE.RingGeometry(planetDist.neptune-0.15, planetDist.neptune+0.15,120);
var geomertyEarthMoonCircle = new THREE.RingGeometry(planetDist.earthMoon-0.15, planetDist.earthMoon+0.15,120);

// saturn's ring
var geomertySaturnRingCircle = new THREE.RingGeometry(planetRelativeR.staturn+saturnRingInner, planetRelativeR.staturn + saturnRingOutter,30);

// scoutship and mothership geometry
var geometryScoutship = new THREE.CylinderGeometry(1, 1, 1, 10);
var geometryMothership = new THREE.CylinderGeometry(2, 1, 1, 32 );

//========================================================================================
// MATRERIAL
// credit: 
// image source: https://github.com/jeromeetienne/threex.planets
//========================================================================================
var material = new THREE.MeshNormalMaterial();

// sun
// var materialSun = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var materialSun = new THREE.MeshPhongMaterial({emissive:0xf2b74c, map:THREE.ImageUtils.loadTexture('./texture/sun/sunmap.jpg')});

// planets
// var materialMercury = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var materialMercury = new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('./texture/mercury/mercurymap.jpg')});
// var materialVenus = new THREE.MeshBasicMaterial( {color: 0xff9900} );
var materialVenus = new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('./texture/venus/venusmap.jpg')});
// var materialEarth = new THREE.MeshBasicMaterial( {color: 0x33cc33} );
var materialEarth = new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('./texture/earth/earthmap.jpg')});
// var materialMars = new THREE.MeshBasicMaterial( {color: 0x0066ff} );
var materialMars = new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('./texture/mars/marsmap.jpg')});
// var materialJupiter = new THREE.MeshBasicMaterial( {color: 0x9900cc} );
var materialJupiter = new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('./texture/jupiter/jupitermap.jpg')});
// var materialSaturn = new THREE.MeshBasicMaterial( {color: 0xff33cc} );
var materialSaturn = new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('./texture/saturn/saturnmap.jpg')});
// var materialUrans = new THREE.MeshBasicMaterial( {color: 0x996633} );
var materialUrans = new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('./texture/uranus/uranusmap.jpg')});
// var materialNeptune = new THREE.MeshBasicMaterial( {color: 0x00ffff} );
var materialNeptune = new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('./texture/neptune/neptunemap.jpg')});

// moon
// var materialEarthMoon = new THREE.MeshBasicMaterial( {color: 0x555555} );
var materialEarthMoon = new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('./texture/earth/moonmap.jpg')});

// circle material
var oribitalPathMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );

// saturn's ring
var materialSaturnRing = new THREE.MeshBasicMaterial( {color: 0x996633, side: THREE.DoubleSide} );


//========================================================================================
// MESH
//========================================================================================

// sun
var sun = new THREE.Mesh( geometry, materialSun );

// planets
var mercury = new THREE.Mesh( geometryMercury, materialMercury );
var venus = new THREE.Mesh( geometryVenus, materialVenus );
var earth = new THREE.Mesh( geometryEarth, materialEarth );
var mars = new THREE.Mesh( geometryMars, materialMars );
var jupiter = new THREE.Mesh( geometryJupiter, materialJupiter );
var staturn = new THREE.Mesh( geometrySaturn, materialSaturn );
var urans = new THREE.Mesh( geometryUrans, materialUrans );
var neptune = new THREE.Mesh( geometryNeptune, materialNeptune );

// moon
var earthMoon = new THREE.Mesh( geometryEarthMoon, materialEarthMoon );

// orbital paths
var orbitPathMercury = new THREE.Mesh(geomertyMercuryCircle, oribitalPathMaterial);
var orbitPathVenus= new THREE.Mesh(geomertyVenusCircle, oribitalPathMaterial);
var orbitPathEarth = new THREE.Mesh(geomertyEarthCircle, oribitalPathMaterial);
var orbitPathMars= new THREE.Mesh(geomertyMarsCircle, oribitalPathMaterial);
var orbitPathJupiter = new THREE.Mesh(geomertyJupiterCircle, oribitalPathMaterial);
var orbitPathStaturn = new THREE.Mesh(geomertySaturnCircle, oribitalPathMaterial);
var orbitPathUrans = new THREE.Mesh(geomertyUransCircle, oribitalPathMaterial);
var orbitPathNeptune = new THREE.Mesh(geomertyNeptuneCircle, oribitalPathMaterial);
var orbitPathEarthMoon = new THREE.Mesh(geomertyEarthMoonCircle, oribitalPathMaterial);

// saturn's ring
var saturnRing = new THREE.Mesh(geomertySaturnRingCircle, materialSaturnRing);

// ships
var scoutship = new THREE.Mesh(geometryScoutship, material);
var mothership = new THREE.Mesh(geometryMothership, material);

//========================================================================================
// MODIFY INIT POS
//========================================================================================

// planet inclination of axis
mercury.rotation.x = inclinationAxis.mercury;
venus.rotation.x = inclinationAxis.venus;
earth.rotation.x = inclinationAxis.earth;
mars.rotation.x = inclinationAxis.mars;
jupiter.rotation.x = inclinationAxis.jupiter;
staturn.rotation.x = inclinationAxis.staturn;
urans.rotation.x = inclinationAxis.urans;
neptune.rotation.x = inclinationAxis.neptune;

// planets
mercury.position.x = planetDist.mercury;
venus.position.x = planetDist.venus;
earth.position.x = planetDist.earth;
mars.position.x = planetDist.mars;
jupiter.position.x = planetDist.jupiter;
staturn.position.x = planetDist.staturn;
urans.position.x = planetDist.urans;
neptune.position.x = planetDist.neptune;

// moon
earthMoon.position.x = planetDist.earthMoon;

// orbit path
orbitPathMercury.rotation.x = Math.PI/2;
orbitPathVenus.rotation.x = Math.PI/2;
orbitPathEarth.rotation.x = Math.PI/2;
orbitPathMars.rotation.x = Math.PI/2;
orbitPathJupiter.rotation.x = Math.PI/2;
orbitPathStaturn.rotation.x = Math.PI/2;
orbitPathUrans.rotation.x = Math.PI/2;
orbitPathNeptune.rotation.x = Math.PI/2;
orbitPathEarthMoon.rotation.x = Math.PI/2;

// saturn Ring
saturnRing.rotation.x = Math.PI/2;

// ships
scoutship.position.set(40,10,40);
mothership.position.set(40,20,20);

//========================================================================================
// ADD OBJECT TO PARENT
//========================================================================================
earth.add(orbitPathEarthMoon);
earth.add(earthMoon);
staturn.add(saturnRing);

scene.add(scoutship);
scene.add(mothership);
scene.add(orbitPathMercury);
scene.add(orbitPathVenus);
scene.add(orbitPathEarth);
scene.add(orbitPathMars);
scene.add(orbitPathJupiter);
scene.add(orbitPathStaturn);
scene.add(orbitPathUrans);
scene.add(orbitPathNeptune);
scene.add(sun);
scene.add(mercury);
scene.add(venus);
scene.add(earth);
scene.add(mars);
scene.add(jupiter);
scene.add(staturn);
scene.add(urans);
scene.add(neptune);

//========================================================================================
// UPDATE SYSTEM - ANIMATION
//========================================================================================

//Note: Use of parent attribute IS allowed.
//Hint: Keep hierarchies in mind! 

var clock = new THREE.Clock(true);
var t = 0;
function updateSystem() 
{
	if (freezeTime) { // freeze, dont proceed
		return;
	}
	// ANIMATE YOUR SOLAR SYSTEM HERE.

	spaceShipPerspective();

	// self rotation about its own y axis
	var delta = clock.getDelta();

	sun.rotation.y += planetRoatationDelta.sun*delta;
	mercury.rotation.y += planetRoatationDelta.mercury*delta;
	venus.rotation.y += planetRoatationDelta.venus*delta;
	earth.rotation.y += planetRoatationDelta.earth*delta;
	mars.rotation.y += planetRoatationDelta.mars*delta;
	jupiter.rotation.y += planetRoatationDelta.jupiter*delta;
	staturn.rotation.y += planetRoatationDelta.staturn*delta;
	urans.rotation.y += planetRoatationDelta.urans*delta;
	neptune.rotation.y += planetRoatationDelta.neptune*delta;

	// orbit around the sun at defined distance and speed away
	mercury.position.x = Math.sin(t*planetOrbitSpeed.mercury)*planetDist.mercury;
	mercury.position.z = Math.cos(t*planetOrbitSpeed.mercury)*planetDist.mercury;
	venus.position.x = Math.sin(t*planetOrbitSpeed.venus)*planetDist.venus;
	venus.position.z = Math.cos(t*planetOrbitSpeed.venus)*planetDist.venus;
	earth.position.x = Math.sin(t*planetOrbitSpeed.earth)*planetDist.earth;
	earth.position.z = Math.cos(t*planetOrbitSpeed.earth)*planetDist.earth;
	mars.position.x = Math.sin(t*planetOrbitSpeed.mars)*planetDist.mars;
	mars.position.z = Math.cos(t*planetOrbitSpeed.mars)*planetDist.mars;
	jupiter.position.x = Math.sin(t*planetOrbitSpeed.jupiter)*planetDist.jupiter;
	jupiter.position.z = Math.cos(t*planetOrbitSpeed.jupiter)*planetDist.jupiter;
	staturn.position.x = Math.sin(t*planetOrbitSpeed.staturn)*planetDist.staturn;
	staturn.position.z = Math.cos(t*planetOrbitSpeed.staturn)*planetDist.staturn;
	urans.position.x = Math.sin(t*planetOrbitSpeed.urans)*planetDist.urans;
	urans.position.z = Math.cos(t*planetOrbitSpeed.urans)*planetDist.urans;
	neptune.position.x = Math.sin(t*planetOrbitSpeed.neptune)*planetDist.neptune;
	neptune.position.z = Math.cos(t*planetOrbitSpeed.neptune)*planetDist.neptune;

	// orbit around the earth at defined distance and speed away
	earthMoon.position.x = Math.sin(t*planetOrbitSpeed.earthMoon)*planetDist.earthMoon;
	earthMoon.position.z = Math.cos(t*planetOrbitSpeed.earthMoon)*planetDist.earthMoon;

	t += Math.PI/380;
}

//========================================================================================
// CUSTOM FUNCTIONS
//========================================================================================
 
function rotateAboutAxis(object, axis, degree) {
	var rad = (degree*Math.PI)/180;
	var ident = new THREE.Matrix4();
	switch (axis) {
		case "x":
			ident.makeRotationX(rad);
		break;
		case "y":
			ident.makeRotationY(rad);
		break;
		case "z":
			ident.makeRotationZ(rad);
		break;
		default:
		break;
	}
	object.setMatrix(mulMatrix(object.matrix,ident));
}

function mulMatrix(matrix,app) {
  return new THREE.Matrix4().multiplyMatrices(matrix,app);
}

function spaceShipPerspective() {
	if (isMothership) {
		
	} else {
		
	}
}

function changeStep(isIncrease) {
	if (isIncrease) {

	} else {
		
	}
}

function changeCamera(axis, isIncrease) {
	switch (axis) {
		case "x":
			if (isIncrease) {

			} else {

			}
		break;
		case "y":
			if (isIncrease) {

			} else {
				
			}
		break;
		case "z":
			if (isIncrease) {

			} else {
				
			}
		break;
	}
}

function changeLookAt(axis,isIncrease) {
	switch (axis) {
		case "x":
			if (isIncrease) {

			} else {

			}
		break;
		case "y":
			if (isIncrease) {

			} else {
				
			}
		break;
		case "z":
			if (isIncrease) {

			} else {
				
			}
		break;
	}
}

function changeUpVector(axis,isIncrease) {
	switch (axis) {
		case "x":
			if (isIncrease) {

			} else {

			}
		break;
		case "y":
			if (isIncrease) {

			} else {
				
			}
		break;
		case "z":
			if (isIncrease) {

			} else {
				
			}
		break;
	}
}

//========================================================================================
// KEYBOARD COMMANDS
//========================================================================================

// LISTEN TO KEYBOARD
// Hint: Pay careful attention to how the keys already specified work!
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
var freezeTime = false;
var isMothership = false;
var absoluteLookAtMode = false;
		
function onKeyDown(event) {
	// TO-DO: BIND KEYS TO YOUR CONTROLS	  
  if(keyboard.eventMatches(event,"shift+g"))
  {  // Reveal/Hide helper grid
    grid_state = !grid_state;
    grid_state? scene.add(grid) : scene.remove(grid);
  }
  else if(keyboard.eventMatches(event," ")){ 
    freezeTime = !freezeTime;
  }
  else if(keyboard.eventMatches(event,"o")){ //Control mothership
    isMothership = true;
  }
  else if(keyboard.eventMatches(event,"p")){ //Control scoutship
    isMothership = false;
  }
  else if(keyboard.eventMatches(event,"m")){ //Reset both cameras with ’m’.
    isMothership = false;

  }
  else if(keyboard.eventMatches(event,"l")){ //toggle absolute look at mode
    absoluteLookAtMode = !absoluteLookAtMode;
  }
  else if (absoluteLookAtMode) {
  	  // Increase/Decrease camera x location with ’x’/’X’
	  if(keyboard.eventMatches(event,"x")){
	    changeCamera("x",true);
	  }
	  else if(keyboard.eventMatches(event,"shif+x")){
	    changeCamera("x",false);
	  }
	  // Increase/Decrease camera y location with ’y’/’Y’
	  else if(keyboard.eventMatches(event,"y")){
	    changeCamera("y",true);
	  }
	  else if(keyboard.eventMatches(event,"shif+y")){
	    changeCamera("y",false);
	  }
	  // Increase/Decrease camera z location with ’z’/’Z’
	  else if(keyboard.eventMatches(event,"z")){
	    changeCamera("z",true);
	  }
	  else if(keyboard.eventMatches(event,"shif+z")){
	    changeCamera("z",false);
	  }
	  // Increase/Decrease the x location the camera is looking at ’a’/’A’
	  else if(keyboard.eventMatches(event,"a")){
	    changeLookAt("x",true);
	  }
	  else if(keyboard.eventMatches(event,"shif+a")){
	    changeLookAt("x",false);
	  }
	  // Increase/Decrease the y location the camera is looking at ’b’/’B’
	  else if(keyboard.eventMatches(event,"b")){
	    changeLookAt("y",true);
	  }
	  else if(keyboard.eventMatches(event,"shif+b")){
	    changeLookAt("y",false);
	  }
	  // Increase/Decrease the z location the camera is looking at ’c’/’C’
	  else if(keyboard.eventMatches(event,"c")){
	    changeLookAt("z",true);
	  }
	  else if(keyboard.eventMatches(event,"shif+c")){
	    changeLookAt("z",false);
	  }
	  // Increase/Decrease the value of the up vector in the x coordinate ’d’/’D’
	  else if(keyboard.eventMatches(event,"d")){
	    changeUpVector("x",true);
	  }
	  else if(keyboard.eventMatches(event,"shif+d")){
	    changeUpVector("x",false);
	  }
	  // Increase/Decrease the value of the up vector in the y coordinate ’e’/’E’
	  else if(keyboard.eventMatches(event,"e")){
	    changeUpVector("y",true);
	  }
	  else if(keyboard.eventMatches(event,"shif+e")){
	    changeUpVector("y",false);
	  }
	  // Increase/Decrease the value of the up vector in the z coordinate ’f’/’F’
	  else if(keyboard.eventMatches(event,"f")){
	    changeUpVector("z",true);
	  }
	  else if(keyboard.eventMatches(event,"shif+f")){
	    changeUpVector("z",false);
	  }
	  // Increase/decrease step size (the increment moved by a keypress from above) with keys ’k/K’
	  else if(keyboard.eventMatches(event,"k")){
	    changeStep(true);
	  }
	  else if(keyboard.eventMatches(event,"shif+k")){
	    changeStep(false);
	  }
  }
}
keyboard.domElement.addEventListener('keydown', onKeyDown );
		

// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
// DON'T TOUCH THIS
function update() {
  updateSystem();

  requestAnimationFrame(update);
  
  // UPDATES THE MULTIPLE CAMERAS IN THE SIMULATION
  for ( var ii = 0; ii < views.length; ++ii ) 
  {

		view = views[ii];
		camera_ = view.camera;

		view.updateCamera( camera_, scene, mouseX, mouseY );

		var left   = Math.floor( windowWidth  * view.left );
		var bottom = Math.floor( windowHeight * view.bottom );
		var width  = Math.floor( windowWidth  * view.width );
		var height = Math.floor( windowHeight * view.height );
		renderer.setViewport( left, bottom, width, height );
		renderer.setScissor( left, bottom, width, height );
		renderer.enableScissorTest ( true );
		renderer.setClearColor( view.background );

		camera_.aspect = width / height;
		camera_.updateProjectionMatrix();

		renderer.render( scene, camera_ );
	}
}

update();