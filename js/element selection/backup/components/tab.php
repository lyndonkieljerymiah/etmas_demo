<?php

class TabModule extends Module {

    public function __construct($parentModule) {
        $this->items = array();
        parent::__construct($parentModule);
    }

    public function getKeys() {
        return array('items','id','selected','style','parent_wrapper','list_wrapper');
    }

    

    public function getJsLink() {
        return array('user_interface');
    }
    
	public function getContent() {
        
        $default = array(
            'parent_wrapper' => 'ul',
            'list_wrapper' => 'li'
        );

        if(isset($this->parent_wrapper)) {
            $default['parent_wrapper'] = $this->parent_wrapper;
        }

        if(isset($this->list_wrapper)) {
            $default['list_wrapper'] = $this->list_wrapper;
        }

        if(gettype($default['parent_wrapper']) == 'array') {
            foreach($default['parent_wrapper'] as $key => $value) {
                if($key == "tag") {
                    $parent["tag"] = $value;
                }
                else if($key == "attr") {
                    $parent["attr"] = $value;
                }
            }
        }else {
            $parent["tag"] = $default["parent_wrapper"];
            $parent["attr"] = "";
        }

        
        if(gettype($default['list_wrapper']) == 'array') {
            foreach($default['list_wrapper'] as $key => $value) {
                if($key == "tag") {
                    $list["tag"] = $value;
                }
                else if($key == "attr") {
                    $list["attr"] = $value;
                }
            }
        }else {
            $list["tag"] = $default["list_wrapper"];
            $list["attr"] = "";
        }
        
        $html_list = "";
        foreach($this->items as $key => $item) {
            if(is_array($item)) {
                $html_list .= "<" . $list['tag'] . " id='" . $this->id . "_"  .  $key . "'" .$item['attr'] . ">" . $item['item'] . "</{$list['tag']}>";
            }else {
                $html_list .= "<" . $list['tag'] . " id='" . $this->id . "_"  .  $key . "'" .$list['attr'] . ">" . $item . "</{$list['tag']}>";    
            }
        }
                
		return <<<EOD
        <{$parent['tag']} id="{$this->id}" {$parent['attr']}>
            $html_list
        </{$parent['tag']}>
EOD;
	}

}

?>


