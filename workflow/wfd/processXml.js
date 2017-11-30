/**
 * 流程模型与xml的转换
 * 
 */
function WorkFlowModelConverter() {
}

//直接返回XML字符串
WorkFlowModelConverter.convertModelToXML = function (model) {
    var doc = XMLDocument.newDomcument();

	//root
    var workflowProcessNode = doc.createElement("WorkflowProcess");
    doc.documentElement = workflowProcessNode;
    
    workflowProcessNode.setAttribute("name", model.getName());
    workflowProcessNode.setAttribute("createTime", model.getCreateTime());
    workflowProcessNode.setAttribute("description", model.getDescription());
    workflowProcessNode.setAttribute("type", model.getType());
    workflowProcessNode.setAttribute("mainHandler", model.getMainHandler().id ? model.getMainHandler().id : "");
    workflowProcessNode.setAttribute("docType", model.getDocType());
    workflowProcessNode.setAttribute("docClassify", model.getDocClassify());
    workflowProcessNode.setAttribute("form", this.formId);
    this.formId = model.getDocType()==Workflow.DOC_TYPE_FORM?model.getForm():'';//表单id，用于后面设置默认权限的
    this.fieldlist = [];
    workflowProcessNode.setAttribute("form", this.formId);
    workflowProcessNode.setAttribute("template", model.getTemplate());
    workflowProcessNode.setAttribute("order", model.getOrder());
    workflowProcessNode.setAttribute("orgId", model.getOrgId());
    workflowProcessNode.setAttribute("author", model.getAuthor());
    if (!window.ActiveXObject) {
   		doc.appendChild(workflowProcessNode);
	}	

    //
    var activitiesNode = doc.createElement("ActivitieSet");
    workflowProcessNode.appendChild(activitiesNode);

    //metaNodes
    var NodeModels = model.ActivitieSet;
    for (var i = 0; i < NodeModels.length; i++) {
        var NodeModel = NodeModels[i];
        var activitieNode = WorkFlowModelConverter.convertMetaNodeModelToXML(NodeModel, doc, model);
        
        switch(NodeModel.getType()){
    			case StateMonitor.SELECT : return;break;
				case StateMonitor.START_NODE : 
					if(activitiesNode.childNodes && activitiesNode.childNodes.length>0){
						activitiesNode.insertBefore(activitieNode,activitiesNode.childNodes[0]);
					}else{
						activitiesNode.appendChild(activitieNode);
					}
					break;
				case StateMonitor.END_NODE : 
					var activities = activitiesNode.getElementsByTagName("Activity")
					if(activities && activities.length>0){
						activitiesNode.insertBefore(activitieNode,activities[0]);
					}else{
						activitiesNode.appendChild(activitieNode);
					}
					break;
				default : 
					 activitiesNode.appendChild(activitieNode);
    	}
    }
    
    //
    var transitionsNode = doc.createElement("TransitionSet");
    workflowProcessNode.appendChild(transitionsNode);

    //
    var transitionModels = model.getAllTransitions();
    for (var i = 0; i < transitionModels.length; i++) {
        var transitionModel = transitionModels[i];
        var transitionNode = WorkFlowModelConverter.convertTransitionModelToXML(transitionModel, doc);
        transitionsNode.appendChild(transitionNode);
    }
    
    var notesNode = doc.createElement("NoteSet");
    workflowProcessNode.appendChild(notesNode);
    var noteModels = model.NoteSet;
    for (var i = 0; i < noteModels.length; i++) {
        var noteModel = noteModels[i];
        var note = WorkFlowModelConverter.convertNoteModelToXML(noteModel, doc);
        notesNode.appendChild(note);
    }

    //
    return WorkFlowModelConverter.parserXMLToString(doc);
};

