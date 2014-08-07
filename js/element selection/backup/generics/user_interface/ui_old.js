


//string 


(function () {
    function _$(query) {
        this.elements = [];
        var i = 0;
        if (typeof query === 'string') {
            var results = document.querySelectorAll(query);
            if (results) {
                for (; i < results.length; i++) {
                    this.elements.push(results[i]);
                };
            }
        } else if (typeof query === "object" && query.nodeType === 1) {
            this.elements.push(query);
        } else {
            for (; i < query.length; i++) {
                this.elements.push(query[i]);
            }
        }
    }

    _$.prototype = {
        each: function (fn) {
            for (var i = 0; i < this.elements.length; i++) {
                fn.call(this, this.elements[i]);
            };
        },
        queryChildren: function (query) {
            var results = [];
            this.each(function (el) {
                var nodes = el.querySelectorAll(query);
                if (nodes) {
                    results.push(new _$(nodes));
                }
            })
            return results;
        },
        getByDataAttribute: function (dataKey, dataVal) {
            var object;
            this.each(function (el) {
                if (el.dataset[dataKey] == dataVal) {
                    object = new _$(el);
                }
            })
            return object;
        },
        attr: function (prop) {
            var property;
            var attribute;
            this.each(function (el) {
                attribute = el.getAttribute(prop) || false;
            })
            return attribute;
        },
        count: function () {
            return this.elements.length;
        },
        addClass: function (className) {
            this.each(function (el) {
                if (el.className)
                    el.className.concat(' ' + className);
                else
                    el.className = className;
            })
            return this;
        },
        setStyle: function (prop, value) {
            this.each(function (el) {
                el.style[prop] = value;
            });
            return this;
        },
        removeClass: function (className) {
            this.each(function (el) {
                if (el.className)
                    el.className = el.className.replace(className, '').trim();
            })
            return this;
        },
        addEvent: function (type, fn) {
            this.each(function (el) {
                function handleEvent(e) {
                    var args = {
                        source: new _$(el),
                        event: e
                    }
                    fn(args);
                }
                el.addEventListener(type, handleEvent, false);
            })
            return this;
        },
        removeEvent: function (type) {
            this.each(function (el) {
                el.removeEventListener(type, handleEvent);
            })
            return this;
        },
        getParent: function() {
            var parentNode;
            this.each(function(el){
                parentNode = el.parentNode;
            })
            return new _$(parentNode);
        },
        iterateAttr: function (prop, val) {
            var newTarget;
            this.each(function (el) {
                var target = el;
                while (typeof target != 'undefine') {
                    target = target.parentNode;
                    if (target.getAttribute(prop) == val) {
                        newTarget = new _$(target);
                        break;
                    }
                    else if (target.tagName.toLowerCase() == 'body') {
                        break;
                    }
                }
            });
            return newTarget;
        }
    }
    window.$ = function () {
        return new _$(arguments[0]);
    }
} ());

/***********************************************************************
@name: Util Package
************************************************************************/
var Util = {}


/***********************************************************************
@name: server.Request
************************************************************************/
var Server = Server || {}
Server.Request = {
    response : null,
    create: function(moduleName,isFormData,variables) {
        var mod = new ModuleLoader(moduleName,handleResponse,true,true);
        if(variables) {
            if(isFormData) {
                mod.addFormVariables(variables);
            }
            else {
                for(var key in variables) {
                    mod.addVariable(key,variables[key]);
                }
            }
        }
        mod.send();
        function handleResponse(obj) {
            if(Server.Request.response) 
                Server.Request.response(obj);
        }
     }
}



/***********************************************************************
@name: UI Package
************************************************************************/


