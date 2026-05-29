sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/JourneyRunner"
], function (opaTest, runner) {
    "use strict";

    function journey() {
        QUnit.module("First journey");

        opaTest("Start application", function (Given, When, Then) {
            Given.iStartMyApp();

            Then.onTheZQMM_C_Equip_BarcodeTRList.iSeeThisPage();
            Then.onTheZQMM_C_Equip_BarcodeTRList.onFilterBar().iCheckFilterField("Asset No.");
            Then.onTheZQMM_C_Equip_BarcodeTRList.onFilterBar().iCheckFilterField("Location");
            Then.onTheZQMM_C_Equip_BarcodeTRList.onFilterBar().iCheckFilterField("Maintenance Plant");
            Then.onTheZQMM_C_Equip_BarcodeTRList.onFilterBar().iCheckFilterField("Category");
            Then.onTheZQMM_C_Equip_BarcodeTRList.onFilterBar().iCheckFilterField("Cost Center");
            Then.onTheZQMM_C_Equip_BarcodeTRList.onFilterBar().iCheckFilterField("Acquisition Date");
            Then.onTheZQMM_C_Equip_BarcodeTRList.onFilterBar().iCheckFilterField("Functional Location");
            Then.onTheZQMM_C_Equip_BarcodeTRList.onTable().iCheckColumns(8, {"EquipmentName":{"header":"Description"},"StatusCode":{"header":"Status"},"EquipmentCategory":{"header":"Category"},"Material":{"header":"Material"},"AcquisitionDate":{"header":"Acquisition Date"},"AcquisitionValue":{"header":"Acquisition Value"},"CreationDate":{"header":"Created On"},"CreatedByUser":{"header":"Created By"}});

        });


        opaTest("Navigate to ObjectPage", function (Given, When, Then) {
            // Note: this test will fail if the ListReport page doesn't show any data
            
            When.onTheZQMM_C_Equip_BarcodeTRList.onFilterBar().iExecuteSearch();
            
            Then.onTheZQMM_C_Equip_BarcodeTRList.onTable().iCheckRows();

            When.onTheZQMM_C_Equip_BarcodeTRList.onTable().iPressRow(0);
            Then.onTheZQMM_C_Equip_BarcodeTRObjectPage.iSeeThisPage();

        });

        opaTest("Teardown", function (Given, When, Then) { 
            // Cleanup
            Given.iTearDownMyApp();
        });
    }

    runner.run([journey]);
});