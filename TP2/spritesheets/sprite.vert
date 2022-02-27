attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform float m;
uniform float n;
uniform float M;
uniform float N;

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    vTextureCoord = aTextureCoord;
    
    vTextureCoord[0] = vTextureCoord[0]/M + m/M;
    vTextureCoord[1] = vTextureCoord[1]/N + n/N;
} 