//将节点转换XML
WorkFlowModelConverter.convertMetaNodeModelToXML = function (metaNodeModel, doc, model) {
    var activitieNode = null;
    switch(metaNodeModel.getType()){
    	case StateMonitor.SELECT : return;break;
				case StateMonitor.START_NODE : 
					activitieNode = doc.createElement("StartActivity");
					break;
				case StateMonitor.END_NODE : 
					activitieNode = doc.createElement("EndActivity");
					break;
				default : 
					activitieNode = doc.createElement("Activity");
    }
    
    if(metaNodeModel.getActivityCode){
    	activitieNode.setAttribute("activityCode", metaNodeModel.getActivityCode());
    }
    if(metaNodeModel.getActivityName){
    	activitieNode.setAttribute("activityName", metaNodeModel.getActivityName());
    }
    if(metaNodeModel.getStartType){
    	activitieNode.setAttribute("startType", metaNodeModel.getStartType());
    }
    if(metaNodeModel.getSplitType){
    	activitieNode.setAttribute("splitType", metaNodeModel.getSplitType());
    }
    if(metaNodeModel.getState){
    	activitieNode.setAttribute("state", metaNodeModel.getState());
    }
    if(metaNodeModel.getRunState){
    	activitieNode.setAttribute("runState", metaNodeModel.getRunState());
    }
    if(metaNodeModel.getCanBack){
    	activitieNode.setAttribute("canBack", metaNodeModel.getCanBack());
    }
    if(metaNodeModel.getCanRecycle){
    	activitieNode.setAttribute("canRecycle", metaNodeModel.getCanRecycle());
    }
    if(metaNodeModel.getLimit){
    	var limit = metaNodeModel.getLimit();
    	var limitValue =limit.day*24 + limit.hour;
    	activitieNode.setAttribute("limit", limitValue);
    }
//    if(metaNodeModel.getDistributeType){
//    	activitieNode.setAttribute("distributeType", metaNodeModel.getDistributeType());
//    }
	if (metaNodeModel.getX) {
		activitieNode.setAttribute('x', metaNodeModel.getX());
	}
	if (metaNodeModel.getY) {
		activitieNode.setAttribute('y', metaNodeModel.getY());
	}

//  过滤规则 只有普通节点有
//	var FilterRule = doc.createElement("FilterRule");
//	FilterRule.setAttribute('filterCondition', "");
//	activitieNode.appendChild(FilterRule);
	
	if(metaNodeModel.getTimeBegin){
		var timeBegin = doc.createElement("Timer");
		var data = metaNodeModel.getTimeBegin();
		timeBegin.setAttribute('startType', data.startType);
		if(data.startType == Workflow.TIMER_START_PERIODTIME){
			var periodTime = doc.createElement("PeriodTime");
			periodTime.setAttribute('timeType', data.timeType);
			periodTime.setAttribute('day', data.day);
			periodTime.setAttribute('hour', data.hour);
			periodTime.setAttribute('min', data.min);
			timeBegin.appendChild(periodTime);
		}else if(data.startType == Workflow.TIMER_START_SCHEDULEE){
			var schedule = doc.createElement("Schedule");
			schedule.setAttribute('dateTime', metaNodeModel.getTimeDate());
			timeBegin.appendChild(schedule);
		}
		activitieNode.appendChild(timeBegin);
	}
	
	if (metaNodeModel.getActionSet) {
		var ActionSet = doc.createElement("ActionSet");
		for (var i = 0; i < metaNodeModel.getActionSet().length; i++) {
			var action = metaNodeModel.getActionSet()[i];
			Workflow.ACTIONSET.each(function(ac){
				if(action == ac.id){
					if(action==Workflow.MSG_ACTION){
						var selectMethod = metaNodeModel.getMsgmethod();
						for(var i=0; i<selectMethod.length; i++){
							var acNode = doc.createElement('Action')
							acNode.setAttribute('type', ac.id);
							acNode.setAttribute('name', ac.name);
							acNode.setAttribute('value', selectMethod[i]);
							ActionSet.appendChild(acNode);
						}
					}else{
						var acNode = doc.createElement('Action')
						acNode.setAttribute('type', ac.id);
						acNode.setAttribute('name', ac.name);
						ActionSet.appendChild(acNode);
					}
				}else{
					return false;
				}
			});
		}
		activitieNode.appendChild(ActionSet);
	}
	
	if(metaNodeModel.getTreadSet){
		var TreadSetNode = doc.createElement("TreadSet");
		var treadSet = metaNodeModel.getTreadSet();
		treadSet.each(function(thread){
			var TreadNode = doc.createElement("Tread");
			TreadNode.setAttribute("activityCode", thread.code);
			TreadNode.setAttribute("activityName", thread.name);
			TreadSetNode.appendChild(TreadNode);
		});
		activitieNode.appendChild(TreadSetNode);
	}
	
	/**
	 * 前置后置条件
	 */
	if(metaNodeModel.getForward){
		
		var forwardConditionSet = doc.createElement("ForwardConditionSet");
		var forward = metaNodeModel.getForward();
		if(forward){
			var forwardCondition = doc.createElement("ForwardCondition");
			forwardCondition.setAttribute("type", "");
			forwardCondition.setAttribute("value", WorkFlowModelConverter.getForwardConvertCondition(metaNodeModel));
			forwardConditionSet.appendChild(forwardCondition);
		}
		activitieNode.appendChild(forwardConditionSet);
	}
	if(metaNodeModel.getBehide){
		var behindConditionSet = doc.createElement("BehindConditionSet");
		var behide = metaNodeModel.getBehide();
		if(behide){
			var behindCondition = doc.createElement("BehindCondition");
			behindCondition.setAttribute("type", "");
			behindCondition.setAttribute("value", WorkFlowModelConverter.getBehideConvertCondition(metaNodeModel));
			behindConditionSet.appendChild(behindCondition);
		}
		activitieNode.appendChild(behindConditionSet);
	}	
	
	if (metaNodeModel.getFormCtrl) {//方法存在时说明有这个权限
		var formCtrl = doc.createElement("FormCtrl");
		if(metaNodeModel.getFormCtrl().length > 0){
			for (var i = 0; i < metaNodeModel.getFormCtrl().length; i++) {
				var field = metaNodeModel.getFormCtrl()[i];
				if (field && field.id && field.value) {
					var fNode = doc.createElement('Field')
					fNode.setAttribute('id', field.id);
					fNode.setAttribute('right', field.value);
					formCtrl.appendChild(fNode);
				}
			}
		}else{
			if(!this.fieldlist || this.fieldlist.length==0){
				var fieldlist = [];
				try {
					var fieldlist = [];
					dwr.engine.setAsync(false);
					formInfoAjax.getFormElementList(this.formId, function(fields) {
						if(fields){
							for (var i = 0; i < fields.length; i++) {
								fieldlist[fieldlist.length] = fields[i];
							}
						}
					});
					dwr.engine.setAsync(true);
				} catch (e) {
					alert('初始化表单权限失败')
				}
				this.fieldlist = fieldlist;
			}
			if(this.fieldlist && this.fieldlist.length>0){
				for (var i = 0; i < this.fieldlist.length; i++) {
					var field = this.fieldlist[i];
					var fNode = doc.createElement('Field')
					fNode.setAttribute('id', field);
					fNode.setAttribute('right', Workflow.DEFAULT_FORM_CTRL);
					formCtrl.appendChild(fNode);
				}
			}
		}
		activitieNode.appendChild(formCtrl);
	}
//	if (metaNodeModel.runner.type) {
//		runner.setAttribute("type", metaNodeModel.runner.type);
//	} else {
//		runner.setAttribute("type", Workflow.DEFAULT_RUNNER_TYPE);
//	}
	if(metaNodeModel.getRunner){
		var participant = doc.createElement("Participant");
		
		var userList = metaNodeModel.getRunner().userList;
		var userNames = metaNodeModel.getRunner().userNames;
		var deptList = metaNodeModel.getRunner().deptList;
		var deptNames = metaNodeModel.getRunner().deptNames;
		var postList = metaNodeModel.getRunner().postList;
		var postNames = metaNodeModel.getRunner().postNames;
		var groupList = metaNodeModel.getRunner().groupList;
		var groupNames = metaNodeModel.getRunner().groupNames;
		var flowvarList = metaNodeModel.getRunner().flowvarList;
		var flowvarNames = metaNodeModel.getRunner().flowvarNames;
		
		
		if (flowvarList && flowvarNames && flowvarList.length > 0 && flowvarNames.length > 0) {
			flowvarList = flowvarList.split(',');
			flowvarNames = flowvarNames.split(',');
			for (var i = 0; i < flowvarList.length; i++) {
				if (flowvarList[i] && flowvarList[i].length > 0) {
					var flowvar;
					flowvar = doc.createElement("Var");
					flowvar.setAttribute("name", flowvarNames[i]);
					flowvar.setAttribute("value", flowvarList[i]);
					participant.appendChild(flowvar);
				}
			}
		}
		
		if (postList && postNames && postList.length > 0 && postNames.length > 0) {
			postList = postList.split(',');
			postNames = postNames.split(',');
			for (var i = 0; i < postList.length; i++) {
				if (postList[i] && postList[i].length > 0) {
					var post;
					post = doc.createElement("OrgUnit");
					post.setAttribute("id", postList[i]);
					post.setAttribute("name", postNames[i]);
					post.setAttribute("type", Workflow.ORGUNIT_TYPE.POST);
					participant.appendChild(post);
				}
			}
		}
		
		if (deptList && deptNames && deptList.length > 0 && deptNames.length > 0) {
			deptList = deptList.split(',');
			deptNames = deptNames.split(',');
			for (var i = 0; i < deptList.length; i++) {
				if (deptList[i] && deptList[i].length > 0) {
					var dept;
					dept = doc.createElement("OrgUnit");
					dept.setAttribute("id", deptList[i]);
					dept.setAttribute("name", deptNames[i]);
					dept.setAttribute("type", Workflow.ORGUNIT_TYPE.DEPT);
					participant.appendChild(dept);
				}
			}
		}
		
		if (groupList && groupNames && groupList.length > 0 && groupNames.length > 0) {
			groupList = groupList.split(',');
			groupNames = groupNames.split(',');
			for (var i = 0; i < groupList.length; i++) {
				if (groupList[i] && groupList[i].length) {
					var group;
					group = doc.createElement("OrgUnit");
					group.setAttribute("id", groupList[i]);
					group.setAttribute("name", groupNames[i]);
					group.setAttribute("type", Workflow.ORGUNIT_TYPE.GROUP);
					participant.appendChild(group);
				}
			}
		}
		
		if (userList && userNames && userList.length > 0 && userNames.length > 0) {
			userList = userList.split(',');
			userNames = userNames.split(',');
			for (var i = 0; i < userList.length; i++) {
				if (userList[i] && userList[i].length > 0) {
					var user;
					user = doc.createElement("User");
					user.setAttribute("id", userList[i]);
					user.setAttribute("name", userNames[i]);
					user.setAttribute("order", parseInt(i)+1);
					participant.appendChild(user);
				}
			}
		}
		
		//优先级
		var prioritySet = doc.createElement("PrioritySet");
		participant.appendChild(prioritySet);
		if (metaNodeModel.getDealFirst) {
			var prioritys = metaNodeModel.getDealFirst();
			for(var i = 0; i < prioritys.length; i++){
				var priority;
				priority = doc.createElement("Priority");
				priority.setAttribute("actorId", prioritys[i].id);
				priority.setAttribute("actorName", prioritys[i].name);
				prioritySet.appendChild(priority);
			}
			activitieNode.setAttribute('y', metaNodeModel.getY());
		}
		
		if(metaNodeModel.getRealRunners){
			var realRunner = doc.createElement("RealRunners");
			participant.appendChild(realRunner);
			
			var runner = metaNodeModel.getRealRunners();
			
			/*************汪德刚修改  begin******************/
			for(var key in runner){
				if(runner[key] && runner.hasOwnProperty(key)){
					user = runner[key];
					var users = doc.createElement("Users");
					users.setAttribute("userId", user.userId);
					users.setAttribute("userName", user.userName);
					users.setAttribute("dealState", user.dealState);
					users.setAttribute("assignTime", user.assignTime);
					users.setAttribute("expectTime", user.expectTime||"");
					users.setAttribute("dealTime", user.dealTime);
					users.setAttribute("Priority", user.Priority==null?"":user.Priority);
					realRunner.appendChild(users);
				}
			}
			/**
			runner.each(function(user){
				var users = doc.createElement("Users");
				users.setAttribute("userId", user.userId);
				users.setAttribute("userName", user.userName);
				users.setAttribute("dealState", user.dealState);
				users.setAttribute("assignTime", user.assignTime);
				users.setAttribute("expectTime", user.expectTime);
				users.setAttribute("dealTime", user.dealTime);
				users.setAttribute("Priority", user.Priority==null?"":user.Priority);
				realRunner.appendChild(users);
			}); 
			*/
			/*************汪德刚修改  end********************/
		}
		
		activitieNode.appendChild(participant);
	}
	
	//过期处理类型
	if(metaNodeModel.getOverdue){
		var overDue = doc.createElement("Overdue");
		overDue.setAttribute("value", metaNodeModel.getOverdue());
		activitieNode.appendChild(overDue);
	}
    
    //表达式
    if(metaNodeModel.outTransitions){
        var outTrans = metaNodeModel.outTransitions,
            outTransLen = outTrans.length,
            outExps = metaNodeModel.getExpressions();
        if(outTransLen > 1){
            var expCtrl = doc.createElement("ExpressionCtrl"),
                expFlag = false,
                outTran = null,
                outExp = null,
                outActCode = "";
            for(var i=0; i<outTransLen; i++){
                outTran =  outTrans[i];
                outActCode = outTran.getTo().getActivityCode();
                outExp = metaNodeModel.getExpressionByToCode(outActCode);
                if(outExp){
                    var lftValue = outExp.lftValue,
                        lftOp = outExp.lftOp,
                        formKey = outExp.formKey,
                        rghtOp = outExp.rghtOp,
                        rghtValue = outExp.rghtValue,
                        formula = [],
                        expItem = null;
                    if(formKey && formKey != "X" && (lftValue || rghtValue)){
                        expItem = doc.createElement("Expression")
                        expItem.setAttribute("to", outActCode);
                        expItem.setAttribute("formkey", formKey);
                        if(!!lftValue || lftValue === 0){
                            formula.push(lftValue);
                        }else{
                            formula.push("X");
                        }
                        if(lftOp){
                            formula.push(lftOp);
                        }else{
                            formula.push("X");
                        }
                        formula.push(formKey);
                        if(rghtOp){
                            formula.push(rghtOp);
                        }else{
                            formula.push("X");
                        }
                        if(!!rghtValue || rghtValue === 0){
                            formula.push(rghtValue);
                        }else{
                            formula.push("X");
                        }
                        expItem.setAttribute("formula", formula.join("##"));
                        expCtrl.appendChild(expItem);
                        expFlag = true;
                    }
                }
            }
            if(expFlag){
                activitieNode.appendChild(expCtrl);
            }
        }
    }
    
    return activitieNode;
};

