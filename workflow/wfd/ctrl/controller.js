/**
 * 控制器
 */
Controller = function(model){
	this.Model = model;
	this.addEvents(
		Controller.SETPOSITION,
		Controller.SELECTED,
		Controller.REMOVE,
		Controller.UPDATE
	);
	
	this.on(Controller.SELECTED,this.selected);
	this.on(Controller.SETPOSITION,this.setPosition);
	this.on(Controller.REMOVE,this.remove);
	this.on(Controller.UPDATE,this.update);
}
Ext.extend(Controller,Ext.util.Observable,{
	fire : function(eventName,arg){
		this.fireEvent(eventName,arg);
	},
	setWrapper : function(wrapper){
		this.Wrapper = wrapper;
	},
	getWrapper : function(){
		return this.Wrapper;
	},
	//组件可选择,可移动时要重写以下两个方法
	selected : function(select){
		this.Model.getCmp().selected(select);
	},
	setPosition : function(p){
		this.Model.getCmp().getEl().dom.style.left = p[0];
		this.Model.getCmp().getEl().dom.style.top = p[1];
	},
	remove : function(){
		if(this.Model.getCmp().NodeText){
			this.Model.getCmp().NodeText.destroy();
			this.Wrapper.getViewer().remove(this.Model.getCmp().NodeText);
		}
		
		this.Model.getCmp().destroy();
		this.Wrapper.getViewer().remove(this.Model.getCmp());
		this.Model.setCmp(null);
		this.Model = null;
	},
	update : function(){
		if(this.Model.getCmp().update){
			this.Model.getCmp().update();
		}
	}
})

Controller.SETPOSITION = "setPosition";
Controller.SELECTED = "selected";
Controller.REMOVE = "remove";
Controller.UPDATE = "update";

//活动控制器
ActivityController = function(model){
	WFDController.superclass.constructor.call(this,model);
	this.addEvents(
		ActivityController.ADDTRAN,
		ActivityController.RMTRAN
	);
}
Ext.extend(ActivityController,Controller,{
	selected : function(select){
		this.Model.getCmp().selected(select);
	},
	setPosition : function(p){
		this.Model.getCmp().changePosition(p);
	}
})

ActivityController.ADDTRAN = "addTransition";
ActivityController.RMTRAN = "removeTransition";


WFDController = function(model){
	WFDController.superclass.constructor.call(this,model);
	
	this.addEvents(
			WFDController.ADDACT,
			WFDController.MOVESELECTED,
			WFDController.ADDNOTE
	);
	this.on(WFDController.ADDACT,this.addAct);
	this.on(WFDController.MOVESELECTED,this.moveselected);
	this.on(WFDController.ADDNOTE,this.addNote);
	
}
Ext.extend(WFDController,Controller,{
	addNote : function(noteModel){
		var note = new Note(noteModel,this.Wrapper);
		
		this.Model.getCmp().add(note);
		noteModel.setCmp(note);
		noteModel.select(false);
		this.Model.getCmp().doLayout(true);
	},
	addAct : function(act){
		var node = new Node(act,this.Wrapper);
		var nodetxt = new NodeText(node.name);
		
		this.Model.getCmp().add(node);
		this.Model.getCmp().add(nodetxt);
		node.setNodeText(nodetxt);
		act.setCmp(node);
//		var node = new Node({
//			id : 'node',
//			x : 500,
//			y : 500
//		});
//		Ext.getComp('designer').add(node);
		this.Model.getCmp().add(node);
		act.select(false);
		this.Model.getCmp().doLayout(true);
	},
	moveselected : function(arguments){
		if(arguments[0].length==0){
			return;
		}
		var selects = arguments[0],differ = arguments[1];
		for(var i=0; i<arguments[0].length; i++){
			var model = arguments[0][i];
			if(model.position[0]<=1&&differ[0]<0){
				differ[0]=0;
			}
			if(model.position[1]<=1&&differ[1]<0){
				differ[1]=0;
			}
		}
		for(var i=0; i<arguments[0].length; i++){
			var model = arguments[0][i];
			model.move(differ);
		}
//		selecteds.each(function(model){
//			model.move(differ);
//		});
	}
	
})

WFDController.ADDACT = "addActivity";
WFDController.MOVESELECTED = "moveSelected";
WFDController.ADDNOTE = "addnote";


TransitionController = function(model){
	WFDController.superclass.constructor.call(this,model);
	this.addEvents(
			WFDController.DISCONN,
			WFDController.CONN,
			TransitionController.REPAINT
	);
	this.on(TransitionController.DISCONN,this.disconnect);
	this.on(TransitionController.CONN,this.connect);
	this.on(TransitionController.REPAINT,this.repaint);
}
Ext.extend(TransitionController,Controller,{
	connect : function(){
		if(!this.Model.getCmp()){
			var line = new Line(this.Model,this.Wrapper);
			this.Model.setCmp(line);
			this.Wrapper.getViewer().add(line);
			this.Wrapper.getViewer().doLayout(true);
		}
	},
	disconnect : function(){
		this.Model.getCmp().destroy();
		this.Wrapper.getViewer().remove(this.Model.getCmp());
		this.Model.setCmp(null);
	},
	repaint : function(){
		this.Model.getCmp().repaint();
	}
});

TransitionController.DISCONN = "disconnect";
TransitionController.CONN = "connect";
TransitionController.REPAINT = "repaint";





StateMonitorController = function(model){
	WFDController.superclass.constructor.call(this,model);
	this.addEvents(
		StateMonitorController.OPERATION_STATE_CHANGED
	);
	this.on(StateMonitorController.OPERATION_STATE_CHANGED,this.setState);
}
Ext.extend(StateMonitorController,Controller,{
	setState : function(state){
		this.Model.getCmp().pressdown(state);
	}
});

StateMonitorController.OPERATION_STATE_CHANGED = "OPERATION_STATE_CHANGED";


//活动控制器
NoteController = function(model){
	WFDController.superclass.constructor.call(this,model);
}
Ext.extend(NoteController,Controller,{
	selected : function(select){
		this.Model.getCmp().selected(select);
	},
	setPosition : function(p){
		this.Model.getCmp().setPosition(p);
	},
	update : function(){
		this.Model.getCmp().update();
	}
})
