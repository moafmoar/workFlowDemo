/**
 * <p>Title:  流程有效性校验</p>
 * @author zhangjing
 */
function SaveValidateListener(wrapper) {
    this.wrapper = wrapper;
}
SaveValidateListener.prototype.actionPerformed = function () {
    var wrapper = this.wrapper;
    var model = wrapper.getModel();
    
//	var name = wrapper.getModel().getName();
//	var type = wrapper.getModel().getType();
//	
//	if (!name || name == "") {
//		alert("请输入流程名称");
//		return;
//	}
//	if (!type || type == "") {
//		alert("请选择流程类型");
//		return;
//	}
//	var desc = wrapper.getModel().getDescription();
//	//desc = desc.replace(/</gi,'＜').replace(/>/gi,'＞');<·@#$&*>
//	desc = desc.replace(/\<|\>|\.|\@|\#|\$|\&|\*/gi,' ');
//	if (desc.strlen() > 2000) {
//		alert('流程描述字符太长，最长不得大于2000个字符,当前长度为'+desc.strlen());
//		return;
//	};
//	wrapper.getModel().setDescription(desc);
	
	return this.workflowAvail(model);
};

/**
 * 校验流程的有效性
 */
SaveValidateListener.prototype.workflowAvail = function (model) {
	var result = "";
    var activities = model.ActivitieSet;
    var startActivity = null;
    if(activities.length!=0){
    	for(var i=0; i < activities.length; i++){
	    	var activity = activities[i];
	    	if(activity.getType() != StateMonitor.END_NODE){
	    		if(!activity.outTransitions || activity.outTransitions.length==0){
	    			result += "节点【"+activity.getActivityName()+"("+activity.getActivityCode()+")】没有后续节点 </br>";
	    		}
	    	}
	    	if(activity.getType() != StateMonitor.START_NODE){
	    		if(!activity.inTransitions || activity.inTransitions.length==0){
	    			result += "节点【"+activity.getActivityName()+"("+activity.getActivityCode()+")】没有前置节点 </br>";
	    		}
	    	}else{
	    		startActivity = activity;
	    	}
	    }
    }else{
    	result = "请为该流程添加节点";
    }
    
    if(startActivity){
    	if(startActivity.getStartType()=='00B' && !model.getMainHandler().id){
    		result += "该流程开启了定时启动，但未设置主办人";
    	}
    }
    //return false;
    
    if(model.getDocType()&&model.getDocType()==Workflow.DOC_TYPE_FORM&&!model.getForm()){
    	result = "请为该流程选择一个模板";
    }
    
    if(result!=""){
    	Ext.MessageBox.alert("",result);
    	return false;
    }else{
    	return true;
    }
};
