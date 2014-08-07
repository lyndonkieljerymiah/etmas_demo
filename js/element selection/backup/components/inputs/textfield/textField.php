<?php

/*
  Module: TextFieldModule
  Properties:
  guid - id
  class - css class
  text - label of check
  maxlength - maximum length
  placeholder - placeholder
  type - type of input
  locked - disable/enable element

 */

class TextField extends Module {

    
    public function __construct($parentModule) {
        parent::__construct($parentModule);
    }

    //page variable 
    public function getKeys() {
        return array('type', 'class', 'guid', 'maxlength', 'locked', 'placeholder', 'text','name');
    }

    public function getContent() {
        
        //php script logic
        $type = (isset($this->type)) ? $this->type : "text";

        if ($type == "checkbox") {
            $type = "text";
        } else if ($type == "radio") {
            $type = "text";
        }

        $guid = (isset($this->guid)) ? "id='" . $this->guid . "'" : "";
		$name = (isset($this->name)) ? "name='" . $this->name . "'" : "";
        $class = (isset($this->class)) ? "class='" . $this->class . "'" : "";
        $maxlength = (isset($this->maxlength)) ? "maxlength=" . $this->maxlength : "";
        $text = (isset($this->text)) ? "value='" . $this->text . "'" : "";

        $locked = "";
        if (isset($this->locked)) {
            if ($this->locked == true || $this->locked == 'true') {
                $locked = "disabled";
            } 
            else {
                $locked = "";
            }
        }

        $placeholder = (isset($this->placeholder)) ? "placeholder='" . $this->placeholder . "'" : "";

        $htmlContent = <<<EOF
            <input {$guid} {$name} {$class} {$text} type="{$type}" {$placeholder} {$maxlength} {$locked}  />

EOF;
        return $htmlContent;
    }

}
