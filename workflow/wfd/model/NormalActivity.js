/**
 * 普通节点
 */
NormalActivity = Ext.extend(Activity,{
	initAttribute : function(){
		this.type = StateMonitor.NODE;
		this.state = "";
		this.attributes = {
			 activityCode : Workflow.getID(),
	 	     activityName : "普通",
	         y : 0,
	         x : 0,
	         backOrRecycle :'',//判断回退 回收权限的
	         canBack : true,
	         canRecycle : true,
	         distributeType : Workflow.DEFAULT_DISTRIBUTE_TYPE,
	         splitType : Workflow.DEFAULT_SPLIT_TYPE,
			 //加入分支注释
			 splittypeLabelId : '',	         
	         limit : {day : 0, hour : 0},
			 ActionSet : Workflow.DEFAULT_ACTIONSET,
			 TreadSet : [],
			 
			 behide : Workflow.DEFAULT_CONDITION,
			 bhCount : 1,
			 forward : Workflow.DEFAULT_CONDITION,
			 fwCount : 1,
			 
			 Overdue : Workflow.DEFAULT_OVER_DUE,
			 runner : {},
			 realRunners : [],
			 dealFirst : [],
			 msgmethod : Workflow.DEFAULT_MSG_METHOD,
			 FormCtrl : []
		};
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
	setSplitType : function(splitType){
		this.attributes.splitType = splitType;
	},
	getSplitType : function(){
		return this.attributes.splitType;
	},
	getX : function(){
		return this.attributes.x;
	},
	getY : function(){
		return this.attributes.y;
	},
	setCanBack : function(canBack){
		this.attributes.canBack = canBack;
	},
	getCanBack : function(){
		return eval(this.attributes.canBack) ? 'true':'false';
	},
	setCanRecycle : function(canRecycle){
		this.attributes.canRecycle = canRecycle;
	},
	getCanRecycle : function(){
		return eval(this.attributes.canRecycle) ? 'true':'false';
	},
	setActionSet : function(actionSet){
		this.attributes.ActionSet = actionSet;
	},
	getActionSet : function(){
		return this.attributes.ActionSet;
	},
	setMsgmethod : function(msgmethod){
		this.attributes.msgmethod = msgmethod;
	},
	getMsgmethod : function(){
		return this.attributes.msgmethod;
	},
	setLimit : function(limit){
		this.attributes.limit = limit;
	},
	getLimit : function(){
		return this.attributes.limit;
	},
	setDistributeType : function(distributeType){
		this.attributes.distributeType = distributeType;
	},
	getDistributeType : function(){
		return this.attributes.distributeType;
	},
	getFormCtrl : function(){
		return this.attributes.FormCtrl;
	},
	setFormCtrl : function(formctrl){
		this.attributes.FormCtrl = formctrl;
	},
	getRunner : function(){
		//简单的对象属性copy
		var newRunner = {};
		var thisRunner = this.attributes.runner;
		for(var id in thisRunner){
			newRunner[id] = thisRunner[id];
		}  
		return newRunner;
	},
	setRunner : function(obj){
		this.attributes.runner = obj;
	},
	getRealRunners : function(){
		return this.attributes.realRunners;
	},
	setRealRunners : function(realRunners){
		this.attributes.realRunners = realRunners;
	},
	setDealFirst : function(obj){
		this.attributes.dealFirst = obj;
	},
	getDealFirst : function(){
		return this.attributes.dealFirst;
	},
	getOverdue : function(){
		return this.attributes.Overdue;
	},
	setOverdue : function(overdue){
		this.attributes.Overdue = overdue;
	},
	getState : function(){
		return this.state;
	},
	setState : function(state){
		this.state = state;
	},
	getTreadSet : function(){
		var threadSet = this.attributes.TreadSet;
		if(this.attributes.canBack && this.attributes.TreadSet.length==0){
			var treadlist = this.getTreadSetForNode(null, null);
			for(var i=0; i < treadlist.length; i++){
				threadSet.push({code : treadlist[i].getActivityCode(), name : treadlist[i].getActivityName()});
			}
		}
		return threadSet;
	},
	setTreadSet : function(treadSet){
		this.attributes.TreadSet = treadSet;
	},
	setBehide : function(behide){
		this.attributes.behide = behide;
	},
	getBehide : function(){
		return this.attributes.behide;
	},
	setBhCount : function(bhCount){
		this.attributes.bhCount = bhCount;
	},
	getBhCount : function(){
		return this.attributes.bhCount;
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
	}
})