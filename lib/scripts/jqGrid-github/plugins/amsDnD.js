(function($){
	
	$.jgrid.extend({
		amsDnD: function(opts){
			return this.each(function(){
				var $t = this;
				if(!$t.grid){ return; }
				if($t.p.treeGrid){ return; } // disable for treegrid
				if(!$.fn.draggable || !$.fn.droppable){ return; }
				
				/**
				 * Draggable Section
				 **/
				function updateDnD(){
					var datadnd = $.data($t,"dnd");
					$("tr.jqgrow:not(.ui-draggable)",$t).draggable($.isFunction(datadnd.drag) ? datadnd.drag.call($($t),datadnd) : datadnd.drag);
				}
				
				// create container for DnD helper
				var appender = "<table id='jqgrid_dnd' class='ui-jqgrid-dnd'></table>";
				if($("#jqgrid_dnd").html() === null){
					$('body').append(appender);
				}
				
				// $(selector).amsDnD('updateDnD')
				// Update DnD when DnD is already build
				if(typeof opts == 'string' && opts == 'updateDnD' && $t.p.jqgdnd === true){
					updateDnD();
					return;
				}
				
				/**
				 * Options
				 **/
				opts = $.extend({
					"drag": function(opts){
						return $.extend({
							start: function (ev,ui){
								// if we are in subgrid try to collapse first
								if($t.p.subGrid){
									var subgid = $(ui.helper).attr("id");
									try {
										$($t).jqGrid("collapseSubGridRow",subgid);
									} catch (e) {}
								}
								// hack
								// drag and drop does not insert tr in table, when the table has no rows
								// we try to insert new empty row on the target(s)
								for (var i=0;i<$.data($t,"dnd").connectWith.length;i++){
									if($($.data($t,"dnd").connectWith[i]).jqGrid('getGridParam','reccount') == "0" ){
										$($.data($t,"dnd").connectWith[i]).jqGrid('addRowData','jqg_empty_row',{});
									}
								}
								// fix proper td sizes for dragging items an add highlight class
								if($t.p.multiselect){
									// multiselect enabled
									$("tr",ui.helper).each(function(){
										$("td", this).each(function(i){
											ui.helper.addClass("ui-state-highlight amsDnD");
											this.style.width = $t.grid.headers[i].width+"px";
										})
									})
								} else {
									ui.helper.addClass("ui-state-highlight");
									$("td",ui.helper).each(function(i) {
										this.style.width = $t.grid.headers[i].width+"px";
									});
								}
								
								// custom event function
								if(opts.onstart && $.isFunction(opts.onstart) ) { opts.onstart.call($($t),ev,ui); }
							},
							stop: function (ev,ui){
								if(ui.helper.dropped && !opts.dragcopy){
									var ids = $(ui.helper).attr("id");
									$($t).jqGrid('delRowData',ids);
								}
								// if we have a empty row inserted from start event try to delete it
								for (var i=0;i<$.data($t,"dnd").connectWith.length;i++){
									$($.data($t,"dnd").connectWith[i]).jqGrid('delRowData','jqg_empty_row');
								}
								// callback when drag stop
								if(opts.onstop && $.isFunction(opts.onstop) ) { opts.onstop.call($($t),ev,ui); }
							}
						}, opts.drag_opts || {});
					},
					"drop": function(opts){
						return $.extend({
							accept: function (d,e){
								if(!$(d).hasClass("jqgrow")) { return d; }
								var tid = $(d).closest("table.ui-jqgrid-btable");
								if(tid.length > 0 && $.data(tid[0],"dnd") !== undefined){
									var cn = $.data(tid[0],"dnd").connectWith;
									return $.inArray("#"+this.id,cn) != -1 ? true : false;
								}
								return d;
							},
							drop: function (ev,ui){
								if ($t.p.multiselect){
									var dsttbl = this.id;
									$("tr", ui.helper).each(function (i,v){
										var accept = $(this).attr("id");
										var getdata = $($t).jqGrid("getRowData", accept);
										if(!opts.dropbyname){
											var j=0,tmpdata={},dropname;
											var dropmodel = $($t).jqGrid('getGridParam', 'colModel');
											try {
												if ($t.p.multiselect ^ $t.p.subGrid) {j=1};
												if ($t.p.multiselect && $t.p.subGrid) {j=2};
												for(var key in getdata){
													if(getdata.hasOwnProperty(key) && dropmodel[j]) {
														dropname = dropmodel[j].name;
														tmpdata[dropname] = getdata[key];
													}
													j++;
												}
												getdata = tmpdata;
											} catch (e) {}
										}
										
										ui.helper.dropped = true;
										if(opts.beforedrop && $.isFunction(opts.beforedrop)){
											// parameters to this callback - event, element, data to be inserted, sender, receiver
											// should return object which will be inserted into the receiver
											var datatoinsert = opts.beforedrop.call(this,ev,ui,getdata,$("#"+$t.id),$(this));
											if (typeof datatoinsert != "undefined" && datatoinsert !== null && typeof datatoinsert == "object") { getdata = datatoinsert; }
										}
										
										if(ui.helper.dropped){
											var grid;
											if(opts.autoid){
												if($.isFunction(opts.autoid)) {
													grid = opts.autoid.call(this,getdata);
												} else {
													grid = Math.ceil(Math.random()*1000);
													grid = opts.autoidprefix+grid;
												}
											}
											// null is intepreted as undefined while null as object
											$("#"+dsttbl).jqGrid('addRowData', grid, getdata, opts.droppos);
											// $("#"+dsttbl).jqGrid("addRowData",grid,getdata,opts.droppos);
										}
										if(opts.ondrop && $.isFunction(opts.ondrop)) { opts.ondrop.call(this,ev,ui,getdata); }
									})
								} else {
									// single row drag
									if(!$(ui.draggable).hasClass("jqgrow")) { return; }
									var accept = $(ui.draggable).attr("id");
									var getdata = ui.draggable.parent().parent().jqGrid("getRowData", accept);
									if(!opts.dropbyname){
										var j = 0, tmpdata = {}, dropname;
										var dropmodel = $("#"+this.id).jqGrid('getGridParam', 'colModel');
										// @bugfix: if multiselect enabled, starts j from 1 to skip cb (checkbox) in colModel
										if($t.p.multiselect){j++};
										try {
											for (var key in getdata) {
												if(getdata.hasOwnProperty(key) && dropmodel[j]) {
													dropname = dropmodel[j].name;
													tmpdata[dropname] = getdata[key];
												}
												j++;
											}
											getdata = tmpdata;
										} catch (e) {}
									}
								
									ui.helper.dropped = true;
									if(opts.beforedrop && $.isFunction(opts.beforedrop)){
										// parameters to this callback - event, element, data to be inserted, sender, receiver
										// should return object which will be inserted into the receiver
										var datatoinsert = opts.beforedrop.call(this,ev,ui,getdata,$("#"+$t.id),$(this));
										if (typeof datatoinsert != "undefined" && datatoinsert !== null && typeof datatoinsert == "object") { getdata = datatoinsert; }
									}
									if(ui.helper.dropped){
										var grid;
										if(opts.autoid){
											if($.isFunction(opts.autoid)) {
												grid = opts.autoid.call(this,getdata);
											} else {
												grid = Math.ceil(Math.random()*1000);
												grid = opts.autoidprefix+grid;
											}
										}
										// null is intepreted as undefined while null as object
										$("#"+this.id).jqGrid("addRowData",grid,getdata,opts.droppos);
									}
									if(opts.ondrop && $.isFunction(opts.ondrop)) { opts.ondrop.call(this,ev,ui,getdata); }
								}
							}
						}, opts.drop_opts || {});
					},
					"onstart": null,
					"onstop": null,
					"beforedrop": null,
					"ondrop": null,
					"drop_opts": {
						"activeClass": 	"ui-state-active",
						"hoverClass": 	"ui-state-hover"
					},
					"drag_opts": {
						"revert": "invalid",
						"helper": "clone",
						"cursor": "move",
						"appendTo": "#jqgrid_dnd",
						"zIndex": 5000
					},
					"dragcopy": false,
					"dropbyname": false,
					"droppos": "last",
					"autoid": true,
					"autoidprefix": "dnd_"
				}, opts || {});
				
				/**
				 * Override helper when multiselect enabled
				**/
				if($t.p.multiselect){
					opts.drag_opts = $.extend(opts.drag_opts, {
						"helper": function (ev,ui){
							var selarrrow = $($t).jqGrid('getGridParam', 'selarrrow'),
								container = $("#jqgrid_dnd");
							$.each(selarrrow, function(i,v){
								container.append( $("tr#"+v, $t).clone() )
							})
							return $("tbody", container);
						}
					});
				}
				/**
				 * Droppable Section
				 **/
				// 
				if(!opts.connectWith){ return; }
				opts.connectWith = opts.connectWith.split(",");
				opts.connectWith = $.map(opts.connectWith,function(n){return $.trim(n);});
				// store options into jquery.data
				$.data($t,"dnd",opts);
				
				// add ui-draggable class if grid has entry and DnD is not intialize yet
				if($t.p.reccount != "0" && !$t.p.jqgdnd) {
					updateDnD();
				}
				
				// set initialize true and create droppable instance
				$t.p.jqgdnd = true;
				for (var i=0;i<opts.connectWith.length;i++){
					var cn = opts.connectWith[i];
					$(cn).droppable($.isFunction(opts.drop) ? opts.drop.call($($t),opts) : opts.drop);
				}
			})
		}
	});
	
})(jQuery);