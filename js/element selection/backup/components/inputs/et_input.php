<?php

/*


  Parameter:
	id:	id of input
	type: specify the type of input component [input|select|textarea|radio|checkbox]
	attrib:	Array Attributes
		'text' -> default text in textarea
		'option' -> option selection in select type
  

  css_internal:	customize your own css internal


 */
class ETInput extends Module {

    private $default;
    
    public function __construct($parentModule) {
        parent::__construct($parentModule);
    }
    
    public function getKeys() {
        return array('args','tag', 'id','attribute','text','items','key');
    }
    
	public function getJsLink() {
		return array('event_setter','user_interface');
	}
		
	
    public function getContent() {
	
		$default = array(
			'tag' => 'input',
            'text' => '',
            'attribute' => array(),
            'group' => '',
            'button_type' => 'button',
            'items' => array('none'),
            'last_item_pos' => TRUE,
            'item_wrapper' => '',
            'selectedItem' => ''
        );
		
		
		if(isset($this->tag)) { 
			$default['tag'] = $this->tag; 
			$this->tag = null;
		};

		if(isset($this->attribute)) { 
			$default['attribute'] = $this->attribute;
			$this->attribute = null;
		};
		
		if(isset($this->text)) { 
			$default['text'] = $this->text;
			$this->text = null;
		};
		
		if(isset($this->items))  { 
			$default['items'] = $this->items; 
			$this->items = null;
		}

        if(isset($this->last_item_pos)) {
            $default['last_item_pos'] = $this->last_item_pos;
            $this->last_item_pos = NULL;
        }

        if(isset($this->item_wrapper)) {
            $default['item_wrapper'] = $this->item_wrapper;
            $this->item_wrapper = NULL;
        }

		if(isset($this->selectedItem))  { 
			$default['selectedItem'] = $this->selectedItem;
			$this->selectedItem = null;
		}
		
        

        $input = "";
		$attribs = "";
		
		if(count($default['attribute'])) {
			foreach($default['attribute'] as $key => $val) {
				if($key == 'id') {
					$attribs .= $key . "='" . $this->id . "_" . $val . "' "; 
					$attribs .= "name='" . $this->id . "_" . $val . "' ";
				}
				else if($key == 'data-key') {
					continue;	
				}
                else if($key == 'data-group') {
					continue;	
				}
				else {
					$attribs .= $key . "='" . $val . "' "; 
				}
			} 
		};
		
		//add attribute group
        if(isset($this->id)) {
           $attribs .= "data-group='" .  $this->id . "' ";        
            if(isset($this->group)) {
                $attribs .= "data-key='" . $this->key . "' ";
            }
        }
		
        if($default['tag'] == 'input') {
            if(isset($default['text']) && $default['text'] != '') {
                $attribs .= "value='" . $default['text'] . "' ";    
            }
            $input = "<input " . $attribs . " role='input'/>";
        }
        else if($default['tag'] == 'textarea') {
            $input = "<textarea " . $attribs . " role='input'>" . $default['text'] . "</textarea>";
        }
		else if($default['tag'] == 'select') {
            $options = $default['items'];
			$html_option = "";
            
			//loop array
			foreach($options as $key => $value) {
				$option_attrib = "value=" . $key;
				$default_attrib = "";
				if(!empty($default['selectedItem'])) {
					if($default['selectedItem'] == $key) $default_attrib = 'selected';
				}
				$html_option .= "<option $option_attrib $default_attrib>" . $value . "</option>" ;
			}
			 
			$input = "<select " . $attribs . " role='input'>";
			$input .= $html_option;
			$input .= "</select>";
        }
		else if($default['tag'] == 'radio') {
			$items = $default['items'];
			$html_items = "";
			foreach($items as $key => $item) {
				$html_item = "<input type='radio' " . $attribs . " role='option' value='" . $key . "'  />";
                $wrapper_open = ($default['item_wrapper'] != '') ? '<' . $default['item_wrapper'] . '>' : '';
                $wrapper_close = ($default['item_wrapper'] != '') ? '</' . $default['item_wrapper'] . '>' : '';
                if($item != '') {
                    if($default['last_item_pos']) { 
                        $html_item .= $item;
                    }else {
                        $html_item =  $item . $html_item;
                    }
				}
                $html_items .= $wrapper_open . $html_item . $wrapper_close;
			}
            $input =  $html_items;    
		}
		else if($default['tag'] == 'checkbox') {
			$items = $default['items'];
            $html_items = "";

            foreach($items as $key => $item) {
				
                $html_item = "<input type='checkbox' " . $attribs . " role='checkbox' value='" . $key . "'  />";
                $wrapper_open = ($default['item_wrapper'] != '') ? '<' . $default['item_wrapper'] . '>' : '';
                $wrapper_close = ($default['item_wrapper'] != '') ? '</' . $default['item_wrapper'] . '>' : '';
				
                if($item != '') {
					if($default['last_item_pos']) { 
                        $html_item .=  $item;
                    }else {
                        $html_item =  $item . $html_item;
                    }
				}
                $html_items .= $wrapper_open . $html_item . $wrapper_close;
			}
            $input =  $html_items; 
		}
		else if ($default['tag'] == 'button') {
			$input = "<button " . $attribs . " role='button'>" . $default['text'] . "</button>";
		}
        else if($default['tag'] == 'submit') {
            $input = "<button type='submit' " . $attribs . " role='submit'>" . $default['text'] . "</button>";
        }
        
        return <<<EOD
   {$input}
EOD;

    }

}

?>
