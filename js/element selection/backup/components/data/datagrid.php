<?php

/*
  Module: TitlebarModule
  Properties:
  guid - id
  class - css class
  text - label of check
  type - type of header (h1-h5)
  link - links of header

 */

class EDataGridModule extends Module {

    var $page;
    

    public function __construct($page, $parentModule) {
        $this->page = $page;
    }

    public function getKeys() { 
        return array('guid','class','datasource');
    }
    

    public function getContent() {
        
        $cellData = array();
        $columnHeaders = array();
        $rowData = array();
        $theads = "";
        $trows = "";
        
        
        $guid = (isset($this->guid)) ? "id='" . $this->guid . "'" : "";
        $class = (isset($this->class)) ? "class='" . $this->class . "'" : "";
        $datasource = (isset($this->datasource)) ? $this->datasource : array();
        

        //initiliaze the header
        if(count($datasource)) 
        { 
            foreach($datasource as $rows => $cols) { 
                foreach($cols as $key=>$value) {
                    $columnHeaders[$key] = $key;
                }
                break;
            }
        }
                
        
        foreach ($columnHeaders as $key => $value) {
            $tcol = "<th>";
            $tcol .= $value;
            $tcol .= "</th>";
            $theads .= $tcol;
        }

        if(count($datasource)) {
            foreach ($datasource as $rows => $cols) {
                $trows .= "<tr>";
                foreach($cols as $key=>$value) 
                {
                    $tcol = "<td>" . $value . "</td>";
                }
                $trows .= $tcol . "</tr>";
            }
        }

        $htmlContent = <<<EOD
    <table id={$guid} {$class}>
        <thead>
            <tr>
                {$thead}
            </tr>
        </thead>
        <tbody>
            {$trows}
        </tbody>
    </table>
EOD;
        return $htmlContent;
    }
}