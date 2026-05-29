sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'gc.agr.aafc.mm.eqauditcreate',
            componentId: 'ZQMM_C_Equip_BarcodeTRList',
            contextPath: '/ZQMM_C_Equip_BarcodeTR'
        },
        CustomPageDefinitions
    );
});