import './main.scss';
import Resources from './utils/resources';
import Canvas from './canvas';

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

const mapJson = {
    // eslint-disable-next-line
        "map": [[[257,127,126,127,126,127,126,85,70,65,81,82,66,65,88,99,126,127,126,85,88,127,126,127],[257,143,142,143,142,143,142,101,102,80,82,87,82,81,72,143,142,143,142,161,104,143,142,143],[126,127,126,127,126,127,126,127,126,107,85,145,65,66,88,148,149,149,149,127,126,127,126,127],[142,143,142,143,142,143,142,143,142,143,142,97,81,82,72,164,165,165,165,166,142,143,142,143],[126,127,126,127,126,127,126,127,126,127,126,69,129,93,104,164,165,165,165,157,149,149,149,150],[142,143,142,143,142,143,142,143,142,143,142,101,108,143,142,180,172,165,165,165,165,165,173,182],[149,150,126,127,126,127,126,127,126,127,126,101,102,127,126,127,164,165,173,181,181,181,182,127],[165,166,142,143,142,143,142,143,142,143,142,143,142,143,142,143,180,181,182,143,142,143,142,143],[165,157,149,149,150,127,126,127,126,127,126,127,126,127,126,127,126,127,126,127,126,127,126,127],[203,203,204,173,182,143,142,148,150,143,142,143,142,143,142,143,142,143,142,143,142,143,142,143],[171,235,236,166,126,127,148,156,166,127,126,127,126,127,126,127,126,127,126,127,126,127,126,127],[236,173,181,182,142,143,164,165,166,143,142,143,142,143,142,143,142,143,142,143,142,143,142,143],[181,182,126,127,126,127,164,165,166,127,126,127,126,127,126,127,126,127,126,127,151,152,152,153],[142,143,142,143,142,143,164,165,157,149,150,143,142,143,142,143,142,143,142,143,167,219,219,169],[126,127,126,127,126,127,180,181,172,165,166,127,126,127,126,127,126,127,148,149,158,219,175,185],[142,143,142,143,142,143,142,143,180,181,182,143,142,143,142,143,142,143,164,165,165,173,185,143],[126,127,126,127,126,127,126,127,126,127,126,127,126,127,126,127,126,127,164,165,165,166,126,127],[142,143,142,257,142,143,142,143,142,143,142,143,142,143,142,143,142,143,180,181,181,182,142,143],[126,127,126,69,70,87,50,127,126,127,126,127,126,127,126,127,126,127,126,127,126,127,126,127],[142,143,142,85,87,70,87,75,54,55,142,143,142,143,142,143,142,143,142,143,142,143,142,143]],[[0,227,274,0,223,269,84,0,0,0,253,0,0,253,420,0,118,119,144,773,0,89,0,0],[243,258,355,356,239,0,100,0,0,722,269,253,253,269,0,115,134,135,160,752,753,105,0,0],[227,274,0,0,0,0,116,117,106,738,688,269,269,0,0,89,478,479,176,177,120,121,0,0],[274,0,0,0,0,0,132,133,122,123,96,327,328,0,0,73,494,495,192,193,136,137,0,0],[0,0,0,0,0,0,0,0,138,139,112,343,344,222,0,105,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,100,359,360,109,120,121,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,116,123,124,125,136,137,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,132,133,140,141,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,357,358,0,240,242,0,0,0,0,0,0,0,0,0,0,0,0,0],[222,0,0,0,0,0,0,0,0,256,258,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,256,258,0,0,0,0,0,752,753,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,272,274,0,0,524,0,0,773,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,237,0,0,738,0,540,0,0,0,708,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,345,346,347,348,523,0,0,0,0,0,0,240,241,242,0,0],[0,0,0,0,0,0,0,0,361,362,363,364,340,0,323,324,0,0,0,272,273,274,0,0],[0,0,240,241,241,242,0,0,756,757,344,355,356,0,339,340,672,0,0,0,0,0,0,0],[0,0,256,53,54,55,56,0,689,0,360,0,336,337,355,356,0,706,0,0,0,0,0,0],[0,0,68,0,240,241,242,51,38,39,355,356,352,353,354,0,0,0,389,0,758,759,0,240],[0,0,84,0,256,257,211,241,242,0,56,0,270,339,340,359,360,325,240,241,241,241,241,210]],[[0,0,339,340,0,0,240,210,227,274,0,0,0,0,0,0,0,0,0,736,737,0,0,0],[0,0,0,0,0,0,272,273,274,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,309,310,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,325,326,0,0,0,0,0,690,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,341,342,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,736,737,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,221,0,0,722,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,329,330,331,332,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,323,324,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,327,328,339,304,305,306,0,0,0,0,0,0,0,0,0],[0,0,0,37,38,39,40,0,0,343,323,324,320,321,322,0,0,0,0,0,0,0,0,0],[0,0,52,329,330,331,332,57,0,359,339,340,0,0,338,327,328,0,0,0,0,0,0,0],[0,0,0,345,346,347,348,0,0,0,40,0,0,323,324,343,344,309,310,0,0,0,0,0],[0,0,0,361,362,363,364,0,0,222,0,57,0,0,0,0,0,0,340,373,0,0,0,0]]]
};

function init() {
    const canvas = new Canvas({
        'map': mapJson.map,
        'resources': resources
    });
}

const resources = new Resources();

const resourcesList = [
    '/images/tileset.png',
    '/images/units.png'
];

resources.load(resourcesList);

resources.onReady(function() {
    init();
});