var UI = UI || {}
UI.EventStack = function () {
    var stack = new Array();

    function isStackExist(key) {
        for (var i = 0; i < stack.length; i++) {
            if (stack[i].key == key) {
                return true;
            }
        }
        return false;
    }

    this.addStack = function (key, value) {
        if (!isStackExist(key)) {
            var object = {
                key: key,
                value: value
            }
            stack.push(object);
        }
    }

    this.removeStack = function (key) {
        if (true) { };
        for (var i = 0; i < stack.length; i++) {
            if (stack[i].key == key) {
                var indexOfStack = stack.indexOf(stack[i]);
                stack.splice(indexOfStack, 1);
                return true;
            }
        }
        return false;
    }

    this.isStackExist = function (key) {
        return isStackExist(key);
    }

    this.executeStack = function (eventArgs) {
        var total = stack.length;
        for (var i = 0; i < total; i++) {
            stack[i].value(eventArgs);
        }
    }

    this.printStack = function () {
        console.log(stack);
    }

    this.getStack = function (key) {
        for (var i = 0; i < stack.length; i++) {
            if (stack[i].key == key) {
                return stack[i].value;
            }
        }
        return false;
    }
}
UI.DocumentHandler = (function () {

    var eventStack = new UI.EventStack();
    var eventActivated = new Array();
    var isActivate = false;

    var actionCollection;
    var documentAction;

    function loadJs(script, id) {
        var fileref = document.createElement('script')
        fileref.id = id + '_script';
        fileref.setAttribute("type", "text/javascript")
        fileref.innerHTML = script;
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }

    function addAction(eventLabel, event, action) {
        documentAction.setAction(eventLabel, event, action);
        documentAction.startAction(eventLabel);
    }

    function eventHandler(e) {
        var target = e.target;

        while (typeof target.tagName != 'undefined') {
            var eventLabel = target.getAttribute('role');
            if (eventLabel) {
                var eventLabel = eventLabel + '-' + e.type;
                targFunction = eventStack.getStack(eventLabel);
                if (targFunction) {
                    targFunction(target, e);
                }
                break;
            }
            if (target.tagName.toLowerCase() == 'body') {
                break;
            }
            target = target.parentNode;
        }

    }

    

    return {
        addAction: function (type, callback, key) {
            var types = type.split(',');
            for (var i = 0; i < types.length; i++) {
                if(eventActivated.indexOf(types[i]) < 0) {
                    document.getElementsByTagName('body')[0].addEventListener(types[i], eventHandler, false);
                    eventActivated.push(types[i]);
                }
                eventStack.addStack(key + "-" + types[i], callback);
            }
        },
        unloadAction: function () {

        },
        attached: function (el, parent) {
            if (typeof el == 'string') {
                var elString = el;
                el = document.createElement('div');
                el.innerHTML = elString;
            }
            if (parent)
                document.getElementById(parent).appendChild(el);
            else
                document.getElementsByTagName('body')[0].appendChild(el);

        },
        loadJs: function (script, id) {
            loadJs(script, id);
        }
    }

})();
UI.Controllers = (function () {

    var cmdStack = new Array();

    return {
        addController: function (cmdName, cmdObject) {
            var object = {
                key: cmdName,
                pause: false,
                cmdObject: cmdObject
            }
            cmdStack.push(object);
        },
        removeController: function (cmdName) {
            var totalCmdStack = cmdStack.length;

            for (var i = 0; i < totalCmdStack; i++) {
                if (cmdStack[i].key == cmdName) {
                    cmdStack.splice(cmdStack.indexOf(cmdStack[i]), 1);
                    console.log(cmdStack);
                    return true;
                    break;
                }
            }
            return false;
        },
        getController: function (cmdName) {
            var totalCmdStack = cmdStack.length;

            for (var i = 0; i < totalCmdStack; i++) {
                if (cmdStack[i].key == cmdName) {
                    return cmdStack[i].cmdObject;
                    break;
                }
            }
            return false;
        }
    }
})();

UI.Tab = function (groupName) {

    var buttonTabs;
    var pageTabs = new Array();
    var onActive = new Array();
    var beforeActive = new Array();
    var activeTab;
    var that = this;

    function init() {
        buttonTabs = $("[data-group='" + groupName + "']");
        var pages = $("[data-ref='" + groupName + "']");
        pages.each(function (el) {
            var obj = new UI.PageTab(el);
            pageTabs.push(obj)
        })
    }

    this.activate = function (object) {
        activate(object);
    }
    this.hasParent = function () {
        var tabOwnerName = '', pageKey = '';
        //get the element
        var target = activeTab.iterateAttr("role", "page");
        if (target) {
            tabOwnerName = target.getParent().attr("data-ref");
            pageKey = target.attr("data-tab");
        }
        return {
            tabOwnerName: tabOwnerName,
            pageKey: pageKey
        }
    }
    this.setCustomFunction = function (eventFunction) {
        if (eventFunction.onActive) onActive.push(eventFunction.onActive);
        if (eventFunction.beforeActive) beforeActive.push(eventFunction.beforeActive);
    }

    function eventTrigger(eventArgs, trigger) {
        if (trigger == 'active') {
            if (onActive.length > 0) {
                for (var i = 0; i < onActive.length; i++) {
                    onActive[i](eventArgs);
                }
            }
        }
        else if (trigger == 'before') {
            if (beforeActive.length > 0) {
                for (var i = 0; i < beforeActive.length; i++) {
                    beforeActive[i](eventArgs);
                }
            }
        }
    }

    function activate(key) {
        var selectedTab = buttonTabs.getByDataAttribute('key', key);
        var eventArgs = {
            cancel: false,
            object: that,
            source: activeTab
        }
        if (selectedTab) {
            //trigger before active event event
            eventArgs.precedingTab = selectedTab;
            eventTrigger(eventArgs, 'before');
            if (eventArgs.cancel) { return false; }
            if (activeTab) {
                activeTab.removeClass("selected");
            }

            //activate event
            selectedTab.addClass("selected");
            eventTrigger(eventArgs, 'active');
            activeTab = null;
            activeTab = selectedTab;
            activatePage(key);
            return true;
        }
    }

    function activatePage(key) {
        var total = pageTabs.length;
        if (total > 0) {
            for (var i = 0; i < total; i++) {
                pageTabs[i].activate(key);
            }
        }
    }
    init();
}

