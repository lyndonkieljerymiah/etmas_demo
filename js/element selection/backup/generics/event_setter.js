var Action = Action || {};
Action.Action = function (newLabel) {

    var actions = new Array();
    var label = newLabel;
    var id = null;
    var eventType = null;
    var actionType = null;
    var actionFunction = null;
    var element = null;
    this.printout = function () {

        var len = actions.length;
        var i = 0;
        for (i = 0; i < len; i++) {
            console.log('  individual ' + newLabel + ' ' + actions[i].reference + ' ' + actions[i].eventType + ' ' + actions[i].state + ' ' + actions.length);
        }
    }
    this.getLabel = function () {
        return label;
    }
    this.getLength = function () {
        return actions.length;
    }
    this.getActionObjectAt = function (i) {
        return actions[i];
    }
    this.setSourceElement = function (newEl) {
        element = newEl;
    }
    this.setSourceId = function (newId) {
        id = newId;
        element = document.getElementById(id);
    }
    this.executeAction = function (actionName) {
        if (element) {
            var len = actions.length;

            var i = 0;
            var selectedAction = null;
            for (i = 0; i < len; i++) {
                if (actions[i].reference == actionName) {
                    //actions[i].actionFunction();
                    selectedAction = actions[i];
                }
            }
            if (selectedAction == null) {
                return;
            }

            for (i = 0; i < len; i++) {
                if (actions[i].eventType == selectedAction.eventType & actions[i] != selectedAction) {
                    actions[i].blockEvent = true;
                    //console.log('blocking '+label+' '+actions[i].eventLabel);
                }
            }

            var evt = document.createEvent("Event");
            //console.log('eventeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee type '+selectedAction.eventType);
            evt.initEvent(selectedAction.eventType, false, false);
            element.dispatchEvent(evt);
        }
    }
    function addAction(obj) {
        var len = actions.length;
        var ref = obj.reference;

        for (i = 0; i < len; i++) {
            if (actions[i].reference == ref) {

                return false;
            }
        }

        actions.push(obj);

    }
    function stopAction(ref) {
        if (element) {
            var len = actions.length;

            var num = 0;
            var exists = false;
            for (i = 0; i < len; i++) {
                if (actions[i].reference == ref) {
                    actions[i].state = 'stopped';
                    exists = true;
                    num = i;
                }
            }
            if (exists) {
                if (eventType == 'manual') {

                }
                else {

                    element.removeEventListener(actions[num].eventType, actions[num].actionFunction);
                }

            }
        }
    }
    function startAction(ref) {
        
        if (element) {
            var len = actions.length;

            var num = 0;
            var exists = false;
            for (i = 0; i < len; i++) {
                if (actions[i].reference == ref) {
                    actions[i].state = 'started';
                    exists = true;
                    num = i;
                }
            }
            if (exists) {
                if (eventType == 'manual') {

                }
                else {

                    element.removeEventListener(actions[num].eventType, actions[num].actionFunction);
                    element.addEventListener(actions[num].eventType, actions[num].actionFunction, false);
                }


            }
        }
    }
    function removeAction(ref) {
        if (element) {
            var len = actions.length;

            var num = 0;
            var exists = false;
            for (i = 0; i < len; i++) {
                if (actions[i].reference == ref) {
                    exists = true;
                    num = i;
                }
            }
            if (exists) {
                if (eventType == 'manual') {

                }
                else {
                    element.removeEventListener(actions[num].eventType, actions[num].actionFunction);
                }

                actions.splice(num, 1);
            }
        }

    }
    this.targetElementId = function (id) {

    }
    this.getSourceId = function (id) {
        return id;
    }
    this.setAction = function (eventLabel, event, action) {

        var obj = {
            reference: null,
            actionType: null,
            eventType: null,
            actionFunction: null
        }

        if (typeof (action) == "function") {

            obj.state = 'new';
            obj.reference = eventLabel;
            obj.actionType = 'function';
            obj.eventType = event;
            obj.blockEvent = false;
            obj.actionFunction = (function (action, obj) {
                return function (e) {
                    //console.log('trigger event = '+eventLabel+' '+event);
                    console.log('event executed = ' + e);

                    e.stopPropagation();
                    if (obj.blockEvent == false) {
                        action(e);
                        console.log('  activating ' + newLabel + ' ' + obj.reference + ' ' + obj.eventType + ' ' + obj.state);
                    }
                    obj.blockEvent = false;
                }
            })(action, obj);
            //obj.actionFunction = action;
            addAction(obj);
        }

    }
    this.removeAction = function (eventLabel) {
        removeAction(eventLabel);
    }
    this.startAction = function (eventLabel) {
        startAction(eventLabel);
    }
    this.stopAction = function (eventLabel) {
        stopAction(eventLabel);
    }
    this.setInput = function (name, value) {

        document.querySelector('#' + id + ' input[name="' + name + '"]').value = value;

    }
    this.getSourceElement = function (id) {
        return element;
    }
    this.retrieveFormVariables = function () {

        if (element.tagName == 'FORM') {
            return window.serializer(element);
        }
        else {
            return '';
        }
    }
    function execute() {
        if (actionType == 'function') {
            actionFunction();
        }
    }
    this.clearAllActions = function () {


        while (actions.length != 0) {
            //console.log('clearing events '+actions[actions.length-1].reference);
            removeAction(actions[actions.length - 1].reference);
        }
    }
}
Action.Group = (function(){
	
	var actionsCollections = new Array();
	var privateAttribute1 = false;
	var privateAttribute2 = [1,2,3];
	var monitoringPage = null;
	var monitorElement = null;
	var hasStartMonitoring = false;
	function startUp(){
		var startMonitoring = '<tr><td onclick="Action.Group.startMonitoring();">start</td><td onclick="Action.Group.stopMonitoring();">stop</td></tr>';
		var table = document.createElement('table');
		table.innerHTML = startMonitoring;
		table.style.backgroundColor = 'black';
		table.style.color = 'white';
		table.style.position = 'fixed';
		table.style.bottom = '0px';
		table.style.right = '0px';
		document.body.appendChild(table);
	}
	function monitor(){
		
		var docMonitor = document.getElementById('event_setter_monitoring');
		if(!docMonitor){
			
			if(!monitoringPage){
				//review_page = window.open('monitoring','Product Review Page','width=1100, height=800, toolbar=no, location=no, scrollbars=yes');
			}
			docMonitor = document.createElement('div');
			docMonitor.setAttribute('id', 'event_setter_monitoring');
			docMonitor.style.position = 'absolute';
			docMonitor.style.left = '0px';
			docMonitor.style.top ='0px';
			docMonitor.style.color = 'red';
			docMonitor.style.backgroundColor = 'black';
			docMonitor.style.fontFamily = 'Arial';
			//docMonitor.style.opacity = '0.5';
		}
		//document.body.appendChild(docMonitor);
		var len = actionsCollections.length;
		var i = 0;
		var rows = '';
		
		for(i=0; i<len; i++){
			var ac = actionsCollections[i];
			
			var ylen = ac.getLength();
			var y = 0;
			var row2 = '';
			for(y=0; y<ylen; y++){
				
				var ac2 = ac.getActionAtPos(y);
				
				var zlen = ac2.getLength();
				var z = 0;
				var row3 = '';
				for(z=0; z<zlen; z++){
					
					var ac3 = ac2.getActionObjectAt(z);
					
					
					//console.log('  individual '+newLabel+' '+actions[i].reference +' '+actions[i].eventType+' '+actions[i].state+' '+actions.length);
					row3 = row3+'<tr><td>'+ac3.reference+'</td><td>'+ac3.eventType+'</td><td>'+ac3.state+'</td></tr>';
					//alert(ac2.getLabel());
					
		
				}
				var docMonitor3 = document.createElement('div');
				docMonitor3.style.color = 'red';
				var title3 = '<tr><td colspan="3">Action</td></tr>';
				var tableHead3 = document.createElement('tbody');
				tableHead3.style.color = 'black';
				tableHead3.style.backgroundColor = 'red';
				tableHead3.innerHTML = title3;
				var tableBody3 = document.createElement('tbody');
				tableBody3.innerHTML = row3;
				var table3 = document.createElement('table');
				table3.appendChild(tableHead3);
				table3.appendChild(tableBody3);
				table3.style.color = 'red';
				docMonitor3.innerHTML = '';
				table3.setAttribute('border', '1');
				docMonitor3.appendChild(table3);
			
				
				row2 = row2+'<tr><td>'+ac2.getLabel()+'</td><td>'+docMonitor3.innerHTML+'</td></tr>';
				//alert(ac2.getLabel());
				
	
			}
			var docMonitor2 = document.createElement('div');
			docMonitor2.style.color = 'red';
			var title2 = '<tr><td>Action Collection</td></tr>';
			var tableHead2 = document.createElement('tbody');
			tableHead2.style.color = 'black';
			tableHead2.style.backgroundColor = 'red';
			tableHead2.innerHTML = title2;
			var tableBody2 = document.createElement('tbody');
			tableBody2.innerHTML = row2;
			var table2 = document.createElement('table');
			table2.appendChild(tableHead2);
			table2.appendChild(tableBody2);
			table2.style.color = 'red';
			docMonitor2.innerHTML = '';
			table2.setAttribute('border', '1');
			docMonitor2.appendChild(table2);
			

			rows = rows+'<tr><td>'+ac.getReference()+'</td><td>'+docMonitor2.innerHTML+'</td></tr>';
			
			
		}
		var title = '<tr><td colspan="2">Action Group</td></tr>';
		var tableHead = document.createElement('tbody');
		tableHead.style.color = 'black';
		tableHead.style.backgroundColor = 'red';
		tableHead.innerHTML = title;
		var tableBody = document.createElement('tbody');
		tableBody.innerHTML = rows;
		var table = document.createElement('table');
		table.appendChild(tableHead);
		table.appendChild(tableBody);
		table.style.color = 'red';
		docMonitor.innerHTML = '';
		table.setAttribute('border', '1');
		
		docMonitor.appendChild(table);
		monitorElement = docMonitor;
	}
	function getMonitorElement(){
		return monitorElement;
	}
	function printout(){
		var len = actionsCollections.length;
		var i = 0;
		for(i=0;i<len; i++){
			console.log('collection '+actionsCollections[i].getReference()+' '+actionsCollections.length);
			actionsCollections[i].printout();
		}
	}
	function isValueInArray(id){
		var len = actionsCollections.length;
		var i = 0;
		for(i=0;i<len; i++){
			if(actionsCollections[i].getReference() == id){
				return true;
			}
		}
		return false;
	}
	function addToPrivateCollection(obj){
		if(isValueInArray(obj.getReference()) == false){
			
			actionsCollections.push(obj);
			//console.log('new '+obj.getReference()+' '+actionsCollections.length);
		}
		else{
			//console.log('old '+obj.getReference()+' '+actionsCollections.length);
		}
		
	}
	
	function getFromPrivateCollection(id){
		var len = actionsCollections.length;
		var i = 0;
		for(i=0; i<len; i++){
			if(actionsCollections[i].getReference() == id){
				return actionsCollections[i];
			}
		}
		return null;
	}
	function clearFromPrivateCollection(ref){
		var len = actionsCollections.length;
		var num = 0;
		var exists = false;
		var i = 0;
		for(i=0;i<len; i++){
			//console.log('comparing '+actionsCollections[i].getReference()+' '+ref);
			if(actionsCollections[i].getReference() == ref){
				//console.log('ref exists '+ref);
				exists = true;
				num = i;
				break;
			}
		}
		if(exists){
			//console.log('clearing '+ref);
			var subLevel1 = actionsCollections[num];
			var subLevel1Length = subLevel1.getLength();
			var j=0;
			for(j=0; j<subLevel1Length; j++){
				//console.log('clearing collection '+j+' '+subLevel1.getActionAtPos(j).getLabel());
				subLevel1.clearAllActions();
			}
			actionsCollections.splice(num, 1);
		}
		
	}
	startUp();
	var monitoringVal = null;

	return{
		pbulicAttribute:true,
		publicAttribute2:10,
		
		setActionCollection:function(id){
			var a = new Action.Collection(id);
			addToPrivateCollection(a);
			return a;
		},
		getActionCollection:function(id){
			return getFromPrivateCollection(id);
		},
		clearActionCollection:function(ref){
			clearFromPrivateCollection(ref);
		},
		printout:function(){
			printout();
		},
		executeAction:function(a1,a2,a3){
			
			var col = getFromPrivateCollection(a1);
			var action = col.getAction(a2);
			action.executeAction(a3);
	
		},
		startMonitoring:function(){
		
			if(hasStartMonitoring == false){
				//if(!monitoringPage){
					monitoringPage = window.open('monitoring','Event Monitoring','width=1100, height=800, toolbar=no, location=no, scrollbars=yes');
				//}
				monitoringVal = setInterval(monitor, 1000);
				hasStartMonitoring =true;
			}
		},
		stopMonitoring:function(){
			if(hasStartMonitoring){
				clearInterval(monitoringVal);
				monitoringVal = null;
				hasStartMonitoring = false;
			}
			
		},
		getMonitorElement:function(){
			return getMonitorElement();
		}
	}
	
})();
Action.Collection = function(newRef){
	
	var ref = newRef;
	var actions = new Array();
	this.getReference = function(){
		return ref;
	}
	this.printout = function(){
		
		var len = actions.length;
		var i = 0;
		for(i=0; i<len; i++){
			console.log(' action '+actions[i].getLabel()+' '+actions.length);
			actions[i].printout();
		}
	}
	function isValueInArray(id){
		var len = actions.length;
		var i = 0;
		for(i=0;i<len; i++){
			if(actions[i].getLabel() == id){
				return true;
			}
		}
		return false;
	}
	function addToPrivateCollection(obj){
		
		if(isValueInArray(obj.getLabel()) == false){
			
			actions.push(obj);
		}
		
	}
	function getFromPrivateCollection(id){
		var len = actions.length;
		var i = 0;
		for(i=0; i<len; i++){
			if(actions[i].getLabel() == id){
				return actions[i];
			}
		}
		return null;
	}
	function clearFromPrivateCollection(ref){
		var len = actions.length;
		var num = 0;
		var exists = false;
		var i = 0;
		for(i=0;i<len; i++){
			if(actions[i].getLabel() == ref){
				
				exists = true;
				num = i;
				break;
			}
		}
		if(exists){
			actions.splice(num, 1);
		}
		
	}
	function privateMethod2(args){
	}
	
	this.setAction = function(id){
		var a = new Action.Action(id);
		addToPrivateCollection(a);
		return a;
	}
	this.getAction = function(id){
		return getFromPrivateCollection(id);
	}
	this.clearAction = function(ref){
		//clearFromPrivateCollection(ref);
	}
	this.getLength = function(){
		return actions.length;
	}
	this.getActionAtPos = function(val){
		var len = actions.length;
		var i = 0;
		for(i=0; i<len; i++){
			if(i == val){
				return actions[i];
			}
		}
		return null;
	}
	this.clearAllActions = function(){
		
		while(actions.length != 0){
			//console.log('clear actions '+actions[actions.length-1].getLabel()+' '+actions.length);
			actions[actions.length-1].clearAllActions();
			clearFromPrivateCollection(actions[actions.length-1].getLabel());
		}
	}
	
};