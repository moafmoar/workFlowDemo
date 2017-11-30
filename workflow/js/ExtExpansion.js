/**
 * @class Ext.grid.TableGrid
 * @extends Ext.grid.Grid
 * A Grid which creates itself from an existing HTML table element.
 * @constructor
 * @param {String/HTMLElement/Ext.Element} table The table element from which this grid will be created - 
 * The table MUST have some type of size defined for the grid to fill. The container will be 
 * automatically set to position relative if it isn't already.
 * @param {Object} config A config object that sets properties on this grid and has two additional (optional)
 * properties: fields and columns which allow for customizing data fields and columns for this grid.
 * @history
 * 2007-03-01 Original version by Nige "Animal" White
 * 2007-03-10 jvs Slightly refactored to reuse existing classes
 */
Ext.grid.TableGrid = function(table, config) {
  config = config || {};
  Ext.apply(this, config);
  var cf = config.fields || [], ch = config.columns || [];
  table = Ext.get(table);

  var ct = table.insertSibling();

  var fields = [], cols = [];
  var headers = table.query("thead th");
  for (var i = 0, h; h = headers[i]; i++) {
    var text = h.innerHTML;
    var name = 'tcol-'+i;

    fields.push(Ext.applyIf(cf[i] || {}, {
      name: name,
      mapping: 'td:nth('+(i+1)+')/@innerHTML'
    }));

    cols.push(Ext.applyIf(ch[i] || {}, {
      'header': text,
      'dataIndex': name,
      'width': h.offsetWidth,
      'tooltip': h.title,
      'sortable': true
    }));
  }

  var ds  = new Ext.data.Store({
    reader: new Ext.data.XmlReader({
      record:'tbody tr'
    }, fields)
  });

  ds.loadData(table.dom);

  var cm = new Ext.grid.ColumnModel(cols);

  if (config.width || config.height) {
    ct.setSize(config.width || 'auto', config.height || 'auto');
  } else {
    ct.setWidth(table.getWidth());
  }

  if (config.remove !== false) {
    table.remove();
  }

  Ext.applyIf(this, {
    'ds': ds,
    'cm': cm,
    'sm': new Ext.grid.RowSelectionModel(),
    autoHeight: true,
    autoWidth: false
  });
  Ext.grid.TableGrid.superclass.constructor.call(this, ct, {});
};

Ext.extend(Ext.grid.TableGrid, Ext.grid.GridPanel);

/**
 * 重写BaseForm findField方法，可以form.form.setValues({lrb1:true,lrb2:true,lrb4:true,lrb5:true,lrb7:true});对checkboxgroup进行赋值
 * from http://www.javaeye.com/topic/250048?page=1
 */
Ext.override(Ext.form.BasicForm,{   
    findField : function(id){
        var field = this.items.get(id);           
        if(!field){
           this.items.each(function(f){
           		if(f.isXType('radiogroup')||f.isXType('checkboxgroup')){
//           			if(f.isFormField && (f.dataIndex == id || f.id == id || f.getName() == id  || f.name==id)){
//	                    field = f;   
//	                    return false;   
//	                }
                   f.items.each(function(c){
                       if(c.isFormField && (c.dataIndex == id || c.id == id ||  c.getName() == id)){   
                           field = c;
                            return false;
                        }   
                    });   
                }
                
                if(f.isFormField && (f.dataIndex == id || f.id == id || f.getName()==id)){
                    field = f;   
                    return false;
                }
            });   
       }
       return field || null;   
    },
    findFieldLike : function(id){
    	var items = new Array();
           this.items.each(function(f){
                if(f.isFormField &&  f.getName()&& id && f.getName().indexOf(id)==0&&(f.getName().length >= id.length)){
                    items.push(f);
                }
            });   
       return items;
    }    
});
//
Ext.override(Ext.TabPanel,{   
  hideTabStripItem : function(item){
        item = this.getComponent(item);
        var el = this.getTabEl(item);
        if(el){
            el.style.display = 'none';
            this.delegateUpdates();
        }
        this.stack.remove(item);
    },
    hiddenTab : function(hidden,activeTab){
    	
    	for(var i=0;i<this.items.length;i++){
    		this.unhideTabStripItem(i);
    	}
    	if(hidden){
    		for(var i=0; i<hidden.length; i++){
	    		this.hideTabStripItem(hidden[i]);
	    	}
    	}
    	this.setActiveTab(activeTab);
    }
});

