function _ab43f5f2a1c872770e373a95908ad831a3f9cc72(){};function _93e485d9004e1197927e4334cb3c53dda2d97003(){};function _afdfc7b96f8a9952919388108711a3d9b1d25176(){};function _0474114cea6da4e42f4e600e744d5100089a40ed(){};function _a6be30a34dcdd6dd9ee4b539ad9101c99a3ec256(){};function _f9ba2e747391a14348a1c4c0a8641f85bd4c7a78(){};function _1c0ede60dc665659dfafecccb181c57466635e4a(){};function _f2c99c02f65f25f0ed2a121b5fa1b7e5a5b6ddad(){};function _12d495bb42620dc17930cb0f5dd99e83c158425a(){};function _d802828ea23f49e2adb3a0a5838253c174de7fd4(){};function _c86db8b583f9bc78db2bebf9cfd7673ea8f7b4ef(){};function _c6aa5578c710d4e29f66132ec9715ba94c597ff4(){};function _6397ac22df86e95c6c50ea36db75fc653016c59c(){};function _2d4bc186f4d4b461e5cdb9f584f6c162ba5442ec(){};function _34ab03d65e77e0d8cec923ea1cf0ee7c552f48e5(){};function _cafede35948246f4cc1797f04e5ab4f841779ef6(){};function _3c35b33da8b675f7c5125e91c7d72cde6ce88cf7(){};function _72dc615499b4d65f07c92e3ce2ab0c4f6e5d1b71(){};function _d006fdfa260c7990ed879385e592e7330d1561f7(){};var mouseWheelHandler = function (e) {
    var e = window.event || e,
        el = e.target,
        cmp,
        offset,
        scroller,
        delta,
        _results = [];
    e.preventDefault(); // prevent scrolling when in iframe
    while (el !== document.body) {
        if (el && el.className && el.className.indexOf('x-container') >= 0) {
            cmp = Ext.getCmp(el.id);
            if (cmp && typeof cmp.getScrollable == 'function' && cmp.getScrollable()) {
                scroller = cmp.getScrollable().getScroller();
                if (scroller) {
                    delta = e.detail ? e.detail*(-120) : e.wheelDelta;
                    offset = { x:0, y: -delta*0.5 };
                    scroller.fireEvent('scrollstart', scroller, scroller.position.x, scroller.position.y, e);
                    scroller.scrollBy(offset.x, offset.y);
                    scroller.snapToBoundary();
                    scroller.fireEvent('scrollend', scroller, scroller.position.x, scroller.position.y-offset.y);
                    break;
                }
            }
        }
    _results.push(el = el.parentNode);
    }
    return _results;
};

if (document.addEventListener) {
    // IE9, Chrome, Safari, Opera
    document.addEventListener('mousewheel', mouseWheelHandler, false);
    // Firefox
    document.addEventListener('DOMMouseScroll', mouseWheelHandler, false);
}
else {
    // IE 6/7/8
    document.attachEvent('onmousewheel', mouseWheelHandler);
}




/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/




Ext.application({
    name: 'Xedu',

    requires: [
        'Ext.MessageBox',
        'Xedu.view.Main',
        'Xedu.Config',
        'Xedu.CommonUtils',
        'Xedu.view.Home',
        'Ext.util.TaskManager',
        'Xedu.controller.Main',
        'Xedu.field.DateTextField',
        'Xedu.view.main.SideMenu',
        'Xedu.override.SizeMonitor',
        'Xedu.override.PaintMonitor',
        'Ext.data.proxy.Rest' ],
    
    controllers: ['Main'],
    
    views: [
        'Main',
//        'Login'      
    ],
    

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },
     
    launch: function() 
    {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

       /*  Initialize the main view */
        Ext.Viewport.add(Ext.create('Xedu.view.Main'));
        
        /*disable animation on alerts */
        Ext.Msg.defaultAllowedConfig.showAnimation = false;
                
        /*
         * Initialize singleton config
         */
        var config = Xedu.Config;
        
        /*
         * set the navigation menu
         */        
        Ext.Viewport.setMenu(Ext.create('Xedu.view.main.SideMenu'), 
        {
            side: 'right',
            reveal: true
        });
        
        /*
         * loading app configs
         */
        Xedu.Config.loadAppConfigs();
        /*
         * redirect to the route after initial load
         * this will automatically get routed to login
         * if the user has not logged in.
         */
        var routeTo = window.location.hash.substr(1);
    	if (routeTo == '')
    		routeTo = "home";
        
    	var cntrller = Xedu.app.getController('Main');
    	cntrller.redirectTo(routeTo);
        /**
         * google classroom api
         */
        // Your Client ID can be retrieved from your project in the Google
        // Developer Console, https://console.developers.google.com
//        var CLIENT_ID = '';
//
//        var SCOPES = ["https://www.googleapis.com/auth/classroom.courses.readonly"];
//
//        /**
//         * Check if current user has authorized this application.
//         */
//        function checkAuth() 
//        {
//            gapi.auth.authorize(
//            {
//              'client_id': CLIENT_ID,
//              'scope': SCOPES.join(' '),
//              'immediate': true
//            }, handleAuthResult);
//        }
        
//        this.getController('Main').redirectToView('home');
    },

    onUpdated: function() 
    {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) 
            {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
    
        
});
