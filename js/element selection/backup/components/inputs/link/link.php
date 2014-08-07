<?php

/*
  Module: Link
  Properties:
    guid - id
    class - class 
    link - link address
 *  text - label
 *  title = tooltip

 */

Cls::Load('SiteMap');
class Link extends Module {
    
    public function __construct($parentModule) {
        parent::__construct($parentModule);
		$this->siteMap = new SiteMap();
    }
   
            
    public function getKeys() { 
        return array('guid','class','link','content','title','target','data');
    }
    
    public function getContent() {
	
        $guid = (isset($this->guid)) ? "id='$this->guid'" : "";
        $class = (isset($this->class)) ? "class='$this->class'" : "";
        $content = (isset($this->content)) ? $this->content : "";
        $title = (isset($this->title)) ? $this->title : "";
        $target = (isset($this->target)) ? $this->target : "";
		
		$link = (isset($this->link)) ? "href='" . $this->link . "'" : "";
        $siteLink  = $this->siteMap->getLink();
		if($siteLink != "") { 
			$link = "href='" . $siteLink . "'";
		}
		
		$dataAttrib = "";
		if(isset($this->data)) { 
			foreach($this->data as $key => $value) { 
				$dataAttrib .= "data-" . $key . "=" . $value . " ";
			}
		}
		
        $htmlContent = <<<EOD
   <a {$guid} {$link} {$class} {$target} {$dataAttrib}>{$content}</a>
EOD;
   return $htmlContent;
    }
    
}

?>