UI.PageTab = function (pageElement) {

    var tabPages;
    var activePage;
    this.activate = function (key) {
        activate(key);
    }
    function init() {
        tabPages = $("#" + pageElement.id + " > [role='page']");
        tabPages.each(function (el) {
            el.style.display = "none";
        })
    }
    function activate(key) {
        var page = tabPages.getByDataAttribute("tab", key);
        if (page) {
            if (activePage) {
                if (key != activePage.attr('data-tab', key)) {
                    activePage.setStyle("display", "none");
                }
            }
            page.setStyle("display", "block");
            activePage = page;
        }
    }

    init();
}


/***********************************************************************
	@desc: Validator
	@method:
		addValidationRule 	: add validation rules of the input
            id: id of the input
            rule: validation rule [required:false pattern:/[a-z]/g]
        validates:  validates the value according to the rule that has been setup
            targetObj: the target to validate
		getCurrentState: get the current state [this property is useful when performing the validation event]
        getState: get all input state before submiting the form
            
	@Events:
		onValidation	: fires when the element changes
		onMouseOver : trigger when the 

************************************************************************/







/***********************************************************************
@name: UI.Controls Package

************************************************************************/
UI.Controls = {}

UI.Controls.Control = {
    validator : function() {
        
    },
    tab : function() {
        
    }
}

UI.Controls.Validator = function () {

    var that = this;
    this.validates = function () {
        var value = extractValue(this.sourceElements);
        doValidation(value);
    }

    function extractValue(sourceElements) {
        var value;
        var totalTarget = sourceElements.length;
        if (sourceElements) {
            //get the value;
            for (var i = 0; i < totalTarget; i++) {
                switch (sourceElements[i].type) {
                    case "radio":
                        if (sourceElements[i].checked == true) {
                            value = sourceElements[i].value;
                        }
                        break;
                    default:
                        value = sourceElements[i].value;
                        break;
                }
            }
            return value;
        }
        return false;
    }

    function doValidation(value) {
        that.errorTrace = '';
        switch (that.validationType) {
            case 'required':
                if (value.trim().length > 0) {
                    that.state = true;
                } else {
                    that.state = false;
                    that.errorTrace = 'required';
                }
                break;
            case 'optional':
                if (value.trim().length > 0) {
                    if (that.pattern) {
                        that.state = that.pattern.test(value);
                        if (!that.state)
                            that.errorTrace = 'pattern';
                    }
                } else {
                    that.state = true;
                }
                break;
            case 'strict':
                if (value.trim().length > 0) {
                    if (that.pattern) {
                        that.state = that.pattern.test(value);
                        if (!that.state)
                            that.errorTrace = 'pattern';
                    }
                } else {
                    that.state = false;
                    that.errorTrace = 'required';
                }
                break;
            default:
                break;
        }
    }

}
UI.Controls.Validator.prototype = {
    id : null,
    pattern : null,
    state : true,
    validationType : '',
    sourceElements : new Array(),
    errorTrace : ''
}

