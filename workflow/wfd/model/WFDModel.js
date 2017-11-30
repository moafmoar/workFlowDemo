/**
 * 工作流模型
 */
WFDModel = function(cmp){
	
	var d = new Date();
	this.id = "";
	
	this.attributes = {
		processName: "未命名流程",//流程名称
		processType: "00B",//流程类型(00A:收文；00B:发文；00C:审批)
		docType : Workflow.DOC_TYPE_FORM,//表单类型
        docClassify: "",//公文分类
		form : "",//表单ID
		template : Workflow.DEFAULT_TEMPLATE,//默认表单模版类型(doc/ppt/xls)
		createTime: "",//创建时间
		mainHandler : {},//督办人
		processDesc : "",//流程描述
		author : "",//作者
		order : "1",//排序
		orgId : "",//单位ID
		isAdmin : "",//是否为管理员
		templateOrgId : "",//模版单位ID
		wtType : "00A",//流程模版类型,
		isGuide : false //是否为向导模式 
	};
	this.dataSet = new Array();//变量
	this.ActivitieSet = new Array();//活动
	this.TransitionSet = new Array();//转移
	this.NoteSet = new Array();//文本描述
	this.setController(new WFDController(this));//控制器
	this.cmp = cmp;
}

Ext.extend(WFDModel,BaseModel,{
	setName : function(name){
		this.attributes.processName = name;
	},
	getName : function(){
		return this.attributes.processName;
	},
	setType : function(type){
		this.attributes.processType = type;
	},
	getType : function(){
		return this.attributes.processType;
	},
	setCreateTime : function(time){
		this.attributes.createTime = time;
	},
	getCreateTime : function(){
		return this.attributes.createTime;
	},
	getDocType : function(){
		return this.attributes.docType;
	},
	setDocType : function(docType){
		this.attributes.docType = docType;
	},
    getDocClassify : function(){
		return !this.attributes.docClassify ? "" : this.attributes.docClassify;
	},
	setDocClassify : function(docClassify){
		this.attributes.docClassify = !docClassify ? "" : docClassify;
	},
	setForm : function(form){
		this.attributes.form = form;
	},
	getForm : function(){
		return this.attributes.form;
	},
	getTemplate : function(){
		return this.attributes.template;
	},
	setTemplate : function(template){
		this.attributes.template = template;
	},
	getWtType : function(){
		return this.attributes.wtType;
	},
	setWtType : function(wtType){
		this.attributes.wtType = wtType;
	},
	setDescription : function(desc){
		this.attributes.processDesc = desc;
	},
	getDescription : function(){
		return this.attributes.processDesc;
	},
	//设置督办人
	setMainHandler : function(mainHandler){
		if(typeof mainHandler == "string"){
			this.attributes.mainHandler = {id : mainHandler, name : mainHandler==""?"":'未知'};
		}else{
			this.attributes.mainHandler = mainHandler;
		}
	},
	//获取督办人
	getMainHandler : function(){
		//简单的对象属性copy
		var newMainHandler = {};
		var thisMainHandler = this.attributes.mainHandler;
		for(var id in thisMainHandler){
			newMainHandler[id] = thisMainHandler[id];
		}
		return newMainHandler;
//		return this.attributes.mainHandler;
	},
	setAuthor : function(author){
		this.attributes.author = author;
	},
	getAuthor : function(){
		return this.attributes.author;		
	},
	setOrder : function(order){
		this.attributes.order = order;
	},
	getOrder : function(){
		return this.attributes.order;
	},
	setOrgId : function(orgId){
		this.attributes.orgId = orgId;
	},
	getOrgId : function(){
		return this.attributes.orgId;
	},
	setIsAdmin : function(isAdmin){
		this.attributes.isAdmin = isAdmin;
	},
	getIsAdmin : function(){
		return this.attributes.isAdmin;
	},
	setTemplateOrgId : function(templateOrgId){
		this.attributes.templateOrgId = templateOrgId;
	},
	getTemplateOrgId : function(){
		return this.attributes.templateOrgId;
	},
	setGuide : function(isGuide){
		this.attributes.isGuide = isGuide;
	},
	isGuide : function(){
		return this.attributes.isGuide;
	},
	setId : function(id){
		this.id = id;
	},
	getId : function(){
		return this.id;
	},
	clearAllFormCtrl : function(){
		for(var i=0;i<this.ActivitieSet.length;i++){
			var activity = this.ActivitieSet[i];
			if(activity.setFormCtrl){
				activity.setFormCtrl([]);
			}
		}
	},
	/**
	 * 暂时没用,保存启动人放到后台
	 * 
	getStartUsers : function(){
		var startUsers = "";
		for(var i=0;i<this.ActivitieSet.length;i++){
			var activity = this.ActivitieSet[i];
			if(activity.type==StateMonitor.START_NODE){
				var runner = null;
				if(runner = activity.getRunner()){
					startUsers = runner.userList ? runner.userList : '' 
								+ runner.deptList ? runner.deptList : '' 
								+ runner.postList ? runner.postList : '' 
								+ runner.groupList ? runner.groupList : ''
				}
				break; 
			}
		}
		return startUsers;
	}, */
	
	//----
	
	//根据id找节点
	getActivityById : function(id){
		for(var i=0;i<this.ActivitieSet.length;i++){
			var act = this.ActivitieSet[i];
			if(id == act.getActivityCode()){
				return act;
			}
		}
	},
	getForms : function(){
		return this.forms;
	},
	getFormData : function(){
		return this.formData;
	},
	getAttributes : function(){
		return this.attributes;
	},
	addNote : function(note){
		if(this.NoteSet.indexOf(note)<0){
			this.NoteSet.push(note);
			this.fire(WFDController.ADDNOTE ,note);
		}
	},
	addActivity : function(activity){
		if(this.ActivitieSet.indexOf(activity)<0){
			this.ActivitieSet.push(activity);
			this.fire(WFDController.ADDACT ,activity);
		}
	},
	moveSelected : function(differ){
//		var argument = 
		this.fire(WFDController.MOVESELECTED ,[this.getSelectedAct(),differ]);
	},
	getSelectedAct : function(){
		var selectacts = new Array();
		for(var i=0;i<this.ActivitieSet.length;i++){
			var act = this.ActivitieSet[i];
			if(act.selected){
				selectacts.push(act);
			}
		}
		
		for(var i=0;i<this.NoteSet.length;i++){
			var note = this.NoteSet[i];
			if(note.selected){
				selectacts.push(note);
			}
		}
		
		return selectacts;
	},
	hasSelect : function(){
		var selectacts = new Array();
		for(var i=0;i<this.ActivitieSet.length;i++){
			var act = this.ActivitieSet[i];
			if(act.selected){
				return true;
			}
		}
		
		for(var i=0;i<this.NoteSet.length;i++){
			var note = this.NoteSet[i];
			if(note.selected){
				return true;
			}
		}
		for(var i=0;i<this.ActivitieSet.length;i++){
			var transitions = this.ActivitieSet[i].outTransitions;
			for(var j=0;j<transitions.length;j++){
				if(transitions[j].selected){
					return true;
				}
			}
		}
		
		return false;
	},
	getSelectedTran : function(){
		var selecttran = new Array();
		for(var i=0;i<this.ActivitieSet.length;i++){
			var transitions = this.ActivitieSet[i].outTransitions;
			for(var j=0;j<transitions.length;i++){
				if(transitions[i].selected){
					selecttran.push(transitions[i]);
				}
			}
		}
		return selecttran;
	},
	selectAll : function(){
		for(var i=0;i<this.ActivitieSet.length;i++){
			var act = this.ActivitieSet[i];
			if(!act.selected){
				act.select(true);
			}
//			act.clearSelected();//
		}
		
		for(var i=0;i<this.NoteSet.length;i++){
			var note = this.NoteSet[i];
			if(!note.selected){
				note.select(true);
			}
//			act.clearSelected();//
		}
	},
	getAllTransitions : function(){
		var trans = new Array();
		for(var i=0;i<this.ActivitieSet.length;i++){
			trans = trans.concat(this.ActivitieSet[i].outTransitions);
		}
		return trans;
	},
	clearSelected : function(){
		for(var i=0;i<this.ActivitieSet.length;i++){
			var act = this.ActivitieSet[i];
			if(act.selected){
				act.select(false);
			}
			act.clearSelected();//
		}
		
		for(var i=0;i<this.NoteSet.length;i++){
			var not = this.NoteSet[i];
			if(not.selected){
				not.select(false);
			}
		}
	},
	deleteSelect : function(){
		for(var i=0;i<this.ActivitieSet.length;){
			var act = this.ActivitieSet[i];
			if(act.selected){
				act.remove();
				this.ActivitieSet.remove(act);
			}else{
				i++;
			}
		}
		
		for(var i=0;i<this.ActivitieSet.length;i++){
			var transitions = this.ActivitieSet[i].outTransitions;
			for(var j=0;j<transitions.length;){
				if(transitions[j].selected){
					transitions[j].remove();
				}else{
					j++;
				}
			}
		}
		
		for(var i=0;i<this.NoteSet.length;){
			var not = this.NoteSet[i];
			if(not.selected){
				not.remove();
				this.NoteSet.remove(not);
			}else{
				i++;
			}
		}
	},
	moreSelected : function(start,end){
		var tempar = this.ActivitieSet.concat(this.NoteSet);
		
		for(var i=0;i<tempar.length;i++){
			var act = tempar[i];
			var position = [act.position[0],act.position[1]];
			if(position[0]>Math.min(start[0],end[0])&&position[0]<Math.max(start[0],end[0])
			&&position[1]>Math.min(start[1],end[1])&&position[1]<Math.max(start[1],end[1])){
				act.select(true);
			}
		}
	}
});


