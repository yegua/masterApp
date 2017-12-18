Vue.component('picker-box',{
	template: '<div class="date-choose flex flex-pack-between"><div><span v-text="titledate"></span></div><div class="date-icon" id="date-show" @click="showDate()">日期</div><div class="picker-box"><em></em><p class="date-info"><input type="text" name="startTime" placeholder="开始时间" id="start" @click="startFlag===\'start\'?\'\':startQueryFn()" v-model="startDate" readonly onfocus="this.blur();"/>至<input type="text" name="endTime" placeholder="结束时间" id="end"  @click="endFlag===\'end\'?\'\':endQueryFn()" v-model="endDate" readonly onfocus="this.blur();"/></p><p class="date-confirm"><button class="btn-confirm" @click="closeDate()">确认</button></p></div></div>',
	props:['titledate'],
	data:function(){
		return {				
			startDate: '',
			endDate: sys.todayDate(),
			startFlag: '0',
			endFlag: '0',			
		}
	},
	created: function() {
		var self = this;
		this.startDate = sys.dateDiffDay(this.endDate,4,'before');		
	},
	methods: {
		showDate: function(){
			var self = this;
			$('.mask-layer').fadeIn();
			$('.picker-box').fadeIn(200);
			if($('.select-box')){
				$('.select-box').css({
					zIndex: 1
				});
			};
		},
		closeDate: function(){
			this.$emit('close');
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
	}
});