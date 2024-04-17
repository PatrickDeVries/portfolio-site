export const vertex = `
  attribute float temperature;
  varying float temp;
  
  void main() {
    temp = temperature;
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;    
    gl_PointSize = 10.0;  
  }
`

export const fragment = `
  uniform vec3 colorA; 
  uniform vec3 colorB; 
  varying float temp;

  void main() {
    float distance = length(2.0 * gl_PointCoord - 1.0);
    if (distance > 1.0) {
        discard;
    }
    gl_FragColor = vec4(mix(colorA, colorB, temp * .01), 1.0);
  }
`
