/**
 * 工作流设计器工作空间类,装载建立设计器所需的资源
 *
 * @author fan
 */

var Workflow = {
		
	BASE_PATH : '',
	ID : 1,
	
	/** 流程编辑状态  */
	EDITING :  "editing", //编辑
	HALF_EDIT : "halfedit", //办理
	READ_ONLY : "readonly", //只读
	DISPLAY : "display",//展示，仅用于显示流程图
	
	/** 流程节点编号  */
	START_CODE : 0, //开始节点编号
	END_CODE : -1, //结束节点编号
	DEFAULT_START_TYPE : '00A',
	
	/** 流程类型  */
	DEFAULT_PROCESS_TYPE : "00B",
	PROCESS_TYPE_AFFIR : '00C',
	PROCESS_TYPE : [
		['00A', '收文办理'],
		['00B', '发文办理'],
		['00C', '审批']
//		['00E', '督查督办']
	],
	PROCESS_TYPE_D : [
		['00A', '收文办理'],
		['00B', '发文办理']
	],
	PROCESS_TYPE_A : [
		['00C', '审批']
	],
	
	/** 表单类型  */
	DOC_TYPE_FORM : "00B", //自定义表单
	DOC_TYPE_TEMPLATE : "00A", //正文模版
	
	
	/** 正文模版类型  */
	DEFAULT_TEMPLATE : 'doc',
	TEMPLATE : [
        ['doc','Word 文档'],
        ['xls','Excel 文档'],
        ['ppt','Power point 文档'],
        ['txt','纯文本文档']
    ],
	
	
	/** 节点分支类型  */
	DEFAULT_SPLIT_TYPE : 'AND',
	SPLIT_TYPE_XOR : 'XOR',
	SPLIT_TYPE_ONLY : 'ONL',
	SPLIT_TYPE : [
		['AND', '并发分支','不能选择分支,只能按照既定流程发送'],
		['XOR', '鉴别分支','可选择一条或多条分支发送,可修改下一环节处理人'],
		['ONL', '唯一分支','在多个分支中只能选择一个分支进行发送,可修改下一环节处理人']
	],
	
	
	/** 表单权限  */
	DEFAULT_FORM_CTRL : 'MODIFY',
	FORM_CTRL : [
//		['MODIFY', '修改'],
//		['HIDDEN', '隐藏'],
//		['READONLY', '只读']
		{id : 'MODIFY', name : '修改'},
		{id : 'HIDDEN', name : '隐藏'},
		{id : 'READONLY', name : '只读'}
	],
	

	/** 默认公有表单元素  */
	DEFAULT_FORM_FIELD : {
		'CONTENT' : '【正文】',
		'ATTACHMENT' : '【附件】'
	},
	
	
	/** 流程节点动作 */
	DEFAULT_ACTIONSET : ['00A'],
	ACTIONSET : [
			{id : '00A', name : '消息提醒'},
			{id : '00B', name : '归档'},
			{id : '00C', name : '成文'},
			{id : '00D', name : '盖章'},
			{id : '00E', name : '自动归档'},
			{id : '00F', name : '加签'},
			{id : '00G', name : '联合发文'},
			{id : '00P', name : '打印'},
			{id : '00R', name : '待阅'},
			{id : '00S', name : '分发'},
			{id : '00X', name : '设置督办人'},
			{id : '00H', name : '串行'},
			{id : '00T', name : '转办'}
			
	],
	ACTIONSET_OUT : ['00A','00B','00C','00D','00E','00F','00G','00P','00R','00S','00X','00H','00T'], //发文动作
	ACTIONSET_IN : ['00A','00B','00D','00F','00E','00R','00G','00X','00H','00T'], //收文动作
	ACTIONSET_AFFAIR : ['00A','00B','00F','00E','00G','00X','00H','00T'], //审批动作
	ACTIONSET_START : ['00A','00C','00D','00G'], //开始节点动作
	ACTIONSET_NORMAL : ['00A','00B','00C','00D','00F','00G','00P','00R','00S','00X','00H','00T'], //普通节点动作
	ACTIONSET_END : ['00E'], //结束节点动作
	
	
	/** 提醒方式  */
	MSG_ACTION : '00A',
	DEFAULT_MSG_METHOD : ['00A','00B'],
	MSG_METHOD : [
		{id : '00A', name : '短信通知'},
		{id : '00B', name : '手机推送'}
//		{id : '00C', name : '工作动态'},
	],
	
	
	/** 执行人- 组织类型  */
	ORGUNIT_TYPE : {
		DEPT : '00A',
		GROUP : '00B',
		POST : '00C'
	},
	
	
	/** 任务分配方式 */
	DEFAULT_DISTRIBUTE_TYPE : '00A',
	DISTRIBUTE_TYPE : [
		['00A','系统自动分配'],
		['00B','上一环节人指定']
	],
	
	
	/** 过期处理类型 */
	DEFAULT_OVER_DUE : '00A',
	OVER_DUE : [
		['00A', '自动发催办']
	],
	
	
	/** 流程节点状态  */
	ACTIVITY_STATE : {
		UNSTART : '00A', //未分配
		DOING : '00B', //办理中
		END : '00C', //办结
		BACK : '00D', //已回退
		BEBACK : '00E', //被回退
		NOTICE_TODO : '00N',		//通知待阅
		NOTICE_DONE : '00M'		  //通知已阅
	},
	
	/** 流程节点办理状态  */
	DEAL_STATE : {
		WAITING : '00A', //未分配
		DONG : '00B',	  //办理中
		DONE : '00C',		  //办结
		BACK : '00D',		  //已回退
		BEBACK : '00E',		  //被回退
		NOTICE_TODO : '00N',		//通知待阅
		NOTICE_DONE : '00M'		  //通知已阅
	},
	
	/** 流转条件  */
	DEFAULT_CONDITION : 'all',
	CONDITION : {
		ANY : 'any',
		ALL : 'all',
		OTHER : 'other'	
	},
	

	/** 定时启动  */
	TIMER_START_PERIODTIME : '00A', //周期
	TIMER_START_SCHEDULEE : '00B', //定时
	 
	
	/** 分发类型  */
	DEFAULT_BIZ_TYPE : '阅读',
	BIZ_TYPE : [
		{type : '000', name : '阅读'},
		{type : '000', name : '知会'},
		{type : '000', name : '审批'}
	],
	
	
	/** 得到指定ID的活动的执行状态 */
	getExecuteActivityState : function(id) {
		for (var i = 0; i < this.execute_activities.length; i++) {
			if (this.execute_activities[i].id == id) return this.execute_activities[i].state;
		}
	},
	
	
	addForm : function(type, id, name) {
		Workflow.forms[Workflow.forms.length] = {formType : type, formId : id, formName : name};
	},
	
	addBizType : function(_name, _type) {
		Workflow.BIZ_TYPE[Workflow.BIZ_TYPE.length] = {name : _name, type : _type};
	},
	
	/** 公用链接  */
	RUNNER_URL : '../sys/select-user.do',
	HANDLER_URL : '../workflow/workflow-template!getMainHandler.do',
	DEAL_FIRST_URL : '../workflow/workflow-template!dealFirst.do',
	FORM_LIST_URL : '../form/form-info!getFormInfoListAjax.do?formType=',
	FIELD_LIST_URL : '../workflow/workflow-template!getFormFieldJson.do',
    DOC_CLASSIFY_LIST_URL: '../doc/doc-classify!getDocClassifyListAjax.do?docType='
};

Workflow.getID = function(){
	return Workflow.ID++;
}
