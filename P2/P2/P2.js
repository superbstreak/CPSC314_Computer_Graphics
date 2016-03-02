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
lights[0] = new THREE.PointLight( 0xffffff, 2, 0 );
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


// TODO
// geo sync switch up down check
// relative mouse edit check

//========================================================================================
// PRE DEFINED VARIABLE
// credit
// data: http://www.windows2universe.org/our_solar_system/planets_table.html
//========================================================================================
var freezeTime = false;
var isMothership = false;
var currentMode = 1;
var currentPlanetPlacement = scene;
var traceDistance = [1,3,1];
var currentPlanet = 3;
var stepSize = 1;
var motherEye = [ 80, 20, 80 ];
var motherEyeCopy = [80, 20, 80];
var motherUp = [ 0, 1, 0 ];
var motherLookAt = {x:0,y:0,z:0};
var scoutEye = [ 65, 20, 65 ];
var scoutEyeCopy = [ 65, 20, 65 ];
var scoutUp = [ 0, 1, 0 ];
var scoutLootAt = {x:0,y:0,z:0};
var sunBasedScaling = 500;
var saturnRingInner = 10;
var saturnRingOutter = 40;
var earthBasedScaling = 5;

// Create Solar System
var planetR = { sun: 696000, mercury: 2440, venus: 6052, earth: 6371, mars: 3389,
	jupiter: 69911, saturn: 58232, uranus: 25362, neptune: 24622, earthMoon: 1737, pluto: 2500
};

var planetDist = {sun: 0, mercury: 57,venus: 108,earth: 150,mars: 228,
	jupiter: 779,saturn: 1430,uranus: 2880,neptune: 4500,earthMoon: 10, // from earth
	pluto: 5500
};

var planetRelativeR = {
	sun: 5,
	mercury: (planetR.mercury/planetR.sun)*sunBasedScaling,
	venus: (planetR.venus/planetR.sun)*sunBasedScaling,
	earth: (planetR.earth/planetR.sun)*sunBasedScaling,
	mars: (planetR.mars/planetR.sun)*sunBasedScaling,
	jupiter: (planetR.jupiter/planetR.sun)*sunBasedScaling,
	saturn: (planetR.saturn/planetR.sun)*sunBasedScaling,
	uranus: (planetR.uranus/planetR.sun)*sunBasedScaling,
	neptune: (planetR.neptune/planetR.sun)*sunBasedScaling, 
	earthMoon: (planetR.earthMoon/planetR.earth)*earthBasedScaling,
	pluto: (planetR.pluto/planetR.earth)*sunBasedScaling
};

var planetOrbitSpeed = {	// speed relative to earth
	mercury: 1.61,venus: 1.18,earth: 1,mars: 0.81,
	jupiter: 0.44,saturn: 0.32,uranus: 0.23,neptune: 0.18,earthMoon: 1.037, pluto: 0.12
};

var planetRoatationDelta = {
	sun: 0.041, 
	mercury: 0.0171,
	venus: -0.00412,	// retrograde rotation
	earth: 1,
	mars: 0.971,
	jupiter: 2.439,
	saturn: 2.273,
	uranus: -1.389,	// retrograde rotation
	neptune: 1.389,
	pluto: 1.2
};

var inclinationAxis = { // converted to rad
	mercury: 0,venus: 3.096,earth: 0.4093,mars: 0.4185,
	jupiter: 0.054,saturn: 0.467,uranus: 1.709,neptune: 0.503,
	pluto: 0.3
};


// debug ================= made to fit the entire screen
sunBasedScaling = 25;
saturnRingInner = 0.55;
saturnRingOutter = 1.55;
earthBasedScaling = 1;
var planetDist = {sun: 0, mercury: 10,venus: 15,earth: 20,mars: 25,
	jupiter: 30,saturn: 35,uranus: 40,neptune: 45,earthMoon: 1.5,
	pluto: 50 // from earth
};
var planetRelativeR = {
	sun: 5,
	mercury: (planetR.mercury/planetR.sun)*200,
	venus: (planetR.venus/planetR.sun)*100,
	earth: (planetR.earth/planetR.sun)*75,
	mars: (planetR.mars/planetR.sun)*200,
	jupiter: (planetR.jupiter/planetR.sun)*15,
	saturn: (planetR.saturn/planetR.sun)*15,
	uranus: (planetR.uranus/planetR.sun)*sunBasedScaling,
	neptune: (planetR.neptune/planetR.sun)*sunBasedScaling, 
	earthMoon: (planetR.earthMoon/planetR.earth)*earthBasedScaling,
	pluto: (planetR.pluto/planetR.sun)*200
};
// =========================================================


//========================================================================================
// GEOMETRY
//========================================================================================

// sun
var geometry = new THREE.SphereGeometry(planetRelativeR.sun, 32, 32);
generateVertexColors( geometry );

// planets
var geometryMercury = new THREE.SphereGeometry(planetRelativeR.mercury, 32, 32 );
var geometryVenus = new THREE.SphereGeometry(planetRelativeR.venus, 32, 32 );
var geometryEarth = new THREE.SphereGeometry(planetRelativeR.earth, 32, 32 );
var geometryMars = new THREE.SphereGeometry(planetRelativeR.mars, 32, 32 );
var geometryJupiter = new THREE.SphereGeometry(planetRelativeR.jupiter, 32, 32 );
var geometrySaturn = new THREE.SphereGeometry(planetRelativeR.saturn, 32, 32 );
var geometryuranus = new THREE.SphereGeometry(planetRelativeR.uranus, 32, 32 );
var geometryNeptune = new THREE.SphereGeometry(planetRelativeR.neptune, 32, 32 );
var geometryPluto = new THREE.SphereGeometry(planetRelativeR.pluto, 32, 32 );

