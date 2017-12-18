var queryVue = new Vue({
	el: '#container-wrapper',
	data: {
		title: '查询结果',
		queryDays: 0,
		billData:[],		
		queryCode: '',
		resultList: [],
		imgurl: 'javascript:;'
	},
	created: function(){
		this.loadData();
	},
	methods: {
		loadData: function() {
			var self = this;
			var _listData = sessionStorage.getItem( 'dec_queryDetailPage_listData' ),				
				_curData = JSON.parse( _listData ),				
				_curTrack = _curData.data.track,
				_newSort = [];				
				self.queryCode = _curTrack.billcode;
				self.resultList = _curTrack.details;	
				var len = _curTrack.details.length;
				var days = new Date(self.resultList[len-1].scanTime.slice(0,10)) - new Date(self.resultList[0].scanTime.slice(0,10));
				console.log(self.resultList);
				self.queryDays = Math.ceil(days/(3600*1000*24));				
			if(sessionStorage.getItem( 'billDetail' )){
				var _billData = JSON.parse(sessionStorage.getItem( 'billDetail' )),				
				_billDetail = _billData.data;
				self.billData = _billDetail;
			}else{
				sys.toast('运单详情暂无数据！');
				self.billData=[{
					takepart:'-',	// 取件员
					client:'-',	 // 客户
					weight:'-', // 重量
					freight:'-',	 // 运费
					destination:'-',	// 目的地
					imgurl:'-',	 // 图片
					customer:'-',	// 领取客户
					salesman:'-',	// 业务员
					sitename:'-'	// 领取网点
				}];				
			};
			
		},
		showImg: function(){
			var self = this;
			if(!this.billData.imgurl){
				sys.toast('暂无图片信息！')
			}else{
				self.imgurl = self.billData.imgurl
			};
			//this.imgurl = "http://122.112.213.132:8888/new2/BillPicture/156003/20170820/2017082016/888788908449.jpg";
		}
	}
})
//调用二维码扫描功能
function scanFn(){
	console.log(111);
	try{
		if(u.indexOf('Android') > -1 || u.indexOf('Adr') > -1){
			//sys.toast('安卓' );
			window.Activity.nativeStartScan(0);
		}else if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
			//sys.toast('苹果' );
			window.webkit.messageHandlers.scan.postMessage(null);
		};
		
	}catch(e){
		
	}
}
function jsScanResult(result,isContinuousScanning){	
	//alert(result);
	queryVue.queryCode=result;
	localStorage.setItem('code',result);
	window.location.href="queryCheck.html";
};