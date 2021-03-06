Ext.define('Xedu.view.slides.FreeDrawComponent', 
{
		extend: 'Ext.draw.Component',
		xtype:'slide-draw-component',
		config: 
		{
			bodyStyle: 'background-color:transparent',
			frame : false, 
			border: false,
			sprite:null,
			list:[], 
			old1:[0, 0], 
			old2:[0, 0],
			event:null,
			listeners: 
			{
				element: 'element',
				initialize: function(scope, eOpts )
				{
					
				},
				'drag': function (e) 
				{
					this.drawDrag(e);
					this.broadCastDrawEvent("ACTION_DRAW",e);	
				},
				'touchstart': function (e) 
				{
					this.drawStart(e);
					this.broadCastDrawEvent("ACTION_DRAW_START",e);	
				},
				'dragend': function (e) 
				{					
					this.drawEnd();
					this.broadCastDrawEvent("ACTION_DRAW_END",{});														
				}
			}
		},
		
		broadCastDrawEvent: function(eventType,msg)
		{			
			console.log("sending draw event type ="+eventType);
			event = Ext.create('Xedu.model.EventModel',{});
	        event.set("type",eventType);	    	        
	        event.set("to",Ext.JSON.decode("['all']"));	    	        
			event.set("msg",Ext.JSON.encode(msg));
			Xedu.CommonUtils.broadCastEventIfPresenter(event);
			
		},
		
		onResize: function () 
		{
			var size = this.element.getSize();
			this.getSurface().setRegion([0, 0, size.width, size.height]);
			this.getSurface('overlay').setRegion([0, 0, size.width, size.height]);
			this.renderFrame();
		},
		
		clearAll: function()
		{
			this.getSurface().destroy();
			this.getSurface('overlay').destroy();
            this.renderFrame();
		},
		
		undo: function()
		{
			var surface = this.getSurface();
			var items = surface.getItems();
			console.log("items on surface = "+items.length);
			surface.remove(items[items.length-1]);
			this.renderFrame();
		},
		
		smoothenList: function(points) 
		{
			if (points.length < 3) 
			{
				return ["M", points[0], points[1]];
			}
			var dx = [], dy = [], result = ['M'],
			i, ln = points.length;
			for (i = 0; i < ln; i += 2) 
			{
				dx.push(points[i]);
				dy.push(points[i + 1]);
			}
			dx = Ext.draw.Draw.spline(dx);
			dy = Ext.draw.Draw.spline(dy);
			result.push(dx[0], dy[0], "C");
			for (i = 1, ln = dx.length; i < ln; i++) 
			{
				result.push(dx[i], dy[i]);
			}
			return result;
		},
		
		drawDrag: function(e)
		{
			var sprite = this.getSprite();
			var list = this.getList();					
			
			if (sprite) 
			{
				var me = this,
				p = e.touches[0].point,
				xy = me.element.getXY(),
				x = p.x - xy[0],
				y = p.y - xy[1],
				dx = this.lastEventX - x,
				dy = this.lastEventY - y,
				D = 40;
				if (dx * dx + dy * dy < D * D) 
				{
					
					list.push(p.x - xy[0], p.y - xy[1]);
				} 
				else 
				{
					if (list.length > 1)
						list.length -= 2;
					list.push(this.lastEventX = p.x - xy[0], this.lastEventY = p.y - xy[1]);
					list.push(this.lastEventX + 1, this.lastEventY + 1);
				}

				var path = this.smoothenList(list);
				sprite.setAttributes({
					path: path
				});

				if (Ext.os.is.Android) 
				{
					Ext.draw.Animator.schedule(function () 
					{
						this.getSurface('overlay').renderFrame();
					}, me);
				} 
				else 
				{
					me.getSurface('overlay').renderFrame();
				}
								
			}
		},
		
		drawEnd: function()
		{
			var sprite = this.getSprite();
			var list =  this.getList();
			var cmp = this;						
			cmp.getSurface().add({
				type: 'path',
				path: sprite.attr.path,
				lineWidth: sprite.attr.lineWidth,
				lineCap: 'round',
				lineJoin: 'round',
				strokeStyle: sprite.attr.strokeStyle
			});
			cmp.getSurface().setDirty(true);
			cmp.getSurface().renderFrame();
			sprite.destroy();
			cmp.getSurface('overlay').renderFrame();
			this.setSprite(null);
			
		},
		
		drawStart: function(e, noOffset)
		{
			var sprite = this.getSprite();
			var list = this.getList();
			if (!sprite) 
			{
				var cmp = this;
				var p0 = cmp.element.getXY();				
				if (noOffset)
					var p = [p0[0], p0[1]];
				else
					var p = [e.pageX - p0[0], e.pageY - p0[1]];
				list = [p[0], p[1], p[0], p[1]];
				console.log("element cordinates = "+Ext.JSON.encode(p0)+" , page corordinates = "+Ext.JSON.encode(p));
				this.lastEventX = p[0];
				this.lastEventY = p[1];
				cmp.getSurface('overlay').element.setStyle({zIndex: 1});
				
				var spriteconfig = {
									type: 'path',
									path: ['M', list[0], list[1], 'L', list[0] + 1e-5, list[1] + 1e-5],
									lineWidth: 30 * Math.random() + 10,
									lineCap: 'round',
									lineJoin: 'round',
									strokeStyle: new Ext.draw.Color(Math.random() * 127 + 128, Math.random() * 127 + 128, Math.random() * 127 + 128)
								};
				
				sprite = cmp.getSurface('overlay').add(spriteconfig);
				old1 = old2 = p;
				cmp.getSurface('overlay').renderFrame();
				this.setSprite(sprite);
				this.setList(list);
				
				/*
				 * 
				 */
				console.log("drawing started !");
				var event = Ext.create('Xedu.model.EventModel',{});
	    	    event.set("type","ACTION_DRAW_START");	    	        
	    	    event.set("to",Ext.JSON.decode("['all']"));				
				event.set("msg",Ext.JSON.encode(e));
				Xedu.CommonUtils.broadCastEventIfPresenter(event);
				
			}
		}
		
		
		
		

});	
