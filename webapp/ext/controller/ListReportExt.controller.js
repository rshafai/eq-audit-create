sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';

	return ControllerExtension.extend('gc.agr.aafc.mm.eqauditcreate.ext.controller.ListReportExt', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf gc.agr.aafc.mm.eqauditcreate.ext.controller.ListReportExt
             */
			onInit: function () {
debugger;
				// if (sap.m.MessageBox) {
				// 	var fnOriginalError = sap.m.MessageBox.error;

				// 	sap.m.MessageBox.error = function (vMessage, mOptions) {
				// 		// 2. Inspect the message string trying to open the error box
				// 		var sMessageText = typeof vMessage === "string" ? vMessage : "";
						
				// 		// 3. Match the specific string from your backend information message
				// 		if (sMessageText.includes("Your Information Message Text Here")) {
				// 			// Silently block the window from appearing 
				// 			console.log("Suppressed redundant Error Box for Information message: " + sMessageText);
				// 			return; 
				// 		}

				// 		// 4. Pass normal error messages through unaltered
				// 		return fnOriginalError.apply(this, arguments);
				// 	};
				// }

			},

			onAfterRendering: function (oEvent) {
				var oModel = this.base.getExtensionAPI().getModel();
				if (oModel){
					this._attachMessageListener(oModel);
				}
			},


			editFlow: {
				onBeforeActionExecution: function (oEvent) {
debugger;                    
                    // if (oEvent.getParameter("actionName") && oEvent.getParameter("actionName").endsWith('CreateAudit')) {
                    //     // 1. Get the binding context of the first selected row
                    //     var aContexts = oEvent.getParameter("contexts");
                    //     if (aContexts && aContexts.length > 0) {
                    //         var oSelectedContext = aContexts[0];
                    //         var oRowData = oSelectedContext.getObject();
                            
                    //         // 2. Get the action parameter context
                    //         var oParameterContext = oEvent.getParameter("parameterContext");
                            
                    //         if (oParameterContext) {
                    //             // 3. Set the dynamic defaults into the popup model
                    //             // Note: Technical field names are case-sensitive and must match OData property names
                    //             oParameterContext.setProperty("MaintPlant", oRowData.MaintPlant);
                    //             oParameterContext.setProperty("Location", oRowData.Location);
                    //         }
                    //     } 
                    // }
                },
                onAfterActionExecution: function (sActionName, mParameters) {
 debugger;
					// 1. Check if the string matches your fully qualified action name
                    if (sActionName && sActionName.endsWith("CreateAudit")) {

						// 1. OData V4 actions pass an array of bound contexts that were processed
                        var aActionContexts = mParameters && mParameters.actionContexts;
                        var sNewAuditId = "";

                        if (aActionContexts && aActionContexts.length > 0) {
                            // 2. Fetch the action's execution response object from the first context
                            var oBoundContext = aActionContexts[0];
                            var oResultData = oBoundContext.getObject(); 

                            // 3. If you populated the transient property or returned values in the action
                            if (oResultData && oResultData.NewAuditID) {
                                sNewAuditId = oResultData.NewAuditID;
                            }
                        }
					}
				}


                        
// // 1. Access the global Message Manager
//                         var oMessageManager = sap.ui.getCore().getMessageManager();
//                         var aMessages = oMessageManager.getMessageModel().getData();
//                         var sNewAuditId = "";

//                         // 2. Scan the backend messages for your Audit string
//                         for (var i = 0; i < aMessages.length; i++) {
//                             var sMessageText = aMessages[i].message;
//                             if (sMessageText && sMessageText.includes("Audit created successfully:")) {
//                                 // Extract the ID number from the end of your string
//                                 sNewAuditId = sMessageText.split(": ")[1];
//                                 break;
//                             }
//                         }


					// 	// 2. Access the Extension API
                    //     var oExtensionAPI = this.base.getExtensionAPI();
                        
                    //     // 3. Get the selected context from the table rows
                    //     var aSelectedContexts = oExtensionAPI.getSelectedContexts();
                        
                    //     if (aSelectedContexts && aSelectedContexts.length > 0) {
                    //         // Read the transient property from the first selected row context
                    //         // (Ensure your backend maps NewAuditID to the result structure)
                    //         var sNewAuditId = aSelectedContexts[0].getProperty("NewAuditDocId");
                            
                    //         if (sNewAuditId) {

					// 			// 2. Access the Cross-Application Navigation Service from the Launchpad Container
                    //             var oCrossAppNav = sap.ushell && sap.ushell.Container && 
                    //                                sap.ushell.Container.getService("CrossApplicationNavigation");
                                
                    //             if (oCrossAppNav) {
                    //                 // 3. Trigger intent-based navigation
                    //                 oCrossAppNav.toExternal({
                    //                     target: {
                    //                         semanticObject: "AuditHeader", // Replace with your target app's Semantic Object
                    //                         action: "display"              // Replace with your target app's Action
                    //                     },
                    //                     params: {
                    //                         "AuditDocId": sNewAuditId         // Pass the key to the target app
                    //                     }
                    //                 });
                    //             } else {
                    //                 console.error("Fiori Launchpad CrossApplicationNavigation service not available.");
                    //             }

					// 			// // 4. Get the Navigation Controller
                    //             // var oNavigationController = oExtensionAPI.getNavigationController();
                                
                    //             // // 5. Route to the Audit Header Object Page
                    //             // oNavigationController.navigateInternal("ZQMM_C_Audit_Header", {
                    //             //     keys: {
                    //             //         AuditID: sNewAuditId
                    //             //     }
                    //             // });
                    //         }
                    //     }
                    // }
                // }
            }
        }, //override
		_attachMessageListener: function(oModel){
				// 1. Get the new Audit Doc ID from the messages, so we can redirect to the Object page of AuditHeader
				// 2. Supress duplicate success messages, we get one for each equipment added
				oModel.attachMessageChange(function(oEvent) {
debugger;
					var oMessageManager = sap.ui.getCore().getMessageManager();
					var aNewMessages = oEvent.getParameter("newMessages");
					var aMessagesToRemove = [];
					var sNewAuditId = "";
					if (aNewMessages && aNewMessages.length > 0) {
						// Custom intercept logic here
						for (let i = aNewMessages.length-1; i >= 0; i--) {  // loop backwards
                            let sMessageText = aNewMessages[i].message;
                            if (sMessageText && sMessageText.includes("Audit created successfully:")) {
								if (sNewAuditId){
									// Remove duplicate messages
									aMessagesToRemove.push(aNewMessages[i]);
								} else {
									sNewAuditId = sMessageText.split(": ")[1];
								}
							}
						} // for
						if (aMessagesToRemove.length > 0) {
							oMessageManager.removeMessages(aMessagesToRemove);
						}
						
						if (sNewAuditId){
							//this._navigateToAudit(sNewAuditId);
							var oCrossAppNav = sap.ushell && sap.ushell.Container && 
								sap.ushell.Container.getService("CrossApplicationNavigation");
							if (oCrossAppNav) {
									oCrossAppNav.toExternal({
										target: {
											semanticObject: "EquipAudit", 
											action: "display"              
										},
										params: {
											"AuditDocId": sNewAuditId         
										}
									});
							} else {
									console.error("Fiori Launchpad CrossApplicationNavigation service not available.");
							}
						}
                        

					}
				});
		},

		_navigateToAudit: function(sNewAuditId){
				var oCrossAppNav = sap.ushell && sap.ushell.Container && 
									sap.ushell.Container.getService("CrossApplicationNavigation");
				
				if (oCrossAppNav) {
					oCrossAppNav.toExternal({
						target: {
							semanticObject: "EquipAudit", 
							action: "display"              
						},
						params: {
							"AuditDocId": sNewAuditId         
						}
					});
				} else {
					console.error("Fiori Launchpad CrossApplicationNavigation service not available.");
				}
		}

    });
});