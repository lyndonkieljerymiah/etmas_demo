<?php

/*


  Parameter:
  id:	id of menu,
  script_id: id of the element that uses in javascript
  args:	Array parameters
  'class_menu' -> class of head menu
  'menu' -> array format a list of menu containing label and href
  'wrapper_tag' -> choose whether you want to use ul as a wrapper or customize your own. default is ul - "use tag name only" ie - div
  'list_tag' -> you can customize the list tag or the row tag as well the default is li - "use tag name only" ie - li
  'row_tag' -> if you want to use element to carry each row ie ("<tr");
  'before_widget' -> use to as an additional wrapper -  ie '<nav><h1>Menu</h1>'
  'after_widget' -> use to close the before_widget - ie '</nav>'

  

 */

class ETMenu extends Module {

    public function __construct($parentModule) {
        parent::__construct($parentModule);
       
        $this->items = array();
    }
    
	public function getKeys() {
        return array('id', 'items','wrapper_tag','list_tag','row_tag','before','after');
    }
	
    public function getCssLink() {
        return array('page_style');
    }

    public function getJsLink() {
        return array('user_interface');
    }
            
    public function getContent() {
        
        $default = array(
            'parent_tag' => 'ul',
            'wrapper_tag' => '',
            'list_tag' => 'li',
        );

        if(isset($this->parent_tag)) $default['parent_tag'] = $this->parent_tag;       
        if(isset($this->after)) $default['after'] = $this->after;
        if(isset($this->wrapper_tag))  $default['wrapper_tag'] = $this->wrapper_tag;
        if(isset($this->list_tag))  $default['list_tag'] = $this->list_tag;
        if(isset($this->row_tag))  $default['row_tag'] = $this->row_tag;
        
        $parent_tag = "";
        $parent_close_tag = "";
        $parent_attribute = "";
        
        if (gettype($default['parent_tag']) == 'array') {
            $parent_attribute = (isset($default['parent_tag'][1])) ? $default['parent_tag'][1] : "";
            $parent_tag = "<" . $default['parent_tag'][0] . " id='{$this->id}_menu' role='parent'  $parent_attribute>";
            $parent_close_tag = "</" . $default['parent_tag'][0] . ">";
        } else {
            if(!empty($default['parent_tag'])) {
                $parent_tag = '<' . $default['parent_tag']  . '>';    
                $parent_close_tag = '</' . $default['parent_tag'] . '>';
            }
        }

        $wrapper_tag = "";
        $wrapper_close_tag = "";
        $wrapper_attribute = "";
        if (gettype($default['wrapper_tag']) == 'array') {
            $wrapper_attribute = (isset($default['wrapper_tag'][1])) ? $default['wrapper_tag'][1] : "";
            $wrapper_tag = "<" . $default['wrapper_tag'][0] . " $wrapper_attribute>";
            $wrapper_close_tag = "</" . $default['wrapper_tag'][0] . ">";
        } else {
            if(!empty($default['wrapper_tag'])) {
                $wrapper_tag = '<' . $default['wrapper_tag']  . '>';    
                $wrapper_close_tag = '</' . $default['wrapper_tag'] . '>';
            }
        }

        //list
        if (gettype($default['list_tag']) == 'array') {
            $list_tag = $default['list_tag'][0];
            $list_tag_attrib = (isset($default['list_tag'][1])) ? $default['list_tag'][1] : "";
        }else {
            $list_tag = $default['list_tag'];
            $list_tag_attrib = "";
        } 
        
        $html_list = "";
        foreach($this->items as $item) {
            $html_list .= "<" . $list_tag . " " . $list_tag_attrib . ">" . $item . "</" .  $list_tag . ">";
        }

        return <<<EOD
{$parent_tag}
    {$wrapper_tag}
		{$html_list}
	{$wrapper_close_tag}
{$parent_close_tag}
EOD;
    }

}

?>