// moon
var geometryEarthMoon = new THREE.SphereGeometry(planetRelativeR.earthMoon, 32, 32 );
var geometryJupiterMoon = new THREE.SphereGeometry(0.25, 32, 32 );

// circles
var geomertyMercuryCircle = new THREE.RingGeometry(planetDist.mercury-0.15, planetDist.mercury+0.15,60);
var geomertyVenusCircle = new THREE.RingGeometry(planetDist.venus-0.15, planetDist.venus+0.15,60);
var geomertyEarthCircle = new THREE.RingGeometry(planetDist.earth-0.15, planetDist.earth+0.15,60);
var geomertyMarsCircle = new THREE.RingGeometry(planetDist.mars-0.15, planetDist.mars+0.15,60);
var geomertyJupiterCircle = new THREE.RingGeometry(planetDist.jupiter-0.15, planetDist.jupiter+0.15,60);
var geomertySaturnCircle = new THREE.RingGeometry(planetDist.saturn-0.15, planetDist.saturn+0.15,120);
var geomertyuranusCircle = new THREE.RingGeometry(planetDist.uranus-0.15, planetDist.uranus+0.15,120);
var geomertyNeptuneCircle = new THREE.RingGeometry(planetDist.neptune-0.15, planetDist.neptune+0.15,120);
var geomertyPlutoCircle = new THREE.RingGeometry(planetDist.pluto-0.15, planetDist.pluto+0.15,120);
var geomertyEarthMoonCircle = new THREE.RingGeometry(planetDist.earthMoon-0.05, planetDist.earthMoon+0.05,120);
var geomertyJupiterMoonCircle = new THREE.RingGeometry(planetDist.earthMoon+1.5-0.05, planetDist.earthMoon+1.5+0.05,120);

// saturn's ring
var geomertySaturnRingCircle = new THREE.RingGeometry(planetRelativeR.saturn+saturnRingInner, planetRelativeR.saturn + saturnRingOutter,30);

// ship
var geometryMothership = new THREE.SphereGeometry(1,32,32);

// scoutship SS
var geometryScoutship = new THREE.BoxGeometry(1,1,1);
// var geometrySScockpit = new THREE.CylinderGeometry(0.5,0.1,1,32);
// geometryScoutship = geometrySScockpit;

var geoCHECKTAG = new THREE.BoxGeometry(0.5,0.5,0.5);

//========================================================================================
// MATRERIAL
// credit: 
// image source:https://github.com/jeromeetienne/threex.planets/tree/master/images
//========================================================================================
var material = new THREE.MeshNormalMaterial();

var MSmaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var SSmaterial = new THREE.MeshBasicMaterial( {color: 0xff9900} );

// sun
// var materialSun = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var materialSun = new THREE.MeshPhongMaterial({emissive:0xf2b74c,map:new THREE.TextureLoader().load('./texture/sun/sunmap.jpg')});

// planets
// var materialMercury = new THREE.MeshBasicMaterial( {color: 0xff0000} );
// var materialVenus = new THREE.MeshBasicMaterial( {color: 0xff9900} );
// var materialEarth = new THREE.MeshBasicMaterial( {color: 0x33cc33} );
// var materialMars = new THREE.MeshBasicMaterial( {color: 0x0066ff} );
// var materialJupiter = new THREE.MeshBasicMaterial( {color: 0x9900cc} );
// var materialSaturn = new THREE.MeshBasicMaterial( {color: 0xff33cc} );
// var materialuranus = new THREE.MeshBasicMaterial( {color: 0x996633} );
// var materialNeptune = new THREE.MeshBasicMaterial( {color: 0x00ffff} );
var materialMercury = new THREE.MeshPhongMaterial({map:new THREE.TextureLoader().load('./texture/mercury/mercurymap.jpg'),
	bumpMap:new THREE.TextureLoader().load('./texture/mercury/mercurybump.jpg'),
	bumpScale: 0.005 });
var materialVenus = new THREE.MeshPhongMaterial({map:new THREE.TextureLoader().load('./texture/venus/venusmap.jpg'),
	bumpMap:new THREE.TextureLoader().load('./texture/venus/venusbump.jpg'),
	bumpScale: 0.005 });
var materialEarth = new THREE.MeshPhongMaterial({
	map:new THREE.TextureLoader().load('./texture/earth/earthmap.jpg'),
	bumpMap:new THREE.TextureLoader().load('./texture/earth/earthbump.jpg'),
	bumpScale: 0.05 });
var materialMars = new THREE.MeshPhongMaterial({map:new THREE.TextureLoader().load('./texture/mars/marsmap.jpg'),
	bumpMap:new THREE.TextureLoader().load('./texture/mars/marsbump.jpg'),
	bumpScale: 0.15 });
var materialJupiter = new THREE.MeshPhongMaterial({map:new THREE.TextureLoader().load('./texture/jupiter/jupitermap.jpg')});
var materialSaturn = new THREE.MeshPhongMaterial({map:new THREE.TextureLoader().load('./texture/saturn/saturnmap.jpg')});
var materialuranus = new THREE.MeshPhongMaterial({map:new THREE.TextureLoader().load('./texture/uranus/uranusmap.jpg')});
var materialNeptune = new THREE.MeshPhongMaterial({map:new THREE.TextureLoader().load('./texture/neptune/neptunemap.jpg')});
var materialPluto = new THREE.MeshPhongMaterial({
	map:new THREE.TextureLoader().load('./texture/pluto/plutomap.jpg'),
	bumpMap:new THREE.TextureLoader().load('./texture/pluto/plutobump.jpg'),
	bumpScale: 0.05 });

