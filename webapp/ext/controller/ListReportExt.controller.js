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
				
			},

			onPageReady: function () {
				//--- onPageReady does not get triggered in our version
				//---
				const oFilterBar = this.base.getView().byId("gc.agr.aafc.mm.eqauditcreate::ZQMM_C_Equip_BarcodeTRList--fe::FilterBar");
				if (!oFilterBar) { return; }

				const sUsername = sap.ushell.Container.getService("UserInfo").getId(); 
				
				let sDefaultValue = "";
				if (sUsername.startsWith("DEV")) {
					sDefaultValue = "DEVELOPER_PLANT";
				} else {
					sDefaultValue = "STANDARD_PLANT";
				}
				oFilterBar.setFilterValues("YourFieldName", "EEQ", sDefaultValue);
			},

			onAfterRendering: function (oEvent) {
				var oModel = this.base.getExtensionAPI().getModel();
				if (oModel){
					this._attachMessageListener(oModel);
				}
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
                            // Alternatively, oTargetField.setEditable(false);
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
							oConditionModel.setConditions({
								"MaintPlant": [{ operator: "EQ", values: [sMaintPlant] }],
								"Location": [{ operator: "EQ", values: [sLocation] }]
							});
							// oFilterBar.setFilterValues("MaintPlant", "EEQ", sDefaultValue); // "EEQ" stands for 'Equal to' condition in V4
							this._bFilterInitialized = true;
						}
                    }.bind(this));
                }
			},  

			


			editFlow: {
				onBeforeActionExecution: function (oEvent) {                
                    
                },
                onAfterActionExecution: function (sActionName, mParameters) {
 debugger;
                    if (sActionName && sActionName.endsWith("CreateAudit")) {

						// OData V4 actions pass an array of bound contexts that were processed
                        var aActionContexts = mParameters && mParameters.actionContexts;
                        var sNewAuditId = "";

                        if (aActionContexts && aActionContexts.length > 0) {
                            // Fetch the action's execution response object from the first context
                            var oBoundContext = aActionContexts[0];
                            var oResultData = oBoundContext.getObject(); 

                            // populated the transient property or returned values in the action
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
		

    });
});