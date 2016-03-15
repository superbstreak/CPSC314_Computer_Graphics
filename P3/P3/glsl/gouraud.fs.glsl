varying vec3 color;

void main() {
	// Setting for each pixel, pass in color
	gl_FragColor = vec4(color, 1.0);
}