// moon
// var materialEarthMoon = new THREE.MeshBasicMaterial( {color: 0x555555} );
var materialEarthMoon = new THREE.MeshPhongMaterial({map:new THREE.TextureLoader().load('./texture/earth/moonmap.jpg'),
	bumpMap:new THREE.TextureLoader().load('./texture/earth/moonbump.jpg'),
	bumpScale: 0.005 });

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
var saturn = new THREE.Mesh( geometrySaturn, materialSaturn );
var uranus = new THREE.Mesh( geometryuranus, materialuranus );
var neptune = new THREE.Mesh( geometryNeptune, materialNeptune );
var pluto = new THREE.Mesh( geometryPluto, materialPluto);
var jupiteMoonEuropa = new THREE.Mesh( geometryJupiterMoon, materialEarthMoon );
// moon
var earthMoon = new THREE.Mesh( geometryEarthMoon, materialEarthMoon );

// orbital paths
var orbitPathMercury = new THREE.Mesh(geomertyMercuryCircle, oribitalPathMaterial);
var orbitPathVenus= new THREE.Mesh(geomertyVenusCircle, oribitalPathMaterial);
var orbitPathEarth = new THREE.Mesh(geomertyEarthCircle, oribitalPathMaterial);
var orbitPathMars= new THREE.Mesh(geomertyMarsCircle, oribitalPathMaterial);
var orbitPathJupiter = new THREE.Mesh(geomertyJupiterCircle, oribitalPathMaterial);
var orbitPathsaturn = new THREE.Mesh(geomertySaturnCircle, oribitalPathMaterial);
var orbitPathuranus = new THREE.Mesh(geomertyuranusCircle, oribitalPathMaterial);
var orbitPathNeptune = new THREE.Mesh(geomertyNeptuneCircle, oribitalPathMaterial);
var orbitPathPluto = new THREE.Mesh(geomertyPlutoCircle, oribitalPathMaterial);
var orbitPathEarthMoon = new THREE.Mesh(geomertyEarthMoonCircle, oribitalPathMaterial);
var orbitPathJupiterMoon = new THREE.Mesh(geomertyJupiterMoonCircle, oribitalPathMaterial);

// saturn's ring
var saturnRing = new THREE.Mesh(geomertySaturnRingCircle, materialSaturnRing);

// ships
var mothership = new THREE.Mesh(geometryMothership, material);

// SS
var scoutship = new THREE.Mesh(geometryScoutship, material);
// var SScockpit = new THREE.Mesh(geometrySScockpit, material);

var CHECK_TAG = new THREE.Mesh(geoCHECKTAG, material);

//========================================================================================
// MODIFY INIT POS
//========================================================================================

// planet inclination of axis
mercury.rotation.x = inclinationAxis.mercury;
venus.rotation.x = inclinationAxis.venus;
earth.rotation.x = inclinationAxis.earth;
mars.rotation.x = inclinationAxis.mars;
jupiter.rotation.x = inclinationAxis.jupiter;
saturn.rotation.x = inclinationAxis.saturn;
uranus.rotation.x = inclinationAxis.uranus;
neptune.rotation.x = inclinationAxis.neptune;

// planets
mercury.position.x = planetDist.mercury;
venus.position.x = planetDist.venus;
earth.position.x = planetDist.earth;
mars.position.x = planetDist.mars;
jupiter.position.x = planetDist.jupiter;
saturn.position.x = planetDist.saturn;
uranus.position.x = planetDist.uranus;
neptune.position.x = planetDist.neptune;
pluto.position.x = planetDist.pluto;

// moon
earthMoon.position.x = planetDist.earthMoon;
jupiteMoonEuropa.position.x = planetDist.earthMoon + 1.5;

// orbit path
orbitPathMercury.rotation.x = Math.PI/2;
orbitPathVenus.rotation.x = Math.PI/2;
orbitPathEarth.rotation.x = Math.PI/2;
orbitPathMars.rotation.x = Math.PI/2;
orbitPathJupiter.rotation.x = Math.PI/2;
orbitPathsaturn.rotation.x = Math.PI/2;
orbitPathuranus.rotation.x = Math.PI/2;
orbitPathNeptune.rotation.x = Math.PI/2;
orbitPathEarthMoon.rotation.x = Math.PI/2;
orbitPathPluto.rotation.x = Math.PI/2;
orbitPathJupiterMoon.rotation.x = Math.PI/2;

// saturn Ring
saturnRing.rotation.x = Math.PI/2;

// ships
scoutship.rotateY(-45*Math.PI/180);
updateShipData(true);

CHECK_TAG.position.x = 1;


//========================================================================================
// ADD OBJECT TO PARENT
//========================================================================================

// scoutship.add(SScockpit);

// earthMoon.add(CHECK_TAG); // debug
jupiter.add(jupiteMoonEuropa);
jupiter.add(orbitPathJupiterMoon);

earth.add(orbitPathEarthMoon);
earth.add(earthMoon);
saturn.add(saturnRing);

