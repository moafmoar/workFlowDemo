/**
 * 属性窗口组建
 */
AttributeWin = function(){
	var __this = this;
	this.model = null;
	this.formData = []; // 存储表单元素数组数据
	this.forms = [];
	this.runner = {};
	this.dealFirst = [];
	this.mainHandler = {};
    this.workfolwType = null;

	Ext.form.Field.prototype.msgTarget = 'side';    
    //当前支持的流程类型
	var processStore = Workflow.PROCESS_TYPE_D;
	if(Ext.getDom("templateType") && Ext.getDom("templateType").value == Workflow.PROCESS_TYPE_AFFIR){
		processStore = Workflow.PROCESS_TYPE_A;
        this.workfolwType = Workflow.PROCESS_TYPE_AFFIR;
	}
    var _processName = {
        fieldLabel : '流程名称',
        name : 'processName',
        width : 200,
        allowBlank : false,
        blankText : '流程名称不能为空',
        maxLength : 256,
        maxLengthText : "输入内容不能超过256个字符",
        value : '流程1'
    };
    var _processType = new Ext.form.ComboBox({
        fieldLabel : '流程类型',
        id : 'processType',
        name : 'processType',
        store : new Ext.data.SimpleStore({
            fields : ['id', 'name'],
            data : processStore,
            listeners : {
                load : function() {
                }
            }
        }),
        valueField : 'id',
        displayField : 'name',
        mode : 'local',
        triggerAction : 'all',
        value : '00B',
        editable : false,
        selectOnFocus : true,
        listeners : {
            select: function(leagueCombox, record, index){
                var contentTemplate = Ext.getCmp("docType_template");
                var mainHandler = Ext.getCmp("mainHandler");
                if(Workflow.PROCESS_TYPE_AFFIR == record.get('id')){
                    contentTemplate.enable();
                    mainHandler.disable();
                }else{
                    var docTypeform = Ext.getCmp("docType_form");
                    docTypeform.setValue(true);
                    contentTemplate.setValue(false);
                    contentTemplate.disable();
                    mainHandler.enable();
                    docClassify.store.proxy.conn.url = Workflow.DOC_CLASSIFY_LIST_URL + record.get('id');
                    docClassify.store.reload();
                }
                formInfo.store.proxy.conn.url = Workflow.FORM_LIST_URL + record.get('id');
                formInfo.store.reload();
            }
        }
    });
    
	var formInfo = new Ext.form.ComboBox({
		store : new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
				url : Workflow.FORM_LIST_URL
			}),
			reader : new Ext.data.JsonReader({
				totalProperty : 'totalProperty',
				root : "formlist"
			}, ['id', 'name']),
			listeners : {
				load : function() {
					// 加载完选项后自动赋值
					if (this.getAt(0)) {
						var thisvalue = this.getAt(0).get('id');
						var index = this.find('id', formInfo.getValue());
						if (index == -1) {
							formInfo.setValue(thisvalue);
						}
						__this.updateFormCtrl(null, formInfo.getValue());
					} else {
						formInfo.setValue("");
						__this.updateFormCtrl(null, "");
					}
				}
			}
		}),
		fieldLabel : '关联表单',
		id : 'form',
		name : 'form',
		valueField : 'id',
		typeAhead : true,
		displayField : 'name',
		mode : 'local',
		triggerAction : 'all',
		// value:'default',
		editable : false,
		forceSelection : true,
		selectOnFocus : true,
		listeners : {
			select : function(leagueCombox, record, index) {
				__this.updateFormCtrl(null, record.get('id'));
			}
		}
	});

	var template = new Ext.form.ComboBox({
		store : new Ext.data.SimpleStore({
			fields : ['id', 'name'],
			data : Workflow.TEMPLATE
		}),
		fieldLabel : '正文模板',
		id : 'template',
		name : 'template',
		valueField : 'id',
		typeAhead : true,
		displayField : 'name',
		mode : 'local',
		triggerAction : 'all',
		// value:'default',
		editable : false,
		forceSelection : true,
		selectOnFocus : true
	});

	var docTypeSelect = function(checkbox, checked) {
		if (checkbox.inputValue == Workflow.DOC_TYPE_FORM) {
			if (checked) {
				formInfo.enable();
				template.disable();
			} else {
				formInfo.disable();
				template.enable();
			}
			__this.updateFormCtrl(null, formInfo.getValue());
		} else {
			if (checked) {
				formInfo.disable();
				template.enable();
			} else {
				formInfo.enable();
				template.disable();
			}
			__this.updateFormCtrl(null, "");
		}
	}
	var docType = {
		xtype : 'radiogroup',
		fieldLabel : '',
		labelSeparator : '',
		name : 'docType',
		items : [{
			xtype : "radio",
			boxLabel : '关联表单',
			name : "docTypeRadio",
			id : "docType_form",
			inputValue : Workflow.DOC_TYPE_FORM,
			allowBlank : false,
			listeners : {
				check : docTypeSelect
			}
		}, {
			xtype : "radio",
			boxLabel : '正文模板',
			id : "docType_template",
			name : "docTypeRadio",
			disabled : true,
			inputValue : Workflow.DOC_TYPE_TEMPLATE,
			allowBlank : false,
			listeners : {
				check : docTypeSelect
			}
		}]
	};
    //公文分类
    var docClassify = new Ext.form.ComboBox({
		store: new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({
				url : Workflow.DOC_TYPE_LIST_URL
			}),
			reader: new Ext.data.JsonReader({
				totalProperty : 'totalProperty',
				root : "docClassifyList"
			}, ['id', 'name']),
			listeners: {
				load: function(){
					// 加载完选项后自动赋值
					if(this.getAt(0)){
						var thisvalue = this.getAt(0).get('id');
						var index = this.find('id', docClassify.getValue());
						if(index == -1){
							docClassify.setValue(thisvalue);
						}
					}else{
						docClassify.setValue("");
					}
				}
			}
		}),
		fieldLabel : '公文类型',
		id : 'docClassify',
		name : 'docClassify',
		valueField : 'id',
		typeAhead : true,
		displayField : 'name',
		mode : 'local',
		triggerAction : 'all',
		editable : false,
		forceSelection : true,
		selectOnFocus : true
	});
    var _mainHandler = new Ext.form.TriggerField({
        fieldLabel : '督办人', // 主办人
        name : 'mainHandler',
        id : 'mainHandler',
        triggerClass : 'x-form-user-trigger',
        allowBlank : true,
        readOnly : true,
        initTrigger : function() {
            this.trigger.on("click", this.onTriggerClick, this, {
                preventDefault : true
            });
        },
        onFocus : function() {
            return false;
        },
        onTriggerClick : function() {
            if(!this.disabled){
                var obj = {},
                    nDialogWidth = 800,
                    nDialogHeight = 450,
                    nLeft = (window.screen.availWidth - nDialogWidth) / 2,
                    nTop = (window.screen.availHeight - nDialogHeight) / 2,
                    sFeatures = "dialogLeft:" + nLeft + "px;dialogTop:"+ nTop +"px;dialogHeight:"+ nDialogHeight +"px;dialogWidth:" + nDialogWidth +"px;help:no;status:yes;scroll:no;",
                    parameters = 'width='+ nDialogWidth +',height='+ nDialogHeight +',top=' + nTop + ',left=' + nLeft +',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no';
                if(typeof window.showModalDialog != "undefined"){
                    obj.userList = __this.mainHandler.id ? __this.mainHandler.id : "";
                    obj.userNames = __this.mainHandler.name	? __this.mainHandler.name : "";
                    obj.openModel = {
                        hiddenViewer: [1,3, 4,5,6,7],
                        _orgSelect: false, 
                        _depSelect: false,
                        _processSelect: false,
                        _recentSelect: false,
                        _commonSelect: false,
                        _singleSelect: false
                    };
                    window.showModalDialog(Workflow.RUNNER_URL, obj, sFeatures);
                    if(obj.isSave){
                        __this.dealMainHandler(obj);
                    }
                }else{
                    window.openrData = {
                        userList: __this.mainHandler.id ? __this.mainHandler.id : "",
                        userNames: __this.mainHandler.name	? __this.mainHandler.name : "",
                        openModel: {
                            hiddenViewer: [1,3, 4,5,6,7],
                            _orgSelect: false, 
                            _depSelect: false,
                            _processSelect: false,
                            _recentSelect: false, 
                            _commonSelect: false,
                            _singleSelect: false
                        }
                    };
                    window.openrCallback = function(obj){
                        if(obj.isSave){
                            __this.dealMainHandler(obj);
                        }
                    }
                    window.open(Workflow.RUNNER_URL, "main_handler", parameters);
                }
            }
        }
    });
    var _order = {
        xtype : 'numberfield',
        fieldLabel : '序号',
        allowBlank : false,
        blankText : '序号不能为空',
        maxValue : 1000,
        minValue : 0,
        allowDecimals : false, // 允许小数点
        allowNegative : false, // 允许负数
        maxText : "最大不能超过1000",
        name : 'order',
        width : 50
    };
    var _processDesc = {
        fieldLabel : '描述',
        xtype : 'textarea',
        name : 'processDesc',
        maxLength : 2000,
        maxLengthText : "输入内容那个不能超过2000个字符",
        width : '90%',
        height : '100px'
    };
    
	//当前支持的流程类型
	var processAttrItems = null;
	if(this.workfolwType == Workflow.PROCESS_TYPE_AFFIR){        
        processAttrItems = [_processName, _processType, docType, formInfo, template, _mainHandler, _order, _processDesc];
	}else{
        processAttrItems = [_processName, _processType, docClassify, docType, formInfo, template, _mainHandler, _order, _processDesc];
    }
	
    var processAttr = new Ext.Panel({
		title : '流程属性',
		baseCls : 'x-plain',
		id : 'processPanel',
		layout : 'form',
		labelAlign : 'right',
		labelWidth : 75,
		defaults : {
			width : '95%'
		},
		defaultType : 'textfield',
		items : processAttrItems
	});

	var note = new Ext.Panel({
		title : '标注',
		labelAlign : 'right',
		id : 'notePanel',
		// layout: 'form',
		labelWidth : 75,
		// defaults: {width: "95%"},
		items : [{
			layout : 'column',
			border : false,
			defaults : {
				border : false,
				anchor : '85%'
			},
			items : [{
				columnWidth : .5,
				layout : 'form',
				items : [{
					xtype : 'numberfield',
					fieldLabel : '宽',
					allowBlank : false,
					allowDecimals : false, // 允许小数点
					allowNegative : false, // 允许负数
					blankText : '标注宽度不能为空',
					maxValue : 1000,
					maxText : "标注宽度不能大于1000",
					name : 'width',
					arch : '90%'
				}, {
					xtype : 'checkbox',
					fieldLabel : '边框',
					name : 'border'
				}, {
					xtype : 'checkbox',
					fieldLabel : '加粗',
					name : 'bold'
				}]
			}, {
				columnWidth : .5,
				layout : 'form',
				items : [new Ext.app.ColorField({
					fieldLabel : '字体颜色',
					name : 'color',
					width : "90%"
				}), new Ext.app.ColorField({
					fieldLabel : '边框颜色',
					name : 'borderColor',
					width : "90%"
				}), {
					xtype : 'checkbox',
					fieldLabel : '斜体',
					name : 'italic'
				}]
			}]
		}, {
			fieldLabel : '描述',
			xtype : 'textarea',
			name : 'text',
			width : '95%',
			height : '100px'
		}]
	});

	var runnerValue = "【用户】:\n【部门】:\n【群组】:\n【职务】:\n【变量】:\n";

	var selectRunner = function(){
        var obj = {},
            nDialogWidth = 800,
            nDialogHeight = 450,
            nLeft = (window.screen.availWidth - nDialogWidth) / 2,
            nTop = (window.screen.availHeight - nDialogHeight) / 2,
            sFeatures = "dialogLeft:" + nLeft + "px;dialogTop:"+ nTop +"px;dialogHeight:"+ nDialogHeight +"px;dialogWidth:" + nDialogWidth +"px;help:no;status:yes;scroll:no;",
            parameters = 'width='+ nDialogWidth +',height='+ nDialogHeight +',top=' + nTop + ',left=' + nLeft +',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no',
            _model = this.model,
            isUninDoc = false; //是否为联合发文
		__this.actiongroup.items.items.each(function(item){
			if(item.name=='联合发文'){
				isUninDoc = item.checked;
				return false;
			}
		});
        if(typeof window.showModalDialog != "undefined"){
            obj.userList = __this.runner.userList;
            obj.userNames = __this.runner.userNames;
            obj.deptList = __this.runner.deptList;
            obj.deptNames = __this.runner.deptNames;
            obj.postList = __this.runner.postList;
            obj.postNames = __this.runner.postNames;
            obj.groupList = __this.runner.groupList;
            obj.groupNames = __this.runner.groupNames;
            obj.flowvarList = __this.runner.flowvarList;
            obj.flowvarNames = __this.runner.flowvarNames;	
            obj.openModel = {
                hiddenViewer: isUninDoc ? [5,6] : [1,5,6],
                _processSelect: true,
                _recentSelect: false,
                _commonSelect: false
            };
            window.showModalDialog(Workflow.RUNNER_URL, obj, sFeatures);
            if(obj.isSave){
                __this.dealRunner(obj, this.model);
            }
        }else{
            window.openrData = {
                userList: __this.runner.userList,
                userNames: __this.runner.userNames,
                deptList: __this.runner.deptList,
                deptNames: __this.runner.deptNames,
                postList: __this.runner.postList,
                postNames: __this.runner.postNames,
                groupList: __this.runner.groupList,
                groupNames: __this.runner.groupNames,
                flowvarList: __this.runner.flowvarList,
                flowvarNames: __this.runner.flowvarNames,
                openModel: {
                    hiddenViewer: isUninDoc ? [5,6] : [1,5,6],
                    _processSelect: true,
                    _recentSelect: false,
                    _commonSelect: false
                }
            };
            window.openrCallback = function(obj){
                if(obj.isSave){
                    __this.dealRunner(obj, _model);
                }
            };
            window.open(Workflow.RUNNER_URL, "select_runner", parameters);
        }
	};

	var dealFirst = function() {
		var obj = new Object();
		var nDialogWidth = 570;
		var nDialogHeight = 450;
		var nLeft = (window.screen.availWidth - nDialogWidth) / 2;
		var nTop = (window.screen.availHeight - nDialogHeight) / 2;
		var sFeatures = "dialogLeft:" + nLeft + "px;dialogTop:" + nTop
				+ "px;dialogHeight:" + nDialogHeight + "px;dialogWidth:"
				+ nDialogWidth + "px;help:no;status:yes;scroll:no;";

		obj.runner = __this.runner;
		obj.dealFirst = __this.dealFirst;
		window.showModalDialog(Workflow.DEAL_FIRST_URL, obj, sFeatures);
		__this.dealFirst = obj.dealFirst;
	}

	var runner = new Ext.Panel({
		id : 'runnerPanel',
		cls : 'x-plain',
		title : '参与者',
		layout : 'form',
		tbar : [{
			text : '选择参与者',
			tooltip : '选择参与者',
			iconCls : 'user-add',
			handler : selectRunner
		}, {
			id : "dealFirst_btn",
			text : '设置优先级',
			tooltip : '设置优先级',
			iconCls : 'user-add',
			handler : dealFirst
		}],
		defaults : {
			hideLabel : true,
			labelSeparator : ''
		},
		items : [{
			xtype : 'textarea',
			fieldLabel : '参与者',
			readOnly : true,
			name : 'runnerDesc',
			width : '99%',
			value : runnerValue,
			height : 150
		}, {
			xtype : 'label',
			id : 'runnerTips',
			name : 'runnerTips',
			width : '99%',
			text : "",
			height : 80
		}]
	});

	var myData = [];

	var ds = new Ext.data.Store({
		proxy : new Ext.data.MemoryProxy(myData),
		reader : new Ext.data.ArrayReader({}, [{
			name : "code",
			mapping : 0
		}, {
			name : "name",
			mapping : 1
		}])

			// fields : [
			// {name: "code",mapping: 0},
			// {name: "name",mapping: 1}
			// ],
			// data : myData
	});
	this.ds = ds;
	ds.loadData(myData);
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel([sm,// 添加的地方
			{
				id : "code",
				header : "编号",
				dataIndex : "code"
			}, {
				header : "名称",
				dataIndex : "name"
			}]);

	var treadSet = new Ext.grid.GridPanel({
		cls : 'x-plain',
		id : 'treadSetPanel',
		deferRowRender : false, //
		title : '回退节点',
		ds : ds,
		cm : cm,
		sm : sm
			// 添加的地方
	});

	this.treadSet = treadSet;

	var timeSet = new Ext.Panel({
		cls : 'x-plain',
		id : 'timeSetPanel',
		title : '定时设置',
		layout : 'form',
		disabled : true,
		labelWidth : 75,
		defaults : {
			width : "95%",
			hideLabel : true,
			fieldLabel : ''
		},
		items : [new Ext.form.Radio({
			boxLabel : '周期启动',
			name : 'TimeBegin.startType',
			inputValue : Workflow.TIMER_START_PERIODTIME,
			checked : true,
			listeners : {

			}
		}), new Ext.Panel({
			layout : 'column',
			id : "33",
			border : false,
			items : [{
				width : 70,
				layout : 'form',
				border : false,
				items : [new Ext.form.ComboBox({
					hideLabel : true,
					store : new Ext.data.SimpleStore({
						fields : ['id', 'name'],
						data : [['每天', 'D'], ['每周', 'W'], ['每月', 'M'],
								['每年', 'Y']]
					}),
					valueField : 'name',
					name : 'TimeBegin.timeType',
					displayField : 'id',
					mode : 'local',
					value : 'W',
					triggerAction : 'all',
					editable : false,
					selectOnFocus : false,
					width : 50
				})]
			}, {
				width : 30,
				bodyStyle : 'padding:5px;',
				html : "第"
			}, {
				width : 30,
				layout : 'form',
				border : false,
				items : [{
					xtype : 'numberfield',
					hideLabel : true,
					fieldLabel : '',
					name : 'TimeBegin.day',
					allowBlank : false,
					allowDecimals : false, // 允许小数点
					allowNegative : false, // 允许负数
					minValue : 0,
					maxValue : 24,
					minText : '最小0',
					maxText : '最大24',
					blankText : "不能为空",
					width : 30,
					value : '0'
				}]
			}, {
				width : 30,
				bodyStyle : 'padding:5px;',
				html : "天"
			}, {
				width : 30,
				layout : 'form',
				border : false,
				items : [{
					xtype : 'numberfield',
					hideLabel : true,
					fieldLabel : '',
					name : 'TimeBegin.hour',
					allowBlank : false,
					allowDecimals : false, // 允许小数点
					allowNegative : false, // 允许负数
					minValue : 0,
					maxValue : 23,
					minText : '最小0',
					maxText : '最大23',
					blankText : "不能为空",
					width : 30,
					value : '0'
				}]
			}, {
				width : 50,
				bodyStyle : 'padding:5px;',
				html : "时"
			}, {
				width : 30,
				layout : 'form',
				border : false,
				items : [{
					xtype : 'numberfield',
					hideLabel : true,
					name : 'TimeBegin.min',
					allowBlank : false,
					allowDecimals : false, // 允许小数点
					allowNegative : false, // 允许负数
					minValue : 0,
					maxValue : 59,
					minText : '最小0',
					maxText : '最大59',
					blankText : "办理期限不能为空",
					width : 30,
					value : '0'
				}]
			}, {
				width : 100,
				bodyStyle : 'padding:5px;',
				html : "分启动"
			}]
		}), new Ext.form.Radio({
			boxLabel : '定时启动',
			name : 'TimeBegin.startType',
			inputValue : Workflow.TIMER_START_SCHEDULEE,
			listeners : {

			}
		}), new Ext.Panel({
			layout : 'column',
			id : "44",
			border : false,
			items : [{
				width : 140,
				layout : 'form',
				// border : false,
				items : [{
					xtype : 'datefield',
					fieldLabel : '',
					hideLabel : true,
					name : 'TimeBegin.touchDate',
					readOnly : true,
					format : 'Y-m-d',
					value : '',
					width : 100
				}]
			}, {
				width : 140,
				layout : 'form',
				// border : false,
				items : [new Ext.form.TimeField({
					fieldLabel : '',
					hideLabel : true,
					name : 'TimeBegin.touchTime',
					minValue : '00:00',
					maxValue : '23:59',
					value : '',
					format : 'H:i',
					invalidText : '无效的时间格式',
					width : 100
				})]
			}, {
				width : 100,
				bodyStyle : 'padding:5px;',
				html : "分启动"
			}]
		})]
	});
	// 前后置条件
	var condition = new Ext.Panel({
		cls : 'x-plain',
		id : 'condition',
		title : '流转条件',
		items : [{
			xtype : 'fieldset',
			title : '前置条件',
			id : 'forwardCondition',
			autoHeight : true,
			collapsed : false,
			layout : 'column',
			items : [{
				width : 150,
				layout : 'form',// 左边列放列表
				defaults : {
					hideLabel : true
				},
				items : [{
					xtype : 'radiogroup',
					fieldLabel : '',
					name : 'forward',
					items : [{
						xtype : "radio",
						boxLabel : '其中几个节点',
						name : 'forward',
						inputValue : Workflow.CONDITION.OTHER,
						allowBlank : false,
						listeners : {
							check : function(checkbox, checked) {
								var elarray = __this.tabForm
										.findByType('numberfield');
								for (var i = 0; i < elarray.length; i++) {
									if (elarray[i].name == 'fwCount') {
										elarray[i].setDisabled(!checked);
									}
								}
							}
						}
					}, {
						xtype : "radio",
						boxLabel : '全部节点完成',
						name : 'forward',
						inputValue : Workflow.CONDITION.ALL,
						allowBlank : false,
						checked : true
					}, {
						xtype : "radio",
						boxLabel : '任意一节点完成',
						name : 'forward',
						inputValue : Workflow.CONDITION.ANY,
						allowBlank : false
					}]
				}]
			}, {
				columnWidth : 1,
				layout : 'form',// 左边列放列表
				defaults : {
					hideLabel : true
				},
				items : [{
					xtype : "numberfield",
					id : 'fwCount',
					name : 'fwCount',
					allowDecimals : false, // 允许小数点
					allowNegative : false, // 允许负数
					minValue : 1,
					minText : '最小1',
					maxValue : 1000,
					maxText : "最大1000",
					allowBlank : false,
					disabled : true
				}]
			}]
		}, {
			xtype : 'fieldset',
			title : '后置条件',
			id : 'behideCondition',
			autoHeight : true,
			collapsed : false,
			layout : 'column',
			items : [{
				// columnWidth : 0.5,
				width : 150,
				layout : 'form',// 左边列放列表
				defaults : {
					hideLabel : true
				},
				defaultType : 'textfield',
				items : [{
					xtype : 'radiogroup',
					fieldLabel : '',
					name : 'behide',
					items : [{
						xtype : "radio",
						boxLabel : '其中几个参与者',
						name : 'behide',
						inputValue : Workflow.CONDITION.OTHER,
						allowBlank : false,
						listeners : {
							check : function(checkbox, checked) {
								var elarray = __this.tabForm
										.findByType('numberfield');
								for (var i = 0; i < elarray.length; i++) {
									if (elarray[i].name == 'bhCount') {
										elarray[i].setDisabled(!checked);
									}
								}
							}
						}
					}, {
						xtype : "radio",
						boxLabel : '全部参与者完成',
						name : 'behide',
						inputValue : Workflow.CONDITION.ALL,
						allowBlank : false,
						checked : true
					}, {
						xtype : "radio",
						boxLabel : '任意一参与者完成',
						name : 'behide',
						inputValue : Workflow.CONDITION.ANY,
						allowBlank : false
					}]
				}]
			}, {
				columnWidth : 1,
				layout : 'form',// 左边列放列表
				defaults : {
					hideLabel : true
				},
				items : [{
					xtype : "numberfield",
					name : 'bhCount',
					allowDecimals : false, // 允许小数点
					allowNegative : false, // 允许负数
					minValue : 1,
					minText : '最小1',
					maxValue : 1000,
					maxText : "最大1000",
					allowBlank : false,
					disabled : true
				}]
			}]
		}]
	});
    
    //表达式
	var expression = new Ext.Panel({
		id : 'expression',
		title : '表达式'
    });
    this.expression = expression;

	var formCtrl = {
		title : '表单权限',
		id : 'formCtrlPanel',
		layout : 'form',
		labelAlign : 'right',
		labelWidth : 50,
		defaults : {
			width : 100
		},
		contentEl : 'formCtrlDiv'
			// items: [
			// ]
	};

	this.formCtrl = formCtrl;
	this.initFormCtrl();

	// 提醒方式
	var msgmethod = new Ext.form.CheckboxGroup({
		fieldLabel : '提醒方式',
		name : 'msgmethod',
		itemCls : 'x-check-group-alt',
		// columns: 4,
		vertical : true,
		items : []
	});
	var msgMethodList = Workflow.MSG_METHOD;
	for (var i = 0; i < msgMethodList.length; i++) {
		var checkbox = new Ext.form.Checkbox({
            boxLabel : msgMethodList[i].name,
            name : msgMethodList[i].name,
            inputValue : msgMethodList[i].id
        });
		msgmethod.items.push(checkbox);
	}

	// 分支类型
	var splittype = new Ext.form.ComboBox({
		fieldLabel : '分支类型',
		store : new Ext.data.SimpleStore({
			fields : ['id', 'name','title'],
			data : Workflow.SPLIT_TYPE
		}),
		valueField : 'id',
		name : 'splitType',
		displayField : 'name',
		mode : 'local',
		value : 'XOR',
		triggerAction : 'all',
		editable : false,
		selectOnFocus : false,
		width : 100,
	  	listeners: {
            select: function(combo, record , index){
                var label = Ext.getCmp("splittypeLabelId");
                if(label){
                    label.setText(Workflow.SPLIT_TYPE[index][2]);
                }
            }
		}
	});
	
	var splittypeLabel = new Ext.form.Label({
		 fieldLabel : '分支说明',
		 id : 'splittypeLabelId',
		 text : Workflow.SPLIT_TYPE[0][2],
		 cls:'x-form-item-tips',
		 height:30
	});

	var items = [];

	var actions = Workflow.ACTIONSET;
	for (var i = 0; i < actions.length; i++) {
		if(actions[i].id=='00R'){//如果没有开启公文待阅功能，则隐藏待阅选项
			if(Ext.getDom('isDocRead') && Ext.getDom('isDocRead').value=='false'){
				continue;
			}
		}
		var checkbox = new Ext.form.Checkbox({
            boxLabel : actions[i].name,
            id: "action_"+ actions[i].id,
            name : actions[i].name,
            inputValue : actions[i].id,
            // hidden : true,
            handler: function(){
                var _value = this.inputValue;
                if(_value == Workflow.MSG_ACTION){
                    if(this.checked){
                        msgmethod.setDisabled(false);
                    }else{
                        msgmethod.setDisabled(true);
                        for(var i = 0, len = msgmethod.items.items.length; i < len; i++){
                            msgmethod.items.items[i].setValue(false);
                        }
                    }
                }
                //串行和加签、转办互斥
                if(_value == "00H"){                    
                    var action_00F = Ext.getCmp("action_00F"),
                        action_00T = Ext.getCmp("action_00T"),
                        action_enback = Ext.getCmp("action_enback");
                    if(this.checked){
                        if(action_00F){
                            action_00F.setValue(false);
                            action_00F.setDisabled(true);
                        }
                        if(action_00T){
                            action_00T.setValue(false);
                            action_00T.setDisabled(true);
                        }
                        if(action_enback){
                            action_enback.setValue(false);
                            action_enback.setDisabled(true);
                        }
                    }else{
                        if(action_00F){
                            action_00F.setDisabled(false);
                        }
                        if(action_00T){
                            action_00T.setDisabled(false);
                        }
                        if(action_enback){
                            action_enback.setDisabled(false);
                        }
                    }
                }
                //转办和串行互斥
                if(_value == "00T"){              
                    var action_00H = Ext.getCmp("action_00H");
                    if(this.checked){
                        if(action_00H){
                            action_00H.setValue(false);
                            action_00H.setDisabled(true);
                        }
                    }else{
                        if(action_00H){
                            action_00H.setDisabled(false);
                        }
                    }
                }
            }
        });
		items.push(checkbox);
	}
	// 初始化动作
	this.actiongroup = new Ext.form.CheckboxGroup({
		fieldLabel : '动作',
		name : 'ActionSet',
		itemCls : 'x-form-check-group',
		columns : 3,
		vertical : false,
		items : items
	});

	var startTypeSelect = function(checkbox, checked) {
		if (checkbox.inputValue == '00A') {
			if (checked) {
				runner.setDisabled(false);
				timeSet.setDisabled(true);
			} else {
				runner.setDisabled(true);
				timeSet.setDisabled(false);
			}
		}
	}
	
	//可回退单击事件
	var canBackSelect = function() {
		if (this.checked) {
			treadSet.setDisabled(false);
		} else {
			treadSet.setDisabled(true);
		}
	}

	var baseMsg = new Ext.Panel({
		title : '基本信息',
		id : 'baseMsgPanel',
		layout : 'form',
		labelAlign : 'right',
		labelWidth : 75,
		autoHeight : true,
		defaultType : 'textfield',
		defaults : {
			anchor : '85%'
		},

		items : [{
			fieldLabel : '编号',
			name : 'activityCode',
			// hideMode:'offsets',
			readOnly : true,
			allowBlank : false,
			value : '0'
		}, {
			fieldLabel : '名称',
			name : 'activityName',
			allowBlank : false,
			blankText : "流程名称不能为空",
			maxLength : 128,
			maxLengthText : "输入内容不能超过128个字符",
			value : '普通节点'
		},
        // {
        // xtype: 'numberfield',
        // fieldLabel: '办理时限',
        // name: 'limit',
        // allowBlank : false,
        // blankText : "办理期限不能为空",
        // width:200,
        // value: '0'
        // },
        /*new Ext.Panel({
            layout : 'column',
            id : "limit",
            border : false,
            items : [{
                columnWidth : .5,
                layout : 'form',
                border : false,
                items : [{
                    xtype : 'numberfield',
                    fieldLabel : '办理时限',
                    name : 'limit.day',
                    allowBlank : false,
                    allowDecimals : false, // 允许小数点
                    allowNegative : false, // 允许负数
                    blankText : "办理期限不能为空",
                    minValue : 0,
                    maxValue : 365,
                    minText : '最小0',
                    maxText : '最大365',
                    width : 200,
                    value : '0',
                    anchor : '80%' // 上级容器宽度的百分比,即此控件的宽度
                }]
            }, {
                columnWidth : .1,
                bodyStyle : 'padding:5px;',
                html : "天:"
            }, {
                columnWidth : .3,
                layout : 'form',
                border : false,
                items : [{
                    xtype : 'numberfield',
                    hideLabel : true,
                    fieldLabel : '办理时限',
                    name : 'limit.hour',
                    allowBlank : false,
                    allowDecimals : false, // 允许小数点
                    allowNegative : false, // 允许负数
                    minValue : 0,
                    maxValue : 24,
                    minText : '最小0',
                    maxText : '最大24',
                    blankText : "办理期限不能为空",
                    width : 200,
                    value : '0',
                    anchor : '80%' // 上级容器宽度的百分比,即此控件的宽度
                }]
            }, {
                columnWidth : .1,
                bodyStyle : 'padding:5px;',
                html : "小时"
            }]
        }),*/
        // 移除定时启动功能 2014.5.5 huangt
        // {
        // 	xtype : 'radiogroup',
        // 	fieldLabel : '启动',
        // 	name : 'startType',
        // 	items : [{
        // 		boxLabel : '人工启动',
        // 		name : 'startType',
        // 		inputValue : '00A',
        // 		listeners : {
        // 			check : startTypeSelect
        // 		},
        // 		checked : true
        // 	}, {
        // 		boxLabel : '定时启动',
        // 		name : 'startType',
        // 		inputValue : '00B'
        // 	}]
        // },
        /*splittype,
        splittypeLabel,
        {
            xtype : 'checkboxgroup',
            name : "backOrRecycle",
            fieldLabel : '',
            labelSeparator : '',
            itemCls : 'x-check-group-alt',
            vertical : true,
            items : [{
                boxLabel : '可回退',
                id: "action_enback",
                name : 'canBack',
                inputValue : 'canBack',
                listeners : {
                    check : canBackSelect
                },
                checked : true
            },{
                boxLabel : '可回收',
                name : 'canRecycle',
                hidden : true,
                inputValue : 'canRecycle'
            }]
        },*/
        /*new Ext.form.ComboBox({
            fieldLabel : '过期处理',
            store : new Ext.data.SimpleStore({
                fields : ['id', 'name'],
                data : Workflow.OVER_DUE
            }),
            valueField : 'id',
            name : 'Overdue',
            displayField : 'name',
            mode : 'local',
            triggerAction : 'all',
            editable : false,
            selectOnFocus : false
        }),*/
        this.actiongroup, msgmethod]
	});
	this.baseMsg = baseMsg;

	var tabpanel = new Ext.TabPanel({
		deferredRender : false,
		autoHeight : false,
		activeTab : 0,
		defaults : {
			autoHeight : false,
			bodyStyle : 'padding:10px;',
			autoScroll : true
		},
		items : [processAttr, note, this.baseMsg, this.formCtrl, runner,
				timeSet, this.treadSet, condition, expression]
	});

	var tabForm = new Ext.FormPanel({
		border : false,
		frame : true,
		layout : 'fit',
		items : [tabpanel]
	});
    
	this.tabpanel = tabpanel;
	this.tabForm = tabForm;
	this.form = tabForm.getForm();

	this.Win = new Ext.Window({
		layout : 'fit',
		title : '属性窗口',
		width : 550,
		height : 450,
		resizable : true,
		closeAction : 'hide',
		wait : true,
		modal : true,
		plain : true,
		applyTo : 'attributeWin',
		items : tabForm,
		buttons : [{
			text : '确定',
			handler : function() {
				var attribute = __this.model.getAttributes();
				var valid = true;// 表单校验 重新实现了下form的isValid
				__this.form.items.each(function(f) {
					try {
						var field = eval("attribute." + f.getName());
						if ((typeof field) == 'undefined') {

						} else {
							if (!f.validate()) {
								valid = false;
							}
						}
					} catch (e) {
					}
				});
				if (!valid) {
					return valid;
				}

				__this.saveValue("", __this.model.getAttributes());

				// 保存主办人
				if (__this.model.setMainHandler) {
					__this.model.setMainHandler(__this.mainHandler);
				}
				// 保存执行人
				if (__this.model.getRunner != null) {
					__this.model.setRunner(__this.runner);
				}
				// 保存执行人
				if (__this.model.setDealFirst != null) {
					__this.model.setDealFirst(__this.dealFirst);
				}

				// 保存表单权限
				if (__this.model && __this.model.getFormCtrl) {
					__this.model.setFormCtrl(__this.getFormCtrl())
				}

				// 保存跳转节点
				if (__this.model && __this.model.getTreadSet) {
					__this.model.setTreadSet(__this.getTreadSet())
				}

				// 保存启动类型
				if (__this.model && __this.model.getTimeBegin) {
					__this.model.getTimeBegin().startType = __this
							.getBeginStartType();
				}
                
                //保存表达式
                if(__this.model && __this.model.updateExpressions){
                    __this.model.updateExpressions();
                }

				__this.form.reset();
				__this.model.update();
				__this.hidden();
			}
		}, {
			text : '取消',
			handler : function() {
				__this.form.reset();
				__this.hidden();
			}
		}]
	});
}