UI.Controls.NodeObject = function () {

    this.key = null;
    this.sourceElement = null;
    this.closeableElement = null;
    this.active = false;
    this.group = null;

    this.activate = function () {
        this.sourceElement.className = this.sourceElement.className.joinString('selected', ' ');
        this.active = true;
    }
    this.deactivate = function () {
        this.sourceElement.className = this.sourceElement.className.removeJoin('selected', ' ');
        this.active = true;
    }

    this.setSourceElement = function (element) {
        this.sourceElement = element;
    }

}
UI.Controls.TabObject = function() {
   
    UI.Controls.NodeObject.call(this);


    
}
UI.Controls.TabPageObject = function() {
    
    UI.Controls.NodeObject.call(this);
    
    this.activate = function() {
        this.sourceElement.style.display = 'block';
        this.active = true;
    }
    this.deactivate = function() {
        this.sourceElement.style.display = 'none';
        this.active = false;
    }
}
UI.Controls.MenuObject = function () {
    var that = this;
    this.id = null;
    this.commands = new Array();
    this.eventArgs = {
        source: this,
        object: null
    }
    this.switchStyle = false;
    this.switchState = false;
    this.sourceElement = null;

    function triggerEvent() {
        var totCommand = that.commands.length;
        if (totCommand > 0) {
            for (var i = 0; i < totCommand; i++) {
                that.commands[i](that.eventArgs);
            }
        }
    }

    this.switchOn = function () {
        if (this.switchStyle) {
            if (!this.switchState) {
                this.sourceElement.className = this.sourceElement.className.joinString('switch');
                this.switchState = true;
                return true;
            }
        }
        return false;
    }
    this.switchOff = function () {
        if (this.switchStyle) {
            if (this.switchState) {
                this.sourceElement.className = this.sourceElement.className.removeJoin('switch');
                this.switchState = false;
                return true;
            }
        }
        return false;
    }
    this.autoSwitch = function () {
        if (this.switchStyle) {
            if (this.switchState) {
                return this.switchOff()
            } else {
                return this.switchOn()
            }
        }
        return true;
    }
    this.dropDown = function () {

    }
}



/***********************************************************************
@name: UI.Controls.TabCollection 

@description:
    Collection of Tab Control uses to create controller for the tab structure 

@example:
    var tabCol = UI.Controls.TabCollection.getInstance();
    tabCol.load()

@method:
    load() : create a class function based on the given structure
    reload(): recreate class function
    activateTab(groupName,key): activate selected group of tab
        groupName : specify group of tab to be activated
        key : specify the button tab to be activated
    get(key): return specify group tab as an object
************************************************************************/

UI.Controls.Tabs = (function () {

    var instance;

    function construct() {
        var tabCol = new Array();
        /*
        inspect all the elements within the documents and search for the tab on the attribute role
        and generate classes automatically
        */
        function generateTab(groupName) {
            if (!groupName) {
                var tabElements = $("[role='tab']").each(function (el) {
                    var groupId = el.id;
                    if (!getTab(groupId)) {
                        register(groupId);
                    }
                });
            }
            else {
                register(groupId);
            }
        }
        
        function addTab(obj) {
            var ref = obj.id;
            if (!getTab(ref)) {
                tabCol.push(obj);
                return true;
            }
            return false;
        }
        function register(groupId) {
            var obj = {
                id: groupId,
                tabButton: new UI.Tab(groupId)
            }
            addTab(obj);
        }

        function activateTab(group, key) {
            var currentTab = getTab(group);
            if (currentTab) {
                currentTab.activate(key);
                parentOwner = currentTab.hasParent();
                if (parentOwner.tabOwnerName.length > 0) {
                    arguments.callee(parentOwner.tabOwnerName, parentOwner.pageKey);
                }
            }
        }

        function getTab(groupName) {
            var total = tabCol.length;
            if (total > 0) {
                for (var i = 0; i < total; i++) {
                    if (tabCol[i].id == groupName) {
                        return tabCol[i].tabButton;
                    }
                }
            }
            return false;
        }
        function setEvent(groupName, eventType, callback) {
            var curTab = getTab(groupName);
            if (curTab) {
                if (eventType == 'beforeActive')
                    curTab.beforeActive = callback;
                if (eventType == 'onActive')
                    curTab.onActive = callback;
            }
            return false;
        }
        function handleEvent(target, e) {
            var groupName = target.getAttribute('data-group');

            var curTab = getTab(groupName);
            if (curTab)
                curTab.activate(target.getAttribute('data-key'));
        }
        function removeTab(groupName) {
            var curTab = getTab(groupName);
            if (curTab) {
                tabCol.splice(tabCol.indexOf(curTab), 1);
            }
        }

        return {
            load: function (groupName) {
                tabCol = new Array();
                generateTab(groupName);
                UI.DocumentHandler.addAction('click', handleEvent, 'button-tab');
            },
            reload: function () {
                tabCol = new Array();
                generateTab(groupName);
            },
            reloadingCache: function () {
                generateTab();
            },
            printStack: function () {
                console.log(tabCol);
            },
            activateTab: function (groupName, key) {
                activateTab(groupName, key)
            },
            get: function (groupName) {
                return getTab(groupName);
            },
            remove: function (groupName) {
                return removeTab(groupName);
            }
        }
    }


    return {
        getInstance: function () {
            if (!instance) {
                instance = new construct();
            }
            return instance;
        }
    }
})();

