sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';

	return ControllerExtension.extend('gc.agr.aafc.mm.eqauditcreate.ext.controller.ListReportExt', {
		_bFilterInitialized: false,
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

			onPageReady: function () {
debugger;
				const oFilterBar = this.base.getView().byId("gc.agr.aafc.mm.eqauditcreate::ZQMM_C_Equip_BarcodeTRList--fe::FilterBar");
				//fe::table::ZQMM_C_Audit_Header::LineItem
				//gc.agr.aafc.mm.eqauditcreate::ZQMM_C_Equip_BarcodeTRList--fe::FilterBar::ZQMM_C_Equip_BarcodeTR::FilterField::EquipmentTrim-label
				if (!oFilterBar) { return; }

				// 1. Get the current logged-in Username dynamically
				const sUsername = sap.ushell.Container.getService("UserInfo").getId(); 
				
				// 2. Calculate your dynamic logic based on username
				let sDefaultValue = "";
				if (sUsername.startsWith("DEV")) {
					sDefaultValue = "DEVELOPER_PLANT";
				} else {
					sDefaultValue = "STANDARD_PLANT";
				}

				// 3. Set the filter value using the OData V4 FilterBar control API
				oFilterBar.setFilterValues("YourFieldName", "EEQ", sDefaultValue);
			},

			onAfterRendering: function (oEvent) {
				var oModel = this.base.getExtensionAPI().getModel();
				if (oModel){
					this._attachMessageListener(oModel);
				}
debugger;
				//Default values for filterbar  (onPageReady does not trigger in our version 1.120.32)
				if (this._bFilterInitialized) { return; }

                const oView = this.base.getView(); 
                const oFilterBar = oView.byId("gc.agr.aafc.mm.eqauditcreate::ZQMM_C_Equip_BarcodeTRList--fe::FilterBar::ZQMM_C_Equip_BarcodeTR");

                if (oFilterBar) {
                    // Modern sap.fe FilterBars expose a Promise indicating they are ready
                    oFilterBar.waitForInitialization().then(function () {
                        if (this._bFilterInitialized) { return; }

						const sUsername = sap.ushell.Container.getService("UserInfo").getId();
                        let sDefaultValue = sUsername.startsWith("DEFAULT") ? "0011" : "0012";
						const oConditions = oFilterBar.getConditions() || {};

						const oConditionModel = (typeof oFilterBar._getConditionModel === "function") 
												? oFilterBar._getConditionModel() 
												: oFilterBar.getModel("conditions"); // Alternate V4 model path
						if (oConditionModel) {
							oConditions["MaintPlant"] = [
								{
									operator: "EQ",
									values: [sDefaultValue],
									validated: "Validated"
								}
							];
							oConditionModel.setConditions({
								"MaintPlant": [
									{ operator: "EQ", values: [sDefaultValue] },
									{ operator: "EQ", values: ["0014"] }
								]
							});
							// oFilterBar.setFilterValues("MaintPlant", "EEQ", sDefaultValue); // "EEQ" stands for 'Equal to' condition in V4
							this._bFilterInitialized = true;
						}
                    }.bind(this));
                }
			},  //onAfterRendering

			_onFilterModelChange: function (oConditionModel, oEvent) {
				//--- To set dependent filter values
debugger;
				return;

				// Path structure in the condition model is usually "/conditions/FieldName"
				const sPath = oEvent.getParameter("path");
				
				if (sPath.includes("MaintPlant")) {
					// Grab the current conditions for MaintPlant
					const aPlantConditions = oConditionModel.getConditions("MaintPlant") || [];
					
					// Extract the plant value safely if it exists
					const sCurrentPlant = (aPlantConditions.length > 0 && aPlantConditions[0].values) 
						? aPlantConditions[0].values[0] 
						: null;
	
					// Determine the new Location based on the Plant value
					let sNewLocation = "";
					if (sCurrentPlant === "0012") {
						sNewLocation = "LOC_A"; // Replace with your real business logic
					} else if (sCurrentPlant === "0014") {
						sNewLocation = "LOC_B";
					}
	
					// Fetch all current conditions to avoid erasing other independent filters
					const oAllConditions = oConditionModel.getConditions() || {};
	
					if (sNewLocation) {
						// Update or add the Location condition
						oAllConditions["Location"] = [{ operator: "EQ", values: [sNewLocation] }];
					} else {
						// If the plant was cleared, clear the location as well
						delete oAllConditions["Location"];
					}
	
					// Push the updated map back into the model to refresh the UI
					oConditionModel.setConditions(oAllConditions);
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