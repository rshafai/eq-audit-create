sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"gc/agr/aafc/mm/eqauditcreate/test/integration/pages/ZQMM_C_Equip_BarcodeTRList",
	"gc/agr/aafc/mm/eqauditcreate/test/integration/pages/ZQMM_C_Equip_BarcodeTRObjectPage"
], function (JourneyRunner, ZQMM_C_Equip_BarcodeTRList, ZQMM_C_Equip_BarcodeTRObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('gc/agr/aafc/mm/eqauditcreate') + '/test/flp.html#app-preview',
        pages: {
			onTheZQMM_C_Equip_BarcodeTRList: ZQMM_C_Equip_BarcodeTRList,
			onTheZQMM_C_Equip_BarcodeTRObjectPage: ZQMM_C_Equip_BarcodeTRObjectPage
        },
        async: true
    });

    return runner;
});

