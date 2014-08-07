<?php

/*
  Module: CheckboxModule
  Properties:
  guid - id
  class - css class
  value - key value
  locked - disable/enable element
  checked - default check
  label - label of check
  items - collection of checkbox

 */

require_once 'modules/components/inputs/collection/itemcollection.php';
require_once 'modules/components/inputs/collection/item.php';


class CheckBox extends Module {
    
    public function __construct($parentModule) {
        parent::__construct($parentModule);
    }

    
    public function getKeys() {
        return array('guid', 'class', 'value', 'checked', 'locked', 'text', 'items');
    }

    private function setProperties($guid, $class, $value, $text, $checked, $locked) {

        $guid = (isset($guid) && $guid != '') ? "id='" . $guid . "'" : "";
        $class = (isset($class) && $class != '') ? "class='" . $class . "'" : "";
        $value = (isset($value) && $value != '') ? "value='" . $value . "'" : "";
        $text = (isset($text) && $text != '') ? $text  : "";

        $strCheck = "";
        if (isset($checked)) {
            if ($checked == true) {
                $strCheck = "checked";
            } else {
                $strCheck = "";
            }
        } else {
            $strCheck = "";
        }

        $strLocked = "";
        if (isset($locked)) {
            if ($locked == true) {
                $strLocked = "disabled";
            } else {
                $strLocked = "";
            }
        } else {
            $strLocked = "";
        }

        return <<<EOD
   <input type='checkbox' {$guid} {$class} {$value} {$strLocked} {$strCheck}/><label>{$text}</label>
EOD;
    }

    public function getContent() {
        
        $strHtml = "";
        
        //php script logic
        if(!isset($this->items)) { 
            $boxItem = new ItemBox($this->value,$this->guid,'',$this->text,$this->class,$this->checked,$this->locked); 
            $this->items = new ItemBoxCollection();
            $this->items->addItem($boxItem);
        }
        
        $itemCollection = $this->items->getItems();
        foreach ($itemCollection as $item) {
            $strHtml .= $this->setProperties($item->guid, $item->class, $item->value, $item->text, $item->checked, $item->locked);
        }
        
        $htmlContent = <<<EOF
            {$strHtml}

EOF;
        return $htmlContent;
    }

}
