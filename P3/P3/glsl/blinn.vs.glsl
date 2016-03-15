// varying vec3 interpolatedNormal;
varying vec3 gcolor;

// unifrom vec3 lightColor;
// uniform vec3 ambientColor;
// uniform vec3 lightPosition;

void main(){
	

	gcolor = vec3(1.0, 0.0, 0.0);

	// Transforming The Vertex
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}