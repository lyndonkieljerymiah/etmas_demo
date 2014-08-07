/***********************************************************************
@name: UI Package
************************************************************************/


/*******************************************
    @name: 
*/
function convertingCallback(stringCallback) {
    //check if the object is calling
    var arCallback = stringCallback.split(".");
    var ex = window;
    for (var i = 0; i < arCallback.length; i++) {
        ex = ex[arCallback[i]];
    }
    return ex;
}

var UI = UI || {}
UI.Components = {
    start: function() {
        if(!dq.Document.isSubscriberExist(this)) {
            dq.Document.subscribe(this);
            dq.Document.addAction('click,change');
        }
    },
    update: function (target, e) {
        var target = dq(e.target).bubble(new Array("data-ui-bind","data-ajax-bind"));
        if(target) {
            if (target.getAttr("data-ui-bind").length >0) {
                var dataBind = dq.Parser.uiParsing(target);
                if (dataBind.component) {
                    switch (dataBind.component) {
                        case "tab":
                            UI.Tabs.handleEvent(target, e)
                            break;
                        case "button":
                            UI.Navs.handleEvent(target, e)
                            break;
                        case "formfield":
                            break;
                    }
                }
            }
            if(target.getAttr("data-ajax-bind").length > 0) {
                UI.AjaxBindLoader.implement(target, e);
            } 
        }
    }
}

