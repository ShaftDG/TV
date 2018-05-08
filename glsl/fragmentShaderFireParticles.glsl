precision highp float;
precision highp int;
uniform vec3 posParent;
uniform float time;
uniform vec3 color;
uniform sampler2D noiseTexture;
uniform int started;
varying vec3 vColor;
varying float vAlpha;
varying float vSpeedFactor;
varying float vAngleFactor;
varying float vSize;
varying vec3 vPos;

varying float vDistortFlameFactor;
varying float vDistortAlphaFactor;

vec2 hash( vec2 p )
{
	p = vec2( dot(p,vec2(127.1,311.7)),
			 dot(p,vec2(269.5,183.3)) );
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

/*vec2 hash( vec2 p )
{
    vec2 uv = vec2(gl_PointCoord.x, gl_PointCoord.y);
    p = vec2( dot(p,vec2(127.1,311.7)),
    			 dot(p,vec2(269.5,183.3)) );
	return -1.0 + 2.0*texture2D( noiseTexture, sin(p) ).rg;
}*/

float noise( in vec2 p )
{
	const float K1 = 0.366025404; // (sqrt(3)-1)/2;
	const float K2 = 0.211324865; // (3-sqrt(3))/6;

	vec2 i = floor( p + (p.x+p.y)*K1 );

	vec2 a = p - i + (i.x+i.y)*K2;
	vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
	vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0*K2;

	vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );

	vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));

	return dot( n, vec3(70.0) );
}

/*float fbm(vec2 uv)
{
	float f;
	mat2 m = mat2( 2.0,  1.2, -1.2,  2.0 );
	f  = 0.5000*noise( uv ); uv = m*uv;
	f += 0.2500*noise( uv ); uv = m*uv;
	f += 0.1250*noise( uv ); uv = m*uv;
	f += 0.0625*noise( uv ); uv = m*uv;
	f = 0.5 + 0.5*f;
	return f;
}*/

float fbm(vec2 uv)
{
	float f;
	mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
	f  = 0.5000*texture2D( noiseTexture, vec2(uv.x*vSpeedFactor + sin(time * 0.25)*vSpeedFactor, uv.y*0.525 + time * vSpeedFactor) ).r; uv = m*uv;
	f += 0.2500*texture2D( noiseTexture, vec2(uv.x*vSpeedFactor + sin(time * 0.25)*vSpeedFactor, uv.y*0.525 + time * vSpeedFactor) ).r; uv = m*uv;
	f += 0.1250*texture2D( noiseTexture, vec2(uv.x*vSpeedFactor + sin(time * 0.25)*vSpeedFactor, uv.y*0.525 + time * vSpeedFactor) ).r; uv = m*uv;
	f += 0.0625*texture2D( noiseTexture, vec2(uv.x*vSpeedFactor + sin(time * 0.25)*vSpeedFactor, uv.y*0.525 + time * vSpeedFactor) ).r; uv = m*uv;
	f = 0.5 + 0.5*f;
	return f;
}

float fbm2(vec2 uv)
{
	float f;
	mat2 m = mat2( 2.6,  1.2, -2.2,  1.6 );
	f  = 1.000*texture2D( noiseTexture, vec2(uv.x * 1.00 - sin(time * 0.15 * vSpeedFactor), uv.y * 0.80 - time * vSpeedFactor) * 1.0000).r; uv = m*uv;
    f += 0.500*texture2D( noiseTexture, vec2(uv.x * 0.25 - sin(time * 0.25 * vSpeedFactor), uv.y * 0.70 - time * vSpeedFactor) * 0.5000).r; uv = m*uv;
    f += 0.250*texture2D( noiseTexture, vec2(uv.x * 1.00 + sin(time * 0.15 * vSpeedFactor), uv.y * 0.80 - time * vSpeedFactor) * 0.2500).r; uv = m*uv;
    f += 0.125*texture2D( noiseTexture, vec2(uv.x * 0.25 + sin(time * 0.25 * vSpeedFactor), uv.y * 0.70 - time * vSpeedFactor) * 0.1250).r; uv = m*uv;
    f = 0.25 + 0.75*f;
	return f;
}
void main() {
    if (started == 0)
        discard;
    if (vAlpha <= 0.0)
        discard;


    gl_FragColor = vec4( color * vColor, 1.0 );

    float mid = 0.5;
    vec2 rotated = vec2(cos(/*time **/ vAngleFactor) * (gl_PointCoord.x - mid) + sin(/*time **/ vAngleFactor) * (gl_PointCoord.y - mid) + mid,
    cos(/*time **/ vAngleFactor) * (gl_PointCoord.y - mid) - sin(/*time **/ vAngleFactor) * (gl_PointCoord.x - mid) + mid);

    vec2 q = 1.0-vec2(rotated.x, rotated.y);
    vec2 uv = 1.0-vec2(rotated.x, rotated.y);
    float strength = floor(q.x+1.0);
	float T3 = max(3.,1.25*strength) * time * vSpeedFactor;
	float T3_a = max(3.,1.25*strength) * time * vSpeedFactor;
	q.x = q.x-0.5;
	q.y -= 0.4;
	//q.y -= 0.5;
	float n = fbm(strength * vec2(q.x * vDistortFlameFactor, q.y * vDistortFlameFactor * 0.95) - vec2(0.5,T3));
	float n2 = fbm2(strength * vec2(q.x * vDistortFlameFactor, q.y * vDistortFlameFactor * 0.95) - vec2(0.5,T3_a));
	float c = 1. - 16.0 * pow(
	                            //  max( 0.0, length(q*vec2(2.2+q.y*4.25,0.175)) - n * max( 0.35, q.y+.05 ) ),
	                            max( 0.0, length(q*vec2(1.4+q.y*2.25,0.875)) - n * max( 0.25, q.y+.25 ) ),
	                            1.0 //contrast
	                         );
	float c_a = 1. - 16.0 * pow(
    	                            max( 0.0, length(q*vec2(1.0+q.y*2.25,1.2)) - n2 * max( 0.0, q.y+.25 ) ),
    	                            1.2 //contrast
    	                         );
	float c1 = n * c * (1.5-pow(1.0*uv.y,2.0));
	float c2 = n2 * c_a * (1.5-pow(1.0*uv.y,2.0));
	c1=clamp(c1,0.,1.);
	c2=clamp(c2,0.,1.);
	vec3 col = vec3(c1*c1*c1*c1*c1*c1, 1.35*c1*c1*c1, 1.35*c1);
	vec3 col2 = vec3(c2*c2*c2*c2*c2*c2, 1.35*c2*c2*c2, 1.35*c2);

    float a = c2 * c1 / (pow(uv.y,-0.0005));
//float a = c2 * c1 * (1.0-pow(uv.y,3.0));
    gl_FragColor += vec4( (mix(vec3(0.0),col * col2,a) ), 1.0);
    gl_FragColor.a = mix(c2,  c1, gl_FragColor.g * gl_FragColor.r) * vAlpha * a;
}