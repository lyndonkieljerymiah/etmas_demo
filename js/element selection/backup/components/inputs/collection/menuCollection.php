<?php

/*
 * 
 * Menu item Collection
 */



    class ItemMenu { 

        var $key;
        var $link;
        var $text;
        var $title;
        var $subMenu;
        var $nodeClass;
        var $target;

        public function __construct($key,$link,$text) { 
            $this->key = $key;
            $this->link = $link;
            $this->text = $text;
        }

    }
    
    
    class ItemBox { 
        
        var $value;
        var $guid;
        var $group;
        var $text;
        var $class;
        var $checked;
        var $locked;

        public function __construct($value,$key=null,$group='',$text='',$class='',$checked=false,$locked=false) { 
            $this->value = $value;
            $this->guid = $key;
            $this->group = $group;
            $this->text = $text;
            $this->class = $class;
            $this->checked = $checked;
            $this->locked = $locked;
        }
    }
    
    class ColumnHeader { 
        
        var $guid;
        var $class;
        var $text;
        var $link;
        var $direction_img;
        
        public function __construct($guid,$text,$link='',$class='') { 
           $this->guid = $guid;
           $this->text = $text;
           $this->link = $link;
           $this->class = $class;
        }
    }
   

?>
