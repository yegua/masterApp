var queryVue = new Vue({
	el: '#container-wrapper',
	data: {
		title: '承包区余额',				
		typeName: '',
		website: [],
		selectData: [],
		companyName: '',
		dataContent: []
	},	
	created: function() {
		var self = this;
		this.requestSelectData();
		this.requestData();
	},
	methods: {
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
					self.selectData = self.website;
				}else{
					for(var i=0;i<dataList.length;i++){
						if(dataList[i].indexOf(self.typeName) != -1){
							curData.push(dataList[i])
						}
					};
					if(curData.length != 0){
						self.selectData = curData;
					}else{
						sys.toast('查无此记录')
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
			this.requestData();
			event.currentTarget.className='selected';
			$(event.currentTarget).siblings().removeClass('selected');
		},
		requestSelectData: function(){
			var self = this;
			sys.requestDataNew("zhonglianfenxi.siteNameQuery", {
				startTime : "",
				endTime : "",	
				weightType: '0'
			}, function( result ) {				
				console.log(result);
				var dataList = result.data;
				//sys.loading('loadClose');
				if(dataList.length == 0){												
					sys.toast('基础资料暂无数据！');	
				}else{
					for(var i=0;i<dataList.length;i++){
						self.website.push(dataList[i]['data_name']);
					};
					self.selectData = self.website;
				};
							
			});
		},
		requestData: function(){
			var self = this;
			sys.requestDataNew('contractresidual.list', {
				startTime : '',
				endTime : '',
				selectName: self.typeName
			}, function( result ) {
				console.log(result);
				sys.loading('loadClose');
				if(result.data.length == 0){												
					sys.toast('暂无数据！');
					return false;
				};		
				
				self.dataContent = result.data;
				self.companyName = result.data[0].siteName;
			});
		},
	}
})
