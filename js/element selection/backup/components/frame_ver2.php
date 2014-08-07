<?php

<?php
class FrameComponent extends Module {

	public function getKeys() {
		return array("id","tabItems","bodyContent","headerContent", "style","noFrame");
	}

	public function getContent() {
        $imagePath = RootDirectory::getPath() . 'imgs/';

        $this->style = (isset($this->style)) ? $this->style : "width: auto; position:absolute; top:0px; left:350px;";
        $frame = (isset($this->noFrame) && $this->noFrame == TRUE) ? "" : "frame";
		return <<<EOD
<div id='dialog_form_{$this->id}' class="container" style="{$this->style}">
    <div class="row {$frame}" style="padding:20px">
        <div id="frame_{$this->id}" class="panel panel-solid" style="margin-top:25px; position:relative">
            <div class="button-poly" style="position:absolute;top:30px;left:0px">{$headerContent}</div>
            <img id="dialog_form_close_{$this->id}" src='{$imagePath}_active__no.png' class="form-icon" style='position:absolute;top:3px;right:3px;' data-ui-bind="component:'button',style:'close',target:'dialog_form_{$this->id}'"/>
            {$this->content}
        </div>
    </div>
</div>
EOD;
	}

}
?>




?>

