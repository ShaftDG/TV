precision highp float;
precision highp int;

uniform float time;
uniform float timeRotate;
uniform float rateFactor;
uniform float speedFactor;
uniform vec3 colorBorderDisplay;
//uniform vec3 colorClampColor;
uniform sampler2D arrayTexture[NUMSYMB];
uniform sampler2D f_texture;
uniform sampler2D s_texture;
uniform sampler2D noise_texture;

varying vec2 vUv;

/*#ifdef USE_GLITCH
   // uniform sampler2D noise_texture;
   float rand(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) * 2.0 - 1.0;
      *//* float r = max(
                        texture2D(noise_texture,  vec2(co.x, co.y + time)).r,
                        max(
                                texture2D(noise_texture, vec2(co.x, co.y + time)).g,
                                texture2D(noise_texture, vec2(co.x, co.y + time)).b
                            )
                     );
       return r;*//*
   }

   float offset(float blocks, vec2 uv) {
   	return rand(vec2(uv.x, floor(uv.y * blocks)));
   }
#endif*/

#ifdef USE_HOLO
    vec3 rgb2hsv(vec3 rgb)
    {
    	float Cmax = max(rgb.r, max(rgb.g, rgb.b));
    	float Cmin = min(rgb.r, min(rgb.g, rgb.b));
        float delta = Cmax - Cmin;

    	vec3 hsv = vec3(0., 0., Cmax);

    	if (Cmax > Cmin)
    	{
    		hsv.y = delta / Cmax;

    		if (rgb.r == Cmax)
    			hsv.x = (rgb.g - rgb.b) / delta;
    		else
    		{
    			if (rgb.g == Cmax)
    				hsv.x = 2. + (rgb.b - rgb.r) / delta;
    			else
    				hsv.x = 4. + (rgb.r - rgb.g) / delta;
    		}
    		hsv.x = fract(hsv.x / 6.);
    	}
    	return hsv;
    }

    float chromaKey(vec3 color)
    {
    	vec3 backgroundColor = vec3(0.157, 0.576, 0.129);
    	vec3 weights = vec3(4., 1., 2.);

    	vec3 hsv = rgb2hsv(color);
    	vec3 target = rgb2hsv(backgroundColor);
    	float dist = length(weights * (target - hsv));
    	return 1. - clamp(3. * dist - 1.5, 0., 1.);
    }

    vec3 Scanline(vec3 color, vec2 uv)
    {
       float scanline    = clamp( 0.95 + 0.05 * cos( 3.14 * ( uv.y + 0.008 * time ) * 240.0 * 1.0 ), 0.0, 1.0 );
       float grille    = 0.85 + 0.15 * clamp( 1.5 * cos( 3.14 * uv.x * 640.0 * 1.0 ), 0.0, 1.0 );
       return color * scanline * grille * 1.2;
    }

    vec3 makeBlue(vec3 i)
    {
        return vec3((i.r + i.g + i.b)/10.0, (i.r + i.g + i.b)/3.0, (i.r + i.g + i.b)/3.0);
    }

    vec3 edgeSample(vec2 uv)
    {
      vec3 c = texture2D( arrayTexture[INDEX_TEXTURE], vec2(uv.x, 1.0-uv.y) ).rgb;
      #ifdef USE_OFF_SYMB
         c = vec3(0.0);
      #endif
      vec4 newcolor = texture2D(f_texture, vec2(uv.x, uv.y - time)  );

      float incrustation = chromaKey(c);
      c = max(mix(c, vec3(0.0), incrustation)*1.2, newcolor.rgb*0.8);
      return c;
    }

#endif

