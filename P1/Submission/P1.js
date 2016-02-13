// UBC CPSC 314 (2015W2) -- P1
// HAVE FUN!!! :)

// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer( { alpha: true } );
renderer.setClearColor(0x000000, 0.5);
canvas.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30,1,0.1,1000); // view angle, aspect ratio, near, far
camera.position.set(45,20,40);
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
   }

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

// MATERIALS
// Note: Feel free to be creative with this! 
var normalMaterial = new THREE.MeshNormalMaterial();

// function drawCube()
// Draws a unit cube centered about the origin.
// Note: You will be using this for all of your geometry
function makeCube() {
  var unitCube = new THREE.BoxGeometry(1,1,1);
  return unitCube;
}

// ===============================================================================
// ===============================================================================
// Variables
// ===============================================================================
var godzillaMode = false;
var reversible = true;
var numberOfTentical = 9;
var numberOfClaws = 5;
var tentLAngleX = [-40,-30,-20,-10,0,10,20,30,40];
var tentLAngleY = [0,10,20,30,40,30,20,10,0];
var tentRAngleX = [40,30,20,10,0,-10,-20,-30,-40];
var tentRAngleY = [0,-10,-20,-30,-40,-30,-20,-10,0];
var numberOfBuilding = 10;
var building = [];
var buildingMatrix = [];
var numOfPlanes = 5;
var planeBody = [];
var planeWing = [];
var planeTail = [];

var matrixPlaneBody = [];
var matrixPlaneWing = [];
var matrixPlaneTail = [];
var xmatrixPlaneBody = [];
var xmatrixPlaneWing = [];
var xmatrixPlaneTail = [];
var xmatrixTorso = new THREE.Matrix4().set(1,0,0,0, 0,1,0,3.5, 0,0,1,0, 0,0,0,1);
var xmatrixHead = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,5.4, 0,0,0,1);
var xmatrixTail = new THREE.Matrix4().set(1,0,0,0, 0,1,0,-1, 0,0,1,-4, 0,0,0,1);
var xmatrixFrontLegLeft = new THREE.Matrix4().set(1,0,0,2, 0,1,0,-2.5, 0,0,1,3.75, 0,0,0,1);
var xmatrixFrontLegRight = new THREE.Matrix4().set(1,0,0,-2, 0,1,0,-2.5, 0,0,1,3.75, 0,0,0,1);
var xmatrixBackLegLeft = new THREE.Matrix4().set(1,0,0,2.5, 0,1,0,-2.9, 0,0,1,-2.5, 0,0,0,1);
var xmatrixBackLegRight = new THREE.Matrix4().set(1,0,0,-2.5, 0,1,0,-2.9, 0,0,1,-2.5, 0,0,0,1);
var xmatrixNose = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,2, 0,0,0,1);
var xmatrixClawFrontLeft = populateClawsMatrix(-1,-0.5,1.8,0.5);
var xmatrixClawFrontRight = populateClawsMatrix(-1,-0.5,1.8,0.5);
var xmatrixClawBackLeft = populateClawsMatrix(-0.8,-0.5,1.5,0.4);
var xmatrixClawBackRight = populateClawsMatrix(-0.8,-0.5,1.5,0.4);
var xmatrixTentLeft = populateTentMatrix(1,1,1);
var xmatrixTentRight = populateTentMatrix(-1,-1,1);
var xmatrixTentSmallLeftUpper = new THREE.Matrix4().set(1,0,0,0.2, 0,1,0,0.2, 0,0,1,1, 0,0,0,1);
var xmatrixTentSmallLeftLower = new THREE.Matrix4().set(1,0,0,0.2, 0,1,0,-0.2, 0,0,1,1, 0,0,0,1);
var xmatrixTentSmallRightUpper = new THREE.Matrix4().set(1,0,0,-0.2, 0,1,0,0.2, 0,0,1,1, 0,0,0,1);
var xmatrixTentSmallRightLower = new THREE.Matrix4().set(1,0,0,-0.2, 0,1,0,-0.2, 0,0,1,1, 0,0,0,1);

// ===============================================================================
// Geometry
// ===============================================================================

var geometryTorso = makeCube();
var geometryHead = makeCube();
var geometryTail = makeCube();
var geometryNose = makeCube();
var geometryFrontLeg = makeCube();
var geometryBackLeg = makeCube();
var geometryClawLarge = makeCube();
var geometryClawSmall = makeCube();
var geometryTentLarge  = makeCube();
var geometryTentSmall = makeCube();

var scaleTorso = scale(5,5,8);
var scaleHead = scale(3,3,3);
var rotationTail = rotation(1,-5, true);
var scaleTail = scale(0.75,0.75,7.5); 
var scaleNose = scale(2,2,2);
var scaleFrontLeg = scale(2.5,1,3);
var rotationLegs = rotation(1,15, true);
var scaleBackLeg = scale(2,1,2.5);
var scaleFingerLarge = scale(0.35,0.35, 1);
var scaleFingerSmall = scale(0.2,0.2, 1);
var scaleTentLarge = scale(0.25,0.25,1.5);
var scaleTentSmall = scale(0.25,0.25,1.5);