/***********************************************************************
@name: UI.Controls.Tab

@description:
    Tab Control

@method:
     activateTab(key) : activate the specify tab
     isActivated(key) : check whether the specify tab is activated
     getButtonTab(key) : return the button tab
     hasParent() : check whether the tab control is a child and has a tab control parent
     setCustomFunction(eventFunction) : set the event

     appendButtonTab(buttonTab)
     appendBeforeSibling(key,sibling)
***********************************************************************/


UI.Controls.Tab = function (className) {

    var tabPages = new Array();
    var buttonTabs = new Array();
    var that = this;
    var currentActiveTab;
    var onActive = new Array();
    var beforeActive = new Array();

    this.appendButtonTab = function (buttonTab) {
        register(buttonTab);
    }
    this.closeButtonTab = function (key) {
        closeButtonTab(key);
    }
    this.activateTab = function (key) {
        activateTab(key);
    }
    this.getRelatedPage = function (key) {
        var total = tabPages.length;
        var pages = new Array();
        if (total > 0) {
            for (var i = 0; i < total; i++) {
                pages.push(tabPages[i].getPage(key));
            };
            if (pages.length > 0)
                return pages;
        }
        return false;
    }
    this.isActivated = function (key) {
        if (currentActiveTab.key == key) {
            return true;
        }
    }
    this.getButtonTab = function (key) {
        getButtonTab(key)
    }
    this.hasParent = function () {

        //get the element
        var target = currentActiveTab.sourceElement;
        var tabOwnerName = '', pageKey = '';

        //search the parent of the element
        while (typeof target.tagName != 'undefined') {
            target = target.parentNode;

            //check if the element is inside the page
            if (target.getAttribute('role') == 'page') {
                //get the parent owner of the page
                tabOwnerName = target.parentNode.getAttribute('data-ref');
                pageKey = target.getAttribute('data-tab');
                break;
            }

            if (target.tagName.toLowerCase() == 'body') {
                break;
            }
        }

        return {
            tabOwnerName: tabOwnerName,
            pageKey: pageKey
        }
    }
    
    this.setCustomFunction = function (eventFunction) {
        if (eventFunction.onActive) onActive.push(eventFunction.onActive);
        if (eventFunction.beforeActive) beforeActive.push(eventFunction.beforeActive);
    }
    this.addTabPage = function (pageTab) {
        tabPages.push(pageTab);
    }
    

    function init() {
        var elementTabs = $("[data-group='" + className + "']");
        var elementPages = document.querySelectorAll("[data-ref='" + className + "']");

        if (elementTabs) {
            elementTabs.each(function(el) {
                register(el);
            })
        }

        if (elementPages) {
            var totalPage = elementPages.length;
            for (var i = 0; i < totalPage; i++) {
                //instantiate page object
                var page = new UI.Controls.Page();
                page.setSourceByElement(elementPages[i]);
                page.load();
                tabPages.push(page);
            }
        }
    }
    function eventTrigger(eventArgs, trigger) {
        if (trigger == 'active') {
            if (onActive.length > 0) {
                for (var i = 0; i < onActive.length; i++) {
                    onActive[i](eventArgs);
                }
            }
        }
        else if (trigger == 'before') {
            if (beforeActive.length > 0) {
                for (var i = 0; i < beforeActive.length; i++) {
                    beforeActive[i](eventArgs);
                }
            }
        }
    }
    function register(node) {
        var obj = new UI.Controls.TabObject();
        obj.key = node.getAttribute('data-key');
        obj.group = node.getAttribute('data-group');
        obj.sourceElement = node;
        buttonTabs.push(obj);
    }
    function getButtonTab(key) {
        for (var i = 0; i < buttonTabs.length; i++) {
            if (buttonTabs[i].key == key) {
                return buttonTabs[i]
            }
        }
        return false;
    }
    function activateTab(key) {

        var btnTab = getButtonTab(key);

        var eventArgs = {
            cancel: false,
            object: that,
            source: currentActiveTab
        }

        if (btnTab) {
            //trigger before active event event
            eventArgs.precedingTab = btnTab;
            eventTrigger(eventArgs, 'before');
            if (eventArgs.cancel) { return false; }

            if (currentActiveTab) {
                currentActiveTab.deactivate();
            }

            //activate event
            btnTab.activate();
            eventTrigger(eventArgs, 'active');
            currentActiveTab = null;
            currentActiveTab = btnTab;
            activatePageTab(key); //activate page
            return true;
        }
    }
    function activatePageTab(key) {
        var total = tabPages.length;
        if (total > 0) {
            for (var i = 0; i < total; i++) {
                tabPages[i].activate(key);
            };
        }
    }
    function closeButtonTab(key) {
        var buttonTab = getButtonTab(key);
        if (buttonTab) {

            //remove the tab it's parent
            var tabElement = buttonTab.sourceElement;
            tabElement.parentNode.removeChild(tabElement);

            //removing from the collection
            buttonTabs.splice(buttonTabs.indexOf(tabElement), 1);

            //remove it's connected page
            closePageTab(key);
            return true;
        }

        return false;
    }

    function closePageTab(key) {
        for (var i = 0; i < tabPages.length; i++) {
            tabPages[i].removePage(key);
        }
    }
    init();
}