scene.add(orbitPathMercury);
scene.add(orbitPathVenus);
scene.add(orbitPathEarth);
scene.add(orbitPathMars);
scene.add(orbitPathJupiter);
scene.add(orbitPathsaturn);
scene.add(orbitPathuranus);
scene.add(orbitPathNeptune);
scene.add(orbitPathPluto);
scene.add(sun);
scene.add(mercury);
scene.add(venus);
scene.add(earth);
scene.add(mars);
scene.add(jupiter);
scene.add(saturn);
scene.add(uranus);
scene.add(neptune);
scene.add(scoutship);
scene.add(mothership);
scene.add(pluto);

//========================================================================================
// UPDATE SYSTEM - ANIMATION
//========================================================================================

//Note: Use of parent attribute IS allowed.
//Hint: Keep hierarchies in mind! 

var clock = new THREE.Clock(true);
var t = 0;
function updateSystem() {
	followPlanet();
	if (freezeTime) { // freeze, dont proceed
		return;
	}
	// ANIMATE YOUR SOLAR SYSTEM HERE.

	// self rotation about its own y axis
	var delta = clock.getDelta();

	sun.rotation.y += planetRoatationDelta.sun*delta;
	mercury.rotation.y += planetRoatationDelta.mercury*delta;
	venus.rotation.y += planetRoatationDelta.venus*delta;
	earth.rotation.y += planetRoatationDelta.earth*delta;
	mars.rotation.y += planetRoatationDelta.mars*delta;
	jupiter.rotation.y += planetRoatationDelta.jupiter*delta;
	saturn.rotation.y += planetRoatationDelta.saturn*delta;
	uranus.rotation.y += planetRoatationDelta.uranus*delta;
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
	saturn.position.x = Math.sin(t*planetOrbitSpeed.saturn)*planetDist.saturn;
	saturn.position.z = Math.cos(t*planetOrbitSpeed.saturn)*planetDist.saturn;
	uranus.position.x = Math.sin(t*planetOrbitSpeed.uranus)*planetDist.uranus;
	uranus.position.z = Math.cos(t*planetOrbitSpeed.uranus)*planetDist.uranus;
	neptune.position.x = Math.sin(t*planetOrbitSpeed.neptune)*planetDist.neptune;
	neptune.position.z = Math.cos(t*planetOrbitSpeed.neptune)*planetDist.neptune;
	pluto.position.x = Math.sin(t*planetOrbitSpeed.pluto)*planetDist.pluto;
	pluto.position.z = Math.cos(t*planetOrbitSpeed.pluto)*planetDist.pluto;

	// orbit around the earth at defined distance and speed away
	// earthMoon.position.x = Math.sin(t*planetOrbitSpeed.earthMoon)*planetDist.earthMoon;
	// earthMoon.position.z = Math.cos(t*planetOrbitSpeed.earthMoon)*planetDist.earthMoon;

	t += Math.PI/380;
}

//========================================================================================
// CUSTOM FUNCTIONS
//========================================================================================
 
 // reset the views 
function resetViews() {
	stepSize = 1;
	motherEye = [ 80, 20, 80 ];
	motherEyeCopy = [ 80, 20, 80 ];
	motherUp = [ 0, 1, 0 ];
	motherLookAt = {x:0,y:0,z:0};
	scoutEye = [ 65, 20, 65 ];
	scoutEyeCopy = [ 65, 20, 65 ];
	scoutUp = [ 0, 1, 0 ];
	scoutLootAt = {x:0,y:0,z:0};
	mothership.rotation.x = 0;
	mothership.rotation.y = 45*(Math.PI/180);
	mothership.rotation.z = 0;
	scoutship.rotation.x = 0;
	scoutship.rotation.y = 45*(Math.PI/180);
	scoutship.rotation.z = 0;
	traceDistance = [1,3,1];
	updateGeoSyncLookAt(scene, true);
}

// set camer org pos
function resetCameras() {
	var view = views[0];
	camera_MotherShip.position.x = view.eye[ 0 ];
	camera_MotherShip.position.y = view.eye[ 1 ];
	camera_MotherShip.position.z = view.eye[ 2 ];
	camera_MotherShip.up.x = view.up[ 0 ];
	camera_MotherShip.up.y = view.up[ 1 ];
	camera_MotherShip.up.z = view.up[ 2 ];
	camera_MotherShip.lookAt( scene.position );
	view.camera = camera_MotherShip;


	var view = views[1];
	camera_ScoutShip.position.x = view.eye[ 0 ];
	camera_ScoutShip.position.y = view.eye[ 1 ];
	camera_ScoutShip.position.z = view.eye[ 2 ];
	camera_ScoutShip.up.x = view.up[ 0 ];
	camera_ScoutShip.up.y = view.up[ 1 ];
	camera_ScoutShip.up.z = view.up[ 2 ];
	camera_ScoutShip.lookAt( scene.position );
	view.camera = camera_ScoutShip;
}

// update camera, force cahnge look at if needed 
function updateAllCameras(overwriteLookAt) {
	camera_MotherShip.up.x = motherUp[ 0 ];
	camera_MotherShip.up.y = motherUp[ 1 ];
	camera_MotherShip.up.z = motherUp[ 2 ];
	camera_ScoutShip.up.x = scoutUp[ 0 ];
	camera_ScoutShip.up.y = scoutUp[ 1 ];
	camera_ScoutShip.up.z = scoutUp[ 2 ];
	if (overwriteLookAt) {
		camera_MotherShip.lookAt( motherLookAt );
		camera_ScoutShip.lookAt( scoutLootAt );
	}	
}

