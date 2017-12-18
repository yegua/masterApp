angular.module( 'DecisionApp', [ ] ).controller( 'QueryDetailController', [ "$scope", "$timeout", function ( $scope, $timeout ) {			
	//返回上一页
	$('.mui-action-back').click(function(){
		window.location.href='kuaijiangz.html';
	});
	
	loadData( );
	function loadData( ) {		
		var _listData = localStorage.getItem( 'dec_queryDetailPage_listData' ),
			_curData = JSON.parse( _listData ),
			_curTrack = _curData.data.track,
			_newSort = [];
		
		/*for( var _index = _curTrack.details.length - 1; _index >= 0; _index -- ) {
			_newSort.push( _curTrack.details[_index] );
		}*/
		$timeout( function(){
			$scope.queryCode = _curTrack.billcode;
			$scope.resultList = _curTrack.details;
		} );
			
	}
} ] ).filter( 'to_trusted', ['$sce', function ($sce) {  
        return function (text) {  
            return $sce.trustAsHtml(text);  
        };  
    }]);
		