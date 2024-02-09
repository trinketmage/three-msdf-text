import { Color, Vector2, GLSL3, ShaderMaterial, UniformsUtils } from 'three';
const GlyphShader = {

	name: 'Glyph',

	glslVersion: GLSL3,

	transparent: true,
	depthTest: false,
	defines: {},

	uniforms: {
		map: { value: null },
		color: { type: "c", value: new Color(0xece9e3) },
	},

	vertexShader: /* glsl */`
		#define MSDFText

		in vec2 uv;
		in vec2 guv;
		in vec4 position;
		uniform mat4 projectionMatrix;
		uniform mat4 modelViewMatrix;
		out vec2 vUv;
		out vec2 vGuv;
		
		void main() {
			vUv = uv;
			vGuv = guv;
			gl_Position = projectionMatrix * modelViewMatrix * position;
		}
	`,

	fragmentShader: /* glsl */`
		#define MSDFText
		
		precision highp float;

		uniform vec3 color;
		uniform sampler2D map;
		in vec2 vUv;
		in vec2 vGuv;
		out vec4 myOutputColor;

		float median(float r, float g, float b) {
			return max(min(r, g), min(max(r, g), b));
		}

		void main() {
			vec3 s = texture(map, vGuv).rgb;
			float sigDist = median(s.r, s.g, s.b) - 0.5;
			float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);;

			myOutputColor = vec4(color, alpha);
		}
	`

};

class GlyphMaterial extends ShaderMaterial {
	
	constructor( parameters ) {
		GlyphShader.uniforms = UniformsUtils.merge( [
			GlyphShader.uniforms,
			parameters.uniforms,
		]);

		super(GlyphShader);

		this.isRawShaderMaterial = true;

		this.type = 'GlyphMaterial';
	}
	
}

export { GlyphMaterial, GlyphShader };
