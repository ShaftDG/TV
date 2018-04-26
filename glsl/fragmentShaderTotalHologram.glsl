precision highp float;
precision highp int;

uniform vec3 color;
uniform float time;
uniform float rateFactor;
uniform vec3 colorBorderDisplay;
uniform sampler2D f_texture;
uniform sampler2D s_texture;
uniform sampler2D noise_texture;

varying vec2 vUv;

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

    //based on Mario scan line:

    vec3 Scanline(vec3 color, vec2 uv)
    {
       float scanline    = clamp( 0.95 + 0.05 * cos( 3.14 * ( uv.y + 0.008 * time ) * 240.0 * 1.0 ), 0.0, 1.0 );
     // float grille    = 0.85 + 0.15 * clamp( 1.5 * cos( 3.14 * uv.x * 640.0 * 1.0 ), 0.0, 1.0 );
       return color * scanline /** grille * 1.2*/;
    }

    //from tv flickering: https://www.shadertoy.com/view/4tSGzy

    /*float randHolo(vec2 seed) {

        float dotResult = dot(seed.xy, vec2(12.9898,78.233));
        float sin = sin(dotResult) * 43758.5453;
        return fract(sin);
    }*/

    //mine:

    vec3 makeBlue(vec3 i)
    {
        return vec3((i.r + i.g + i.b)/color.x, (i.r + i.g + i.b)/color.y, (i.r + i.g + i.b)/color.z);
    }

    vec3 edgeSample(vec2 uv)
    {
      vec3 c = texture2D( f_texture, vec2(uv.x, 1.0-uv.y) ).rgb;
      #ifdef USE_OFF_SYMB
         c = vec3(0.0);
      #endif
      //vec4 newcolor = texture2D(s_texture, vec2(uv.x, uv.y - time)  );
      vec4 newcolor = vec4(0.0);

      float incrustation = chromaKey(c);
      c = max(mix(c, vec3(0.0), incrustation)*1.2, newcolor.rgb*0.8);
      return c;
    }

#endif

void main() {
    
vec2 uv = vUv;

vec4 colorMain = texture2D(f_texture, uv);

gl_FragColor = colorMain;

#ifdef USE_HOLO
       uv = vec2(vUv.x, vUv.y);
        
       //Invert for video
       uv = vec2(uv.x,1.0-uv.y);
        
       vec3 c = vec3(0.0);
       
       c += Scanline(edgeSample(uv)*0.75, uv);
      //  c += edgeSample(uv)*0.75;

       vec4 colorHolo = vec4(makeBlue(c), 1.0);

       colorHolo.a = max(colorHolo.r, max(colorHolo.g, colorHolo.b));

       gl_FragColor = mix(colorMain*(2.0 - clamp(rateFactor*2.0/colorHolo.a, 0.0, 1.0)), colorHolo, clamp(rateFactor/colorHolo.a, 0.0, 1.0));

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

          col *= 0.9+0.01*( sin(sin(10.0*time)+uv.y*100.0) - cos(cos(10.0*time)+uv.y*100.0) );
          //col *= 0.9+0.01*( sin(10.0*time+uv.y*100.0) - cos(10.0*time+uv.y*100.0) );

          col *= 0.99+0.01*sin(11.0*time);

          col = mix( col, oricol, clamp(-2.0+2.0*q.x,0.0,1.0) );

          gl_FragColor = vec4(col,1.0);

#endif
gl_FragColor.a = max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b));
/*    gl_FragColor = mix(
                            gl_FragColor,
                            vec4(colorBorderDisplay, 1.0),
                            alpha
                          );*/
}