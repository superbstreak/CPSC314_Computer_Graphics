varying vec3 interpolatedNormal;
varying vec3 vertexPosition;
uniform vec3 lightPosition;
uniform vec3 lightColorK;
uniform vec3 ambientColor;
uniform float shininess;

uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;

void main(){
	
	// ===============================================================
	// VP
	vec4 pos_temp = modelViewMatrix * vec4(position, 1.0);
	vertexPosition = vec3(pos_temp)/pos_temp.w;


	// ===============================================================
	// N
	interpolatedNormal = normalMatrix * normal;


	// ===============================================================
	// required
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}