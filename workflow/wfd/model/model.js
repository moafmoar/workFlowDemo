/**
 * 模型基础类  添加控制器
 */
BaseModel = function(){
	this.controller = null;
	this.cmp = null;
}
Ext.extend(BaseModel,Ext.util.Observable,{
	setController : function(controller){
		this.controller = controller;
	},
	fire : function(eventname,args){
		if(this.controller!=null){
			this.controller.fire(eventname,args);
		}
	},
	getCmp : function(){
		return this.cmp;
	},
	setCmp : function(cmp){
		this.cmp = cmp;
	},
	setWrapper : function(wrapper){
		this.controller.setWrapper(wrapper);
	},
	getWrapper : function(){
		return this.controller.getWrapper();
	},
	update : function(){
		this.fire(Controller.UPDATE);
	}
});

//存放节点，文本,拐点，线等公共方法，如位置的移动，选择状态等
MetaModel = function(){
	
}
Ext.extend(MetaModel,BaseModel,{
	setPosition : function(p){
		this.setP(p);
		this.fire(Controller.SETPOSITION,p);
	},
	setP : function(p){
		this.position = p;
	},
	move : function(differ){
		var p = [(this.position[0]+differ[0]),(this.position[1]+differ[1])];
		this.setPosition(p)
	},
	select : function(select){
		if(!this.getReadOnly()){
			this.selected = select;
			this.fire(Controller.SELECTED,select);
		}
	},
	setReadOnly : function(bl){//设置只读
		this.readOnly = bl;
	},
	getReadOnly : function(){
		return !!this.readOnly;
	}
});

