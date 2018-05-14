(function() {
	//  var cardA = $(".card_a");
	//  var cardB = $(".card_b");
	var container = $(".container");
	var playing = false;
	var isRequest = false;

	function showA(cardA, cardB) {
		cardA.css("display", "block")
		cardB.css("display", "none")
		cardA.addClass("showA")
		if(cardB.hasClass("showB")) {
			cardB.removeClass("cardB")
		}
	}

	function showB(cardA, cardB) {
		cardA.css("display", "none")
		cardB.css("display", "block")
		aVisible = false;
		cardB.addClass("showB")
		cardA.removeClass("showA")
		container.addClass("isFulfill")

	}
	//翻面函数
	function turnFromTo(from, to1) {
		if(!playing) {
			playing = true;
			var widthPrecent = 100;
			var speed = widthPrecent / 20;
			var id = setInterval(function() {
				widthPrecent -= speed;
				from.width(widthPrecent + "%")
				if(widthPrecent <= 0) {
					clearInterval(id);
					to1.width(0);
					id = setInterval(function() {
						widthPrecent += speed;
						if(widthPrecent >= 100) {
							widthPrecent = 100 + "%";
							clearInterval(id);
							playing = false;
						}
						to1.width(widthPrecent + "%");
					}, 20);
				}
			}, 20);
		}
	}

	function turnToA(cardB, cardA) {
		turnFromTo(cardB, cardA);
	}

	function turnToB(cardA, cardB) {
		turnFromTo(cardA, cardB);
	}

	function selectFrom(lowerValue, upPerValue) {
		var choices = upPerValue - lowerValue + 1
		return Math.floor(Math.random() * choices + lowerValue)
	}
	var sibImg = ["http://img1.wushang.com/img/2018/link/1.jpg","http://img1.wushang.com/img/2018/link/2.jpg","http://img1.wushang.com/img/2018/link/3.jpg","http://img1.wushang.com/img/2018/link/4.jpg","http://img1.wushang.com/img/2018/link/5.jpg","http://img1.wushang.com/img/2018/link/6.jpg","http://img1.wushang.com/img/2018/link/7.jpg","http://img1.wushang.com/img/2018/link/8.jpg","http://img1.wushang.com/img/2018/link/9.jpg","http://img1.wushang.com/img/2018/link/10.jpg"]
	var arr = [1,2,3,4,5,6,7,8,9]
function roa(arr)    //arr为可能出现的元素集合
{
    var temp=new Array();    //temp存放生成的随机数组
　  var count=arr.length;    
    for (i=0;i<count;i++)
    { 
        var num=Math.floor(Math.random()*arr.length); //生成随机数num
        temp.push(arr[num]);    //获取arr[num]并放入temp
        arr.splice(num,1);    
    }
    return temp;
}
var y = roa(arr);
console.log(roa(arr))
	$(".box").tap(function() {
		if(container.hasClass("isFulfill")) return;
		var num = selectFrom(0, 3)
//		console.log(num)
		var arrayImg = ["http://img1.wushang.com/img/2018/4/8/160602357648241120387358.png", "http://img2.wushang.com/img/2018/4/8/160602368324775229047039.png", "http://img1.wushang.com/img/2018/4/8/160602377378012656141091.png"]
		var smashedEggId = $(this).attr("id");
		var fromx = $("#" + smashedEggId + " .card_a"),
			tox = $("#" + smashedEggId + " .card_b");
		if($("#" + smashedEggId + " .card_b").hasClass("showB")) {
			//             	              turnToA(tox,fromx); 
			//                    setTimeout(function(){
			//                 	   showA($("#" + smashedEggId+" .card_a"),$("#" + smashedEggId+" .card_b"));
			//                 },500)
			return
		} else {
			$("#" + smashedEggId + " .card_b  img").attr("src", arrayImg[num])
			turnToB(fromx, tox);
			 $("#" + smashedEggId).siblings().each(function(i,v){
			 	var x = y[i];
			 	  $(this).find("img").attr("src",sibImg[x])
			 	  console.log(x)
			 });
			
			 console.log($("#" + smashedEggId).siblings().find("img").length)
			setTimeout(function() {
				showB($("#" + smashedEggId + " .card_a"), $("#" + smashedEggId + " .card_b"));
			}, 500)
			setTimeout(function() {
				showB($(".card_a"), $(".card_b"));
			}, 1500)

		}

	})
})();