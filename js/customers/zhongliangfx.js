var app = new Vue({
	el: '#container-wrapper',
	data: {
		title: '重量段分析',
		activeIndex: 0,
		startDate: '',
		titleDate: '',
		endDate: sys.todayDate(),
		totalTickets: 0,	
		zlfxData:[],
		dayMonth: '0',
		tableShow: false,
		selectData: [],
		websiteData: [],
		clientData: [],
		typeName: '',
		defaultClient: ''
	},
	created: function() {
		var self = this;
		this.startDate = sys.dateDiffDay(this.endDate,4,'before');
		this.titleDate = this.startDate + '-' + this.endDate;		
		this.typeName = '';//默认所有数据
		this.requestSelectData();		
		this.requestData('zhonglianfenxi.query');
	},
	methods: {
		//切换网点客户数据查询
		tab: function(index){
			var self = this;
			this.activeIndex = index;
			this.typeName = '';
			self.selectData = [];
			self.zlfxData = [];
			if(self.websiteData.length==0 || self.clientData.length == 0){
				self.requestSelectData();
			}else{
				if(self.activeIndex==0){																		
					self.selectData = self.websiteData;				
				}else{								
					self.selectData = self.clientData;
				};
			};									
			this.requestData('zhonglianfenxi.query');
		},
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
			console.log(this.titleDate);
			$('.select-box').css({
				zIndex: 999
			});	
			this.requestData('zhonglianfenxi.query');
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
		//选择下拉框出现
		showList: function(){
			$('.mask-layer').fadeIn();
			$('.select-contents').fadeIn(200);
			$('.triangle_border_up').fadeIn(200);
			$('#container-wrapper').addClass('disScroll');
			$('.mask-layer').click(function(){
				$(this).fadeOut();
				$('.select-contents').fadeOut(200);
				$('.triangle_border_up').fadeOut(200);
				$('#container-wrapper').removeClass('disScroll');
			})
		},
		//输入框搜索关键字查询选择下拉框
		searchData: function(e){
			var self = this;
			var u = window.navigator.userAgent;
			function searchInput(){
				var temp=[],curData=[];
				var dataList = self.selectData;
				if(self.typeName === ''){
					if(self.activeIndex==0){																		
						self.selectData = self.websiteData;				
					}else{								
						self.selectData = self.clientData;				
					};	
				}else{
					for(var i=0;i<dataList.length;i++){
						if(dataList[i]!=undefined){
							if(dataList[i].indexOf(self.typeName) != -1){
								curData.push(dataList[i]);
							}
						}
					};
					console.log(curData);
					if(curData.length != 0){
						self.selectData = curData;
					}else{
						sys.toast('查无此记录');
					}
				};
				
			};
			if(u.indexOf('AppleWebKit' && u.indexOf('Safari') > -1) > -1){
				if(e.which === 13){
					searchInput();
				}
			}else{
				searchInput();
			};
			$('.icon-search').click(searchInput);
		},
		//选择对应网点或客户名称
		chooseType: function(event){
			$('.mask-layer').fadeOut();
			$('.select-contents').fadeOut(200);
			$('.triangle_border_up').fadeOut(200);
			$('#container-wrapper').removeClass('disScroll');
			if(event.currentTarget.innerHTML=="查全部"){
				this.typeName = "";
			}else{
				this.typeName = event.currentTarget.innerHTML;
			};
			event.currentTarget.className='selected';
			$(event.currentTarget).siblings().removeClass('selected');
			this.requestData('zhonglianfenxi.query');
		},
		//获取对应网点或客户名称
		requestSelectData: function(){
			var self = this;
			sys.requestDataNew(self.activeIndex===0 ? "zhonglianfenxi.siteNameQuery" : "zhonglianfenxi.custormNameQuery", {
				startTime : self.startDate,
				endTime : self.endDate,
				weightType : self.activeIndex===0 ? '0':'1'							
			}, function( result ) {				
				console.log(result);
				var dataList = result.data;
				//sys.loading('loadClose');
				if(dataList.length == 0){												
					sys.toast('基础资料暂无数据！');	
				}else{
					for(var i=0;i<dataList.length;i++){
						self.selectData.push(dataList[i]['data_name']);
						if(self.activeIndex==0){
							self.websiteData.push(dataList[i]['data_name']);							
							
						}else{
							self.clientData.push(dataList[i]['data_name']);							
						};
					};					
				};
							
			});
		},
		requestData: function(method){
			var self = this;
			sys.requestDataNew(method, {
				startTime : self.startDate,
				endTime : self.endDate,
				weightType : self.activeIndex===0 ? '0':'1',
				selectName: self.activeIndex===0 ? self.typeName : '',
				customerName: self.activeIndex===1 ? self.typeName : ''				
			}, function( result ) {				
				console.log(result);
				sys.loading('loadClose');
				if(result.data.length == 0){												
					sys.toast('暂无数据！');
					self.zlfxData=[];
					//return false;
				};
				self.readerChartzhongliang(result);
								
			});
		},
		readerChartzhongliang: function(res){			
			var self = this;
			var _totalNum = 0,				
				_resultData = res.data;
			var _showListArr = [],_votes1=0,_votes2=0,_votes3=0,_votes4=0,_votes5=0;
			if(_resultData.length == 0){
				_showListArr = [];
				self.zlfxData = [];
			};			
			if(_resultData.length!=0){
				for(var i=0;i<5;i++){
					if(_resultData[0]['range'+(i+1)]){
						_showListArr.push({name: _resultData[0]['range'+(i+1)],value: 0 })											
					}
				};
				for ( var i = 0; i < _resultData.length; i++ ) {									
					_showListArr.forEach(function(item,index){
						item.value += _resultData[i]['votes'+ (index+1)]
					});
				};				
			};			
			if(_showListArr.length!=0){
				_showListArr.forEach(function(item,index){
					_totalNum+=item.value;
				});
				function sortZlfx(arr){	    
				    for(i=0;i<arr.length-1;i++){
				        for(j=i+1;j<arr.length;j++){
				        	var cur = arr[i];
				            if(parseInt(cur.name.split('-')[0])>parseInt(arr[j].name.split('-')[0])){
				                var temp=arr[j];
				                arr[j]=cur;
				                arr[i]=temp;
				            }
				        }
				    }
				    return arr;		
				}
				sortZlfx(_showListArr);				
				self.zlfxData = _showListArr;							
			};
			console.log(_showListArr);
			this.totalTickets = _totalNum;
			//饼图
			var _chartPie = echarts.init( document.getElementById('ui-chart-website') ),
		        _pieoption = {
		        	baseOption:{
			        	noDataLoadingOption : {
			        		text: '暂无数据',
	                        effect: 'bar',
			        	},
						tooltip : {
					        trigger: 'item',
					        formatter: "{b}<br/>{d}%"
					    },
					    color:['#59ADF3', '#AF89D6', '#FF999A', '#FFCC67','#86D560'], 
					    series : [
					        {
					            name:'重量段分析',
					            type:'pie',						           
					          	radius : [30, '56%'],
					          	center: ['48%', '55%'],	
					          	startAngle: 85,
					          	labelLine: {
					            	normal:{
					            		show: true,
					            		length: 6,
					            		length2: 40,					            							            		
					            	}
					            },
					            label: {
					            	normal: {					            						            							            		     													            							            		
					            		formatter:'{c}票\n{b}',			            							            						                    
					            	}
					            },
					            data : self.zlfxData
					        }
					    ],
		        	},
		        	media: [
		        	    {
		        	    	query:{        	    	
			        	    	maxWidth: 359       	    	
			        	    },
			        	    option:{
			        	    	series:[{
			        	    		radius : [10, '53%'],
			      	    	       	center: ['51%', '52%'],
			      	    	       	labelLine: {
						            	normal:{
						            		show: true,
						            		length: 6,
						            		length2: 30
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
$('#search-data').click(function(){
	app.typeName = '';
	if(app.activeIndex==0){																		
		app.selectData = app.websiteData;				
	}else{								
		app.selectData = app.clientData;				
	};	
});