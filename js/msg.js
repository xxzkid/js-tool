/*
 * 作者：xxzkid
 * 时间：2015-10-29
 * 描述：消息框
 */
(function(){
	window.msg = (function(){
		
		var rect = function() {
			var width = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
			var height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
			var w = 280;
			var h = 100;
			var left = width / 2 - w / 2;
			var top = height / 2 - h / 2;
			var zIndex = 999;
			var color = "#fff";
			return { "width": width, "height": height, "left": left, "top": top, "w": w, "h": h, "zIndex": zIndex, "color": color };
		};
		
		var openlayer = function() {
			var div = document.createElement("div");
			div.id = "xxxxlayer";
			var r = rect();
			console.log(r);
			div.style.width = r.width + "px";
			div.style.height = r.height + "px";
			div.style.position = "absolute";
			div.style.left = "0px";
			div.style.top = "0px";
			div.style.zIndex = 998;
			div.style.background = "#000";
			div.style.filter = "alpha(opacity=10)";
			div.style.opacity = "0.20";
			document.body.appendChild(div);
		};
		
		function alert(title, msg) {
			openlayer();
			var r = rect();
			var div = document.createElement("div");
			div.id = "xxxxalert";
			div.style.position = "fixed";
			div.style.left = r.left + "px";
			div.style.top = r.top + "px";
			div.style.width = r.w + "px";
			div.style.height = r.h + "px";
			div.style.zIndex = r.zIndex;
			div.style.background = r.color;
			
			var hg = 20;
			var marginRight = 10;
			var marginLeft = 10;
			var topdiv = document.createElement("div");
			div.appendChild(topdiv);
			topdiv.style.height = hg + "px";
			
			var titlep = document.createElement("p");
			topdiv.appendChild(titlep);
			titlep.innerText = title;
			titlep.style.float = "left";
			titlep.style.width = r.w / 2 - marginLeft + "px";
			titlep.style.height = hg + "px";
			titlep.style.marginTop = "0px";
			titlep.style.marginLeft = marginLeft + "px";
			titlep.style.lineHeight = hg + "px";
	
			var closep = document.createElement("p");
			topdiv.appendChild(closep);
	
			closep.style.cursor = "pointer";
			closep.style.float = "right";
			closep.style.marginTop = "0px";
			closep.style.marginRight = marginRight + "px";
			closep.style.width = r.w / 2 - marginRight + "px";
			closep.style.height = hg + "px";
			closep.style.textAlign = "right";
			closep.style.lineHeight = hg + "px";
			closep.innerText = "x";
			closep.addEventListener("click", function() {
				document.getElementById("xxxxlayer").remove();
				document.getElementById("xxxxalert").remove();
			});
	
			var centerdiv = document.createElement("div");
			div.appendChild(centerdiv);
	
			var txtp = document.createElement("p");
			centerdiv.appendChild(txtp);
			txtp.innerText = msg;
			txtp.style.textAlign = "center";
			txtp.style.width = r.w + "px";
			txtp.style.height = r.h - hg + "px";
	
			document.body.appendChild(div);
		}
		
		function confirm(title, msg, callback) {
			openlayer();
			var r = rect();
			var div = document.createElement("div");
			div.id = "xxxxconfirm";
			div.style.position = "fixed";
			div.style.width = r.w + "px";
			div.style.height = r.h + "px";
			div.style.left = r.left + "px";
			div.style.top = r.top + "px";
			div.style.zIndex = r.zIndex;
			div.style.background = r.color;
			
			var hg = 20;
			var marginRight = 10;
			var marginLeft = 10;
			var topdiv = document.createElement("div");
			div.appendChild(topdiv);
			topdiv.style.width = r.w + "px";
			topdiv.style.height = hg + "px";
			
			var titlep = document.createElement("p");
			topdiv.appendChild(titlep);
			titlep.style.width = r.w / 2 - marginLeft + "px";
			titlep.style.height = hg + "px";
			titlep.style.float = "left";
			titlep.style.marginLeft = marginLeft + "px";
			titlep.style.lineHeight = hg + "px";
			titlep.style.marginTop = "0px";
			titlep.innerText = title;
			
			var closep = document.createElement("p");
			topdiv.appendChild(closep);
			closep.style.width = r.w / 2 - marginRight + "px";
			closep.style.height = hg + "px";
			closep.style.textAlign = "right";
			closep.style.float = "right";
			closep.style.marginTop = "0px";
			closep.style.cursor = "pointer";
			closep.style.marginRight = marginRight + "px";
			closep.style.lineHeight = hg + "px";
			closep.innerText = "x";
			closep.addEventListener("click", function(){
				document.getElementById("xxxxlayer").remove();
				document.getElementById("xxxxconfirm").remove();
			});
			
			var centerdiv = document.createElement("div");
			div.appendChild(centerdiv);
			centerdiv.style.height = r.h - (hg * 2) + "px";
			centerdiv.style.textAlign = "center";
			centerdiv.innerText = msg;
			
	
			var bottomdiv = document.createElement("div");
			div.appendChild(bottomdiv);
			bottomdiv.style.height = hg + "px";
			
			var okdiv = document.createElement("div");
			bottomdiv.appendChild(okdiv);
			okdiv.style.width = r.w / 2 + "px";
			okdiv.style.height = hg + "px";
			okdiv.style.float = "left";
			okdiv.style.textAlign = "center";
			okdiv.style.cursor = "pointer";
			okdiv.innerText = "确定";
			okdiv.addEventListener("click", function(){
				document.getElementById("xxxxlayer").remove();
				document.getElementById("xxxxconfirm").remove();
				if(typeof(callback) === 'function'){
					callback(true);
				}
			});
			
			var canceldiv = document.createElement("div");
			bottomdiv.appendChild(canceldiv);
			canceldiv.style.width = r.w / 2 + "px";
			canceldiv.style.height = r.h + "px";
			canceldiv.style.float = "left";
			canceldiv.style.textAlign = "center";
			canceldiv.style.cursor = "pointer";
			canceldiv.innerText = "取消";
			canceldiv.addEventListener("click", function(){
				document.getElementById("xxxxlayer").remove();
				document.getElementById("xxxxconfirm").remove();
				if(typeof(callback) === 'function'){
					callback(false);
				}
			});
	
			document.body.appendChild(div);
		}
		
		return {
			alert : alert,
			confirm : confirm
		};
	})();
	
})();
