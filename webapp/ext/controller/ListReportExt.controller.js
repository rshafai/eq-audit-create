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
				//--- onPageReady does not get triggered in our version
				//---
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
                    oFilterBar.waitForInitialization().then(function () {
                        if (this._bFilterInitialized) { return; }
						//----
						// Make Company Code read-only
						//----
						var aFilterItems = oFilterBar.getFilterItems(); 
                        var oTargetField = aFilterItems.find(function (oItem) {
                            return oItem.getFieldPath() === "CompanyCode";
                        });
                        if (oTargetField) {
                            oTargetField.setEditMode("ReadOnly"); 
                            // Alternatively, you can use: oTargetField.setEditable(false);
                        }
						//----
						// Default values 
						//----
						const sUsername = sap.ushell.Container.getService("UserInfo").getId();
						let sMaintPlant = "";
						let sLocation = "";
						if ( sUsername.startsWith("DEFAULT") || sUsername.startsWith("SHAFAIR") ){
							sMaintPlant = "0240";
							sLocation = "01965";
						}
						const oConditions = oFilterBar.getConditions() || {};
						const oConditionModel = (typeof oFilterBar._getConditionModel === "function") 
												? oFilterBar._getConditionModel() 
												: oFilterBar.getModel("conditions"); // Alternate V4 model path
						if (oConditionModel) { 
							//oConditions["MaintPlant"] = [{ operator: "EQ", values: [sMaintPlant], validated: "Validated" }];
							oConditionModel.setConditions({
								"MaintPlant": [{ operator: "EQ", values: [sMaintPlant] }],
								"Location": [{ operator: "EQ", values: [sLocation] }]
							});
							// oFilterBar.setFilterValues("MaintPlant", "EEQ", sDefaultValue); // "EEQ" stands for 'Equal to' condition in V4
							this._bFilterInitialized = true;
						}
                    }.bind(this));
                }
			},  //onAfterRendering

			


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