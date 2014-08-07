<?php

/*
  Module: MenuModule
  Properties:
    guid - id
    class - class 
 *  items - collection of menu

 */

require_once 'modules/components/inputs/collection/itemCollection.php';
require_once 'modules/components/inputs/collection/menuCollection.php';

class Menu extends Module { 
        
    
    public function __construct($parentModule) { 
       
       parent::__construct($parentModule);
    }
        
    public function getKeys() {
        return array('guid', 'class', 'items');
    }
	    
    public function getContent() { 
        
        $itemCollection = (isset($this->items)) ? $this->items->getItems() : null;
        $strHtmlElement = "";
        
        foreach($itemCollection as $menuItem) { 
            
            $key = (isset($menuItem->guid)) ? "id=" . $menuItem->guid : "";
            $text = (isset($menuItem->text)) ? $menuItem->text : "";
            $link = (isset($menuItem->link)) ? $menuItem->link : "#";
            $title = (isset($menuItem->title)) ? $menuItem->title : $text;
            $submenu = (isset($menuItem->submenu)) ? $menuItem->submenu : "";
            $nodeClass = (isset($menuItem->class)) ? "class='" . $menuItem->class ."'" : "";
            $target = (isset($menuItem->target)) ? "target='" . $menuItem->target ."'" : "";
            $strHtmlElement .= '<li><a id="' . $key . '" href="' . $link . '"' . $nodeClass . ' title="'. $title .'" ' . $target .  '>' . $text .  '</a>' . $submenu . '</li>';
        }
        
        $guid = (isset($this->guid)) ? "id='" . $this->guid . "'" : "";
        $class =(isset($this->class))? "class=" . $this->class : "";
        
        $htmlContent = <<<EOF
	<nav {$guid} {$class} >	
            <ul>
                {$strHtmlElement}
            </ul>
	</nav>	

EOF;
    return $htmlContent;
    }
}
