varying vec3 interpolatedNormal;
varying vec3 color;
uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 disffuseColor;
uniform vec3 specularColor;
uniform float shininess;


void main() {
	
	// ===============================================================
	// VP
	vec4 pos_temp = modelViewMatrix * vec4(position, 1.0);
	vec3 vp = vec3(pos_temp)/pos_temp.w;

	// ===============================================================
	// N
	vec3 n = normalMatrix * normal;
	vec3 norm_n = normalize(n);

	// ===============================================================
	// L = norm L - P
	vec3 norm_l = normalize(lightPosition - vp);

	// ===============================================================
	// N.L
	float nl = dot(norm_n, norm_l);
	float clamp_nl = max(0.0, nl); // clamp

	// ===============================================================
	// V
	vec3 norm_v = normalize(-vp);

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
	vec3 i_diff = clamp_nl * disffuseColor;
	vec3 i_spec = shine_rv * specularColor;

	// ===============================================================
	// interp color
	color = ambientColor + i_diff + i_spec;

	// ===============================================================
	// required
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}