WorkFlowModelConverter.convertTransitionModelToXML = function (transitionModel, doc) {
    var transitionNode = doc.createElement("Transition");

    transitionNode.setAttribute("id", transitionModel.getId());
    transitionNode.setAttribute("name", transitionModel.getName());
    transitionNode.setAttribute("from", transitionModel.getFrom().getActivityCode());
    transitionNode.setAttribute("to", transitionModel.getTo().getActivityCode());

    return transitionNode;
};

WorkFlowModelConverter.convertNoteModelToXML = function (noteModel, doc) {
    var note = doc.createElement("Note");

    
    note.setAttribute("italic", noteModel.getItalic());
    note.setAttribute("font", noteModel.getFont());
    note.setAttribute("size", noteModel.getSize());
    note.setAttribute("bold", noteModel.getBold());
    note.setAttribute("border", noteModel.getBorder());
    note.setAttribute("borderColor", noteModel.getBorderColor());
    note.setAttribute("color", noteModel.getColor());
    note.setAttribute("width", noteModel.getWidth());
    note.setAttribute("height", noteModel.getHeight());
    note.setAttribute("y", noteModel.getY());
    note.setAttribute("x", noteModel.getX());
    note.setAttribute("text", noteModel.getText());

    return note;
};

//xml to model
WorkFlowModelConverter.convertXMLToModel = function (doc, initModel) {
	
    if (!doc) {
        return null;
    }
    var model = initModel;
    
    model.setName(doc.documentElement.getAttribute("name"));
    model.setType(doc.documentElement.getAttribute("type"));
    model.setDocType(doc.documentElement.getAttribute("docType"));
    model.setDocClassify(doc.documentElement.getAttribute("docClassify"));
    model.setForm(doc.documentElement.getAttribute("form"));
    model.setTemplate(doc.documentElement.getAttribute("template"));
    
    var mainHandler = doc.documentElement.getAttribute("mainHandler");
	Ext.Ajax.request({
		sync: true,
		url : Workflow.HANDLER_URL,
		params : {id : mainHandler},
		method : 'GET',
		success : function(response, options) {
			mainHandler = {
				id : mainHandler,
				name : response.responseText
			}
		}
	});
 
    model.setMainHandler(mainHandler);
    model.setCreateTime(doc.documentElement.getAttribute("createTime"));
    model.setDescription(doc.documentElement.getAttribute("description"));
    
    model.setOrder(doc.documentElement.getAttribute("order"));
    model.setOrgId(doc.documentElement.getAttribute("orgId"));
    model.setAuthor(doc.documentElement.getAttribute("author"));
    
    var activitieSet = doc.getElementsByTagName("ActivitieSet")[0];
    var activitieNodes = activitieSet.childNodes;
    for (var i = 0; i < activitieNodes.length; i++) {
        var activitieNode = activitieNodes[i];
        var nodeModel = WorkFlowModelConverter.convertXMLToMetaNodeModel(activitieNode, model);
        nodeModel.setWrapper(model.getWrapper());
        model.addActivity(nodeModel);
    }

    var transitionSet = doc.getElementsByTagName("TransitionSet")[0];
    var transitionNodes = transitionSet.childNodes;
    for (var i = 0; i < transitionNodes.length; i++) {
        var transitionNode = transitionNodes[i];
        var transitionModel = WorkFlowModelConverter.convertXMLToTransitionModel(transitionNode, model);
        if(model.addTransition) model.addTransition(transitionModel);
    }
//    
    var noteSet = doc.getElementsByTagName("NoteSet")[0];
    var notes = noteSet.childNodes;
    for (var i = 0; i < notes.length; i++) {
        var note = notes[i];
        var noteModel = WorkFlowModelConverter.convertXMLToNoteModel(note, model);
        noteModel.setWrapper(model.getWrapper());
        model.addNote(noteModel);
    }

    return model;
};
WorkFlowModelConverter.convertXMLToMetaNodeModel = function (node, metaNodeModel) {
    var NodeModel = null;

    var type = node.tagName;
    switch (type) {
      case "StartActivity":
        NodeModel = new StartActivity();
        break;
      case "EndActivity":
        NodeModel = new EndActivity();
        break;
      case "Activity":
        NodeModel = new NormalActivity();
        break;
    }
    if (!NodeModel) {
        return null;
    }

    var id = eval(node.getAttribute("activityCode"));
    if(NodeModel.setActivityCode) NodeModel.setActivityCode(id);
    
    var name = node.getAttribute("activityName");
    if(NodeModel.setActivityName) NodeModel.setActivityName(name);

    var xCoordinate = eval(node.getAttribute("x"));
    var yCoordinate = eval(node.getAttribute("y"));
    if(NodeModel.setP) NodeModel.setP([xCoordinate,yCoordinate]);

    
    var startType = node.getAttribute("startType");
	if (startType && NodeModel.setStartType) NodeModel.setStartType(startType);
	
	var splitType = node.getAttribute("splitType");
	if (splitType && NodeModel.setSplitType) NodeModel.setSplitType(splitType);
	
	var state = node.getAttribute("state");
	if(NodeModel.setState) NodeModel.setState(state);
	
	var canBack = node.getAttribute("canBack");
	if(NodeModel.setCanBack) NodeModel.setCanBack(eval(canBack));
	
	var canRecycle = node.getAttribute("canRecycle");
	if(NodeModel.setCanRecycle) NodeModel.setCanRecycle(eval(canRecycle));
	
	var limit = node.getAttribute("limit");
	if(NodeModel.setLimit){
		var limitObj = {day : 0, hour : 0};
		limitObj.day = Math.floor(limit/24);
		limitObj.hour = limit%24;
		NodeModel.setLimit(limitObj);
	}
	
	if(metaNodeModel.getLimit && metaNodeModel.getLimitUnit){
    	var limit = metaNodeModel.getLimit();
    	var limitUnit = metaNodeModel.getLimitUnit();
    	if("day"==limitUnit){
    		activitieNode.setAttribute("limit", limit*24);
    	}else{
    		activitieNode.setAttribute("limit", metaNodeModel.getLimit());
    	}
	    activitieNode.setAttribute("limitUnit", limitUnit);
    }
	
	var distributeType = node.getAttribute("distributeType");
	if(distributeType) NodeModel.setDistributeType(distributeType);
	
	var formCtrl = node.getElementsByTagName('FormCtrl');
	if (NodeModel.setFormCtrl && formCtrl && formCtrl[0]) {
		formCtrl = formCtrl[0];
		var fields = formCtrl.getElementsByTagName('Field');
		if (fields && fields.length) {
			var formctrlModel = [];
			$A(fields).each(function(field){
				formctrlModel[formctrlModel.length] = {id : field.getAttribute('id') ,value : field.getAttribute('right')};
			});
			NodeModel.setFormCtrl(formctrlModel);
		}
	}
	
	if(NodeModel.setRunner) this.convertRunnerXMLToMetaNodeModel(node, NodeModel);
	
	//过期处理类型
	if(NodeModel.setOverdue){
		var overDue = node.getElementsByTagName("Overdue");
		if(NodeModel.setOverdue && overDue && overDue[0]){
			overDue = overDue[0];
			NodeModel.setOverdue(overDue.getAttribute('value'));
		}
	}
	
	//定时启动
	if(NodeModel.setTimeBegin){
		var timer = node.getElementsByTagName("Timer");
		if( timer && timer[0]){
			timer = timer[0];
			var timeBegin = {
			 	 startType : Workflow.TIMER_START_SCHEDULEE,
			 	 
			 	 timeType : "M",
			 	 day : "0",
			 	 hour : "0",
			 	 min : "0",
				 
				 touchDate : new Date(),
				 touchTime : "00:00"
			 };
			timeBegin.startType = timer.getAttribute('startType');
			NodeModel.setTimeBegin(timeBegin);
			var children = timer.childNodes;
			for(var i=0;i<children.length;i++){
				var child = children[i];
				if(child.tagName == 'PeriodTime'){
					timeBegin.timeType = child.getAttribute('timeType'); 
					timeBegin.day = child.getAttribute('day'); 
					timeBegin.hour = child.getAttribute('hour'); 
					timeBegin.min = child.getAttribute('min'); 
				}else if(child.tagName == 'Schedule'){
					NodeModel.setTimeDate(child.getAttribute('dateTime'));
				}
			}
		}
	}
	
	
	
	var actionSet = node.getElementsByTagName('ActionSet');
	if(NodeModel.setActionSet){
		var actionModel = [];
		var msgMethod = [];
		if( actionSet && actionSet[0]){
			actionSet = actionSet[0];
			var actions = actionSet.getElementsByTagName('Action');
			if(actions && actions.length){
				$A(actions).each(function(action){
					if(Workflow.MSG_ACTION == action.getAttribute('type')){
						if(msgMethod.length==0){
							actionModel[actionModel.length] = action.getAttribute('type');
						}
						msgMethod[msgMethod.length] = action.getAttribute('value');
						
					}else{
						actionModel[actionModel.length] = action.getAttribute('type');
					}
					
				});
			}
		}
		if(NodeModel.setMsgmethod) NodeModel.setMsgmethod(msgMethod);
		NodeModel.setActionSet(actionModel);
	}
	
	var treadSet = node.getElementsByTagName('TreadSet');
	if(NodeModel.setTreadSet && treadSet && treadSet[0]){
		treadSet = treadSet[0];
		var treads = treadSet.getElementsByTagName('Tread');
		if(treads && treads.length){
			var treadModel = [];
			$A(treads).each(function(tread){
				treadModel[treadModel.length] = {code : tread.getAttribute("activityCode"),name : tread.getAttribute("activityName")};
			});
			NodeModel.setTreadSet(treadModel);
		}
	}
	//TODO前后置条件 优先完成
	var forwardSet = node.getElementsByTagName('ForwardConditionSet');
	if(NodeModel.setForward && forwardSet && forwardSet[0]){
		forwardSet = forwardSet[0];
		var forwards = forwardSet.getElementsByTagName('ForwardCondition');
		if(forwards && forwards.length>0){
			WorkFlowModelConverter.setForwardConvertCondition(NodeModel, forwards[0].getAttribute("value"))
		}
	}
	
	var behideSet = node.getElementsByTagName('BehindConditionSet');
	if(NodeModel.setBehide && behideSet && behideSet[0]){
		behideSet = behideSet[0];
		var behides = behideSet.getElementsByTagName('BehindCondition');
		if(behides && behides.length>0){
			WorkFlowModelConverter.setBehideConvertCondition(NodeModel, behides[0].getAttribute("value"))
		}
	}
    
    //解析表达式
    var expCtrl = node.getElementsByTagName('ExpressionCtrl');
	if(expCtrl && expCtrl[0]){
		expCtrl = expCtrl[0];
		var exps = expCtrl.getElementsByTagName('Expression');
		if(exps && exps.length){
			var expArray = [];
			$A(exps).each(function(exp){
                var outActCode = exp.getAttribute('to'),
                    formula = exp.getAttribute('formula'),
                    fmArray = null;
                if(formula){
                    fmArray = formula.split("##");
                    lftValue = fmArray[0] == "X" ? "" : fmArray[0];
                    rghtValue = fmArray[4] == "X" ? "" : fmArray[4];                    
                    if(fmArray.length == 5){
                        expArray.push({
                            "outActCode": outActCode,
                            "lftValue": lftValue,
                            "lftOp": fmArray[1],
                            "formKey": fmArray[2],
                            "rghtOp": fmArray[3],
                            "rghtValue": rghtValue
                        });    
                    }
                }
			});
			NodeModel.setExpressions(expArray);
		}
	}

    return NodeModel;
};
WorkFlowModelConverter.convertRunnerXMLToMetaNodeModel = function(node, model) {
	if (node.childNodes && node.childNodes.length > 0) {
		for (var i = 0; i < node.childNodes.length; i++) {
			if (node.childNodes[i].nodeName == 'Participant') {
				this.convertRunnerChildsXMLToMetaNodeModel(node.childNodes[i], model);
				break;
			}
		}
	}
};
WorkFlowModelConverter.convertRunnerChildsXMLToMetaNodeModel = function(runnerNode, model) {
	var userList,userNames,deptList,deptNames,postList,postNames,groupList,groupNames;
	var runner = {
    	userList : '',
    	deptList : '',
    	postList : '',
    	groupList : '',
    	flowvarList : '',
    	userNames : '',
    	deptNames : '',
    	postNames : '',
    	groupNames : '',
    	flowvarNames : ''
    }
    
    var dealFirst = [];
    
    if (runnerNode && runnerNode.childNodes && runnerNode.childNodes.length > 0) {
    	for (var i = 0 ;i < runnerNode.childNodes.length; i++) {
    		var node = runnerNode.childNodes[i];
			if (node) {
				switch (node.nodeName) {
	    			case 'User' : 
	    				runner.userList += node.getAttribute('id') + ',';
	    				runner.userNames += node.getAttribute('name') + ',';
	    			break;
	    			case 'Var' : 
	    				runner.flowvarList += node.getAttribute('value') + ',';
	    				runner.flowvarNames += node.getAttribute('name') + ',';
	    			break;
	    			case 'OrgUnit' : 
	    				{
	    					var type = node.getAttribute('type');
	    					switch(type){
	    						case Workflow.ORGUNIT_TYPE.DEPT : 
			    						runner.deptList += node.getAttribute('id') + ',';
			    						runner.deptNames += node.getAttribute('name') + ',';
			    						break;
	    						case Workflow.ORGUNIT_TYPE.GROUP :
										runner.groupList += node.getAttribute('id') + ',';
			    						runner.groupNames += node.getAttribute('name') + ',';
										break;
	    						case Workflow.ORGUNIT_TYPE.POST : 
	    								runner.postList += node.getAttribute('id') + ',';
			    						runner.postNames += node.getAttribute('name') + ',';
			    						break;
	    					}
	    				}
	    			break;
	    			case 'PrioritySet' : 
	    				{
	    					var prioritySet = node.childNodes;
	    					for(var j=0; j<prioritySet.length; j++){
	    						dealFirst[dealFirst.length] = {id : prioritySet[j].getAttribute('actorId'),name : prioritySet[j].getAttribute('actorName')};
	    					}
	    				}
	    			break;
	    		}
			}
    	}
    }
    if(model.setDealFirst){
    	model.setDealFirst(dealFirst);
    }
    model.setRunner(runner);
    
    if(model.setRealRunners){
		var realRunner = runnerNode.getElementsByTagName("RealRunners");
		if(realRunner && realRunner[0]){
			var realrunner = [];
			realRunner = realRunner[0];
			var users = realRunner.getElementsByTagName("Users");
			$A(users).each(function(user){
				realrunner[realrunner.length] = {userId : user.getAttribute("userId"),userName : user.getAttribute("userName"),dealState : user.getAttribute("dealState"),assignTime : user.getAttribute("assignTime"),expectTime : user.getAttribute("expectTime"),dealTime : user.getAttribute("dealTime")?user.getAttribute("dealTime"):"",Priority:user.getAttribute("Priority")};
			});
			model.setRealRunners(realrunner);
		}
	}
};
WorkFlowModelConverter.convertXMLToTransitionModel = function (node, model) {
    var fromID = node.getAttribute("from");
    fromNodeModel = model.getActivityById(fromID);
    var toID = node.getAttribute("to");
    toNodeModel = model.getActivityById(toID);

    var id = eval(node.getAttribute("id"));

    var name = node.getAttribute("name");
    name = name ? name : "";

    
    var transitionModel = new Transition({
							id : id,
							name : name
						});
	transitionModel.setWrapper(model.getWrapper());
	transitionModel.reconnect(fromNodeModel,toNodeModel);
    return transitionModel;
};

