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
	
	//Placeholder fallback for <=IE8
	function placeholdersupport() {
        var check = document.createElement('input');
        return ('placeholder' in check);
    }
    if (placeholdersupport() == false) {
        $('[placeholder]').each(function () {
            var placeholder = $(this).attr('placeholder');
            $(this).val(placeholder);
        });
        $('[placeholder]').focus(function () {
            var placeholder = $(this).val();
            $(this).val('');
        });
        $('[placeholder]').blur(function () {
            if ($(this).val() == '') {
                var placeholder = $(this).attr('placeholder');
                $(this).val(placeholder);
            }
        });
    }
    
    //JS for accordions
    $('.accord-title').on('click', function (e) {
        e.preventDefault();
        var content = $(this).next('.accord-content');
        $(content).show();
        var parent = $(this).parent('.accord-item'), itemHeight = $(parent).outerHeight(), titleheight = $(this).outerHeight();
        if ($('.open').length > 0) {
            var open = $('.open');
            $('.open').animate({
                height: $('.open').find('.accord-title').outerHeight()
            }, 150, function () {
                $(open).height('auto');
                $(open).find('.accord-content').hide();
                $(open).removeClass('open');
            });
        }
        $(parent).toggleClass('open');
        if ($(parent).hasClass('open')) {
            $(parent).height(titleheight);
            $(parent).animate({
                height: itemHeight
            }, 200);
        } else {
            $(parent).animate({
                height: titleheight
            }, 150, function () {
                $(parent).height('auto');
                $(content).hide();
            });
        }
    });
    
    //CSS animation detection
	$(window).scroll(function () {
	    var animationItem = $('.animation-block'), scrollPos = $(window).scrollTop();
	    for (var i = 0; i < animationItem.length; i++) {
	        var docBottom = $(window).scrollTop() + $(window).height(), itemPosTop = $(animationItem[i]).offset().top, itemPosBottom = itemPosTop + $(animationItem[i]).height();
	        if ((itemPosTop <= docBottom - 100) && (itemPosTop >= scrollPos)) {
	            $(animationItem[i]).addClass('animate');
	        }
	    }
	});
	
	//Navigation
    $('.menu-trigger').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).toggleClass('open');
        if ($(this).hasClass('open')) {
            $('#leadNav').animate({
                right: 0
            }, 200);
        } else {
            $('#leadNav').animate({
                right: -300
            }, 200);
        }
        if ($(this).hasClass('open')) {
            $('body').animate({
                right: '300px', left: '-300px'
            }, 200);
        } else {
            $('body').animate({
                right: '0', left: '0'
            }, 200);
        }
    });
    // Close leadNav if anywhere else is clicked
    $('#leadNav').on('click', function (e) {
        e.stopPropagation();
    });
    $('body').on('click', function () {
        if ($('.menu-trigger').hasClass('open')) {
            $('.menu-trigger').removeClass('open');
            $('#leadNav').animate({
                right: -300
            }, 200);
            $('body').animate({
                right: '0', left: '0'
            }, 200);
        }
    });
    $('.subNavTrigger').on('click', function (e) {
        e.preventDefault();
        var subNav = $(this).next('.subNav');
        $(this).toggleClass('open');
        if ($(this).hasClass('open')) {
            $(subNav).addClass('open');
            $(subNav).height('auto');
            var height = $(subNav).height();
            $(subNav).height(0);
            $(subNav).animate({
                height: height
            }, 200);
        } else {
            $(subNav).removeClass('open');
            $(subNav).animate({
                height: 0
            }, 200);
        }
    });
    
    //Initial page scroll
    if (!($('#mediaCheck').css('display') == 'none') && $('.landing').length) {
    	var scroll, scrolling = true, main = $('#content-wrap'), scrollPos = 0, scrollHeight = window.innerHeight, speed = 15, init = false;
    	if ($(window).scrollTop() > 100) {
    		init = true;
    		$('.element-up').removeClass('element-up');
    	}
    	$(window).scroll(function(e){
    		if (init == false) {
    			e.preventDefault();
    		}
    		if ($(window).scrollTop() <= 100 && scrolling == true && init == false) {
    			scrolling = false;
				function timeDelay() {
					scrollPos += (scrollHeight - scrollPos) / speed;
					$(window).scrollTop(scrollPos);
					scroll = requestAnimationFrame(preventScroll);
				}
				function preventScroll() {
					if (scrollPos >= (scrollHeight - 1)) {
						window.cancelAnimationFrame(scroll);
						scrollPos = 0;
						scrolling = true;
						init = true;
						return;
					}
					timeDelay();
				}
				timeDelay();
    		}
    	});
    }
    
    //Hero image positioning
    $(window).load(function(){
		$('.carousel').fadeIn(500);
		if ($('#imagecontain').length > 0) {
			var containheight = $('#imagecontain').height(), img = $('#imagecontain').find('img'), imgheight, toppos;
			if (img.length > 1) {
				for (var i = 0; i < $(img).length; i++) {
					if ($(img[i]).is(':visible')) {
						imgheight = img[i].height;
					}
				}
			} else {
				imgheight = $(img).height();
			}
			toppos = (imgheight - containheight) / 2;
			if (imgheight < containheight) {
				$('#imagecontain').height(imgheight);
				$(img).css({
					top: 0
				});
			} else {
				//$('#imagecontain').height(600);
				$(img).css({
					top: -toppos
				});
			}
			$(window).resize(function(){
				toppos;
				if ($(img).length > 1) {
					for (var i = 0; i < $(img).length; i++) {
						if ($(img[i]).is(':visible')) {
							imgheight = $(img[i]).height();
						}
					}
				} else {
					imgheight = $(img).height();
				}
				toppos = (imgheight - containheight) / 2;
				if (imgheight < containheight) {
					//$('#imagecontain').height(imgheight);
					if ($(img).length > 1) {
						for (var i = 0; i < $(img).length; i++) {
							$(img[i]).css({
								top: 0
							});
						}
					} else {
						$(img).css({
							top: 0
						});
					}
				} else {
					//$('#imagecontain').height(600);
					if ($(img).length > 1) {
						for (var i = 0; i < $(img).length; i++) {
							$(img[i]).css({
								top: -toppos
							});
						}
					} else {
						$(img).css({
							top: -toppos
						});
					}
				}
			});
		}
	});
	
	//Parallax
	//Add this class on if supported
	if ($('.parallax').length) {//If parallax is supported
		var movePos, scrolling = false;
		var pBlocks = $('.parallax-block');
		for (var i = 0; i < pBlocks.length; i++) {
			
			var blockHeight = $(pBlocks[i]).outerHeight();//Contains all parallax containers
			var move1 = blockHeight * 0, move2 = blockHeight * 0, move3 = blockHeight * 0;//Sets initial offset for parallax items
			var move1Str = move1 + 'px', move2Str = move2 + 'px', move3Str = move3 + 'px';//Creates strings to apply to elements
			
			$(pBlocks[i]).find('.level-1').css('-webkit-transform', 'translateY(' + move1Str + ')').attr('level-offset', move1);//Set offset for each parallax container parallax item
			$(pBlocks[i]).find('.level-2').css('-webkit-transform', 'translateY(' + move2Str + ')').attr('level-offset', move2);
			$(pBlocks[i]).find('.level-3').css('-webkit-transform', 'translateY(' + move3Str + ')').attr('level-offset', move3);
		}
		
		//Parallax block detection
		var ls = 0;
		$(window).scroll(function () {//If scrolling
			
			var ns = $(this).scrollTop(), scrollDown = true;
			if (ns > ls) {//If scrolling down
				scrollDown = true;
			} else {//If scrolling up
				scrollDown = false;
			}
			ls = ns;
			
			if (scrolling == false) {//If a scroll event is not currently happening
				
			    var parallaxItem = $('.parallax-block'), scrollPos = $(window).scrollTop();
			    
			    for (var i = 0; i < parallaxItem.length; i++) {//For each parallax contain element
			    	
			        var docBottom = $(window).scrollTop() + $(window).height(), itemPosTop = $(parallaxItem[i]).offset().top, itemPosBottom = itemPosTop + $(parallaxItem[i]).height();
			        
			        if ((itemPosTop <= docBottom) && (itemPosTop >= scrollPos)) {//If parallax contain element is in view
		            	move(parallaxItem[i], $(parallaxItem[i]).outerHeight(), scrollDown);//Run move function
			        }
			        if ((itemPosTop <= scrollPos) && (itemPosBottom <= docBottom)) {
			        	move(parallaxItem[i], $(parallaxItem[i]).outerHeight(), scrollDown);//Run move function
			        }
			    }
	   		}
		});
		function move(item, blockHeight, scrollDown) {
			scrolling = true;//Scrolling event has started
			
			var time = 30;
			var start = 0;
			var lev1Pos = blockHeight * 0.04, lev2Pos = blockHeight * 0.11, lev3Pos = blockHeight * 0.18;//Set the amount to move each element by within each scroll event
			var lev1Item = $(item).find('.level-1'), lev2Item = $(item).find('.level-2'), lev3Item = $(item).find('.level-3');//Find each of the parallax items within scroll event
			
			var lev1Offset = parseInt($(lev1Item).attr('level-offset'));
			var lev2Offset = parseInt($(lev2Item).attr('level-offset'));
			var lev3Offset = parseInt($(lev3Item).attr('level-offset'));
			
			//var lev1NV = lev1Offset - lev1Pos, lev2NV = lev2Offset - lev2Pos, lev3NV = lev3Offset - lev3Pos;
			var lev1Inc = lev1Pos / time, lev2Inc = lev2Pos / time, lev3Inc = lev3Pos / time;
			
			function animate() {
				start++;
				if (scrollDown == true) {//If scrolling down
					if (start >= (time * 0.7) && start < (time * 0.8)) {
						lev1Offset -= (lev1Inc / 2);
						lev2Offset -= (lev2Inc / 2);
						lev3Offset -= (lev3Inc / 2);
					}
					else if (start >= (time * 0.8) && start < (time * 0.9)) {
						lev1Offset -= (lev1Inc / 3);
						lev2Offset -= (lev2Inc / 3);
						lev3Offset -= (lev3Inc / 3);
					}
					else if (start >= (time * 0.9) && start < (time * 0.95)) {
						lev1Offset -= (lev1Inc / 4);
						lev2Offset -= (lev2Inc / 4);
						lev3Offset -= (lev3Inc / 4);
					}
					else if (start >= (time * 0.95)) {
						lev1Offset -= (lev1Inc / 5);
						lev2Offset -= (lev2Inc / 5);
						lev3Offset -= (lev3Inc / 5);
					} else {
						lev1Offset -= lev1Inc;
						lev2Offset -= lev2Inc;
						lev3Offset -= lev3Inc;
					}
				} else {
					if (start >= (time * 0.7) && start < (time * 0.8)) {
						lev1Offset += (lev1Inc / 2);
						lev2Offset += (lev2Inc / 2);
						lev3Offset += (lev3Inc / 2);
					}
					else if (start >= (time * 0.8) && start < (time * 0.9)) {
						lev1Offset += (lev1Inc / 3);
						lev2Offset += (lev2Inc / 3);
						lev3Offset += (lev3Inc / 3);
					}
					else if (start >= (time * 0.9) && start < (time * 0.95)) {
						lev1Offset += (lev1Inc / 4);
						lev2Offset += (lev2Inc / 4);
						lev3Offset += (lev3Inc / 4);
					}
					else if (start >= (time * 0.95)) {
						lev1Offset += (lev1Inc / 5);
						lev2Offset += (lev2Inc / 5);
						lev3Offset += (lev3Inc / 5);
					} else {
						lev1Offset += lev1Inc;
						lev2Offset += lev2Inc;
						lev3Offset += lev3Inc;
					}
				}
				
				$(lev1Item).attr('level-offset', lev1Offset).css('-webkit-transform', 'translateY(' + lev1Offset + 'px' + ')');
				$(lev2Item).attr('level-offset', lev2Offset).css('-webkit-transform', 'translateY(' + lev2Offset + 'px' + ')');
				$(lev3Item).attr('level-offset', lev3Offset).css('-webkit-transform', 'translateY(' + lev3Offset + 'px' + ')');
				
				
				if (start >= time) {
					start = 0, scrolling = false;
					window.cancelAnimationFrame(animate);
					return;
				}
				movePos = requestAnimationFrame(animate);
			}
			animate();
		}
	}
});