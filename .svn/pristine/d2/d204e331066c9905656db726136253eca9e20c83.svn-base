var queryVue = new Vue({
	el: '#container-wrapper',
	data: {		
		startDate: '',
		endDate: sys.todayDate(),
		titleDate: '',
		sum: {
			wayUsed: 0,
			wayUnused: 0,
			backUsed: 0,
			backUnused: 0,
			subUsed: 0,
			subUnused: 0
		},
		productName:['回单','子单','五联运单(普通)'],
		productHtml: '',
		websiteData:[]
		
	},
	created: function() {
		var self = this;
		this.startDate = sys.dateDiffDay(this.endDate,4,'before');
		this.titleDate = this.startDate + '-' + this.endDate;
		//横竖屏切换时执行
		var mql = window.matchMedia("(orientation:portrait)");
		mql.addListener(function(){
			//alert(11);
			//setTimeout(function(){
				$('.table-responsive').css({
					width: $('.blue')[0].clientWidth+'px',
					height: $('.ui-chart-content').height()-$('.blue').height()-65+'px'
				});
			//},300)
		});
		this.requestData();
	},
	methods: {
		closeDate: function(){
			var self = this;
			$('.mask-layer').fadeOut();
			$('.picker-box').fadeOut(200);
			
			this.startDate = this.$refs.dateinfo.startDate;
        	this.endDate = this.$refs.dateinfo.endDate;
        	if(self.endDate === self.startDate){
				self.titleDate = self.startDate;
			}else{
				self.titleDate = self.startDate + '-' + self.endDate;
			};
			if( !sys.compareWithDate( self.endDate, self.startDate ) ) {
				sys.toast( '日期有误，请重新输入' );
				return;
			};
			console.log(this.titleDate)
			this.requestData();
		},
		requestData: function(){
			console.log('data');
			var self = this;
			var dataList=[
			   {sendName: '敏思达',waybillUsed: 898.9,waybillUnused: 4546,backBillUsed: 456.7,backBillUnused: 546,subBillUsed: 99,subBillUnused:96.99},
			   {sendName: '敏思达',waybillUsed: 898.9,waybillUnused: 4546,backBillUsed: 456.7,backBillUnused: 546,subBillUsed: 99,subBillUnused:96.99},
			   {sendName: '敏思达',waybillUsed: 898.9,waybillUnused: 4546,backBillUsed: 456.7,backBillUnused: 546,subBillUsed: 99,subBillUnused:96.99},
			   {sendName: '敏思达',waybillUsed: 898.9,waybillUnused: 4546,backBillUsed: 456.7,backBillUnused: 546,subBillUsed: 99,subBillUnused:96.99}];
			this.websiteData = dataList;
			dataList.forEach(function(item,index){
				self.sum.backUsed+=parseInt(item.backBillUsed);
				self.sum.backUnused+=parseInt(item.backBillUnused);
				self.sum.subUsed+=parseInt(item.subBillUsed);
				self.sum.subUnused+=parseInt(item.subBillUnused);
				self.sum.wayUsed+=parseInt(item.waybillUsed);
				self.sum.wayUnused+=parseInt(item.waybillUnused);
			});
			var _html = '';
			for(var i=0;i<this.productName.length;i++){
				_html+='<th><div>已用</div></th><th><div>未用</div></th>';
			};
			this.productHtml = _html;														
		},		
	}
})