WorkFlowModelConverter.convertXMLToNoteModel = function (node, model) {
	var noteModel = new NoteModel();
	
    var italic = node.getAttribute("italic");
	if (italic) noteModel.setItalic(eval(italic));
	
	var font = node.getAttribute("font");
	if (font) noteModel.setFont(font);
	
	var size = node.getAttribute("size");
	if (size) noteModel.setSize(size);
	
	var bold = node.getAttribute("bold");
	if (bold) noteModel.setBold(eval(bold));
	
	var border = node.getAttribute("border");
	if (border) noteModel.setBorder(eval(border));
	
	var borderColor = node.getAttribute("borderColor");
	if (borderColor) noteModel.setBorderColor(borderColor);
	
	var color = node.getAttribute("color");
	if (color) noteModel.setColor(color);
	
	var width = node.getAttribute("width");
	if (width) noteModel.setWidth(width);
	
	var height = node.getAttribute("height");
	if (height) noteModel.setHeight(height);
	
	var text = node.getAttribute("text");
	if (text) noteModel.setText(text);
	
	var x = eval(node.getAttribute("x"));
	var y = eval(node.getAttribute("y"));
	noteModel.setP([x,y]);
    
    return noteModel;
};

/**
 * 前后置条件解析
 */
WorkFlowModelConverter.getForwardConvertCondition = function (nodeModel) {
	var result = '';
	if(nodeModel.getForward){
		var forward = nodeModel.getForward();
		switch(forward){
			case Workflow.CONDITION.ANY : result = 'any*${activity}';break;
			case Workflow.CONDITION.ALL : result = 'all*${activity}';break;
			case Workflow.CONDITION.OTHER : 
							result = nodeModel.getFwCount()+'*${activity}';
							break;
		}
	}
	return result;
};
WorkFlowModelConverter.getBehideConvertCondition = function (nodeModel) {
	var result = '';
	if(nodeModel.getBehide){
		var forward = nodeModel.getBehide();
		switch(forward){
			case Workflow.CONDITION.ANY : result = 'any*${users}';break;
			case Workflow.CONDITION.ALL : result = 'all*${users}';break;
			case Workflow.CONDITION.OTHER : 
							result = nodeModel.getBhCount()+'*${users}';
							break;
		}
	}
	return result;
};
WorkFlowModelConverter.setForwardConvertCondition = function (nodeModel,condition) {
	condition = condition.substr(0,condition.indexOf('*'));
	if(nodeModel.setForward){
		switch(condition){
			case Workflow.CONDITION.ANY : nodeModel.setForward(Workflow.CONDITION.ANY);break;
			case Workflow.CONDITION.ALL : nodeModel.setForward(Workflow.CONDITION.ALL);break;
			default : nodeModel.setForward(Workflow.CONDITION.OTHER);
					  nodeModel.setFwCount(condition);
		}
	}
};
WorkFlowModelConverter.setBehideConvertCondition = function (nodeModel,condition) {
	condition = condition.substr(0,condition.indexOf('*'));
	if(nodeModel.setBehide){
		switch(condition){
			case Workflow.CONDITION.ANY : nodeModel.setBehide(Workflow.CONDITION.ANY);break;
			case Workflow.CONDITION.ALL : nodeModel.setBehide(Workflow.CONDITION.ALL);break;
			default : nodeModel.setBehide(Workflow.CONDITION.OTHER);
					  nodeModel.setBhCount(condition);
		}
	}
};