Ext.extend(AttributeWin, Ext.util.Observable, {
	setWorkflowModel : function(model) {
		this.WorkflowModel = model;
		//如果是从向导设计模式,不允许修改流程类型及表单数据
		if(model.isGuide()){
			Ext.getCmp("processType").disable();	
			Ext.getCmp("docType_template").disable();
			Ext.getCmp("docType_form").disable();
			var data = {
				formlist :[{
			           id : model.getForm(),
			           name : model.getName()
				}]
			};
			Ext.getCmp("form").clearValue();
			Ext.getCmp("form").store.loadData(data);
		}else{
			var contentTemplate = Ext.getCmp("docType_template"),
                docClassify = null;
			if(Workflow.PROCESS_TYPE_AFFIR == model.getType()){
				contentTemplate.enable();
			}else{
			    docClassify = this.form.findField("docClassify");
                if(docClassify){
                    docClassify.setValue(model.getDocClassify());
                    docClassify.store.proxy.conn.url = Workflow.DOC_CLASSIFY_LIST_URL + model.getType();
				    docClassify.store.reload();
                }
            }
			//提前初始好选择表单下拉框，因为要先初始表单元素，所以提前给表单赋值
			var formInfo = this.form.findField("form");
			if(formInfo){
                formInfo.setValue(model.getForm());	
				formInfo.store.proxy.conn.url = Workflow.FORM_LIST_URL + model.getType();
				formInfo.store.reload();
			}
		}
	},
	show : function(model) {	
		this.Win.show();
		if (!model || model.length == 0) {
			this.model = this.WorkflowModel;
			this.tabpanel.hiddenTab([1, 2, 3, 4, 5, 6, 7], 0);
		} else {
			this.model = model[0];
			this.runner = {};
			if (this.model.getRunner) {
				this.runner = this.model.getRunner();
				this.setRunnerDescValue(this.runner);
				this.setRunnerTips(this.model);
			}
			this.dealFirst = [];
			if (this.model.getDealFirst) {
				this.dealFirst = this.model.getDealFirst();
				//3.20薛霞，参与者优先级先隐藏，后期流程优化中去实现
				//Ext.getCmp('dealFirst_btn').show();
				Ext.getCmp('dealFirst_btn').hide();
			} else {
				Ext.getCmp('dealFirst_btn').hide();
			}
			if (this.model && this.model.type) {
				var type = this.model.type;
			 
				this.initActiongroup(type);
				if (type == 3) {
					//this.tabpanel.hiddenTab([0, 1, 6, 7], 2);
					// 移除定时启动功能 2014.5.5 huangt
					this.tabpanel.hiddenTab([0, 1, 5,6, 7], 2);
				} else if (type == 11) {
					this.tabpanel.hiddenTab([0, 1, 5], 2);
				} else if (type == 5) {
					this.tabpanel.hiddenTab([0, 1, 3, 4, 5, 6], 2);
				} else if (type == 15) {
					this.tabpanel.hiddenTab([0, 2, 3, 4, 5, 6, 7], 1);
				}
			}
		}

		this.showCondition();
        this.showExpression();

		if (this.model && this.model.getFormCtrl && this.model.getFormCtrl()) {
			this.setFormCtrl(this.model.getFormCtrl());
		}
		this.fieldRight(this.model.getAttributes());

		if (this.model && this.model.getTreadSet) {
			this.loadTreadSet(this.ds, this.model, this.TreadSet);
		}

		if (this.model && this.model.getTreadSet && this.model.getTreadSet()) {
			this.setTreadSet(this.model.getTreadSet());
		}
		this.setMainHandler(this.model);
		this.loadValue(this.model);
		this.tabpanel.doLayout();
	},
	hidden : function() {
		this.Win.hide();
	},
	loadValue : function(model) {
		this.setValues("", model.getAttributes())
	},
	loadTreadSet : function(ds, model, treadSet) {
		var mydata = [];
		if (model.getTreadSetForNode) {
			var TreadSet = model.getTreadSetForNode(null, null);
			TreadSet.each(function(activity) {
				mydata[mydata.length] = [activity.getActivityCode(),
						activity.getActivityName()];
			});
		}
		ds.loadData(mydata);

	},
	//初始化表单权限
	fieldRight : function(attribute) {
		this.baseMsg.items.each(function(items) {
			var item = items.getEl().findParent(".x-form-item");
			if (item) {
				item.style.display = "";
			} else {
				items.show();
			}
			if (items.getId || items.getName) {
				var field = null;
				if (items.getName && items.getName()) {
					field = eval("attribute." + items.getName());
				} else if (items.getId && items.getId()) { // 就为了加办理期限的单位加的
					field = eval("attribute." + items.getId());
				}
				if ((typeof field) == 'undefined' && items.hide) {
					// items.hideLabel = true;
					// items.hide();
					var item = items.getEl().findParent(".x-form-item");
					if (item) {
						item.style.display = "none";
					} else {
						items.hide();
					}
					// .dom.parentNode.parentNode.style.display = "none";
				}
			}

		});
	},
	//组件到对象的赋值
	save : function() {
		var __this = this.form;
		var values = this.model.getAttributes();
		var field, id;
		for (id in values) {
			if ((typeof values[id]).indexOf('object') >= 0
					|| Ext.isArray(values[id])) {
				this.setValues(id, values[id]);
			} else if (typeof values[id] != 'function'
					&& (field = __this.findField(id))) {
				values[id] = field.getValue();
			}
		}
		this.model.update();

	},
	saveValue : function(name, values) {

		var __this = this.form;
		var par = (name != '' && name != null) ? (name + '.') : '';
		if (Ext.isArray(values)) {
			for (var i = 0, len = values.length; i < len; i++) {
				var v = values[i];
				if (typeof v != 'function' && typeof v != 'object') {
					var f = __this.findField(name);
					if (f) {
						return f.getValue();
					}
				} else {
					var f = __this.findFieldLike(par);
					var arrvalue = [];
					if (f) {
						f.each(function(c) {
							// if(c.isFormField && c.getName() == (par+id)){
							arrvalue[arrvalue.length] = {
								id : c.getName().replace(par, ""),
								value : c.getValue()
							};
								// }
							});
					}
					return arrvalue;
				}
			}
		} else {
			var field, id;
			for (id in values) {
				if ((typeof values[id]).indexOf('object') >= 0
						&& !Ext.isArray(values[id]) && !Ext.isDate(values[id])) {
					values[id] = this.saveValue(id, values[id]);
				} else if (typeof values[id] != 'function'
						&& (field = __this.findField(par + id))) {
					values[id] = field.getValue();
				}
			}
			return values;
		}
		// return this;
	},
	//对象到组件的赋值
	setValues : function(name, values) {
		var __this = this.form;
		var par = (name != '' && name != null) ? (name + '.') : '';
		if (Ext.isArray(values)) {
			for (var i = 0, len = values.length; i < len; i++) {
				var v = values[i];

				var f = __this.findField(name);
				if (f) {
					f.setValue(values);
				} else {
					var f = __this.findField(par + v.id);
					if (f) {
						f.setValue(v.value);
					}
				}
			}
		} else {
			var field, id;
			for (id in values) {
				if ((typeof values[id]).indexOf('object') >= 0
						&& !Ext.isArray(values[id]) && !Ext.isDate(values[id])) {
					this.setValues(id, values[id]);
				} else if (typeof values[id] != 'function'
						&& (field = __this.findField(par + id))) {
					if(id == "splitType"){
					    var sType,label,labelValue;
					    sType = values[id];
					    if(sType == Workflow.SPLIT_TYPE_XOR){
					        labelValue = Workflow.SPLIT_TYPE[1][2];
					    }else if(sType == Workflow.SPLIT_TYPE_ONLY){
					        labelValue = Workflow.SPLIT_TYPE[2][2];
					    }else{
					        labelValue = Workflow.SPLIT_TYPE[0][2];
					    }
					    
					    label = Ext.getCmp("splittypeLabelId");
						if(label){
							label.setText(labelValue);
						}
				    }
				    field.setValue(values[id]);
				}
			}
		}
		return this;
	},
	dealRunner : function(obj, activity) {
		if (!obj)
			return;
		// if (!activity) return;

		this.runner.userList = '';
		this.runner.userNames = '';
		this.runner.postList = '';
		this.runner.postNames = '';
		this.runner.deptList = '';
		this.runner.deptNames = '';
		this.runner.groupList = '';
		this.runner.groupNames = '';
		this.runner.flowvarList = '';
		this.runner.flowvarNames = '';
		
		if (obj.userList) {
			/*
			if(obj.userList.indexOf('_')!=-1){
				obj.userList = obj.userList.substring(obj.userList.lastIndexOf('_')+1 );
			}*/
			this.runner.userList = obj.userList;
			this.runner.userNames = obj.userNames;
		}
		if (obj.postList) {
			this.runner.postList = obj.postList;
			this.runner.postNames = obj.postNames;
		}
		if (obj.deptList) {
			if(obj.deptList.indexOf('_')!=-1){
				obj.deptList = obj.deptList.substring(obj.deptList.lastIndexOf('_')+1 );
			}
			this.runner.deptList = obj.deptList;
			this.runner.deptNames = obj.deptNames;
		}
		if (obj.groupList) {
			this.runner.groupList = obj.groupList;
			this.runner.groupNames = obj.groupNames;
		}
		if (obj.flowvarList) {
			this.runner.flowvarList = obj.flowvarList;
			this.runner.flowvarNames = obj.flowvarNames;
		}
		this.setRunnerDescValue(obj);
	},
	setRunnerDescValue : function(obj) {
		if (!obj)
			return;

		obj.userNames = obj.userNames ? obj.userNames : '';
		obj.deptNames = obj.deptNames ? obj.deptNames : '';
		obj.postNames = obj.postNames ? obj.postNames : '';
		obj.groupNames = obj.groupNames ? obj.groupNames : '';
		obj.flowvarNames = obj.flowvarNames ? obj.flowvarNames : '';

		var field = null;
		if (field = this.form.findField('runnerDesc')) {
			// field.setValue(obj.runnerDesc);
			field.setValue('【用户】：' + obj.userNames + '\n' + '【部门】：'
					+ obj.deptNames + '\n' + '【职务】：' + obj.postNames + '\n'
					+ '【群组】：' + obj.groupNames + '\n' + '【变量】：'
					+ obj.flowvarNames);
		}
	},

	setRunnerTips : function(model) {
		if (model.getActivityCode) {
			var cmp = Ext.getCmp("runnerTips");
			if (0 == model.getActivityCode()) {
				cmp
						.setText(
								"<br>&nbsp;&nbsp;&nbsp;&nbsp;<font color='red'>该节点为开始节点,参与者为空,则所有人可以启动该流程，若不为空,则只有参与者能启动该流程</font>",
								false);
			} else {
				cmp
						.setText(
								"<br>&nbsp;&nbsp;&nbsp;&nbsp;<font color='red'></font>",
								false);
			}
		}
	},

	dealMainHandler : function(obj) {
		var field = null;
		if (field = this.form.findField('mainHandler')) {
			field.setValue(obj.userNames);
		}
		this.mainHandler = {
			id : obj.userList,
			name : obj.userNames
		};
	},
	setMainHandler : function(model) {
		if (model.getMainHandler != null) {
			this.mainHandler = model.getMainHandler();
			var field = null;
			if (field = this.form.findField('mainHandler')) {
				field.setValue(this.mainHandler.name);
			}
		}
	},
	// 初始化表单权限面板显示
	initFormCtrl : function() {
		var formctrl = Workflow.FORM_CTRL;
		var formctel = Ext.getDom('formCtrlDiv');
		var tb = document.createElement("table");
		tb.className = "formCtrlTab";
		tb.setAttribute("style","width:99%");
		formctel.appendChild(tb);
		var chgAllRadio = function(v) {
			var inputs = $$('input[type="radio"]');
			inputs.each(function(input) {
				if (input.value == v)
					input.click();
			});
		};

		// 初始化各个元素
		var row = tb.insertRow(-1);
		row.className = "x-grid3-header";
		row.style.backgroundColor = '#FFFFFF';
		var td = row.insertCell(-1);
		td.width = "100px";
		td.innerHTML = "表单元素";
		td.align = "center";
		formctrl.each(function(o) {
			td = row.insertCell(-1);
			td.width = "50px";
			td.align = "center";
			td.innerHTML = o.name;
			td.onclick = function() {
				chgAllRadio(o.id);
			}
		});
	},
	// 根据formid获取表单元素
	getFormData : function(formId) {
		try {
			var fieldlist = [];
			dwr.engine.setAsync(false);
			formInfoAjax.getFormElementList(formId, function(fields) {
				if(fields){
					for (var i = 0; i < fields.length; i++) {
						fieldlist[fieldlist.length] = fields[i];
					}
				}
			});
			dwr.engine.setAsync(true);
		} catch (e) {
			alert('初始化表单权限失败')
		}
		return fieldlist;
		
	},
	updateFormCtrl : function(formdata, formId) {
		if (formId && formId != this.WorkflowModel.getForm()) {
			this.WorkflowModel.clearAllFormCtrl();
		}
		var formctrl = Workflow.FORM_CTRL;

		var formctel = Ext.getDom('formCtrlDiv');
		var tb = formctel.children[0];
		// 删除已有行
		for (var i = tb.firstChild.childNodes.length - 1; i > 0; i--) {
			tb.firstChild.removeChild(tb.firstChild.childNodes[i]);
		}
		// 初始化各个元素
		var fieldlist = [];
		if (formdata && formdata.length > 0) {
			fieldlist = formdata;
		} else {
			fieldlist = this.getFormData(formId);
		}
		for (var i = 0; i < fieldlist.length; i++) {
			var field = fieldlist[i];
			var row = tb.insertRow(-1);
			row.style.backgroundColor = '#FFFFFF';
			var td = row.insertCell(-1);
			if (Workflow.DEFAULT_FORM_FIELD[field]) {
				td.innerHTML = Workflow.DEFAULT_FORM_FIELD[field];
			} else {
				td.innerHTML = field;
			}
			td.align = "center";
			formctrl.each(function(o) {
				td = row.insertCell(-1);
				td.align = "center";
				if (o.id == 'MODIFY') {
					td.innerHTML = '<input type="radio" form="' + field
							+ '" name="FormCtrl.' + field + '" value="' + o.id
							+ '" style="border:1px;" checked/>';
				} else {
					td.innerHTML = '<input type="radio" form="' + field
							+ '" name="FormCtrl.' + field + '" value="' + o.id
							+ '" style="border:1px;"/>';
				}
			});
		}
		this.formData = fieldlist;
	},
	// 表单权限选择
	setFormCtrl : function(formctrl) {
		var inputs = $$('input[type="radio"]');

		if (formctrl == null || formctrl.length == 0) {
			inputs.each(function(input) {
				if (input.name && input.name.indexOf('FormCtrl.') >= 0
						&& input.value == Workflow.DEFAULT_FORM_CTRL)
					input.checked = true;
			});
		}

		formctrl.each(function(form) {
			inputs.each(function(input) {
				if (input.name == 'FormCtrl.' + form.id
						&& input.value == form.value)
					input.checked = true;
			});

		});
	},
	// 返回表单权限的值
	getFormCtrl : function() {
		var inputs = $$('input[type="radio"]');
		
		var formCtrl = [];
		inputs.each(function(input) {
			if (input.name.indexOf('FormCtrl.') == 0 && input.checked) {
				formCtrl[formCtrl.length] = {
					id : input.getAttribute("form"),
					value : input.value
				};
			}
		});
		return formCtrl;
	},
	// 属性面版回退节点赋值
	setTreadSet : function(treadSet) {
		if (treadSet != null && treadSet.length > 0) {
			var ds = this.treadSet.getStore();
			var selectModel = this.treadSet.getSelectionModel();
			var rows = [];
			treadSet.each(function(tread) {
				var index = ds.find("code", tread.code);
				if (index != null) {
					rows.push(index);
				}
			});
			selectModel.selectRows(rows);
		}
	},
	// 返回跳转节点的值
	getTreadSet : function() {
		var selections = this.treadSet.getSelectionModel().getSelections();
		var TreadSet = [];
		selections.each(function(select) {
			TreadSet[TreadSet.length] = {
				code : select.get('code'),
				name : select.get('name')
			};
		});
		return TreadSet;
	},
	getBeginStartType : function() {
		var __this = this.form;
		var fields = __this.findFieldLike('TimeBegin.startType');
		for (var i = 0; i < fields.length; i++) {
			if (fields[i].getValue()) {
				return fields[i].inputValue;
			}
		}
	},
	setBeginStartType : function(value) {
		var __this = this.form;
		var fields = __this.findFieldLike('TimeBegin.startType');
		for (var i = 0; i < fields.length; i++) {
			if (fields[i].inputValue == value) {
				fields[i].setValue(true);
			} else {
				fields[i].setValue(false);
			}
		}
	},
	// 显示隐藏前后置条件
	showCondition : function() {
		var forward = Ext.getCmp('forwardCondition');
		var behide = Ext.getCmp('behideCondition');
		if (this.model && this.model.getBehide) {
			behide.show();
		} else {
			behide.hide();
		}

		if (this.model && this.model.getForward) {
			forward.show();
		} else {
			forward.hide();
		}
	},
	// 根据流程类型 结束节点显示不同的动作
	initActiongroup: function(type){
		var actions = Workflow.ACTIONSET_OUT.clone();
		var fact_actions = Workflow.ACTIONSET_OUT.clone();
		var processType = this.WorkflowModel.getType();
		switch(processType){
			case '00A' :
				fact_actions = Workflow.ACTIONSET_IN.clone();
				actions = Workflow.ACTIONSET_IN.clone();
				break;
			case '00B' :
				fact_actions = Workflow.ACTIONSET_OUT.clone();
				actions = Workflow.ACTIONSET_OUT.clone();
				break;
			case '00C' :
				fact_actions = Workflow.ACTIONSET_AFFAIR.clone();
				actions = Workflow.ACTIONSET_AFFAIR.clone();
				break;
		}
		if (type == StateMonitor.END_NODE) {
			fact_actions = Workflow.ACTIONSET_END.clone();
		} else if (type == StateMonitor.START_NODE) {
			fact_actions = Workflow.ACTIONSET_START.clone();
		} else {
			fact_actions = Workflow.ACTIONSET_NORMAL.clone();
		}

		for (var i = 0; i < fact_actions.length;) {
			if (actions.indexOf(fact_actions[i]) < 0) {
				fact_actions.remove(fact_actions[i]);
			} else {
				i++;
			}
		}

		var items = this.actiongroup.items.items; // checkboxgroup加载完后将items改为一个新的MixedCollection对象
		for(var i = 0; i < items.length; i++){
			if(fact_actions.indexOf(items[i].inputValue) >= 0){
				items[i].enable();
			}else{
				items[i].disable();
			}
		}
	},
    //显示计算表达式
    showExpression : function(){
        var tabPanel = this.tabpanel,
            curTab = this.expression,
            curAct = this.model,
            outTrans = [],
            oldExps = null,
            newExps = [],
            formId = "",
            formKeys = "",
            fieldData = [["X", "请选择字段"]];
        if(!curAct || !curAct.getExpressions || this.workfolwType != Workflow.PROCESS_TYPE_AFFIR){
            tabPanel.hideTabStripItem(curTab);
            return false;
        }
        outTrans = curAct.outTransitions;
        //获取formId
        if(this.WorkflowModel && this.WorkflowModel.getForm){
            formId = this.WorkflowModel.getForm();
        }
        //获取表单中数字字段
        if(formId){
            new Ajax.Request(Workflow.FIELD_LIST_URL, {
                asynchronous: false,
                method: "post",
                parameters: "formId="+formId,
                onComplete: function(req){
                    var result = req.responseText;
                    if(result && result.length){
                        try{
                            var formField = eval(result),
                                formKeyArray = [],
                                fieldName = "";
                            for(var i = 0, len = formField.length; i<len; i++){
                                fieldName = formField[i]["FIELD_NAME"];
                                if(fieldName){
                                	formKeyArray.push(fieldName);
                                    fieldData.push([fieldName, fieldName]);
                                }
                            }
                            formKeys = formKeyArray.join(",");
                        }catch(e){
                            fieldData = [];
                        }
                    }
                }
            });
        }
        if(outTrans.length < 2 || fieldData.length < 2){
            tabPanel.hideTabStripItem(curTab);
            return false;
        }else{
            var expLeftVal = "",
                expLeftOp = "小于",
                expFormKey = "X",
                expRightOp = "小于",
                expRightVal = "",
                outExp = null,
                oldCont = null;
            tabPanel.unhideTabStripItem(curTab);
            oldCont = curTab.findById("expContainer");
            if(oldCont){
                curTab.remove(oldCont);
            }
            for(var i=0, len=outTrans.length; i<len; i++){
                var curActName = curAct.getActivityName(),
                    outTran = outTrans[i],
                    outAct = outTran.getTo(),
                    outActCode = outAct.getActivityCode(),
                    outActName = outAct.getActivityName();
                outExp = curAct.getExpressionByToCode(outActCode);
                if(outExp && formKeys.indexOf(outExp.formKey) > -1){
                    expLeftVal = outExp.lftValue;
                    expLeftOp = outExp.lftOp;
                    expFormKey = outExp.formKey;
                    expRightOp = outExp.rghtOp;
                    expRightVal = outExp.rghtValue;
                }else{
                    expLeftVal = "";
                    expLeftOp = "小于";
                    expFormKey = "X";
                    expRightOp = "小于";
                    expRightVal = "";
                }
                newExps.push({
                    layout : 'column',
                    id : "expressionItem_"+ outActCode,
                    title : "节点 "+ curActName +" 到节点 "+ outActName +" 的表达式",
                    items : [{
                        width : 70,
                        layout : 'form',
                        hideLabels: true,
                        items : [{
                            xtype : 'numberfield',
                            id : 'expLeftVal_'+ outActCode,
                            hideLabel : true,
                            width : 65,
                            value: expLeftVal
                        }]
                    },
                    {
                        width : 110,
                        layout : 'form',
                        hideLabels: true,
                        items : [
                            new Ext.form.ComboBox({
                                hideLabel : true,
                                store : new Ext.data.SimpleStore({
                                    fields : ['value', 'text'],
                                    data : [['大于', '>'], ['大于等于', '>='], ['等于', '='], ['小于', '<'],['小于等于', '<=']]
                                }),
                                valueField : 'value',                                
                                displayField : 'text',
                                id : 'expLeftOp_'+ outActCode,
                                mode : 'local',
                                value : expLeftOp,
                                triggerAction : 'all',
                                editable : false,
                                selectOnFocus : false,
                                width : 90
                            })
                        ]
                    },
                    {
                        width : 130,
                        layout : 'form',
                        hideLabels: true,
                        items : [
                            new Ext.form.ComboBox({
                                columnWidth : 1,
                                hideLabel : true,
                                store : new Ext.data.SimpleStore({
                                    fields : ['value', 'text'],
                                    data : fieldData
                                }),
                                valueField : 'value',                              
                                displayField : 'text',
                                id : 'expFormKey_'+ outActCode,
                                mode : 'local',
                                value : expFormKey,
                                triggerAction : 'all',
                                editable : false,
                                selectOnFocus : false,
                                width : 110
                            })
                        ]
                    },
                    {
                        width : 110,
                        layout : 'form',
                        hideLabels: true,
                        items : [
                            new Ext.form.ComboBox({
                                hideLabel : true,
                                store : new Ext.data.SimpleStore({
                                    fields : ['value', 'text'],
                                    data : [['大于', '>'], ['大于等于', '>='], ['等于', '='], ['小于', '<'],['小于等于', '<=']]
                                }),
                                valueField : 'value',
                                displayField : 'text',
                                id : 'expRightOp_'+ outActCode,
                                mode : 'local',
                                value : expRightOp,
                                triggerAction : 'all',
                                editable : false,
                                selectOnFocus : false,
                                width : 90
                            })
                        ]
                    },
                    {
                        width : 70,
                        layout : 'form',
                        hideLabels: true,
                        items : [{
                            xtype : 'numberfield',
                            id : 'expRightVal_'+ outActCode,
                            hideLabel : true,
                            width : 65,
                            value: expRightVal
                        }]
                    }]
                });                
            }
            curTab.add(new Ext.Panel({
                id : 'expContainer',
                items: newExps
            }));
            curTab.doLayout();
        }
	}
})