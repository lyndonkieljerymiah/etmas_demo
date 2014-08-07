<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Collection
 *
 * @author Arnold
 */



class ECollection {

    private $members = array();
    private $onLoad;
    private $isLoaded = false;

    public function addItem($obj, $key = null) {
        try {
            $this->checkCallback();
            if ($key) {
                if (isset($this->members[$key])) {
                    throw new Exception("Key" . $key . " already in use");
                } else {
                    $this->members[$key] = $obj;
                }
            } else {
                $this->members[] = $obj;
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    public function removeItem($key) {
        try {
            $this->checkCallback();
            if (isset($this->members[$key])) {
                unset($this->members[$key]);
            } else {
                throw new Exception("Key " . $key . " is invalid");
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    public function getItems() { 
        return $this->members;
    }
    
    public function getItem($key) {
        try {
            $this->checkCallback();
            if (isset($this->members[$key])) {
                return $this->keys();
            } else {
                throw new Exception("Key " . $key . " is invalid");
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    public function length() {
        $this->checkCallback();
        return sizeof($this->members);
    }

    public function keys() {
        $this->checkCallback();
        return array_keys($this->members);
    }

    public function isExists($key) {
        $this->checkCallback();
        if (isset($this->members[$key])) {
            return true;
        } else {
            return false;
        }
    }

    public function setLoadCallback($functionName, $objOrClass = null) {

        if (isset($objOrClass)) {
            $callback = array($objOrClass, $functionName);
        } else {
            $callback = $functionName;
        }

        if (is_callable($callback, false, $callableName)) {
            throw new Exception($callableName . "is not callable as a parameter to onload");
            return false;
        }
        $this->onLoad = $callback;
    }

    /*
     * Check to see if a callback has been defined and if so
     * whether or not it has already been called. If not
     * invoke the callback function
     */

    private function checkCallback() {
        if (isset($this->onLoad) && (!$this->isLoaded)) {
            $this->isLoaded = true;
            call_user_func($this->onLoad, $this);
        }
    }

}

?>
