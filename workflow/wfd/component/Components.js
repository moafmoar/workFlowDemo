/**
 * 模型组建
 */


//nodeText
NodeText = function(content){
	this.el = new Ext.Element(document.createElement("div"));
//	this.el.dom.className = "nodeStyle";
	this.el.dom.style.position = "absolute";
    this.el.dom.style.zIndex = 88;
//    this.el.dom.style.align = "middle";
    this.el.dom.className = "nodetxt";
    this.addEvents("test");
    if(content){
    	this.setContent(content);
    }
}
Ext.extend(NodeText,Ext.BoxComponent,{
	setContent : function(content){
		this.el.dom.innerText = content;
		this.el.dom.textContent = content;
	},
	change : function(x,y,w,h,txt){
		this.setContent(txt);
		if(document.documentMode && document.documentMode>=9){
			this.el.dom.style.width = 100 + 'px';
			this.el.dom.style.top = (y+h+10)  + 'px';
			this.el.dom.style.left = (x+w/2-50)  + 'px';
		}else{
			this.el.dom.style.width = 100;
			this.el.dom.style.top = y+h+10;
			this.el.dom.style.left = x+w/2-50;
		}
	}
});


//node
Node = function(model,Wrapper){
	this.model = model;
	this.Wrapper = Wrapper;
    this.el = new Ext.Element(document.createElement("div"));
//    this.el.id = this.model.getId();
    this.el.dom.style.backgroundColor="buttonface";
    this.el.dom.style.zIndex = 100;
//    this.el.dom.style.position = "absolute";
    this.initImage();
    this.el.dom.style.width = "32px";
    this.el.dom.style.height = "32px";
    this.el.dom.style.borderStyle = "solid";
    this.getEl().dom.style.borderWidth="0px";
    this.el.dom.style.borderColor = "green";
//    this.el.dom.className = this.model.getType();
    this.border = true;
    
    this.NodeText = null;
    if(this.model.position){
    	this.changePosition(this.model.position);
//    	this.el.dom.style.left = this.model.position[0];
//    	this.el.dom.style.top = this.model.position[1];
    }
    //添加名称显示
    this.addSelectListeners();
    this.addEvents("test");
}
Ext.extend(Node,Ext.BoxComponent,{
	setNodeText : function(nodeText){
		this.NodeText = nodeText;
		this.nodeTextChanged();
	},
	nodeTextChanged : function(){
		var dom = this.el.dom;
		if(this.NodeText){
			this.NodeText.change(this.model.position[0],this.model.position[1],32,32,this.model.getActivityName());
		}
	},
	initImage : function(){
		var type = this.model.getType();
		switch(type){
			case StateMonitor.START_NODE : this.el.dom.style.backgroundImage="url(images/start.png)";break; 
			case StateMonitor.END_NODE : this.el.dom.style.backgroundImage="url(images/end.png)";break; 
			case StateMonitor.NODE : {
									if(this.Wrapper.getEditState()==""||this.Wrapper.getEditState()==Workflow.EDITING){
										this.el.dom.style.backgroundImage="url(images/node.png)";
									}else{
										var state = this.model.getState()
										switch(state){
											case Workflow.ACTIVITY_STATE.BEBACK :
											case Workflow.ACTIVITY_STATE.DOING : this.el.dom.style.backgroundImage="url(images/doing.png)";break;
											case Workflow.ACTIVITY_STATE.BACK :
											case Workflow.ACTIVITY_STATE.END : this.el.dom.style.backgroundImage="url(images/finish.png)";break;
											case Workflow.ACTIVITY_STATE.UNSTATRT : 
											default : this.el.dom.style.backgroundImage="url(images/noNode.png)";
										}
									}
								}
			break; 
		}
	},
	//显示节点办理情况 start
	addQuickTips : function(){
		if(this.tips){
			this.tips.destroy();
		}
		this.tips = new Ext.ToolTip({
		        target: this.el,
		        title: "【"+this.model.getActivityName()+"】:",
		        width:432,
		        html: this.getQuickTips(),
		        trackMouse:true
		    });
	},
	getQuickTips : function(){
		var html = "";
		var type = this.model.getType();
		switch(type){
			case StateMonitor.END_NODE : html = "";break;
			case StateMonitor.START_NODE : 
//					if(this.Wrapper.getEditState()!=""){
//						html = "拟稿人";break;
//					}
			case StateMonitor.NODE : {
					var state = this.model.getState()
					switch(state){
						//case Workflow.ACTIVITY_STATE.UNSTATRT : this.el.dom.style.backgroundImage="url(images/noNode.png)";break;
						case Workflow.ACTIVITY_STATE.BACK :
						case Workflow.ACTIVITY_STATE.BEBACK :
						case Workflow.ACTIVITY_STATE.DOING : 
						case Workflow.ACTIVITY_STATE.END :  
						case Workflow.ACTIVITY_STATE.NOTICE_TODO:
						case Workflow.ACTIVITY_STATE.NOTICE_DONE: html = this.getRealRunner();break; 
						default : html = this.getRunner();
					}
				}
			break; 
		}
		return html;
	},
	getRunner : function(){
		var html = "";
		var obj = this.model.getRunner();
		var userNames = obj.userNames ? '【用户】:'+obj.userNames + '<br>' : '';
		var deptNames = obj.deptNames ? '【部门】:'+obj.deptNames + '<br>' : '';
		var postNames = obj.postNames ? '【职务】:' +obj.postNames + '<br>' : '';
		var groupNames = obj.groupNames ?'【群组】:' + obj.groupNames + '<br>' : '';
		var varNames = obj.varNames ? '【变量】:'+ obj.varNames : '';
		
		html = userNames +
			deptNames + 
			postNames +
			groupNames +
			varNames ;
		return html;
	},
	getRealRunner : function(){
		var html = "";
		var users = this.model.getRealRunners();
		for(var i=0;i< users.length; i++){
			var user = users[i];
			if(user){
				if(html==""){
//					html+="<br>收到时间:"+user.assignTime+"<br>";
//					html+="办理期限:"+user.expectTime+"<br>";
				}
				var expect = "";
				if(user.assignTime == user.expectTime || user.expectTime==null){ //任务到达时间和超期时间相等
					html += "<tr><td width='32'>"+this.getDealStateIcon(user.dealState)+"</td><td align='left' width='200'>"+user.userName+"</td><td align='center' width='200'>"+user.dealTime+"&nbsp;</td></tr>";
				}else{
					var nowDate = new Date();
//					var currentTime = nowDate.format("Y-m-d H:i:s");
					var expectTime = Date.parseDate(user.expectTime,"Y-m-d H:i:s");
					if(expectTime){
						if(user.dealTime!=""){
							var dealTime = Date.parseDate(user.dealTime,"Y-m-d H:i:s");
							var timeCha = null;
							if((timeCha = dealTime.getTime() - expectTime.getTime())>0){
								expect = "<font color='red'>超期"+this.getDateTime(timeCha)+"</font>";
							}
						}else{
							var timeCha = null;
							if((timeCha = nowDate.getTime() - expectTime.getTime())>0){
								expect = "<font color='red'>超期"+this.getDateTime(timeCha)+"</font>";;
							}
						}
					}
					html += "<tr><td width='32'>"+this.getDealStateIcon(user.dealState)+"</td><td align='left' width='100'>"+user.userName+"</td><td align='center' width='200'>"+user.dealTime+"&nbsp;</td><td align='center' width='200'>"+expect+"&nbsp;</td></tr>";
				}
			}
			
		}
		return "<table width='100%' class='tableList'>"+html+"</table>";
	},
	getDateTime : function(timeCha){
		var day = timeCha/(3600*1000*24);
		var hour = (timeCha%(3600*1000*24))/(3600*1000);
		var minitus = ((timeCha%(3600*1000*24))%(3600*1000))/(60*1000);
		return Math.floor(day)+"天"+Math.floor(hour)+"小时";//+Math.floor(minitus)+"分钟";
	},
	getDealStateIcon : function(state){
		var icon = "";
		switch(state){
			case Workflow.DEAL_STATE.DOING : icon="<img src='images/emailwrite.gif'/>";  break;
			case Workflow.DEAL_STATE.DONE : icon="<img src='images/queding.gif'/>"; break;
			case Workflow.DEAL_STATE.WAITING : icon="<img src='images/emailwrite.gif'/>"; break;
			case Workflow.DEAL_STATE.BACK : icon="<img src='images/icon_back.gif'/>"; break;
			case Workflow.DEAL_STATE.BEBACK : icon="<img src='images/icon_re2.gif'/>"; break;
			case Workflow.DEAL_STATE.NOTICE_TODO : icon="<img src='images/notice_todo.png'/>"; break;
			case Workflow.DEAL_STATE.NOTICE_DONE : icon="<img src='images/notice_done.png'/>"; break;
			default : icon="<img src='images/emailwrite.gif'/>";
		}
		return icon;
	},
	//--END--
	
	initComponent : function(){
        Node.superclass.initComponent.call(this);
	},
	changePosition : function(p){
 
		if(document.documentMode && document.documentMode>=9){
			this.el.dom.style.left = p[0] + 'px';
			this.el.dom.style.top = p[1] + 'px';
		}else{
			this.el.dom.style.left = p[0];
			this.el.dom.style.top = p[1];
		}
		this.nodeTextChanged();
	},
	selected : function(select){
		if(select){
			this.getEl().dom.style.borderWidth="1px";
//			this.getEl().dom.style.borderStyle="dashed";
		}else{
			this.getEl().dom.style.borderWidth="0px";
//			this.getEl().dom.style.borderStyle="dashed";
		}
	},
	addSelectListeners : function(){
		_this = this;
		var el = this.el;
		var model = this.model;
		var p = [0,0];
		var Wrapper = this.Wrapper;
		el.on("mouseover",function(e){
//			if(!model.selected){
//				model.select(true);
//			}
			Wrapper.setMouseover(model);
		});
		el.on("mouseout",function(e){
			Wrapper.setMouseover(null);
		});
		this.addQuickTips();
		
		if(Wrapper.getEditState()==Workflow.HALF_EDIT){
			if(model.getState){
				var state = model.getState()
				switch(state){
					case Workflow.ACTIVITY_STATE.DOING : 
					case Workflow.ACTIVITY_STATE.END : model.setReadOnly(true);break; 
				}
			}
		}
	},
	getModel : function(){
		return this.model;
	},
	update : function(){
		this.addQuickTips();
		this.nodeTextChanged();
	}
})


