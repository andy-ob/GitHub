$(function(){
	/**
     * requestAnimationFrame polyfill by Erik Möller & Paul Irish et. al.
     * https://gist.github.com/1866474
     *
     * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    **/
    var lastTime = 0;
    var prefixes = 'webkit moz ms o'.split(' ');
    // get unprefixed rAF and cAF, if present
    var requestAnimationFrame = window.requestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame;
    // loop through vendor prefixes and get prefixed rAF and cAF
    var prefix;
    for( var i = 0; i < prefixes.length; i++ ) {
        if ( requestAnimationFrame && cancelAnimationFrame ) {
            break;
        }
        prefix = prefixes[i];
        requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
        cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] ||
                                  window[ prefix + 'CancelRequestAnimationFrame' ];
    }
    // fallback to setTimeout and clearTimeout if either request/cancel is not supported
    if ( !requestAnimationFrame || !cancelAnimationFrame ) {
        requestAnimationFrame = function( callback, element ) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
            var id = window.setTimeout( function() {
                callback( currTime + timeToCall );
            }, timeToCall );
            lastTime = currTime + timeToCall;
            return id;
        };
        cancelAnimationFrame = function( id ) {
            window.clearTimeout( id );
        };
    }
    // put in global namespace
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;
    //END OF requestAnimationFrame polyfill
    
    var stage = document.getElementById('wave-sep'), stageCtx = stage.getContext('2d');//Save canvas stage to variable
    stage.width = window.innerWidth, stage.height = 100;
    
    var drawWave = {
    	init: function() {
    		var width = stage.width, height = stage.height, quartWidth = width / 4;
    		stageCtx.beginPath();
  			stageCtx.moveTo(0, 0);
  			stageCtx.bezierCurveTo(quartWidth / 4, height, (quartWidth / 4) * 3, 0, quartWidth, 0);
  			
  			stageCtx.lineWidth = 1;
  			stageCtx.strokeStyle = 'rgb(0, 0, 0)';
  			stageCtx.stroke();
    	}
    };
    drawWave.init();
});
