var queryVue = new Vue({
	el: '#container-wrapper',
	data: {
		title: '网点营业额',
		startDate: '',
		startFlag: '0',
		endFlag: '0',
		endDate: sys.todayDate(),
		titleDate: '',
		dataProfit: '0.00',
		dataContent: [],
		balanceData: [],		
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
		showTable: function(){
			this.tableShow = !this.tableShow;
			$('.table-responsive').slideToggle();
			if(this.tableShow == true){
				$('.more-data').addClass('up');
			}else{
				$('.more-data').removeClass('up');
			}
		},
		startQueryFn: function(){
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
				self.endFlag = '0';
				self.startFlag = '0';
//				_picker.dispose();
			} );
			mui(".mui-btn")[0].addEventListener('tap',function(){
			    self.startFlag = '0';
				self.endFlag = '0';
			});
		},
		requestData: function(){
			var self = this;
			sys.requestDataNew('statistics.turnover', {
				startTime : self.startDate,
				endTime : 	self.endDate,
				dayMonth : '0',		
			}, function( result ) {
				var dataList = result.data,_cash=0,_month=0,_trans = 0,_other=0;
				console.log(result);
				sys.loading('loadClose');
				if(dataList.length!=0){
					self.balanceData = result.data.reverse();					
					dataList.forEach(function(item,index){
						_cash += item.cash;
						_month += item.monthly;
						_trans += item.transit;
//						_other += item.manageFee;
//						_other += item.scanningFee;
//						_other += item.costFee;
//						_other += item.materialScienceFee;
//						_other += item.weighFee;
//						_other += item.toPay;						
					});
					console.log(_cash)
					self.dataContent =[
						{name: '现金',value: _cash.toFixed(2)},		
						{name: '月结',value: _month.toFixed(2)},							
						{name: '中转费',value: _trans.toFixed(2)},
						{name: '其他',value: 0}
					];
					self.dataProfit = ((_cash + _month + _trans + _other)/10000).toFixed(2);
				}else{
					sys.toast('暂无数据！');
					self.balanceData=[
						{
							date: self.endDate.slice(5),
							cash:0,
							monthly:0,
							toPay:0,
							transit:0,					
							costFee:0,
							scanningFee:0,
							manageFee:0,
							weighFee:0,
							materialScienceFee:0
						}
					];
					self.dataContent =[
						{name: '现金',value: '-'},		
						{name: '月结',value: '-'},							
						{name: '中转费',value: '-'},
						{name: '其他',value: '-'}
					];
					self.dataProfit = '0.00';
				}
			});
		},
	}
})
