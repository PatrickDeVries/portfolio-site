export const vertex = `
  varying vec3 vUv;
  uniform float bboxMin;
  uniform float bboxMax;

  void main() {
    vUv.x = (position.x - bboxMin) / (bboxMax - bboxMin);
      vUv = position;
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;    
      gl_PointSize = 10.0;  
  }
  `

export const fragment = `
    uniform vec3 colorA; 
    uniform vec3 colorB; 
    varying vec3 vUv;

    void main() {
      float distance = length(2.0 * gl_PointCoord - 1.0);
      if (distance > 1.0) {
          discard;
      }
      gl_FragColor = vec4(mix(colorA, colorB, vUv.x*.1 + .5), 1.0);
      
    }
  `
