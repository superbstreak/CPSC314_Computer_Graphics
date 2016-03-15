varying vec3 gcolor;

void main() {

	// Setting Each Pixel To Red
	// gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
	gl_FragColor = vec4(gcolor, 1.0);
}