var queryVue = new Vue({
	el: '#container-wrapper',
	data: {
		companyName: '',
		code: '',
		phone: '',
		website: '',
		phoneToggle: false,
		siteToggle: false
	},
	created: function(){
		var companyInfo = JSON.parse(sessionStorage.getItem( 'dec_resultFailPage_company' ));
		this.companyName = companyInfo.name;
		this.code = companyInfo.code;
		this.phone = companyInfo.thumbnail;
		this.phoneToggle = companyInfo.thumbnail ? true : false;
		this.website = companyInfo.description;
		this.siteToggle = companyInfo.description ? true : false;
	},
	methods: {
		goExpressWebsite: function(){
			window.location.href=this.website;
		}
	}
})
