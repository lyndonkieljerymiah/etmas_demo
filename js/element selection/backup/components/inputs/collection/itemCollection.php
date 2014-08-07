<?php 


require_once 'Collection.php';


    
class ItemMenuCollection {

    private $itemCollection;
    
    public function __construct() { 
        $this->itemCollection = new ECollection();
    }
    
    public function addItem($itemMenu,$id=null) {
        if(gettype($itemMenu) == 'array') { 
            foreach($itemMenu as $key => $item) { 
                $this->itemCollection->addItem($item,$key);
            }
        }else {
            $this->itemCollection->addItem($itemMenu,$id);
        }
    }
    
    public function getItems() { 
        return $this->itemCollection->getItems();
    }
    
}    

class ItemBoxCollection { 

    private $itemCollection;
    
    public function __construct() { 
        $this->itemCollection = new ECollection();
    }
    
    public function addItem($boxItem,$key=null) { 
        $this->itemCollection->addItem($boxItem,$key);
    }
    
    public function getItems() { 
        return $this->itemCollection->getItems();
    }
}

class ColumnHeaderCollection extends ECollection { 

}
    
