jQuery(function( $ ){
  
  var animationSpeed = 800;
  var headerHeight = 71;
  var halfSlideWidth = 410;
  var halfSlideHeight = 300;
  var slideCount = 16;
  var currentFocus = $("#slide0");
  
  // This one is important, many browsers don't reset scroll on refreshes
  // Reset all scrollable panes to (0,0)
  var $scrollArea = $('#container');
  $scrollArea._scrollable();
  
  // Reset the screen to (0,0)
  $.scrollTo( 0 );
  $scrollArea.scrollTo( currentFocus, {margin:true});
  
  
  //set the scrollArea widht and height to the window width and height for overflow: hidden
  $scrollArea.width('100%');
  $scrollArea.height($(window).height() - headerHeight + 2);
  
  var xOffset = $scrollArea.width()/2 - halfSlideWidth;
  var yOffset = $scrollArea.height()/2 - halfSlideHeight;

  $(window).resize(function (){
    xOffset = $scrollArea.width()/2 - halfSlideWidth;
    yOffset = $scrollArea.height()/2 - halfSlideHeight;
    
    $scrollArea.width('100%');
    $scrollArea.height($(window).height() - headerHeight);
  });
  
  //intercept any clicks on 'a', 'li', or 'img' elements to prevent events from occuring on unfocused slides
  $('a').on('click', function(e){
  		var $target = $(e.target);
  		if($target.parents('div').hasClass('unfocus'))
  		{
  			e.preventDefault();
  		}
	});
	
  $('li').on('click', function(e){
  		var $target = $(e.target);
  		if($target.parents('div').hasClass('unfocus'))
  		{
  			e.stopPropogation();
  		}
	});
	
  /*$('img').on('click', function(e){
  		var $target = $(e.target);
  		if($target.parents('div').hasClass('unfocus'))
  		{
  			e.stopPropogation();
  		}
	});*/
	
  $('.navigationLeft').on('click', function(e){
    		var $target = $(e.target);
    		if($target.parents('div').hasClass('unfocus'))
    		{
    			e.stopPropogation();
    		}
  });
  
  $('.navigationRigh').on('click', function(e){
    		var $target = $(e.target);
    		if($target.parents('div').hasClass('unfocus'))
    		{
    			e.stopPropogation();
    		}
  });
    
    
  $('#headerName').click(function(){
        $scrollArea.scrollTo( '#slide0', animationSpeed, {easing:'easeInOutExpo', margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide0').removeClass('unfocus').addClass('focus');
    });
    
  
  $('#welcome').click(function(){
        $scrollArea.scrollTo( '#slide0', animationSpeed, {easing:'easeInOutExpo', margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide0').removeClass('unfocus').addClass('focus');  
    });
    
  $('#me').click(function(){
        $scrollArea.scrollTo( '#slide1', animationSpeed, {easing:'easeInOutExpo', offset: {left:-xOffset}, margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide1').removeClass('unfocus').addClass('focus');
  });
  
  $('#philosophy').click(function(){
        $scrollArea.scrollTo( '#slide2', animationSpeed, {easing:'easeInOutExpo', margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide2').removeClass('unfocus').addClass('focus');
  });
  
  $('#p0').click(function(){
        $scrollArea.scrollTo( '#slide3', animationSpeed, {easing:'easeInOutExpo', offset: {top:-yOffset}, margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide3').removeClass('unfocus').addClass('focus');
  });
  
  $('#p1').click(function(){
        $scrollArea.scrollTo( '#slide4', animationSpeed, {easing:'easeInOutExpo', offset: {top:-yOffset, left:-xOffset}, margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide4').removeClass('unfocus').addClass('focus');
  });
    
  $('#p2').click(function(){
        $scrollArea.scrollTo( '#slide5', animationSpeed, {easing:'easeInOutExpo', offset: {top:-yOffset}, margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide5').removeClass('unfocus').addClass('focus');
  });
  
  $('#p3').click(function(){
        $scrollArea.scrollTo( '#slide6', animationSpeed, {easing:'easeInOutExpo', offset: {top:-yOffset}, margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide6').removeClass('unfocus').addClass('focus');
  });
    
  $('#p4').click(function(){
        $scrollArea.scrollTo( '#slide7', animationSpeed, {easing:'easeInOutExpo', offset: {top:-yOffset, left:-xOffset}, margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide7').removeClass('unfocus').addClass('focus');
  });
  
  $('#p5').click(function(){
        $scrollArea.scrollTo( '#slide8', animationSpeed, {easing:'easeInOutExpo', offset: {top:-yOffset}, margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide8').removeClass('unfocus').addClass('focus');
  });
  
  $('#p6').click(function(){
        $scrollArea.scrollTo( '#slide9', animationSpeed, {easing:'easeInOutExpo', offset: {top:-yOffset}, margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide9').removeClass('unfocus').addClass('focus');
  });
  
  $('#p7').click(function(){
        $scrollArea.scrollTo( '#slide10', animationSpeed, {easing:'easeInOutExpo', offset: {top:-yOffset, left:-xOffset}, margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide10').removeClass('unfocus').addClass('focus');
  });
  
   $('#p8').click(function(){
        $scrollArea.scrollTo( '#slide11', animationSpeed, {easing:'easeInOutExpo', offset: {top:-yOffset}, margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide11').removeClass('unfocus').addClass('focus');
  });
    
    $('#p9').click(function(){
        $scrollArea.scrollTo( '#slide12', animationSpeed, {easing:'easeInOutExpo', offset: {top:-yOffset}, margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide12').removeClass('unfocus').addClass('focus');
  });
  
  $('#p10').click(function(){
        $scrollArea.scrollTo( '#slide13', animationSpeed, {easing:'easeInOutExpo', offset: {top:-yOffset, left:-xOffset}, margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide13').removeClass('unfocus').addClass('focus');
  });
  
   $('#p11').click(function(){
        $scrollArea.scrollTo( '#slide14', animationSpeed, {easing:'easeInOutExpo', offset: {top:-yOffset}, margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide14').removeClass('unfocus').addClass('focus');
  });
    
  $('#p12').click(function(){
        $scrollArea.scrollTo( '#slide15', animationSpeed, {easing:'easeInOutExpo', offset: {top:-yOffset}, margin:true});
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $('#slide15').removeClass('unfocus').addClass('focus');
  });
  
  
  	//handles on click events for slides
  	$('.slide').click(function(){
  		var slideID = "#" + this.id;
  		var slideNum = this.id.substring(5);
  		
			//first row middle and last row middle
  		if (slideNum == 1) 
  		{
  			$scrollArea.scrollTo( slideID, animationSpeed, {easing:'easeInOutExpo', offset:{left:-xOffset}, margin:true});
  		}
			
			//second row through n-1 rows first and third slide	
  		else if(slideNum == 3 || slideNum == 5 || slideNum == 6 || slideNum == 8 || slideNum == 9 || slideNum == 11 || slideNum == 12 || slideNum == 14)
  		{
  			$scrollArea.scrollTo( slideID, animationSpeed, {easing:'easeInOutExpo', offset:{top:-yOffset}, margin:true});
  		}
			
			// middle slide
  		else if (slideNum == 4 || slideNum == 7 || slideNum == 10 || slideNum == 13)
  		{
  			$scrollArea.scrollTo( slideID, animationSpeed, {easing:'easeInOutExpo', offset: {top:-yOffset, left:-xOffset}, margin:true});
  		}
  		else
  		{
  			$scrollArea.scrollTo(slideID, animationSpeed, {easing:'easeInOutExpo', margin:true});
  		}
        $scrollArea.find('div.focus').removeClass('focus').addClass('unfocus');
        $(slideID).removeClass('unfocus').addClass('focus');
    });
 
  //This code controls slideshows
  $('#ss2').serialScroll({
      items:'.subslide',
      prev: '#slide2 > .navigationLeft',
      next: '#slide2 > .navigationRight',
	  start: 0,
	  duration: animationSpeed,
	  force: true,
	  constant: false,
	  stop: false,
	  lock: false,
	  cycle: true,
     onBefore:function(e, elem, $pane, $items, pos){
       //$('#navigation1').find('li.selected').removeClass('selected').addClass('unselected');
       //$('#navigation1').find('li').eq(pos).removeClass('unselected').addClass('selected');
      }
   });

});