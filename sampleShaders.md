# Sample Shaders
A collection of sample and test shaders for debugging/demo
## Clock Test Shader
flashes red for .5 seconds before switching to blue
```glsl
uniform float uTime;   // This is the variable we are testing

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    // 1. Define a small time threshold (0.5 seconds)
    float resetThreshold = 0.5;
    
    // 2. Check if uTime is less than the threshold
    if (uTime < resetThreshold) {
        // If true, we just started or reset the clock. Flash RED!
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Bright Red
    } else {
        // If false, the clock is running normally. Show BLUE.
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0); // Blue
    }
}
```

## Animated Purple Waves
moves animated purple waves across the screen
```glsl
// A fragment shader for a simple animated effect
uniform float uTime;
vec3 pinkColor = vec3(0.7,0.2,0.6); //pinkish color

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // Normalize UV coordinates to the 0-1 range
  vec2 uv = vUv;

  // Simple wave effect using sine of time and position
  float wave = sin(uv.x * 20.0 + uTime * 2.0) * 0.1 + 0.1;

  // Use the wave effect to perturb the color
  vec3 color = mix(pinkColor, vec3(0.0, 0.0, 1.0), wave * 5.0); // Blend with blue

  // Final color output
  gl_FragColor = vec4(color, 1.0);
}
```

## New 4 Corner Gradient
standard 4 corner gradient (defualt preview shader)
```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = vUv;
    
    // 1. Define the four corner colors *inside* the shader function (hardcoded)
    
    // Top-Left (TL): Red-Purple (0.9, 0.1, 0.5)
    vec3 colorTL = vec3(0.9, 0.1, 0.5); 
    
    // Top-Right (TR): Green (0.1, 0.8, 0.3)
    vec3 colorTR = vec3(0.1, 0.8, 0.3); 
    
    // Bottom-Left (BL): Blue (0.0, 0.5, 0.9)
    vec3 colorBL = vec3(0.0, 0.5, 0.9); 
    
    // Bottom-Right (BR): Yellow (0.9, 0.9, 0.1)
    vec3 colorBR = vec3(0.9, 0.9, 0.1); 
    
    
    // 2. Calculate the blend factors (identical to the uniform version)
    
    // Horizontal (x) blending:
    float blendX_L = 1.0 - uv.x;
    float blendX_R = uv.x;
    
    // Vertical (y) blending:
    float blendY_B = 1.0 - uv.y;
    float blendY_T = uv.y;
    
    
    // 3. Bilinear Interpolation (Blending)
    
    // Blend the hardcoded colors along the X-axis:
    
    // TOP Edge Blending: (blends TL and TR based on blendX_R)
    vec3 topColor = mix(colorTL, colorTR, blendX_R);
    
    // BOTTOM Edge Blending: (blends BL and BR based on blendX_R)
    vec3 bottomColor = mix(colorBL, colorBR, blendX_R);
    
    
    // Final blending along the Y-axis:
    
    // FINAL COLOR: blends bottomColor and topColor based on blendY_T
    vec3 finalColor = mix(bottomColor, topColor, blendY_T);
    
    
    // 4. Output the final color
    fragColor = vec4(finalColor, 1.0);
}
```

## 3D grid

```glsl
//Adapted from https://www.shadertoy.com/view/MtsGzB by aiekick

uniform vec2 uResolution;
uniform vec4 uDate;

// matrix op
mat3 getRotYMat(float a){return mat3(cos(a),0.,sin(a),0.,1.,0.,-sin(a),0.,cos(a));}

void main() 
{
    vec2 s = uResolution.xy;
    float t = uDate.w * .2, c, d, m;
    
    vec3 p = vec3((2. * gl_FragCoord.xy - s) / s.x, 1.), r = p - p, q = r;
    
    p *= getRotYMat(-t);
    q.zx += 10. + vec2(sin(t), cos(t)) * 3.;
    
    for (float i = 1.; i > 0.; i -= .01) {
        c = d = 0., m = 1.;
        for (int j = 0; j < 3; j++)
            r = max(r *= r *= r *= r = mod(q * m + 1., 2.) - 1., r.yzx),
            d = max(d, (.29 - length(r) * .6) / m) * .8,
            m *= 1.1;

        q += p * d;
        c = i;
        
        if(d < 1e-5) break;
    }
    
    float k = dot(r, r + .15);
    
    gl_FragColor = vec4(vec3(1., k, k / c) - .8, 1.0);
}
```

## Moon Surface (incomplete port)
Surface of the moon adapted from shadertoy

