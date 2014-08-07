<?php

/*
	Module: TextAreaModule
	Properties:
		guid - id
		class - css class
		text - label of check
		maxlength - maximum length
		placeholder - placeholder
		rows - line per row
		cols - line per col
		type - type of input
		locked - disable/enable element
		
*/

class TextArea extends Module { 
    
        
    public function __construct($parentModule) { 
       parent::__construct($parentModule);
    }
    
    //page variable 
	public function getKeys() { 
        return array('guid','class','rows','cols','maxlength','locked','text','placeholder','name');
    }   
    
		
    
    public function getContent() {

        //php script logic
        $guid = (isset($this->guid)) ? "id='" . $this->guid . "'" : "";
        $name = (isset($this->name)) ? "name='" . $this->name . "'" : "";
		$rows = (isset($this->rows)) ? $this->rows : 3;
        $cols = (isset($this->cols)) ? $this->cols : 20;
        $class = (isset($this->class)) ? "class='" . $this->class . "'" : "";
        $maxlength = (isset($this->maxlength)) ? "maxlength=" . $this->maxlength : "";
        $text = (isset($this->text)) ? $this->text : "";
		
        $placeholder = (isset($this->placeholder)) ? "placeholder='" . $this->placeholder . "'" : "";

        $locked = "";
        if (isset($this->locked)) {
            if ($this->locked == true || $this->locked == 'true') {
                $locked = "disabled";
            } else {
                $locked = "";
            }
        }


        $htmlContent = <<<EOF
            <textarea {$guid} {$name} {$class} rows="{$rows}" cols="{$cols}" {$maxlength} {$locked}>{$text}</textarea>
EOF;
        return $htmlContent;
    }
}