void main() {
    
    vec2 uv = vUv;

    float t = timeRotate * speedFactor;
    
    float checkerboard = mod(floor(uv.y + t), 2.0);

//border display
    uv = abs( ( vUv - 0.5 ) * 2.0 );

float edgeWidthleftRight = 0.045;
float edgeWidthupDown = 0.06;
float sharpness = 100.0;

    float leftRight = clamp( ( uv.x - ( 1.0 - edgeWidthleftRight ) ) * sharpness, 0.0, 1.0 );
    float upDown = clamp( ( uv.y - ( 1.0 - edgeWidthupDown ) ) * sharpness, 0.0, 1.0 );
    float alpha = clamp( leftRight + upDown, 0.0, 1.0 );

//gl_FragColor
vec4 colorBack = vec4(1.0);
vec4 colorMain = texture2D(arrayTexture[INDEX_TEXTURE], vec2(vUv.x, vUv.y + t));
vec4 colorSecond = texture2D(arrayTexture[INDEX_TEXTURE >= 7 ? 0 : INDEX_TEXTURE + 1], vec2(vUv.x, vUv.y + t));

#ifdef USE_ROTATE
float f = sin(t*2.0);
if (f >= -1.0 && f <= -0.75) {
        colorMain = texture2D(arrayTexture[7], vec2(vUv.x, vUv.y + t));
        colorSecond = texture2D(arrayTexture[0], vec2(vUv.x, vUv.y + t));
} else if (f >= -0.75 && f < -0.5) {
    colorMain = texture2D(arrayTexture[6], vec2(vUv.x, vUv.y + t));
    colorSecond = texture2D(arrayTexture[1], vec2(vUv.x, vUv.y + t));
} else if (f >= -0.5 && f < -0.25) {
    colorMain = texture2D(arrayTexture[5], vec2(vUv.x, vUv.y + t));
    colorSecond = texture2D(arrayTexture[2], vec2(vUv.x, vUv.y + t));
} else if (f >= -0.25 && f < 0.0) {
    colorMain = texture2D(arrayTexture[4], vec2(vUv.x, vUv.y + t));
    colorSecond = texture2D(arrayTexture[3], vec2(vUv.x, vUv.y + t));
} else if (f >= 0.0 && f < 0.25) {
    colorMain = texture2D(arrayTexture[3], vec2(vUv.x, vUv.y + t));
    colorSecond = texture2D(arrayTexture[4], vec2(vUv.x, vUv.y + t));
} else if (f >= 0.25 && f < 0.5) {
    colorMain = texture2D(arrayTexture[2], vec2(vUv.x, vUv.y + t));
    colorSecond = texture2D(arrayTexture[5], vec2(vUv.x, vUv.y + t));
} else if (f >= 0.5 && f < 0.75) {
    colorMain = texture2D(arrayTexture[1], vec2(vUv.x, vUv.y + t));
    colorSecond = texture2D(arrayTexture[6], vec2(vUv.x, vUv.y + t));
} else if (f >= 0.75 && f <= 1.0) {
    colorMain = texture2D(arrayTexture[0], vec2(vUv.x, vUv.y + t));
    colorSecond = texture2D(arrayTexture[7], vec2(vUv.x, vUv.y + t));
} else {
       colorMain = texture2D(arrayTexture[7], vec2(vUv.x, vUv.y + t));
       colorSecond = texture2D(arrayTexture[0], vec2(vUv.x, vUv.y + t));
}
#endif

vec4 colorTotal =  mix( colorMain,
                        colorSecond,
                        checkerboard
                      );
vec4 mixBack = mix( colorBack,
                    colorTotal,
                    colorTotal.a
                  );

gl_FragColor = mixBack;

/*#ifdef USE_GLITCH
       *//* uv = vUv;

       	gl_FragColor.r += offset(2.0, uv) * 0.2;
       	gl_FragColor.g += offset(2.0, uv) * 0.2 * 0.16666666;
       	gl_FragColor.b += offset(2.0, uv) * 0.2;
       	gl_FragColor.r = min( gl_FragColor.r, texture2D(noise_texture, uv*2.0 + vec2(offset(128.0, uv) * 0.73, 0.0)).r);
        gl_FragColor.g = min( gl_FragColor.g, texture2D(noise_texture, uv*2.0 + vec2(offset(64.0, uv) * 0.73 * 0.16666666, 0.0)).g);
        gl_FragColor.b = min( gl_FragColor.b, texture2D(noise_texture, uv*2.0 + vec2(offset(64.0, uv) * 0.73, 0.0)).b);
        gl_FragColor *= 1.2;*//*
#endif

#ifdef USE_OFF
       gl_FragColor *= 0.9;
      // gl_FragColor.a = max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b));
#endif*/

#ifdef USE_HOLO
       uv = vec2(vUv.x, vUv.y);
        
       //Invert for video
       uv = vec2(uv.x,1.0-uv.y);
        
       vec3 c = vec3(0.0);
       
       c += Scanline(edgeSample(uv)*1.5, uv);

       vec4 colorHolo = vec4(makeBlue(c), 1.0);

       colorHolo.a = max(colorHolo.r, max(colorHolo.g, colorHolo.b));

       gl_FragColor = mix(mixBack*(3.0 - clamp(rateFactor*2.0/colorHolo.a, 0.0, 1.0)), colorHolo, clamp(rateFactor/colorHolo.a, 0.0, 1.0));

#endif

#ifdef USE_SCANLINE

	      vec2 q = vUv;
          uv = 0.5 + (q-0.5)*(0.75 /*+ 0.1*sin(0.752*time)*/);

          vec3 oricol = gl_FragColor.rgb;
          vec3 col;

          col.r = gl_FragColor.r*1.15;
          col.g = gl_FragColor.g*1.15;
          col.b = gl_FragColor.b*1.15;

          col = clamp(col*0.5+0.5*col*col*1.2,0.0,1.0);

          col *= 0.5 + 0.5*16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y);

          col *= vec3(0.95,1.05,0.95);

          col *= 0.9+0.1*( sin(10.0*time+uv.y*500.0) + cos(10.0*time+uv.y*500.0) );

          col *= 0.99+0.01*sin(11.0*time);

          col = mix( col, oricol, clamp(-2.0+2.0*q.x,0.0,1.0) );

          gl_FragColor = vec4(col,1.0);

#endif

   // gl_FragColor.a = max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b));

    gl_FragColor = mix(
                            gl_FragColor,
                            vec4(colorBorderDisplay, 1.0),
                            alpha
                          );
}