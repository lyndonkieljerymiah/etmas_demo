var PBAdminPanelClass = (function() {
	
	var adminPanel = NULL;

	
	function init() {
		adminPanel = $('#pbAdminPanel');
		if(!adminPanel) return false;
		adminPanel.addEvent('click',handleClick);
	}

	function handleClick(e) {
		var target = $(e.target);
		if(target.getAttr)
	}

})()