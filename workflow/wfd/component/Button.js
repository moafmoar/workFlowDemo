/**
 * UI组件,Button类
 *
 * @author zhangjing</a>
 */
LeftBar = function(container){
	this.el = new Ext.Element(document.createElement("table"));
	this.el.dom.className = "WORKFLOW_UI_FONT WORKFLOW_UI_TOOLBAR";
	this.el.cellSpacing = 0;
	this.el.cellSpacing = 0;
	this.el.setWidth("100%");
//	this.el.setHeight("100%");
	this.buttonlist = new Array();
	if(container){
//		document.getElementById(container).appendChild(this.el.dom);
	}
	this.addEvents("test");
}
Ext.extend(LeftBar,Ext.BoxComponent,{
	initComponent : function(){
		
	},
	addButton : function(button,text){
		if(button&&button.getEl()&&button.getEl().dom){
			var row = this.el.dom.insertRow(-1);
			row.align="center";
			var itemCell = row.insertCell(-1);
		    itemCell.appendChild(button.getEl().dom);
		    this.buttonlist.push(button);
		    if (text) {
		    	var txtrow = this.el.dom.insertRow(-1);
		        var txtCell = txtrow.insertCell(-1);
		        txtCell.innerHTML = text;
		        txtCell.valign = "middle";
		        txtCell.align = "center";
		        txtCell.className = "WORKFLOW_UI_BUTTON_TXTCELL";
		//        if (!image) {
		//            this.txtCell.style.paddingLeft = "5px";
		//            this.txtCell.style.paddingRight = "5px";
		//        }
		    }
		    
		    button.setContainer(this);
		}
	},
	pressdown : function(state){
		for(var i=0;i<this.buttonlist.length;i++){
			if(this.buttonlist[i].id == state){
				this.buttonlist[i].press(true);
			}else{
				this.buttonlist[i].press(false);
			}
		}
	},
	getModel : function(){
		return this.model;
	},
	setModel : function(model){
		this.model = model;
	}
})
 
 
 
function Button(id,image, text) {

    this.id = id;
    this.container = null;
	this.el = new Ext.Element(document.createElement("table"));
	this.el.cellSpacing = 0;
	this.el.cellSpacing = 0;
	this.el.dom.className = "WORKFLOW_UI_FONT WORKFLOW_UI_BUTTON";
	this.el.id = id;
	
	this.pressed = false;
    //
    var row = this.el.dom.insertRow(-1);

    //
    if (image) {
        var imageIcon = document.createElement("img");
        imageIcon.src = image;
//        imageIcon.className = "WORKFLOW_UI_BUTTON_IMGCELL";
        this.imgCell = row.insertCell(-1);
//        this.imgCell.style.backgroundImage = "url("+image+")";
//        this.imgCell.style.backgroundPosition = "center center";
//        this.imgCell.style.backgroundRepeat = "no-repeat";
        this.imgCell.appendChild(imageIcon);
        this.imgCell.valign = "middle";
        this.imgCell.align = "center";
    } else {
        this.imgCell = null;
        if (!text) {
            text = "&nbsp;";
        }
    }
    //
    if (text) {
    	var txtrow = this.el.dom.insertRow(-1);
        this.txtCell = txtrow.insertCell(-1);
        this.txtCell.innerHTML = text;
        this.txtCell.valign = "middle";
        this.txtCell.align = "center";
        this.txtCell.className = "WORKFLOW_UI_BUTTON_TXTCELL";
    } else {
        this.txtCell = null;
    }
    var _this = this;
    
    this.el.on("mousedown",function(){
    	if(!_this.pressed){
			_this.container.getModel().setState(this.id);
		}
    });
    
    this.el.on("mouseover",function(){
		if(!_this.pressed){
			this.dom.className = "WORKFLOW_UI_FONT WORKFLOW_UI_BUTTON WORKFLOW_UI_BUTTON_OVER";
		}
	});
	this.el.on("mouseout",function(){
		if(!_this.pressed){
			this.dom.className = "WORKFLOW_UI_FONT WORKFLOW_UI_BUTTON";
		}
	});
    
//    this.addButtonListeners();
}

Ext.extend(Button,Ext.BoxComponent,{
	press : function(pressed){
		if(pressed){
			this.el.dom.className = "WORKFLOW_UI_FONT WORKFLOW_UI_BUTTON WORKFLOW_UI_BUTTON_PRESSED";
		}else{
			this.el.dom.className = "WORKFLOW_UI_FONT WORKFLOW_UI_BUTTON";
		}
		this.pressed = pressed;
	},
	setContainer : function(container){
		this.container = container;
	}
})


