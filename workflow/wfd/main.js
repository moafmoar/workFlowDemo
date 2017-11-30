WFD = function(editState){
	this.editState = !!editState ? editState : "";
	this.initContainer();
	
	this.state = new StateMonitor();
	this.toolspanel.setModel(this.state);
	this.state.setCmp(this.toolspanel);
	
	this.toolspanel.addButton(new Button(1,"images/select.gif"),"选择");
	this.toolspanel.addButton(new Button(3,"images/start16.png"),"开始");
	this.toolspanel.addButton(new Button(11,"images/node16.png"),"普通");
	this.toolspanel.addButton(new Button(5,"images/end16.png"),"结束");
	this.toolspanel.addButton(new Button(13,"images/transition.gif"),"连接");
	this.toolspanel.addButton(new Button(15,"images/bzzw.gif"),"标注");
	this.viewer = this.contentPanel;
	this.state.resetState();
	
}

WFD.prototype = {
	destroy : function(){
		this.model = null;
		this.Wrapper = null;
		this.layout.destroy()
	},
	//办理工具栏
	addHalfEditToolBar : function(Wrapper){
		var viewcontainer = Ext.getCmp("viewcontainer");
		var tb = viewcontainer.getTopToolbar();
		var validateSave = new SaveValidateListener(Wrapper);
		tb.addButton({
			id : 'save',
        	text: '催办',
            tooltip:'催办',
            iconCls:'revoke',
            handler : function(){
                if(typeof window.dialogArguments != "undefined"){
                    window.dialogArguments.sendUrgeMessage(window, Wrapper.getModel().getId());
                }else{
                    window.opener.Workflow.sendUrgeMessage(window, Wrapper.getModel().getId());
                }
            }
        });
		 
		tb.addFill();
	    tb.addButton({
						id : 'save',
		            	text: '保存',
			            tooltip:'保存',
			            iconCls:'save',
			            hidden : Wrapper.getModel().getWtType() == '00B' ||  (Wrapper.getModel().getIsAdmin() == 'false' 
			            	&& Wrapper.getModel().getTemplateOrgId() == 'ff808081388077ec01388077ec750000'), 
			            handler : function(){
			            	var domXml = WorkFlowModelConverter.convertModelToXML(Wrapper.getModel());
		             		if (domXml) {
				            	workflowAjax.updateRunnWfXml(Wrapper.getModel().getId(), domXml, function(result){
				    				if(result==""){
				    					Wrapper.getModel().getWrapper().setChanged(false);
				                		alert('流程修改成功！');
				                		window.close();
				                	}else{
				                		alert(result);
				                	}
				    			});
		             		}else {
		             			alert("流程修改失败，流程XML解析出错!");
		             		}
			            }
			        });
		tb.addSeparator();
		tb.addButton({
			        	id : 'close',
		            	text: '取消',
			            tooltip:'取消',
			            iconCls:'exit',
			            handler : function(){
			            	window.close();
			            }
			        });
	},
	//编辑工具栏
	addEditToolBar : function(Wrapper){
		var viewcontainer = Ext.getCmp("viewcontainer");
		var tb = viewcontainer.getTopToolbar();
		var validateSave = new SaveValidateListener(Wrapper);
		
		tb.add(/*[
//		        {
//				id : 'xml',
//            	text: '查看xml',
//	            tooltip:'查看xml',
//	            iconCls:'xml',
//	            handler : function(){
//	            	var newwin = window.open(""+Math.random(),"","width=700,height=800,scrollbars=1,toolbar=0,resizable=1");
//	            	newwin.document.writeln(XMLDocument.formatXML(WorkFlowModelConverter.convertModelToXML(Wrapper.getModel())));
//	            }
//	        },
	        {
				id : 'attribute',
            	text: '',
	            tooltip:'查看流程属性',
	            iconCls:'attribute',
	            handler : function(){
	               Wrapper.getAttributeWin().show(null, Wrapper.getModel());
	            }
	        }]*/);
	     tb.addFill();
	     tb.addButton({
						id : 'save',
		            	text: '保存',
			            tooltip:'保存',
			            iconCls:'save',
			            hidden : Wrapper.getModel().getWtType() == '00B' ||  (Wrapper.getModel().getIsAdmin() == 'false' 
			           		&& Wrapper.getModel().getTemplateOrgId() == 'ff808081388077ec01388077ec750000'),
			           	handler : function(){
			             	if(validateSave.actionPerformed()){
			             		var domXml = WorkFlowModelConverter.convertModelToXML(Wrapper.getModel());
                                console.log(domXml);
			             		if (domXml) {
			             			var form = document.forms['saveForm'];
			             			form.elements['workflowXml'].value = domXml;
			 	       				form.elements['templateId'].value = Wrapper.getModel().getId();
			 	       				form.elements['wtType'].value = Wrapper.getModel().getWtType();
			 	       				$.ajax({

									});
			 	       				new Ajax.Request("workflow-template!saveForAjax.do", { 
			 	       					asynchronous: false, 
			 	       					method: 'post', 
			 	       					parameters: Form.serialize(form), 
			 	       					onComplete: function(req){
			        	                    	var result = req.responseText;
			        	                    	if(result!=null && result.length == 32){
			        	                    		Wrapper.getModel().setId(req.responseText);
			        	                    		Wrapper.setStatusInfo('流程['+ Wrapper.getModel().getName() +']保存成功，修改流程只对新发起的文件生效！');
			     	                    		Wrapper.setChanged(false);
			        	                    		alert('流程['+Wrapper.getModel().getName()+']保存成功，修改流程只对新发起的文件生效！');
			        	                    		window.close();
			        	                    		window.opener.select_unmask();
			        	                    	}else{
			        	                    		alert(result);
			        	                    		model.getWrapper().setStatusInfo(result);
			        	                    	}
			        	                    }  
			 	       				});  
			             	} else {
			             		alert("保存失败，流程XML解析出错!");
			        		}
			            }}
			        });
		tb.addSeparator();
		tb.addButton({
			        	id : 'close',
		            	text: '关闭',
			            tooltip:'关闭 ',
			            iconCls:'exit',
			            handler : function(){
			                window.close();
			                window.opener.select_unmask();
			            }
			        });
	},
	//查看工具栏
	addViewToolBar : function(Wrapper){
		var viewcontainer = Ext.getCmp("viewcontainer");
		var tb = viewcontainer.getTopToolbar();
		if(Wrapper.getModel().getMainHandler().name){
			tb.addText('督办人&nbsp;-&nbsp;<font color="green">'+Wrapper.getModel().getMainHandler().name+'</font>');
		}
	    tb.addFill();
		tb.addButton({
			        	id : 'close',
		            	text: '关闭',
			            tooltip:'关闭',
			            iconCls:'exit',
			            handler : function(){
			               window.close();
			            }
			        });
	},
	//向导模式编辑工具栏
	addGuideEditToolBar : function(Wrapper){
		var viewcontainer = Ext.getCmp("viewcontainer");
		var tb = viewcontainer.getTopToolbar();
		var validateSave = new SaveValidateListener(Wrapper);
		
		tb.add([
//		        {
//				id : 'xml',
//            	text: '查看xml',
//	            tooltip:'查看xml',
//	            iconCls:'xml',
//	            handler : function(){
//	            	var newwin = window.open("",Math.random(),"width=700,height=800,scrollbars=1,toolbar=0,resizable=1");
//	            	newwin.document.writeln(XMLDocument.formatXML(WorkFlowModelConverter.convertModelToXML(Wrapper.getModel())));
//	            }
//	        },
	        {
				id : 'attribute',
            	text: '查看流程属性',
	            tooltip:'查看流程属性',
	            iconCls:'attribute',
	            handler : function(){
	               Wrapper.getAttributeWin().show(null, Wrapper.getModel());
	            }
	        }]);
	     tb.addFill();
	     tb.addButton({
			id : 'save',
        	text: '下一步',
            tooltip:'保存流程设计,进入下一步',
            iconCls:'save',
            hidden : Wrapper.getModel().getWtType() == '00B' ||  (Wrapper.getModel().getIsAdmin() == 'false' 
           		&& Wrapper.getModel().getTemplateOrgId() == 'ff808081388077ec01388077ec750000'),//|| Wrapper.getModel().getWtType() == 'sys',
            handler : function(){
            	if(validateSave.actionPerformed()){
            		var domXml = WorkFlowModelConverter.convertModelToXML(Wrapper.getModel());

            		if (domXml) {
            			var form = document.forms['saveForm'];
            			form.elements['workflowXml'].value = domXml;
	       				form.elements['templateId'].value = Wrapper.getModel().getId();
	       				form.elements['wtType'].value = Wrapper.getModel().getWtType();

	       				new Ajax.Request("workflow-template!saveForAjax.do", { 
	       					asynchronous: false, 
	       					method: 'post', 
	       					parameters: Form.serialize(form), 
	       					onComplete: function(req){
       	                    	var result = req.responseText;
       	                    	if(result!=null && result.length == 32){
       	                    		Wrapper.getModel().setId(req.responseText);
       	                    		Wrapper.setStatusInfo('流程['+ Wrapper.getModel().getName() +']保存成功，修改流程只对新发起的文件生效！');
    	                    		Wrapper.setChanged(false);
       	                    		alert('流程['+Wrapper.getModel().getName()+']保存成功，修改流程只对新发起的文件生效！');
    		            			window.opener.select_unmask(document.getElementById("formId").value, document.getElementById("collTemId").value,result);
    		            			window.close();
       	                    	}else{
       	                    		alert(result);
       	                    		model.getWrapper().setStatusInfo(result);
       	                    	}
       	                    }  
	       				});  
            	} else {
       				alert("保存失败，流程XML解析出错!");
       			}
            }}
        });
		tb.addSeparator();
		tb.addButton({
        	id : 'close',
        	text: '关闭',
            tooltip:'取消当前设计，返回上一步',
            iconCls:'exit',
            handler : function(){
            	window.close();
                window.opener.select_unmask('','','');
            }
        });
	},
	
	//加载流程模型
	loadWFD : function(model,doc){
		
		if(model){
			this.model = model;
		}else{
			this.model = new WFDModel();
		}
		this.model.setCmp(this.contentPanel);
		this.Wrapper = new Wrapper(this.attributeWin,this.contentPanel,this.model,this.state,this.statusbar);
		
		this.Wrapper.setEditState(this.editState);
		this.model.setWrapper(this.Wrapper);
		if(doc){
			WorkFlowModelConverter.convertXMLToModel(doc,this.model);
		}else{
			var startNode = new StartActivity({x : 50,y : 50});
			startNode.setWrapper(this.Wrapper);
			this.model.addActivity(startNode);
			
			var endNode = new EndActivity({x : 600,y : 400});
			endNode.setWrapper(this.Wrapper);
			this.model.addActivity(endNode);
		}
		if(Workflow.READ_ONLY == this.editState){
			this.addViewToolBar(this.Wrapper);
//			var leftBar = Ext.getCmp("leftBar");
//			leftBar.hide();
		}else if(Workflow.HALF_EDIT == this.editState){
			this.addViewerListeners(this.Wrapper);
			this.addHalfEditToolBar(this.Wrapper);
			this.attributeWin.setWorkflowModel(this.model);
		}else if(Workflow.EDITING == this.editState){
			this.addViewerListeners(this.Wrapper);
			if(this.model.isGuide()){
				this.addGuideEditToolBar(this.Wrapper);
			}else{
				this.addEditToolBar(this.Wrapper);
			}
			this.attributeWin.setWorkflowModel(this.model);
		}
//		this.attributeWin.show(null,this.model );
		
		if(this.wflogGrid){//加载流程日志
			this.wflogGrid.store.proxy.conn.url = 'workflow-template!workflowLog.do?workflowId=' + model.getId();  
        	this.wflogGrid.store.reload();
		}
	},
	//添加视图监听器
	addViewerListeners : function(Wrapper){
		var _this = Wrapper.getViewer().getEl();
		var down = false;  //鼠标按下
		var moving = false; //允许移动
		
		var ctrlDown = false;
		var startposition = null;
		var positionDiffer = [0,0];
		var start = null;
		var end = null;
		
		var startNode = null;
		var endNode = null;
		var lineTemp = null;
		var selectDivTemp = null;
		
		var rightMenu = new Ext.menu.Menu ([
				{xtype:"button",text:"属性",icon:"images/attribute.gif",pressed:true,handler:function(){
						Wrapper.setChanged(true);
						Wrapper.getAttributeWin().show(Wrapper.getModel().getSelectedAct(), Wrapper.getModel()); 
					}},
//				{xtype:"button",text:"添加拐点",icon:"nodes/start.gif",pressed:true,handler:function(){}},
                {xtype:"button",text:"删除",icon:"images/delete.gif",pressed:true,disabled:false,handler:function(){if(Wrapper.getModel().hasSelect()){if(confirm('确定删除所选吗?')){Wrapper.getModel().deleteSelect();}}}},
                {xtype:"button",text:"全选",icon:"images/start.gif",pressed:true,handler:function(){Wrapper.getModel().selectAll();}}
//                {xtype:"button",text:"xml",icon:"images/xml.gif",pressed:true,
//                	handler:function(){
//                		Ext.MessageBox.show({
//				           title: 'xml',
//				           msg: '流程设计输出xml',
//				           value : WorkFlowModelConverter.convertModelToXML(Wrapper.getModel()),
//				           width:500,
//				           height : 600,
//				           buttons: Ext.MessageBox.OKCANCEL,
//				           multiline: true,
//				           fn: function(btn,text){
//				           		if(btn=="ok"){
//				           			alert(text);
//				           		}
//				           },
//				           animEl: 'mb3'
//				       });
//                	}
//                }
            ]);
            
        _this.on("dblclick",function(e){
        	if(Wrapper.getState().getState()==StateMonitor.SELECT){
        		Wrapper.setChanged(true);
        		Wrapper.getAttributeWin().show(Wrapper.getModel().getSelectedAct(), Wrapper.getModel());
        	}
        });
		
		Ext.getBody().on("keydown",function(e){
			if(e.getCharCode()==e.CTRL){
				ctrlDown = true;
			}else if(e.getCharCode()==e.DELETE){
				if(Wrapper.getModel().hasSelect()){
					if(confirm('确定删除所选吗?')){
						Wrapper.getModel().deleteSelect();
					}
				}
			}else if(e.getCharCode()==e.ESC){
				Wrapper.getState().resetState();
			}
		});
		
		Ext.getBody().on("keyup",function(e){
			ctrlDown = false;
		});
		_this.on("contextmenu",function(e){
			e.preventDefault();
			if(Wrapper.getState().getState()==StateMonitor.SELECT){
				rightMenu.showAt(e.getPoint());
			}
		});
		
		_this.on("click",function(e){
			var nodeModel = null;
			var noteModel = null;
			var x = e.getXY()[0]-Wrapper.getViewerPosition()[0];
			var y = e.getXY()[1]-Wrapper.getViewerPosition()[1];
			var state = Wrapper.getState().getState();
			switch(state){
				case StateMonitor.SELECT : return;break;
				case StateMonitor.START_NODE : 
					nodeModel = new StartActivity({
						x : x,
						y : y
					});
					break;
				case StateMonitor.END_NODE : 
					nodeModel = new EndActivity({
						x : x,
						y : y
					});
					break;
				case StateMonitor.FORK_NODE : return;
				case StateMonitor.JOIN_NODE : return;
				case StateMonitor.NODE : 
					nodeModel = new NormalActivity({
						x : x,
						y : y
					});
					break;
				case StateMonitor.TRANSITION : return;
				case StateMonitor.NOTE : 
					noteModel = new NoteModel({
						x : x,
						y : y
					});
					break;;
			}
			if(nodeModel || noteModel){
				Wrapper.setChanged(true);
			}
			if(nodeModel && Wrapper.validateNode(nodeModel)){
				nodeModel.setWrapper(Wrapper);
				Wrapper.getModel().addActivity(nodeModel);
			}
			if(noteModel){
				noteModel.setWrapper(Wrapper);
				Wrapper.getModel().addNote(noteModel);
			}
			//按下ctrl时的情况,不重置
			if(!ctrlDown){
				Wrapper.getState().resetState();
			}
			
		});
		_this.on("mousedown",function(e){
			var onModel = Wrapper.getMouseover();
			startposition = e.getXY();
			start = [(e.getXY()[0]-Wrapper.getViewerPosition()[0]),(e.getXY()[1]-Wrapper.getViewerPosition()[1])]
			if(Wrapper.getState().getState()==StateMonitor.SELECT){
				if(Wrapper.getMouseover()!=Wrapper.getViewer()){
					if(!onModel.selected){
						if(!ctrlDown){
							Wrapper.getModel().clearSelected();
						}
						onModel.select(true);
						Wrapper.setChanged(true);
					}
					moving = true;
				}else{
					if(selectDivTemp){
						Wrapper.getViewer().remove(selectDivTemp);
						selectDivTemp.destroy();
						selectDivTemp = null;
					}
					selectDivTemp = new SelectDiv(start);
					
					Wrapper.getModel().clearSelected();
//					document.body
				}
			}else if(Wrapper.getState().getState()==StateMonitor.TRANSITION){
				if(Wrapper.validateLineNode(Wrapper.getMouseover())){
					startNode = Wrapper.getMouseover();
					lineTemp = new Line(null,null,startNode);
					lineTemp.setFrom(start);
					lineTemp.setTo(start);
					
					Wrapper.getViewer().add(lineTemp);
					Wrapper.getViewer().doLayout(true);
//					nodeModel = new Line();
//					nodeModel.setWrapper(Wrapper);
//					Wrapper.getModel().addActivity(nodeModel);
				}
			}
			
			down = true;
		});
		
		Ext.getBody().on("mouseup",function(e){
			var canreset = false;
			
			endNode = Wrapper.getMouseover();
			if(lineTemp){
				Wrapper.getViewer().remove(lineTemp);
				lineTemp.destroy();
			}
			if(startNode&&endNode){
				if(Wrapper.validateLine(startNode, endNode)){		//开始节点不是结束节点，且结束节点存在
					var lineModel = new Transition({
						id : "line1",
						name : "线",
						from : startNode,
						to : endNode
					}); 
					lineModel.setWrapper(Wrapper);
					lineModel.reconnect(startNode,endNode);
					Wrapper.setChanged(true);
				}
				canreset = true;
			}
			
			if(selectDivTemp){
				Wrapper.getViewer().remove(selectDivTemp);
				selectDivTemp.destroy();
				canreset = true;
			}
			
			if(canreset){
				//按下ctrl时的情况,不重置
				if(!ctrlDown){
					Wrapper.getState().resetState();
				}
			}
			
			moving = false;
			down = false;
			startposition = null;
			start = null;
			end = null;
			startNode = null;
			endNode = null;
			lineTemp = null;
			selectDivTemp = null;
		});
		
		_this.on("mousemove",function(e){
			end = [(e.getXY()[0]-Wrapper.getViewerPosition()[0]),(e.getXY()[1]-Wrapper.getViewerPosition()[1])];
			if(down){
				if(Wrapper.getState().getState()==StateMonitor.SELECT){
					if(moving){
						//拖动
						if(e.button==2){
							return ;
						}
						positionDiffer = [e.getXY()[0] - startposition[0],e.getXY()[1] - startposition[1]];
						Wrapper.getModel().moveSelected(positionDiffer);
					}else{
						selectDivTemp.update(end);
						Wrapper.getModel().clearSelected();
						Wrapper.getModel().moreSelected(start,end);
						Wrapper.getViewer().add(selectDivTemp);
						Wrapper.getViewer().doLayout(true);
					}
				}else if(Wrapper.getState().getState()==StateMonitor.TRANSITION){
					if(lineTemp){
						lineTemp.setTo(end);
					}
				}
			}
			startposition = e.getXY();
		});
	},
	//初始化设计器
	initContainer : function(){
		//画板
		this.contentPanel = new Ext.Panel({
			id: 'designer',
			region: 'center', // this is what makes this panel into a region within the containing layout
			layout: 'absolute',
			margins: '2 5 5 0',
			bodyStyle:'background-image:url("images/workbg.gif");overflow: scroll;',
			border: false
		});
		
		//状态条
		this.statusbar = new Ext.StatusBar({
			            defaultText: '',
//			            defaultText: '欢迎使用万维流程定制系统',
			            id: 'basic-statusbar',
				        items: [
				        	{
					            text: '关于',
					            handler : function(){
					            	Ext.MessageBox.alert("","销售助手-综合办公 流程设计器");
					            }
					            
					        }]
			        });
		//工具面板
	    
	    this.toolspanel = new LeftBar();
	    
	    var store = new Ext.data.Store({
	    	url: 'workflow-template!workflowLog.do',
	        reader: new Ext.data.JsonReader(
	        	{}, 
	        	['activityName', 'userName', 'fromInfo','logContent', 'taskAssignTime','dealTime','dealTimeDeff'])
	    });
	
//	    [{"activityName":"开始","dealTime":"2009-08-10 10:54:00","fromInfo":"","logContent":"提交办理","taskAssignTime":"2009-08-10 10:53:36","userName":"张京"}]

	    this.wflogGrid = new Ext.grid.GridPanel({
	    	title : '流程日志',
	        store: store,
	        columns: [
	            {header: "环节", width: 120, dataIndex: 'activityName', sortable: true},
	            //{header: "办理人", width: 100, dataIndex: 'userName', sortable: true},
	            // {header: "来源信息", width: 300, dataIndex: 'fromInfo', sortable: true},
	            {header: "操作", width: 510, dataIndex: 'logContent', sortable: true},
	            {header: "任务到达时间", width: 120, dataIndex: 'taskAssignTime', sortable: true},
	            {header: "办理时间", width: 120, dataIndex: 'dealTime', sortable: true},
	            {header: "办理时长", width: 120, dataIndex: 'dealTimeDeff', sortable: true}
	        ],
//	        renderTo:'example-grid',
	        width:540,
	        height:200
	    });
	
	   // store.load();
	    
	    //布局
	    if(Workflow.DISPLAY == this.editState){
	    	this.attributeWin =  null;
		    this.layout = new Ext.Viewport({
					layout: 'fit',
					items:[
					       this.contentPanel
					]
		    });
	    }else if(Workflow.READ_ONLY == this.editState){
	    	this.attributeWin =  null;
		    this.layout = new Ext.Viewport({
				layout: 'fit',
				items: new Ext.TabPanel({
					deferredRender: false,
					id : "viewcontainer",
					tbar: ["-"],
					activeTab: 0,
			        width:600,
			        height:250,
			        plain:true,
			        defaults:{autoScroll: true},
					items:[
						{
						title : '流程查看',
				        layout: 'border',
				        items : [
							this.contentPanel
						]},
						this.wflogGrid
					],
					 renderTo: Ext.getBody()
		    	}),
		        renderTo: Ext.getBody()
		    });
	    }else if(Workflow.HALF_EDIT == this.editState){
	    	this.attributeWin =  new AttributeWin();;
		    this.layout = new Ext.Viewport({
				layout: 'fit',
				items: new Ext.TabPanel({
					activeTab: 0,
			        width:600,
			        height:250,
			        plain:true,
			        defaults:{autoScroll: true},
					items:[{
						title :'流程修改',
						id : "viewcontainer",
						tbar: ["-"],
				        layout: 'border',
				        items : [
					        new Ext.Panel({
								id: 'leftBar',
								title : "工具栏",
								region: 'west',
								bodyStyle : "background-color: buttonface;",
								width: 100,
								split:true,
								minSize: 100,
		                    	maxSize: 200,
								collapsible: true,
								margins:'0 0 0 0',
								border: false,
								 items: [this.toolspanel]
							}),
							this.contentPanel
						],
						bbar: this.statusbar
					},this.wflogGrid],
					 renderTo: Ext.getBody()
		    	}),
		        renderTo: Ext.getBody()
		    });
	    }else{
	    	this.attributeWin =  new AttributeWin();
	    	this.layout = new Ext.Viewport({
				layout: 'border',
				title: '',
				items: [{
					region: 'center',
					title :'流程设计器',
					id : "viewcontainer",
					tbar: ["-"],
			        layout: 'border',
			        items : [
				        new Ext.Panel({
							id: 'leftBar',
							title : "工具栏",
							region: 'west',
							bodyStyle : "background-color: buttonface;",
							width: 100,
							split:true,
							minSize: 100,
	                    	maxSize: 200,
							collapsible: true,
							margins:'0 0 0 0',
							border: false,
							 items: [this.toolspanel]
						}),
						this.contentPanel
					],
					bbar: this.statusbar
				}
				],
		        renderTo: Ext.getBody()
		    });
	    }
	    
	    
	    this.contentPanel.getEl().dom.onselectstart = function(){
	    	return false;
	    };
	}
}

//-------------------------------------


