/**
 * 连接模型
 */
Transition = function(config){
	this.id = Workflow.getID();
	this.name = "tran_"+this.id;
	this.isconnected = false;
	this.setController(new TransitionController(this));
//	this.reconnect(config.from,config.to);
//	this.select(false);
	this.type = StateMonitor.TRANSITION;
}
Ext.extend(Transition, MetaModel,{
	getId : function(){
		return this.id;
	},
	getName : function(){
		return this.name;
	},
//	select : function(select){
//		this.selected = select;
//	},
	remove : function(){
		this.disconnect();//断开连接
		this.setController(null);
	},
	getTo : function(){
		return this.to;
	},
	getFrom : function(){
		return this.from;
	},
	reconnect : function(from,to){
		if(from==null||to==null||from==to){
			return ;
		}
		this.disconnect();
		this.from = from;
		this.to = to;
		this.connect();
	},
	getReadOnly : function(){
		if(this.from!=null&&this.to!=null){
			return (this.from.getReadOnly() && this.to.getReadOnly());
		}
		return false;
	},
	disconnect : function(){
		if(this.isconnected){
			this.from.removeTransition(this);
			this.to.removeTransition(this);
			this.isconnected = false;
			this.fire(TransitionController.DISCONN);
		}
	},
	connect : function(){
		if(!this.isconnected){
			this.from.addTransition(this);
			this.to.addTransition(this);
			this.fire(TransitionController.CONN);
			this.isconnected = true;
		}
	},
	connect2 : function(){
		this.disconnect();
		this.connect();
	},
	repaint : function(){
		this.fire(TransitionController.REPAINT);
	}
});