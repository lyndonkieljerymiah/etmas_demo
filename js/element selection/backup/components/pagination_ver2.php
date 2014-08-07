<?php
//suppressed the notice
error_reporting(E_ERROR | E_WARNING | E_PARSE);

class PaginationComponent extends Module {
    
    private $variableCollection;
    
    public function __construct($parentModule) {
        parent::__construct($parentModule);
        $this->variableCollection = array();
    }

	public function getKeys() {
		return array("pageRequest","currentPage","totalItems","itemsPerPage","pageObject","autoAddingStart");
	}

	public function setPageObject(&$object) {
	    $this->pageObject = $object;
	}

    public function addPageVariable($name,$value) {
        if(!array_key_exists($name,$this->variableCollection))
            $this->variableCollection[$name] = $value;
    }

    private function computePagination($itemsPerPage,$totalItems) {
        $pageCount = floor($totalItems / $itemsPerPage);
        if(($totalItems % $itemsPerPage) > 0) {
            $pageCount += 1;
        }
        return $pageCount;
    }

	public function getContent() {
        
        $itemsPerPage = isset($this->itemsPerPage) ? (int)$this->itemsPerPage : 0;
        $totalItems = isset($this->totalItems) ? (int)$this->totalItems : 0;
        $pageCount = $this->computePagination($itemsPerPage,$totalItems);
        $pageRequest = $this->pageRequest;
        
        if(isset($this->variableCollection)) {
            foreach($this->variableCollection as $key => $value) {
                    $this->pageObject->pageControl->setPageVariable($pageRequest,$key,$value);
            }
        }
        
        if(isset($this->pageObject)) {
            
            if($this->currentPage >= $pageCount) { 
               $nextPage = $this->currentPage;  
               $styleNext = "display:none";
            }
            else {
               $nextPage = $this->currentPage + 1;
               $styleNext = "display:block";
            }
            
            if($this->currentPage <= 1) {
                $prevPage = $this->currentPage;
                $stylePrev = "display:none";
            }else {
                $prevPage = $this->currentPage - 1;
                $stylePrev = "display:block";
            }
            
            
            $this->pageObject->pageControl->setPageVariable($pageRequest,'record_start',$nextPage);
            $nextPageLink = $this->pageObject->pageControl->getPageLink('open_page',
                            $this->pageObject->pagesRef[$this->pageObject->pageControl->getPageNumberByPageName($pageRequest)][2],
                            array($this->pageObject->pageControl->getPageNumberByPageName($pageRequest)),
                            $this->pageObject->pageControl->getPageNumberByPageName($pageRequest));
            
            $this->pageObject->pageControl->setPageVariable($pageRequest,'record_start',$prevPage);
            $prevPageLink = $this->pageObject->pageControl->getPageLink('open_page',
                            $this->pageObject->pagesRef[$this->pageObject->pageControl->getPageNumberByPageName($pageRequest)][2],
                            array($this->pageObject->pageControl->getPageNumberByPageName($pageRequest)),
                            $this->pageObject->pageControl->getPageNumberByPageName($pageRequest));
            
            
        }
        
        

		return <<<EOD
<div class="pagin-nav">
    <table style="margin: 0 auto">
    <tr>
    <td><a id="{$this->id}_prev" class="lt-icon" data-prev="{$prevPage}" style="{$stylePrev}" {$prevPageLink}></a></td>
    <td>Page <span id='start_{$this->id}'>{$this->currentPage}</span> of <span id="numrows_{$this->id}">{$pageCount}</span></td>
    <td><a id="{$this->id}_next" class="gt-icon" data-next="{$nextPage}" style="{$styleNext}" {$nextPageLink}></a></td>
    </tr>
    </table>
</div>
EOD;
	}

}
?>


