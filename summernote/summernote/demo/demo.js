/*! 
 * WeX5 v3 (http://www.justep.com) 
 * Copyright 2015 Justep, Inc.
 * Licensed under Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0) 
 */
define(function(require) {
	var $ = require("jquery");

	//引入bootstrap
	require("css!$UI/system/components/bootstrap/lib/css/bootstrap").load();
	require("$UI/system/components/bootstrap/lib/js/bootstrap");
	
	// https://github.com/FortAwesome/Font-Awesome
	require("css!../Font-Awesome/css/font-awesome.min").load();
	// https://github.com/summernote/summernote
	require("css!../css/summernote").load();
	
	require("../js/summernote");
	//引入语言，修改了代码采用模块化,其他语言使用时需要同样模块化处理，请参考../js/lang/summernote-zh-CN修改
	require("../js/lang/summernote-zh-CN");

	var Model = function() {
		this.callParent();
	};

	Model.prototype.modelLoad = function(event) {
		this.initNotes();
	};

	Model.prototype.initNotes = function() {
      $('.summernote',this.getRootNode()).summernote({
        height: 200,
        lang: 'zh-CN'
      });
	};
	
	return Model;
});