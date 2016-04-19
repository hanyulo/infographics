"use strict";function setBirdViewAnimation(){for(var e=function(e){!function(t){var i=window.setTimeout(function(){playBirdviewSlide(t)},2e3*e);birdviewTimeouts.push(i)}(e)},t=0;6>=t;t++)e(t)}function clearBirdViewAnimation(){for(var e=0;7>=e;e++)window.clearTimeout(birdviewTimeouts[e]);birdviewTimeouts=[]}function enbaleSmoothScroll(){$('a[href*="#chapter"]:not([href="#"])').click(function(){if(location.pathname.replace(/^\//,"")==this.pathname.replace(/^\//,"")&&location.hostname==this.hostname){var e=$(this.hash);if(e=e.length?e:$("[name="+this.hash.slice(1)+"]"),e.length)return $("body").animate({scrollTop:e.offset().top},800),!1}})}function getClosest(e,t){var i=0;e-=5,0>e&&(e=0);for(var a=1e4,n=t.length;n--;){var r=Math.abs(e-t[n]);a>r&&(a=r,i=n)}return i}function playBirdviewSlide(e){if($(".birdview-box").css("z-index",0),birdviewSlider){for(var t=0;t<SLIDE_POSITION.length;t++)t!==e&&$("#"+t+"-birdview").fadeTo("fast",0);$("#"+e+"-birdview").css("opacity","1"),$("#"+e+"-birdview").css("z-index",5),birdviewSlider.slider("setValue",100-SLIDE_POSITION[e])}}function checkSlider(e){var t=$(e);t.find(".item:first").hasClass("active")?(t.find(".left-btn").attr("src","images/left_btn.svg"),t.find(".right-btn").attr("src","images/right_btn_active.svg")):t.find(".item:last").hasClass("active")?(t.find(".left-btn").attr("src","images/left_btn_active.svg"),t.find(".right-btn").attr("src","images/right_btn.svg")):(t.find(".left-btn").attr("src","images/left_btn_active.svg"),t.find(".right-btn").attr("src","images/right_btn_active.svg"))}function enableBlurBackground(e,t){new ScrollMagic.Scene({triggerElement:e,triggerHook:"onLeave",offset:"50%"}).on("start",function(){ga("send","event","interactive","scroll",e)}).setVelocity(e+" .blurred-image",{opacity:1},{duration:500,easing:"linear"}).addTo(t)}function setChapterActiveColor(e,t){new ScrollMagic.Scene({triggerElement:"#chapter-0"+e,triggerHook:"onEnter",offset:120,duration:$("#chapter-0"+e).height()+130}).setClassToggle("#btn-0"+e,"active").addTo(t)}function initMap(){var e=new google.maps.StyledMapType(styles,{name:"Styled Map"}),t=Math.max(document.documentElement.clientWidth,window.innerWidth||0),i=t>480,a={zoom:11,draggable:i,scrollwheel:!1,center:new google.maps.LatLng(22.8702492,120.4703258),mapTypeControlOptions:{mapTypeIds:[google.maps.MapTypeId.ROADMAP,"map_style"]}};map=new google.maps.Map(document.getElementById("map"),a),map.mapTypes.set("map_style",e),map.setMapTypeId("map_style"),map.setOptions({styles:styles,mapTypeControl:!1});var n="images/layer_agriculture.svg",r="images/layer_specific_agriculture.svg",o="images/layer_mountain.svg",l="images/layer_contour.svg",s={north:23.0079,south:22.7462,east:120.679,west:120.2666},c={opacity:.9};tapWaterLayer=new google.maps.Data,tapWaterLayer.loadGeoJson("assets/TWQPROT.json"),tapWaterLayer.setStyle({fillColor:"#c7997d",strokeWeight:0,opacity:.25}),tapWaterLayer.setMap(map),groundwaterLayer=new google.maps.Data,groundwaterLayer.loadGeoJson("assets/GWREGION.json"),groundwaterLayer.setStyle({fillColor:"#9cb5bc",strokeWeight:0,opacity:.25}),groundwaterLayer.setMap(map),agricultureOverlay=new google.maps.GroundOverlay(n,s,c),agricultureOverlay.setMap(map),specificOverlay=new google.maps.GroundOverlay(r,s,c),specificOverlay.setMap(map),mountainOverlay=new google.maps.GroundOverlay(o,s,c),mountainOverlay.setMap(map),contourOverlay=new google.maps.GroundOverlay(l,s,c),contourOverlay.setMap(map);var d=new google.maps.Marker({position:new google.maps.LatLng(22.949986,120.516294),title:"旗山污染場址",icon:"images/map-icon.png",animation:google.maps.Animation.DROP});d.setMap(map)}function setToggle(e,t){e?t.setMap(map):t.setMap(null)}function setAgricultureToggle(){agricultureOn=!agricultureOn,setToggle(agricultureOn,agricultureOverlay)}function setSpecificToggle(){specificOn=!specificOn,setToggle(specificOn,specificOverlay)}function setMountainToggle(){mountainOn=!mountainOn,setToggle(mountainOn,mountainOverlay)}function setTapWaterToggle(){tapWaterOn=!tapWaterOn,setToggle(tapWaterOn,tapWaterLayer)}function setGroundWaterToggle(){groundwaterOn=!groundwaterOn,setToggle(groundwaterOn,groundwaterLayer)}var ANIMATION={fadeInUp:{opacity:[1,0],translateY:[0,"100%"]}},SLIDE_POSITION=[3,26,40,51,62,83,96],TICK_POSITION=[97,74,60,49,38,17,4],birdviewSlider=void 0,birdviewTimeouts=[];$(document).ready(function(){var e=!1;$('[data-toggle="tooltip"]').tooltip(),$(".burger-icon").click(function(){e=!e,e?($(".nav-container").show(),$(".burger-icon").addClass("open")):($(".nav-container").hide(),$(".burger-icon").removeClass("open"))});var t=$(".nav-icon").width();$(".nav-icon").css({"min-height":t+"px"});var i=new ScrollMagic.Controller;enbaleSmoothScroll();for(var a=1;7>a;a++)enableBlurBackground("#cover-0"+a,i);new ScrollMagic.Scene({triggerElement:"#g-soil",triggerHook:"onEnter",offset:0}).on("start",function(){$(".soil-bottom").velocity(ANIMATION.fadeInUp,{delay:100,duration:300}),$(".soil-middle").velocity(ANIMATION.fadeInUp,{delay:100,duration:600}),$(".soil-top").velocity(ANIMATION.fadeInUp,{delay:100,duration:1e3}),$(".soil-tree").velocity(ANIMATION.fadeInUp,{delay:100,duration:1200})}).addTo(i),new ScrollMagic.Scene({triggerElement:"#scene-birdview",triggerHook:"onEnter",offset:0}).on("start",function(){clearBirdViewAnimation(),setBirdViewAnimation()}).addTo(i);$(".carousel").carousel({interval:!1}),$(".carousel").bcSwipe({threshold:50}),$("#environment-slider").on("slid.bs.carousel",function(){checkSlider("#environment-slider .carousel-inner")}),$("#slag-slider").on("slid.bs.carousel",function(){checkSlider("#slag-slider .carousel-inner")}),$(".nav-icon").mouseover(function(){var e=this.id;switch($(".nav-description").velocity({top:$(this).position().top,opacity:1},{easing:"easeInSine",duration:300}),e){case"btn-01":$("#nav-hover-id").text("1-1"),$("#nav-title").text("香蕉樹旁埋爐碴？");break;case"btn-02":$("#nav-hover-id").text("1-2"),$("#nav-title").text("案發現場");break;case"btn-03":$("#nav-hover-id").text("1-3"),$("#nav-title").text("疑點重重");break;case"btn-04":$("#nav-hover-id").text("2-1"),$("#nav-title").text("碴不只一種");break;case"btn-05":$("#nav-hover-id").text("2-2"),$("#nav-title").text("中央出來面對！");break;case"btn-06":$("#nav-hover-id").text("人物"),$("#nav-title").text("大家都驚死，只有她往前衝")}}),$(".nav-icon").mouseout(function(){$(".nav-description").velocity("stop",!0),$(".nav-description").velocity({opacity:0},{easing:"easeInSine",duration:50})});var n=$(window).width()/100*59,r=.84,o=0;$(window).width()<768&&(o=$("#6-birdview .birdview-description").height(),r=.7),$(window).width()<=768&&(n=$(window).width()/100*89),$("#scene-birdview").css("min-height",o+n+10),$(".birdview-slider").css({height:n*r,transform:"translate(0,"+n*((1-r)/2)+"px)"}),birdviewSlider=$("#bvSlider").slider({reversed:!0,ticks:TICK_POSITION}),$("#bvSlider").on("slideStop",function(){var e=birdviewSlider.slider("getValue"),t=getClosest(100-e,SLIDE_POSITION);playBirdviewSlide(t)});for(var l=1;7>l;l++)setChapterActiveColor(l,i)});var styles=[{featureType:"administrative",elementType:"labels.text.fill",stylers:[{color:"#444444"}]},{featureType:"landscape",elementType:"all",stylers:[{color:"#f2f2f2"}]},{featureType:"poi",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"all",stylers:[{saturation:-100},{lightness:45}]},{featureType:"road.highway",elementType:"all",stylers:[{visibility:"simplified"}]},{featureType:"road.arterial",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"all",stylers:[{color:"#46bcec"},{visibility:"on"}]}],map=void 0,agricultureOverlay=void 0,specificOverlay=void 0,mountainOverlay=void 0,contourOverlay=void 0,tapWaterLayer=void 0,groundwaterLayer=void 0,agricultureOn=!0,specificOn=!0,mountainOn=!0,contourOn=!0,tapWaterOn=!0,groundwaterOn=!0;