//console.log(document.body.clientHeight - $('.date-choose').offset().top);
var windowWidth = $('#chart-wrapper').width();
var startX,startY,endX,endY;
var transNum = 1000*3600*24;//计算时间差
var app = new Vue({
	el: '#container-wrapper',
	data: {
		title: '货量统计',
		activeIndex: 0,
		startDate: '',
		endDate: sys.todayDate(),
		nowDate: sys.todayDate(),
		startFlag: '0',
		endFlag: '0',	
		thirdDate: '',
		outerDatas:[],
		innerDatas:[],
		totalTickets: 0,	
		fenbuData:[],
		paijianData: [],		
		data1total: 0,
		data2total: 0,
		datas1: 0,
		datas2: 0,
		datastotal: 0,
		dayMonth: '0',
		tableShow: false,
		unbind: true,
		flagStart: '',
		flagEnd: sys.todayDate(),
	},
	//vue初始化执行
	created: function() {
		var self = this;
		this.startDate = sys.dateDiffDay(this.endDate,4,'before');//起始日期
		this.flagStart = sys.dateDiffDay(this.flagEnd,4,'before');//滑动取数据时临界起始日期
		this.thirdDate = sys.dateDiffDay(this.nowDate,2,'before');//页面显示前三条数据时的固定日期
		this.requestDataNow();//获取前三天数据
		this.requestData('statistics.distribution');//获取货量分布数据
		this.requestData('delivery.prescription');//获取派送时效数据
		this.requestData('statistics.enteringLeaving');//获取货量统计数据			
	},
	methods: {
		//切换进出港数据页面
		tab: function(index){
			this.activeIndex = index;
			this.readerChartouter('ui-container-now',JSON.parse(sessionStorage.getItem('enterLeaving')));
			//this.requestData('statistics.enteringLeaving');//货量统计
		},
		//日期选择框出现
		showDate: function(){
			var self = this;
			$('.picker-box').show();
			$('.mask-layer').show();
		},
		//日期选择框关闭
		closeDate: function(){
			var self = this;
			$('.mask-layer').hide();
			$('.picker-box').hide(200);
			if(self.dayMonth === '0'){
				if( !sys.compareWithDate( self.endDate, self.startDate ) ) {
					sys.toast( '日期有误，请重新输入' );
					return;
				};
			};
			//重置临界日期值
			this.flagStart = this.startDate;
			this.flagEnd = this.endDate;
			self.requestData('statistics.enteringLeaving');
			self.requestData('statistics.distribution');
			self.requestData('delivery.prescription');			
		},
		//起始日期选择
		startQueryFn: function(){
			var self = this;
			this.startFlag = 'start';
			this.endFlag = 'end';
			var _options = { 
				'type' : self.dayMonth == 0 ? 'date' : 'month',
				'beginYear' : 2000,
				'endYear' : new Date().getFullYear() 
			},
			_picker = null;
			_options.type = self.dayMonth == 0 ? 'date' : 'month';
			_options.value = this.startDate.replace(/\//g,'-');			
			_picker = new mui.DtPicker( _options );			
			_picker.show( function( result ) {
				console.log(result)				
				self.startDate = result.text.replace(/-/g,'/');
				self.flagStart = result.text.replace(/-/g,'/');
				self.startFlag = '0';
				self.endFlag = '0';
//				_picker.dispose();
			} );
			mui(".mui-btn")[0].addEventListener('tap',function(){
			    self.startFlag = '0';
				self.endFlag = '0';
			});
			
		},
		//结束日期选择
		endQueryFn: function(){
			var self = this;
			this.startFlag = 'start';
			this.endFlag = 'end';
			var _options = { 
				'type' : self.dayMonth == 0 ? 'date' : 'month',
				'beginYear' : 2000,
				'endYear' : new Date().getFullYear() 
			},
			_picker = null;
			_options.type = self.dayMonth == 0 ? 'date' : 'month';
			_options.value = this.startDate.replace(/\//g,'-');			
			_picker = new mui.DtPicker( _options );			
			_picker.show( function( result ) {
				console.log(result)				
				self.endDate = result.text.replace(/-/g,'/');	
				self.flagEnd = result.text.replace(/-/g,'/');
				self.startFlag = '0';
				self.endFlag = '0';
//				_picker.dispose();
			} );
			mui(".mui-btn")[0].addEventListener('tap',function(){
			    self.startFlag = '0';
				self.endFlag = '0';
			});
			
		},
		//切换按天查询和按月查询
		changeDate: function(){
			var self = this;			
			if(self.dayMonth === '0'){
				self.dayMonth='1';
				self.endDate = self.endDate.slice(0,7);
				//self.startDate = self.startDate.slice(0,7);
				self.startDate = sys.dateDiffMonth(self.startDate,4,'before');				
			}else if(self.dayMonth === '1'){
				self.dayMonth='0';
				self.flagStart = self.startDate = self.endDate + '/01';
				self.flagEnd = self.endDate = sys.dateDiffDay(self.startDate,4,'after');
				console.log(self.flagStart,self.flagEnd)
			};
			this.requestData('statistics.enteringLeaving');
			//this.requestData('statistics.distribution');
			//this.requestData('delivery.prescription');
		},
		//底部表格数据显示隐藏
		showTable: function(){
			this.tableShow = !this.tableShow;
			$('.table-responsive').slideToggle();
			if(this.tableShow === true){
				$('.more-data').addClass('up');
			}else{
				$('.more-data').removeClass('up');
			}
		},
		//滑动获取数据三事件
		touchStart: function(e){
			var self = this;
			startX = e.changedTouches[0].pageX;
    		startY = e.changedTouches[0].pageY;
//  		if((new Date(self.endDate) - new Date(self.startDate))/transNum==15){
//				self.unbind = false;
//			}else{
//				self.unbind = true;
//			}
		},
		touchMove: function(e){
			var self = this;
			//获取滑动屏幕时的X,Y
		  	endX = e.changedTouches[0].pageX;
		 	endY = e.changedTouches[0].pageY;
		  	//获取滑动距离
		  	distanceX = endX-startX;
		  	distanceY = endY-startY;
		  	//判断滑动方向
		  	if(Math.abs(distanceX)>Math.abs(distanceY) && distanceX>0){
			  	//向右滑，取前五天数据		  		
		  		if(self.dayMonth === '0'){
		  			self.startDate = sys.dateDiffDay(self.startDate,1,'before');		  		
			  		if((new Date(self.flagStart)-new Date(self.startDate))/transNum>=5){
			  			self.startDate = sys.dateDiffDay(self.flagStart,5,'before');
			  			self.requestData('statistics.enteringLeaving');
			  			self.requestData('statistics.distribution');
						self.requestData('delivery.prescription');
			  			return false;
			  		};		 
		  		}
		      	
		  	}else if(Math.abs(distanceX)>Math.abs(distanceY) && distanceX<0){
		  		//向左滑，取后五天数据		  				      			      	
				if(self.dayMonth === '0'){
					self.endDate = sys.dateDiffDay(self.endDate,1,'after');	
					if(sys.compareWithDate( self.endDate, sys.todayDate())) {
			      		self.endDate = sys.todayDate();
			      		return false;
					};
					if((new Date(self.endDate)-new Date(self.flagEnd))/transNum>=5){
						self.endDate = sys.dateDiffDay(self.flagEnd,5,'after');					
						self.requestData('statistics.enteringLeaving');
						self.requestData('statistics.distribution');
						self.requestData('delivery.prescription');
			  			return false;
			  		};
		  		}
		  	}
		},
		touchEnd: function(e){
			var self = this;
			console.log(this.flagStart,this.flagEnd,this.startDate,this.endDate);
			//只有按天查的时候能滑动获取数据
			if(this.dayMonth === '0'){
				var num = (new Date(self.flagEnd) - new Date(self.flagStart))/transNum;
				if((new Date(self.endDate) - new Date(self.startDate))/transNum>=(num+10) || (new Date(sys.todayDate()) - new Date(self.startDate))/transNum==9){
					self.unbind = false;
				}else{
					self.unbind = true;
				};
			}
		},
		requestDataNow: function(){
			var self = this;
			sys.requestDataNew('statistics.enteringLeaving', {
				startTime : self.thirdDate,
				endTime : 	self.nowDate,
				dayMonth : '0'
			}, function( result ) {
				var inner=[],out=[];
				result.data.forEach(function(item,index){
					self.innerDatas.push(item.purchase);
					inner.push(item.purchase);
					self.outerDatas.push(item.shipments);
					out.push(item.shipments);
				});							
			} );
		},
		requestData: function(method){
			var self = this;
			sys.requestDataNew(method, {
				startTime : self.dayMonth != '1' ?  self.startDate : self.startDate + '/01',
				endTime : self.dayMonth != '1' ?  self.endDate : sys.endDayOfMonth(self.endDate),
				dayMonth : self.dayMonth
			}, function( result ) {
				if(method==='statistics.enteringLeaving'){
					if(result.data.length == 0){												
						sys.toast('货量统计暂无数据！');
						//sys.loading('loadClose');
						//return false;
					};					
					//console.log('货量统计' , result);
					sessionStorage.setItem('enterLeaving',JSON.stringify(result));
					self.readerChartouter('ui-container-now',result);					
				}else if(method === 'statistics.distribution'){
					if(result.data.length == 0 && self.activeIndex == 0){												
						sys.showMsg('货量分布暂无数据！');				
					};
					//console.log('货量分布' , result.data)
					self.readerChartfenbu(result);
				}else if(method ==='delivery.prescription'){
					if(result.data.length == 0 && self.activeIndex == 1){												
						sys.showMsg('派送时效暂无数据！');						
					};					
					//console.log('派件时效' , result.data)
					self.paijianData = [];
					self.datastotal = 0;
					self.data2total = 0;
					self.data1total = 0;
					self.datas1 = 0;
					self.datas2 = 0;
					result.data.forEach(function(item,index){
						self.paijianData.push(item);
						self.data1total += Number(item.dataTotal1);
						self.datas1 += Number(item.data1);
						self.datas2 += Number(item.data2);
						self.data2total += Number(item.dataTotal2);
						self.datastotal += Number(item.dataTotal1) + Number(item.dataTotal2);
					});
					self.paijianData = self.paijianData.reverse();
				}
			} );
		},
		//货量统计折线图
		readerChartouter: function(el,res){
			console.log(res);
			var self = this;
			var datalist = res.data;
			var outerData=[],innerData=[],_date=[],flagData=[];
			datalist.forEach(function(item,index){
				innerData.push(parseInt(item.purchase));
				outerData.push(parseInt(item.shipments));
				flagData.push(null);
				if(self.dayMonth === '0'){
					_date.push(item.date.slice( 5 ))
				}else{
					_date.push(item.date)
				}
			});			
			if(datalist.length == 0){
				outerData=[];
				innerData=[];
			};
			if(this.dayMonth === '0'){
				_date = _date.reverse();
				innerData = innerData.reverse();
				outerData = outerData.reverse();
				flagData = flagData.reverse();
			};
			if(self.dayMonth === '0'){
				_date.push(sys.dateDiffDay(self.endDate,1,'after').slice(5).replace(/\//,'-'));
				flagData.push(0);
				flagData[flagData.length-2] = self.activeIndex==0 ? outerData[outerData.length-1] : innerData[outerData.length-1];
			};	
			
			//出港数据
			var _chartObj = echarts.init( document.getElementById(el) );				
			var _option = {
				noDataLoadingOption : {
            		text : '暂无数据,请到系统上维护',
            		effect : 'bar'
            	},
			    title: {
			        text: ''
			    },
			    tooltip: {
			    	show: false,
			        trigger: 'axis',			    
			        formatter: '{b}/{c}件'
			    },
			    grid: {
			        left: '-1%',
			        right: '7%',
			        top: '40%',
			        bottom: '3%',
			        containLabel: true
			    },
			    toolbox: {
			        show: false
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: _date,
			        axisLine: {
			        	show: false
			        },
			        axisTick: {
			        	show: false
			        }
			    },
			    yAxis: {
			    	type: 'value',
			    	show: false,
			    	min: 'dataMin',
			    	axisPointer: {
			            snap: true
			        }
//			    	max: 'dataMax',
//			    	interval: 500
			    },			    
			    series: [
			        {
			            name:'货量统计',
			            type:'line',
			            stack: '总量',			      
			            data: self.activeIndex==0 ? outerData :innerData,
			            itemStyle : { 
			            	normal: {
			            		label : {
			            			show: true,
			            		},
			            		color: '#666',
			            		borderColor: self.activeIndex==0 ? '#ff774b' : '#3575bd',
			            		borderWidth: 4,
			            		borderType: 'solid'
			            	}
			       		},
			       		lineStyle: {
			       			normal: {
			       				color: self.activeIndex==0 ? '#ff774b' : '#3575bd'
			       			}
			       		}
			        },{
			        	type: 'line',
			        	data: flagData,
			        	itemStyle : { 
			            	normal: {
			            		label : {
			            			show: true,
			            		},
			            		color: '#666',
			            		borderColor: self.activeIndex==0 ? '#ff774b' : '#3575bd',
			            		borderWidth: 4,
			            		opacity: .5
			            	}
			       		},
			        	lineStyle: {
			       			normal: {
			       				color: self.activeIndex==0 ? '#ff774b' : '#3575bd',
			       				type: 'dotted',
			       				opacity: .5
			       			}
			       		},
			        }
			    ]
			};
			if(datalist.length>5){
				$('.chart-container').css({
					width: windowWidth *0.2*(datalist.length)
				});
			}else{
				$('.chart-container').css({
					width: windowWidth + 30
				});
			};
			//$('#chart-wrapper').scrollLeft(windowWidth *0.2*(datalist.length)*0.4);
			_chartObj.resize();
			//console.log(_option.series[0].data)
			_chartObj.setOption( _option );
			sys.loading('loadClose');
		},
		//货量分布饼图
		readerChartfenbu: function(res){			
			var self = this;
			var _showListArr = [],
				_totalNum = 0,
				_otherNum = 0,
				_otherData = {},
				_perLabel = '',
				_tempLabel = '',
				_otherAreaDataArr = [],
				_resultData = res.data;
			if(_resultData.length == 0){
				_showListArr = [];
			};
			for ( var i = 0; i < _resultData.length; i++ ) {
				_totalNum += parseFloat( _resultData[i].value );
			}
			this.totalTickets = _totalNum;
			this.fenbuData = _resultData;
			for ( var j = 0; j < _resultData.length; j++ ) {
				_tempLabel =  ( parseFloat( _resultData[j].value ) / _totalNum * 100 ).toFixed( 2 ) + '%';
				if ( j < 5 ) {
					_resultData[j].name = _resultData[j].name;
					if(_resultData[j].name == " "){
						_resultData[j].name = '空';
					};
					_showListArr.push( _resultData[j] );
				} else {
					_otherNum += parseFloat( _resultData[j].value );
					_otherAreaDataArr.push( _resultData[j] );
				}
				
				if ( j == _resultData.length - 1 ) {
					_otherData = {
						name : '其他',
						value : _otherNum
					};					
					_showListArr.push( _otherData );
				}
			};
			sys.sortObj(_showListArr);
			console.log(_showListArr)
			//this.fenbuData = _showListArr.reverse();
			
			//饼图
			var _chartPie = echarts.init( document.getElementById('ui-chart-pie') ),
		        _pieoption = {	         		
		        	baseOption:{
		        		noDataLoadingOption : {
			        		text: '暂无数据',
	                        effect: 'bubble',
			        	},
						tooltip : {
					        trigger: 'item',
					        formatter: "{b}<br/>{d}%"
					    },
					    color:['#3575bd', '#46c6ff','#38dab9','#ffd077','#f199f2','#f25b4a'],  
					    series : [
					        {
					            name:'货量分布',
					            type:'pie',				          				
					            startAngle: 160,					            
					          	radius : [10, '52%'],
					          	center: ['50%', '52%'],			         
					            label: {
					            	normal: {
					            		show: true,
					            		position: 'outer',
					            		formatter: '{c}票'+ '\n'+'{b}'					            		
					            	}
					            },
					            labelLine: {
					            	normal:{
					            		show: true,
					            		length: 10,
					            		length2: 40,					            		
					            	}
					            },
					            data : _showListArr
					        }
					    ]
					},
					media: [
		        	    {
		        	    	query:{        	    	
			        	    	maxWidth: 359       	    	
			        	    },
			        	    option:{
			        	    	series:[{
			        	    		radius : [10, '45%'],
			      	    	       	center: ['51%', '52%'],
			      	    	       	startAngle: 150,	
			      	    	       	labelLine: {
						            	normal:{
						            		show: true,
						            		length: 10,
						            		length2: 34
						            	}
						            },						           
			        	    	}]       	    	            	    	
			        	    }
		        	    }
		        	]
				};

		    _chartPie.setOption( _pieoption );
		},

	},

});
