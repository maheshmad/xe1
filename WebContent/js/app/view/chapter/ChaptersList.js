Ext.define('Xedu.view.chapter.ChaptersList', 
{
	extend:'Ext.Panel',
	xtype:'chapters-list-panel',	
	requires: [		    		    		    
		    'Xedu.store.ChaptersStore',
		    'Ext.plugin.PullRefresh',
		    'Xedu.view.chapter.ChapterEditForm'
		    ],    
    config: 
    {
        title:"Chapters",
    	layout:'fit',
    	courseid:null,
    	items:[
        	   {
				    docked: 'top',
				    xtype: 'titlebar',
				    ui:'neutral',
				    title:'Chapters',
				    layout:
				    {
				    	type:'hbox',
				    	pack:'right'
				    },
				    defaults:
				    {
				    	ui:'plain'
				    },
				    items:[							           
								{
									   xtype:'searchfield',
									   name:'searchcourses'
								},
								{
									xtype:'button',
									iconCls:'add',
								    handler: function (but,action,eOpts) 
								    {
								    	this.up("chapters-list-panel").createNewChapter();
								    }
								}
				           ]					    
               },
               
               {
			    	xtype:'list',
			    	itemId:'chapter-list-panel-id', 
			        title:'Chapters',
			        /*
			         * panel custom config params
			         */			        
			        scrollable: true,
			        autoDestroy:true,        
			        store: 
			        {
			        	type:'chapters-store'
			        },
			        plugins: [
			                  {
			                      xclass: 'Ext.plugin.PullRefresh',
			                      pullText: 'Pull down to refresh the list!'
			                  }
			              ],                     
			        itemTpl: [
			                  '<div>',
			                  '			<span style="color:gray">No:</span> {id} ',
			                  '			<span style="color:gray">Title: </span>{name}, ',
			                  '</div>',
			              ],        
			        listeners:
			        {
						itemsingletap: function(scope, index, target, record)
						{        		
							console.log("tapped");
							var courseId = this.up("chapters-list-panel").getCourseid();
			           	 	Xedu.app.getController('Main').redirectTo('view/chapter/'+record.data.id+"/topics");
						}
					}
               }]
		            
    },
    
    /*
     * load chapters
     */
    loadChapters: function(courseid)
    {
    	this.setCourseid(courseid);
    	var chaptersList = this.down("list");
    	var restUrl = Xedu.Config.getUrl(Xedu.Config.COURSE_API)+courseid;
    	var chaptersStore = chaptersList.getStore();
    	chaptersStore.getProxy().setUrl(restUrl);
    	chaptersStore.load({callback: function(records, options, success) 
    		{ 
    			console.log(records.length);
    		}});    	
    },
    
    /*
     * show create new form popup
     */    
    createNewChapter: function()
    {
    	var courseidParam = this.getCourseid();
    	
    	var newChapterEditForm = {xtype: 'Xedu.view.chapter.ChapterEditForm',
							      courseid:courseidParam	
						          };
    	
    	Xedu.CommonUtils.showOverlay(newChapterEditForm,{title:"Create New Chapter"});
    
    }
    
});