//selectDiv
SelectDiv = function(start){
	this.el = new Ext.Element(document.createElement("div"));
//	this.el.dom.className = "nodeStyle";
	this.el.dom.style.position = "absolute";
    this.el.dom.style.zIndex = 200;
    this.el.dom.className = "selectDiv";
    this.start = start;
    this.end = start;
    
    this.addEvents("test");
}
Ext.extend(SelectDiv,Ext.BoxComponent,{
	update : function(end){
		this.end = end;
		var width = 0,height = 0,left = this.start[0],top = this.start[1];
		
		var x0 = this.end[0] - this.start[0];
		var y0 = this.end[1] - this.start[1];
		
		left = x0>0 ? this.start[0] : this.end[0];
		top = y0>0 ? this.start[1] : this.end[1];
		
		this.el.dom.style.left = left;
		this.el.dom.style.top = top;
		this.el.dom.style.width = Math.abs(x0);
		this.el.dom.style.height = Math.abs(y0);
		
	}
});

//note
Note = function(model,Wrapper){
	this.model = model;
	this.Wrapper = Wrapper;
	this.el = new Ext.Element(document.createElement("div"));
	this.el.dom.className = "notestyle";
	this.el.dom.style.position = "absolute";
    this.el.dom.style.zIndex = 101;
    this.initAttribute(this.model.getAttributes());
    
    this.addSelectListeners();
    this.addEvents("test");
}
Ext.extend(Note,Ext.BoxComponent,{
	initAttribute : function(config){
//		this.el.dom.style.border = 1;
		this.el.dom.style.left = config.x;
		this.el.dom.style.top = config.y;
		this.el.dom.style.width = config.width;
		this.el.dom.style.height = 50;
		this.el.dom.innerHTML = config.text;
		this.update();
	},
	selected : function(select){
		if(select){
			this.getEl().dom.style.borderWidth="1px";
			this.getEl().dom.style.borderStyle="dashed";
		}else{
			if(!this.hasborder){
				this.getEl().dom.style.borderWidth="0px";
			}else{
				this.getEl().dom.style.borderWidth="1px";
			}
			this.getEl().dom.style.borderStyle="solid";
		}
	},
	setPosition : function(p){
		this.getEl().dom.style.left = p[0];
		this.getEl().dom.style.top = p[1];
	},
//	update : function(end){
//		this.end = end;
//		var width = 0,height = 0,left = this.start[0],top = this.start[1];
//		
//		var x0 = this.end[0] - this.start[0];
//		var y0 = this.end[1] - this.start[1];
//		
//		left = x0>0 ? this.start[0] : this.end[0];
//		top = y0>0 ? this.start[1] : this.end[1];
//		
//		this.el.dom.style.left = left;
//		this.el.dom.style.top = top;
//		this.el.dom.style.width = Math.abs(x0);
//		this.el.dom.style.height = Math.abs(y0);
//		
//	},
	addSelectListeners : function(){
		var el = this.el;
		var model = this.model;
		var p = [0,0];
		var Wrapper = this.Wrapper;
		el.on("mouseover",function(e){
//			if(!model.selected){
//				model.select(true);
//			}
			Wrapper.setMouseover(model);
		});
		el.on("mouseout",function(e){
			Wrapper.setMouseover(null);
		});
	},
	update : function(){
		var config = this.model.getAttributes();
		this.el.dom.style.width = config.width;
//		this.el.dom.style.height = config.height;
		var textString = config.text;
		if(eval(config.bold)){
			this.getEl().dom.style.fontWeight="bold";
		}else{
			this.getEl().dom.style.fontWeight="normal";
		}
		if(eval(config.italic)){
			this.getEl().dom.style.fontStyle="italic";
		}else{
			this.getEl().dom.style.fontStyle="normal";
		}
		if(eval(config.border)){
			this.hasborder = true;
			this.getEl().dom.style.borderWidth="1px";
		}else{
			this.hasborder = false;
			if(!this.model.selected){
				this.getEl().dom.style.borderWidth="0px";
			}
		}
		if(config.color){
			this.getEl().dom.style.color=config.color;
		}else{
			this.getEl().dom.style.color="";
		}
		if(config.borderColor){
			this.getEl().dom.style.borderColor=config.borderColor;
		}else{
			this.getEl().dom.style.borderColor="";
		}
//	font :
//	size
		this.el.dom.innerHTML = config.text;
	}
});