Ext.override(Ext.form.RadioGroup,{
	getName: function(){
         return this.name?this.name:'';
    },
    /**
     * 
     */
    getValue : function(){
    	var result = "";
    	this.items.each(function(c){
    		if( c.checked){
    			result = c.inputValue;
    			return false;
    		}
		});
		return result;
    },
    setValue : function(value){
		this.items.each(function(c){
           if(c.isFormField){
	           		if(value == c.inputValue){
	           			try{
			           	c.setValue(true);
			           	}catch(e){}
	           		}else{
	           			try{
			           	c.setValue(false);
			           	}catch(e){}
	           		}
            }
        });
    }
});
Ext.override(Ext.form.CheckboxGroup,{
	getName: function(){
         return this.name?this.name:'';
    },
    /**
     * 
     */
    getValue : function(){
    	var result = [];
    	this.items.each(function(c){
    		if( c.checked){
    			result[result.length] = c.inputValue;
    		}
		});
		return result;
    },
    /**
     * 
     */
    setValue : function(values){
    	if(Ext.isArray(values)){
    		this.items.each(function(c){
			           if(c.isFormField){
				           	try{//TODO 这里抛异常，不知道为什么，待查
				           		 c.setValue(false);
				           	}catch(e){}
			            }   
			        });
    		for(var i=0;i<values.length;i++){
    			var value = values[i];
    			this.setV(value);
    		}
    	}else{
//			alert('err: type of checkboxgroup\'s value is not array');	
    	}
    },
    setV : function(value){
    	var f = null;
    	this.items.each(function(c){
			           if(c.isFormField && c.inputValue == value){
			               try{	
				           		 c.setValue(true);
				           	}catch(e){ }
			                return false;   
			            }   
			        });
    }
});

/**
 * 颜色选择器
 */
Ext.app.ColorField = Ext.extend(Ext.form.TriggerField, {
	    initComponent : function(){
	        Ext.app.ColorField.superclass.initComponent.call(this);
	    },
	    readOnly : true,
	    validationEvent:false,
	    validateOnBlur:false,
	    triggerClass:'x-form-date-trigger',
	    hideTrigger:false,
	    
		menuListeners : {
	        select: function(m, d){
	            this.setValue("#"+d);
	        },
	        show : function(){
	        	this.onFocus();
	        },
	        hide : function(){
	            this.focus.defer(10, this);
	            var ml = this.menuListeners;
	            this.menu.un("select", ml.select,  this);
	            this.menu.un("show", ml.show,  this);
	            this.menu.un("hide", ml.hide,  this);
	        }
	    },
	    onTriggerClick : function(){
	         if(this.disabled){
	            return;
	        }
	        if(this.menu == null){
	            this.menu = new Ext.menu.ColorMenu();
	        }
	        this.menu.on(Ext.apply({}, this.menuListeners, {
	            scope:this
	        }));
	        this.menu.show(this.el, "tl-bl?");
	    },
	    getValue : function(){
	        return Ext.app.ColorField.superclass.getValue.call(this) || "";
	    },
	    setValue : function(value){
	        Ext.app.ColorField.superclass.setValue.call(this, value);
	    },
	    reset : function(){
	    	this.setValue("");
	    }
	});
	
	Ext.applyIf(Array.prototype, {
		clone : function(){
			var n = new Array();
			for(var i = 0; i<this.length; i++){
				n.push(this[i]);
			}
			return n;
		}
	});
	
//Ext.override(Ext.form.DateField,{
//    getValue : function(){
//        return this.parseDate(Ext.form.DateField.superclass.getValue.call(this)) || "";
//    },
//    setValue : function(date){
//        Ext.form.DateField.superclass.setValue.call(this, this.formatDate(this.parseDate(date)));
//    },
//
//    // private
//    parseDate : function(value){
//        if(!value || Ext.isDate(value)){
//            return value;
//        }
//        var v = Date.parseDate(value, this.format);
//        if(!v && this.altFormats){
//            if(!this.altFormatsArray){
//                this.altFormatsArray = this.altFormats.split("|");
//            }
//            for(var i = 0, len = this.altFormatsArray.length; i < len && !v; i++){
//                v = Date.parseDate(value, this.altFormatsArray[i]);
//            }
//        }
//        return v;
//    }
//});

	