const canvasGround1 = document.getElementById('canvas-ground1');
const canvasGround2 = document.getElementById('canvas-ground2');
const canvasAnim = document.getElementById('canvas-anim');
const canvasTop1 = document.getElementById('canvas-top1');
const config = {
  debug: false,
  fieldWidth: 32,
  visibility: 7,
  canvasGround1,
  canvasGround2,
  canvasAnim,
  canvasTop1,
  ctxGround1: canvasGround1.getContext('2d'),
  ctxGround2: canvasGround2.getContext('2d'),
  ctxAnim: canvasAnim.getContext('2d'),
  ctxTop1: canvasTop1.getContext('2d')
};

export default config;