geometryTorso.applyMatrix(scaleTorso);
geometryHead.applyMatrix(scaleHead);
geometryTail.applyMatrix(scaleTail);
geometryTail.applyMatrix(rotationTail);
geometryNose.applyMatrix(scaleNose);
geometryFrontLeg.applyMatrix(scaleFrontLeg);
geometryFrontLeg.applyMatrix(rotationLegs);
geometryBackLeg.applyMatrix(scaleBackLeg);
geometryBackLeg.applyMatrix(rotationLegs);
geometryClawLarge.applyMatrix(scaleFingerLarge);
geometryClawLarge.applyMatrix(rotationLegs);
geometryClawSmall.applyMatrix(scaleFingerSmall);
geometryClawSmall.applyMatrix(rotationLegs);
geometryTentLarge.applyMatrix(scaleTentLarge);
geometryTentSmall.applyMatrix(scaleTentSmall);

// ===============================================================================
// Matrix 
//
// Hierarchy
//           World
//             |
//           Torso
//     |-------|------|-------------|
//    head    tail   frontLegs    backLegs
//     |                |           |
//    nose          clawsLarge    clawsSmall
//     |
//  |---------------|----------|----------------|
// leftTent     RightTent     SamllTentR     LargeTentL
// ===============================================================================

// Main Body Part - MAIN BODY - RELATIVE TO TORSO
var matrixTorso = new THREE.Matrix4().set(1,0,0,0, 0,1,0,3.5, 0,0,1,0, 0,0,0,1);
var matrixHead = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,5.4, 0,0,0,1);
var matrixTail = new THREE.Matrix4().set(1,0,0,0, 0,1,0,-1, 0,0,1,-4, 0,0,0,1);
var matrixFrontLegLeft = new THREE.Matrix4().set(1,0,0,2, 0,1,0,-2.5, 0,0,1,3.75, 0,0,0,1);
var matrixFrontLegRight = new THREE.Matrix4().set(1,0,0,-2, 0,1,0,-2.5, 0,0,1,3.75, 0,0,0,1);
var matrixBackLegLeft = new THREE.Matrix4().set(1,0,0,2.5, 0,1,0,-2.9, 0,0,1,-2.5, 0,0,0,1);
var matrixBackLegRight = new THREE.Matrix4().set(1,0,0,-2.5, 0,1,0,-2.9, 0,0,1,-2.5, 0,0,0,1);

// nose - RELATIVE TO HEAD
var matrixNose = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,2, 0,0,0,1);

// claws - RELATIVE TO PAW
var matrixClawFrontLeft = populateClawsMatrix(-1,-0.5,1.8,0.5);
var matrixClawFrontRight = populateClawsMatrix(-1,-0.5,1.8,0.5);
var matrixClawBackLeft = populateClawsMatrix(-0.8,-0.5,1.5,0.4);
var matrixClawBackRight = populateClawsMatrix(-0.8,-0.5,1.5,0.4);

// tenticals - RELATIVE TO NOSE
var matrixTentLeft = populateTentMatrix(1,1,1);
var matrixTentRight = populateTentMatrix(-1,-1,1);
var matrixTentSmallLeftUpper = new THREE.Matrix4().set(1,0,0,0.2, 0,1,0,0.2, 0,0,1,1, 0,0,0,1);
var matrixTentSmallLeftLower = new THREE.Matrix4().set(1,0,0,0.2, 0,1,0,-0.2, 0,0,1,1, 0,0,0,1);
var matrixTentSmallRightUpper = new THREE.Matrix4().set(1,0,0,-0.2, 0,1,0,0.2, 0,0,1,1, 0,0,0,1);
var matrixTentSmallRightLower = new THREE.Matrix4().set(1,0,0,-0.2, 0,1,0,-0.2, 0,0,1,1, 0,0,0,1);

var wingMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,-1, 0,0,0,1);
var tailMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,2, 0,0,0,1);

// ===============================================================================
// Custom Functions
// ===============================================================================

// rotation: generate a matrix for rotation
//    axis = which axis 1, 2 or 3 (x,y or z)
//    deg = accept both rad and degree
//    useDegree = True: degree will be convert to rad 
function rotation(axis,deg, useDegree) {
  var tmpRotation;
  if (useDegree) {
    deg = (deg*Math.PI)/180;
  }
  a = Math.cos(deg);
  b = Math.sin(deg);
  if (axis === 1) {  // rotate x
    tmpRotation = new THREE.Matrix4().set(1,0,0,0, 0,a,-b,0, 0,b,a,0, 0,0,0,1);
  } 
  else if (axis == 2) { // rotate y
    tmpRotation = new THREE.Matrix4().set(a,0,b,0, 0,1,0,0, -b,0,a,0, 0,0,0,1);
  }
  else if (axis == 3) { // rorate z
    tmpRotation = new THREE.Matrix4().set(a,-b,0,0, b,a,0,0, 0,0,1,0, 0,0,0,1);
  }
  return tmpRotation;
}

