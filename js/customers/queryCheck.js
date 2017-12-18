var u = window.navigator.userAgent;
function scanFn(){
	//alert(111);
	try{
		if(u.indexOf('Android') > -1 || u.indexOf('Adr') > -1){
			//sys.toast('安卓' );
			window.Activity.nativeStartScan(0);
		}else if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
			//sys.toast('苹果' );
			window.webkit.messageHandlers.scan.postMessage(null);
		};
		
	}catch(e){
		
	}
}
function jsScanResult(result,isContinuousScanning){	
	//alert(result);
	queryVue.queryCode=result;
};
var queryVue = new Vue({
	el: '#container-wrapper',
	data: {
		queryCode: '',
		listData: [],
		selectedCode: '申通',
		selectedType: 'normal',
		selectedId: '申通',
		selectedValue: '申通',
		isIphone: false
	},
	created: function(){
		var self = this;
//		var queryInfo=JSON.parse(sessionStorage.getItem('queryCode'));
//		if(queryInfo){
//			//alert('22');
//			self.selectedCode = queryInfo.name;
//			self.queryCode = queryInfo.billcode;
//			self.selectedType = queryInfo.type;
//			self.selectedId = queryInfo.value;
//			self.selectedValue=queryInfo.value;
//			if(queryInfo.value){				
//				self.selectedCode = queryInfo.value;
//			}			
//		};
		if(localStorage.getItem('code')){
			self.queryCode = localStorage.getItem('code');
		}
		var _top = $('#querynum-info').offset().top + 45;
		$('.ui-popover').css({
			top: _top + 'px'
		});
	},
	methods: {
		isNullOfCode: function() {
			//alert('33');
			sessionStorage.removeItem('queryCode')
			this.selectedCode = '';
			this.selectedId = '';
			var _inputNum = this.queryCode.length;					
			this.popSelectExpress( );
		},
		popSelectExpress : function( ) {
			var self = this;
			if( self.queryCode.length >= 5 ) {				
				$.ajax({
					url: "http://kjgz.szmsd.com/query/queryAction!match.action?chars="+self.queryCode,
					type: 'get',
					dataType : 'jsonp',
					jsonp: 'jsoncallback',//与后台保持一致
					success : function( result ){
						if( result.length === 0 ) {
							$('.ui-popover').hide();
						}else{
							self.listData = result;
							$('.ui-popover').show();
						}						
						
					}					
				})
			
			}else {
				$('.ui-popover').hide();
			}
		},
		queryCodeFn: function( ) {
			var _type=encodeURI(encodeURI(this.selectedCode));
			var self = this;	
//			alert(this.selectedCode)
			sys.setLocalstorage('code',self.queryCode);
			if(this.queryCode != '' && this.selectedCode != '' ){				
				sys.requestDataNew('billinfo.findBillinfo',{
					billcode: self.queryCode
				},function(result){
					if(result.success && result.data.length!=0){
						sessionStorage.setItem('billDetail',JSON.stringify(result));
					}
				},function(){},function(){
					return false;
				});
				self.requestData(_type);
			}else{
				//self.popSelectExpress();
				sys.toast('请选择快递' );
			};
			//localStorage.setItem('code',self.queryCode);
		},
		selectedList:function( id, data, type ) {
			if( data === '其他快递' ) {
				$('.ui-popover').hide();
				window.location.href='otherExpress.html?billcode='+id;
				return;	
			}
			
			this.queryCode = id;
			this.selectedCode = data;
			this.selectedType = 'normal';			
			//$('#queryData')[0].value=data;
			$('.ui-popover').hide();
			this.requestData(encodeURI(encodeURI(data)));
		},
		requestData: function(name){
			var self = this;
			//显示等待框
			sys.loading('load');			
			$.ajax({
				url: "http://kjgz.szmsd.com/query/queryAction!query.action?billcode="+self.queryCode+"&aType="
				+self.selectedType+"&type="+name,
				type: 'get',
				dataType : 'jsonp',
				jsonp: 'jsoncallback',//与后台保持一致
				success : function( result ) {
					//隐藏等待框
					sys.loading('loadClose');						
					var _dataArr = [];
					sys.log('data',result);
					/*if( result.success ){						
						if(  !result.data || !result.data.track ) {
							sys.toast( result.message );
							return;
						}
						
						if( typeof result.data.track.billcode === 'undefined' ) {
							result.data.track.billcode = self.queryCode;
						}
						window.location.href= 'queryDetail.html';
						
						sessionStorage.setItem( 'dec_queryDetailPage_listData', JSON.stringify( result ) );
						
						//setHistotyRecord( );					
						$('.ui-popover').hide();
						
					} else {
						
						var _paramsEr = {
							id : self.selectedCode,//快递名字
							code : self.queryCode,//运单号
							name : self.selectedCode//快递名字
						};
						
						if( result.ec ) {
							_paramsEr = result.ec;
							_paramsEr.name = self.selectedCode;
							_paramsEr.code = self.queryCode;
						}
						
						window.location.href='resultFail.html?billcode='+self.queryCode;
						sessionStorage.setItem( 'dec_resultFailPage_company', JSON.stringify( _paramsEr ) );
					}*/
				},
				error : function( err ){				
					sys.toast('请求不到数据！');
					return false;
				}
			})
		}
	}
})
