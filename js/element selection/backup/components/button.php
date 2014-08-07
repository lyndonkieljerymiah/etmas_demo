<?php


class ButtonModule extends Module {

	public function getKeys() {
		return array('id','style','tag','attr','items');
	}

	public function getJsLink() { 
		return array('user_interface');
	}

    
    private function getIcon($key) {
        $icon = "";
        switch ($key) {
            case "add_new":
                $icon = "small-icon-addnew";
                break;
            case "edit":   
                $icon = "small-icon-edit";
                break;
            case "link":   
                $icon = "small-icon-edit";
                break;
            case "delete": 
                $icon = "small-icon-delete";
                break;
            case "save": 
                $icon = "small-icon-save";
                break;
            case "activate":
                $icon = "small-icon-activate";
                break;
            case "inactive":  
                $icon = "small-icon-inactive";
                break;
            case "deactivate":  
                $icon = "small-icon-deactivate";
                break;
            case "suspended":
                $icon = "small-icon-suspended";
                break;
            case "hold":
                $icon = "small-icon-hold";
                break;
            case "family":
                $icon = "small-icon-family";
                break;
            case "general":
                $icon = "small-icon-general'";
                break;
            case "launch":
                $icon = "small-icon-launch";
                break;
            case "hold":
                $icon = "small-icon-hold";
                break;
            case "archive":
                $icon = "small-icon-archive";
                break;
            case "approval":
                $icon = "small-icon-approval";
                break;
            case "contract":
                $icon = "small-icon-contract";
                break;
            case "covernote":
                $icon = "small-icon-covernote";
                break;
            case "receipt":
                $icon = "small-icon-receipt";
                break;
            case "certificate":
                $icon = "small-icon-certificate";
                break;
            case "schedule":
                $icon = "small-icon-schedule";
                break;
            case "endorsement":
                $icon = "small-icon-endorsement";
                break;
            case "help":  
                $icon = "small-icon-help";
                break;
            case "assign":
                $icon = "small-icon-condition";
                break;
        }
        return $icon;
    }

	public function getContent() {
        
        $default = array(
            'button_style' => 'normal',
            'tag' => 'button',
            'attr' => '',
            'content' => ''
        );

        if(isset($this->id)) $default['id'] = $this->id;
        if(isset($this->tag)) $default['tag'] = $this->tag;
        if(isset($this->attr)) $default['attr'] = $this->attr;
        
        if(isset($this->className)) {
            $default['className'] = "class='" . $this->className . "'";
        }
        
        $html = "";
        foreach($this->items as $key => $item) {
            
            if(is_array($item)) {
                $default['attr'] = $item['attr'];
                $default['content'] = $item['content'];
            }else {
                $default['content'] = $item;
            }
            $icon = "<span class='" .$this->getIcon($key)."'></span>";
            $html .= "<".$default['tag']. " id='" .$this->id. "_" .$key. "' ".$default['attr']. ">" .$icon. "<label class='label'>" .$default['content']  . "</label></".$default['tag'].">";
        }

		return <<<EOD
{$html}
EOD;
	}

}
?>

