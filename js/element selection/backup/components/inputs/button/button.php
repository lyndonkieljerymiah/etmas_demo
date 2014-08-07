<?php

/*
  Module: ButtonModule
  Properties:
  guid - id
  class - css class
  text - label of check
  locked - disable/enable element

 */

class Button extends Module {

    

    public function __construct($parentModule) {
        parent::__construct($parentModule);
    }

    //page variable 
    public function getKeys() {
        return array('class', 'text', 'guid', 'locked','type');
    }

    public function getContent() {
        
        //php script logic
        
        $guid = (isset($this->guid)) ? "id='" . $this->guid . "'" : "";
        $class = (isset($this->class)) ? "class='" . $this->class . "'" : "";
        $text = (isset($this->text)) ? $this->text : "Submit";
        $type = (isset($this->type)) ? "type='$this->type'" : "";
        
        $locked = "";
        if (isset($this->locked)) {
            if ($this->locked == true || $this->locked == 'true') {
                $locked = "disabled";
            } else {
                $locked = "";
            }
        }


        $htmlContent = <<<EOF
            <button {$guid} {$class} {$locked} {$type}>{$text}</button>
EOF;
        return $htmlContent;
    }

}
