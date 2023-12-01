const canvasGround1 = document.getElementById('canvas-ground1');
const canvasGround2 = document.getElementById('canvas-ground2');
const canvasAnim = document.getElementById('canvas-anim');
const canvasTop1 = document.getElementById('canvas-top1');
const canvasMinimap = document.getElementById('minimap-canvas');
const scale = 1;
const config = {
  debug: false,
  fieldWidth: 64 * scale,
  unitScale: 0.75,
  tileSize: 64,
  imageNumTiles: 16,
  visibility: 7,
  canvasGround1,
  canvasGround2,
  canvasAnim,
  canvasTop1,
  canvasMinimap,
  ctxGround1: canvasGround1.getContext('2d'),
  ctxGround2: canvasGround2.getContext('2d'),
  ctxAnim: canvasAnim.getContext('2d'),
  ctxTop1: canvasTop1.getContext('2d'),
  ctxMinimap: canvasMinimap?.getContext('2d'),
  chunkSize: 30
};

export default config;
