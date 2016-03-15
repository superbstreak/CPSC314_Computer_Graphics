varying vec3 interpolatedNormal;
varying vec3 vertexPosition;
uniform vec3 lightPosition;
uniform vec3 litColor;
uniform vec3 unLitColor;
uniform float outlineColor;
uniform vec3 ambientColor;
uniform vec3 disffuseColor;
uniform vec3 specularColor;
uniform float shininess;


void main(){
	
	// ===============================================================
	// N
	vec3 norm_n = normalize(interpolatedNormal);

	// ===============================================================
	// L = norm L - P
	vec3 norm_l = normalize(lightPosition - vertexPosition);

	// ===============================================================
	// N.L
	float nl = dot(norm_n, norm_l);
	float clamp_nl = max(0.0, nl); // clamp

	// ===============================================================
	// Kw = (1 + N.L)/2
	float kw = (1.0 + clamp_nl)/2.0;

	// ===============================================================
	// c = KwCw + (1− Kw )Cc
	vec3 color = kw*litColor + (1.0 - kw)*unLitColor;
	
    gl_FragColor = vec4(color, 1.0);
}