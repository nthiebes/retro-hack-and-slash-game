/**
 * A cross-browser requestAnimationFrame
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();


/**
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
 */
window.requestTimeout = function(fn, delay) {
  const start = new Date().getTime(),
    handle = {};

  if (!window.requestAnimationFrame && 
    !window.webkitRequestAnimationFrame && 
    !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
    !window.oRequestAnimationFrame && 
    !window.msRequestAnimationFrame) {
    return window.setTimeout(fn, delay);
  }
    
  function loop() {
    const current = new Date().getTime(),
      delta = current - start;
      
    delta >= delay ? fn.call() : handle.value = window.requestAnimFrame(loop);
  }
  
  handle.value = window.requestAnimFrame(loop);
  return handle;
};