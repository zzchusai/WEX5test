define(function(require){
	var $ = require("jquery");
	var justep = require("$UI/system/lib/justep");

	return {
		prePath: '/../model/UI2/jbFile/', //上传路径前缀
//		prePath: '/webapps/jbFile/', //上传路径前缀,服务器
		path: {
			'userAvatar': 'user/avatar/', //用户头像
			'enterPriseLicense': 'user/license/', //营业执照
			
			'faultImage': 'service/fault/faultImage/', //故障申请图片
			'faultVideo': 'service/fault/faultVideo/',	//故障申请视频
			
			'partThumb': 'part/partThumb/', //配件列表缩略图
			'partDetail': 'part/partDetail/', //配件详情轮播图
			
			'serviceCoverPhoto':'services/serviceCoverPhoto/', //服务资料详情封面图片
			'servicesFile':'services/servicesFile/', //服务资料文件
			
			'goodsThumb': 'goods/goodsThumb/', //产品列表缩略图
			'goodsDetail': 'goods/goodsDetail/', //产品详情轮播图
			'goodsVideo': 'goods/goodsVideo/', //产品视频
			'goods3D': 'goods/goods3D/', //产品3D模型
			"goodsVRPic":'goods/goodsVRPic/', //产品3d图片
			
			'msgImage': 'message/image/', //留言板图片
			'msgVideo': 'message/video/', //留言板视频
			'msgVoice': 'message/voice/', //留言板语音
			'msgFiles': 'message/files/', //留言板文件
			
			'resumeAvatar': 'recruit/resume/avatar/', //简历头像
			'resumeCardFront': 'recruit/resume/cardFront/', //简历身份证正面
			'resumeCardBack': 'recruit/resume/cardBack/', //简历身份证反面
			'companyLogo': 'recruit/position/companyLogo/',  //企业LOGO
			
			'articleIamge': 'find/articleThumb/', //文章列表缩略图
			
			'adBanner': 'ad/adBannerImage/', //广告轮播图
			
			"settingLogo":'setting/settingLogo/', //平台LOGO
			'rtxt':'rtxt/' //产品富文本图片
		},
		
		/**
		 * 获取文件保存路径
		 * @param pathName {String} 路径名称
		 * @param uid {Number} 用户id（选填）
		 * @returns {String} 路径地址
		 */
		getSavePath: function(pathName, uid) {
			if (uid === undefined) {
				return this.prePath + this.path[pathName];
			} else {
				return this.prePath + this.path[pathName] + uid + '/';
			}
		},
		
		/**
		 * 获取文件路径地址
		 * @param jsonFile {String} 数据库文件JSON字符串
		 * @param pathName {String} 路径名称
		 *  @param uid {Number} 用户id（选填）
		 * @returns pathUrl {String} 路径地址（多个路径英文逗号分隔字符串）
		 */
		getPath: function(jsonFile, pathName, uid) {
			var pathUrl = '';
//			var prePath = '/jbFile/'; //服务器
			var prePath = '../../jbFile/'; //本地调试
			var self = this;
			
			if (jsonFile && jsonFile !== '[]') {
				var objImg = JSON.parse(jsonFile);
				
				if (typeof objImg != 'object') { return false }
				
				var urlArray = [];
				objImg.forEach(function(item) {
					var storeFileName = item.storeFileName; //文件名
					if (uid === undefined) {
						urlArray.push(prePath + self.path[pathName] + storeFileName);
					} else {
						urlArray.push(prePath + self.path[pathName] + uid + '/' + storeFileName);
					}
					
				});
				
				pathUrl = urlArray.join(',');
			}
			
			return pathUrl;
		},
		
		/**
		 * 初始化attachmentSimple组件自定义内容
		 * @param options {Object}
		 * 	{
		 * 		el: {Object} attachmentSimple组件对象
		 * 		data: {Object} 绑定数据组件对象
		 * 		colName: {String} 数据字段命
		 * 		pathName: {String} 上传路径名称
		 * 		number: {Integer}（可选，默认1）可上传文件数量
		 * 		type: {String} （可选，默认all）上传文件类型（参数值 pic：图片，video：视频，3d：obj文件，all：所以文件）
		 * 		isMultiple: {Boolean} （可选，默认false）是否可以多选
		 * 		onlyOne: {Boolean} （可选，默认false）只上传一个文件，继续上传会被替换
		 * 		uid: {Number} （可选，默认空字符串） 路径需要用户id的时候传参
		 * 	}
		 */
		attInit: function(options) {
			//设置可选参数默认值
			if (options.number === undefined) { options.number = 1; }
			if (options.type === undefined) { options.fileType = 'all'; }
			if (options.isMultiple === undefined) { options.isMultiple = false; }
			if (options.onlyOne === undefined) { options.onlyOne = false; }
			if (options.uid === undefined) { options.uid = ''; }
			
			//获取attachmentSimple组件文件上传对象
			var attUploader = options.el.uploader;
			
			//修改组件上传路径
			attUploader.exdata.Path = this.getSavePath(options.pathName) + options.uid;
//			console.log(this.getSavePath(options.pathName) + options.uid)
			//设置多选
			if (options.isMultiple) {
				$(attUploader.inputElement).attr('multiple', 'multiple');
			}
			
			//设置删除按钮隐藏
			if (options.onlyOne) {
				if (options.el.domNode.querySelector('.x-item-remove')) {
					$(options.el.domNode.querySelector('.x-item-remove')).addClass('x-upload-hide');
				}
			}
			
			//绑定上传组件文件选择事件
			attUploader.on('onFileSelected', function(event) {
				//限制文件类型
				var strFileType = event.file.type.slice(0, event.file.type.indexOf('/')); //image|video
				var strFileName = event.file.name;
				
				if (options.type == '3d' && !/\.obj$/.test(strFileName)) {
					justep.Util.hint('文件类型错误，请选择obj文件', { 'style': 'position:fixed' });
					event.cancel = true;
					return false;
				}
				
				if (options.type == 'pic' && strFileType != 'image') {
					justep.Util.hint('文件类型错误，请选择图片', { 'style': 'position:fixed' });
					event.cancel = true;
					return false;
				}
				
				if (options.type == 'video' && strFileType != 'video') {
					justep.Util.hint('文件类型错误，请选择视频', { 'style': 'position:fixed' });
					event.cancel = true;
					return false;
				}
				
				switch (strFileType) {
					case 'image':
						if (!/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(event.file.type)) {
							justep.Util.hint('只能上传 gif、jpg、png 格式的图片', { 'style': 'position:fixed' });
							event.cancel = true;
							return false;
						}
						break;
					case 'video':
						if (!/(mp4)$/.test(event.file.type)) {
							justep.Util.hint('只能上传 mp4格式的视频', { 'style': 'position:fixed' });
							event.cancel = true;
							return false;
						}
						break;
					default:
						break;
				}
				
				/**
				 * 设置单张替换
				 * 如果设置单张替换，会在上传文件的时候清空字段，替换原来的数据
				 */
				if (options.onlyOne) {
					//清空字段值
					options.data.getCurrentRow().val(options.colName, '');
				}
				
				//限制文件大小
				var intFileSize = 50485760;
				if (event.file.size > intFileSize) {
				    justep.Util.hint('上传的文件大小不能超过50Mb', { 'style': 'position:fixed' });
				    event.cancel = true;
				    return false;
				}
				
				//限制文件每次选择数量
				if (!options.isMultiple && event.files.length > 1) {
					justep.Util.hint('每次只能选择单个文件', { 'style': 'position:fixed' });
					event.cancel = true;
					return false;
				}
				
				//限制文件总上传数量
				var fileJson = options.data.getValue(options.colName);
				if( typeof(fileJson) != 'undefined' && fileJson != '' && $.parseJSON(fileJson).length >= options.number) {
				    justep.Util.hint('只能上传'+options.number+'个文件', { 'style': 'position:fixed' });
				    event.cancel = true;
				    return false;
				}
			});
		}
	}
});