define({

	paths : {
		'domReady': '../../lib/requirejs-domready/domReady',
		'angular' : '../../lib/angular/angular',
		'angular-resource' : '../../lib/angular-resource/angular-resource',
		'angularMocks': '../../lib/angular-mocks/angular-mocks',
		'jquery': '../../lib/jquery/jquery'
	},

	shim : {
		'angular' : {
			exports : 'angular'
		},
		'angular-resource' : ['angular'],
		'angular-mocks': ['angular']
	},
	
	baseUrl: "/assets/js",
	deps: ['./bootstrap']
});