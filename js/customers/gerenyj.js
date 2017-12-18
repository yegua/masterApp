var queryVue = new Vue({
	el: '#container-wrapper',
	data: {		
		startDate: '',
		endDate: sys.todayDate(),
		startFlag: '0',
		endFlag: '0',
		titleDate: '',
		dataContent: [],
		siteName: ''
		
	},
	created: function() {
		var self = this;
		this.startDate = sys.dateDiffDay(this.endDate,4,'before');
		this.titleDate = this.startDate + '-' + this.endDate;
		this.requestData();
	},
	methods: {
		showDate: function(){
			var self = this;
			$('.mask-layer').fadeIn();
			$('.picker-box').fadeIn(200);		
		},
		closeDate: function(){
			var self = this;
			$('.mask-layer').fadeOut();
			$('.picker-box').fadeOut(200);
			if( !sys.compareWithDate( self.endDate, self.startDate ) ) {
				sys.toast( '日期有误，请重新输入' );
				return;
			};
			if(self.endDate === self.startDate){
				self.titleDate = self.startDate;
			}else{
				self.titleDate = self.startDate + '-' + self.endDate;
			};
			this.requestData();
		},
		startQueryFn: function(){
			//alert(this.startFlag)
			var self = this;
			this.startFlag = 'start';
			this.endFlag = 'end';
			var _options = { 
				'type' : 'date',
				'beginYear' : 2000,
				'endYear' : new Date().getFullYear() 
			},
			_picker = null;
			_options.type = 'date';
			_options.value = this.startDate.replace(/\//g,'-');			
			_picker = new mui.DtPicker( _options );			
			_picker.show( function( result ) {							
				self.startDate = result.text.replace(/-/g,'/');	
				self.startFlag = '0';
				self.endFlag = '0';
//				_picker.dispose();
			} );
			mui(".mui-btn")[0].addEventListener('tap',function(){
			    self.startFlag = '0';
				self.endFlag = '0';
			});
			
		},
		endQueryFn: function(){
			var self = this;
			this.startFlag = 'start';
			this.endFlag = 'end';
			var _options = { 
				'type' : 'date',
				'beginYear' : 2000,
				'endYear' : new Date().getFullYear() 
			},
			_picker = null;
			_options.type = 'date';
			_options.value = this.startDate.replace(/\//g,'-');			
			_picker = new mui.DtPicker( _options );			
			_picker.show( function( result ) {							
				self.endDate = result.text.replace(/-/g,'/');	
				self.startFlag = '0';
				self.endFlag = '0';
//				_picker.dispose();
			} );
			mui(".mui-btn")[0].addEventListener('tap',function(){
			    self.startFlag = '0';
				self.endFlag = '0';
			});
			
		},
		requestData: function() {
			var self = this;
			sys.requestDataNew('performance.personal', {
				startTime: self.startDate,
				endTime: self.endDate
			}, function( result ) {
				var _resultData = result.data[0],
				_labelArr = ['receiverNumber','receiverWeight','money','sendNumber','sendWeight','toPay','none','none','instead'],
				_labelObj = {
					'receiverNumber':'收件票数',
					'receiverWeight':'收件重量',
					'money':'现金',
					'sendNumber':'派件票数',
					'sendWeight': '派件重量',
					'toPay':'到付',
					'none': '',
					'none': '',
					'instead':'代收'
				};
				sys.loading('loadClose');
				if(result.data.length == 0){												
					sys.toast('暂无数据！');
					//return false;
				}else{
					self.siteName = _resultData.sendName;
				};
				console.log(result);
				var _resArr = [],
					_curName= '';
					
				for( var i = 0; i < _labelArr.length; i++ ) {
					var _itemObj = {};
					_curName = _labelArr[i];
					_itemObj = {
						name : _labelObj[ _curName ],
						value : result.data.length != 0 ? _resultData[ _curName ] : '-'
					};					
					_resArr.push( _itemObj );
				};
				self.dataContent = _resArr;
				console.log(_resArr);
			} );
			
		}
	}
})

	  	