// translation: generate translation matrix
//    x y and z = amount of translation for each
function translation(x,y,z) {
  return new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1);
}

// scale: generate scale matrix
//    x y and z = amount of scale for each
function scale(x,y,z) {
  return new THREE.Matrix4().set(x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1);
}

// mulMatrix: multiply matrix together A*B
//    matrix = A
//    app = B
function mulMatrix(matrix,app) {
  return new THREE.Matrix4().multiplyMatrices(matrix,app);
}

// populateClawsMatrix: bulk matrix population for claws
//    startX = starting x position
//    fixedY = fixed Y for the matrix
//    fixedZ = fixed Z for the matrix
//    spacing = how far apart each claw will be with each other. only in x dir
function populateClawsMatrix(startX, fixedY, fixedZ, spacing) {
  var claws = [];
  for (i=0; i<numberOfClaws; i++) {
    claws.push(new THREE.Matrix4().set(1,0,0,startX+spacing*i, 0,1,0,fixedY, 0,0,1,fixedZ, 0,0,0,1));
  }
  return claws;
}

// populateTentMatrix: bulk matrix population for tentacles arrange into a circle
//    x y and z = the fixed X, Y, Z position for the initial tentacle at degree 0
function populateTentMatrix(x,y,z) {
  var tenticals = [];
  for (i = 0; i < numberOfTentical; i++) {
    var angle = (180/numberOfTentical)*(i+1); // 180/9
    var yspacing = Math.cos(angle*Math.PI/180);
    var xspacing = Math.sin(angle*Math.PI/180);;
    tenticals.push(new THREE.Matrix4().set(1,0,0,x*xspacing, 0,1,0,y*yspacing, 0,0,1,z, 0,0,0,1));
  }
  return tenticals;
}

// populateLargeTentGeometry: bulk Geometry population for Large tentacles with custom tilt
//    angleX = an array of degrees (in deg) to rotate the tentacle in the X axis
//    angleY = an array of degrees (in deg) to rotate the tentacle in the Y axis
function populateLargeTentGeometry(angleX, angleY) {
  var tenticals = [];
  for (i = 0; i < numberOfTentical; i++) {
    var thisTent  = makeCube();
    thisTent.applyMatrix(scaleTentLarge);
    thisTent.applyMatrix(rotation(1,angleX[i],true));
    thisTent.applyMatrix(rotation(2,angleY[i],true));
    var tent = new THREE.Mesh(thisTent,normalMaterial);
    tenticals.push(tent);
  }
  return tenticals;
}

// populateClaw: bulk geometry population for claws
//    clawGeo = either large or small claws geomerty
function populateClaw(clawGeo) {
  var claws = [];
  for (i=0; i<numberOfClaws; i++) {
    claws.push(new THREE.Mesh(clawGeo,normalMaterial));
  }
  return claws;
}

// setToRELMatrix: custom bulk setMatrix that apply multiply (Relative) before setting
//    bodyPart = an array of mesh
//    matrix = the matrix relative to their parent
//    relativeTo = parent in the heiarchy
//    length = length of matrix and bodyPart
function setToRELMatrix(bodyPart, matrix, relativeTo, length) {
  for (i = 0; i<length; i++) {
    bodyPart[i].setMatrix(mulMatrix(relativeTo,matrix[i]));
  }
}

// addListToScene: add list of mesh to scene. Helper of addToScene()
//    list = list of mesh
function addListToScene(list) {
   if (list) {
    var len = list.length;
    for (i = 0; i < len; i++) {
      scene.add(list[i]);
    }
   }
}

// addToScene: add every body part to scene.
function addToScene() {
  scene.add(torso);
  scene.add(head);
  scene.add(tail);
  scene.add(nose);
  scene.add(frontLegL);
  scene.add(frontLegR);
  scene.add(backLegL);
  scene.add(backLegR);
  addListToScene(frontClawsL);
  addListToScene(frontClawsR);
  addListToScene(backClawsL);
  addListToScene(backClawsR);
  addListToScene(tentL);
  addListToScene(tentR);
  scene.add(tentSmallLU);
  scene.add(tentSmallLD);
  scene.add(tentSmallRU);
  scene.add(tentSmallRD);
}

