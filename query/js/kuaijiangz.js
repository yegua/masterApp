var angularObj={};
var u = window.navigator.userAgent;
function scanFn(){
	try{
		if(u.indexOf("iPhone")!=-1 || u.indexOf("iPod")!=-1 || u.indexOf("iPad")!=-1 ){
			//sys.toast('苹果' );
			window.webkit.messageHandlers.scan.postMessage(null);
		}else{
			//sys.toast('安卓' );
			window.Activity.nativeStartScan(0);
		}		
	}catch(e){
		
	}
}
function jsScanResult(result,isContinuousScanning){	
	//alert(result);
	angularObj.queryCode=result;
	angularObj.popSelectExpress();
};

var app=angular.module( 'myApp', [ 'angular-gestures' ] ).config( function( hammerDefaultOptsProvider ){
	hammerDefaultOptsProvider.set( { recognizers: [[Hammer.Tap, {time: 250}]] } );
} ).controller( 'kjgzCtrl', function ( $scope, $timeout ) {		
		//进页面的时候就查询历史记录		
		var _historyData = JSON.parse(localStorage.getItem( 'dec_queryHistory_record' ));
		if(_historyData){
			getHistotyRecord();
		};
		$scope.listData = [];
		$scope.queryCode = '';
    	$scope.selectedId = '';
    	$scope.diabledColor = '#C5C3C3';
    	//跳转到选择快递公司列表页面存储快递公司的信息
		var queryCode=JSON.parse(sessionStorage.getItem('queryCode'));
		if(queryCode){
			//alert('22');
			$scope.selectedCode = queryCode.name;
			$scope.queryCode = queryCode.billcode;
			$scope.selectedType = queryCode.type;
			$scope.selectedId = queryCode.value;
			$scope.selectedValue=queryCode.value;
			$('#queryCode')[0].value=queryCode.billcode;
			$('#queryData')[0].value=queryCode.name;
			if(queryCode.value){
				$('#queryData')[0].value=queryCode.value;
				$scope.selectedCode = queryCode.value;
			}
			$scope.diabledColor = '#DE7D33';
			getHistotyRecord( );
		};
		console.log(queryCode);
		
		//直接输入订单号显示快递列表选择快递名后直接查询物流信息
		$scope.selectedList = function( id, data, type ) {
			if( data === '其他快递' ) {
				$('.ui-popover').hide();
				window.location.href='otherExpress.html?billcode='+id;
				return;	
			}
			
			$scope.queryCode = id;
			$scope.selectedCode = data;
			$scope.selectedType = 'normal';			
			$('#queryData')[0].value=data;
			$('.ui-popover').hide();
			requestData(encodeURI(encodeURI(data)));
		};
		
		//输入单号后执行事件
		$scope.isNullOfCode = function() {
			//alert('33');
			sessionStorage.removeItem('queryCode')
			$scope.selectedCode = '';
			$scope.selectedId = '';
			var _inputNum = $scope.queryCode.length;		
			$scope.diabledColor = ( _inputNum > 0 ) ? '#DE7D33' : '#C5C3C3';
			
			//自动显示选择公司列表
			//if( !sys.isIOS( ) ) { return; }
			
			$scope.popSelectExpress( );
		};
		//输入单号后直接弹出快递列表
		$scope.popSelectExpress = function( ) {
			
			if( $scope.queryCode.length >= 5 ) {				
				$.ajax({
					url: "http://kjgz.szmsd.com/query/queryAction!match.action?chars="+$scope.queryCode,
					type: 'get',
					dataType : 'jsonp',
					jsonp: 'jsoncallback',//与后台保持一致
					success : function( result ){
						if( result.length === 0 ) {
							$('.ui-popover').hide();
						}else{
							$scope.$apply(function(){
								$scope.listData = result;
							});
//									$scope.listData = result;

							$('.ui-popover').show();
						}						
						
					}					
				})
			
			}else {
				$('.ui-popover').hide();
			}
		};	
		
		//点击除列表以外的区域，隐藏快递列表
		$('html,body').not('.ui-popover').click(function(){
			$('.ui-popover').hide(500);
		})
		
		var _type=encodeURI(encodeURI($scope.selectedCode));
		console.log(_type);
		
		//点击查询获取物流信息
		$scope.queryCodeFn = function( ) {	
			$scope.diabledColor = 'rgba(255,140,0,.6)';
			if( $scope.queryCode && $scope.selectedCode.length !== 0 ){
				requestData(_type);
			}else {
				$scope.popSelectExpress( );
				sys.toast('请选择快递' );
			}
		};
		
		
		//获取历史物流信息
		$scope.historyQueryFn = function( result ){
			console.log(result);
			localStorage.removeItem( 'dec_queryDetailPage_listData', JSON.stringify( result ) );
			$timeout( function(){
				$scope.diabledColor = '#DE7D33';
				$scope.queryCode = result.billcode;
				//$scope.selectedId = result.billcode;
				$scope.selectedCode = result.type;
				$scope.selectedType = result.aType;
				
				if( $scope.selectedType !== 'normal' ){
					$scope.selectedValue = result.selectedValue;
				}
				//console.log(_type);
				requestData(encodeURI(encodeURI(result.type)));
			} );
		};
		
		
		//清除历史物流查询记录
		$scope.clearHistoryListFn = function() {
			localStorage.removeItem( 'dec_queryHistory_record' );
			
			$timeout( function(){
				$scope.historyToggle = false;
				$scope.historyListData = [];
			} );
		};
		
		//左滑删除每条历史记录
		$scope.deleteHistoryRecordFn = function( result ) {
			var _curHistoryData =  localStorage.getItem( 'dec_queryHistory_record' );
			_curHistoryData = JSON.parse( _curHistoryData );
			
			for( var _index = 0; _index < _curHistoryData.length; _index++ ){
				
				if( _curHistoryData[ _index ].billcode === result.billcode && _curHistoryData[ _index ].type === result.type  ) {
					//sys.log('data',_curHistoryData);
					//sys.log('res',_curHistoryData.splice( _index, 1 ));
					_curHistoryData.splice( _index, 1 );//把对应的数据给删除掉
					break;
				}
			}
			
			localStorage.setItem( 'dec_queryHistory_record', JSON.stringify( _curHistoryData ) );
			sys.log('_curHistoryData',_curHistoryData);
			if( _curHistoryData.length === 0 ) {
				$timeout( function(){
					$scope.historyToggle = false;
				} );
			}
			
			$timeout( function(){
				$scope.historyListData = _curHistoryData.reverse();
			} );
		};
		
		//从url里获取参数(扫描返回运单号)
		var _billcode=sys.getURL().billcode;
		if(_billcode){
			$scope.queryCode = _billcode;
			$('#queryCode')[0].value=_billcode;
			if(!$('#queryData')[0].value){
				$scope.popSelectExpress();
			}			
		}else{
			$scope.queryCode = '';			
		};
		
	
		//手动跳转选择快递列表
		$scope.pageToSelectExpress = function( ) {
			$scope.queryCode=$('#queryCode')[0].value;
			if( $scope.queryCode.length === 0 ) {
				sys.toast('请输入运单号' );	
				return;
			};
			window.location.href='selectExpress.html?billcode=' + $scope.queryCode;
			
		};
		
		//获取物流信息
		function requestData(name ) {
			//显示等待框
			sys.loading('load');
			
			$.ajax({
				url: "http://kjgz.szmsd.com/query/queryAction!query.action?billcode="+$scope.queryCode+"&aType="
				+$scope.selectedType+"&type="+name,
				type: 'get',
				dataType : 'jsonp',
				jsonp: 'jsoncallback',//与后台保持一致
				success : function( result ) {					
					var _dataArr = [];
					sys.log('data',result);
					if( result.success ){
						
						//隐藏等待框
						sys.loading('loadClose');
						
						if(  !result.data || !result.data.track ) {
							sys.toast( result.message );
							return;
						}
						
						if( typeof result.data.track.billcode === 'undefined' ) {
							result.data.track.billcode = $scope.queryCode;
						}
						window.location.href= 'queryDetail.html';
						
						localStorage.setItem( 'dec_queryDetailPage_listData', JSON.stringify( result ) );
						
						setHistotyRecord( );					
						$('.ui-popover').hide();
						
					} else {
						
						var _paramsEr = {
							id : $scope.selectedCode,//快递名字
							code : $scope.queryCode,//运单号
							name : $scope.selectedCode//快递名字
						};
						
						if( result.ec ) {
							_paramsEr = result.ec;
							_paramsEr.name = $scope.selectedCode;
							_paramsEr.code = $scope.queryCode;
						}
						
						window.location.href='resultFail.html?billcode='+$scope.queryCode;
						sessionStorage.setItem( 'dec_resultFailPage_company', JSON.stringify( _paramsEr ) );
					}
				},
				error : function( err ){				
					sys.toast('请求不到数据！');
				}
			})
		}
		
		//查看历史查询记录
		function getHistotyRecord( ) {
			//alert('11');
			var _curHistoryData =  localStorage.getItem( 'dec_queryHistory_record' );
			
			_curHistoryData = JSON.parse( _curHistoryData );
			
			console.log( '_curHistoryData',_curHistoryData);
			$timeout( function(){
				if( _curHistoryData ) {
					$scope.historyToggle = true;
					$scope.historyListData = _curHistoryData.reverse();
				}else {
					$scope.historyToggle = false;
				}
			} );
		}
		
		//保存历史记录
		function setHistotyRecord( ) {
			//alert('77');
			var _queryRecord = {
				billcode : $scope.queryCode,
				type : $scope.selectedCode,
				aType : $scope.selectedType
			};
			
			if( _queryRecord.aType !== 'normal' ){
				_queryRecord.selectedValue = $scope.selectedValue;
			}
			
			var _curHistoryData =  localStorage.getItem( 'dec_queryHistory_record' ),
				_curSaveToggle = false;
			_curHistoryData = JSON.parse( _curHistoryData );
			
			if( !_curHistoryData ) {
				_curHistoryData = [];
			}
			
			for( var _index = 0; _index < _curHistoryData.length; _index++ ){
				if( _curHistoryData[ _index ].billcode === $scope.queryCode && _curHistoryData[ _index ].type === $scope.selectedCode  ) {
					_curSaveToggle = true;
				}
			}
			
			if( !_curSaveToggle ) {
				_curHistoryData.push( _queryRecord );
				localStorage.setItem( 'dec_queryHistory_record', JSON.stringify( _curHistoryData ) );
				
				$timeout( function(){
					$scope.historyToggle = true;
					$scope.historyListData = _curHistoryData.reverse();
				} );
			}
		}
		angularObj=$scope; //把$scope的方法都赋给angularObj
		
	});	
	console.log(angularObj);