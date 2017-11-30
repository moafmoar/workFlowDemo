Wrapper = function(attribute,viewer,model, stateMonitor, statuser){
	this.viewer = viewer;
	this.state = stateMonitor;
	this.model = model;
	this.statuser = statuser;
	this.mouseover = null;
	this.attributeWin = attribute;
	this.changed = false;
	this.editState = "";
	
	//操作是为了流程状态改变时及时通知状态栏
	this.state.setWrapper(this);
}

Ext.extend(Wrapper,Ext.util.Observable,{
	getEditState : function(){
		return this.editState;
	},
	setEditState : function(state){
		this.editState = state;
	},
	getViewerPosition : function(){
		var position = [this.viewer.getEl().getLeft(),this.viewer.getEl().getTop()];
		return position;
	},
	setStatusInfo : function(txt){
		this.statuser.setText(txt);
	},
	getViewer : function(){
		return this.viewer;
	},
	getState : function(){
		return this.state;
	},
	getModel : function(){
		return this.model;
	},
	setModel : function(model){
		this.model = model;
	},
	setMouseover : function(mouseover){
		this.mouseover = mouseover;
	},
	getMouseover : function(){
		if(this.mouseover!=null){
			return this.mouseover;
		}else{
			return this.viewer;
		}
	},
	setChanged : function(b){
		//发生地点 main.js 的addViewerListeners里
		//流程有没有发生改变判断条件  1.有没有节点或链接被选择 2.属性窗口是否被打开 3.是否添加新节点或连接
		this.changed = b;
	},
	isChanged : function(){
		return this.changed;
	},
	getAttributeWin : function(){
		return this.attributeWin;
	},
	//校验节点
	validateNode : function(node){
		if(!node.getActivityCode){
			return true;
		}
		var code = node.getActivityCode();
		if(this.model.getActivityById(code)){
			if(code==Workflow.START_CODE){
				Ext.MessageBox.alert("","只能添加一个开始节点");
			}else if(code==Workflow.END_CODE){
				Ext.MessageBox.alert("","只能添加一个结束节点");
			}else{
				Ext.MessageBox.alert("","该节点不能重复");
			}
			return false
		}
		return true;
	},
	//校验连接
	validateLine : function(startNode,endNode){
		if(	
			this.validateLineNode(startNode) && this.validateLineNode(endNode)
			&&startNode!=endNode && (endNode!=this.getViewer()) //开始不是目标，目标存在
			&&!startNode.hasConnect(endNode)
			&& startNode.getType()!=StateMonitor.END_NODE //起始不是结束
			&& endNode.getType()!=StateMonitor.START_NODE //目标不是开始
			&&!(startNode.getType()==StateMonitor.START_NODE && endNode.getType()==StateMonitor.END_NODE ) //开始到结束
			){
			return true;
		}
		return false
	},
	validateLineNode : function(node){
		if(node!=this.getViewer() && 
		(node.type==StateMonitor.START_NODE
		 || node.type == StateMonitor.NODE
		 || node.type == StateMonitor.END_NODE)
		){
			return true;
		}
		return false
	}
	
})