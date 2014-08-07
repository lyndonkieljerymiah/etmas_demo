<?php

class EValidatorModule extends Module { 
    var $page;
        
    public function __construct($page,$parentModule) { 
       $this->page = $page;
       parent::__construct($page,$parentModule);
    }
    
	public function getJsLink() { 
		return array('evalidatorModule');
	}
    
	public function getJs() {
	
		return <<<EOD
		
		window.addEventListener('load',function() { 
			
			var validationStates = new Array();
			var sendForm = document.getElementById('sendForm');
			
			tfv = new TextfieldValidation();
			tfv.addValidationRule('email',/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,handleValidation);
			tfv.addValidationRule('email',/[0-9]/,handleValidation);
			tfv.addValidationRule('tel',/[0-9]/,handleValidation);
			tfv.addValidationRule('zipcode',/[A-Za-z]/,handleValidation);
						
			function handleValidation(e,args) { 
				if(args == false) { 
					//e.style.cssText = 'background:yellow';
					if(e.id == 'email') { 
						alert('Please enter email or ic only!!!');
					}
				}
				else { 
					//e.removeAttribute('style');
				}
			}
		
		},false);
EOD;
	}
	
    public function getContent() { 
        
		
		
		
		$htmlContent = <<<EOF
            

EOF;
    return $htmlContent;
    }
}