//  drawMole: (re)calculate the relative position of each body part then set the matrix accordingly
function drawMole() {
  var xmatrixHeadREL = mulMatrix(xmatrixTorso, xmatrixHead);
  var xmatrixTailREL = mulMatrix(xmatrixTorso, xmatrixTail);
  var xmatrixNoseREL = mulMatrix(xmatrixHeadREL, xmatrixNose);
  var xmatrixFrontLegLeftREL = mulMatrix(xmatrixTorso, xmatrixFrontLegLeft);
  var xmatrixFrontLegRightREL = mulMatrix(xmatrixTorso, xmatrixFrontLegRight);
  var xmatrixBackLegLeftREL = mulMatrix(xmatrixTorso, xmatrixBackLegLeft);
  var xmatrixBackLegRightREL = mulMatrix(xmatrixTorso, xmatrixBackLegRight);

  torso.setMatrix(xmatrixTorso);
  head.setMatrix(xmatrixHeadREL);
  tail.setMatrix(xmatrixTailREL);
  nose.setMatrix(xmatrixNoseREL);
  frontLegL.setMatrix(xmatrixFrontLegLeftREL);
  frontLegR.setMatrix(xmatrixFrontLegRightREL);
  backLegL.setMatrix(xmatrixBackLegLeftREL);
  backLegR.setMatrix(xmatrixBackLegRightREL);

  setToRELMatrix(frontClawsL, xmatrixClawFrontLeft, xmatrixFrontLegLeftREL, numberOfClaws);
  setToRELMatrix(frontClawsR, xmatrixClawFrontRight, xmatrixFrontLegRightREL, numberOfClaws);
  setToRELMatrix(backClawsL, xmatrixClawBackLeft, xmatrixBackLegLeftREL, numberOfClaws);
  setToRELMatrix(backClawsR, xmatrixClawBackRight, xmatrixBackLegRightREL, numberOfClaws);

  setToRELMatrix(tentL,xmatrixTentLeft,xmatrixNoseREL,numberOfTentical);
  setToRELMatrix(tentR,xmatrixTentRight,xmatrixNoseREL,numberOfTentical);

  var xmatrixTentSmallLeftUpperREL = mulMatrix(xmatrixNoseREL, xmatrixTentSmallLeftUpper);
  var xmatrixTentSmallLeftLowerREL = mulMatrix(xmatrixNoseREL, xmatrixTentSmallLeftLower);
  tentSmallLU.setMatrix(xmatrixTentSmallLeftUpperREL);
  tentSmallLD.setMatrix(xmatrixTentSmallLeftLowerREL);

  var xmatrixTentSmallRightUpperREL = mulMatrix(xmatrixNoseREL, xmatrixTentSmallRightUpper);
  var xmatrixTentSmallRightLowerREL = mulMatrix(xmatrixNoseREL, xmatrixTentSmallRightLower);
  tentSmallRU.setMatrix(xmatrixTentSmallRightUpperREL);
  tentSmallRD.setMatrix(xmatrixTentSmallRightLowerREL);
}

// performTorsoRotation: associate to the key U and E. rotate the torso
//    p = the current frame, incr for smooth animation
function performTorsoRotation(p) {
  var rotateZ = rotation(1,p, false);
  xmatrixTorso = mulMatrix(matrixTorso,rotateZ); 
}

// performHeadRotation: associate to the key H and G. rotate the head
//    p = the current frame, incr for smooth animation
function performHeadRotation(p) {
  var rotate = rotation(2,p, false);
  xmatrixHead = mulMatrix(matrixHead,rotate);
}

// performTailRotation: associate to the key T and V. rotate the tail
//    p = the current frame, incr for smooth animation
function performTailRotation(p) {
  var rotate = rotation(2,p/2, false);
  xmatrixTail = mulMatrix(matrixTail, rotate);
}

// performFanOut: associate to the key N. rotate each individual tentacle out along a specific axis
//    p = the current frame, incr for smooth animation
function performFanOut(p) {
  var rotateL = rotation(2,p/1.5, false);
  var rotateR = rotation(2,-p/1.5, false);
  for (i = 0; i < numberOfTentical; i++) {
    xmatrixTentLeft[i] = mulMatrix(matrixTentLeft[i],rotateL);
    xmatrixTentRight[i] = mulMatrix(matrixTentRight[i],rotateR);
  }
  xmatrixTentSmallLeftLower = mulMatrix(matrixTentSmallLeftLower, rotateL);
  xmatrixTentSmallLeftUpper = mulMatrix(matrixTentSmallLeftUpper, rotateL);
  xmatrixTentSmallRightLower = mulMatrix(matrixTentSmallRightLower, rotateR);
  xmatrixTentSmallRightUpper = mulMatrix(matrixTentSmallRightUpper, rotateR);
}