// update ships pos, up and look at
function updateShipData(overwriteLookAt) {
	mothership.position.x = motherEye[ 0 ];
	mothership.position.y = motherEye[ 1 ];
	mothership.position.z = motherEye[ 2 ];
	mothership.up.x = motherUp[ 0 ];
	mothership.up.y = motherUp[ 1 ];
	mothership.up.z = motherUp[ 2 ];	

	scoutship.position.x = scoutEye[ 0 ];
	scoutship.position.y = scoutEye[ 1 ];
	scoutship.position.z = scoutEye[ 2 ];
	scoutship.up.x = scoutUp[ 0 ];
	scoutship.up.y = scoutUp[ 1 ];
	scoutship.up.z = scoutUp[ 2 ];
	if (overwriteLookAt) {
		mothership.lookAt(motherLookAt);
		scoutship.lookAt(scoutLootAt);
	}
}

// rotate about an axis
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

// update step size
function changeStep(isIncrease) {
	switch (currentMode) {
		case 1:
			(isIncrease)? stepSize += 1 : stepSize += -1;
		break;
		case 2:
			(isIncrease)? stepSize += Math.PI/64 : stepSize += -Math.PI/64;
		break;
		case 3:
			(isIncrease)? stepSize += 1 : stepSize += -1;
		break;
	}
}

// Abs lookat mode movement
function changeCamera(axis, isIncrease) {
	switch (axis) {
		case "x":
			if (isIncrease) {
				(isMothership)? camera_MotherShip.position.x += stepSize:camera_ScoutShip.position.x += stepSize;
				(isMothership)? motherEye[0] += stepSize : scoutEye[0] += stepSize;
			} else {
				(isMothership)? camera_MotherShip.position.x += -stepSize:camera_ScoutShip.position.x += -stepSize;
				(isMothership)? motherEye[0] += -stepSize : scoutEye[0] += -stepSize;
			}
		break;
		case "y":
			if (isIncrease) {
				(isMothership)? camera_MotherShip.position.y += stepSize:camera_ScoutShip.position.y += stepSize;
				(isMothership)? motherEye[1] += stepSize : scoutEye[1] += stepSize;
			} else {
				(isMothership)? camera_MotherShip.position.y += -stepSize:camera_ScoutShip.position.y += -stepSize;
				(isMothership)? motherEye[1] += -stepSize : scoutEye[1] += -stepSize;
			}
		break;
		case "z":
			if (isIncrease) {
				(isMothership)? camera_MotherShip.position.z += stepSize:camera_ScoutShip.position.z += stepSize;
				(isMothership)? motherEye[2] += stepSize : scoutEye[2] += stepSize;
			} else {
				(isMothership)? camera_MotherShip.position.z += -stepSize:camera_ScoutShip.position.z += -stepSize;
				(isMothership)? motherEye[2] += -stepSize : scoutEye[2] += -stepSize;
			}
		break;
	}
	updateShipData(true);
}

// Abs lookat change lookat pos
function changeLookAt(axis,isIncrease) {
	var rotate = stepSize*Math.PI/256;
	switch (axis) {
		case "x":
			if (isIncrease) {
				(isMothership)? motherLookAt.x += stepSize : scoutLootAt.x += stepSize;
			} else {
				(isMothership)? motherLookAt.x += -stepSize : scoutLootAt.x += -stepSize;
			}
		break;
		case "y":
			if (isIncrease) {
				(isMothership)? motherLookAt.y += stepSize : scoutLootAt.y += stepSize;
			} else {
				(isMothership)? motherLookAt.y += -stepSize : scoutLootAt.y += -stepSize;
			}
		break;
		case "z":
			if (isIncrease) {
				(isMothership)? motherLookAt.z += stepSize : scoutLootAt.z += stepSize;
			} else {
				(isMothership)? motherLookAt.z += -stepSize : scoutLootAt.z += -stepSize;
			}
		break;
	}
	updateAllCameras(true);
	updateShipData(true);
}

// Abs lookat change up vectors
function changeUpVector(axis,isIncrease) {
	var rotate = stepSize*Math.PI/8;
	switch (axis) {
		case "x":
			if (isIncrease) {
				(isMothership)? motherUp[0] += stepSize:scoutUp[0] += stepSize;
			} else {
				(isMothership)?  motherUp[0] += -stepSize:scoutUp[0] += -stepSize;
			}
			(isMothership)? mothership.up.set(motherUp[0]) : scoutship.up.setX(scoutUp[0]);
		break;
		case "y":
			if (isIncrease) {
				(isMothership)? motherUp[1] += stepSize:scoutUp[1] += stepSize;
			} else {
				(isMothership)? motherUp[1] += -stepSize:scoutUp[1] += -stepSize;
			}
		break;
		case "z":
			if (isIncrease) {
				(isMothership)? motherUp[2] += stepSize:scoutUp[2] += stepSize;
			} else {
				(isMothership)? motherUp[2] += -stepSize:scoutUp[2] += -stepSize;
			}
		break;
	}
	updateAllCameras(true);
	updateShipData(true);
}

