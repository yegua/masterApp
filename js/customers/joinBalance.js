var queryVue = new Vue({
	el: '#container-wrapper',
	data: {
		title: '预付款',
		startDate: '',
		endDate: sys.todayDate(),
		totalYue: 0,									
		rechargeFee: 0.01,
		chargeFee: 0.00,
		rechargeTotal: 0.01,
		startFlag: '0',
		endFlag: '0',
		privateBalance: [],
		waitPay: false,
		showPay: false,
		confirmPay: false,
		payStatus: "已支付",
		siteCode: '',
		userCode: ''
	},
	created: function() {
		var self = this;
		this.startDate = sys.dateDiffDay(this.endDate,2,'before');//显示前三天的数据
		this.siteCode = sys.getURL().sitecode;
		this.userCode = sys.getURL().usercode; 
		console.log(this.userCode);
		this.requestData();
		if(localStorage.getItem('curTime') && localStorage.getItem('payOrdernum')){
			var loginTime = new Date();
			var chargeTime = localStorage.getItem('curTime');
			var timeGap = ((new Date(loginTime) - new Date(chargeTime))/(3600*1000));//小时数差距
			console.log(Math.round(timeGap));
			if(Math.round(timeGap)>=1){
				sys.toast('超时未支付，关闭交易！')
				self.clearLocalstorage();//时间限制，如果24小时内不付款就清除缓存
			};
			this.checkpayStatus();
		};
		
	},
	methods: {		
		//扣款日期选择
		deductDate: function(){					
			$('.mask-layer').fadeIn();
			$('.picker-box').fadeIn(200);					
		},
		//关闭日期选择框
		closeDate: function(){
			var self = this;
			$('.mask-layer').fadeOut();
			$('.picker-box').fadeOut(200);
			this.startFlag = '0';
			this.endFlag = '0';
			if( !sys.compareWithDate( self.endDate, self.startDate ) ) {
				sys.toast( '日期有误，请重新输入' );
				return;
			};
			
			this.requestData();
		},
		//起始时间选择
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
				self.endDate = sys.dateDiffDay(self.startDate,2,'after');
				self.startFlag = '0';				
//				_picker.dispose();
			} );
			mui(".mui-btn")[0].addEventListener('tap',function(){
			    self.startFlag = '0';
				self.endFlag = '0';
			});
		},
		//结束时间选择
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
			_options.value = this.endDate.replace(/\//g,'-');			
			_picker = new mui.DtPicker( _options );			
			_picker.show( function( result ) {				
				self.endDate = result.text.replace(/-/g,'/');	
				self.startDate = sys.dateDiffDay(self.endDate,2,'before');				
				self.endFlag = '0';
//				_picker.dispose();
			} );
			mui(".mui-btn")[0].addEventListener('tap',function(){
			    self.startFlag = '0';
				self.endFlag = '0';
			});
		},		
		payShow: function(){
			this.showPay = true;
			$('.mask-layer').show();			
			
		},
		cancelCharge: function(){
			this.showPay = false;
			$('.mask-layer').hide();
		},
		countCharge: function(value){					
			this.rechargeTotal = (Number(value)/0.995).toFixed(2);
			this.chargeFee = (this.rechargeTotal - Number(value)).toFixed(2);	
		},		
		confirmCharge: function(e){			
			//sys.loading('load');
			var self = this;
			var _dataObj={
				parameter:{
					amount:self.rechargeTotal,//最终付款金额
					paymentMethod:"AlipayInitiativePay",
					cusId:"msd013",
					cusName:"新疆江南申通物流有限公司",
					billCode:"",
					userCode:self.userCode,
					siteCode:self.siteCode,
					scanType:"",
					systemId:"",
					freight:"",
					collectionAmount:"",
					toPay:"",
					prepayRecharge: self.rechargeFee,//充值金额
					proceduresFee: self.chargeFee,//手续费
					businessType:"1",
					feeType:"预付款",
					price:"0",
					piece:"0",
					source:"APP"
				}
			};
			console.log(self.rechargeFee,self.chargeFee,self.rechargeTotal);
			var _exeParams = {
				method : "common.interface",				
				format : "json",
				v      : "1.0",
				sign   : md5(JSON.stringify( _dataObj )+"9a6583dcd8c3c8e1f53347cef909eb93"),
				ifdmethod : "pay",
				data   : JSON.stringify( _dataObj ) 
			};
			
			$.ajax({
				type:"post",
				url:"http://122.112.215.200:22220/msdpay-ifd-client-web/router",
				data: _exeParams,
				async:false,
				success: function(res){
					//sys.loading('loadClose');
					var datas = JSON.parse(res.data);
					var payUrl = datas.qrURL;						
					//$('.btn-charge').attr("href",payUrl);
					self.waitPay = true;					
					self.showPay = false;
					console.log(datas);
					localStorage.setItem('payOrdernum',datas.merchOrderNo);
					localStorage.setItem('curTime',new Date());
					localStorage.setItem('userCode',self.userCode);
					window.location.href = payUrl;
				}
			});
		},
		checkpayStatus: function(){
			var self = this;
			var _dataObj={
				parameter:{					
					cusId:"msd013",
					paymentMethod:"WeiXin_LocalPayQuery",					
					merchOrderNo: localStorage.getItem('payOrdernum')
				}
			};
			var _exeParams = {
				method : "common.interface",				
				format : "json",
				v      : "1.0",
				sign   : md5(JSON.stringify( _dataObj )+"9a6583dcd8c3c8e1f53347cef909eb93"),
				ifdmethod : "payQuery",
				data   : JSON.stringify( _dataObj ) 
			};
			
			$.ajax({
				type:"post",
				url:"http://122.112.215.200:22220/msdpay-ifd-client-web/router",
				data: _exeParams,
				async:false,
				success: function(res){						
					if(JSON.parse(res.data).length!==0){
						self.payStatus = (JSON.parse(res.data))[0].payState;
						if(self.payStatus == "待支付"){
							$('.mask-layer').show();
							self.waitPay = true;
							if(localStorage.getItem('userCode')!==self.userCode){
								$('.mask-layer').hide();
								self.waitPay = false;
							};
						}else if(self.payStatus == "已支付"){
							$('.mask-layer').show();
							self.confirmPay = true;	
							self.clearLocalstorage();//支付成功清除缓存
						}else{
							sys.toast("您的支付未成功，请重新充值！");//充值失败清除缓存
							self.clearLocalstorage();
						}
					}
				}
			});
		},
		confirmRechage: function(){
			$('.mask-layer').hide();
			this.waitPay = false;
			this.requestData();
		},
		successRechage: function(){
			$('.mask-layer').hide();
			this.confirmPay = false;
			this.requestData();
		},
		refreshData: function(){
			if(localStorage.getItem('payOrdernum')){
				this.checkpayStatus();
			};
			this.requestData();
		},
		//清除缓存
		clearLocalstorage: function(){
			localStorage.removeItem('payOrdernum');
			localStorage.removeItem('curTime');
		},
		requestData: function(){
			var self = this;
			sys.requestDataNew('statistics.imprest', {
				startTime : self.startDate,
				endTime : self.endDate,
				dayMonth : '0'
			}, function( result ) {	
				console.log(result);
				sys.loading('loadClose');
				if(result.data.length == 0){												
					sys.toast('暂无数据！');
					self.totalYue = 0;
					self.privateBalance = [];
					//return false;
				}else{
					var dataList = result.data;
					self.privateBalance = dataList;
					self.totalYue = (dataList[0].balance).toFixed(2);		
				};
				
						
				
			});
		},
	}
})
