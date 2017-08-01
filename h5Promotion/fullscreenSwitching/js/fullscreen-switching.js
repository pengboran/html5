(function($){
	var defaults = {
		'container' : '#container',//容器
		'sections' : '.section',//子容器
		'easing' : 'ease',//特效方式，ease-in,ease-out,linear
		'duration' : 1000,//每次动画执行的时间
		'pagination' : true,//是否显示分页
		'loop' : false,//是否循环
		'keyboard' : true,//是否支持键盘
		'direction' : 'vertical',//滑动的方向 horizontal,vertical
		'onpageSwitch' : true//允许点击分页按钮切换到对于页面
	};

	var win = $(window),
		container,sections;

	var opts = {},
		canScroll = true;

	var iIndex = 0;

	var arrElement = [];

	var pages;

	var Click = 'click';

	var timeScroll ;//滚动间隔定时器

	var SP = $.fn.switchPage = function(options){
		opts = $.extend({}, defaults , options||{});

		container = $(opts.container);
		sections = container.find(opts.sections);

		sections.each(function(){
			arrElement.push($(this));
		});

		return this.each(function(){
			if(opts.direction == "horizontal"){//横向布局
				initLayout();
			}

			if (typeof Zepto === 'function') {// Zepto库:滑动手势切换
				// 页面高度超过设备可见高度时，阻止掉touchmove事件。
				document.body.addEventListener('touchmove', function (event) {
				    event.preventDefault();
				}, false);
				Click = 'tap';// 使用tap事件代替click事件
				if (opts.direction === "horizontal") {
					container
					.on('swipeRight',function(){
						SP.moveSectionUp();
					})
					.on('swipeLeft',function(){
						SP.moveSectionDown();
					});
				}else{
					container
					.on('swipeDown',function(){
						SP.moveSectionUp();
					})
					.on('swipeUp',function(){
						SP.moveSectionDown();
					});
				}
			}else{// jQuery库:滚动条切换
				$(document).on("mousewheel DOMMouseScroll", MouseWheelHandler);//绑定重写鼠标滑动事件
			}

			if(opts.pagination){//分页
				initPagination();
			}

			if(opts.keyboard){//键盘事件
				keyDown();
			}
		});
	};

	//滚轮向上滑动事件
	SP.moveSectionUp = function(){
		if(iIndex){
			iIndex--;
		}else if(opts.loop){
			iIndex = arrElement.length-1;
		}
		scrollPage(arrElement[iIndex]);
	};

	//滚轮向下滑动事件
	SP.moveSectionDown = function(){
		if(iIndex<(arrElement.length-1)){
			iIndex++;
		}else if(opts.loop){
			iIndex = 0;
		}
		scrollPage(arrElement[iIndex]);
	};


	//私有方法
	//页面滚动事件
	function scrollPage(element){
		var dest = element.position();
		if(typeof dest === 'undefined'){ return; }
		initEffects(dest,element);
	}

	//重写鼠标滑动事件
	function MouseWheelHandler(e) {
		e.preventDefault();
		var value = e.originalEvent.wheelDelta || -e.originalEvent.detail;
		var delta = Math.max(-1, Math.min(1, value));
		if(canScroll){
			if (delta < 0) {
				SP.moveSectionDown();
			}else {
				SP.moveSectionUp();
			}
		}
		return false;
	}
	
	//横向布局初始化
	function initLayout(){
		var length = sections.length,
			width = (length*100)+"%",
			cellWidth = (100/length).toFixed(2)+"%";
		container.width(width).addClass("left");
		sections.width(cellWidth).addClass("left");
	}

	//初始化分页
	function initPagination(){
		var length = sections.length;
		if(length){

		}
		var pageHtml = '<ul id="pages"><li class="active"></li>';
		for(var i=1;i<length;i++){
			pageHtml += '<li></li>';
		}
		pageHtml += '</ul>';
		$("body").append(pageHtml);

		pages = $("#pages li");//记录所有的分页按钮

		// 给分页按钮绑定点击事件
		if (opts.onpageSwitch) {
			pages
			.css('cursor', 'pointer')
			.on( Click, function() {
				iIndex = $(this).index();
				scrollPage(arrElement[iIndex]);
				paginationHandler();
			});
		}
	}

	//分页事件
	function paginationHandler(){
		pages.eq(iIndex).addClass("active").siblings().removeClass("active");
	}

	//是否支持css的某个属性
	function isSuportCss(property){
		var body = $("body")[0];
		for(var i=0; i<property.length;i++){
			if(property[i] in body.style){
				return true;
			}
		}
		return false;
	}

	//渲染效果
	function initEffects(dest,element){
		var transform = ["-webkit-transform","-ms-transform","-moz-transform","transform"],
			transition = ["-webkit-transition","-ms-transition","-moz-transition","transition"];

		canScroll = false;

		if(isSuportCss(transform) && isSuportCss(transition)){
			var traslate = "";
			if(opts.direction == "horizontal"){
				traslate = "-"+dest.left+"px, 0px, 0px";
			}else{
				traslate = "0px, -"+dest.top+"px, 0px";
			}
			container.css({
				"-webkit-transition":"all "+opts.duration+"ms "+opts.easing,
				"transition":"all "+opts.duration+"ms "+opts.easing,
				"-webkit-transform":"translate3d("+traslate+")",
				"transform":"translate3d("+traslate+")"
			});
			
			// 切换过渡动画结束后，允许第二次滚动
			/*container.on("webkitTransitionEnd msTransitionend mozTransitionend transitionend",function(){
				canScroll = true; //chrome动画结束判断与其他浏览器不一致，导致其滚动切换过快时BUG
			});*/

			// 一定时间间隔后，允许第二次滚动
			clearTimeout(timeScroll);
			timeScroll = setTimeout(function(){container.css({"transition":"none"});canScroll = true;},opts.duration);
		}else{
			var cssObj = (opts.direction == "horizontal")?{left: -dest.left}:{top: -dest.top};
			container.animate(cssObj, opts.duration, function(){
				canScroll = true;
			});
		}
		element.addClass("active").siblings().removeClass("active");
		if(opts.pagination){
			paginationHandler();
		}
	}

	//窗口Resize
	var resizeId;
	win.resize(function(){
		clearTimeout(resizeId);
		resizeId = setTimeout(function(){
			reBuild();
		},500);
	});

	function reBuild(){
		var currentHeight = win.height(),
			currentWidth = win.width();

		var element = arrElement[iIndex];
		if(opts.direction == "horizontal"){
			var offsetLeft = element.offset().left;
			if(Math.abs(offsetLeft)>currentWidth/2 && iIndex <(arrElement.length-1)){
				iIndex ++;
			}
		}else{
			var offsetTop = element.offset().top;
			if(Math.abs(offsetTop)>currentHeight/2 && iIndex <(arrElement.length-1)){
				iIndex ++;
			}
		}
		if(iIndex){
			paginationHandler();
			var cuerrentElement = arrElement[iIndex],
				dest = cuerrentElement.position();
			initEffects(dest,cuerrentElement);
		}
	}

	//绑定键盘事件
	function keyDown(){
		var keydownId;
		win.keydown(function(e){
			clearTimeout(keydownId);
			keydownId = setTimeout(function(){
				var keyCode = e.keyCode;
				if(keyCode == 37||keyCode == 38){
					SP.moveSectionUp();
				}else if(keyCode == 39||keyCode == 40){
					SP.moveSectionDown();
				}
			},150);
		});
	}

})($);