// follow a planet
function followPlanet() {
	if (currentMode != 3) {
		return;
	}
	var pos;
	var arr;
	switch (currentPlanet) {
		case 1:
			pos = mercury.position;
		break;
		case 2:
			pos = venus.position;
		break;
		case 3:
			pos = earth.position;
		break;
		case 4:
			pos = mars.position;
		break;
		case 5:
			pos = jupiter.position;
		break;
		case 6:
			pos = saturn.position;
		break;
		case 7:
			pos = uranus.position;
		break;
		case 8:
			pos = neptune.position;
		break;
		case 9:
			pos = pluto.position;
		break;
	}

	if (isMothership) {
		camera_MotherShip.position.x = traceDistance[0];
		camera_MotherShip.position.y = traceDistance[1];
		camera_MotherShip.position.z = traceDistance[2];
		motherEye = traceDistance;
	} else {
		camera_ScoutShip.position.x = traceDistance[0];
		camera_ScoutShip.position.y = traceDistance[1];
		camera_ScoutShip.position.z = traceDistance[2];
		scoutEye = traceDistance;
	}

	updateAllCameras(true);
	updateShipData(true);
}

// update geosync data, support ship switch
function updateGeoSyncLookAt (newLookAt, updateAll) {
	currentPlanetPlacement.remove(scoutship);
	currentPlanetPlacement.remove(camera_ScoutShip);
	currentPlanetPlacement.remove(mothership);
	currentPlanetPlacement.remove(camera_MotherShip);
	mothership.rotateX(0);
	scoutship.rotateX(0)
	if (updateAll) {
		scoutEye = scoutEyeCopy;
		motherEye = motherEyeCopy;
		camera_ScoutShip.position.x = scoutEye[0];
		camera_ScoutShip.position.y = scoutEye[1];
		camera_ScoutShip.position.z = scoutEye[2];
		camera_MotherShip.position.x = motherEye[0];
		camera_MotherShip.position.y = motherEye[1];
		camera_MotherShip.position.z = motherEye[2];
		newLookAt.add(mothership);
		newLookAt.add(camera_MotherShip);
		newLookAt.add(scoutship);
		newLookAt.add(camera_ScoutShip);
	} else if (isMothership){
		scoutEye = scoutEyeCopy;
		camera_ScoutShip.position.x = scoutEye[0];
		camera_ScoutShip.position.y = scoutEye[1];
		camera_ScoutShip.position.z = scoutEye[2];
		newLookAt.add(mothership);
		newLookAt.add(camera_MotherShip);
	} else {
		motherEye = motherEyeCopy;
		camera_MotherShip.position.x = motherEye[0];
		camera_MotherShip.position.y = motherEye[1];
		camera_MotherShip.position.z = motherEye[2];
		newLookAt.add(scoutship);
		newLookAt.add(camera_ScoutShip);
	}
	currentPlanetPlacement = newLookAt;
	updateAllCameras(true);
	updateShipData(true);
}

// reset and switch mode
function modeSwitch(mode) {
	resetViews();
    resetCameras();
	switch(mode) {
		case "absolute":
			updateShipData(true);
			stepSize = 1; // reset step size
			currentMode = 1;
		break;
		case "relative":
			updateShipData(false);
			stepSize = Math.PI/64; // reset step size
			currentMode = 2;
		break;
		case "geosynchronous":
			updateShipData(false);
			currentPlanet = 3;
			currentMode = 3;
			updateGeoSyncLookAt(earth, false);
		break;
	}
}

// yaw on local y axis
function performYaw(isIncrease, steps){
	var stepMultiplied = steps;
	if(isIncrease) {
		(isMothership)? mothership.rotateY(-stepMultiplied) : scoutship.rotateY(-stepMultiplied);
	  	(isMothership)? camera_MotherShip.rotateY(-stepMultiplied) : camera_ScoutShip.rotateY(-stepMultiplied);
	} else {
		(isMothership)? mothership.rotateY(stepMultiplied) : scoutship.rotateY(stepMultiplied);
	  	(isMothership)? camera_MotherShip.rotateY(stepMultiplied):camera_ScoutShip.rotateY(stepMultiplied);
	}
}

// pitch on axis
function performPitch(isIncrease, steps) {
	var stepMultiplied = steps;
	if(isIncrease) {
		(isMothership)? mothership.rotateX(stepMultiplied):scoutship.rotateX(stepMultiplied);
	  	(isMothership)? camera_MotherShip.rotateX(-stepMultiplied) : camera_ScoutShip.rotateX(-stepMultiplied);
	} else {
		(isMothership)? mothership.rotateX(-stepMultiplied) : scoutship.rotateX(-stepMultiplied);
		(isMothership)? camera_MotherShip.rotateX(stepMultiplied) : camera_ScoutShip.rotateX(stepMultiplied);
	}
}

// roll on axis
function performRoll(isIncrease, steps) {
	var stepMultiplied = steps;
	if(isIncrease) {
		(isMothership)? mothership.rotateZ(stepMultiplied) : scoutship.rotateZ(stepMultiplied);
	  	(isMothership)? camera_MotherShip.rotateZ(-stepMultiplied) : camera_ScoutShip.rotateZ(-stepMultiplied);
	} else {
		(isMothership)? mothership.rotateZ(-stepMultiplied) : scoutship.rotateZ(-stepMultiplied);
	    (isMothership)? camera_MotherShip.rotateZ(stepMultiplied) : camera_ScoutShip.rotateZ(stepMultiplied);
	}
}

// move forward or backward (usually z)
function performFly(isIncrease, steps) {
	var stepMultiplied = steps;
	if (isIncrease) {
		scoutship.translateZ(stepMultiplied);
	} else {
		scoutship.translateZ(-stepMultiplied);
	}
	scoutEye[0] = scoutship.position.x;
	scoutEye[1] = scoutship.position.y;	
	scoutEye[2] = scoutship.position.z;
	camera_ScoutShip.position.x = scoutship.position.x;
	camera_ScoutShip.position.y = scoutship.position.y;
	camera_ScoutShip.position.z = scoutship.position.z;
	updateAllCameras(false);
	updateShipData(false);
}

