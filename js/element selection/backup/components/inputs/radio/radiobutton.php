<?php

/*
    Module: RadioButtonModule
    Properties:
        guid - id
        class - css class
        value - key value
        group - group of radio button
        locked - disable/enable element
        checked - default check
        text - label of check
        items - collection of checkbox
		
*/

require_once 'modules/components/inputs/collection/itemcollection.php';
require_once 'modules/components/inputs/collection/item.php';


class RadioButton extends Module { 
    
    
	
    public function __construct($parentModule) { 
        parent::__construct($parentModule);
    }
    
    //page variable 
    public function getKeys() { 
        return array('guid','class','value','group','checked','locked','text','items');
    }   
    	
    private function setProperties($guid,$class,$group,$value,$text,$checked,$locked) { 
        
        $guid = (isset($guid) && $guid!= '') ? "id='" . $guid . "'" : "";
        $class = (isset($class) && $class!= '') ? "class='" . $class . "'" : "";
        $group = (isset($group) && $group!= '') ? $group : 'radiobutton';
        $value = (isset($value) && $value!= '') ? "value='" . $value . "'" : "";
        $text = (isset($text) && $text != '') ? $text  : "";	
			
        $strCheck = "";
        if (isset($checked)) { 
            if($checked == true) { 
                    $strCheck = "checked";
            }
            else { 
                    $strCheck = "";
            }
        }else { 
            $strCheck = "";
        }
        
        $locked = "";
        if (isset($locked)) { 
            if($locked == true) { 
                    $strLocked = "disabled";
            }else { 
                    $strLocked = "";
            }
        }else { 
            $strLocked = "";
        }
        
        return <<<EOD
   <input type='radio' {$guid} {$class} {$value} name={$group} {$strLocked} {$strCheck}/><label>{$text}</label>
EOD;
        
    }
    
    public function getContent() {
	
        $strHtml = "";
        //php script logic
        if(!isset($this->items)) { 
            $boxItem = new ItemBox($this->value,$this->guid,$this->group,$this->text,$this->class,$this->checked,$this->locked); 
            $this->items = new ItemBoxCollection();
            $this->items->addItem($boxItem);
        }

        $itemCollection = $this->items->getItems();
        foreach($itemCollection as $item) { 
            $strHtml .= $this->setProperties($item->guid, $item->class, $item->group, $item->value, $item->text, $item->checked, $item->locked);
        }
        
        $htmlContent = <<<EOF
            {$strHtml}

EOF;
    return $htmlContent;
    }
}
