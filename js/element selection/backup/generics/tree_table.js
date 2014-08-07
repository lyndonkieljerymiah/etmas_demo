var TreeTable = TreeTable || {};
TreeTable.TreeTable = function(id){
	var reference = id;
	var sourceTable = null;
	this.getReference = function(){
		return reference;
	}
	this.setSourceTable = function(newSourceTable){
		sourceTable = newSourceTable;
	}
	
}
TreeTable.Collection = (function(){
	
	var collection = new Array();

	function isValueInArray(id){
		var len = actionsCollections.length;
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
		}
		
	}
	function getFromPrivateCollection(id){
		var len = actionsCollections.length;
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
		for(i=0;i<len; i++){
			if(actionsCollections[i].getReference() == ref){
				
				exists = true;
				num = i;
				break;
			}
		}
		if(exists){
			actionsCollections.splice(num, 1);
		}
		
	}
	function privateMethod2(args){
	}
	
	return{

		setCollection:function(id){
			var a = new TreeTable.TreeTable(id);
			addToPrivateCollection(a);
			return a;
		},
		getCollection:function(id){
			return getFromPrivateCollection(id);
		},
		clearCollection:function(ref){
			clearFromPrivateCollection(ref);
		}
		
	}
	
})();