//节点模型基类,实现节点的基本操作，如添加连接，移动等
Activity = function(config){
	this.initAttribute();//初始化属性
	
	if(config&&config.x&&config.y){
		this.setPosition([config.x,config.y]);
	}
	
    this.expressions = [];
	this.inTransitions = new Array();
	this.outTransitions = new Array();
	this.setController(new ActivityController(this));
}
Ext.extend(Activity,MetaModel, {
	initAttribute : function(){
		this.type = null;
		this.attributes = null;
	},
	update : function(){
		this.fire(Controller.UPDATE);
		for(var i=0;i<this.outTransitions.length;i++){
			this.outTransitions[i].update();
		}
	},
	//找节点可跳转的节点list
	getTreadSetForNode : function(node,threadSet){
		if(threadSet==null){
			threadSet = new Array();
		}
		if(node==null){
			node = this;
		}
		var transitions = node.inTransitions;
			for(var i=0;i<transitions.length;i++){
				var tran = transitions[i];
				var from = tran.getFrom();
				var had = false;
				for(j = 0; j < threadSet.length; j++){
					if(threadSet[j]== from){
						had = true;
					}
				}
				if(!had){
					if(from != node){
						threadSet.push(from);
					}
					this.getTreadSetForNode(from, threadSet)
				}
			}
		return threadSet;
	},
	addTransition : function(tran){
		if(tran==null||tran.getTo()==tran.getFrom()){
			return ;
		}
		if(tran.getTo()==this){
			this.inTransitions.push(tran);
		}else if(tran.getFrom()==this){
			this.outTransitions.push(tran);
		}
		return true;
	},
	removeTransition : function(tran){
		if(tran==null){
			return ;
		}
		if(tran.getTo()==this){
			this.inTransitions.remove(tran);
		}else if(tran.getFrom()==this){
			this.outTransitions.remove(tran);
		}
	},
	remove : function(){
		for(var i=0;i<this.inTransitions.length;){
			this.inTransitions[i].remove();
		}
		for(var i=0;i<this.outTransitions.length;){
			this.outTransitions[i].remove();
		}
		this.fire(Controller.REMOVE);
		this.setController(null);
	},
	hasConnect : function(endNode){
		for(var i=0;i<this.outTransitions.length;i++){
				if(this.outTransitions[i].to==endNode){
					return true;
			}
		}
		return false;
	},
	reconnect : function(transitions){
		if(!transitions||transitions.length==0){
			return ;
		}
		for(var i=0;i<transitions.length;i++){
			transitions[i].repaint();
		}
	},
	//重写父类的方法
	setPosition : function(p){
		this.setP(p);
		this.reconnect(this.inTransitions);
		this.reconnect(this.outTransitions);
		this.fire(Controller.SETPOSITION,p);
	},
	setP : function(p){
		this.position = p;
		if(this.attributes){
			this.attributes.x = p[0];
			this.attributes.y = p[1];
		}
	},
	clearSelected : function(){
		for(var i=0;i<this.outTransitions.length;i++){
			var tran = this.outTransitions[i];
			if(tran.selected){
				tran.select(false);
			}
//			tran.clearSelected();//
		}
	},
//	已经
//	move : function(differ){
//		var p = [(this.position[0]+differ[0]),(this.position[1]+differ[1])];
//		this.setPosition(p)
//	},
	setReadOnly : function(bl){//设置只读
		this.readOnly = bl;
	},
	select : function(select){
		if(!this.getReadOnly()){
			this.selected = select;
			for(var i=0;i<this.outTransitions.length;i++){
				if(this.outTransitions[i].to.selected==select){
					this.outTransitions[i].select(select);
				}
			}
			for(var i=0;i<this.inTransitions.length;i++){
				if(this.inTransitions[i].from.selected==select){
					this.inTransitions[i].select(select);
				}
			}
			this.fire(Controller.SELECTED,select);
		}
	},
	getId : function(){
		if(this.attributes){
			return this.attributes.activityCode
		}
		return "";
	},
	getName : function(){
		if(this.attributes){
			return this.attributes.activityName
		}
		return "";
	},
	getType : function(){
		return this.type;
	},
	setAttributes : Ext.emptyFn(),
	getAttributes : function(){
		return this.attributes;
	},
    setExpressions: function(exps){
        this.expressions = exps;
    },
    getExpressions: function(){
        return this.expressions;
    },
    getExpressionByToCode: function(toCode){
        var exps = this.expressions;
        if(toCode && exps.length){
            for(var i=0, len=exps.length; i<len; i++){
                if(exps[i].outActCode == toCode){
                    return exps[i];
                }
            }
        }
        return false;
    },
    updateExpressions: function(){
        var outTrans = this.outTransitions,
            outTransLen = outTrans.length,
            outExps = [];
        if(outTransLen > 1){
            var outTran = null,
                outActCode = "",
                expLeftVal = null,                    
                expLeftOp = null,
                expFormkey = null,
                expRightOp = null,
                expRightVal = null,
                outExp = {};
            for(var i=0; i<outTransLen; i++){
                outTran =  outTrans[i];
                outActCode = outTran.getTo().getActivityCode();
                expLeftVal = Ext.getCmp("expLeftVal_"+outActCode);                    
                expLeftOp = Ext.getCmp("expLeftOp_"+outActCode);
                expFormKey = Ext.getCmp("expFormKey_"+outActCode);
                expRightOp = Ext.getCmp("expRightOp_"+outActCode);
                expRightVal = Ext.getCmp("expRightVal_"+outActCode);
                outExp = {};
                outExp.outActCode = outActCode;
                if(expLeftVal && (!!expLeftVal.getValue() || expLeftVal.getValue() === 0)){
                    outExp.lftValue = expLeftVal.getValue();
                }else{
                    outExp.lftValue = "";
                }
                if(expLeftOp && expLeftOp.getValue()){
                    outExp.lftOp = expLeftOp.getValue();
                }else{
                    outExp.lftOp = "";
                }
                if(expFormKey && expFormKey.getValue()){
                    outExp.formKey = expFormKey.getValue();
                }else{
                    outExp.formKey = "X";
                }
                if(expRightOp && expRightOp.getValue()){
                    outExp.rghtOp = expRightOp.getValue();
                }else{
                    outExp.rghtOp = "";
                }
                if(expRightVal && (!!expRightVal.getValue() || expRightVal.getValue() === 0)){
                    outExp.rghtValue = expRightVal.getValue();
                }else{
                    outExp.rghtValue = "";
                }
                outExps.push(outExp);
            }
            this.setExpressions(outExps);
        }else{
            return false;
        }
    }
});