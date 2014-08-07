<?php

class PBHeaderModule extends Module {
   
    public function getCssLink() {
        return array("pagebuilder_style");
    }
	
	public function getContent() {

		return <<<EOD
<div id="pbadminbar" data-role="adminbar">
    <a id='pbSwitchPanel' class="pbButton">Open Panel</a>
</div>
EOD;
	}

}
?>


