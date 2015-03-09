/*======================================================================*\
|| #################################################################### ||
|| # vBulletin 4.2.1
|| # ---------------------------------------------------------------- # ||
|| # Copyright ©2000-2013 vBulletin Solutions Inc. All Rights Reserved. ||
|| # This file may not be redistributed in whole or significant part. # ||
|| # ---------------- VBULLETIN IS NOT FREE SOFTWARE ---------------- # ||
|| # http://www.vbulletin.com | http://www.vbulletin.com/license.html # ||
|| #################################################################### ||
\*======================================================================*/
vB_XHTML_Ready.subscribe(init_reputation_popupmenus);function init_reputation_popupmenus(C){if(!YAHOO.lang.isUndefined(YAHOO.vBulletin.vBPopupMenu)){var B=YAHOO.util.Dom.getElementsByClassName("reputationpopupmenu",undefined,C);for(var A=0;A<B.length;A++){var D=new vB_ReputationPopupMenu(B[A],YAHOO.vBulletin.vBPopupMenu);YAHOO.vBulletin.vBPopupMenu.register_menuobj(D)}}else{console.log("Popup menu init in wrong order -- reputation popup init")}}function vB_ReputationPopupMenu(A,B){this.init(A,B);if(A.attributes&&A.attributes.rel&&A.attributes.rel.value){this.postid=A.attributes.rel.value}else{if(A.title){this.postid=A.title}else{window.status=A.parentNode.title="No Reputation set."}}}vB_ReputationPopupMenu.prototype=new PopupMenu();vB_ReputationPopupMenu.prototype.handle_submit=function(I){if(I.responseXML){this.close_menu();var H=I.responseXML.getElementsByTagName("error");if(H.length){alert(H[0].firstChild.nodeValue)}else{var B=I.responseXML.getElementsByTagName("reputation")[0];var A=B.getAttribute("repdisplay");var G=B.getAttribute("reppower");var D=B.getAttribute("userid");var F=fetch_tags(document,"span");var E=null;for(var C=0;C<F.length;C++){if(E=F[C].id.match(/^reppower_(\d+)_(\d+)$/)){if(E[2]==D){F[C].innerHTML=G}}else{if(E=F[C].id.match(/^repdisplay_(\d+)_(\d+)$/)){if(E[2]==D){F[C].innerHTML=A}}}}this.menu.parentNode.removeChild(this.menu);this.menu=null;alert(B.firstChild.nodeValue)}}};vB_ReputationPopupMenu.prototype.handle_menu_load=function(E){if(E.responseXML){if(!this.menu){this.menu=document.createElement("div");this.menu.id=this.divname;YAHOO.util.Dom.addClass(this.menu,"popupbody");YAHOO.util.Dom.addClass(this.menu,"popuphover");this.container.appendChild(this.menu);YAHOO.util.Event.on(this.menu,"keypress",this.repinput_onkeypress,this,true)}var B=E.responseXML.getElementsByTagName("error");if(B.length){this.menu.innerHTML='<div class="blockbody"><div class="blockrow">'+B[0].firstChild.nodeValue+"</div></div>"}else{this.menu.innerHTML=E.responseXML.getElementsByTagName("reputationbit")[0].firstChild.nodeValue;var A=fetch_tags(this.menu,"input");for(var D=0;D<A.length;D++){if(A[D].type=="submit"){var F=A[D];var C=document.createElement("input");C.type="button";C.className=F.className;C.value=F.value;YAHOO.util.Event.addListener(C,"click",vB_ReputationPopupMenu.prototype.submit_onclick,this,true);F.parentNode.insertBefore(C,F);F.parentNode.removeChild(F);C.name=F.name;C.id=F.name+"_"+this.postid}}}this.activate_menu();this.open_menu(E.argument.e)}};vB_ReputationPopupMenu.prototype.submit_onclick=function(A){this.submit();YAHOO.util.Event.preventDefault(A);return false};vB_ReputationPopupMenu.prototype.repinput_onkeypress=function(A){switch(A.keyCode){case 13:YAHOO.util.Event.stopEvent(A);this.submit_onclick(A);return false;default:return true}};vB_ReputationPopupMenu.prototype.load_menu=function(B){var C={};for(var A in B){C[A]=B[A]}YAHOO.util.Connect.asyncRequest("POST",fetch_ajax_url("reputation.php?p="+this.postid),{success:this.handle_menu_load,failure:this.handle_ajax_error,timeout:vB_Default_Timeout,scope:this,argument:{e:C}},SESSIONURL+"securitytoken="+SECURITYTOKEN+"&p="+this.postid+"&ajax=1")};vB_ReputationPopupMenu.prototype.handle_ajax_error=function(A){vBulletin_AJAX_Error_Handler(A)};vB_ReputationPopupMenu.prototype.submit=function(){this.psuedoform=new vB_Hidden_Form("reputation.php");this.psuedoform.add_variable("ajax",1);this.psuedoform.add_variables_from_object(this.menu);YAHOO.util.Connect.asyncRequest("POST",fetch_ajax_url("reputation.php?do=addreputation&p="+this.psuedoform.fetch_variable("p")),{success:this.handle_submit,failure:this.handle_ajax_error,timeout:vB_Default_Timeout,scope:this},SESSIONURL+"securitytoken="+SECURITYTOKEN+"&"+this.psuedoform.build_query_string())};