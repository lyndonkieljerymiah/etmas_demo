


//validation
window.TextfieldValidation = function() { 
	
	this.fields = new Array();	
	this.pattern;
	
}


window.TextfieldValidation.prototype.addValidationRule = function(id,pattern,validation) { 
	
	var self = this;
	var fieldTemp = document.getElementById(id);
	var validationCallback = validation;
		
	if (fieldTemp != null) { 
		
		var fieldset = { 
			guid : '',
			object : null,
			pattern : new Array(),
			isValid : false,
		}
		
		//check if field exist
		var currentTextField =  getTextField(id);
		
		if(!currentTextField) { 
			//add new field
			fieldset.guid = id;
			fieldset.pattern.push(pattern);
			fieldset.object = fieldTemp;
			fieldset.object.addEventListener('change',handleValidationRule,false);
			this.fields.push(fieldset);
		}
		else { 
			currentTextField.pattern.push(pattern);
		}
	
	}else { 
		getLatestElement();
	}
	
	function getTextField(id) { 
		
		var totalFields = self.fields.length;
		
		for(var i=0;i < totalFields;i++) { 
			if(self.fields[i].guid == id) { 
				return self.fields[i];
			}
		}
		return false;
	}
	
	function handleValidationRule(e) {
		
		var pattern = null;
		var target = e.target, currentField;
		var totalFields = self.fields.length,isValid = false;
		
		//find the target
		for(var i=0;i < totalFields;i++) {
			currentField = self.fields[i];
			//if found get the pattern
			if(currentField.guid == target.id) {
				var totalPattern = currentField.pattern.length;
				for(x=0;x < totalPattern;x++) { 
					pattern = currentField.pattern[x];
					if(pattern != null) { 
						isValid = pattern.test(target.value);
						if(isValid == true) { 
							break;
						}
					}
				} 
				break;
			}
		}
		
		currentField.isValid = isValid;
		validationCallback(target,isValid);
	}
}

window.TextfieldValidation.prototype.getState = function() { 
	return this.fields;
}