// performSwin: associate to the key S. make use of the swimCounter to determine which sequenc of actions
//              to perform. rotate head, tail and selectively rotate paws. Also fan out tentacles
//    p = the current frame, incr for smooth animation
//    rp = for rotating to paws backwards at swimCounter == 2
function performSwin(p, rp) {
  var rotatePawPos = rotation(1,p/2,false);
  var rotatePawNul = rotation(1,rp/2,false);
  switch (swimCounter) {
    case 1:
      performHeadRotation(-p);
      performTailRotation(-p);
      performFanOut(p);
      xmatrixFrontLegLeft = mulMatrix(matrixFrontLegLeft, rotatePawPos);
      xmatrixBackLegRight = mulMatrix(matrixBackLegRight, rotatePawPos);
    break;
    case 2:
      performHeadRotation(p);
      performTailRotation(p);
      performFanOut(p);
      xmatrixFrontLegRight = mulMatrix(matrixFrontLegRight, rotatePawPos);
      xmatrixBackLegLeft = mulMatrix(matrixBackLegLeft, rotatePawPos);
      xmatrixFrontLegLeft = mulMatrix(matrixFrontLegLeft, rotatePawNul);
      xmatrixBackLegRight = mulMatrix(matrixBackLegRight, rotatePawNul);
    break;
    default:
      performHeadRotation(p);
      performTailRotation(p);
      performFanOut(p);
      xmatrixFrontLegRight = mulMatrix(matrixFrontLegRight, rotatePawNul);
      xmatrixBackLegLeft = mulMatrix(matrixBackLegLeft, rotatePawNul);
    break;
  }
}

// performDig: associate to the key D. rotate the paws and then rotate the claws even more
//    p = the current frame, incr for smooth animation
function performDig(p) {
  var rotatePaw = rotation(1,p/2,false);
  var rotateCalw = rotation(1, p/1.5, false);
  xmatrixFrontLegRight = mulMatrix(matrixFrontLegRight, rotatePaw);
  xmatrixFrontLegLeft = mulMatrix(matrixFrontLegLeft, rotatePaw);
  for (i = 0; i < numberOfClaws; i++) {
    xmatrixClawFrontRight[i] = mulMatrix(matrixClawFrontRight[i], rotateCalw);
    xmatrixClawFrontLeft[i] = mulMatrix(matrixClawFrontLeft[i], rotateCalw);
  }
}


function performAttack(cp) {
  var radius = 0.05;
  rad = (cp*Math.PI)/180;
  var deltaX = radius*Math.cos(rad);
  var deltaY = radius*Math.sin(rad);
  var path = translation(deltaY,0,0);
  for (i=0; i<numOfPlanes; i++) {
    xmatrixPlaneBody[i] = mulMatrix(xmatrixPlaneBody[i], path);
  }
  drawPlane();
}


function performGodzilla(cp) {
  if (actionQueue.Z) { // start it
    summonBuildings();
    performStandUp(cp); 
    performDig(-cp);
  } 
}


function summonPlanes() {
  planeBody = [];
  planeWing = [];
  planeTail = [];

  matrixPlaneBody = [];
  matrixPlaneWing = [];
  matrixPlaneTail = [];

  xmatrixPlaneBody = [];
  xmatrixPlaneWing = [];
  xmatrixPlaneTail = [];

  var main = makeCube();
  main.applyMatrix(scale(1,1,7));
  var wing = makeCube();
  wing.applyMatrix(scale(10,0.25,1));
  var tail = makeCube();
  tail.applyMatrix(scale(5,0.25,1));

  var heights = randomBuildingHeight(numOfPlanes);
  for (i=0; i<numOfPlanes; i++) {
    planeBody.push(new THREE.Mesh(main,normalMaterial));
    planeWing.push(new THREE.Mesh(wing,normalMaterial));
    planeTail.push(new THREE.Mesh(tail,normalMaterial));
    var matB = new THREE.Matrix4().set(1,0,0,randomBuildingPosition().RX, 0,1,0,heights[i]+20, 0,0,1,randomBuildingPosition().RZ, 0,0,0,1);
    matrixPlaneBody.push(matB);
    xmatrixPlaneBody.push(matB);
    matrixPlaneWing.push(wingMatrix);
    xmatrixPlaneWing.push(wingMatrix);
    matrixPlaneTail.push(tailMatrix);
    xmatrixPlaneTail.push(tailMatrix);
  }
  drawPlane();
}

function drawPlane() {
  for (i=0; i<numOfPlanes; i++) {
    planeBody[i].setMatrix(xmatrixPlaneBody[i]);
    planeWing[i].setMatrix(mulMatrix(xmatrixPlaneBody[i],matrixPlaneWing[i]));
    planeTail[i].setMatrix(mulMatrix(xmatrixPlaneBody[i],matrixPlaneTail[i]));
  }
  addListToScene(planeBody);
  addListToScene(planeWing);
  addListToScene(planeTail);
}


function randomBuildingPosition() {
  var randX = Math.round(Math.random()*100) + 1;
  var randZ = Math.round(Math.random()*100) + 1;
  if (Math.abs(randX - 50) < 5) {
    randX = randX + 15;
  }
  return {RX: randX - 50, RZ: randZ - 50};
}


function randomBuildingHeight(num) {
  var height = [];
  for (i=0; i< num; i++){
    height.push(Math.random()*9);
  }
  return height;
}


