<?php

class PaginationComponent extends Module {

	public function getKeys() {
		return array("id","start","total","numRows", "moduleRequest","form","target");
	}
    
    public function getJs() {
        $isPost = isset($this->form) ? "true" : "false";
        return <<<EOD
(function() {
    var requestStop = false;
    var pagination = {
        form: '',
        counter : 1,
        totalCount: 0,
        next : function() {
            if(this.counter < this.totalCount) {
                this.counter++;
                this.update();
                requestStop = false;
            }else {
                this.counter = this.totalCount;
                requestStop = true;
            }
        },
        prev: function() {
            if(this.counter > 1) {
                this.counter--;
                this.update();
                requestStop = false;
            }else {
                this.counter=1;
                requestStop = true;
            }
        },
        update: function() {
            pagination.form =  document.getElementById(this.form) || ''; 
            pagination.form['record_start'].value = this.counter;    
           
        }
    }
            
    UI.Navs.load();
    UI.AjaxBindLoader.load();
    UI.AjaxBindLoader.bindAction("paginationNavigate",function(args) {
            var button = args.source;
            var numRowsId = args.bind.numRows;
            var startId = args.bind.start;
            var totalCount = parseInt(document.getElementById(numRowsId).getAttribute('data-value'));
            
            var start = document.getElementById(startId);
            pagination.form = args.bind.form;
            pagination.counter =  parseInt(start.getAttribute('data-value'));
            if(button.getAttribute("data-key") == "next") {
                if(pagination.counter <= totalCount)  {
                    pagination.totalCount = totalCount;
                    pagination.next();
                }
            }else if(button.getAttribute("data-key") == "prev") {
                if(pagination.counter >= 1) {
                    pagination.prev();
                }
            }
            start.setAttribute("data-value",pagination.counter);
            
            if(requestStop) {
                requestStop = false;
                args.cancel = true;
            }
    });
    UI.AjaxBindLoader.bindVariable("pagination",pagination);
})();
EOD;
    }

    private function computePagination($numRows,$total) {
        $pageCount = floor($total / $numRows);
        if(($total % $numRows) > 0) {
            $pageCount += 1;
        }
        return $pageCount;
    }

	public function getContent() {

        $numRows = isset($this->numRows) ? (int)$this->numRows : 0;
        $total = isset($this->total) ? (int)$this->total : 0;
        $pageCount = $this->computePagination($numRows,$total);
        
        $form = "";
        if($this->form) {
            $form = "form:'" . $this->form . "',";
        }

        if($this->start <= 1) {
            $prevPage = $this->start;
            $stylePrev = "visibility: hidden";
        }else {
            $prevPage = $this->start - 1;
            $stylePrev = "visibility: visible ";
        }

        if($this->start >= $pageCount) {
            $nextPage = $pageCount;
            $styleNext = "visibility: hidden";
        }else {
            $nextPage = $this->start + 1;
            $styleNext = "visibility: visible";
        }

        $variables = "";
        if(isset($this->variables)) {
            $variables = "&".$this->variables;
        }

        $prevPageVar = "variables:'record_start=" .$prevPage. $variables . "',";
        $nextPageVar = "variables:'record_start=" .$nextPage. $variables . "',";
        
		return <<<EOD
<div class="pagin-nav">
    <table style="margin: 0 auto">
    <tr>
    <td><a id="{$this->id}_prev" data-key="prev" class="lt-icon" style="{$stylePrev}" data-ajax-bind="module:'{$this->moduleRequest}',{$form}{$prevPageVar}numRows:'numrows_{$this->id}',start:'start_{$this->id}'" data-target="target:'{$this->target}'"></a></td>
    <td>Page <span id='start_{$this->id}' data-value="{$this->start}">{$this->start}</span> of <span id="numrows_{$this->id}" data-value="{$pageCount}" >{$pageCount}</span></td>
    <td><a id="{$this->id}_next" data-key="next" class="gt-icon" style="{$styleNext}" data-ajax-bind="module:'{$this->moduleRequest}',{$form}{$nextPageVar}numRows:'numrows_{$this->id}',start:'start_{$this->id}'" data-target="target:'{$this->target}'"></a></td>
    </tr>
    </table>
</div>
EOD;
	}

}
?>

