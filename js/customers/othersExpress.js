var queryVue = new Vue({
	el: '#container-wrapper',
	data: {				
		searchValue: '',
		sortData: _expressCompany,
		queryCode: sys.getURL( ).billcode,
		itemH: 0,
		scrollTop: 0,
		curLetter: '',
		letterArr: ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
	},
	created: function(){
		this.scrollTop = document.body.offsetHeight;
		$('#fn-kehumd-list').css({
			height: document.body.offsetHeight + 'px'
		})
		this.itemH = (document.body.offsetHeight-50) / this.letterArr.length;
		var self = this;
	    var tempObj = [];
	    for (var i = 0; i < this.letterArr.length; i++) {
	        var temp = {};
	        temp.name = self.letterArr[i];
	        temp.tHeight = i * self.itemH;
	        temp.bHeight = (i + 1) * self.itemH;
	        tempObj.push(temp)
	    };
	    console.log(this.itemH);
	},
	methods: {
		loadData: function(){
			this.sortData = _expressCompany;
		},
		selectedExpress: function( curData ) {	    	
	    	sessionStorage.setItem('queryCode',JSON.stringify({ name : curData.name, value : curData.value, type : curData.type,billcode:this.queryCode}));
	    	window.location.href='queryCheck.html?billcode='+this.queryCode;
	   	},
	   	searchLetter: function(e){
	   		var self = this;
	   		this.curLetter = e.target.innerText;
	   		var sortData = this.sortData;
	   		var cusCount = 0;
		    var letterCount = 0;
		    var self = this;
		    for (var i = 0; i < sortData.length; i++) {
			    if (self.curLetter == sortData[i].letter) {			        
			        self.scrollTop = (letterCount+2) * 41 + cusCount * 40;      
			        break;
			    } else {			        
			        letterCount++;
			        cusCount += sortData[i].data.length;			        
			    }
		    };
		    $('#fn-kehumd-list').scrollTop(self.scrollTop);
		    $('.mui-indexed-list-group').eq(letterCount).addClass('active-group').parent('li').siblings().find('.mui-indexed-list-group').removeClass('active-group');
	   		$('.mui-indexed-list-alert').show();
	   		setTimeout(function(){
	   			$('.mui-indexed-list-alert').hide();
	   		},300)
	   	},
	   	searchExpressFn: function(e){
	   		var self = this;	  		
	  		if( typeof this.searchValue == 'undefined' || this.searchValue === '' ) {
				self.loadData( );
			};
	    	if ( e.which == 13) {
	    		if( typeof self.searchValue == 'undefined' || self.searchValue === '' ) {
					self.loadData( );
				}else {
					//sys.showMask( );
					
					var _hasCustomerData = self.sortData,
						_hasSortData = '',
						_divStr = '',
						_curr = {},
						_result = [];
						
					for( var i = 0; i < _hasCustomerData.length; i++ ) {
						_curr = { letter : '', data : [] };
						var _tempData = _hasCustomerData[i].data;
						for( var j = 0; j < _tempData.length; j++ ){
							if( _tempData[j].name.indexOf( self.searchValue ) != -1 ) {
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
						self.sortData = _result;						
						
					} else {
						sys.toast('查询不到相关记录' );							
					}
					
				}
			}    		
	   	}
	   
	}
})