//解析xmlDOM对象生成字符串
WorkFlowModelConverter.parserXMLToString = function(xmlDOM){
 	if (window.ActiveXObject) {
        return xmlDOM.xml;
    } else if (document.implementation
            && document.implementation.createDocument) {
        return new XMLSerializer().serializeToString(xmlDOM);
    }
};
//从String转换为xmlDOM对象
WorkFlowModelConverter.parserStringToXMLDOM = function(xmlDOM){
  	var parser = new DOMParser();
    var xmlDOM = parser.parseFromString(str, 'text/xml');
    return xmlDOM;
};

//static
WorkFlowModelConverter.NODE_ROOT = "WorkflowProcess";
WorkFlowModelConverter.ATTR_PROCESSES_NAME = "name";
WorkFlowModelConverter.ATTR_PROCESSES_CREATE_TIME = "createTime";
WorkFlowModelConverter.ATTR_PROCESSES_AUTHOR = "author";
WorkFlowModelConverter.ATTR_PROCESSES_DESCRIPTION = "description";
WorkFlowModelConverter.ATTR_PROCESSES_TYPE = "type";
WorkFlowModelConverter.ATTR_PROCESSES_FORM = "form";
WorkFlowModelConverter.ATTR_PROCESSES_EXECUTE_RULE = "executeRule";
//
WorkFlowModelConverter.NODE_ACTIVITIES = "Activities";
WorkFlowModelConverter.NODE_ACTIVITIE = "Activity";
WorkFlowModelConverter.ATTR_ACTIVITIE_ID = "id";
WorkFlowModelConverter.ATTR_ACTIVITIE_TYPE = "type";
WorkFlowModelConverter.ATTR_ACTIVITIE_NAME = "name";
WorkFlowModelConverter.ATTR_ACTIVITIE_X_COORD = "xCoordinate";
WorkFlowModelConverter.ATTR_ACTIVITIE_Y_COORD = "yCoordinate";
WorkFlowModelConverter.ATTR_ACTIVITIE_WIDTH = "width";
WorkFlowModelConverter.ATTR_ACTIVITIE_HEIGHT = "height";
WorkFlowModelConverter.ATTR_ACTIVITIE_BIZ_TYPE = "bizType";
WorkFlowModelConverter.ATTR_ACTIVITIE_SPLIT_TYPE = "splitType";

//
WorkFlowModelConverter.NODE_TRANSITIONS = "Transitions";
WorkFlowModelConverter.NODE_TRANSITION = "Transition";
WorkFlowModelConverter.ATTR_TRANSITION_ID = "id";
WorkFlowModelConverter.ATTR_TRANSITION_NAME = "name";
WorkFlowModelConverter.ATTR_TRANSITION_FROM = "from";
WorkFlowModelConverter.ATTR_TRANSITION_TO = "to";

