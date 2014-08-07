<?php
class Annuar11Module extends Module{
	private $tempHTMLVars = array();
	public function getJsLink(){
		return array();
	}
	public function getCssLink() {
        return array("etmas_style");
    }
	public function getJs(){
		return ;
	}
	public function getCss(){
		return ;
	}
	public function pushToHTML($name, $value){
		$this->tempHTMLVars[$name] = $value;
	}
	private function getPreContent(){
		$target = '';
		$keysAndValues = $this->tempHTMLVars;
		if(is_array($keysAndValues)){
			foreach($keysAndValues as $key => $value){
				$target = $key;
				$$target = $value;
			}
		}
		$content = <<<EEOD
<div style="width: 200px; height: 200px; border: 1px dotted black; position: absolute; top: 38px; left: 347px;"><div id="security_department_nav_add_new" class="btn btn-transparent btn-block" data-ajax-bind="module:'department_addnew'" data-target="target:'department_form_container'" style="left: 15px; top: 32px; position: absolute;">
<span class="small-icon-addnew"></span><label class="label">Add New</label>
</div></div>
EEOD;
		$header = Module::getFromFile('system_pages/sys_header.php','SystemHeader',$this);
$header->module_image_content = "<img src='imgs/private.png' class='img-menu-size'>";
$header->module_label_content = "<h1>Annuar11</h1>";

$header->module_content = <<<EEOD
<div style=" position: relative;height:300px;">$content</div>
EEOD;
$content = $header->getContent();
		return $content;
	}
	private function getElement($id, $keysAndValues){
		$result = '';
		$target = '';
		if(is_array($keysAndValues)){
			foreach($keysAndValues as $key => $value){
				$target = $key;
				$$target = $value;
			}
		}
		{}
		return $result;
	}
	private function runCode(){
		
	}
	public function getContent() {
		$this->runCode();
		$content = $this->getPreContent();
		return $content;
	}

}
?>