function summonBuildings() {
  numberOfBuilding = 30;
  building = [];
  buildingMatrix = [];
  var heights = randomBuildingHeight(numberOfBuilding);
  for (i=0; i<numberOfBuilding; i++) {
    var geometryBuilding = makeCube();
    geometryBuilding.applyMatrix(scale(Math.random()*3,heights[i],Math.random()*3))
    building.push(new THREE.Mesh(geometryBuilding,normalMaterial));
  }
  for (i=0; i<numberOfBuilding; i++) {
    buildingMatrix.push(new THREE.Matrix4().set(1,0,0,randomBuildingPosition().RX, 0,1,0,heights[i]/2, 0,0,1,randomBuildingPosition().RZ, 0,0,0,1));
  }
  for (i=0; i<numberOfBuilding; i++) {
    building[i].setMatrix(buildingMatrix[i]);
  }
  addListToScene(building);
}


function performStandUp(p) {
  var rotateZ = rotation(1,p, false);
  xmatrixTorso = mulMatrix(matrixTorso,rotateZ);

  var rotatePaw = rotation(1,-p/2,false);
  var rotateCalw = rotation(1,-p/1.5, false);
  xmatrixBackLegRight = mulMatrix(matrixBackLegRight, rotatePaw);
  xmatrixBackLegLeft = mulMatrix(matrixBackLegLeft, rotatePaw);
  for (i = 0; i < numberOfClaws; i++) {
    xmatrixClawBackRight[i] = mulMatrix(matrixClawBackRight[i], rotateCalw);
    xmatrixClawBackLeft[i] = mulMatrix(matrixClawBackLeft[i], rotateCalw);
  }
}


function cleanUpAndReset() {
  window.location.reload(false); 
}
// ===============================================================================       

// CREATE BODY
var torso = new THREE.Mesh(geometryTorso,normalMaterial);
var head = new THREE.Mesh(geometryHead,normalMaterial);
var tail = new THREE.Mesh(geometryTail,normalMaterial);
var nose = new THREE.Mesh(geometryNose,normalMaterial);
var frontLegL = new THREE.Mesh(geometryFrontLeg,normalMaterial);
var frontLegR = new THREE.Mesh(geometryFrontLeg,normalMaterial);
var backLegL = new THREE.Mesh(geometryBackLeg,normalMaterial);
var backLegR = new THREE.Mesh(geometryBackLeg,normalMaterial);
var frontClawsL = populateClaw(geometryClawLarge);
var frontClawsR = populateClaw(geometryClawLarge);
var backClawsL = populateClaw(geometryClawSmall);
var backClawsR = populateClaw(geometryClawSmall);
var tentL = populateLargeTentGeometry(tentLAngleX,tentLAngleY);
var tentR = populateLargeTentGeometry(tentRAngleX,tentRAngleY);
var tentSmallLU = new THREE.Mesh(geometryTentSmall,normalMaterial);
var tentSmallLD = new THREE.Mesh(geometryTentSmall,normalMaterial);
var tentSmallRU = new THREE.Mesh(geometryTentSmall,normalMaterial);
var tentSmallRD = new THREE.Mesh(geometryTentSmall,normalMaterial);

// draw initial body
drawMole();

// add body to scene
addToScene();

// APPLY DIFFERENT JUMP CUTS/ANIMATIONS TO DIFFERNET KEYS
// Note: The start of "U" animation has been done for you, you must implement the hiearchy and jumpcut.
// Hint: There are other ways to manipulate and grab clock values!!
// Hint: Check THREE.js clock documenation for ideas.
// Hint: It may help to start with a jumpcut and implement the animation after.
// Hint: Where is updateBody() called?
var clock = new THREE.Clock(true);

var p0; // start position or angle
var p1; // end position or angle
var time_length; // total time of animation
var time_start; // start time of animation
var time_end; // end time of animation
var p; // current frame
var animate = false; // animate?
var swimCounter = 0;
var actionQueue = {
  U: false,
  E: false,
  H: false,
  G: false,
  T: false,
  V: false,
  S: false,
  N: false,
  D: false,
  Z: false,
  B: false};
var jumpCut = false;

