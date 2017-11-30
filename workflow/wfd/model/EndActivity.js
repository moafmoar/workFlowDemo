/**
 * 结束节点
 */
EndActivity = Ext.extend(Activity,{
	initAttribute : function(){
		this.type = StateMonitor.END_NODE;
		
		this.attributes = {
			 activityCode : Workflow.END_CODE,
	 	     activityName : "结束",
	 	     y : 0,
	         x : 0,
	         forward : Workflow.DEFAULT_CONDITION,
			 fwCount : 1,
			 ActionSet : ['00E']
		}
	},
	setActivityCode : function(activityCode){
		this.attributes.activityCode = activityCode;
	},
	getActivityCode : function(){
		return this.attributes.activityCode;
	},
	setActivityName : function(activityName){
		this.attributes.activityName = activityName;
	},
	getActivityName : function(){
		return this.attributes.activityName;
	},
	getX : function(){
		return this.attributes.x;
	},
	getY : function(){
		return this.attributes.y;
	},
	setForward : function(forward){
		this.attributes.forward = forward;
	},
	getForward : function(){
		return this.attributes.forward;
	},
	setFwCount : function(fwCount){
		this.attributes.fwCount = fwCount;
	},
	getFwCount : function(){
		return this.attributes.fwCount;
	},
	setActionSet : function(actionSet){
		this.attributes.ActionSet = actionSet;
	},
	getActionSet : function(){
		return this.attributes.ActionSet;
	}
})