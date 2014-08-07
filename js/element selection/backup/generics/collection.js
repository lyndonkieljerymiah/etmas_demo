var ECollection = function(parentElement){
	var collection = new Array();
	var parent = parentElement;
	this.addItem = function(item){
		collection.push(item);
	}
	this.removeItem = function(item){
		var index = collection.indexOf(item);
		if(index > -1){
			collection.splice(index, 1);

		}
	}
	this.itemExists = function(item){
		if(collection.indexOf(item) > -1){
			return true;
		}
		return false;
	}
	this.getCollection = function(){
		return collection;
	}
	this.getCollectionByType = function(type){
		var newCol = new Array();
		var collectionTemp = collection;
		var collectionLength = collectionTemp.length;
		for(var i=0; i<collectionLength; i++){
			if(collectionTemp[i] instanceof type)
				newCol.push(collectionTemp[i]);
		}
		return newCol;
	}
	this.getParent = function(){
		return parent;
	}
}