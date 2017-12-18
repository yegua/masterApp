angular.module( 'DecisionApp', [ 'angular-gestures' ] ).config( function( hammerDefaultOptsProvider ){
	hammerDefaultOptsProvider.set( { recognizers: [[Hammer.Tap, {time: 250}]] } );
} ).controller( 'SelectExpressController', [ "$scope", "$timeout", function ( $scope, $timeout ) {
	console.log( sys.getURL( ).billcode);
	loadData( sys.getURL( ).billcode );	
	
	$scope.selectedExpress = function( result ) {		
		if( result.data === '其他快递' ) {
			window.location.href='otherExpress.html?billcode='+sys.getURL( ).billcode;
			return;
		};
		
		//把所选值存储下来
		console.log(result);
		sessionStorage.setItem('queryCode',JSON.stringify({name: result.data,id: result.id}));
		window.location.href='kuaijiangz.html?billcode='+sys.getURL( ).billcode;
		
	};
	
	function loadData( queryCode ) {
		$.ajax({
			url: "http://kjgz.szmsd.com/query/queryAction!match.action?chars="+queryCode,
			//url: "http://kjgz.szmsd.com/query/queryAction!match.action?chars="+queryCode,
			type: 'get',
			dataType : 'jsonp',
			jsonp: 'jsoncallback',//与后台保持一致
			success : function( result ){
				console.log(result);
				$scope.listData = [];
			
				if( result.length === 0 ) {
					win.alert( '系统提示','数据为空' );
					return;
				}
				
				$timeout( function(){
					$scope.listData = result;
				} );
			},
			error : function( err ){				
				win.alert( '系统提示','请求不到数据！' );
			}
		})

		
		
		
	}
    
} ] );