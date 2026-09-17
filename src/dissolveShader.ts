// The same flowing noise and burnt-edge transition used in the BEEZARD introduction.
export const dissolveFragment = `precision mediump float;
varying vec2 uv;
uniform sampler2D photo;
uniform vec2 size;
uniform float time;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){return noise(p)*.55+noise(p*2.03)*.27+noise(p*4.01)*.13+noise(p*8.02)*.05;}
void main(){
vec2 p=uv;float aspect=size.x/size.y;
vec2 cover=vec2(min(1.,aspect/1.777),min(1.,1.777/aspect));
float progress=smoothstep(2.3,6.3,time);
vec2 flow=vec2(fbm(p*4.+vec2(time*.13,-time*.09)),fbm(p*4.+vec2(7.,time*.12)))-.5;
p+=flow*(.018+progress*.18);
p=(p-.5)*cover*(.91-time*.007)+.5;
vec3 source=texture2D(photo,p).rgb;
float luminance=dot(source,vec3(.299,.587,.114));
vec3 color=mix(vec3(.09,.005,.02),vec3(.53,.035,.10),smoothstep(.02,.58,luminance));
color=mix(color,vec3(.86,.66,.37),smoothstep(.5,1.,luminance)*.8);
float field=fbm(uv*vec2(aspect,1.)*4.+flow*2.+vec2(0.,time*.17));
float edge=field-progress*1.55+.25;
float alpha=smoothstep(-.1,.13,edge);
float glow=exp(-abs(edge)*24.)*progress;
color+=vec3(.85,.57,.19)*glow;
color*=.78+.22*smoothstep(0.,1.5,time);
gl_FragColor=vec4(color,alpha);
}`;
