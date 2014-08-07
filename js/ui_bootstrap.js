
(function() {
    var ButtonLink = {
        link : function(){

        }
    }
    var ButtonSwitch = {
            switching: function (button, toggle) {
                
                var isToggle = false;
                var dataBind = dq.Parser.uiParsing(button);
                var singleSel = (dataBind.singleSelection) || false;
                var switchClass = dataBind.switchClass || "selected";

                if (typeof toggle === 'undefined') {
                    if (button.hasClass(switchClass)) {
                        toggle = false;
                    }
                    else {
                        toggle = true;
                    }
                }

             
                if (toggle) {
                    //reset everything
                    var btns = dq(document).find("[data-ui-bind*=\"name:'" + dataBind.name + "'\"]")[0];
                    btns.removeClass(switchClass);
                    button.addClass(switchClass);
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
	
    var DropDown = {
        dynamicDrop: function(button,target) {
            var ddTarget = dq("#" + target) || false;

            var stopHide = false;
            if(ddTarget) {
                var buttonParent = button.parent();
                buttonParent.append(ddTarget,"child");
                if (ddTarget.hasClass("collapse")) {
                    ddTarget.removeClass("collapse");
                    ddTarget.addClass("expand");
                    dq(document).addEvent("click", dropDownEvent);
                }else {
                    dq(document).removeEvent("click", dropDownEvent);
                }
              
                function dropDownEvent(e) {
                    var docTarget = e.target;
                    var parentRoot = dq(e.target).bubble("data-popup","true") || false;
                    if(!parentRoot) {
                        ddTarget.removeClass("expand");
                        ddTarget.addClass("collapse");
                        dq(document).removeEvent("click", dropDownEvent);
                    }
                    
                }
            }
        },
        drop: function (target, hasOneClick) {
            var stopHide;
            var ddTarget = target;
            if (ddTarget) {
                var dropDown = dq('#' + ddTarget);
                if (!dropDown.hasClass("colapse")) {
                    dropDown.removeClass("colapse");
                    dropdown.addClass("expand");
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


	UI.AjaxBindLoader.load(
		new Array('click', 'change', 'blur', 'dblclick', 'mousedown', 'mouseover', 'mouseup')
	);

	/*-------------------------------------
		@Todo:
            clear the page
            confirmation alert
	--------------------------------------*/
	UI.AjaxBindLoader.hook("onUpdating",function(dqElement,args,e) {

        //confirmation
        if (dqElement.hasAttr('data-confirmation')) {
            var dataCnfObject = dq.Parser.customParsing(dqElement, 'data-confirmation');
            var message = dataCnfObject.message || "Uknown message";
            UI.AlertDialog.confirm(message);
            UI.AlertDialog.setCustomFunction(function (result) {
                if (result == true)
                    UI.AjaxBindLoader.preProcessing(dqElement,e);
            });
        }
        else {
            UI.AjaxBindLoader.preProcessing(dqElement,e);
        }
	});

	
    UI.AjaxBindLoader.hook("onFetching",function(temp,args) {

       //check if something to url redirection
        var url = $(temp).find("url");
        if (url[0].length > 0) {
            var dataUIBind = url[0].items(0).getAttribute("data-ui-bind");
            if (dataUIBind != null) {
                UI.Components.update(url[0].items(0), { type: 'click' });
            }
        }

        //inserting into multiple target
        if (args.multipleTarget) {
            //looking for data-target
            var targetForDest = dq(temp).find('[data-target]')[0];
            //target for destination found
            if (targetForDest.length > 0) {
                //iterating until no one left
                targetForDest.each(function (el) {
                    var objectTaget = dq(el);
                    //break it down
                    var targetForDestBinding = dq.Parser.customParsing(objectTaget, 'data-target');
                    if (targetForDestBinding.destination) {
                        var targetSource = document.getElementById(targetForDestBinding.destination) || false;
                        //make sure that is exact destination
                        if (targetSource) {
                            targetSource.innerHTML = objectTaget.items(0).outerHTML.trim();
                        }
                    }
                });
            }
        }

        return false;
    });

	//
	UI.AjaxBindLoader.hook("onInsertingContentToTarget",function(strElementId,content,args) {
		
        var targetElement = document.getElementById(strElementId) || false;
        if(!targetElement) return false;

        if (args.isAppend) {
            targetElement.appendChild(content);
        }
        else {
            
            //inserting into target check if 
            //clear the target before it lands
            UI.Page.clearPage(targetElement);
            
            if (targetElement.getAttribute('loop') && targetElement.getAttribute('loop') == 'outer') {
                var parentOfTargetEl = targetElement.parentNode;
                var newTargetEl = dq(content).first()[0].items(0);
                newTargetEl.innerHTML = content.innerHTML;
                parentOfTargetEl.replaceChild(newTargetEl, targetElement);
            } 
            else {
                targetElement.innerHTML = content.innerHTML;
            }
            targetElement.style.display = null;
        }
        return targetElement;
	})


	

    UI.AjaxBindLoader.hook("afterFetching",function(source,args){
        
        //Auto Focus
        if (source.hasAttr('data-autofocus')) {
            if(args.target instanceof Array) {
                target = args.target[0];
            }
            else {
                target = args.target;
            }
            var input = dq(document.getElementById(target)).find("[autofocus]")[0];
            input.items(0).focus();
        }

        //calling action
        if (source.hasAttr("data-call-action")) {
            var dataBind = dq.Parser.customParsing(source, "data-call-action");
            var callAction = dataBind.callAction || false;
            if (callAction) {
                if (callAction instanceof Array) {
                    for (var i = 0; i < callAction.length; i++) {
                        var elToCall = dq("[buttonId='" + callAction[i] + "']");
                        elToCall.each(function (el) {
                            UI.AjaxBindLoader.setImmediate("false");
                            UI.AjaxBindLoader.update(el, { type: 'click' });
                        })
                    }
                }
            }
        }
    });


    UI.Navs.load();

    UI.Navs.hook("onClick",function(button,e) {

        var isToggle = true;
        var dataBind = dq.Parser.uiParsing(button);
        var buttonStyle = dataBind.style || "normal";
        
      
        switch (buttonStyle) {
            case 'switch':
                isToggle = ButtonSwitch.switching(button);
                break;
            case 'dropdown':
                DropDown.drop(dataBind.target, dataBind.hasOneClick || null);
                break;
            case 'dynamic-drop':
                DropDown.dynamicDrop(button,dataBind.target);
                break;
            case 'link':
                if (dataBind.target) {
                    window.location.href = dataBind.target;
                }
            case 'close':
                var target = dataBind.target || "";
                var targetEl = document.getElementById(target) || false;
                if (targetEl) {
                    targetEl.parentNode.removeChild(targetEl);
                }
                break;
            case 'popup':
                var target = dataBind.target || "";
                var popUpEl = document.getElementById(target) || false;
                if (popUpEl) {
                    if (popUpEl.style.display == 'none') {
                        popUpEl.style.display = 'block';
                    } 
                    else {
                        popUpEl.style.display = 'none';
                    }
                }
            default:
                break;
        }
        return isToggle;
    });

})();