var DRAWMODE = {
	'SVG' : 0,
	'VML' : 1
};
 
//line
Line = function(model,Wrapper,/**/fromNode){
	
	this.model = model;
	this.Wrapper = Wrapper;
	this.drawMode = this.getDrawMode();
	this.el = null;
	this.stroke = null;

	if(this.drawMode == DRAWMODE.SVG){
		this.el = new Ext.Element(document.createElementNS("http://www.w3.org/2000/svg","svg"));
	    this.el.dom.style.cursor = 'hand';
	    this.el.dom.style.position = 'absolute';
	    this.el.dom.style.width = '100%';
	    this.el.dom.style.height = '100%';
	    
	    //添加箭头标记定义
	    this.addArrawMarker(this.el.dom);
	    //定义节点连线
	    this.stroke = this.createSVG("path",{
	    	style : "stroke:black;stroke-width:1;marker-end:url(#markerArrow);"
    	});
	    //连线置于底部
	    if(model){
	    	this.el.dom.style.zIndex = 2;
	    	this.repaint();
	    }else{
	    	this.el.dom.style.zIndex = 1;
	    }
	}else {
		this.el = new Ext.Element(document.createElement("v:line"));
	   	// this.el.id = this.model.getId();
	   	// this.el.dom.style.borderWidth="1px";
	   	// this.el.dom.style.borderStyle="solid";
	    this.el.dom.style.cursor = 'hand';
	    this.el.dom.style.position = 'absolute';

	    if(model){
	    	this.el.dom.style.zIndex = 100;
	    	this.repaint();
	    }else{
	    	this.el.dom.style.zIndex = 99;
	    }

	    this.stroke = document.createElement("v:stroke");
    	this.stroke.EndArrow = "Classic";
    	this.el.dom.appendChild(this.stroke);
	} 
	this.el.dom.appendChild(this.stroke);
    this.el.dom.style.cursor = 'hand';
    this.border = true;
    if(model&&Wrapper){
    	this.addSelectListeners();
    }
    
    if(fromNode && fromNode.getSplitType && (Workflow.SPLIT_TYPE_XOR == fromNode.getSplitType()||Workflow.SPLIT_TYPE_ONLY == fromNode.getSplitType())){//开始节点为鉴别模式时虚线
		if(this.drawMode == DRAWMODE.SVG){
    		this.stroke.setAttribute("stroke-dasharray","7,7");
    	}else{
    		this.stroke.dashstyle = "LongDash";
    	}
    }
    
    this.update();
    this.addEvents("test");
}
Ext.extend(Line,Ext.BoxComponent,{
	initComponent : function(){
        Node.superclass.initComponent.call(this);
	},
	update : function(){
		/**
		 *  连接本身的改变
		 */
		if(this.model && this.model.getFrom().getSplitType && (Workflow.SPLIT_TYPE_XOR == this.model.getFrom().getSplitType()||Workflow.SPLIT_TYPE_ONLY == this.model.getFrom().getSplitType())){//开始节点为鉴别模式时虚线
	    	if(this.drawMode == DRAWMODE.SVG){
	    		this.stroke.setAttribute("stroke-dasharray","7,7");
	    	}else{
	    		this.stroke.dashstyle = "LongDash";
	    	}
	    }else if(this.model){
    		if(this.drawMode == DRAWMODE.SVG){
    			try{
	    			this.stroke.removeAttribute("stroke-dasharray");
	    		}catch(e){}
	    	}else{
	    		this.stroke.dashstyle = "solid";
	    	}
	    }
	},
	repaint : function(){
		//计算两个节点的连线的起始坐标
		var w1 = 32, h1 = 32;
		var w2 = 32, h2 = 32;
		var x1 = this.model.getFrom().position[0], y1 = this.model.getFrom().position[1];
		var x2 = this.model.getTo().position[0], y2 = this.model.getTo().position[1];
		
		var x_1, y_1, x_2, y_2;
		
		if(x1 - x2 > 0){
			if(x1 < x2 + w2){
				x_1 = x2 + w2 - (x2 + w2 - x1)/2
				x_2 = x2 + w2 - (x2 + w2 - x1)/2
			}else{
				x_1 = x1;
				x_2 = x2 + w2;
			}
		}else{
			if(x2 < x1 + w1){
				x_1 = x1 + w1 - ( x1 + w1 - x2)/2;
				x_2 = x1 + w1 - ( x1 + w1 - x2)/2;
			}else{
				x_1 = x1 + w1;
				x_2 = x2;
			}
		}
		
		if(y1 - y2 > 0){
			if(y1 < y2 + h2){
				y_1 = y_2 = y2 + h2 - (y2 + h2 - y1)/2
			}else{
				y_1 = y1;
				y_2 = y2 + h2;
			}
		}else{
			if(y2 < y1 + h1){
				y_1 = y_2 = y1 + h1 - ( y1 + h1 - y2)/2;
			}else{
				y_1 = y1 + h1;
				y_2 = y2;
			}
		}
		if(this.drawMode == DRAWMODE.SVG && this.stroke){
			this.stroke.setAttribute("d",'M'+x_1+' '+y_1+'L'+(x_2-7)+' '+y_2);
			this.el.dom.appendChild(this.stroke);//解决IE10/11不更新的问题
		}else{
			this.el.dom.from = x_1+","+y_1;
	    	this.el.dom.to = x_2+","+y_2;
    	}
	},
	setFrom : function(from){
		this.from = from;
		if(this.drawMode == DRAWMODE.SVG){
		}else{
			this.el.dom.from = from[0]+","+from[1];
		}
	},
	setTo : function(to){
		this.to = to;
		if(this.drawMode == DRAWMODE.SVG){
			this.stroke.setAttribute("d",'M'+this.from[0]+' '+this.from[1]+'L'+this.to[0]+' '+this.to[1]);
			this.el.dom.appendChild(this.stroke);//解决IE10/11不更新的问题
		}else{
			this.el.dom.to = to[0]+","+to[1];
		}
	},
	getFrom : function(){
		return this.from;
	},
	getTo : function(){
		return this.to;
	},
	selected : function(select){
		if(select){
			if(this.drawMode == DRAWMODE.SVG){
				this.stroke.style.stroke="green";
			}else{
				this.el.dom.strokecolor = "green";
			}
		}else{
			if(this.drawMode == DRAWMODE.SVG){
				this.stroke.style.stroke="black";
			}else{
				this.el.dom.strokecolor = "black";
			}
		}
	},
	addSelectListeners : function(){
		var el = this.el;
		var model = this.model;
		var p = [0,0];
		var Wrapper = this.Wrapper;
		el.on("mouseover",function(e){
//			if(!model.selected){
//				model.select(true);
//			}
			Wrapper.setMouseover(model);
		});
		el.on("mouseout",function(e){
			Wrapper.setMouseover(null);
		});
	},
	getDrawMode : function(){//获取线条绘制方式
		if(!!document.createElementNS &&
			!!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect){
			return DRAWMODE.SVG;
		}else{
			return DRAWMODE.VML;
		}
		
	},
	createSVG : function(tag,attrs){ //生成SVG标签元素
		var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        return el;
	},
	addArrawMarker : function(dom){ //添加SVG箭头标识定义
		 
	    if(document.getElementsByTagName("defs").length==0){
	    	
	    	this.defs = this.createSVG("defs",{
	    				style:"overflow:auto"
	    			});
	    	this.marker  = this.createSVG('marker',{
	    		id : "markerArrow",
	    		markerWidth : "13",
	    		markerHeight : "13",
	    		refx : "2",
	    		refy : "6",
	    		orient : "auto",
	    		style:"overflow:auto"
	    	})
	    	
    		this.path = this.createSVG('path',{
	    		d : "M2,-5 L2,-5 L7,0 L2,7",
	    		style : "fill: #000000;"
	    	})
	    	this.marker.appendChild(this.path);
	    	this.defs.appendChild(this.marker);
	    	dom.appendChild(this.defs);
	    }
	}
})

