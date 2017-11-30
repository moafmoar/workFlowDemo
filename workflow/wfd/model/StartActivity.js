/**
 * 开始节点模型
 */
StartActivity = Ext.extend(Activity,{ 
	initAttribute : function(){
		this.type = StateMonitor.START_NODE;
		this.state = "";
//		var today = new Date();
//      	today = today.format("Y-m-d");
		this.attributes = {
			 activityCode : Workflow.START_CODE,
	 	     activityName : "开始",
	         y : 0,
	         x : 0,
	         startType : Workflow.DEFAULT_START_TYPE,
	         splitType : Workflow.DEFAULT_SPLIT_TYPE,
	         runner : {},
	         realRunners : [],
			 TimeBegin : {
			 	 startType : Workflow.TIMER_START_SCHEDULEE,
			 	 
			 	 timeType : "M",
			 	 day : "0",
			 	 hour : "0",
			 	 min : "0",
				 
				 touchDate : new Date(),
				 touchTime : "00:00"
			 },
			 ActionSet : Workflow.DEFAULT_ACTIONSET,
			 msgmethod : Workflow.DEFAULT_MSG_METHOD,
			 FormCtrl : []
			 ,
			 processStart : '',
			 //加入分支注释
			 splittypeLabelId : ''
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
	setStartType : function(startType){
		this.attributes.startType = startType;
	},
	getStartType : function(){
		return this.attributes.startType;
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
	getState : function(){
		return this.state;
	},
	setState : function(state){
		this.state = state;
	},
	getTimeBegin : function(){
		return this.attributes.TimeBegin;
	},
	setTimeBegin : function(timeBegin){
		this.attributes.TimeBegin = timeBegin;
	},
	getTimeDate : function(){
		if(typeof this.attributes.TimeBegin.touchDate == 'object'){
			return this.attributes.TimeBegin.touchDate.format("Y-m-d") + ' ' + this.attributes.TimeBegin.touchTime+''
		}else{
			return this.attributes.TimeBegin.touchDate + ' ' + this.attributes.TimeBegin.touchTime+''
		}
	},
	setTimeDate : function(time){
		if(!time||time.length<16){
			return;
		}
		this.attributes.TimeBegin.touchTime = time.substring(11,16);
		var v = Date.parseDate(time.substring(0,10), "Y-m-d");
		this.attributes.TimeBegin.touchDate = v;
		
	}
	
})