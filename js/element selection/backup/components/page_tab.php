<?php

class PageTab extends Module {

    public $pages = array();

	public function getKeys() {
		return array('pages', 'selected' ,'id');
	}

    public function getJsLink() {
        return array('event_setter','user_interface');
    }

	public function getContent() {
        
        $html = "";
        foreach($this->pages as $key => $page) {
            if($key == $this->selected) {
                $style = "display:block";
            }else {
                $style = "display:none";
            }
            $html .= "<div id='"  .$this->id. '_' . $key . "' role='page' data-tab='" .$key. "' data-group='" . $this->id . "' style='" .$style. "' >" . $page . "</div>";
        }        

		return <<<EOD
        <div id="{$this->id}" class="page-tab-container">
            {$html}
        </div>
EOD;
	}


}
?>


