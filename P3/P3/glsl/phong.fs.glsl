varying vec3 interpolatedNormal;
varying vec3 vertexPosition;
uniform vec3 lightPosition;
uniform vec3 lightColorK;
uniform vec3 ambientColor;
uniform float shininess;

uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;

void main() {

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
	// V
	vec3 norm_v = normalize(-vertexPosition);

	// ===============================================================
	// reflect
	vec3 r = reflect(-norm_l, norm_n);

	// ===============================================================
	// R.V
	float rv = dot(r,norm_v);
	float clamp_rv = max(0.0, rv);
	float shine_rv = pow(clamp_rv, shininess);

	// ===============================================================
	// diff and specular 
	vec3 i_diff = clamp_nl * lightColorK;
	vec3 i_spec = shine_rv * lightColorK;

	// ===============================================================
	// interp color
	vec3 color = kAmbient * ambientColor + kDiffuse * i_diff + kSpecular * i_spec;


	gl_FragColor = vec4(color, 1.0);
}