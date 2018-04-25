precision highp float;
precision highp int;

uniform float time;
uniform vec3 color;
uniform float speedFactor;

uniform float start;
uniform float end;
uniform float alpha;

uniform sampler2D f_texture;
uniform sampler2D s_texture;
uniform sampler2D t_texture;

varying vec2 vUv;

varying vec3 fNormal;
varying vec3 fPosition;

/*#ifdef USE_GLITCH

#endif

#ifdef USE_HOLO

#endif*/

void main() {
 /*if(!gl_FrontFacing) {
       discard;
    }*/
       vec2 uv = vUv;

        vec4 texWide = texture2D(s_texture,vec2(gl_FragCoord.x*0.003, gl_FragCoord.y*0.003 - time*speedFactor));
        vec3 colorWide = vec3(
                                (texWide.r + texWide.g + texWide.b)/10.0,
                                (texWide.r + texWide.g + texWide.b)/3.0,
                                (texWide.r + texWide.g + texWide.b)/3.0
                             )*2.25;
        vec4 texPulse = texture2D(s_texture,vec2(gl_FragCoord.x*0.003, gl_FragCoord.y*0.000003 - time*speedFactor));
        vec3 colorPulse = vec3(
                                 (texPulse.r + texPulse.g + texPulse.b)/15.0,
                                 (texPulse.r + texPulse.g + texPulse.b)/3.0,
                                 (texPulse.r + texPulse.g + texPulse.b)/1.5
                              )*2.0;
        vec3 colorTotal = mix(colorWide, colorPulse, tan(time)*sin(time*0.025));

                vec3 normal = normalize( fNormal );
                vec3 eye = normalize( -fPosition.xyz );
                vec3 light = normalize( -fPosition.xyz + vec3(1.0,1.0,0.0) );
                float NdotE = dot( normal, eye );
                float NdotL = dot( normal, light );
                float rim = smoothstep( start, end, 1.0 -  NdotE);
                float spec = pow(NdotL, 8.0);
                float value = clamp( rim * alpha, 0.0, 0.8 ) + 0.2;
                value += smoothstep(spec, 0.0, 0.5);

                vec4 texNoise = texture2D(f_texture,vec2(gl_FragCoord.x*0.003, gl_FragCoord.y * 0.003 + time*speedFactor));
                vec3 colorNoise = vec3(
                                       (texNoise.r + texNoise.g + texNoise.b)/10.0,
                                       (texNoise.r + texNoise.g + texNoise.b)/3.0,
                                       (texNoise.r + texNoise.g + texNoise.b)/3.0
                                      );
                gl_FragColor = max(vec4( value ), vec4(max(colorNoise, colorTotal), value))*vec4(color, 1.0);
               /*  vec4 texNumbers = texture2D(t_texture,vec2(gl_FragCoord.x*0.003, gl_FragCoord.y * 0.003 + time*speedFactor));
                 vec3 colorNumbers = vec3(
                                         (texNumbers.r + texNumbers.g + texNumbers.b)/5.0,
                                         (texNumbers.r + texNumbers.g + texNumbers.b)/1.5,
                                         (texNumbers.r + texNumbers.g + texNumbers.b)/1.5
                                        );

                 gl_FragColor = max(gl_FragColor, vec4(colorNumbers*2.5, value));*/
                // gl_FragColor = vec4( colorNumbers, value );
#ifdef USE_SCANLINE

	      vec2 q = vUv;
          uv = 0.5 + (q-0.5)*(0.9 /*+ 0.1*sin(0.752*time)*/);

          vec3 oricol = gl_FragColor.rgb;
          vec3 col;

          col.r = gl_FragColor.r*1.15;
          col.g = gl_FragColor.g*1.15;
          col.b = gl_FragColor.b*1.15;

          col = clamp(col*0.5+0.5*col*col*1.2,0.0,1.0);

          col *= 0.5 + 0.5*16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y);

          col *= vec3(0.95,1.05,0.95);

          col *= 0.9+0.1*( sin(10.0*time+uv.y*1000.0) + cos(10.0*time+uv.y*1000.0) );

          col *= 0.99+0.01*sin(11.0*time);

          col = mix( col, oricol, clamp(-2.0+2.0*q.x,0.0,1.0) );

          gl_FragColor *= vec4(col*1.5,1.0);

#endif

/*#ifdef USE_GLITCH

#endif*/

#ifdef USE_OFF
       gl_FragColor *= 1.2;
      // gl_FragColor.a = max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b));
#endif

/*#ifdef USE_HOLO

#endif

#ifdef USE_3D

#endif*/

   // gl_FragColor.a = max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b));
   /* gl_FragColor = mix(
                            gl_FragColor,
                            vec4(colorBorderDisplay, 1.0),
                            alpha
                          );*/
}