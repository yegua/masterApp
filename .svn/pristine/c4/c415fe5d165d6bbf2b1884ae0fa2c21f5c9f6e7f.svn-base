var queryVue = new Vue({
	el: '#container-wrapper',
	data: {		
		startDate: '',
		endDate: sys.todayDate(),
		startFlag: '0',
		endFlag: '0',
		titleDate: '',
		sendName: '敏思达',
		personnalData:[],
		usedNum: 0,
		unusedNum: 0
		
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
				self.startFlag = '0';
				self.endFlag = '0';
//				_picker.dispose();
			} );
			mui(".mui-btn")[0].addEventListener('tap',function(){
			    self.startFlag = '0';
				self.endFlag = '0';
			});
		},
		requestData: function(){
			var dataList={sendName: '敏思达',
				data: [
					{name: '运单',usedNum: 898,nouseNum: 89},
					{name: '子单',usedNum: 898,nouseNum: 89},
					{name: '回单',usedNum: 898,nouseNum: 89},
					{name: '五联运单(普通)',usedNum: 898,nouseNum: 89}
				]
			};
			sys.loading('loadClose');
			this.renderChart(dataList);
		},
		renderChart:function( result ) {
			var self = this;
    		var _resultData = result,
				_sendName=_resultData['sendName'],
				_personnalData = result['data'];
			this.personnalData = _personnalData;
			_personnalData.forEach(function(item,index){
				self.usedNum += item.usedNum;					
				self.unusedNum += item.nouseNum;
			})																					
    	}
	}
})
