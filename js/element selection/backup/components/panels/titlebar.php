<?php

/*
  Module: TitlebarModule
  Properties:
  guid - id
  class - css class
  text - label of check
  type - type of header (h1-h5)
  link - links of header

 */

class ETitleBarModule extends Module {

    var $page;

    public function __construct($parentModule) {
        parent::__construct($parentModule);
    }
    
    public function getKeys() {
        return array('guid','class' ,'type' ,'text', 'link');
    }

    public function getContent() {

        $cbModule = Module::get('checkbox');
        $boxItem = new \Collection\EBoxItem();
        
        
        
        $text = (isset($this->text)) ? $this->text : "Title";
        $guid = (isset($this->guid)) ? "id='" . $this->guid . "'" : "";
        $class = (isset($this->class)) ? "class='" . $this->class . "'" : "";
        $type = (isset($this->type)) ? $this->type : "h1";
        $link = (isset($this->link)) ? "<a href='" . $this->link . "'><" . $type . ">" . $text . "</" . $type . "></a>" : "<" . $type . ">" . $text . "</" . $type . ">";
        
        return <<<EOD
	<div {$guid} {$class}>{$link}</div>
EOD;
    }

}