//========================================================================================
// KEYBOARD COMMANDS
//========================================================================================

// LISTEN TO KEYBOARD
// Hint: Pay careful attention to how the keys already specified work!
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
var mouseState = 0;
var T_STATE = false;

function onKeyDown(event) {
	// TO-DO: BIND KEYS TO YOUR CONTROLS	  
  if(keyboard.eventMatches(event,"shift+g")) {  // Reveal/Hide helper grid
    grid_state = !grid_state;
    grid_state? scene.add(grid) : scene.remove(grid);
  }
  else if(keyboard.eventMatches(event," ")){ 
    freezeTime = !freezeTime;
  }
  else if(keyboard.eventMatches(event,"o")){ //Control mothership
    isMothership = true;
    if (currentMode == 3) {
    	updateGeoSyncLookAt(currentPlanetPlacement, false);
    }
  }
  else if(keyboard.eventMatches(event,"p")){ //Control scoutship
    isMothership = false;
    if (currentMode == 3) {
    	updateGeoSyncLookAt(currentPlanetPlacement, false);
    }
  }
  else if(keyboard.eventMatches(event,"m")){ //Reset both cameras with ’m’.
    isMothership = false;
    modeSwitch("absolute");
  }
  else if(keyboard.eventMatches(event,"l")){ //toggle absolute look at mode
    modeSwitch("absolute");
  }
  else if (keyboard.eventMatches(event,"r")) { // toggle relative flying
  	modeSwitch("relative");
  }
  else if (keyboard.eventMatches(event,"g")) { // toggle relative flying
  	modeSwitch("geosynchronous");
  }
  else if (currentMode == 1) {
  	  // Increase/Decrease camera x location with ’x’/’X’
  	  if(keyboard.eventMatches(event,"shift+x")){
	    changeCamera("x",false);
	  }
	  else if(keyboard.eventMatches(event,"x")){
	    changeCamera("x",true);
	  }
	  // Increase/Decrease camera y location with ’y’/’Y’
	  else if(keyboard.eventMatches(event,"shift+y")){
	    changeCamera("y",false);
	  }
	  else if(keyboard.eventMatches(event,"y")){
	    changeCamera("y",true);
	  }
	  // Increase/Decrease camera z location with ’z’/’Z’
	  else if(keyboard.eventMatches(event,"shift+z")){
	    changeCamera("z",false);
	  }
	  else if(keyboard.eventMatches(event,"z")){
	    changeCamera("z",true);
	  }
	  // Increase/Decrease the x location the camera is looking at ’a’/’A’
	  else if(keyboard.eventMatches(event,"shift+a")){
	    changeLookAt("x",false);
	  }
	  else if(keyboard.eventMatches(event,"a")){
	    changeLookAt("x",true);
	  }
	  // Increase/Decrease the y location the camera is looking at ’b’/’B’
	  else if(keyboard.eventMatches(event,"shift+b")){
	    changeLookAt("y",false);
	  }
	  else if(keyboard.eventMatches(event,"b")){
	    changeLookAt("y",true);
	  }
	  // Increase/Decrease the z location the camera is looking at ’c’/’C’
	  else if(keyboard.eventMatches(event,"shift+c")){
	    changeLookAt("z",false);
	  }
	  else if(keyboard.eventMatches(event,"c")){
	    changeLookAt("z",true);
	  }
	  // Increase/Decrease the value of the up vector in the x coordinate ’d’/’D’
	  else if(keyboard.eventMatches(event,"shift+d")){
	    changeUpVector("x",false);
	  }
	  else if(keyboard.eventMatches(event,"d")){
	    changeUpVector("x",true);
	  }
	  // Increase/Decrease the value of the up vector in the y coordinate ’e’/’E’
	  else if(keyboard.eventMatches(event,"shift+e")){
	    changeUpVector("y",false);
	  }
	  else if(keyboard.eventMatches(event,"e")){
	    changeUpVector("y",true);
	  }
	  // Increase/Decrease the value of the up vector in the z coordinate ’f’/’F’
	  else if(keyboard.eventMatches(event,"shift+f")){
	    changeUpVector("z",false);
	  }
	  else if(keyboard.eventMatches(event,"f")){
	    changeUpVector("z",true);	
	  }
	  // Increase/decrease step size (the increment moved by a keypress from above) with keys ’k/K’
	  else if(keyboard.eventMatches(event,"shift+k")){
	    changeStep(false);
	  }
	  else if(keyboard.eventMatches(event,"k")){
	    changeStep(true);
	  }
  }
  else if (currentMode == 2) { // relative flying mode
	// Change yaw wrt local Camera coordinates with increment/decrement keys ’q’/’Q’ 
	// or with the horizontal component of the left mouse drag.
	if(keyboard.eventMatches(event,"shift+q")){
		performYaw(false,stepSize);
	}
	else if(keyboard.eventMatches(event,"q")){
	  	performYaw(true,stepSize);
	}

	// Change pitch wrt local Camera coordinates with increment/decrement keys ’s’/’S’ 
	// or with the vertical component of the left mouse drag.
	else if(keyboard.eventMatches(event,"shift+s")){
	   performPitch(false,stepSize);
	}
	else if(keyboard.eventMatches(event,"s")){
	    performPitch(true,stepSize);
	}

	// Roll wrt local Camera up vector with increment/decrement keys ’a’/’A’ 
	else if(keyboard.eventMatches(event,"shift+a")){
	   performRoll(false,stepSize);
	}
	else if(keyboard.eventMatches(event,"a")){
		performRoll(true,stepSize);
	}

	// Forward/backward motion wrt local Camera z with increment/decrement keys ’w’/’W’, 
	else if(keyboard.eventMatches(event,"shift+w")){
	   performFly(false,stepSize);
	}
	else if(keyboard.eventMatches(event,"w")){
	   	performFly(true,stepSize);   
	}

	// or with the vertical component of the mouse drag when the ’t’ key is held down. 
	// The vertical magnitude of the drag should control the translation distance. 
	else if(keyboard.eventMatches(event,"t")){
	   T_STATE = true;
	   keyboard.domElement.addEventListener('keyup', onKeyUp);
	}

  	//Increase/decrease speed (the increment moved by a keypress above) with increment/decrement keys ’k’/’K’.
  	else if(keyboard.eventMatches(event,"shift+k")){
	   changeStep(false);
	}
	else if(keyboard.eventMatches(event,"k")){
	   changeStep(true);
	}
  }
  else if (currentMode == 3) { // geosync mode

	// Move closer/further to planet with keys ’w’/’W’ or with the vertical component of the mouse drag, as above
	if(keyboard.eventMatches(event,"shift+w")){
	   (isMothership)? traceDistance[1] += stepSize : traceDistance[1] += stepSize;
	}
	else if(keyboard.eventMatches(event,"w")){
	   (isMothership)? traceDistance[1] += -stepSize : traceDistance[1] += -stepSize;
	}

  	//Increase/decrease speed (increment moved by a keypress above) with key ’k’/’K’
  	else if(keyboard.eventMatches(event,"shift+k")){
	   changeStep(false);
	}
	else if(keyboard.eventMatches(event,"k")){
	   changeStep(true);
	}

	//Change the planet to orbit around with the numbers ’1 to 8’ By default, the planet to orbit is Earth (number ’3’).
  	else if(keyboard.eventMatches(event,"1")){ // mercury
  		updateGeoSyncLookAt(mercury, false);
	   currentPlanet = 1;
	}
	else if(keyboard.eventMatches(event,"2")){ // venus
		updateGeoSyncLookAt(venus,false);
	   currentPlanet = 2;
	}
	else if(keyboard.eventMatches(event,"3")){ // earth defualt
	   updateGeoSyncLookAt(earth,false);
	   currentPlanet = 3;
	}
	else if(keyboard.eventMatches(event,"4")){ // mars
		updateGeoSyncLookAt(mars,false);
	   currentPlanet = 4;
	}
	else if(keyboard.eventMatches(event,"5")){ // jupiter
		updateGeoSyncLookAt(jupiter,false);
	   currentPlanet = 5;
	}
	else if(keyboard.eventMatches(event,"6")){ // saturn
		updateGeoSyncLookAt(saturn,false);
	   currentPlanet = 6;
	}
	else if(keyboard.eventMatches(event,"7")){ // uranus
		updateGeoSyncLookAt(uranus,false);
	  currentPlanet = 7;
	}
	else if(keyboard.eventMatches(event,"8")){ // neptune
		updateGeoSyncLookAt(neptune,false);
	  currentPlanet = 8;
	}
	else if(keyboard.eventMatches(event,"9")){ // neptune
		updateGeoSyncLookAt(pluto,false);
	  currentPlanet = 9;
	}
  }
}
keyboard.domElement.addEventListener('keydown', onKeyDown );

