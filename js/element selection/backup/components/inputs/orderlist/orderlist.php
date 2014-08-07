<?php

/*
  Module: MenuModule
  Properties:
    guid - id
    class - class 
 *  items - collection of menu

 */

require_once 'modules/components/inputs/collection/itemcollection.php';
require_once 'modules/components/inputs/collection/item.php';

class OrderList extends Module { 
    
    var $page;
	    
    
    public function __construct($page,$parentModule) { 
       $this->page = $page;
       parent::__construct($page,$parentModule);
    }
        
    public function getKeys() {
        return array('guid', 'class', 'items');
    }
	    
    
    
    public function getContent() { 
        
        $itemCollection = (isset($this->items)) ? $this->items->getItems() : null;
        $strHtmlElement = "";
        
        foreach($itemCollection as $menuItem) { 
            $text = (isset($menuItem->text)) ? $menuItem->text : "";
            $nodeClass = (isset($menuItem->class)) ? "class='" . $menuItem->class ."'" : "";
            $strHtmlElement .= "<li $nodeClass >$text</li>";
        }
        
        $guid = (isset($this->guid)) ? "id='$this->guid'" : "";
        $class =(isset($this->class))? "class=" . $this->class : "";
        
        $htmlContent = <<<EOF
            <ul {$guid} {$class}>
                {$strHtmlElement}
            </ul>

EOF;
    return $htmlContent;
    }
}