UI.AjaxBindLoader = (function () {

    var ajaxCounter = 0,
        _variables = '',
        _form = '',
        _module = '',
        _arg = false,
        isEventLoaded = false,
        hasMultipleRequest = false,
        customActionStack = null,
        waitingStack = null,
        customVariableStack = null;

    function init() {
        customActionStack = new dq.Stack();
        customVariableStack = new dq.Stack();
        
        waitingStack = new Array();
        autoload();
    }
    
    function autoload() {
        var ajaxElement = dq("[data-ajax-bind]");
        if (ajaxElement.length > 0) {
            ajaxElement.each(function (el) {
                var ajaxBind = dq.Parser.ajaxParsing($(el));
                if (ajaxBind.load) {
                    preExecute(ajaxElement);
                }
            });
        }
    }

    function requestProcess(ajaxBind, element) {
        ajaxRequest = dq.Server.createAjaxRequest(ajaxBind);
        if (ajaxRequest) {
            ajaxRequest.setCounter(ajaxCounter);
            ajaxRequest.execute(function (obj) {
                if (handleResponse(obj, element)) {
                    ajaxCounter++;
                    triggerEvent(element, "onLoaded", obj);
                }
            });
        }
    }

    /*checking and preparing for all the variables the need to send to the server*/
    function preExecute(element) {
        waitingStack = new Array(); //clear stack
        var bind = dq.Parser.ajaxParsing(element);
        if (_variables.length > 0) bind.variables = _variables;
        if (_form.length > 0) bind.form = _form || '';
        if (_module.length > 0) bind.module = _module || '';
        if (_arg) bind = _arg;
        execute(element, bind);
        clearVariables();
    }

    function clearVariables() {
        _variables = '';
        _form = '';
        _module = '';
        _arg = false;

    }

    function execute(element, bind) {
        
        var ajaxBind = bind || false;
        
        if (ajaxBind.map) {
            ajaxBind = customVariableStack.getStack(ajaxBind.map);
        }

        if (!ajaxBind) return false;
        hasMultipleRequest = false;

        //checking for multiple request
        if (ajaxBind.multipleRequest) {
            //set hasMultiple to prevent target delegation
            hasMultipleRequest = true;

            var arModules = ajaxBind.module,
                arVariables = ajaxBind.variables || null,
                arForms = ajaxBind.form || [];

            for (var i = 0; i < arModules.length; i++) {
                ajaxBind.module = arModules[i];
                if (typeof arVariables === 'string') {
                    ajaxBind.variables = arVariables;
                } else if (arVariables instanceof Array) {
                    ajaxBind.variables = arVariables[i] || null;
                }

                ajaxBind.form = arForms[i] || null;
                ajaxBind.immediate = false;
                requestProcess(ajaxBind, element);
            }
        }
        else {
            requestProcess(ajaxBind, element);
        }
    }
    function triggerEvent(source, trigger, loader) {
        var args = {
            source: source.items(0),
            bind: dq.Parser.ajaxParsing(source),
            cancel: false,
            loader: loader || null
        }
        switch (trigger) {
            case "onRequest":
                var onRequest;
                if (args.bind.onRequest) {
                    onRequest = customActionStack.getStack(args.bind.onRequest);
                    if (!onRequest) {
                        onRequest = convertingCallback(args.bind.onRequest);
                    }
                    if (onRequest) onRequest(args, UI.AjaxBindLoader);
                } else if (args.bind.onRequestObject) {
                    onRequest = args.bind.onRequestObject; //get the string function or object
                    convertingCallback(onRequest)(args, UI.AjaxBindLoader);
                }
                break;
            case "onLoaded":
                if (args.bind.onLoaded) {
                    var onLoaded = customActionStack.getStack(args.bind.onLoaded);
                    if (!onLoaded) {
                        onLoaded = convertingCallback(args.bind.onLoaded);
                    }
                    if(onLoaded) onLoaded(args);
                }
                break;
        }
        return args.cancel;
    }
    function handleResponse(obj, element) {

        //trigger event
        triggerEvent(element, "onLoaded", obj);

        //store body temporarily
        var targetArgs = element.getAttr("data-target")[0];
        var targetElement = null;

        if (!targetArgs) return false;

        targetArgs = dq.StringUtil.objectParsing(targetArgs);
        var temp = targetArgs.temp || "div";
        temp = document.createElement(temp);
        temp.innerHTML = obj.getBody().trim().replace(";;", ";");

        //avoid target delegation
        if (!hasMultipleRequest) {
            //first to check the multiple target
            if (targetArgs.multipleTarget) {
                //looking for data-target
                var targetForDest = dq(temp).find('[data-target]')[0];
                //target for destination found
                if (targetForDest.length > 0) {
                    //iterating until no one left
                    targetForDest.each(function (el) {
                        var objectTaget = $(el);
                        //break it down
                        var targetForDestBinding = dq.Parser.customParsing(objectTaget, 'data-target');
                        if (targetForDestBinding.destination) {
                            var targetSource = document.getElementById(targetForDestBinding.destination) || false;
                            //make sure that is exact destination
                            if (targetSource) {
                                targetSource.innerHTML = objectTaget.items(0).outerHTML.trim();
                                objectTaget.items(0).parentNode.removeChild(objectTaget.items(0));
                            }
                        }
                    });
                }
            }
        }

        if (targetArgs.target) {
            if (targetArgs.target instanceof Array) {
                for (var i = 0; i < targetArgs.target.length; i++) {
                    targetElement = document.getElementById(targetArgs.target[i]) || null;
                    if (targetElement) {
                        if (targetArgs.isAppend) {
                            targetElement.appendChild(temp);
                        } else {
                            targetElement.innerHTML = temp.innerHTML;
                        }
                    }

                }
            } else {
                targetElement = document.getElementById(targetArgs.target) || null;
                if (targetElement) {
                    if (targetArgs.isAppend) {
                        targetElement.appendChild(temp);
                    }
                    else {
                        targetElement.innerHTML = temp.innerHTML;
                    }
                }
            }
        }

        if (targetArgs.lightbox) {
            targetElement = dq(document.createElement('div'));
            targetElement.addClass('lightbox');
            targetElement.items(0).id = 'ajax-lightbox';
            targetElement.items(0).innerHTML = temp.innerHTML;
            var targetElementChild = targetElement.children();
            targetElementChild.each(function (el) {

                el.style.top = '20%';
                el.style.left = '50%';
                el.style.marginLeft = '-200px';
            });
            dq(document).addEvent('click', buttonClose, false);
            document.body.appendChild(targetElement.items(0));

            function buttonClose(e) {
                if (e.target.id == 'ajax-lightbox') {
                    dq(document).removeEvent('click', buttonClose);
                    document.body.removeChild(targetElement.items(0));
                }
            }

        }


        if (typeof targetArgs.loadJs !== 'undefined' && targetArgs.loadJs === "true") obj.loadJs();
        if (typeof targetArgs.loadCss !== 'undefined' && targetArgs.loadCss === "true") obj.loadCss();
        if (targetArgs.singleLoad) {
            element.items(0).removeAttribute("data-ajax-bind");
            element.items(0).removeAttribute("data-target");
        }
        return true;
    }

    return {
        load: function () {
            //do one time load only
            if (!isEventLoaded) {
                UI.Components.start();
                isEventLoaded = true;
                init();
            }
        },
        autoload: function () {
            autoload();
        },
        implement: function (element, e) {
            var ajaxBind = dq.Parser.ajaxParsing(element);
            if (!ajaxBind.trigger) ajaxBind.trigger = "click";
            if (e.type === "click") {
                var cancel = triggerEvent(element, "onRequest");
                if (!cancel) {
                    preExecute(element);
                } else {
                    waitingStack.push(element);
                }
            }
            else if (e.type === "change") {
                if (ajaxBind.trigger === "change") {
                    preExecute(element);
                }
            }
        },
        setVariables: function (variables) {
            _variables = variables;
        },
        setForm: function (form) {
            _form = form;
        },
        setModule: function (module) {
            _module = module;
        },
        setArgument: function (arg) {
            _arg = arg;
        },
        executeQueue: function (bind) {
            if (waitingStack.length > 0) {
                for (var i = 0; i < waitingStack.length; i++) {
                    if (arguments.length == 0) {
                        preExecute(waitingStack[i]);
                    } else {
                        preExecute(waitingStack[i], bind);
                    }

                }
            }
            waitingStack = new Array(); //clear stack
        },
        bindVariable: function (key, obj) {
            if (typeof obj === "object") {
                customVariableStack.addStack(key, obj);
            }
        },
        bindAction: function (key, eventFn) {
            customActionStack.addStack(key, eventFn);
        },
        getBindAction: function (key) {
            return customActionStack.getStack(key);
        },
        removeAction: function (key) {
            customEventStack.removeStack(key);
        }
    }
})();
/***********************************************************************
@name: UI.Controls.Tabs 

@description:
    Collection of Tab Control uses to create controller for the tab structure 

@method:
    load() : create a class function based on the given structure
    activateTab(groupName,key): activate selected group of tab
        groupName : specify group of tab to be activated
        key : specify the button tab to be activated
************************************************************************/
UI.Tabs = (function () {

    var isEventLoaded = false,
        initialize = false,
        customEventStack = null,
        that = this,
        panels,
        selectionClass = "selected",
        buttonAjaxCounter = 0;

    function init() {
        customEventStack = new dq.Stack();
        var buttonTabs = dq.Parser.objectIdentifier("tab");
        panels = UI.Panels.getInstance();
        clearButton();
        buttonTabs.each(function (el) {
            var dataBind = dq.Parser.uiParsing($(el));
            if (dataBind.selectionClass) selectionClass = dataBind.selectionClass;
            if (dataBind.selected) {
                activateTab($(el), dataBind);
            }
        })
        initizialize = true;
    }



    function handleEvent(target, e) {
        var dataBind = dq.Parser.uiParsing(target);
        if (dataBind.component && dataBind.component == "tab") {
            if (dataBind.selectionClass) selectionClass = dataBind.selectionClass;
            switch (e.type) {
                case "click":
                    //preventing select to click
                    if (target.items(0).tagName.toLowerCase() !== "select")
                        activateTab(target, dataBind);
                    break;
                case "change":
                    activateTab(target, dataBind);
                    break;
            }
        }
    }
    function triggerEvent(button, trigger, objArgs) {
        var args = {
            source: button.items(0),
            bind: dq.Parser.uiParsing(button),
            cancel: false
        }

        switch (trigger) {
            case "beforeActive":
                var beforeActive;
                if (args.bind) {
                    if (args.bind.beforeActive) {
                        beforeActive = customEventStack.getStack(args.bind.beforeActive);
                        if (!beforeActive) {
                            beforeActive = convertingCallback(args.bind.beforeActive) || false;
                        }
                        beforeActive(args);
                    }
                }
                break;
            case "onActive":
                if (args.bind) {
                    if (args.bind.onActive) {
                        var onActive = customEventStack.getStack(args.bind.onActive);
                        if (!onActive) {
                            onActive = convertingCallback(args.bind.onActive);
                        }
                        onActive(args);
                    }
                }
                break;
        }
        return args.cancel;
    }
    function activateTab(button, dataBind) {
        var beforeActive, onActive;
        var key, groupName;
        
        //escape if selected
        if (button.hasClass(selectionClass)) return false;
        //trigger the before active event
        var cancel = triggerEvent(button, "beforeActive");
        if (cancel) return true;
        //var dataBind = dq.Parser.uiParsing(button);
        groupName = dataBind.name || "";
        if (button.items(0).tagName.toLowerCase() === "select") {
            key = button.getInputText();
        } else {
            activateButtonTab(button, groupName);
            if (dataBind.key) {
                key = dataBind.key;
            } else {
                key = button.getAttr("id", 0);
            }

        }

        triggerEvent(button, "onActive");
        if (!dataBind.hasNoPanel) {
            panels.activatePanel(groupName, key, function (childKey) {
                var newButton = getButtonTab(childKey);
                if (newButton && !newButton.hasClass("selected")) activateTab(newButton);
            }, dataBind.isAnimation || false, dataBind.autoClear);
        }

        return true;
    }
    function activateButtonTab(button, groupName) {
        //diff handlers
        if (button.items(0).tagName.toLowerCase() === "select") {
        } else {
            //remove all selected
            clearButton(groupName);
            //dont add if it's input
            button.addClass(selectionClass);
        }
    }
    function getButtonTab(key) {
        var buttonTab = dq("#" + key);
        if (buttonTab.length > 0) {
            var dataBind = dq.Parser.uiParsing(buttonTab);
            if (dataBind && dataBind.component == 'tab') {
                return buttonTab;
            }
        }
        return false;
    }
    function clearButton(groupName) {
        var buttonGroup = dq.Parser.objectIdentifier("tab");
        if (buttonGroup) {
            buttonGroup.each(function (el) {
                var dataBind = dq.Parser.uiParsing(dq(el));
                if (arguments.length > 0) {
                    if (dataBind.name && dataBind.name == groupName) {
                        dq(el).removeClass(selectionClass);
                    }
                } else {
                    dq(el).removeClass(selectionClass);
                }
                //clear panel as well
                panels.clearPanel(dataBind.name);
            });
        }
    }

    return {
        load: function () {
            if (!isEventLoaded) {
                UI.Components.start();
                isEventLoaded = true;
                init();
            }
        },
        handleEvent: function (target, e) {
            handleEvent(target, e);
        },
        clear: function (groupName) {
            clearButton(groupName);
            UI.Panels.clearPanel(groupName);
        },
        activateTab: function (key) {
            var button = getButtonTab(key);
            activateTab(button);
        },
        getBindAction: function (key) {
            return customEventStack.getStack(key);
        },
        bindAction: function (key, fnEvent) {
            customEventStack.addStack(key, fnEvent);
        },
        removeAction: function (key) {
            customEventStack.removeStack(key);
        }
    }
})()

