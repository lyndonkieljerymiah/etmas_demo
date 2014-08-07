<?php
class FrameComponent extends Module {

	public function getKeys() {
		return array("id","tabItems","content","style","hasFrame");
	}

	public function getContent() {
        $imagePath = RootDirectory::getPath() . 'imgs/';
        
        $htmlTab = "";
        if(isset($this->tabItems)) {
            //button tab
            $tab = Module::getFromFile('/components/tab.php', 'TabModule',$this);
            $tab->id = $this->id . "_tab";
            $tab->parent_wrapper = array("tag" => "div", "attr" => "style='position:absolute; width:85%; top:15px; left: 20px; box-sizing: boder-box'");
            $tab->list_wrapper = "div";
        
            $tab->items = $this->tabItems;    
            $htmlTab = $tab->getContent();
        }
        
        $this->style = (isset($this->style)) ? $this->style : "width: auto; position:absolute; top:0px; left:350px;";
        $frame = (isset($this->hasFrame) && $this->hasFrame == FALSE) ? "" : "frame";
        
		return <<<EOD
<div id='dialog_form_{$this->id}' class="container" style="{$this->style}">
    <div style="position:relative">
        {$htmlTab}
        <div class="row {$frame} " style="padding:20px">
            <div id="frame_{$this->id}" class="panel panel-solid" style="margin-top:25px; position:relative">
               {$this->content}
            </div>
        </div>
    </div>
</div>
EOD;
	}

}
?>


