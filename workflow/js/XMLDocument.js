/**
 * <p>Title: </p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) www.wanwei.com.cn 2007</p>
 * @author <a href="malito:denglq@wanwei.com.cn">邓利强</a>
 */

function XMLDocument() {
}

//创建XML对象
XMLDocument.newDomcument = function () {
    
	if (window.ActiveXObject) { // code for IE browser
		return new ActiveXObject("Microsoft.XMLDOM");
	} else if (document.implementation
			&& document.implementation.createDocument) {//form com compliant browsers
		return document.implementation.createDocument("", "", null);
	} else { 
		alert("Your browser cannot handle this script");
	}
};

// 装载XML
XMLDocument.loadXML = function(xml){
	var xmlDoc = null;
	
	//清理xml，解决谷歌、火狐、ie8+ 浏览器无法解决的问题
	xml = XMLDocument.cleanXML(xml);
	
	if (window.ActiveXObject){ // code for IE browser
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.loadXML(xml);
	} else{　//form COM compliant browsers 
		xmlDoc = new DOMParser().parseFromString(xml,'text/xml');
	}  
	return xmlDoc;
}

//格式化XML，用于xml展示
XMLDocument.formatXML = function(text)
{
	function str_repeat( str, count ) {
	    var result = '';
	    for (var i=0; i < count; i++) {
	        result += str;
	    }
	    return result;
	}
    if(text){
    	text = text.replace(/\>/g, ">\n" );
        text = text.replace(/\</g, "\n<" );
        text = text.replace(/\n+/g, "\n" );
        
        var _xml = text.split("\n");
        var indent = 0;
        var value;
        for (var i = 0; i < _xml.length; i++) {
        	value = _xml[i];
            if ( value.match(/<\?/) || value.match(/<!/ ) ) {
                continue;
            } else if ( value.match(/<\// ) ) {
                indent--;
            }

            value = str_repeat( '    ' , indent ) + value;
            _xml[i] = value;
            if ( !value.match(/\//) && value.match(/</) ) {
                indent++;
            }
        }

        text = _xml.join("\n");
        
    	var re = / /g;
    	text = text.replace (re, "&nbsp;");

    	re = /\t/g;
    	text = text.replace (re, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");

    	re = /\<\s*(\/?)\s*([^\r]*?)\s*(\/?)\s*\>/g;
    	text = text.replace (re,"{blue:&lt;$1}{maroon:$2}{blue:$3&gt;}");

    	re = /{(\w*):([^\r]*?)}/g;
    	text = text.replace (re,"<span style='color:$1'>$2</span>");

    	re = /"(.*?)"/g;
    	text = text.replace (re,"\"<span style='color:purple'>$1</span>\"");

    	re = /\r\n|\r|\n/g;
    	text = text.replace (re, "<br/>");
    }
	return text;
}

// 格式化xml,去除换行及标签之间的空格
// 解决默认初始话的流程模版在谷歌、火狐、ie8+浏览器上无法解析的问题
// 2014.5.20 huangt 

/**
* @description 格式化xml,去除换行及标签之间的空格 
* @description 解决默认初始话的流程模版在谷歌、火狐、ie8+浏览器上无法解析的问题
* @param {String} text  流程描述XML字符串
* @auther huangt 
* @date 2014.5.20
*/ 
XMLDocument.cleanXML = function(text){
	text = text.replace(/\r\n|\n/g, "" );
	text = text.replace(/\s+(<)/g, "<" );
	return text;
}