<?php

/*
  Module: SelectionModule
  Properties:
  guid - id
  class - css class
  text - text value
  locked - disable/enable element
  items - drop down list
  multiple - dropdown box or list box

 */

Cls::Load('ICollection');
class Selection extends Module {

    

    public function __construct($parentModule) {
        parent::__construct($parentModule);
		$this->items = new ICollection();
    }

    //page variable 
    public function getKeys() {
        return array('guid', 'class', 'multiple', 'locked', 'text', 'items');
    }

    public function getContent() {

        //php script logic
        $option = '';

        

        $guid = (isset($this->guid)) ? "id='" . $this->guid . "'" : "";
		$name = (isset($this->name)) ? "name='" . $this->name . "'" : "";
        $class = (isset($this->class)) ? "class='" . $this->class . "'" : "";
        $text = (isset($this->text)) ?  $this->text  : "";

		$items = $this->items->getItems();
        if (count($items)) {
			
            foreach ($items as $key => $value) {
				if($text == $value) { 
					$selected = "selected";
				}else { 
					$selected = "";
				}
				
                $option .= '<option value="' . strtolower($key) . '"' . $selected .  '>' . $value . '</option>';
            }
        } else {
            $option .= '<option>--no value--</option>';
        }
		
        $multiple = "";
        if (isset($this->multiple)) {
            if ($this->multiple == true) {
                $multiple = "multiple";
            } else {
                $multiple = "";
            }
        }

        $locked = "";
        if (isset($this->locked)) {
            if ($this->locked == true) {
                $locked = "disabled";
            } else {
                $locked = "";
            }
        }


        $htmlContent = <<<EOF
            <select  {$guid} {$name} {$class} {$text} {$multiple}  {$locked}>{$option}</select>

EOF;
        return $htmlContent;
    }

}
