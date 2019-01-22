define(function(require) {
	var justep = require("$UI/system/lib/justep");
	require("jquery");
	require("css!$UI/system/components/bootstrap/lib/css/bootstrap").load();
	require("$UI/system/components/bootstrap/lib/js/bootstrap");
	require("css!../Font-Awesome/css/font-awesome.min").load();
	require("css!../css/summernote").load();
	require("./summernote");
	require("./lang/summernote-zh-CN");
	
	var getFile = require('$UI/jinBaoAdmin/js/getFilePath');
//	var prePath = '/jbFile/'; //服务器打包
	var prePath = '../../jbFile/'; //本地调试
	
	/*上传文件*/
	function sendFile(files, el) {
		var data = new FormData();
        data.append("ajaxTaskFile", files[0]);
        imgUpLoadFwb(files, el)
        return false;
	}
	
	/*压缩文件，请求接口*/
	function imgUpLoadFwb(files, el) {
		var file = files[0];
		var arrFileName = file.name.split(".");
		var strFileType = file.type;
		var intSize = file.size;
	    var fileName = (new justep.UUID()).valueOf();
	    
	    var reader = new FileReader();
	    reader.readAsDataURL(file);
	    
	    reader.onload = function() {
	    	var image = new Image();
	    	image.src = this.result;
	    	image.onload = function() {
	    		var width = this.width;
	    		var height = this.height;
	    		var compImg = compress(this, width, height, 0.4);
	    		var strImg = compImg.split("data:image/jpeg;base64,")[1];
	    		justep.Baas.sendRequest({
					"url" : "/comUser/File_action",
					"action" : "saveImage",
					"async" : false,
					"params" : {
						"compImg" : strImg,
						"fileName" : fileName,
						"path" : getFile.getSavePath('rtxt')
					},
					"success" : function(data) {
						if(data.returnFlag==1){
							var url = prePath + getFile.path['rtxt'] + fileName;
							el.summernote('insertImage', url);
						}
					}
	    		});
	    	}
	    }
	}
	
	/*压缩图片*/
	function compress(elem, width, height, ratio){
		var canvas, ctx
		canvas = document.createElement('canvas');        
		canvas.width = width;
		canvas.height = height;
		 
		ctx = canvas.getContext('2d');        
		ctx.drawImage(elem, 0, 0, elem.width, elem.height);
		      
		var img64 = canvas.toDataURL("image/jpeg", ratio);
		
		return img64;
	}
	
	(function($) {
		justep.Bind.bindingHandlers.summernote = {
			init : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
				$(element).summernote({
					height:200,
					maxHeight : 185,
					lang : 'zh-CN',
					fontNames: ['微软雅黑', '隶书', '宋体','楷体','幼圆','仿宋'],
					tabsize: 2,
					disableDragAndDrop: true,
					 dialogsFade: true,
					 dialogsInBody: true,
					fontSizes: ['12', '13', '14', '15', '16', '17', '18', '19', '20','21','22','23','24'],
					 toolbar: [
		                        ['style', ['bold', 'italic', 'underline', 'clear']],
		                        ['fontsize', ['fontsize']],
		                        ['insert',['picture','link','table','hr']],
		                        ['fontname',['fontname']],
		                        ['color', ['color']],
		                        ['para', [ 'paragraph']],
		                        ['height', ['height']],
		                        ['view', ['undo', 'redo']]//撤销  //回复
		             ],
		             popover: {
		            	  image: [
		            	    ['imagesize', ['imageSize100','imageSize90', 'imageSize70','imageSize50','imageSize30', 'imageSize10']],
		            	    ['float', ['floatLeft', 'floatRight', 'floatNone']],
		            	    ['remove', ['removeMedia']]
		            	  ],
		            	  link: [
		            	    ['link', ['linkDialogShow', 'unlink']]
		            	  ],
		            	  air: [
		            	    ['color', ['color']],
		            	    ['font', ['bold', 'underline', 'clear']],
		            	    ['para', ['ul', 'paragraph']],
		            	    ['table', ['table']],
		            	    ['insert', ['link', 'picture']]
		            	  ]
		            	},
		            
					callbacks : {
						onBlur : function() {
							var value = valueAccessor();
							if (justep.Bind.isWriteableObservable(value)) {
								value.set($(element).summernote('code'));
							}
						},
						onImageUpload: function(files) {
							sendFile(files, $(element));
						}
						
					}
				});
			},
			update : function(element, valueAccessor, allBindings) {
				var value = valueAccessor();
				var valueUnwrapped = justep.Bind.unwrap(value);
				valueUnwrapped === undefined && (valueUnwrapped = null);
				$(element).summernote('code', valueUnwrapped);
			},
			summerNoteClick:function(){
			}
		};
	})(jQuery);
});