UI.Panels = (function () {

    var instance;

    function construct() {
        var panel,
        that = this;

        function getPanels(ref) {
            var panelTab = dq.Parser.customIdentifier("panel", ref);
            if (panelTab.length > 0)
                return panelTab;
            return false;
        }

        function clearPanel(groupName) {
            panel = getPanels(groupName);
            if (panel.length > 0) {
                //clear children
                panel.each(function (el) {
                    var panelChild = dq(el).children();
                    var isPanelActivate = false;
                    panelChild.each(function (childElement) {
                        dq(childElement).setStyle("display", "none");
                    });
                });
            }
        }

        function activatePanel(groupName, key, callback, isAnimation, isAutoClear) {
            panel = getPanels(groupName);
            if (panel.length > 0) {
                //clear children
                panel.each(function (el) {
                    var panelChild = dq(el).children();
                    var isPanelActivate = false;
                    panelChild.each(function (childElement) {
                        var panelChildBind = dq.Parser.uiParsing(dq(childElement));
                        if (panelChildBind) {
                            if (panelChildBind.key && panelChildBind.key == key) {
                                if (isAnimation) {
                                    var makeVisibleAnimation = new Animations.Accelerate(
                                       function (dqp) {
                                           return function (animation) {
                                               var dq = dqp;
                                               if (animation.hasStarted()) {
                                                   dq(childElement).setStyle("opacity", makeVisibleAnimation.currentValue);
                                               }

                                               if (animation.getTime() >= 1000) {
                                                   makeVisibleAnimation.destroy();
                                               }

                                           }
                                       } (dq), 1, 0, 0, 1, 0, 1000);
                                    makeVisibleAnimation.start();
                                    dq(childElement).setStyle("display", "block");
                                    dq(childElement).setStyle("opacity", 0);
                                    isPanelActivate = true;
                                }
                                else {
                                    dq(childElement).setStyle("display", "block");
                                }
                            }
                            else {
                                dq(childElement).setStyle("display", "none");
                                if (isAutoClear) {
                                    dq(childElement).items(0).innerHTML = "";
                                }

                            }
                        }
                    });

                    if (isPanelActivate) {
                        //checking if its a child tab
                        var panelContainer = dq(el).parent().bubble("data-ui-bind");
                        if (panelContainer) {
                            var panelDataBind = dq.Parser.uiParsing(panelContainer);
                            if (panelDataBind.panel && panelDataBind.panel == "child") {
                                if (callback) setTimeout(callback(panelDataBind.key), 10);
                            }
                        }
                    }
                });
            }
        }



        return {
            activatePanel: function (groupName, key, callback,isAnimation,isAutoClear) {
                activatePanel(groupName, key, callback,isAnimation,isAutoClear);
            },
            clearPanel: function (groupName) {
                //clearPanel(groupName);
            }
        }
    }

    return {
        getInstance: function () {
            if (!instance) instance = new construct();
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
**********************************************************************/
UI.Navs = (function () {
    
    var customEventStack = null,
        buttonAjaxCounter = 0,
        that = this;
    var isEventLoaded = false;

    var buttonSwitch = {
        switching: function (button, toggle) {
            var isToggle = false;
            var dataBind = dq.Parser.uiParsing(button);
            var singleSel = (dataBind.singleSelection) || false;
            
            if (singleSel) {
                //reset everything
                var buttonSwitch = getButtonGroup(dataBind.name || "");
                buttonSwitch.removeClass("switch");
            }

            if (typeof toggle === 'undefined') 
            {
                if (button.hasClass("switch")) {
                    toggle = false;
                } 
                else {
                    toggle = true;
                }
            }

            if (toggle) {
                if (!button.hasClass("switch")) {
                    button.addClass("switch");
                    isToggle = true;
                }
            } else {
                if (button.hasClass("switch")) {
                    button.removeClass("switch");
                    isToggle = true;
                }
            }

            return isToggle;
        },
        toggleSwitch: function (groupName, keys, toggle) {
            if (typeof keys === 'string') {
                keys = keys.split(',');
            }
            if (keys instanceof Array) {
                for (var i = 0; i < keys.length; i++) {
                    var obj = dq("#" + keys[i]);
                    if (obj) handleEvent(obj, { type: "click", toggle: toggle });
                }
            }
        }
    }

    var dropDown = {
        drop: function (target, hasOneClick) {
            var stopHide;
            var ddTarget = target;
            if (ddTarget) {
                var dropDown = dq('#' + ddTarget);
                if (dropDown.items(0).style.display == 'none') {
                    dropDown.setStyle("display", "block");
                    dq(document).addEvent("click", dropDownEvent);
                } else {
                    stopHide = true;
                }
            }

            function dropDownEvent(e) {
                var ref = ddTarget || null;
                var dd = dropDown;
                if (ref) {
                    var parent = dq(e.target).bubble("id", ref);
                    if (parent == null) {
                        if (!stopHide) {
                            dd.setStyle("display", "none");
                            dq(document).removeEvent("click", dropDownEvent);
                        }
                    }
                    else {
                        if (hasOneClick) {
                            dd.setStyle("display", "none");
                            dq(document).removeEvent("click", dropDownEvent);
                        }
                    }
                }
            }
        }
    }

    function reset(groupName, excludedKeys) {
        var excluded = function (excludedKeys, key) {
            if (excludedKeys) {
                for (var i = 0; i < excludedKeys.length; i++) {
                    var excludedKey = excludedKeys[i];
                    if (excludedKeys == key) {
                        return true;
                        break;
                    }
                }
            }
            return false;
        };

        if (typeof excludedKeys == 'string') {
            excludedKeys = excludedKeys.split(',');
        }

        var buttonGroup = getButton(groupName);
        buttonGroup.each(function (el) {
            if (!excluded(excludedKeys, el.id)) execute((dqel), false);
        })
    }

    function triggerEvent(button, trigger) {
        //trigger event
        var args = {
            source: button.items(0),
            cancel: false,
            state: button.hasClass("switch"),
            bind: dq.Parser.uiParsing(button)
        }

        switch (trigger) {
            case "onClick":
                if (args.bind.onClick) {
                    var clickEvent = customEventStack.getStack(args.bind.onClick);
                    clickEvent.call(this, args);
                }
                break;
        }
        return false;
    }

    function execute(button, e) {
        var isToggle = true;
        var dataBind = dq.Parser.uiParsing(button);
        var buttonStyle = dataBind.style || "normal";

        switch (buttonStyle) {
            case 'switch':
                isToggle = buttonSwitch.switching(button);
                break;
            case 'dropdown':
                dropDown.drop(dataBind.target, dataBind.hasOneClick || null);
                break;
            case 'link':
                if (dataBind.target) {
                    window.location.href = dataBind.target;
                }
            case 'close':
                if (dataBind.target) {
                    closeDialog(dataBind.target);
                }
                break;
            case 'popup':
                openPopUp(dataBind.target);
            default:
                break;
        }

        if (isToggle) {
            triggerEvent(button, "onClick");
            //call the id
        }
    }

    //style popup
    function openPopUp(popUpId) {
        var popUpEl = document.getElementById(popUpId) || false;
        if (popUpEl) {
            if (popUpEl.style.display == 'none') {
                popUpEl.style.display = 'block';
            } else {
                popUpEl.style.display = 'none';
            }
        }
    }

    function closeDialog(targetId) {
        var targetEl = document.getElementById(targetId) || false;
        if (targetEl) {
            targetEl.parentNode.removeChild(targetEl);
        }
    }


    function callOn(button, eventType) {
        var dataBind = dq.Parser.uiParsing(button);
        switch (eventType) {
            case "click":
                if (dataBind.callOnClick) {
                    if (dataBind.callOnClick instanceof Array) {
                        for (var i = 0, l = dataBind.callOnClick.length; i < l; i++) {
                            var target = document.getElementById(dataBind.callOnClick[i]) || false;
                            if (target) UI.Factory.implementAjaxBind(target, { type: eventType });
                        }
                    } else {
                        var target = document.getElementById(dataBind.callOnClick) || false;

                        if (target) UI.Factory.implementAjaxBind(target, { type: eventType });
                    }
                }
                break;
        }
    }

    function getButton(key) {
        var buttonGroup = dq.Parser.objectIdentifier("button");
        if (key) {
            return buttonGroup.filter("id", key);
        }
        return buttonGroup;
    }

    function getButtonGroup(name) {
        var buttonGroup = dq.Parser.objectIdentifier("button");
        var buttonStack = new Array();
        buttonGroup.each(function (el) {
            var button = dq(el);
            var dataBind = dq.Parser.uiParsing(button) || false;
            if (dataBind.name && dataBind.name == name) {
                buttonStack.push(el);
            }
        })
        if (buttonStack.length > 0) return dq(buttonStack);
        return false;
    }

    function handleEvent(target, e) {
        var dataBind = dq.Parser.uiParsing(target);
        if (dataBind) {
            if (dataBind.component && dataBind.component == "button") {
                switch (e.type) {
                    case "click":
                        execute(target, e);
                        callOn(target, e.type);
                        break;
                }
            }
        }
    }

    return {
        load: function () {
            if (!isEventLoaded) {
                customEventStack = new dq.Stack();
                dq.Document.addAction('click', handleEvent, 'button');
                isEventLoaded = true;
            }
        },
        buttonSwitch: function () {
            return buttonSwitch;
        },
        handleEvent: function (target, e) {
            handleEvent(target, e);
        },
        bindAction: function (key, eventFn) {
            customEventStack.addStack(key, eventFn);
        },
        removeAction: function (key) {
            customEventStack.removeStack(key);
        }
    }
})();

UI.FormField = (function () {
    var customEventStack = null;

    function handleEvent(target, e) {
        target = dq(target);
        var dataBind = dq.Parser.uiParsing(target);
        if (dataBind.component === "formfield") {
            executeEvent(target);
        }
    }
    function triggerEvent(target) {
        
        //trigger event
        var args = {
            source: target,
            element: button.items(0),
            cancel: false,
            bind: target.extractDataBind("data-ui-bind")
        }

        switch (trigger) {
            case "onClick":
                if (args.bind.onClick) {
                    var clickEvent = customEventStack.getStack(args.bind.onClick);
                    clickEvent.call(this, args);
                }
                break;
            case "onChange":
                if (args.bind.onChange) {
                    var onChange = customEventStack.getStack(args.bind.onChange);
                    if (onChange) onChange.call(this, args);
                }
                break;
        }
    }

    return {
        load: function () {
            dq.Document.addAction('click,blur,change', handleEvent, 'formfield');
        },
        bindAction: function (name, eventFn) {
            customEventStack.addStack(name, eventFn);
        },
        removeAction: function (name) {
            customEventStack.removeStack(name);
        }
    }
})();

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
UI.InputValidation = function (groupName) {

    var that = this;
    var validationStack = null;
    var emailPattern = /^([^\^\"\'\|\\])+?@([a-z]+?)\.([a-z]{2,4})dq/i;
    var currencyPattern;

    this.addRules = function (id, args) {
        var inputValidation = getInputValidation(id);
        if (inputValidation) {
            if (args.pattern) inputValidation.pattern = args.pattern;
            if (args.valType) inputValidation.valType = args.valType;
            if (args.minChar) inputValidation.minChar = args.minChar;
            return true;
        }
        return false;
    }

    this.validate = function (id, fn) {
        var inputVal, isValid = true;

        if (typeof id === "string") {
            inputVal = getInputValidation(id);
            doValidation(inputVal);
            if (fn) {
                fn.call(this, inputVal);
            }
            return inputVal.state;
        }
        
        validationStack.iterate(function (object) {
            doValidation(object);
            if (typeof id === "function") {
                id.call(this, object);
            }
            if (!object.state) {
                isValid = false;
            }
        })
        return isValid;
    }

    function init() {
        var commonName = dq("[data-group='" + groupName + "']").getCommonAttr("name");
        if (commonName.length > 0) {
            for (var i = 0; i < commonName.length; i++) {
                register(commonName[i], dq("[name='" + commonName[i] + "']"));
            }
        }
    }

    function register(name, sourceElements) {
        //create object
        var obj = {}
        if (typeof name !== "string") {
            obj = name;
        } else {
            obj.id = name;
            obj.source = sourceElements;
            obj.pattern = sourceElements.getAttr('data-pattern') || null;
            obj.valType = sourceElements.getAttr('data-validation') || null;
            obj.dataType = sourceElements.getAttr('data-type') || null;
            obj.minChar = sourceElements.getAttr('data-min') || null;
            obj.state = true;

            if (obj.pattern) {
                obj.pattern = new RegExp(obj.pattern);
            }
        }
        validationStack.addStack(name, obj);
    }

    function getInputValidation(id) {
        return validationStack.getStack(id);
    }

    function doValidation(inputVal) {
        var value = inputVal.source.getText();
        inputVal.errorTrace = '';
        switch (inputVal.valType) {
            case 'required':
                if (value.trim().length > 0) {
                    inputVal.state = true;
                } else {
                    inputVal.state = false;
                    inputVal.errorTrace = 'required';
                }
                break;
            case 'optional':
                if (value.trim().length > 0) {
                    if (inputVal.pattern) {
                        inputVal.state = inputVal.pattern.test(value);
                        if (!inputVal.state)
                            inputVal.errorTrace = 'pattern';
                    }
                } else {
                    inputVal.state = true;
                }
                break;
            case 'strict':
                if (value.trim().length > 0) {
                    var patternTest = true;
                    var minCharTest = true;

                    //check if comply with the pattern rules
                    if (inputVal.pattern) {
                        patternTest = inputVal.pattern.test(value);
                    }

                    //check if minimum char does not met
                    if (inputVal.minChar) {
                        if (value.length < parseInt(inputVal.minChar)) {
                            minCharTest = false;
                        }
                    } else {
                        minCharTest = true;
                    }

                    if (patternTest && minCharTest) {
                        inputVal.state = true;
                    } else {
                        inputVal.state = false;
                        if (!patternTest) inputVal.errorTrace = "pattern";
                        if (!minCharTest) inputVal.errorTrace = "minimum";
                    }

                } else {
                    inputVal.state = false;
                    inputVal.errorTrace = 'required';
                }
                break;
            default:
                break;
        }
    }

    init();
}

UI.Validations = (function () {
    var inputStack = null;
    function init() {
        var valGroup = dq("[data-validation]").getCommonAttr("data-group");
        for (var i = 0; i < valGroup.length; i++) {
            register(valGroup[i]);
        }
    }

    function register(groupName) {inputStack.addStack(groupName,new UI.InputValidation(groupName));}

    function getValidationGroup(id) {
        return inputStack.getStack(id);
    }

    function removeValidationGroup(id) {
        return inputStack.removeStack(id);
    }

    return {
        load: function () {
            init();
        },
        get: function (id) {
            return getValidationGroup(id);
        },
        remove: function (id) {
            return removeValidationGroup(id);
        },
        printStack: function () {
            inputStack.printStack();
        }
    }
})();



UI.AlertDialog = (function () {

    var resultCallback;
    var dialog = null;
    var blackCover = (function () {
        var blackDiv = document.createElement('div');
        blackDiv.style.width = '100%';
        blackDiv.style.height = '100%';
        blackDiv.style.position = 'fixed';
        blackDiv.style.top = '0px';
        blackDiv.style.left = '0px';
        blackDiv.style.zIndex = 1000;
        blackDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
        return blackDiv;
    })();

    var htmlDialog = (function () {
        var htmlContent = "<div class='container' style='text-align:center'><div class='row'><h3 id='title' style='color:whitesmoke'></h3></div>";
        htmlContent += "<div class='row panel panel-solid' style='width: 350px; margin: 0px 5px 5px 5px; position:relative'>";
        htmlContent += "<img id='alertCloseForm' src='imgs/_active__no.png' class='img-mini-logo' style='position:absolute; top:5px;right:5px; cursor:pointer'></span>";
        htmlContent += "<div class='row'>";
        htmlContent += "<table>";
        htmlContent += "<tr>";
        htmlContent += "<td><img id='imageTitle' src='imgs/close_form.png' class='img-menu-size'></span></td>";
        htmlContent += "<td style='min-height:100px;color:#000' ><p id='message'></p></td>";
        htmlContent += "</tr>";
        htmlContent += "</table>";
        htmlContent += "</div>";
        htmlContent += "<div id='buttonContainer' class='right-grid'><button id='alertConfirmYes' class='btn btn-blue' style='width:60px; margin-right:5px'>Yes</button><button id='alertConfirmNo' class='btn btn-blue' style='width:60px;'>No</button></div>";
        htmlContent += "</div></div>";
        var dialogContainer = document.createElement("div");
        dialogContainer.className = "frame popup";
        dialogContainer.style.cssText = "position: absolute; top:30%; left:40%; border-radius:10px";
        dialogContainer.innerHTML = htmlContent;

        return {
            addHtmlButton: function (htmlButton) {
                dq(dialogContainer).find("#buttonContainer")[0].inner(htmlButton);
                return this;
            },
            addImageSource: function (imageSrc) {
                var imageElement = dq(dialogContainer).find('#imageTitle')[0].items(0);
                imageElement.src = imageSrc;
                return this;
            },
            addTitle: function (title) {
                dq(dialogContainer).find("#title")[0].inner(title);
            },
            get: function (message) {
                dq(dialogContainer).find("#message")[0].inner(message);
                return dialogContainer;
            }
        }
    })();

    function createDialog(message) {
        var htmlContent = "<div class='container' style='text-align:center'><div class='row'><h3 id='title' style='color:whitesmoke'></h3></div>";
        htmlContent += "<div class='row panel panel-solid' style='width: 350px; margin: 0px 5px 5px 5px; position:relative'>";
        htmlContent += "<img id='alertCloseForm' src='imgs/_active__no.png' class='img-mini-logo' style='position:absolute; top:5px;right:5px; cursor:pointer'></span>";
        htmlContent += "<div class='row'>";
        htmlContent += "<table>";
        htmlContent += "<tr>";
        htmlContent += "<td><img id='imageTitle' src='imgs/close_form.png'></span></td>";
        htmlContent += "<td style='min-height:100px;color:#000' >" + message + "</td>";
        htmlContent += "</tr>";
        htmlContent += "</table>";
        htmlContent += "</div>";
        htmlContent += "<div id='buttonContainer' class='right-grid'><button id='alertConfirmYes' class='btn btn-blue' style='width:60px; margin-right:5px'>Yes</button><button id='alertConfirmNo' class='btn btn-blue' style='width:60px;'>No</button></div>";
        htmlContent += "</div></div>";
        var ad = document.createElement('div');
        ad.className = "frame popup";
        ad.style.cssText = "position: absolute; top:30%; left:40%; border-radius:10px";
        ad.innerHTML = htmlContent;
        return ad;
    }


    function showConfirmDialog(message) {
        var button = "<button id='alertConfirmYes' class='btn btn-blue' style='width:60px; margin-right:5px'>Yes</button><button id='alertConfirmNo' class='btn btn-blue' style='width:60px;'>No</button>"
        var imageSrc = 'imgs/lightbulb.png';
        htmlDialog.addHtmlButton(button);
        htmlDialog.addImageSource(imageSrc);
        htmlDialog.addTitle("Confirm");
        dialog = htmlDialog.get(message);
        dialog.addEventListener("click", handleClick, false);
        dq.Document.addOwnEvent('click', handleClick);
        blackCover.appendChild(dialog);
        document.getElementsByTagName("body")[0].appendChild(blackCover);
    }

    function showAlertDialog(message) {
        var button = "<button id='alertConfirmYes' class='btn btn-blue' style='width:60px; margin-right:5px'>Ok</button>"
        var imageSrc = 'imgs/lightbulb.png';
        htmlDialog.addHtmlButton(button);
        htmlDialog.addImageSource(imageSrc);
        htmlDialog.addTitle("Alert");
        dialog = htmlDialog.get(message);
        dialog.addEventListener("click", handleClick, false);
        dq.Document.addOwnEvent('click', handleClick);
        blackCover.appendChild(dialog);
        document.getElementsByTagName("body")[0].appendChild(blackCover);
    }

    function closeConfirmDialog() {
        dialog.removeEventListener("click", handleClick);
        dq.Document.removeOwnEvent('click', handleClick);
        document.getElementsByTagName("body")[0].removeChild(blackCover);
        dialog = null; //freeing the memory
    }

    function handleClick(e) {
        var result = false;
        var target = e.target;
        var currentTarget = e.currentTarget;
        e.stopPropagation();
        if (currentTarget.nodeType !== 9) {
            if (target.id === 'alertCloseForm') {
                closeConfirmDialog();
            } else if (target.id === 'alertConfirmNo') {
                closeConfirmDialog();
            } else if (target.id === 'alertConfirmYes') {
                closeConfirmDialog();
                result = true;
            }
        } else {
            closeConfirmDialog();
        }
        if (resultCallback) resultCallback(result);
    }

    return {
        setCustomFunction: function (fn) {
            resultCallback = fn;
        },
        confirm: function (message) {
            showConfirmDialog(message);
        },
        alert: function (message) {

        }
    }

})();

UI.PopUp = (function() {
    var blackCover = (function () {
        var blackDiv = document.createElement('div');
        blackDiv.style.width = '100%';
        blackDiv.style.height = '100%';
        blackDiv.style.position = 'fixed';
        blackDiv.style.top = '0px';
        blackDiv.style.left = '0px';
        blackDiv.style.zIndex = 1000;
        blackDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
        return blackDiv;
    })();
})

