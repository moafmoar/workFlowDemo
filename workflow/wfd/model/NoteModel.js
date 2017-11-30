/*
 * 标注模型
 */
NoteModel = function(config){
	this.type = StateMonitor.NOTE;
	
	this.attributes = {
		x : 0,
		y : 0,
		width : 100,
		height : 50,
		italic: false,
		font: '',
		size: '12',
		bold: false,
		border: true,
		color : '',
		borderColor : '',
		text : ""
	}
	if(config && config.x && config.y){
		this.setPosition([config.x,config.y]);
	}
	this.setController(new NoteController(this));
}
Ext.extend(NoteModel,MetaModel,{
	getX : function(){
		return this.attributes.x;
	},
	getY : function(){
		return this.attributes.y;
	},
	setWidth : function(width){
		this.attributes.width = width;
	},
	getWidth : function(){
		return this.attributes.width;
	},
	setHeight : function(height){
		this.attributes.height = height;
	},
	getHeight : function(){
		return this.attributes.height;
	},
	setItalic :function(italic){
		this.attributes.italic = italic;
	},
	getItalic : function(){
		return eval(this.attributes.italic) ? 'true':'false';
	},
	setFont : function(font){
		this.attributes.font = font;
	},
	getFont : function(){
		return this.attributes.font;
	},
	setSize : function(size){
		this.attributes.size = size;
	},
	getSize : function(){
		return this.attributes.size;
	},
	setBold : function(bold){
		this.attributes.bold = bold;
	},
	getBold : function(){
		return eval(this.attributes.bold) ? 'true':'false';
	},
	setBorder : function(border){
		this.attributes.border = border;
	},
	getBorder : function(){
		return eval(this.attributes.border) ? 'true':'false';
	},
	setColor : function(color){
		this.attributes.color = color;
	},
	getColor : function(){
		return this.attributes.color;
	},
	setBorderColor : function(borderColor){
		this.attributes.borderColor = borderColor;
	},
	getBorderColor : function(){
		return this.attributes.borderColor;
	},
	setText : function(text){
		this.attributes.text = text;
	},
	getText : function(){
		return this.attributes.text;
	},
	
	//-----
	setPosition : function(p){
		this.setP(p);
		this.fire(Controller.SETPOSITION,p);
	},
	setP : function(p){
		this.position = p;
		if(this.attributes){
			this.attributes.x = p[0];
			this.attributes.y = p[1];
		}
	},
	move : function(differ){
		var p = [(this.position[0]+differ[0]),(this.position[1]+differ[1])];
		this.setPosition(p)
		
	},
	select : function(select){
		this.selected = select;
		this.fire(Controller.SELECTED,select);
	},
	getAttributes :function(){
		return this.attributes;
	},
	remove : function(){
		this.fire(Controller.REMOVE);
		this.setController(null);
	}
});