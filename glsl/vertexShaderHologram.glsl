precision highp float;
varying vec3 fNormal;
varying vec3 fPosition;

varying vec2 vUv;
			void main()
			{
				vUv = uv;
				fNormal = normalize(normalMatrix * normal);
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				fPosition = mvPosition.xyz;
				gl_Position = projectionMatrix * mvPosition;
			}