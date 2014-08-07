<?php

/*
  Module: TitleHeader
  Properties:
  guid - id
  class - css class
  text - label of check
  type - type of header (h1-h5)
  

 */

class TitleHeader extends Module {

    var $page;

    public function __construct($parentModule) {
        parent::__construct($parentModule);
    }
    
    public function getKeys() {
        return array('guid','class' ,'type' ,'text');
    }

    public function getContent() {
        $text = (isset($this->text)) ? $this->text : "Title";
        $guid = (isset($this->guid)) ? "id='" . $this->guid . "'" : "";
        $class = (isset($this->class)) ? "class='" . $this->class . "'" : "";
        $type = (isset($this->type)) ? $this->type : "h1";
        
        
        return <<<EOD
	<{$type} {$guid} {$class}>{$text}</{$type}>
EOD;
    }

}