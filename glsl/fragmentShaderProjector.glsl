uniform float time;
uniform float rayAngleSpread;
uniform float rayDistanceSpread;
uniform float rayBrightness;
uniform vec3 rayColor;

varying vec2 vUv;

//normalized sin
float sinn(float x)
{
	return sin(x)/2.+.5;
}

float CausticPatternFn(vec2 pos)
{
	return (sin(pos.x*60.+time)
		+pow(sin(-pos.x*130.+time),1.)
		+pow(sin(pos.x*30.+time),2.)
		+pow(sin(pos.x*50.+time),2.)
		+pow(sin(pos.x*80.+time),2.)
		+pow(sin(pos.x*90.+time),2.)
		+pow(sin(pos.x*12.+time),2.)
		+pow(sin(pos.x*6.+time),2.)
		+pow(sin(-pos.x*13.+time),5.))/2.;
}

vec2 CausticDistortDomainFn(vec2 pos)
{
	pos.x*=(pos.y * rayAngleSpread * 0.1 + 1.0);
	return pos;
}

void main( void )
{
	vec2 pos = vUv;
	pos-=0.5;
	vec2  CausticDistortedDomain = CausticDistortDomainFn(pos);
	float CausticShape = clamp(rayDistanceSpread-length(CausticDistortedDomain.x*20.),0.,1.);
	float CausticPattern = rayBrightness * CausticPatternFn(CausticDistortedDomain);
	float Caustic = CausticShape*CausticPattern;
	float f = (1.+(pos.y+.5)/4.*Caustic)/1.;
	
	
	gl_FragColor = vec4( vec3(0.1*f) * rayColor, 1.0 );
	gl_FragColor.a = max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b));
}