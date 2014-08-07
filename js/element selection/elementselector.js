

var Marker = function() {
	
	var mark = document.createElement('div');
	var self = this;
	
	this.setElementDimension = function(el) {
		if(el.getAttribute('data-marker')) {
			return false;
		}
		
		var top = el.offsetTop,
			left = el.offsetLeft,
			height = el.offsetHeight,
			width = el.offsetWidth;
		
		var target = el;
		
		resetPosition();
		
		while(target=target.offsetParent) {
			left += target.offsetLeft;
			target = el;
			while(target=target.offsetParent) {
				top += target.offsetTop;
			
				left += document.body.offsetLeft;
				top += document.body.offsetTop;

				mark.style.top = top;
				mark.style.left = left;
				mark.style.height = height;
				mark.style.width = width;
				return this;
			}
		}
	}

	function resetPosition() {
		mark.style.top = 0;
		mark.style.left = 0;
		mark.style.height = 0;
		mark.style.width = 0;	
	}

	this.show =function() {
		mark.style.display = "block";
		mark.addEventListener('dblclick',hide,false);
	}

	function hide() {
		mark.style.display = "none";
		mark.removeEventListener('dblclick',hide);
	}

	function markerNavigation() {
		var but = document.createElement('button');
		but.innerHTML = "edit";
		but.style.cssText = "position:absolute;top:-5px;right:-40px";
		but.setAttribute('data-marker','true');
		return but;
	}
	function init() {
	
		mark.style.cssText = "position:absolute; border: 2px dashed gray; box-sizing: border-box";
		mark.style.display = "none";
		mark.setAttribute('data-marker','true');
		var but = markerNavigation();
		mark.appendChild(but);
		
		document.getElementsByTagName("body")[0].appendChild(mark);
	}

	init();
}

var ElementSelection = (function() {
	
	var marker = null;

	function init() {
		marker = new Marker();
		document.addEventListener('click',function(event) {
			var target = event.target;
			//single marker
			marker.setElementDimension(target).show();
		},false)
	}
	
	return {
		init : init
	}
})();