function onKeyUp(event) {
	if (currentMode != 2) {
		return;
	}
	if (keyboard.eventMatches(event,"t")) {
		T_STATE = false;
		keyboard.domElement.removeEventListener('keyup', onKeyUp);
	}
}


		
function resetMouseState() {
	mouseState = 0;
}

function resetPointPos(event) {
	mouseX = event.x;
	mouesY = event.y;
	mouseDistX = 0;
	mouseDistY = 0;
}

function onMouseDown(event) {
	if (mouseState != 0) {
		resetMouseState();
		return;
	}
	mouseState = 1;
	event.preventDefault();

	// console.log("Mouse Down");
	mouseX = event.x;
	mouseY = event.y;
}
document.addEventListener( 'mousedown', onMouseDown, false );
document.addEventListener( 'mousemove', onMouseMove, false );
document.addEventListener( 'mouseup', onMouseUp, false );

function onMouseMove(event) {
	if (mouseState != 1) {
		resetMouseState();
		return;
	}
	// console.log("Mouse Move");
	if (currentMode == 2) {
		if (T_STATE) {
			performFly(false, (event.movementY)*stepSize);
		} else {
			console.log(event.movementX+"     "+event.movementY);
			performYaw(true, (event.movementX/windowWidth)*stepSize);
			performPitch(true, (event.movementY/windowHeight)*stepSize);
		}
		
	} else if (currentMode == 3) {
		var dist = event.movementY*stepSize;
		(isMothership)? traceDistance[1] += dist : traceDistance[1] += dist;
	}
	resetPointPos(event);
}


function onMouseUp(event) {
	resetMouseState();
	// console.log("Mouse Up");
	// document.removeEventListener( 'mousemove', onMouseMove, false );
	// document.removeEventListener( 'mouseup', onMouseUp, false );
}



// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
// DON'T TOUCH THIS
function update() {
  updateSystem();

  requestAnimationFrame(update);
  
  // UPDATES THE MULTIPLE CAMERAS IN THE SIMULATION
  for ( var ii = 0; ii < views.length; ++ii ) {

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