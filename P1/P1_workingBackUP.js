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

var numberOfTentical = 9;
var numberOfClaws = 5;
var tentLAngleX = [-40,-30,-20,-10,0,10,20,30,40];
var tentLAngleY = [0,10,20,30,40,30,20,10,0];
var tentRAngleX = [40,30,20,10,0,-10,-20,-30,-40];
var tentRAngleY = [0,-10,-20,-30,-40,-30,-20,-10,0];

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

// ===============================================================================
// Custom Functions
// ===============================================================================

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

function translation(x,y,z) {
  return new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1);
}

function scale(x,y,z) {
  return new THREE.Matrix4().set(x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1);
}

function mulMatrix(matrix,app) {
  return new THREE.Matrix4().multiplyMatrices(matrix,app);
}

// matrix population
function populateClawsMatrix(startX, fixedY, fixedZ, spacing) {
  var claws = [];
  for (i=0; i<numberOfClaws; i++) {
    claws.push(new THREE.Matrix4().set(1,0,0,startX+spacing*i, 0,1,0,fixedY, 0,0,1,fixedZ, 0,0,0,1));
  }
  return claws;
}

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

// Geometry population
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

function populateClaw(clawGeo) {
  var claws = [];
  for (i=0; i<numberOfClaws; i++) {
    claws.push(new THREE.Mesh(clawGeo,normalMaterial));
  }
  return claws;
}

// set matrix
function setToRELMatrix(bodyPart, matrix, relativeTo, length) {
  for (i = 0; i<length; i++) {
    bodyPart[i].setMatrix(mulMatrix(relativeTo,matrix[i]));
  }
}

// add list to scene
function addListToScene(list) {
   if (list) {
    var len = list.length;
    for (i = 0; i < len; i++) {
      scene.add(list[i]);
    }
   }
}

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

function performTorsoRotation(p) {
  var rotateZ = rotation(1,p, false);
  xmatrixTorso = mulMatrix(matrixTorso,rotateZ); 
}

function performHeadRotation(p) {
  var rotate = rotation(2,p, false);
  xmatrixHead = mulMatrix(matrixHead,rotate);
}

function performTailRotation(p) {
  var rotate = rotation(2,p/2, false);
  xmatrixTail = mulMatrix(matrixTail, rotate);
}

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

// var matrixHeadREL = mulMatrix(matrixTorso, matrixHead);
// var matrixTailREL = mulMatrix(matrixTorso, matrixTail);
// var matrixNoseREL = mulMatrix(matrixHeadREL, matrixNose);
// var matrixFrontLegLeftREL = mulMatrix(matrixTorso, matrixFrontLegLeft);
// var matrixFrontLegRightREL = mulMatrix(matrixTorso, matrixFrontLegRight);
// var matrixBackLegLeftREL = mulMatrix(matrixTorso,matrixBackLegLeft);
// var matrixBackLegRightREL = mulMatrix(matrixTorso,matrixBackLegRight);

// torso.setMatrix(matrixTorso);
// head.setMatrix(matrixHeadREL);
// tail.setMatrix(matrixTailREL);
// nose.setMatrix(matrixNoseREL);
// frontLegL.setMatrix(matrixFrontLegLeftREL);
// frontLegR.setMatrix(matrixFrontLegRightREL);
// backLegL.setMatrix(matrixBackLegLeftREL);
// backLegR.setMatrix(matrixBackLegRightREL);

// setToRELMatrix(frontClawsL, matrixClawFrontLeft, matrixFrontLegLeftREL, numberOfClaws);
// setToRELMatrix(frontClawsR, matrixClawFrontRight, matrixFrontLegRightREL, numberOfClaws);
// setToRELMatrix(backClawsL, matrixClawBackLeft, matrixBackLegLeftREL, numberOfClaws);
// setToRELMatrix(backClawsR, matrixClawBackRight, matrixBackLegRightREL, numberOfClaws);

// setToRELMatrix(tentL,matrixTentLeft,matrixNoseREL,numberOfTentical);
// setToRELMatrix(tentR,matrixTentRight,matrixNoseREL,numberOfTentical);

// var matrixTentSmallLeftUpperREL = mulMatrix(matrixNoseREL, matrixTentSmallLeftUpper);
// var matrixTentSmallLeftLowerREL = mulMatrix(matrixNoseREL, matrixTentSmallLeftLower);
// tentSmallLU.setMatrix(matrixTentSmallLeftUpperREL);
// tentSmallLD.setMatrix(matrixTentSmallLeftLowerREL);

