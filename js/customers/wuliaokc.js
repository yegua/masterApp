var queryVue = new Vue({
	el: '#container-wrapper',
	data: {
		searchValue: '',
		listData: []
	},
	created: function() {
		this.requestData();		
	},
	methods: {
		searchProduct: function(e){
			var self = this;
			var u = window.navigator.userAgent;
			function searchInput(){
				if ( self.searchValue === '' &&  self.listData.length !== 0 ){
					self.listData = _tempSaveData;
				} else {					
					var _hasSortData = '',
						_divStr = '',
						_curr = {},
						_tempData = null,
						_result = [];
						
					if ( self.listData.length !== 0 ) {
						for( var i = 0; i < self.listData.length; i++ ){
							_curr = { letter : '', data : [] };
							_tempData = self.listData[i].data;
							
							for( var j = 0; j < _tempData.length; j ++ ) {
								if( _tempData[j].name.indexOf( self.searchValue ) != -1 ) {
									_curr.letter = self.listData[i].letter;
									_curr.data.push( _tempData[j] );									
									_result.push( _curr );
								}
							}
						};
						if ( _result.length !== 0 ) {
							self.listData = _result;
						} else {
							sys.toast( '没有查询相关记录' );
						}
					}										
				}
			};
			if(u.indexOf('AppleWebKit' && u.indexOf('Safari') > -1) > -1){
				if(e.which === 13){
					searchInput();
				}
			}else{
				searchInput();
			};
		},
		requestData: function() {
			var self = this;
			sys.requestDataNew('material.inventory', {}, function( result ) {
				var _resultData = result.data,
				_listData = sys.chineseSort( _resultData );	
				console.log(result);
				sys.loading('loadClose');
				if(result.data.length == 0){												
					sys.toast('暂无数据！');
					return false;
				};	
				
				self.listData = _listData;
				_tempSaveData = _listData;								
			} );
			
		}
	}
})
