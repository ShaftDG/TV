function ExplodeParticlesShader()
{
}

ExplodeParticlesShader.getShader = function()
{	
	var shader = {

        uniforms: {
            color:     { value: null },
            texture:   { value: null },
            deltatime: { value: 1.0 },
            started:   { value: 0 },
        },

		vertexShader: [
    "precision highp float;",
    "precision highp int;",
	"attribute float size;",
    "attribute vec3 customColor;",
    "attribute float customAlpha;",

    "varying vec3 vColor;",
    "varying float vAlpha;",

    "void main() {",

    "vColor = customColor;",
    "vAlpha = customAlpha;",
    "vec3 pos = position;",
    "vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",

    "gl_PointSize = size * ( 300.0 / -mvPosition.z );",

    "gl_Position = projectionMatrix * mvPosition;",


"}"

		].join( "\n" ),
		
		fragmentShader: [
            "precision highp float;",
            "precision highp int;",
            "uniform vec3 color;",
            "uniform sampler2D texture;",
            "uniform int started;",
            "uniform float deltatime;",
            "varying vec3 vColor;",
            "varying float vAlpha;",

    "void main() {",
            "if (started == 0)",
            "discard;",
            "if (vAlpha <= 0.0)",
            "discard;",

             "gl_FragColor = vec4( color * vColor, 1.0 );",

    "float mid = 0.5;",
    "vec2 rotated = vec2(cos(deltatime) * (gl_PointCoord.x - mid) + sin(deltatime) * (gl_PointCoord.y - mid) + mid,",
    "cos(deltatime) * (gl_PointCoord.y - mid) - sin(deltatime) * (gl_PointCoord.x - mid) + mid);",

           "gl_FragColor = gl_FragColor * texture2D( texture, rotated);",

     "gl_FragColor.a = gl_FragColor.a * vAlpha;",

"}"
		].join( "\n" )
	
	};

return shader;

};