/***********************************************************************
@name: UI.Controls.Page
************************************************************************/
UI.Controls.Page = function () {

    var parentSource;
    var pages = new Array();
    var currentActivePage;

    this.setSourceByElement = function (element) {
        parentSource = element;
    }

    this.activate = function (key) {
        var page = getPage(key);
        if (page) {
            if (currentActivePage) {
                if (page.key != currentActivePage.key) {
                    currentActivePage.deactivate();
                }
            }
            currentActivePage = page;
            page.activate();
        }
    }
    
    this.getPage = function (key) {
        return getPage(key);
    }
    
    this.addPage = function (key, content) {
        //create element div
        var node = document.createElement('div');
        node.setAttribute('role', 'page');
        node.setAttribute('data-tab', key);
        node.innerHTML = content;
        register(node);
    }
    this.load = function () {
        init();
    }
    this.removePage = function (key) {
        //remove the page to its parent
        var page = getPage(key);
        parentSource.removeChild(page.sourceElement);
        pages.splice(pages.indexOf(page), 1);
    }

    function getPage(key) {
        var total = pages.length;
        if (total > 0) {
            for (var i = 0; i < total; i++) {
                if (pages[i].key == key) {
                    return pages[i];
                }
            }
        }
        return false;
    }
    function addPage(obj) {
        var ref = obj.key;
        isPageExist = getPage(ref);
        if (!isPageExist) {
            pages.push(obj);
            return true;
        }
        return false;
    }
    function register(node) {
        var obj = new UI.Controls.TabPageObject();
        obj.key = node.getAttribute('data-tab');
        obj.sourceElement = node;
        obj.deactivate();

        if (addPage(obj)) {
            return obj;
        }
        return false;
    }
    function init() {
        var pageElements = document.querySelectorAll("#" + parentSource.id + ">[role='page']");
        var total = pageElements.length;
        for (var i = 0; i < total; i++) {
            register(pageElements[i]);
        }
    }
}


/***********************************************************************
@name: UI.Controls.MenuCollection 

@description: Collection of Menu Control 

@example:
    var menu = UI.Controls.MenuCollection.getInstance();
    menu.load()

@method:
    load() : create a class function based on the given structure
    reload(): recreate class function
    get(groupName): return a menu object
************************************************************************/
UI.Controls.MenuCollection = (function () {

    var instance;

   function construct() {
        var menuCol = new Array();
        
        function load() {
            var menuGroupNames = new Array();
            var buttonsMenu = document.querySelectorAll("[role='button-menu']");

            if (buttonsMenu.length > 0) {
                for (var i = 0; i < buttonsMenu.length; i++) {
                    var isExist = false;
                    var groupName = buttonsMenu[i].getAttribute("data-group");
                    if (groupName) {
                        if (menuGroupNames.length > 0) {
                            if (menuGroupNames.indexOf(groupName) >= 0) {
                                isExist = true;
                            }
                        }
                        if (!isExist) {
                            menuGroupNames.push(groupName);
                        }
                    }
                }
            
                if (menuGroupNames.length > 0) {
                    for (var i = 0; i < menuGroupNames.length; i++) {
                        register(menuGroupNames[i]);
                    }
                    return true;
                }
            }
            return false;
        }

        function register(groupName) {
            var groupExist = get(groupName);
            if (groupExist) {
                return false;
            }

            var object = {
                id: groupName,
                switchMenu: new UI.Controls.SwitchMenu(groupName)
            }
            
            menuCol.push(object);
            return true;
        }
        
        function get(groupName) {
            for (var i = 0; i < menuCol.length; i++) {
                if (menuCol[i].id == groupName) {
                    return menuCol[i].switchMenu;
                }
            }
            return false;
        }
        function handleEvent(target, e) {
            var groupName = target.getAttribute('data-group');
            var curMenu = get(groupName);
            if (curMenu) {
                curMenu.triggerEvent(target, e);
            }
        }

        return {
            load: function () {
                if (load()) {
                    UI.DocumentHandler.addAction('click,mouseover,mouseout', handleEvent, 'button-menu');
                }
            },
            reload: function () {
                load();
            },
            get: function (groupName) {
                return get(groupName);
            },
            printStack: function () {
                console.log(menuCol);
            }
        }
   }

   return {
       getInstance : function() {
           if(!instance) {
               instance = new construct();
           }
           return instance;
       }
   }

})();


