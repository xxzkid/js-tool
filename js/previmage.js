/*
 * 作者：xxzkid
 * 时间：2015-10-29
 * 描述：图片上传预览    IE是用了滤镜。
 */
(function() {
    window.previewImage = function(file) {
    	var div = document.getElementById('previmage');
    	var oldimg = div.firstChild;
    	var w = oldimg.style.width;
    	var h = oldimg.style.height;
    	//	console.log(w + ',' + h);
    	if (file.files && file.files[0]) {
    		div.innerHTML = "";
    		var img = document.createElement("img");
    		img.style.width = w;
    		img.style.height = h;
    		div.appendChild(img);
    		img.src = window.URL.createObjectURL(file.files[0]);
    	} else //兼容IE
    	{
    
    		file.select();
    		file.blur();
    		var imgSrc = document.selection.createRange().text;
    		//必须设置初始大小
    		div.style.width = w;
    		div.style.height = h;
    		//图片异常的捕捉，防止用户修改后缀来伪造图片
    		div.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
    		div.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
    		oldimg.style.display = "none";
    		document.selection.empty();
    	}
    }
})();