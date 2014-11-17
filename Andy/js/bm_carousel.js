$(function () {
	var returning = false, autoRotate, swipeActive = false;
	$.fn.carousel = function(){
		var carouseloptions = {
			scroll: false,
			fade: true,
			fadeSpeed: 800,
			timer: false,
			timerspeed: 6000
		};
		var carousel = $(this);
		var carouselItems = carousel.children('li').length;
		var pagiUpdate;
		$('.carousel li').css({
			width: slideWidth
		});
		var pagination = function() {
			var pagiWrap = '<div class="carouselPagination"><ul class="pagi"></ul></div>';
			$(pagiWrap).insertAfter(carousel);
			var pagiItem = '<li><a href="#"></a></li>';
			for (var i = 0; i < carouselItems; i++) {
				$('.pagi').append(pagiItem);
				$('.pagi li').last().attr('data-pos', pos);
				pos = pos + posInc;
			}
		};
		var pagiCheck = function() {
			var pagiItems = $('.pagi').children('li');
			var i = 0;
			$(pagiItems[i]).addClass('active');
			pagiUpdate = function(increment) {
				$(pagiItems).removeClass('active');
				if (increment == true) {
					for (var i = 0; i < carouselItems; i++) {
						if (i === count) {
							$(pagiItems[i]).addClass('active');
						}
					}
				}
				else {
					for (var i = carouselItems; i >= 0; i--) {
						if (i === count - 1) {
							$(pagiItems[i]).addClass('active');
						}
					}
				}
			};
		};
		var toggleButtons = function() {
			var left = '<a href="#left" class="leftToggle">&larr; Previous</a>';
			var right = '<a href="#right" class="rightToggle">Next &rarr;</a>';
			$(right).insertAfter(carousel);
			$(left).insertAfter(carousel);
		};
		var toggleRight = function() {
			if (carouseloptions.scroll == true) {
				if (count < carouselItems) {
					$(carousel).find('.innerlist').animate({
						marginLeft: '-=' + animateWidth
					}, carouseloptions.fadeSpeed);
					var increment = true;
					pagiUpdate(increment);
					count++;
				} else {
					var start = true;
					toggleSlide(0, 0, start);
				}
			}
			if (carouseloptions.fade == true) {
				var carouselSlides = $(carousel).children('li');
				if (count < carouselItems) {
					$(carouselSlides[current]).fadeOut(600);
					current++;
					$(carouselSlides[current]).fadeIn(600);
					var increment = true;
					pagiUpdate(increment);
					count++;
				} else {
					$(carouselSlides[current]).fadeOut(600);
					current = 0;
					count = 1;
					$(carouselSlides[current]).fadeIn(600);
					pagiUpdate(increment);
				}
			}
		};
		var toggleLeft = function() {
			if (carouseloptions.scroll == true) {
				if (count != 1) {
					$(carousel).find('.innerlist').animate({
						marginLeft: '+=' + animateWidth
					}, carouseloptions.fadeSpeed);
					var increment = false;
					count--;
					pagiUpdate(increment);
				} else {
					var start = false;
					var endPos = $('.pagi li').last().attr('data-pos');
					toggleSlide(endPos, carouselItems - 1, start);
				}
			}
			if (carouseloptions.fade == true) {
				var carouselSlides = $(carousel).children('li');
				if (count > 1) {
					$(carouselSlides[current]).fadeOut(600);
					current = current - 1;
					$(carouselSlides[current]).fadeIn(600);
					var increment = false;
					count = count - 1;
					pagiUpdate(increment);
				} else {
					$(carouselSlides[current]).fadeOut(600);
					current = carouselItems - 1;
					count = carouselItems;
					$(carouselSlides[current]).fadeIn(600);
					pagiUpdate(increment);
				}
			}
		};
		var toggleSlide = function(val, index, start) {
			if (carouseloptions.scroll == true) {
				var movePos = val;
				count = index + 1;
				var checkInc = $(carousel).find('.innerlist').css('marginLeft');
                parseInt(checkInc);
                if (movePos > checkInc) {
                    var increment = false;
                }
                else if (start == true) {
                    var increment = false;
                }
                else {
                    var increment = true;
                }
                if (start == false) {
                    var slides = $(carousel).find('.innerlist li').last().clone();
                    $(slides).addClass('return').removeClass('original');
                    $(slides).prependTo($(carousel).find('.innerlist'));
                    var carouselUL = $(carousel).find('.innerlist');
                    $(carouselUL).css({
                        width: ($(carousel).find('.innerlist li').length) * 100 + 0.5 + '%'
                    });
                    movePos = (parseInt($(carousel).find('.innerlist').css('margin-left')) + $(carousel).find('.innerlist li:first-child').width());
                    returning = true;

                    $(carousel).find('.innerlist').css({
                        marginLeft: -movePos
                    });
                    $(carousel).find('.innerlist').animate({
                        marginLeft: 0
                    }, carouseloptions.fadeSpeed, function () {
                        var finalPos = ($(carousel).find($('.innerlist li.original')).length - 1) * ($(carousel).find('.innerlist li:first-child').width());
                        $(carousel).find('.innerlist').css({
                            marginLeft: - finalPos
                        });
                        $(carousel).find('.return').remove();
                    });
                    //$(thiscarousel).find('.return').remove();
                    returning = false;
                } else {
                    if (movePos == 0) {
                        var slides = $(carousel).find('.innerlist li:first-child').clone();
                        $(slides).addClass('return').removeClass('original');
                        $(slides).appendTo($(carousel).find('.innerlist'));
                        var carouselUL = $(carousel).find('.innerlist');
                        $(carouselUL).css({
                            width: ($(carousel).find('.innerlist li').length) * 100 + 0.5 + '%'
                        });
                        movePos = (parseInt($(carousel).find('.innerlist').css('margin-left')) - $(carousel).find('.innerlist li:first-child').width()) - 3;
                        returning = true;

                        $(carousel).find('.innerlist').animate({
                            marginLeft: movePos
                        }, carouseloptions.fadeSpeed, function () {
                            if (start == true || returning == true) {
                                $(carousel).find('.innerlist').css({
                                    marginLeft: 0
                                });
                                $(carousel).find('.return').remove();
                                returning = false;
                            }
                        });
                    } else {
                        if (returning == true) {
                            $(carousel).find('.innerlist').css({
                                marginLeft: 0
                            });
                            $(carousel).find('.return').remove();
                            returning = false;
                        }
                        $(carousel).find('.innerlist').animate({
                            marginLeft: '-' + movePos
                        }, carouseloptions.fadeSpeed, function () {
						
                        });
                    }
                }
				pagiUpdate(increment);
			}
			if (carouseloptions.fade == true) {
				var carouselSlides = $(carousel).children('li');
				if (start == 'pagiClick') {
					$(carouselSlides[current]).fadeOut(carouseloptions.fadeSpeed);
					current = index;
					$(carouselSlides[current]).fadeIn(carouseloptions.fadeSpeed);
					count = index + 1;
					pagiUpdate(increment);
				} else {
					if (count < carouselItems) {
						$(carouselSlides[current]).fadeOut(carouseloptions.fadeSpeed);
						current++;
						$(carouselSlides[current]).fadeIn(carouseloptions.fadeSpeed);
						var increment = true;
						pagiUpdate(increment);
						count++;
					} else {
						$(carouselSlides[current]).fadeOut(carouseloptions.fadeSpeed);
						current = 0;
						count = 1;
						$(carouselSlides[current]).fadeIn(carouseloptions.fadeSpeed);
						pagiUpdate(increment);
					}
				}
			}
		};
		if (carouselItems > 1) {
			$(carousel).wrap('<div class="carouselWrap">');
			if (carouseloptions.scroll == true) {
				$(carousel).find($('li')).wrapAll('<div class="innerlist cf">');
				$('.carouselWrap').addClass('scroll');
				var carouselUL = $(carousel).children('.innerlist');
				$(carouselUL).css({
					width: carouselItems * 100 + '%'
				});
				var slideWidth = $('.carouselWrap').width();
				$(carousel).find('li').css({
					float: 'left',
					width: slideWidth
				});
				var count = 1;
				var carouselWidth = $(carousel).width();
				var animateWidth = carouselWidth;
				var pos = 0;
				var posInc = carouselWidth;
				pagination();
				pagiCheck();
				toggleButtons();
			}
			if (carouseloptions.fade == true) {
				$('.carouselWrap').addClass('fade');	
				$(carousel).find('img').one('load', function () {
					$(carousel).css({
						height: $(carousel).children('li').height(),
						width: 100 + '%'
					});
                }).each(function () {
                    if (this.complete) {
                        $(this).load();
                    }
                });
				var count = 1;
				var current = 0;
				pagination();
				pagiCheck();
				toggleButtons();
			}
			$('.rightToggle').click(function(e){
				e.preventDefault();
				toggleRight();
			});
			$('.leftToggle').click(function(e){
				e.preventDefault();
				toggleLeft();
			});

			if ($('html.ie').length <= 0) {
			  var hammer = Hammer(document.getElementById('hero'));
			  if (swipeActive == false) {
				  hammer.on("swipeleft", function(ev) {
					  ev.gesture.preventDefault();
					  var selected = $(this).find('.carousel');
					  var thiscarousel = $(selected).parent('.carousel-wrap').children('.carousel');
					  toggleRight();
				  });
				  hammer.on("swiperight", function(ev) {
					  ev.gesture.preventDefault();
					  var selected = $(this).find('.carousel');
					  var thiscarousel = $(selected).parent('.carousel-wrap').children('.carousel');
					  toggleLeft();
				  });
				  swipeActive = true;
			  }
		  }

			$('body').on('click', '.pagi a', function(e){
				e.preventDefault();
				var val = $(this).parent().attr('data-pos');
				var index = $(this).parent().index();
				if (carouseloptions.scroll == true) {
					toggleSlide(val, index);
				}
				if (carouseloptions.fade == true) {
					toggleSlide(0, index, 'pagiClick');
				}
			});
			if (carouseloptions.timer == true) {
			    function start() {
			        autoRotate = setInterval(function () {
			            var val = $('.pagi li.active').next().attr('data-pos');
			            var index = $('.pagi li.active').next().index();
			            if ($('.pagi li.active').next().length == 0) {
			                toggleSlide(0, index);
			            } else {
			                toggleSlide(val, index);
			            }
			        }, carouseloptions.timerspeed);
			    } start();
				/*$('.news-items').on('mouseleave', function () {
				    start();
				});*/
			}
		}
		$(window).resize(function(){
			var newWidth = $('.carouselWrap').width();
			var pagiLi = $('.pagi li');
			for (var pagI = 0; pagI < pagiLi.length; pagI++) {
				$(pagiLi[pagI]).attr('data-pos', newWidth * pagI);
			}
			animateWidth = newWidth;
			$('.carousel li').css({
				width: newWidth
			});
			if (carouseloptions.fade == true) {
				$(carousel).css({
					height: $(carousel).children('li').height()
				});
			}
		});
	};
	$('.carousel').carousel();
});