/***********************************************************************
@description: SwitchMenu Class 
@method:
    toggleSwitch: toggle the switch
        buttons : list of button to toggle ie[new Array('button_home')]
        toggle : set toggle ['on'|'off'|'auto']
	reset : turn the switch button off
        buttons : list of buttons that need not to turn off
    setCustomFunction : set an event
        onClick : trigger when menu clicked
        onMouseOver: trigger when mouse is over on menu
    setButtonSwitch : set button to switch 
        buttonId : specify which button menu 
***********************************************************************/
UI.Controls.SwitchMenu = function (groupName) {
    
    var buttons = new Array();
    var that = this;
    var currentTarget;
    var eventObject = {
        onClick: new Array(),
        onMouseOver: new Array()
    }

    this.getCurrentTarget = function () {
        return currentTarget;
    }
    this.toggleSwitch = function (buttonsId, toggle) {
        if (typeof buttonsId == 'string') {
            buttonsId = buttonsId.split(',');
        }
        if (buttonsId instanceof Array) {
            for (var i = 0; i < buttonsId.length; i++) {
                var button = getButton(buttonsId[i]);
                if (button) {
                    executeToggle(button, toggle);
                }
            }
        }
    }
    this.reset = function (buttonsId) {
        if (typeof buttonsId == 'string') {
            buttonsId = buttonsId.split(',');
        }
        var excluded = function (buttonsId,id) {
            if (buttonsId) {
                for (var i = 0; i < buttonsId.length; i++) {
                    var buttonId = buttonsId[i];
                    if (buttonId == id) {
                        return true;
                        break;
                    }
                }
            }
            return false
        };
        var totalButtons = buttons.length;
        for (var i = 0; i < totalButtons; i++) {
            if (buttons[i].switchStyle) {
                var isExcluded = excluded(buttonsId,buttons[i].id);
                if (!isExcluded) {
                    executeToggle(buttons[i], false);
                }
            }
        }
    }
    this.triggerEvent = function (target, e) {
        var button = getButton(target.id);
        switch (e.type) {
            case 'click':
                executeToggle(button);
                //fire out event

                break;
            case 'mouseover':
                break;
        }
    }
    this.setCustomFunction = function (eventFunction) {
        if (eventFunction.onClick) eventObject.onClick.push(eventFunction.onClick);
        if (eventFunction.onMouseOver) eventObject.onMouseOver.push(eventFunction.onMouseOver);
    }
    this.setButtonSwitch = function (buttonId) {
        var button = getButton(buttonId)
        if (button) {
            button.switchStyle = true;
        }
    }

    function init() {
        var menuButton = document.querySelectorAll("[data-group='" + groupName + "']");
        for (var i = 0; i < menuButton.length; i++) {
            if(menuButton[i].getAttribute('role') && menuButton[i].getAttribute('role') == 'button-menu') {
                register(menuButton[i]);    
            }
        }
    }
    function register(sourceElement) {
        var object = new UI.Controls.MenuObject();
        object.id = sourceElement.id;
        object.sourceElement = sourceElement;
        var menuStyle = sourceElement.getAttribute("data-style");
        if(menuStyle == 'switch')   object.switchStyle = true;
        buttons.push(object);
    }
    function getButton(targetId) {
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].id == targetId) {
                return buttons[i];
            }
        }
        return false;
    }
    function executeToggle(target, toggle) {
        var isToggle = true;
        if (typeof toggle == "undefined") { isToggle = target.autoSwitch(); } 
        else if (toggle) { isToggle = target.switchOn(); } 
        else { isToggle = target.switchOff(); }

        if (isToggle) {
            //trigger event
            var eventArgs = {
                source: target,
                object: that
            }
            if (eventObject.onClick.length > 0) {
                for (var i = 0; i < eventObject.onClick.length; i++) {
                    eventObject.onClick[i](eventArgs);
                }
            }
        }
    }
    init();
}