// actionManager: keep track of which key has been pressed and dir of action
function actionManager(keyHit) {
  var result = {toggle: false, keyState: ""};
  switch (keyHit) {
    case "U":
      if (actionQueue.E && reversible) {
        result.toggle = true;
        result.keyState = "E";
        actionQueue.U = false;
        actionQueue.E = false;
      } else {
        result.toggle = actionQueue.U;
        result.keyState = "U";
        actionQueue.U = !result.toggle;
      }
    break;
    case "E":
      if (actionQueue.U && reversible) {
          result.toggle = true;
          result.keyState = "U";
          actionQueue.U = false;
          actionQueue.E = false;
      } else {
          result.toggle = actionQueue.E;
          result.keyState = "E";
          actionQueue.E = !result.toggle;
      }
    break;
    case "H":
      if (actionQueue.G && reversible) {
        result.toggle = true;
        result.keyState = "G";
        actionQueue.H = false;
        actionQueue.G = false;
      } else {
        result.toggle = actionQueue.H;
        result.keyState = "H";
        actionQueue.H = !result.toggle;
      }
    break;
    case "G":
      if (actionQueue.H && reversible) {
        result.toggle = true;
        result.keyState = "H";
        actionQueue.H = false;
        actionQueue.G = false;
      } else {
        result.toggle = actionQueue.G;
        result.keyState = "G";
        actionQueue.G = !result.toggle;
      }
    break;
    case "T":
      if (actionQueue.V && reversible) {
        result.toggle = true;
        result.keyState = "V";
        actionQueue.T = false;
        actionQueue.V = false;
      } else {
        result.toggle = actionQueue.T;
        result.keyState = "T";
        actionQueue.T = !result.toggle;
      }
    break;
    case "V":
      if (actionQueue.T && reversible) {
        result.toggle = true;
        result.keyState = "T";
        actionQueue.T = false;
        actionQueue.V = false;
      } else {
        result.toggle = actionQueue.V;
        result.keyState = "V";
        actionQueue.V = !result.toggle;
      }
    break;
    case "S":
      result.toggle = false;
      result.keyState = "S";
      actionQueue.S = !result.toggle;
    break;
    case "N":
      result.toggle = actionQueue.N;
      result.keyState = "N";
      actionQueue.N = !result.toggle;
    break;
    case "D":
      result.toggle = actionQueue.D;
      result.keyState = "D";
      actionQueue.D = !result.toggle;
    break;
    case "A":
      result.toggle = actionQueue.Z;
      result.keyState = "A";
      actionQueue.Z = !result.toggle;
    break;
    case "B":
      result.toggle = actionQueue.B;
      result.keyState = "B";
      actionQueue.B = !result.toggle;
    break;
    default:
      console.log("Unkown");
    break;
  }
  return result;
}

// function init_animation()
// Initializes parameters and sets animate flag to true.
// Input: start position or angle, end position or angle, and total time of animation.
function init_animation(p_start,p_end,t_length,dirToggle){
  p0 = p_start;
  p1 = p_end;
  if (dirToggle && p_start == 0) {
    p0 = p_end;
    p1 = p_start;
  }
  time_length = t_length;
  time_start = clock.getElapsedTime();
  time_end = time_start + time_length;
  animate = true; // flag for animation
  return;
}

function updateBody() {
  switch(true)
  {
      case((key == "U" || key == "E") && animate && !godzillaMode):
        var time = clock.getElapsedTime(); // t seconds passed since the clock started.
        if (time > time_end){
          p = p1;
          animate = false;
          break;
        } 
        p = (jumpCut)? p1 : ((p1 - p0)*((time-time_start)/time_length) + p0); // current frame
        performTorsoRotation((key ==  "U")? -p : p);
      break;
      case ((key == "H" || key == "G") && animate && !godzillaMode):
        var time = clock.getElapsedTime(); // t seconds passed since the clock started.
        if (time > time_end){
          p = p1;
          animate = false;
          break;
        } 
        p = (jumpCut)? p1 : ((p1 - p0)*((time-time_start)/time_length) + p0); // current frame 
        performHeadRotation((key ==  "H")? -p : p);
      break;
      case ((key == "T" || key == "V") && animate && !godzillaMode):
        var time = clock.getElapsedTime(); // t seconds passed since the clock started.
        if (time > time_end){
          p = p1;
          animate = false;
          break;
        } 
        p = (jumpCut)? p1 : ((p1 - p0)*((time-time_start)/time_length) + p0); // current frame
        performTailRotation((key ==  "V")? -p : p);
      break;
      case ((key == "N") && animate && !godzillaMode):
        var time = clock.getElapsedTime(); // t seconds passed since the clock started.
        if (time > time_end){
          p = p1;
          animate = false;
          break;
        } 
        p = (jumpCut)? p1 : ((p1 - p0)*((time-time_start)/time_length) + p0); // current frame
        performFanOut(p);
      break;
      case ((key == "S") && animate && !godzillaMode):
        var time = clock.getElapsedTime(); // t seconds passed since the clock started.
        if (time > time_end){
          p = p1;
          animate = false;
          break;
        } 
        p = (jumpCut)? p1 : ((p1 - p0)*((time-time_start)/time_length) + p0); // current frame
        z = (jumpCut)? 0 : ((0 - Math.PI/4)*((time-time_start)/time_length) + Math.PI/4); // sub frame
        performSwin(p, z);
      break;
      case ((key == "D") && animate && !godzillaMode):
        var time = clock.getElapsedTime(); // t seconds passed since the clock started.
        if (time > time_end){
          p = p1;
          animate = false;
          break;
        } 
        p = (jumpCut)? p1 : ((p1 - p0)*((time-time_start)/time_length) + p0); // current frame
        performDig(p);
      break;
      case ((key == "A") && animate):
        var time = clock.getElapsedTime(); // t seconds passed since the clock started.
        if (time > time_end){
          p = p1;
          p1 = p0;
          p0 = p;
          time_start = time;
          time_end = time_end + time_length;
          animate = false;
          break;
        } 
        p = (jumpCut)? p1 : ((p1 - p0)*((time-time_start)/time_length) + p0); // current frame
        performGodzilla(-p);
      break;
      case ((key == "B") && animate && godzillaMode):
        var time = clock.getElapsedTime(); // t seconds passed since the clock started.
        p =  (360*((time-time_start)/time_length)); // current frame
        performAttack(p);
      break;
    default:
      break;
  }
  drawMole(); // update model
}











