var initHeaderHeight = 130;
var initScoreSize = 60;

$(function() {


	sizeContent();
	
	function scrollToTop() {
		$(window).scrollTo(0, 500, {offset: 0, easing: 'easeOutQuad'});
	}
	
	// We only need the scroll to top on non-touch devices.
	if (!Modernizr.touch) {
		$('#topbadge').show().bind('click', function(e) {
			scrollToTop();
		});		
	} else {
		$('#topbadge').hide();
	};
		
	
	function sizeContent() {
	
		$('.tweet').css('height', $('.tweet').width()/2 );
		
		$('.smphoto').css('height', $('.smphoto').width() );
		
		$('.lgphoto').css('height', $('.lgphoto').width() );
		
	}
	
	
	$(window).resize(function() {
	
		sizeContent();
	});



	$(window).bind('scroll', function(e) {
		
	
		var winTop = $(window).scrollTop();
		
		if(winTop < 0) {return};
		
		var headerHeight = initHeaderHeight-winTop/3;
		
		
		
		var scoreSize = initScoreSize-winTop/3;
		var badgeY = $(window).height()-($('#topbadge').height()*(winTop/210));
		
		
		
		
		if (headerHeight >= 60) {
			$('#header').css('height', headerHeight);
			$('#header .number').css('fontSize', scoreSize);
			$('#header #navlogo').css('top', -winTop);
			$('#header .switch').css('opacity', 1-winTop/30);
			$('#topbadge').css({'top': badgeY, 'left': $(window).width()/2-$('#topbadge').width()/2 });
			//$('#header #navlogo').css('fontSize', 28-winTop/13);
		} 
		if (headerHeight < 60) {
			$('#header').css('height', 60);
			$('#topbadge').css({'top': $(window).height()-$('#topbadge').height() });
		}
		
		
		function adjustTopPadding(target, end) {
			$(target).css('paddingTop', end);
		}
	
	
		
	
	
	});





});