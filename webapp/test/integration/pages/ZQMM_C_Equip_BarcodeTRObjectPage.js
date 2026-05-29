sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'gc.agr.aafc.mm.eqauditcreate',
            componentId: 'ZQMM_C_Equip_BarcodeTRObjectPage',
            contextPath: '/ZQMM_C_Equip_BarcodeTR'
        },
        CustomPageDefinitions
    );
});