```glsl
// by Nikos Papadopoulos, 4rknova / 2015
// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

uniform vec2 uResolution;
uniform float uTime;


#define EPS		.001
#define PI		3.14159265359
#define RADIAN	180. / PI
#define SPEED	25.

float hash(in float n) { return fract(sin(n)*43758.5453123); }

float hash(vec2 p)
{
    return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453123);
}

float noise(vec2 p)
{
    vec2 i = floor(p), f = fract(p); 
	f *= f*(3.-2.*f);
    
    vec2 c = vec2(0,1);
    
    return mix(mix(hash(i + c.xx), 
                   hash(i + c.yx), f.x),
               mix(hash(i + c.xy), 
                   hash(i + c.yy), f.x), f.y);
}

float fbm(in vec2 p)
{
	return	.5000 * noise(p)
		   +.2500 * noise(p * 2.)
		   +.1250 * noise(p * 4.)
		   +.0625 * noise(p * 8.);
}

float dst(vec3 p)
{
	return dot(vec3(p.x, p.y
                    + 0.45 * fbm(p.zx) 
                    + 2.55 * noise(.1 * p.xz) 
                    + 0.83 * noise(.4 * p.xz)
                    + 3.33 * noise(.001 * p.xz)
                    + 3.59 * noise(.0005 * (p.xz + 132.453)) 
                    , p.z),  vec3(0.,1.,0.));	
}

vec3 nrm(vec3 p, float d)
{
	return normalize(
			vec3(dst(vec3(p.x + EPS, p.y, p.z)),
    			 dst(vec3(p.x, p.y + EPS, p.z)),
    			 dst(vec3(p.x, p.y, p.z + EPS))) - d);
}

bool rmarch(vec3 ro, vec3 rd, out vec3 p, out vec3 n)
{
	p = ro;
	vec3 pos = p;
	float d = 1.;

	for (int i = 0; i < 64; i++) {
		d = dst(pos);

		if (d < EPS) {
			p = pos;
			break;
		}
		pos += d * rd;
	}
	
	n = nrm(p, d);
	return d < EPS;
}

vec4 render(vec2 uv)
{
    float t = uTime;
    
    vec2 uvn = (uv) * vec2(uResolution.x / uResolution.y, 1.);
	
    float vel = SPEED * t;
    
	vec3 cu = vec3(2. * noise(vec2(.3 * t)) - 1.,1., 1. * fbm(vec2(.8 * t)));
	vec3 cp = vec3(0, 3.1 + noise(vec2(t)) * 3.1, vel);
	vec3 ct = vec3(1.5 * sin(t), 
				   -2. + cos(t) + fbm(cp.xz) * .4, 13. + vel);
		
	vec3 ro = cp,
		 rd = normalize(vec3(uvn, 1. / tan(60. * RADIAN)));
	
	vec3 cd = ct - cp,
		 rz = normalize(cd),
		 rx = normalize(cross(rz, cu)),
		 ry = normalize(cross(rx, rz));

	rd = normalize(mat3(rx, ry, rz) * rd);
    

	vec3 sp, sn;
	vec3 col = (rmarch(ro, rd, sp, sn) ?
		  vec3(.6) * dot(sn, normalize(vec3(cp.x, cp.y + .5, cp.z) - sp))
		: vec3(0.));
	
	return vec4(col, length(ro-sp));
}

void main()
{
    vec2 uv = gl_FragCoord.xy / uResolution.xy * 2. - 1.;
        
    if (abs(EPS + uv.y) >= .7) { 
		gl_FragColor = vec4(0,0,0,1);
        return;
	}
	
    vec4 res = render(uv);
    
    vec3 col = res.xyz;
    
    col *= 1.75 * smoothstep(length(uv) * .35, .75, .4);
    float noise = hash((hash(uv.x) + uv.y) * uTime) * .15;
	col += noise;
	col *= smoothstep(EPS, 3.5, uTime);

    gl_FragColor = vec4(col, 1);
}
```

## New Random swirls
This is updated for new backend
```glsl
float seg(in vec2 p, in vec2 a, in vec2 b) {
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    float a = atan(uv.y, uv.x);
    vec2 p = cos(a + iTime) * vec2(cos(0.5 * iTime), sin(0.3 * iTime));
    vec2 q = (cos(iTime)) * vec2(cos(iTime), sin(iTime));
    
    float d1 = length(uv - p);
    float d2 = length(uv - 0.);
    
    vec2 uv2 = 2. * cos(log(length(uv))*0.25 - 0.5 * iTime + log(vec2(d1,d2)/(d1+d2)));///(d1+d2);
    //uv = mix(uv, uv2, exp(-12. * length(uv)));
    //uv = uv2;
    
    vec2 fpos = fract(4. *  uv2) - 0.5;
    float d = max(abs(fpos.x), abs(fpos.y));
    float k = 5. / iResolution.y;
    float s = smoothstep(-k, k, 0.25 - d);
    vec3 col = vec3(s, 0.5 * s, 0.1-0.1 * s);
    col += 1./cosh(-2.5 * (length(uv - p) + length(uv))) * vec3(1,0.5,0.1);
    
    float c = cos(10. * length(uv2) + 4. * iTime);
    col += (0.5 + 0.5 * c) * vec3(0.5,1,1) *
           exp(-9. * abs(cos(9. * a + iTime) * uv.x
                       + sin(9. * a + iTime) * uv.y 
                       + 0.1 * c));
    
    fragColor = vec4(col,1.0);
}
```

## New Single Red Color
All previous shaders are currently outdated and need to be rebuilt for the new system
(anything like iResolution, iTime, iDate do not need to be imported and can be used right away)
```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
  fragColor = vec4(.75,.25,.3,1.0);
}
```