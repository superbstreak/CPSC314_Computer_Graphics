varying vec3 interpolatedNormal;
varying vec3 vertexPosition;
uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 disffuseColor;
uniform vec3 specularColor;
uniform float shininess;

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
	// a dot product between the halfway vector between light and viewing direction, and the surface normal can be used
	vec3 r = normalize(norm_l + norm_v);

	// ===============================================================
	// R.V
	float rv = dot(r,norm_v);
	float clamp_rv = max(0.0, rv);
	float shine_rv = pow(clamp_rv, shininess);

	// ===============================================================
	// diff and specular 
	vec3 i_diff = clamp_nl * disffuseColor;
	vec3 i_spec = shine_rv * specularColor;

	// ===============================================================
	// interp color
	vec3 color = ambientColor + i_diff + i_spec;


	gl_FragColor = vec4(color, 1.0);
}