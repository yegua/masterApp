angular.module( 'DecisionApp', [ 'angular-gestures' ] ).config( function( hammerDefaultOptsProvider ){
	hammerDefaultOptsProvider.set( { recognizers: [[Hammer.Tap, {time: 250}]] } );
} ).controller( 'resultFailController', [ "$scope", "$timeout", function ( $scope, $timeout) {
	var _billcode=sys.getURL().billcode;
	//返回上一页
	$('#mui-back').click(function(){
		window.location.href='kuaijiangz.html?billcode='+_billcode;
	});
	$scope.companyName = '';
	$scope.phone = '';
	$scope.website = '';
	
	$timeout( function(){
		var companyInfo = JSON.parse(sessionStorage.getItem( 'dec_resultFailPage_company' ));
			
		$scope.companyName = companyInfo.name;
		$scope.code = companyInfo.code;
		$scope.phone = companyInfo.thumbnail;
		$scope.phoneToggle = companyInfo.thumbnail ? false : true;
		$scope.website = companyInfo.description;
		$scope.siteToggle = companyInfo.description ? false : true;
	
	} );
	
	$scope.goExpressWebsite = function() {		
		window.location.href='expressSite.html?name=' + encodeURIComponent( $scope.companyName ) + '&address=' + encodeURIComponent( $scope.website );
	};

} ] );