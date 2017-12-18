define(function(require,exports,module){
	require('jquery');
	require('sys');
	require('company');
	var listRows = document.getElementById( 'fn-kehumd-list' );
		
	listRows.style.height = document.body.offsetHeight + 'px';
	
	require('indexedlist');
	window.indexedList = new mui.IndexedList( listRows );
	
	require.async('angular',function(){
		require.async('angular-gestures');
		angular.module( 'DecisionApp', [ 'angular-gestures' ] ).config( function( hammerDefaultOptsProvider ){
		hammerDefaultOptsProvider.set( { recognizers: [[Hammer.Tap, {time: 250}]] } );
		} ).controller( 'OthersExpressController', [ "$scope", "$timeout", function ( $scope, $timeout ) {
			$scope.sortData = [];
			$scope.searchValue = '';
			
			var _companyArr = _expressCompany,
				_urlObj = sys.getURL(),
				_code=sys.getURL( ).billcode;
		
			$timeout( function(){
				loadData();
			});
			
		    $scope.selectedExpress = function( curData ) {
		    	console.log(curData,_code);
		    	sessionStorage.setItem('queryCode',JSON.stringify({ name : curData.name, value : curData.value, type : curData.type,billcode:_code}));
		    	window.location.href='kuaijiangz.html?billcode='+_code;
		    };
		    require('pinyin');
		  	$scope.searchExpressFn = function( $event ) {
		  		$scope.searchValue = document.querySelector( 'input[name="search"]' ).value;
		  		$('.mui-icon-clear').hide();
		  		if( typeof $scope.searchValue == 'undefined' || $scope.searchValue === '' ) {
					loadData( );
				};
		    	if ( $event.which == 13) {
		    		if( typeof $scope.searchValue == 'undefined' || $scope.searchValue === '' ) {
						loadData( );
					}else {
						//sys.showMask( );
						
						var _hasCustomerData = $scope.sortData,
							_hasSortData = '',
							_divStr = '',
							_curr = {},
							_result = [];
							
						for( var i = 0; i < _hasCustomerData.length; i++ ) {
							_curr = { letter : '', data : [] };
							var _tempData = _hasCustomerData[i].data;
							for( var j = 0; j < _tempData.length; j++ ){
								if( _tempData[j].name.indexOf( $scope.searchValue ) != -1 ) {
									_curr.letter = _hasCustomerData[i].letter;
									_curr.data.push( _tempData[j] );
								}
							}
							
							if( _curr.data.length !== 0 ) {
								_result.push( _curr );
							}
						};
						console.log(_result);
						
						if ( _result.length !== 0 ) {						
							$scope.sortData = _result;						
							
						} else {
							sys.toast('查询不到相关记录' );							
						}
						
					}
				}    		
				
		    };
		   
		    function loadData( ) {				
				$scope.sortData = _companyArr;		
			}
		    
		} ] );

	})
})