UI.Controls.ValidationCollection = (function () {
    
    var groupStack = new Array();
    
    function load() {
        var validationGroupName = new Array();
        var validationGroup = document.querySelectorAll("[data-validation]") || false;
        if (validationGroup) {
            for (i = 0; i < validationGroup.length; i++) {
                var isExist = false;
                var groupName = validationGroup[i].getAttribute("data-group");
                if (groupName) {
                    if (validationGroupName.length > 0) {
                        if (validationGroupName.indexOf(groupName) >= 0) {
                            isExist = true;
                        }
                    }
                    if (!isExist) {
                        validationGroupName.push(groupName);
                    }
                }
            }
            
            if (validationGroupName.length > 0) {
                for (var i = 0; i < validationGroupName.length; i++) {
                    register(validationGroupName[i]);
                }
                return true;
            }
        }
    }

    function register(groupName) {
        var object = {
            id: groupName,
            groupValidation: new UI.Controls.GroupValidation(groupName)
        }
        groupStack.push(object);
    }

    return {
        load: function () {
            groupStack = new Array();
            load();
        },
        reload: function () {
            load();
        },
        printStack: function () {
            console.log(groupStack);
        },
        get: function (id) {
            for (i = 0; i < groupStack.length; i++) {
                if (groupStack[i].id == id) {
                    return groupStack[i].groupValidation;
                }
            }
            return false;
        },
        add: function () {

        },
        remove: function () {

        }
    }

})();

/***********************************************************************
	@desc: FormValidation Class 
	@method:
***********************************************************************/
UI.Controls.GroupValidation = function (className) {

    var validationStack = new Array();

    var emailPattern = /^([^\^\"\'\|\\])+?@([a-z]+?)\.([a-z]{2,4})$/;
    var currencyPattern = /[0-9\,\.]+/;

    var that = this;

    this.isValid = function () {
        var totalValStack = validationStack.length;
        var markIsValid = true;
        for (var index = 0; index < totalValStack; index++) {
            validationStack[index].validates();
            var validate = validationStack[index].state;
            if (!validate) {
                markIsValid = false;
            }
        }
        return markIsValid;
    }

    this.validates = function (id) {
        var validation = getValidationStack(id);
        return validation.validates();
    }

    this.getState = function () {
        return validationStack;
    }

    function init() {
        //create form event
        var inputNode = document.querySelectorAll("[data-group='" + className + "']");
        
        for (var i = 0; i < inputNode.length; i++) {
            var validationType = inputNode[i].getAttribute('data-validation') || false;
            if (validationType) {
                registerValidation(inputNode[i], validationType);
            }
        }
    }

    function registerValidation(node, validationType) {
        var obj = new UI.Controls.Validator();
        obj.id = node.id;
        obj.sourceElements = document.getElementsByName(node.name) || null;
        obj.validationType = validationType;
        obj.pattern = node.getAttribute('data-pattern') ? node.getAttribute('data-pattern') :
                        (function (dataType) {
                            if (dataType == 'email') { return emailPattern };
                            return false;
                        })(node.getAttribute('data-type') || 'string');
        validationStack.push(obj);
    }

    function getValidationStack(id) {
        var total = validationStack.length;
        for (vari = 0; i < total; i++) {
            if (validationStack[i].id == id) {
                return validationStack[i];
            }
        }
    }

    function getSerialize() {
        var totalCol = inputCollection.length;
        var fields = new Array();
        var strSerialize = "";
        if (totalCol > 0) {
            for (var i = 0; i < totalCol; i++) {
                var sourceElements = inputCollection[i];
                for (var x = 0; x < sourceElements.length; x++) {
                    var strSerialize = (serializer(sourceElements[x]));
                    if (strSerialize.length > 0)
                        fields.push(strSerialize);
                }
            }
            return fields.join('&');
        }
        return false;
    }

    function serializer(element) {
        var strSerialize = "";
        if (element.type != "button" || element.type != "submit" || element.type != "reset") {
            switch (element.type) {
                case "select-one":
                    var totalOption = element.options.length;
                    var value = "";
                    for (var i = 0; i < totalOption; i++) {
                        if (element.options[i].selected) {
                            value = (element.options[i].value) ? element.options[i].value : element.options[i].innerText;
                            break;
                        }
                    }
                    strSerialize = element.name + "='" + value + "'";
                    break;
                case "select-multiple":
                    break;
                case "radio":
                    if (element.checked == true) {
                        strSerialize = element.name + "='" + element.value + "'";
                    }
                case "undefined":
                    break;
                default:
                    strSerialize = element.name + "='" + element.value + "'";
                    break;
            }
        }
        return strSerialize;
    }
    init();
}