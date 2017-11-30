/**
 * 状态监视
 */
StateMonitor = function(){
//	this.setState(StateMonitor.SELECT);
	this.setController(new StateMonitorController(this));
}
Ext.extend(StateMonitor,BaseModel,{
	setState : function(state){
		this.state = state;
		this.fire(StateMonitorController.OPERATION_STATE_CHANGED,state);
		this.statusTips(state);
	},
	getState : function(){
		return this.state;
	},
	resetState : function(){
		this.setState(StateMonitor.SELECT);
	},
	statusTips : function(state){
		if(!this.controller||!this.getWrapper()) return;
		var text = "";
		switch(state){
			case StateMonitor.SELECT : text = "当前是选择状态,左键单击选择节点,右键查看菜单,双击打开属性窗口";break;
			case StateMonitor.START_NODE : text = "当前是添加开始节点状态,点击添加开始节点";break;
			case StateMonitor.END_NODE : text = "当前是添加结束节点状态,点击添加结束节点";break;
			case StateMonitor.FORK_NODE : text = "";break;
			case StateMonitor.JOIN_NODE : text = "";break;
			case StateMonitor.NODE : text = "当前是添加普通节点状态,点击添加普通节点,按住ctrl可多次添加";break;
			case StateMonitor.TRANSITION : text = "在节点上单击鼠标,拖拽到另外一个节点,两个节点建立连接,按住ctrl可多次添加连接";break;
			case StateMonitor.NOTE : text = "点击添加标注";break;
		}
		this.getWrapper().setStatusInfo(text);
	}
})


StateMonitor.SELECT = 1;
StateMonitor.START_NODE = 3;
StateMonitor.END_NODE = 5;
StateMonitor.FORK_NODE = 7;
StateMonitor.JOIN_NODE = 9;
StateMonitor.NODE = 11;
StateMonitor.TRANSITION = 13;
StateMonitor.NOTE = 15;