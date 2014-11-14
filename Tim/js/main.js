$(function () {
	/**
     * requestAnimationFrame polyfill by Erik Möller & Paul Irish et. al.
     * https://gist.github.com/1866474
     *
     * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    **/
    var lastTime = 0, prefixes = 'webkit moz ms o'.split(' ');
    // get unprefixed rAF and cAF, if present
    var requestAnimationFrame = window.requestAnimationFrame, cancelAnimationFrame = window.cancelAnimationFrame;
    // loop through vendor prefixes and get prefixed rAF and cAF
    var prefix;
    for (var i = 0; i < prefixes.length; i++) {
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
    
    //Dropdown
    $('.droplabel').click(function () {
        var label = $(this), dropdown = $(label).next(), dropwrapper = $(label).parents('.dropwrapper');
        $(dropwrapper).toggleClass('open');
        if ($(dropwrapper).hasClass('open')) {
            $(dropdown).height('auto');
            var dropheight = $(dropdown).height();
            $(dropdown).height(0);
            $(dropdown).animate({
                height: dropheight
            }, 200);
        } else {
            $(dropdown).animate({
                height: 0
            }, 150);
        }
        $(dropdown).find('a').click(function () {
            var filtertext = $(this).text();
            $(label).find('span').text(filtertext);
            $(dropdown).animate({
                height: 0
            }, 150, function () {
                $(dropwrapper).removeClass('open');
            });
        });
    });
    //Filter movement
    if ($('.tile-contain').length > 0) {
        var itemswrap = $('.tile-item').parent('.col'), neworder = itemswrap, items = $('.tile-item'), elementpos = [];
        $(window).load(function () {
            var height = $('.tile-contain').height();
            $('.tile-contain').height(height);
        });
        for (var i = 0; i < itemswrap.length; i++) {
            var item = $(itemswrap[i]);
            var leftPos = item.position().left, topPos = item.position().top;
            elementpos[i] = { 'left': leftPos, 'top': topPos };
            $(itemswrap[i]).css({
                left: leftPos,
                top: topPos
            });
        }
        $(window).resize(function () {
            for (var i = 0; i < $(items).length; i++) {
                var pos = $('.tile-item').parent('.col');
                var item = $(pos[i]);
                var leftPos = item.position().left, topPos = item.position().top;
                elementpos[i] = { 'left': leftPos, 'top': topPos };
                $(pos[i]).css({
                    left: leftPos,
                    top: topPos
                });
            }
        });
        $('.dropdown a').click(function (e) {

            for (var i = 0; i < $(items).length; i++) {
                var pos = $('.tile-item').parent('.col');
                var item = $(pos[i]);
                var leftPos = item.position().left, topPos = item.position().top;
                elementpos[i] = { 'left': leftPos, 'top': topPos };
            }

            $('.tile-contain').addClass('filtered');
            neworder = $(itemswrap);

            e.preventDefault();
            var role = $(this).attr('data-filter');
            /*if (role == 'all') {
				$(itemswrap).animate({
					opacity: 1
				});
				for (var i = 0; i < items.length; i++) {
					$(itemswrap[i]).animate({
						left: elementpos[i].left,
						top: elementpos[i].top
					}, 800);
					$(itemswrap[i]).css({
						position: 'absolute'
					});
				}
				return;
			}*/
            for (var i = 0; i < items.length; i++) {
                if (!$(items[i]).hasClass(role)) {
                    $(itemswrap[i]).animate({
                        opacity: 0.3
                    });
                } else {
                    $(itemswrap[i]).animate({
                        opacity: 1
                    });
                }
            }
            var removed = [];
            for (var i = items.length - 1; i >= 0; i--) {
                if ($(items[i]).hasClass(role)) {
                    var item = itemswrap[i];
                    removed.push(item);
                    neworder.splice(i, 1);
                }
            }
            for (var i = 0; i < removed.length; i++) {
                neworder.splice(0, 0, removed[i]);
            }
            for (var i = 0; i < items.length; i++) {
                $(neworder[i]).css({
                    position: 'absolute'
                });
                $(neworder[i]).animate({
                    left: elementpos[i].left,
                    top: elementpos[i].top
                }, 800, function () {
                    $('.tile-contain').html(neworder);
                    $('.tile-contain .col').css({
                        position: ''
                    });
                });
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
				$('#imagecontain').height(600);
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
					$('#imagecontain').height(imgheight);
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
					$('#imagecontain').height(600);
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
    
	//Google maps
	if ($('#mapcanvas').length) {
	  var startlng = -1.61100;
	  var lat = 54.972885;
	  var lng = -1.59100;
	  var mapOptions = {
		  center: new google.maps.LatLng(lat, lng),
		  zoom: 14,
		  mapTypeId: google.maps.MapTypeId.ROADMAP,
		  scrollwheel: false,
		  disableDefaultUI: true,
		  draggable: false,
		  disableDoubleClickZoom: true
	  };
		
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		//Julian day used to help calculate astronomical and nautical twilights
		/*Date.prototype.getJulian = function() {
			return Math.floor((this / 86400000) - (this.getTimezoneOffset()/1440) + 2440587.5);
		}
		var jd = d.getJulian(); //get Julian day
		
		//Equation of time, declination of the sun
		
		var da = jd - 2451545.0;  // jd is the given Julian date 

		var g = 357.529 + 0.98560028* da;
		var q = 280.459 + 0.98564736* da;
		var L = q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);

		var R = 1.00014 - 0.01671 * Math.cos(g) - 0.00014 * Math.cos(2 * g);
		var e = 23.439 - 0.00000036 * da;
		var RA = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)) / 15;

		var Dec = Math.asin(Math.sin(e) * Math.sin(L));  // declination of the Sun
		var EqT = q / 15 - RA;  // equation of time
		console.log('Declination of the sun: ' + Dec);
		console.log('Equation of time: ' + EqT);
		
		var sunsHighest = 12 + 0 + (lng / 15) - (EqT / 60);
		var today = d.getFullYear() + '-' + month + '-' + d.getDate();*/

		
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		
		//Passed, sunrise and sunset
		function formatTime(number) {
			return (number < 10 ? '0' : '') + number;
		}
		var d = new Date(), year = d.getYear(), month = d.getMonth(), hours = d.getHours(), minutes = d.getMinutes();
		minutes = formatTime(minutes);
		
		var sunTimes = SunCalc.getTimes(d, lat, lng);
		//Sunrise = sunriseEnd
		//Civil twilight morning = dawn
		//Nautical twilight morning = NauticalDawn
		//Astronomical twilight morning = nightEnd
		
		//Sunset = sunset
		//Civil twilight evening = sunset
		//Nautical twilight evening = dusk
		//Astronomical twilight evening = nauticalDusk
		//night = night
		console.log('------------------------------------------------');
		var AstroTwiAm = new Date(sunTimes.nightEnd), AstroTwiAmHr = AstroTwiAm.getHours(), AstroTwiAmMin = AstroTwiAm.getMinutes(), AstroTwiAm = AstroTwiAmHr + ':' + formatTime(AstroTwiAmMin);
		var NautTwiAm = new Date(sunTimes.nauticalDawn), NautTwiAmHr = NautTwiAm.getHours(), NautTwiAmMin = NautTwiAm.getMinutes(), NautTwiAm = NautTwiAmHr + ':' + formatTime(NautTwiAmMin);
		var CivilTwiAm = new Date(sunTimes.dawn), CivilTwiAmHr = CivilTwiAm.getHours(), CivilTwiAmMin = CivilTwiAm.getMinutes(), CivilTwiAm = CivilTwiAmHr + ':' + formatTime(CivilTwiAmMin);
		var Sunrise = new Date(sunTimes.sunriseEnd), SunriseHr = Sunrise.getHours(), SunriseMin = Sunrise.getMinutes(), Sunrise = SunriseHr + ':' + formatTime(SunriseMin);
		console.log('Astronomical twilight AM: ' + AstroTwiAm);
		console.log('Nautical twilight AM: ' + NautTwiAm);
		console.log('Civil twilight AM: ' + CivilTwiAm);
		console.log('Sunrise: ' + Sunrise);
		console.log('------------------------------------------------');
		var Sunset = new Date(sunTimes.sunset), SunsetHr = Sunset.getHours(), SunsetMin = Sunset.getMinutes(), Sunset = SunsetHr + ':' + formatTime(SunsetMin);
		var NautTwiPm = new Date(sunTimes.dusk), NautTwiPmHr = NautTwiPm.getHours(), NautTwiPmMin = NautTwiPm.getMinutes(), NautTwiPm = NautTwiPmHr + ':' + formatTime(NautTwiPmMin);
		var AstroTwiPm = new Date(sunTimes.nauticalDusk), AstroTwiPmHr = AstroTwiPm.getHours(), AstroTwiPmMin = AstroTwiPm.getMinutes(), AstroTwiPm = AstroTwiPmHr + ':' + formatTime(AstroTwiPmMin);
		var Night = new Date(sunTimes.night), NightHr = Night.getHours(), NightMin = Night.getMinutes(), Night = NightHr + ':' + formatTime(NightMin);
		console.log('Sunset & Civil twilight: ' + Sunset);
		console.log('Nautical Twilight PM: ' + NautTwiPm);
		console.log('Astronomical twilight PM: ' + AstroTwiPm);
		console.log('Night: ' + Night);
		console.log('------------------------------------------------');
		
		
		var sunrise = Sunrise, sunset = Sunset, max = "24:00", time = hours + ':' + minutes;
		//time = "18:30";
		console.log(time);
		
		sunrise = cleanValue(sunrise);
		sunset = cleanValue(sunset);
		max = cleanValue(max);
		time = cleanValue(time);
		AstroTwiAm = cleanValue(AstroTwiAm);
		NautTwiAm = cleanValue(NautTwiAm);
		CivilTwiAm = cleanValue(CivilTwiAm);
		NautTwiPm = cleanValue(NautTwiPm);
		AstroTwiPm = cleanValue(AstroTwiPm);
		Night = cleanValue(Night);
		function cleanValue(val) {
			return val.replace(':', '');
		}
		
		sunrise = (sunrise / 100) * 60, sunset = (sunset / 100) * 60, max = (max / 100) * 60, time = (time / 100) * 60;
		AstroTwiAm = (AstroTwiAm / 100) * 60;
		NautTwiAm = (NautTwiAm / 100) * 60;
		CivilTwiAm = (CivilTwiAm / 100) * 60;
		NautTwiPm = (NautTwiPm / 100) * 60;
		AstroTwiPm = (AstroTwiPm / 100) * 60;
		Night = (Night / 100) * 60;
		
		var sat, light;

		if (time >= AstroTwiAm && time < sunrise) {
			console.log('Begining morning twilight period');
			var twilightLength = sunrise - AstroTwiAm, timeElapsed = time - AstroTwiAm;
			var lightPercentage = (timeElapsed / twilightLength) * 100;
			var darkPercentage = 100 - lightPercentage;
			sat = - + darkPercentage;
			light = - + (50 / 100) * darkPercentage;
			console.log(lightPercentage + '% of light available');
		}
		if (time >= sunset && time <= Night) {
			console.log('Begining evening twilight period');
			var twilightLength = Night - sunset, timeElapsed = time - sunset;
			var lightPercentage = (timeElapsed / twilightLength) * 100, lightPercentage = 100 - lightPercentage;
			var darkPercentage = 100 - lightPercentage;
			sat = - + darkPercentage;
			light = - + (50 / 100) * darkPercentage;
			console.log(lightPercentage + '% of light available');
		}
		if (time > sunrise && time < sunset) {
			sat = 0;
			light = 0;
			console.log('Daytime, 100% light available');
		}
		if (time > Night && time <= max || time >= 0 && time < AstroTwiAm) {
			console.log('Night time');
			sat = "-100";
			light = "-50";
		}
		
		
		/*if (time >= sunset && time < max) {
			console.log('Nighttime before midnight');
			var daylightHrs = (parseInt(max - sunset)) + parseInt(sunrise), afterSunset = time - sunset, beforeSunrise = daylightHrs - afterSunset;
			console.log(daylightHrs.toFixed(2) + ' minutes of nighttime tonight');
			console.log(afterSunset.toFixed(2) + ' minutes after sunset');
			console.log(beforeSunrise.toFixed(2) + ' minutes before sunrise');
			
			var darkest = daylightHrs / 2;
			console.log('Darkest point: ' + darkest.toFixed(2) + ' minutes after sunset');
			
			if (afterSunset < darkest) {
				var darkPercentage = (afterSunset / darkest) * 100;
				console.log(darkPercentage + '% of fully dark, getting darker!');
			} else {
				var darkPercentage = (beforeSunrise / darkest) * 100;
				console.log(darkPercentage + '% of fully dark, getting lighter!');
			}
			
		}*/
		
		/*if (time <= sunrise && time < max) {
			console.log('Nighttime after midnight');
			if (time >= AstroTwiAm && time < sunrise) {
				var lightPercentage = (time / sunrise) * 100;
				console.log(lightPercentage + '% of light available');
			}
			
			var daylightHrs = (parseInt(max - sunset)) + parseInt(sunrise), afterSunset = (parseInt(max) - parseInt(sunset)) + parseInt(time), beforeSunrise = daylightHrs - afterSunset;
			console.log(daylightHrs.toFixed(2) + ' minutes of nighttime tonight');
			console.log(afterSunset.toFixed(2) + ' minutes after sunset');
			console.log(beforeSunrise.toFixed(2) + ' minutes before sunrise');
			
			var darkest = daylightHrs / 2;
			console.log('Darkest point: ' + darkest.toFixed(2) + ' minutes after sunset');
			
			if (afterSunset < darkest) {
				var darkPercentage = (afterSunset / darkest) * 100;
				console.log(darkPercentage + '% of fully dark, getting darker!');
			} else {
				var darkPercentage = (beforeSunrise / darkest) * 100;
				console.log(darkPercentage + '% of fully dark, getting lighter!');
			}
			
		}*/
		
		/*if (time > sunrise && time < sunset) {
			console.log('Daytime');
			
			var daylightHrs = sunset - sunrise, fromSunrise = time - sunrise, fromSunset = sunset - time;
			console.log(daylightHrs.toFixed(2) + ' minutes of sunlight today');
			console.log(fromSunrise.toFixed(2) + ' minutes after sunrise');
			console.log(fromSunset.toFixed(2) + ' minutes before sunset');
			
			var lightest = daylightHrs / 2;
			console.log('Lighttest point: ' + lightest.toFixed(2) + ' minutes after sunrise');
			
			if (fromSunrise < lightest) {
				var lightPercentage = (fromSunrise / lightest) * 100;
				console.log(lightPercentage + '% of sunlight available, getting lighter!');
			} else {
				var lightPercentage = (fromSunset / lightest) * 100;
				console.log(lightPercentage + '% of sunlight available, getting darker!');
			}
		}*/
		console.log(sat + ' | ' + light);
		var style = [
			{
			featureType: "poi",
			stylers: [
			  {
				  visibility: "off"
			  }
			]
		  },
		  {
			featureType: "landscape",
			stylers: [
			  {
				  visibility: "on"
			  },{
					color: "#eeeeee"
			  	},{
					saturation: sat
				},{
					lightness: light
				}
			]
		  },{
			featureType: "poi",
			elementType: "labels",
				"stylers": [{
				"visibility": "off"
			}]
		  },{
			featureType: "poi.park",
			stylers: [
			  {
				  visibility: "on"
			  },{
					color: "#6bb872"
			  	},{
					saturation: sat
				},{
					lightness: light
				}
			]
		  },{
			featureType: "road.arterial",
			stylers: [
			  {
				  visibility: "off"
			  }
			]
		  },{
			featureType: "road.local",
			stylers: [
			  {
				  visibility: "off"
			  }]
		  },{
			featureType: "water",
			stylers: [
			  {
				  visibility: "on"
			  },{
					color: "#87c7e1"
			  	},{
					saturation: sat
				},{
					lightness: light
				}
			]
		  },{
			featureType: "transit",
			stylers: [
			  {
				  visibility: "off"
			  },{
					color: "#87c7e1"
			  	}
			]
		  },{
			featureType: "road.highway",
			stylers: [
			  {
				  visibility: "off"
			  },{
					color: "#87c7e1"
			  	}
			]
		  },{
			elementType: "labels",
			stylers: [
			  {
				  visibility: "on"
			  },{
					color: "#b0b1b0"
			  	},{
					saturation: sat
				},{
					lightness: light
				}
			]
		  },{
			elementType: "labels.text.stroke",
			stylers: [
			  {
				  visibility: "off"
			  },{
					color: "#ffffff"
			  	}
			]
		  },{
			elementType: "labels.icon",
			stylers: [
			  {
				  visibility: "off"
			  },{
					color: "#ffffff"
			  	}
			]
		  }
		];
		
		/*var styleNight = [
		  {
			featureType: "landscape",
			stylers: [
			  {
				  visibility: "on"
			  },{
					color: "#3e3e3e"
			  	}
			]
		  },{
			featureType: "poi",
			stylers: [
			  {
				  visibility: "off"
			  }
			]
		  },{
			featureType: "poi",
			elementType: "labels",
				"stylers": [{
				"visibility": "off"
			}]
		  },{
			featureType: "poi.park",
			stylers: [
			  {
				  visibility: "on"
			  },{
					color: "#6c6c6c"
			  	}
			]
		  },{
			featureType: "road",
			elementType: "labels",
				"stylers": [{
				"visibility": "off"
			}]
		  },{
			featureType: "road.arterial",
			stylers: [
			  {
				  visibility: "off"
			  },
			  {
				color: "#e6e6e6"
			  }
			]
		  },{
			featureType: "road.local",
			stylers: [
			  {
				  visibility: "off"
			  },{
					color: "#e6e6e6"
			  	}
			], elementType: "labels",
				"stylers": [{
				"visibility": "off"
			}]
		  },{
			featureType: "water",
			stylers: [
			  {
				  visibility: "on"
			  },{
					color: "#b5b5b5"
			  	}
			]
		  },{
			featureType: "transit",
			stylers: [
			  {
				  visibility: "off"
			  },{
					color: "#87c7e1"
			  	}
			]
		  },{
			featureType: "road.highway",
			stylers: [
			  {
				  visibility: "off"
			  },{
					color: "#87c7e1"
			  	}
			]
		  },{
			elementType: "labels",
			stylers: [
			  {
				  visibility: "on"
			  },{
					color: "#ffffff"
			  	}
			]
		  },{
			elementType: "labels.text.stroke",
			stylers: [
			  {
				  visibility: "off"
			  },{
					color: "#ffffff"
			  	}
			]
		  },{
			elementType: "labels.icon",
			stylers: [
			  {
				  visibility: "off"
			  },{
					color: "#ffffff"
			  	}
			]
		  }
		];*/
		

	  var map = new google.maps.Map(document.getElementById('mapcanvas'),
		  mapOptions);
		  map.setOptions({
			  styles: style
		  });

	  var infowindow = new google.maps.InfoWindow({
		  maxWidth: 284
	  });
	  var image = '/images/map-marker.png';
	  var marker = new google.maps.Marker({
		  animation: google.maps.Animation.DROP,
		  position: new google.maps.LatLng(lat, lng),
		  map: map,
		  title: name,
		  icon: image
	  });
	  /*var contentString = '<div class="infowindow adr"><span class="name"><strong>Boxmodel Digital Media Limited</strong></span><span class="street-address">Toffee Factory</span><span class="street-address">Lower Steenbergs Yard</span><span class="addressLocality">Quayside, Ouseburn</span><span class="addressRegion">Newcastle upon Tyne</span><span class="postalCode">NE1 2DF</span><br><span class="telephone"><strong>Tel:</strong> +44(0)191 375 9116</span><span class="email"><strong>Email:</strong> info@boxmodeldigital.com</span></div>';
	  google.maps.event.addListener(marker, 'click', function () {
		  infowindow.setContent(contentString);
		  infowindow.open(map, marker);
	  });*/

	  ////// Map canvas height //////
	  $(window).resize(function () {
		  var headerHeight = $('header').height();
		  var introHeight = $('#intro').outerHeight();
		  var windowHeight = $(window).height();
		  var windowWidth = $(window).innerWidth();
		  if (windowWidth > 900) {
			  $('#mapcanvas').css('height', windowHeight - (introHeight + headerHeight) + 'px');
		  } else {
			  $('#mapcanvas').css('height', '500px');
		  }
	  }).resize();

	  $(document).on('click', '.locations', function() {
		  if ($('.primary').hasClass('active')) {
			  var otherLat = 52.3055205, otherLng = 0.4889108;
			  marker.setPosition(new google.maps.LatLng(otherLat, otherLng));
			  map.panTo(new google.maps.LatLng(otherLat, otherLng));
			  $('.primary').fadeOut(100, function(){
				  $(this).removeClass('active');
			  });
			  $('.secondary').fadeIn(100, function(){
				  $(this).addClass('active');
			  });
		  } else {
			  marker.setPosition(new google.maps.LatLng(lat, lng));
			  map.panTo(new google.maps.LatLng(lat, lng));
			  $('.secondary').fadeOut(100, function(){
				  $(this).removeClass('active');
			  });
			  $('.primary').fadeIn(100, function(){
				  $(this).addClass('active');
			  });
		  }
	  });
	}
    
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
    if (!($('#mediaCheck').css('display') == 'none')) {
    	var animationItem = $('.animation-block'), scrollPos = $(window).scrollTop();
	    for (var i = 0; i < animationItem.length; i++) {
	        var docBottom = $(window).scrollTop() + $(window).height(), itemPosTop = $(animationItem[i]).offset().top, itemPosBottom = itemPosTop + $(animationItem[i]).height();
	        if ((itemPosTop <= docBottom - 100) && (itemPosTop >= scrollPos)) {
	            $(animationItem[i]).addClass('animate');
	        }
	    }
    }
    
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
	
	//Parallax
	//Add this class on if supported
	if ($('.parallax').length && $('#mediaCheck').css('display') != 'none') {//If parallax is supported and is not a mobile device
		var movePos, scrolling = false;
		var pBlocks = $('.parallax-block');
		for (var i = 0; i < pBlocks.length; i++) {
			
			var blockHeight = $(pBlocks[i]).outerHeight();//Contains all parallax containers
			var move1 = blockHeight * 0, move2 = blockHeight * 0, move3 = blockHeight * 0;//Sets initial offset for parallax items
			var move1Str = move1 + 'px', move2Str = move2 + 'px', move3Str = move3 + 'px';//Creates strings to apply to elements
			
			$(pBlocks[i]).find('.level-1').css('-webkit-transform', 'translateY(' + move1Str + ')').attr('level-offset', move1).css('transform', 'translateY(' + move1Str + ')').attr('level-offset', move1);//Set offset for each parallax container parallax item
			$(pBlocks[i]).find('.level-2').css('-webkit-transform', 'translateY(' + move2Str + ')').attr('level-offset', move2).css('transform', 'translateY(' + move2Str + ')').attr('level-offset', move2);
			$(pBlocks[i]).find('.level-3').css('-webkit-transform', 'translateY(' + move3Str + ')').attr('level-offset', move3).css('transform', 'translateY(' + move3Str + ')').attr('level-offset', move3);
		}
        var time = 15;
        var start = 0;
		
		//Parallax block detection
		var ls = 0, animate, OSP = 0, diff;
		window.onscroll = function (e) {//If scrolling
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
                    //docBottom = bottom of viewport in px, from the top of the webpage
                    //itemPosTop = the elements top position from the top of the webpage
                    //itemPosBottom = the elements bottom position from the top of the webpage
                    //scrollPos = how far the page has scrolled from the top of the webpage
                    //IF (the elements top position is smaller or equal to the bottom of the viewport & the elements position from the top is bigger or equal to the scrolled amount) = The top of the element is in view
                    //IF (the elements top position is smaller or equal to the scroll amount & the elements bottom position is smaller or equal to the bottom of the viewport) = The top is out of view but the bottom is smaller then the bottom of the viewport
			        
			        if (((itemPosTop <= docBottom) && (itemPosTop >= scrollPos)) || ((itemPosTop <= scrollPos) && (itemPosBottom <= docBottom))) {//If parallax contain element is in view
                        var NSP = $(window).scrollTop();
                        if (NSP >= OSP) {
                            diff = NSP - OSP;
                        } else {
                            diff = OSP - NSP;   
                        }
                        OSP = NSP;
		            	move(parallaxItem[i], $(parallaxItem[i]).outerHeight(), scrollDown, diff);//Run move function
			        }
			    }
	   		}
		};
		function move(item, blockHeight, scrollDown, diff) {
			scrolling = true;//Scrolling event has started
            
            var lev1Pos = diff * 0.2;
            var lev2Pos = diff * 0.4;
            var lev3Pos = diff * 0.6;
            
			//var lev1Pos = blockHeight * 0.02, lev2Pos = blockHeight * 0.05, lev3Pos = blockHeight * 0.08;//Set the amount to move each element by within each scroll event
			var lev1Item = $(item).find('.level-1'), lev2Item = $(item).find('.level-2'), lev3Item = $(item).find('.level-3');//Find each of the parallax items within scroll event
            
			var lev1Offset = parseInt($(lev1Item).attr('level-offset'));
			var lev2Offset = parseInt($(lev2Item).attr('level-offset'));
			var lev3Offset = parseInt($(lev3Item).attr('level-offset'));
			
			//var lev1NV = lev1Offset - lev1Pos, lev2NV = lev2Offset - lev2Pos, lev3NV = lev3Offset - lev3Pos;
			var lev1Inc = lev1Pos / time, lev2Inc = lev2Pos / time, lev3Inc = lev3Pos / time;
			
			function animate() {
				start++;
				if (scrollDown == true) {//If scrolling down
					/*if (start >= (time * 0.7) && start < (time * 0.8)) {
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
					}*/
                        lev1Offset -= lev1Inc;
						lev2Offset -= lev2Inc;
						lev3Offset -= lev3Inc;
				} else {
					/*if (start >= (time * 0.7) && start < (time * 0.8)) {
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
					}*/
                        lev1Offset += lev1Inc;
						lev2Offset += lev2Inc;
						lev3Offset += lev3Inc;
				}
				
				$(lev1Item).attr('level-offset', lev1Offset).css('-webkit-transform', 'translateY(' + lev1Offset + 'px' + ')').css('transform', 'translateY(' + lev1Offset + 'px' + ')');
				$(lev2Item).attr('level-offset', lev2Offset).css('-webkit-transform', 'translateY(' + lev2Offset + 'px' + ')').css('transform', 'translateY(' + lev2Offset + 'px' + ')');
				$(lev3Item).attr('level-offset', lev3Offset).css('-webkit-transform', 'translateY(' + lev3Offset + 'px' + ')').css('transform', 'translateY(' + lev3Offset + 'px' + ')');
				
				
				if (start >= time) {
					start = 0, scrolling = false, scrollTotal = 0;
					window.cancelAnimationFrame(animate);
					return;
				}
				movePos = requestAnimationFrame(animate);
			}
			animate();
		}
	}
});