// LISTEN TO KEYBOARD
// Hint: Pay careful attention to how the keys already specified work!
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
var key;
var keyState;
var toggle;
var decision;
keyboard.domElement.addEventListener('keydown',function(event){
  if (event.repeat)
    return;
  if(keyboard.eventMatches(event,"Z")){  // Z: Reveal/Hide helper grid
    grid_state = !grid_state;
    grid_state? scene.add(grid) : scene.remove(grid);}   
  else if(keyboard.eventMatches(event,"0")){    // 0: Set camera to neutral position, view reset
    camera.position.set(45,0,0);
    camera.lookAt(scene.position);}
  else if(keyboard.eventMatches(event,"U")){
    decision = actionManager("U");
    toggle = decision.toggle;
    key = decision.keyState;
    (toggle)? init_animation(p1,p0,time_length,toggle): (init_animation(0,Math.PI/4,1,toggle));}  
  else if(keyboard.eventMatches(event,"E")){ 
    decision = actionManager("E");
    toggle = decision.toggle;
    key = decision.keyState;
    (toggle)? init_animation(p1,p0,time_length,toggle) : (init_animation(0,Math.PI/4,1,toggle));} 
  else if(keyboard.eventMatches(event,"H")){
    decision = actionManager("H"); 
    toggle = decision.toggle;
    key = decision.keyState;
    (toggle)? init_animation(p1,p0,time_length,toggle) : (init_animation(0,Math.PI/4,1,toggle));}
  else if(keyboard.eventMatches(event,"G")){
    decision = actionManager("G"); 
    toggle = decision.toggle;
    key = decision.keyState;
    (toggle)? init_animation(p1,p0,time_length,toggle) : (init_animation(0,Math.PI/4,1,toggle));}
  else if(keyboard.eventMatches(event,"T")){
    decision = actionManager("T"); 
    toggle = decision.toggle;
    key = decision.keyState;
    (toggle)? init_animation(p1,p0,time_length,toggle) : (init_animation(0,Math.PI/4,1,toggle));}
  else if(keyboard.eventMatches(event,"V")){
    decision = actionManager("V"); 
    toggle = decision.toggle;
    key = decision.keyState;
    (toggle)? init_animation(p1,p0,time_length,toggle) : (init_animation(0,Math.PI/4,1,toggle));}
  else if(keyboard.eventMatches(event,"N")){
    decision = actionManager("N"); 
    toggle = decision.toggle;
    key = decision.keyState;
    (toggle)? init_animation(p1,p0,time_length,toggle) : (init_animation(0,Math.PI/4,1,toggle));}
  else if(keyboard.eventMatches(event,"S")){
    decision = actionManager("S");
    toggle = decision.toggle;
    key = decision.keyState;
    if (swimCounter < 2) { 
      (init_animation(0,Math.PI/4,1,toggle));
      swimCounter += 1;
    } else {
      (init_animation(p1,p0,time_length,toggle));
      swimCounter = 0;
    }
  }
  else if(keyboard.eventMatches(event,"D")){
    decision = actionManager("D"); 
    toggle = decision.toggle;
    key = decision.keyState;
    (toggle)? init_animation(p1,p0,time_length,toggle) : (init_animation(0,Math.PI/4,1,toggle));}
  else if(keyboard.eventMatches(event," ")){ 
    jumpCut = !jumpCut; // toggle jump cut
  }
  else if(keyboard.eventMatches(event,"R")){ 
    reversible = !reversible; // toggle reversible
  }
  else if(keyboard.eventMatches(event,"A")){
    decision = actionManager("A"); 
    toggle = decision.toggle;
    key = decision.keyState;
    if (!toggle) {
      godzillaMode = true;
      numOfPlanes = Math.round(Math.random()*20) + 1;
      summonPlanes();
    } else {
      godzillaMode = false;
      cleanUpAndReset();
    }
    (toggle)? init_animation(p1,p0,time_length,toggle) : (init_animation(0,Math.PI/3,1,toggle));}
  else if(keyboard.eventMatches(event,"B")){
    decision = actionManager("B"); 
    toggle = decision.toggle;
    key = decision.keyState;
    (toggle)? init_animation(p1,p0,time_length,toggle) : (init_animation(0,Math.PI/3,1,toggle));}
  });

// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
function update() {
  updateBody();

  requestAnimationFrame(update);
  renderer.render(scene,camera);
}

update();