// var matrixTentSmallRightUpperREL = mulMatrix(matrixNoseREL, matrixTentSmallRightUpper);
// var matrixTentSmallRightLowerREL = mulMatrix(matrixNoseREL, matrixTentSmallRightLower);
// tentSmallRU.setMatrix(matrixTentSmallRightUpperREL);
// tentSmallRD.setMatrix(matrixTentSmallRightLowerREL);
drawMole();
addToScene();

// TO-DO: PUT TOGETHER THE REST OF YOUR STAR-NOSED MOLE AND ADD TO THE SCENE!
// Hint: Hint: Add one piece of geometry at a time, then implement the motion for that part. 
//             Then you can make sure your hierarchy still works properly after each step.



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
var jumpCut = true;

// function init_animation()
// Initializes parameters and sets animate flag to true.
// Input: start position or angle, end position or angle, and total time of animation.
function init_animation(p_start,p_end,t_length){
  p0 = p_start;
  p1 = p_end;
  time_length = t_length;
  time_start = clock.getElapsedTime();
  time_end = time_start + time_length;
  animate = true; // flag for animation
  return;
}

function updateBody() {
  switch(true)
  {
      case((key == "U" || key == "E") && animate):
        var time = clock.getElapsedTime(); // t seconds passed since the clock started.
        if (time > time_end){
          p = p1;
          animate = false;
          break;
        } 
        p = (jumpCut)? p1 : ((p1 - p0)*((time-time_start)/time_length) + p0); // current frame
        performTorsoRotation((key ==  "U")? -p : p);
      break;
      case ((key == "H" || key == "G") && animate):
        var time = clock.getElapsedTime(); // t seconds passed since the clock started.
        if (time > time_end){
          p = p1;
          animate = false;
          break;
        } 
        p = (jumpCut)? p1 : ((p1 - p0)*((time-time_start)/time_length) + p0); // current frame 
        performHeadRotation((key ==  "H")? -p : p);
      break;
      case ((key == "T" || key == "V") && animate):
        var time = clock.getElapsedTime(); // t seconds passed since the clock started.
        if (time > time_end){
          p = p1;
          animate = false;
          break;
        } 
        p = (jumpCut)? p1 : ((p1 - p0)*((time-time_start)/time_length) + p0); // current frame
        performTailRotation((key ==  "V")? -p : p);
      break;
      case ((key == "N") && animate):
        var time = clock.getElapsedTime(); // t seconds passed since the clock started.
        if (time > time_end){
          p = p1;
          animate = false;
          break;
        } 
        p = (jumpCut)? p1 : ((p1 - p0)*((time-time_start)/time_length) + p0); // current frame
        performFanOut(p);
      break;
      case ((key == "S") && animate):
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
      case ((key == "D") && animate):
        var time = clock.getElapsedTime(); // t seconds passed since the clock started.
        if (time > time_end){
          p = p1;
          animate = false;
          break;
        } 
        p = (jumpCut)? p1 : ((p1 - p0)*((time-time_start)/time_length) + p0); // current frame
        performDig(p);
      break;
    default:
      break;
  }
  drawMole();
}

// LISTEN TO KEYBOARD
// Hint: Pay careful attention to how the keys already specified work!
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
var key;
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
    (key == "U")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "U")}  
  else if(keyboard.eventMatches(event,"E")){ 
    (key == "E")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "E");} 
  else if(keyboard.eventMatches(event,"H")){ 
    (key == "H")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "H");}
  else if(keyboard.eventMatches(event,"G")){ 
    (key == "G")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "G");}
  else if(keyboard.eventMatches(event,"T")){ 
    (key == "T")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "T");}
  else if(keyboard.eventMatches(event,"V")){ 
    (key == "V")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "V");}
  else if(keyboard.eventMatches(event,"N")){ 
    (key == "N")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "N");}
  else if(keyboard.eventMatches(event,"S")){
        if (swimCounter < 2) {
          (init_animation(0,Math.PI/4,1), key="S");
          swimCounter += 1;
        } else {
          (init_animation(p1,p0,time_length), key="S");
          swimCounter = 0;
        }
  }
  else if(keyboard.eventMatches(event,"D")){ 
    (key == "D")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "D");}
  else if(keyboard.eventMatches(event," ")){ 
    jumpCut = !jumpCut;
  }
  });

// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
function update() {
  updateBody();

  requestAnimationFrame(update);
  renderer.render(scene,camera);
}

update();