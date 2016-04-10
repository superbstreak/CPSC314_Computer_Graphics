uniform vec3 glowColor;
void main() 
{
	vec3 glow = glowColor * 0.35;
    gl_FragColor = vec4( glow, 1.0 );
}