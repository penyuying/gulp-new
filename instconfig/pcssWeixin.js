module.exports={
	//加前缀
	autoprefixer:{
		browsers: ["last 5 versions"],
		// cascade: false,
        flexbox:"no-2009"//处理兼容老浏览器的flex只用display: -webkit-flex;不用display: -webkit-box;2012则两个一起用
	},

	// postcss-cssnext:用下一代CSS书写方式兼容现在浏览器
	// cssnext:{
	// 	Browserslist:["> 0.1%", "android >= 2.6", "chrome >= 4", "edge >= 11", "firefox >= 3.5", "ie >= 5", "ie_mob >= 6", "ios_saf >= 6", "opera >= 5","safari >= 6"],
	// 	features: {
	//       	customProperties: true
	//     },
	//     warnForDuplicates:false
	// },
	postcsscssnext:{
		browsers:["last 5 versions", "ios 8","safari >= 4"],
		autoprefixer: {
			browsers: ["last 5 versions", "ios 8","safari >= 4"],
			cascade: false
		},
		features: {
	      customProperties: false
	    }
	},

	//让CSS兼容旧版IE
	cssgrace:"",


	// postcss-for:for循环插件选项(插件必须运行在postcss-simple-vars插件之前)
	postcssfor:"",

	//postcss-advanced-variables:each循环插件
	postcssadvancedvariables:{ /* options */ },

	//postcss-conditionals:条件插件
	postcssconditionals:"",

	//postcss-simple-vars:变量插件
	postcsssimplevars:{ silent: true },

	//postcss-custom-properties:自定义属性
	// :root {
	//   --color: red;
	// }

	// div {
	//   color: var(--color);
	// }
	postcsscustomproperties:{preserve: false},

	//postcss-nested:嵌套插件
	postcssnested:"",

	//postcss-nested-props:属性嵌套
	postcssnestedprops:"",

	//postcss-sprites:生成CSS雪碧图
	postcsssprites:{
	    stylesheetPath: './dist',
	    spritePath: './dist/images/'
	},
	//postcss-sass-extend:
	postcsssassextend:""
};


