<?php
class TextAreaModule extends Module{

	public function __construct($page, $parentModule){

		parent::__construct($page, $parentModule);
		
	}
	
	public function getKeys(){
		return array('id', 'value', 'width', 'height');
	}
	public function getCss(){
		$id = $this->id;
		$value = $this->value;
		 
		return <<<EOD

EOD;
	}
	public function getJsLink(){
		return array('baritemcontroller', 'observer');
	}
	public function getJs(){

		return <<<EOD

function open_new_page(){
	function callback(mod){
		//mod.loadCss();
		//mod.loadJs();
		var body = mod.getBody();
		document.getElementById("test1").innerHTML = body;
	};
	function callback2(mod){
		//mod.loadCss();
		//mod.loadJs();
		var body = mod.getBody();
		document.getElementById("test2").innerHTML = body;
	};
	var module = new ModuleLoader('textfieldsample1', callback, false, false);
	module.send();
	
	var module2 = new ModuleLoader('textfieldsample1', callback2, false, false);
	module2.send();
	
}
EOD;
	}
	public function getContent(){
		$id = $this->id;
		$value = $this->value;
		
		$field1 = Module::get('TextFieldModule', $this->page, $this);
		$field1->fieldId = $id;
		
		$content = <<<EOD
		<div onclick="open_new_page();">testing</div>
<textarea id="{$id}">{$value}</textarea>
{$field1->getContent()}
<div id="test1"></div>
<div id="test2"></div>
EOD;
		
		return $content;
		
		
		
	}
}
?>