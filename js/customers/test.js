////调用二维码扫描功能
//function scanFn(){
//	console.log(111);
//	try{
//		window.Activity.nativeStartScan(0);
//	}catch(e){
//		
//	}
//}
//function jsScanResult(result,isContinuousScanning){	
//	//alert(result);
//	queryVue.queryCode=result;
//	localStorage.setItem('code',result);
//	window.location.href="queryCheck.html";
//};
var queryVue = new Vue({
	el: '#container-wrapper',
	data: {
		title: '查询结果',
		queryDays: 3,
		billData:[],		
		queryCode: '',
		resultList: []
	},
	created: function(){
		this.loadData();
	},
	methods: {
		loadData: function() {
			//alert('hi')
			if(localStorage.getItem( 'dec_queryDetailPage_listData' ) || localStorage.getItem( 'billDetail' )){
				var _listData = localStorage.getItem( 'dec_queryDetailPage_listData' ),
				_billData = JSON.parse(localStorage.getItem( 'billDetail' )),
				_curData = JSON.parse( _listData ),
				_billDetail = _billData.data,
				_curTrack = _curData.data.track,
				_newSort = [];				
				this.queryCode = _curTrack.billcode;
				this.resultList = _curTrack.details;	
				var len = _curTrack.details.length;
				var days = new Date(this.resultList[len-1].scanTime.slice(0,10)) - new Date(this.resultList[0].scanTime.slice(0,10));
				console.log(this.resultList);
				this.queryDays = Math.ceil(days/(3600*1000*24));
				this.billData = _billDetail;
				console.log(_billDetail);
			}			
		},
		showImg: function(){
//			if(!this.billData.imgurl){
//				sys.toast('暂无图片信息！')
//			}else{
//				$('.showimg').show();
//				$('.mask-layer').show();
//				$('.mask-layer').click(function(){
//					$('.showimg').hide();
//					$('.mask-layer').hide();
//				})
//			};
//			$('.showimg').show();
//			$('.mask-layer').show();
//			$('.mask-layer').click(function(){
//				$('.showimg').hide();
//				$('.mask-layer').hide();
//			});

			
//          $(".imgzoom_img>img").attr("src", $('.showimg>img').attr("src"));
//          $(".imgzoom_img>img").css("marginTop", "-" + ($('.showimg>img').height() / 2) + "px");
//          $(".imgzoom_pack").show();
//        
//          $(".imgzoom_x").on("click", function () {
//              $(".imgzoom_pack").hide();
//              $(".imgzoom_img>img").attr("src", "");
//          });
//          
//          window.ImagesZoom.init({
//              "elem": ".showimg"
//          })
		}
	}
})
