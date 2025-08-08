import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/index.tsx";
import { PATH } from "./constants/path.constants.ts";
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css"; //import MRT styles
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "dayjs/locale/vi";
import "leaflet/dist/leaflet.css";
import "suneditor/dist/css/suneditor.min.css";
import { MantineProvider, type MantineThemeOverride } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import AuthPage from "./pages/AuthPage/index.tsx";
import AreaManagementPage from "./pages/AreaManagementPage/index.tsx";
import AreaManagementRegionPage from "./pages/AreaManagementPage/Region/index.tsx";
import AreaManagementZonePage from "./pages/AreaManagementPage/Zone/index.tsx";
import AreaManagementBlockPage from "./pages/AreaManagementPage/Block/index.tsx";
import AreaManagementRowPage from "./pages/AreaManagementPage/Row/index.tsx";
import AreaManagementTreePage from "./pages/AreaManagementPage/Tree/index.tsx";
import AreaManagementMapPage from "./pages/AreaManagementPage/Map/index.tsx";
import AreaManagementSoilTypePage from "./pages/AreaManagementPage/SoilType/index.tsx";
import AreaManagementTerrainPage from "./pages/AreaManagementPage/Terrain/index.tsx";
import AreaManagementCultivationMethodPage from "./pages/AreaManagementPage/CultivationMethod/index.tsx";
import AreaManagementHistoryPage from "./pages/AreaManagementPage/History/index.tsx";
import PlantManagementPage from "./pages/PlantManagementPage/index.tsx";
import PlantManagementTreePage from "./pages/PlantManagementPage/Tree/index.tsx";
import PlantManagementGroupPage from "./pages/PlantManagementPage/Group/index.tsx";
import PlantManagementVarietyPage from "./pages/PlantManagementPage/Variety/index.tsx";
import PlantManagementSeedPage from "./pages/PlantManagementPage/Seed/index.tsx";
import PlantManagementTechnicalDocPage from "./pages/PlantManagementPage/TechnicalDoc/index.tsx";
import SeasonManagementPage from "./pages/SeasonManagementPage/index.tsx";
import SeasonManagementGrowthPage from "./pages/SeasonManagementPage/Growth/index.tsx";
import SeasonManagementCyclePage from "./pages/SeasonManagementPage/Cycle/index.tsx";
import PlanManagementPage from "./pages/PlanManagementPage/index.tsx";
import PlanManagementMainPage from "./pages/PlanManagementPage/Main/index.tsx";
import PlanManagementAssignPage from "./pages/PlanManagementPage/Assign/index.tsx";
import PlanManagementUnplannedPage from "./pages/PlanManagementPage/Unplanned/index.tsx";
import PlanManagementHistoryPage from "./pages/PlanManagementPage/History/index.tsx";
import TaskManagementPage from "./pages/TaskManagementPage/index.tsx";
import TaskManagementMainPage from "./pages/TaskManagementPage/Main/index.tsx";
import TaskManagementBatmanPage from "./pages/TaskManagementPage/Batman/index.tsx";
import HarvestManagementPage from "./pages/HarvestManagementPage/index.tsx";
import HarvestManagementReportPage from "./pages/HarvestManagementPage/Report/index.tsx";
import HarvestManagementQueryMapPage from "./pages/HarvestManagementPage/QueryMap/index.tsx";
import ProductManagementPage from "./pages/ProductManagementPage/index.tsx";
import ProductManagementItemPage from "./pages/ProductManagementPage/Item/index.tsx";
import ProductManagementBOMPage from "./pages/ProductManagementPage/BOM/index.tsx";
import ProductManagementRawMaterialPage from "./pages/ProductManagementPage/RawMaterial/index.tsx";
import ContractManagementPage from "./pages/ContractManagementPage/index.tsx";
import HRManagementPage from "./pages/HRManagementPage/index.tsx";
import HRManagementDepartmentPage from "./pages/HRManagementPage/Department/index.tsx";
import HRManagementPositionPage from "./pages/HRManagementPage/Position/index.tsx";
import HRManagementTeamPage from "./pages/HRManagementPage/Team/index.tsx";
import HRManagementEmployeePage from "./pages/HRManagementPage/Employee/index.tsx";
import FactoryManagementPage from "./pages/FactoryManagementPage/index.tsx";
import FactoryManagementMainPage from "./pages/FactoryManagementPage/Main/index.tsx";
import FactoryManagementHistoryPage from "./pages/FactoryManagementPage/History/index.tsx";
import MachineManagementPage from "./pages/MachineManagementPage/index.tsx";
import MachineManagementMainPage from "./pages/MachineManagementPage/Main/index.tsx";
import MachineManagementUsageHistoryPage from "./pages/MachineManagementPage/UsageHistory/index.tsx";
import MachineManagementMaintenanceHistoryPage from "./pages/MachineManagementPage/MaintenanceHistory/index.tsx";
import PesticideManagementPage from "./pages/PesticideManagementPage/index.tsx";
import PesticideManagementMainPage from "./pages/PesticideManagementPage/Main/index.tsx";
import PesticideManagementCategoryPage from "./pages/PesticideManagementPage/Category/index.tsx";
import SupplyManagementPage from "./pages/SupplyManagementPage/index.tsx";
import StockManagementPage from "./pages/StockManagementPage/index.tsx";
import StockManagementSupplyPage from "./pages/StockManagementPage/Supply/index.tsx";
import StockManagementPesticidePage from "./pages/StockManagementPage/Pesticide/index.tsx";
import StockManagementMachinePage from "./pages/StockManagementPage/Machine/index.tsx";
import StockManagementSeedPage from "./pages/StockManagementPage/Seed/index.tsx";
import FarmingFormEmployeeEvaluationPage from "./pages/FarmingFormPage/Employee-Evaluation/index.tsx";
import FarmingFormHistoryPage from "./pages/FarmingFormPage/History/index.tsx";
import FarmingFormBatmanPage from "./pages/FarmingFormPage/Batman/index.tsx";
import FarmingFormUnPlannedPage from "./pages/FarmingFormPage/UnPlanned/index.tsx";
import SchedulePage from "./pages/SchedulePage/index.tsx";
import ScheduleAddPage from "./pages/SchedulePage/Add/index.tsx";
import GardenManagementPage from "./pages/GardenManagementPage/index.tsx";
import GardenManagementTypePage from "./pages/GardenManagementPage/Type/index.tsx";
import GardenManagementTypeDetailPage from "./pages/GardenManagementPage/Type/Detail/index.tsx";
import GardenManagementAreaPage from "./pages/GardenManagementPage/Area/index.tsx";
import GardenManagementAreaDetailPage from "./pages/GardenManagementPage/Area/Detail/index.tsx";
import GardenManagementMapPage from "./pages/GardenManagementPage/Map/index.tsx";
import FarmingManagementPage from "./pages/FarmingManagementPage/index.tsx";
import FarmingManagementPlanPage from "./pages/FarmingManagementPage/Plan/index.tsx";
import FarmingManagementTaskByPlanPage from "./pages/FarmingManagementPage/TaskByPlan/index.tsx";
import FarmingManagementUnPlannedTaskPage from "./pages/FarmingManagementPage/UnPlannedTask/index.tsx";
import FarmingManagementBatmanPlanPage from "./pages/FarmingManagementPage/BatmanPlan/index.tsx";
import FarmingManagementYieldForecastPage from "./pages/FarmingManagementPage/YieldForecast/index.tsx";
import FarmingFormPlanPage from "./pages/FarmingFormPage/Plan/index.tsx";
import PurchasePage from "./pages/PurchasePage/index.tsx";
import SellPage from "./pages/SellPage/index.tsx";
import FinanceAccountPage from "./pages/FinanceAccountPage/index.tsx";
import AreaManagementAddRegionPage from "./pages/AreaManagementPage/Region/Add/index.tsx";
import AreaManagementRegionDetailPage from "./pages/AreaManagementPage/Region/Detail/index.tsx";
import AreaManagementAddZonePage from "./pages/AreaManagementPage/Zone/Add/index.tsx";
import AreaManagementZoneDetailPage from "./pages/AreaManagementPage/Zone/Detail/index.tsx";
import AreaManagementBlockDetailPage from "./pages/AreaManagementPage/Block/Detail/index.tsx";
import AreaManagementBlockAddPage from "./pages/AreaManagementPage/Block/Add/index.tsx";
import PlantManagementTreeAddPage from "./pages/PlantManagementPage/Tree/Add/index.tsx";
import PlantManagementTreeDetailPage from "./pages/PlantManagementPage/Tree/Detail/index.tsx";
import PlantManagementCatalogPage from "./pages/PlantManagementPage/Catalog/index.tsx";
import SeasonManagementCycleDetailPage from "./pages/SeasonManagementPage/Cycle/Detail/index.tsx";
import SeasonManagementCycleAddPage from "./pages/SeasonManagementPage/Cycle/Add/index.tsx";
import PlanManagementMainDetailPage from "./pages/PlanManagementPage/Main/Detail/index.tsx";
import PlanManagementMainAddPage from "./pages/PlanManagementPage/Main/Add/index.tsx";
import PlanManagementAssignDetailPage from "./pages/PlanManagementPage/Assign/Detail/index.tsx";
import PlanManagementAssignAddPage from "./pages/PlanManagementPage/Assign/Add/index.tsx";
import PlanManagementUnplannedDetailPage from "./pages/PlanManagementPage/Unplanned/Detail/index.tsx";
import PlanManagementUnplannedAddPage from "./pages/PlanManagementPage/Unplanned/Add/index.tsx";
import TaskManagementMainDetailPage from "./pages/TaskManagementPage/Main/Detail/index.tsx";
import ProductManagementItemAddPage from "./pages/ProductManagementPage/Item/Add/index.tsx";
import ContractManagementDetailPage from "./pages/ContractManagementPage/Detail/index.tsx";
import ContractManagementAddPage from "./pages/ContractManagementPage/Add/index.tsx";
import HRManagementTeamDetailPage from "./pages/HRManagementPage/Team/Detail/index.tsx";
import HRManagementTeamAddPage from "./pages/HRManagementPage/Team/Add/index.tsx";
import AreaManagementRowDetailPage from "./pages/AreaManagementPage/Row/Detail/index.tsx";
import AreaManagementCultivationMethodAddPage from "./pages/AreaManagementPage/CultivationMethod/Add/index.tsx";
import FactoryManagementMainAddPage from "./pages/FactoryManagementPage/Main/Add/index.tsx";
import FactoryManagementMainDetailPage from "./pages/FactoryManagementPage/Main/Detail/index.tsx";
import MachineManagementMainDetailPage from "./pages/MachineManagementPage/Main/Detail/index.tsx";
import MachineManagementMainAddPage from "./pages/MachineManagementPage/Main/Add/index.tsx";
import PesticideManagementMainDetailPage from "./pages/PesticideManagementPage/Main/Detail/index.tsx";
import PesticideManagementMainAddPage from "./pages/PesticideManagementPage/Main/Add/index.tsx";
import SeasonManagementGrowthDetailPage from "./pages/SeasonManagementPage/Growth/Detail/index.tsx";
import SeasonManagementGrowthAddPage from "./pages/SeasonManagementPage/Growth/Add/index.tsx";
import AreaManagementRowAddPage from "./pages/AreaManagementPage/Row/Add/index.tsx";
import AreaManagementTreeAddPage from "./pages/AreaManagementPage/Tree/Add/index.tsx";
import PlantManagementSeedAddPage from "./pages/PlantManagementPage/Seed/Add/index.tsx";
import PlantManagementTechnicalDocDetailPage from "./pages/PlantManagementPage/TechnicalDoc/Detail/index.tsx";
import PlantManagementTechnicalDocAddPage from "./pages/PlantManagementPage/TechnicalDoc/Add/index.tsx";
import MapManagementAreaPage from "./pages/MapManagementPage/Area/index.tsx";
import MapManagementPlotPage from "./pages/MapManagementPage/Plot/index.tsx";
import MapManagementMapPage from "./pages/MapManagementPage/Map/index.tsx";
import MapManagementTerrainPage from "./pages/MapManagementPage/Terrain/index.tsx";
import MapManagementRegionPage from "./pages/MapManagementPage/Region/index.tsx";
import MapManagementAddRegionPage from "./pages/MapManagementPage/Region/Add/index.tsx";
import MapManagementRegionDetailPage from "./pages/MapManagementPage/Region/Detail/index.tsx";
import MapManagementAddAreaPage from "./pages/MapManagementPage/Area/Add/index.tsx";
import MapManagementAreaDetailPage from "./pages/MapManagementPage/Area/Detail/index.tsx";
import MapManagementPlotAddPage from "./pages/MapManagementPage/Plot/Add/index.tsx";
import MapManagementDetailPlotPage from "./pages/MapManagementPage/Plot/Detail/index.tsx";
import StockManagementAreaPage from "./pages/StockManagementPage/Area/index.tsx";
import StockManagementAddAreaPage from "./pages/StockManagementPage/Area/Add/index.tsx";
import StockManagementAreaDetailPage from "./pages/StockManagementPage/Area/Detail/index.tsx";
import StockManagementFertilizerPage from "./pages/StockManagementPage/Fertilizer/index.tsx";
import FertilizerManagementTypePage from "./pages/FertilizerManagementPage/Type/index.tsx";
import FertilizerManagementMainPage from "./pages/FertilizerManagementPage/Main/index.tsx";
import StockManagementDeliveryPage from "./pages/StockManagementPage/Delivery/index.tsx";
import StockManagementAddDeliveryPage from "./pages/StockManagementPage/Delivery/Add/index.tsx";
import StockManagementDeliveryDetailPage from "./pages/StockManagementPage/Delivery/Detail/index.tsx";
import CompanyPage from "./pages/CompanyPage/index.tsx";
import VendorPage from "./pages/VendorPage/index.tsx";
import CompanyDetailPage from "./pages/CompanyPage/Detail/index.tsx";
import { CompanyAddPage } from "./pages/CompanyPage/Add/index.tsx";
import HRManagementEmployeeAddPage from "./pages/HRManagementPage/Employee/Add/index.tsx";
import HRManagementEmployeeDetailPage from "./pages/HRManagementPage/Employee/Detail/index.tsx";
import SupplyManagementAddPage from "./pages/SupplyManagementPage/Add/index.tsx";
import FertilizerManagementMainAddPage from "./pages/FertilizerManagementPage/Main/Add/index.tsx";
import StockManagementIOPage from "./pages/StockManagementPage/Supply/Add/index.tsx";
import SupplyManagementCategoryPage from "./pages/SupplyManagementPage/Type/index.tsx";
import MachineManagementCategoryPage from "./pages/MachineManagementPage/Type/index.tsx";
import PesticideUsageHistoryPage from "./pages/PesticideManagementPage/MaintenanceHistory/index.tsx";
import SupplyManagementUsageHistoryPage from "./pages/SupplyManagementPage/UsageHistory/index.tsx";
import FertilizerManagementUsageHistoryPage from "./pages/FertilizerManagementPage/UsageHistory/index.tsx";
import MachineManagementDisposalHistoryPage from "./pages/MachineManagementPage/Disposal/index.tsx";
import PesticideManagementDisposalPage from "./pages/PesticideManagementPage/Disposal/index.tsx";
import SupplyManagementDisposalPage from "./pages/SupplyManagementPage/Disposal/index.tsx";
import FertilizerManagementDisposalPage from "./pages/FertilizerManagementPage/Disposal/index.tsx";
import ProductManagementTypePage from "./pages/ProductManagementPage/Type/index.tsx";
import ProductManagementRawMaterialTypePage from "./pages/ProductManagementPage/RawMaterial/Type/index.tsx";
import ProductManagementRawMaterialAddPage from "./pages/ProductManagementPage/RawMaterial/Add/index.tsx";
import PurchaseManagementProductPage from "./pages/PurchaseManagementPage/Product/index.tsx";
import PurchaseManagementMaterialPage from "./pages/PurchaseManagementPage/Material/index.tsx";
import PurchaseManagementProductAddPage from "./pages/PurchaseManagementPage/Product/Add/index.tsx";
import PurchaseManagementMaterialAddPage from "./pages/PurchaseManagementPage/Material/Add/index.tsx";
import OrderManagememtQuickPage from "./pages/OrderManagementPage/Quick/index.tsx";
import OrderManagementAddressPage from "./pages/OrderManagementPage/Address/index.tsx";
import BillManagementUserPage from "./pages/BillManagementPage/User/index.tsx";
import BillManagementUserDetailPage from "./pages/BillManagementPage/User/Detail/index.tsx";
import BillManagementCompanyPage from "./pages/BillManagementPage/Company/index.tsx";
import BillManagementCompanyDetailPage from "./pages/BillManagementPage/Company/Detail/index.tsx";
import DebtManagementReceivablePage from "./pages/DebtManagementPage/Receivable/index.tsx";
import DebtManagementReceivableAddPage from "./pages/DebtManagementPage/Receivable/Add/index.tsx";
import DebtManagementReceivableDetailPage from "./pages/DebtManagementPage/Receivable/Detail/index.tsx";
import DebtManagementPayablePage from "./pages/DebtManagementPage/Payable/index.tsx";
import DebtManagementPayableAddPage from "./pages/DebtManagementPage/Payable/Add/index.tsx";
import DebtManagementPayableDetailPage from "./pages/DebtManagementPage/Payable/Detail/index.tsx";
import PackagingSpecificationPage from "./pages/PackagingSpecificationPage/index.tsx";
import BillManagementCompanyAddPage from "./pages/BillManagementPage/Company/Add/index.tsx";
import OrderManagementCreatePage from "./pages/OrderManagementPage/Create/index.tsx";
import CompanyAddressPage from "./pages/CompanyPage/Address/index.tsx";
import CompanyAddressAddPage from "./pages/CompanyPage/Address/Add/index.tsx";
import BankManagementPage from "./pages/BankManagementPage/index.tsx";
import FinancePurposeExpensePage from "./pages/FinancePage/PurposeExpense/index.tsx";
import FinancePurposeExpenseAddPage from "./pages/FinancePage/PurposeExpense/Add/index.tsx";
import FinancePurposeReceivePage from "./pages/FinancePage/PurposeReceive/index.tsx";
import FinancePurposeReceiveAddPage from "./pages/FinancePage/PurposeReceive/Add/index.tsx";
import FinancePurposeHistoryPage from "./pages/FinancePage/History/index.tsx";
import FinancePurposeStatisticPage from "./pages/FinancePage/Statistics/index.tsx";
import FinancePurposeManagementPage from "./pages/FinancePage/Purpose/index.tsx";
import ContactPage from "./pages/ContactPage/index.tsx";
const theme: MantineThemeOverride = {
  fontFamily: "MyFont, sans-serif",
  primaryColor: "brand",
  colors: {
    brand: [
      "#E6F4EC", // brand[0] - lightest
      "#C1E4D1",
      "#9CD4B7",
      "#76C59C",
      "#51B581",
      "#4CAF50", // brand[5] - main leaf green
      "#3D9E45",
      "#2E873A",
      "#1F7030",
      "#1A5013", // brand[9] - dark green
    ],
    accent: [
      "#FFF3E0",
      "#FFE0B2",
      "#FFCC80",
      "#FFB74D",
      "#FFA726", // main yellow-orange
      "#FB8C00", // hover/active orange
      "#EF6C00",
      "#E65100",
      "#BF360C",
      "#A33A00",
    ],
  },
  components: {
    NavLink: {
      styles: () => ({
        root: {
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#E8F5E9", // light green background
            color: "#388E3C", // darker green
            borderColor: "#388E3C",
          },
        },
      }),
    },
  },
  headings: {
    fontFamily: "MyFont, sans-serif",
  },

  defaultRadius: "md",
};
const ROUTES = [
  <Route path={PATH.AUTH} element={<AuthPage />} />,
  <Route path={PATH.HOME} element={<HomePage />} />,
  <Route path={PATH.SCHEDULE} element={<SchedulePage />} />,
  <Route path={PATH.SCHEDULE_ADD} element={<ScheduleAddPage />} />,

  <Route path={PATH.GARDEN_MANAGEMENT} element={<GardenManagementPage />} />,
  <Route
    path={PATH.GARDEN_MANAGEMENT_TYPE}
    element={<GardenManagementTypePage />}
  />,
  <Route
    path={PATH.GARDEN_MANAGEMENT_TYPE_DETAIL}
    element={<GardenManagementTypeDetailPage />}
  />,
  <Route
    path={PATH.GARDEN_MANAGEMENT_AREA}
    element={<GardenManagementAreaPage />}
  />,
  <Route
    path={PATH.GARDEN_MANAGEMENT_AREA_DETAIL}
    element={<GardenManagementAreaDetailPage />}
  />,
  <Route
    path={PATH.GARDEN_MANAGEMENT_MAP}
    element={<GardenManagementMapPage />}
  />,

  <Route path={PATH.FARMING_MANAGEMENT} element={<FarmingManagementPage />} />,
  <Route path={PATH.FARMING_PLAN} element={<FarmingManagementPlanPage />} />,
  <Route
    path={PATH.FARMING_TASK_BY_PLAN}
    element={<FarmingManagementTaskByPlanPage />}
  />,
  <Route
    path={PATH.FARMING_UNPLANNED_TASK}
    element={<FarmingManagementUnPlannedTaskPage />}
  />,
  <Route
    path={PATH.FARMING_BATMAN_PLAN}
    element={<FarmingManagementBatmanPlanPage />}
  />,
  <Route
    path={PATH.FARMING_YIELD_FORECAST}
    element={<FarmingManagementYieldForecastPage />}
  />,
  <Route path={PATH.FARMING_FORM_BY_PLAN} element={<FarmingFormPlanPage />} />,
  <Route
    path={PATH.FARMING_FORM_UNPLANNED}
    element={<FarmingFormUnPlannedPage />}
  />,
  <Route path={PATH.FARMING_FORM_BATMAN} element={<FarmingFormBatmanPage />} />,
  <Route
    path={PATH.FARMING_FORM_HISTORY}
    element={<FarmingFormHistoryPage />}
  />,
  <Route
    path={PATH.FARMING_FORM_EMPLOYEE_EVALUATION}
    element={<FarmingFormEmployeeEvaluationPage />}
  />,

  <Route path={PATH.AREA_MANAGEMENT} element={<AreaManagementPage />} />,
  <Route path={PATH.AREA_REGION} element={<AreaManagementRegionPage />} />,
  <Route
    path={PATH.AREA_ADD_REGION}
    element={<AreaManagementAddRegionPage />}
  />,
  <Route
    path={PATH.AREA_REGION_DETAIL}
    element={<AreaManagementRegionDetailPage />}
  />,
  <Route path={PATH.AREA_ZONE} element={<AreaManagementZonePage />} />,
  <Route path={PATH.AREA_ADD_ZONE} element={<AreaManagementAddZonePage />} />,
  <Route
    path={PATH.AREA_ZONE_DETAIL}
    element={<AreaManagementZoneDetailPage />}
  />,
  <Route path={PATH.AREA_BLOCK} element={<AreaManagementBlockPage />} />,
  <Route path={PATH.AREA_ADD_BLOCK} element={<AreaManagementBlockAddPage />} />,
  <Route
    path={PATH.AREA_BLOCK_DETAIL}
    element={<AreaManagementBlockDetailPage />}
  />,
  <Route path={PATH.AREA_ROW} element={<AreaManagementRowPage />} />,
  <Route
    path={PATH.AREA_ROW_DETAIL}
    element={<AreaManagementRowDetailPage />}
  />,
  <Route path={PATH.AREA_ADD_ROW} element={<AreaManagementRowAddPage />} />,
  <Route path={PATH.AREA_TREE} element={<AreaManagementTreePage />} />,
  <Route path={PATH.AREA_ADD_TREE} element={<AreaManagementTreeAddPage />} />,
  <Route path={PATH.AREA_MAP} element={<AreaManagementMapPage />} />,
  <Route path={PATH.AREA_SOIL} element={<AreaManagementSoilTypePage />} />,
  <Route path={PATH.AREA_TERRAIN} element={<AreaManagementTerrainPage />} />,
  <Route
    path={PATH.AREA_CULTIVATION_METHOD}
    element={<AreaManagementCultivationMethodPage />}
  />,
  <Route
    path={PATH.AREA_ADD_CULTIVATION_METHOD}
    element={<AreaManagementCultivationMethodAddPage />}
  />,
  <Route path={PATH.AREA_HISTORY} element={<AreaManagementHistoryPage />} />,
  <Route path={PATH.MAP_AREA} element={<MapManagementAreaPage />} />,
  <Route path={PATH.MAP_ADD_AREA} element={<MapManagementAddAreaPage />} />,
  <Route
    path={PATH.MAP_AREA_DETAIL}
    element={<MapManagementAreaDetailPage />}
  />,
  <Route path={PATH.MAP_PLOT} element={<MapManagementPlotPage />} />,
  <Route path={PATH.MAP_ADD_PLOT} element={<MapManagementPlotAddPage />} />,
  <Route
    path={PATH.MAP_PLOT_DETAIL}
    element={<MapManagementDetailPlotPage />}
  />,
  <Route path={PATH.MAP_MAP} element={<MapManagementMapPage />} />,
  <Route path={PATH.MAP_TERRAIN} element={<MapManagementTerrainPage />} />,
  <Route path={PATH.MAP_REGION} element={<MapManagementRegionPage />} />,
  <Route path={PATH.MAP_ADD_REGION} element={<MapManagementAddRegionPage />} />,
  <Route
    path={PATH.MAP_REGION_DETAIL}
    element={<MapManagementRegionDetailPage />}
  />,

  <Route path={PATH.PLANT_MANAGEMENT} element={<PlantManagementPage />} />,
  <Route path={PATH.PLANT_TREE} element={<PlantManagementTreePage />} />,
  <Route path={PATH.PLANT_ADD_TREE} element={<PlantManagementTreeAddPage />} />,
  <Route
    path={PATH.PLANT_TREE_DETAIL}
    element={<PlantManagementTreeDetailPage />}
  />,
  <Route path={PATH.PLANT_GROUP} element={<PlantManagementGroupPage />} />,
  <Route path={PATH.PLANT_VARIETY} element={<PlantManagementVarietyPage />} />,
  <Route path={PATH.PLANT_SEED} element={<PlantManagementSeedPage />} />,
  <Route path={PATH.PLANT_ADD_SEED} element={<PlantManagementSeedAddPage />} />,
  <Route path={PATH.PLANT_CATALOG} element={<PlantManagementCatalogPage />} />,
  <Route
    path={PATH.PLANT_TECHNICAL_DOC}
    element={<PlantManagementTechnicalDocPage />}
  />,
  <Route
    path={PATH.PLANT_TECHNICAL_DOC_DETAIL}
    element={<PlantManagementTechnicalDocDetailPage />}
  />,
  <Route
    path={PATH.PLANT_ADD_TECHNICAL_DOC}
    element={<PlantManagementTechnicalDocAddPage />}
  />,
  <Route path={PATH.SEASON_MANAGEMENT} element={<SeasonManagementPage />} />,
  <Route path={PATH.SEASON_GROWTH} element={<SeasonManagementGrowthPage />} />,
  <Route
    path={PATH.SEASON_GROWTH_DETAIL}
    element={<SeasonManagementGrowthDetailPage />}
  />,
  <Route
    path={PATH.SEASON_ADD_GROWTH}
    element={<SeasonManagementGrowthAddPage />}
  />,
  <Route path={PATH.SEASON_CYCLE} element={<SeasonManagementCyclePage />} />,
  <Route
    path={PATH.SEASON_CYCLE_DETAIL}
    element={<SeasonManagementCycleDetailPage />}
  />,
  <Route
    path={PATH.SEASON_ADD_CYCLE}
    element={<SeasonManagementCycleAddPage />}
  />,

  <Route path={PATH.PLAN_MANAGEMENT} element={<PlanManagementPage />} />,
  <Route path={PATH.PLAN_MAIN} element={<PlanManagementMainPage />} />,
  <Route
    path={PATH.PLAN_MAIN_DETAIL}
    element={<PlanManagementMainDetailPage />}
  />,
  <Route path={PATH.PLAN_ADD_MAIN} element={<PlanManagementMainAddPage />} />,
  <Route path={PATH.PLAN_ASSIGN} element={<PlanManagementAssignPage />} />,
  <Route
    path={PATH.PLAN_ASSIGN_DETAIL}
    element={<PlanManagementAssignDetailPage />}
  />,
  <Route
    path={PATH.PLAN_ADD_ASSIGN}
    element={<PlanManagementAssignAddPage />}
  />,
  <Route
    path={PATH.PLAN_UNPLANNED}
    element={<PlanManagementUnplannedPage />}
  />,
  <Route
    path={PATH.PLAN_UNPLANNED_DETAIL}
    element={<PlanManagementUnplannedDetailPage />}
  />,
  <Route
    path={PATH.PLAN_ADD_UNPLANNED}
    element={<PlanManagementUnplannedAddPage />}
  />,
  <Route path={PATH.PLAN_HISTORY} element={<PlanManagementHistoryPage />} />,

  <Route path={PATH.TASK_MANAGEMENT} element={<TaskManagementPage />} />,
  <Route path={PATH.TASK_MAIN} element={<TaskManagementMainPage />} />,
  <Route
    path={PATH.TASK_MAIN_DETAIL}
    element={<TaskManagementMainDetailPage />}
  />,
  <Route path={PATH.TASK_BATMAN} element={<TaskManagementBatmanPage />} />,

  <Route path={PATH.HARVEST_MANAGEMENT} element={<HarvestManagementPage />} />,
  <Route
    path={PATH.HARVEST_REPORT}
    element={<HarvestManagementReportPage />}
  />,
  <Route
    path={PATH.HARVEST_QUERY}
    element={<HarvestManagementQueryMapPage />}
  />,

  <Route path={PATH.PRODUCT_MANAGEMENT} element={<ProductManagementPage />} />,
  <Route path={PATH.PRODUCT_ITEM} element={<ProductManagementItemPage />} />,
  <Route
    path={PATH.PRODUCT_ADD_ITEM}
    element={<ProductManagementItemAddPage />}
  />,
  <Route path={PATH.PRODUCT_BOM} element={<ProductManagementBOMPage />} />,
  <Route
    path={PATH.PRODUCT_RAW_MATERIAL}
    element={<ProductManagementRawMaterialPage />}
  />,
  <Route
    path={PATH.PRODUCT_RAW_MATERIAL_ADD}
    element={<ProductManagementRawMaterialAddPage />}
  />,
  <Route
    path={PATH.PRODUCT_RAW_MATERIAL_TYPE}
    element={<ProductManagementRawMaterialTypePage />}
  />,
  <Route path={PATH.PRODUCT_TYPE} element={<ProductManagementTypePage />} />,

  <Route
    path={PATH.CONTRACT_MANAGEMENT}
    element={<ContractManagementPage />}
  />,
  <Route path={PATH.CONTRACT_SALE} element={<ContractManagementPage />} />,
  <Route path={PATH.CONTRACT_EXCHANGE} element={<ContractManagementPage />} />,
  <Route path={PATH.CONTRACT_GIFT} element={<ContractManagementPage />} />,
  <Route path={PATH.CONTRACT_LOAN} element={<ContractManagementPage />} />,
  <Route path={PATH.CONTRACT_RENT} element={<ContractManagementPage />} />,
  <Route path={PATH.CONTRACT_BORROW} element={<ContractManagementPage />} />,
  <Route path={PATH.CONTRACT_SERVICE} element={<ContractManagementPage />} />,
  <Route path={PATH.CONTRACT_TRANSPORT} element={<ContractManagementPage />} />,
  <Route
    path={PATH.CONTRACT_PROCESSING}
    element={<ContractManagementPage />}
  />,
  <Route path={PATH.CONTRACT_STORAGE} element={<ContractManagementPage />} />,
  <Route
    path={PATH.CONTRACT_AUTHORIZATION}
    element={<ContractManagementPage />}
  />,
  <Route
    path={PATH.CONTRACT_PARTNERSHIP}
    element={<ContractManagementPage />}
  />,

  <Route
    path={PATH.CONTRACT_MANAGEMENT_DETAIL}
    element={<ContractManagementDetailPage />}
  />,
  <Route
    path={PATH.CONTRACT_ADD_MANAGEMENT}
    element={<ContractManagementAddPage />}
  />,

  <Route path={PATH.HR_MANAGEMENT} element={<HRManagementPage />} />,
  <Route path={PATH.HR_DEPARTMENT} element={<HRManagementDepartmentPage />} />,
  <Route path={PATH.HR_POSITION} element={<HRManagementPositionPage />} />,
  <Route path={PATH.HR_TEAM} element={<HRManagementTeamPage />} />,
  <Route path={PATH.HR_TEAM_DETAIL} element={<HRManagementTeamDetailPage />} />,
  <Route path={PATH.HR_ADD_TEAM} element={<HRManagementTeamAddPage />} />,
  <Route path={PATH.HR_EMPLOYEE} element={<HRManagementEmployeePage />} />,
  <Route
    path={PATH.HR_ADD_EMPLOYEE}
    element={<HRManagementEmployeeAddPage />}
  />,
  <Route
    path={PATH.HR_EMPLOYEE_DETAIL}
    element={<HRManagementEmployeeDetailPage />}
  />,

  <Route path={PATH.FACTORY_MANAGEMENT} element={<FactoryManagementPage />} />,
  <Route path={PATH.FACTORY_MAIN} element={<FactoryManagementMainPage />} />,
  <Route
    path={PATH.FACTORY_ADD_MAIN}
    element={<FactoryManagementMainAddPage />}
  />,
  <Route
    path={PATH.FACTORY_MAIN_DETAIL}
    element={<FactoryManagementMainDetailPage />}
  />,
  <Route
    path={PATH.FACTORY_HISTORY}
    element={<FactoryManagementHistoryPage />}
  />,

  <Route path={PATH.MACHINE_MANAGEMENT} element={<MachineManagementPage />} />,
  <Route path={PATH.MACHINE_MAIN} element={<MachineManagementMainPage />} />,
  <Route
    path={PATH.MACHINE_MAIN_DETAIL}
    element={<MachineManagementMainDetailPage />}
  />,
  <Route
    path={PATH.MACHINE_ADD_MAIN}
    element={<MachineManagementMainAddPage />}
  />,
  <Route
    path={PATH.MACHINE_TYPE}
    element={<MachineManagementCategoryPage />}
  />,
  <Route
    path={PATH.MACHINE_USAGE_HISTORY}
    element={<MachineManagementUsageHistoryPage />}
  />,
  <Route
    path={PATH.MACHINE_MAINTENANCE_HISTORY}
    element={<MachineManagementMaintenanceHistoryPage />}
  />,
  <Route
    path={PATH.MACHINE_DISPOSAL_HISTORY}
    element={<MachineManagementDisposalHistoryPage />}
  />,
  <Route
    path={PATH.PESTICIDE_MANAGEMENT}
    element={<PesticideManagementPage />}
  />,
  <Route
    path={PATH.PESTICIDE_HISTORY}
    element={<PesticideUsageHistoryPage />}
  />,
  <Route
    path={PATH.PESTICIDE_MAIN}
    element={<PesticideManagementMainPage />}
  />,
  <Route
    path={PATH.PESTICIDE_MAIN_DETAIL}
    element={<PesticideManagementMainDetailPage />}
  />,
  <Route
    path={PATH.PESTICIDE_ADD_MAIN}
    element={<PesticideManagementMainAddPage />}
  />,
  <Route
    path={PATH.PESTICIDE_CATEGORY}
    element={<PesticideManagementCategoryPage />}
  />,
  <Route
    path={PATH.PESTICIDE_DISPOSAL_HISTORY}
    element={<PesticideManagementDisposalPage />}
  />,

  <Route path={PATH.SUPPLY_MAIN} element={<SupplyManagementPage />} />,
  <Route path={PATH.SUPPLY_ADD_MAIN} element={<SupplyManagementAddPage />} />,
  <Route path={PATH.SUPPLY_TYPE} element={<SupplyManagementCategoryPage />} />,
  <Route
    path={PATH.SUPPLY_DISPOSAL_HISTORY}
    element={<SupplyManagementDisposalPage />}
  />,
  <Route
    path={PATH.SUPPLY_HISTORY}
    element={<SupplyManagementUsageHistoryPage />}
  />,
  <Route path={PATH.STOCK_AREA} element={<StockManagementAreaPage />} />,
  <Route path={PATH.STOCK_ADD_AREA} element={<StockManagementAddAreaPage />} />,
  <Route
    path={PATH.STOCK_AREA_DETAIL}
    element={<StockManagementAreaDetailPage />}
  />,

  <Route path={PATH.STOCK_MANAGEMENT} element={<StockManagementPage />} />,
  <Route path={PATH.STOCK_SUPPLY} element={<StockManagementSupplyPage />} />,
  <Route path={PATH.STOCK_MANAGEMENT_IO} element={<StockManagementIOPage />} />,
  <Route
    path={PATH.STOCK_PESTICIDE}
    element={<StockManagementPesticidePage />}
  />,
  <Route
    path={PATH.STOCK_FERTILIZER}
    element={<StockManagementFertilizerPage />}
  />,

  <Route path={PATH.STOCK_MACHINE} element={<StockManagementMachinePage />} />,
  <Route path={PATH.STOCK_SEED} element={<StockManagementSeedPage />} />,

  <Route path={PATH.PURCHASE} element={<PurchasePage />} />,
  <Route path={PATH.SELL} element={<SellPage />} />,

  <Route path={PATH.FINANCE_ACCOUNT} element={<FinanceAccountPage />} />,
  <Route
    path={PATH.FERTILIZER_TYPE}
    element={<FertilizerManagementTypePage />}
  />,
  <Route
    path={PATH.FERTILIZER_MAIN}
    element={<FertilizerManagementMainPage />}
  />,
  <Route
    path={PATH.FERTILIZER_MAIN_ADD}
    element={<FertilizerManagementMainAddPage />}
  />,
  <Route
    path={PATH.FERTILIZER_HISTORY}
    element={<FertilizerManagementUsageHistoryPage />}
  />,
  <Route
    path={PATH.FERTILIZER_DISPOSAL_HISTORY}
    element={<FertilizerManagementDisposalPage />}
  />,
  <Route
    path={PATH.STOCK_DELIVERY}
    element={<StockManagementDeliveryPage />}
  />,
  <Route
    path={PATH.STOCK_ADD_DELIVERY}
    element={<StockManagementAddDeliveryPage />}
  />,
  <Route
    path={PATH.STOCK_DELIVERY_DETAIL}
    element={<StockManagementDeliveryDetailPage />}
  />,
  <Route path={PATH.COMPANY} element={<CompanyPage />} />,
  <Route path={PATH.COMPANY_ADDRESS} element={<CompanyAddressPage />} />,
  <Route path={PATH.COMPANY_ADDRESS_ADD} element={<CompanyAddressAddPage />} />,
  <Route path={PATH.COMPANY_CUSTOMER} element={<CompanyPage />} />,
  <Route path={PATH.COMPANY_PARTNER} element={<CompanyPage />} />,

  <Route path={PATH.COMPANY_DETAIL} element={<CompanyDetailPage />} />,
  <Route path={PATH.COMPANY_ADD} element={<CompanyAddPage />} />,
  <Route path={PATH.VENDOR} element={<VendorPage />} />,
  <Route
    path={PATH.PURCHASE_MANAGEMENT_PRODUCT}
    element={<PurchaseManagementProductPage />}
  />,
  <Route
    path={PATH.PURCHASE_MANAGEMENT_PRODUCT_ADD}
    element={<PurchaseManagementProductAddPage />}
  />,
  <Route
    path={PATH.PURCHASE_MANAGEMENT_RAW_MATERIAL}
    element={<PurchaseManagementMaterialPage />}
  />,
  <Route
    path={PATH.PURCHASE_MANAGEMENT_RAW_MATERIAL_ADD}
    element={<PurchaseManagementMaterialAddPage />}
  />,
  <Route
    path={PATH.ORDER_MANAGEMENT_QUICK}
    element={<OrderManagememtQuickPage />}
  />,
  <Route
    path={PATH.ORDER_MANAGEMENT_CREATE}
    element={<OrderManagementCreatePage />}
  />,
  <Route
    path={PATH.ORDER_MANAGEMENT_ADDRESS}
    element={<OrderManagementAddressPage />}
  />,
  <Route
    path={PATH.BILL_MANAGEMENT_USER}
    element={<BillManagementUserPage />}
  />,
  <Route
    path={PATH.BILL_MANAGEMENT_USER_DETAIL}
    element={<BillManagementUserDetailPage />}
  />,
  <Route
    path={PATH.BILL_MANAGEMENT_COMPANY}
    element={<BillManagementCompanyPage />}
  />,
  <Route
    path={PATH.BILL_MANAGEMENT_COMPANY_DETAIL}
    element={<BillManagementCompanyDetailPage />}
  />,
  <Route
    path={PATH.BILL_MANAGEMENT_COMPANY_ADD}
    element={<BillManagementCompanyAddPage />}
  />,
  <Route
    path={PATH.DEBT_RECEIVABLE}
    element={<DebtManagementReceivablePage />}
  />,
  <Route
    path={PATH.DEBT_RECEIVABLE_ADD}
    element={<DebtManagementReceivableAddPage />}
  />,
  <Route
    path={PATH.DEBT_RECEIVABLE_DETAIL}
    element={<DebtManagementReceivableDetailPage />}
  />,

  <Route path={PATH.DEBT_PAYABLE} element={<DebtManagementPayablePage />} />,
  <Route
    path={PATH.DEBT_PAYABLE_ADD}
    element={<DebtManagementPayableAddPage />}
  />,
  <Route
    path={PATH.DEBT_PAYABLE_DETAIL}
    element={<DebtManagementPayableDetailPage />}
  />,
  <Route
    path={PATH.PACKAGING_SPECIFICATION}
    element={<PackagingSpecificationPage />}
  />,
  <Route path={PATH.BANK_MANAGEMENT} element={<BankManagementPage />} />,
  <Route path={PATH.MAP_HISTORY} element={<AreaManagementHistoryPage />} />,
  <Route path={PATH.SEASON_HISTORY} element={<AreaManagementHistoryPage />} />,
  <Route path={PATH.PLAN_HISTORY} element={<AreaManagementHistoryPage />} />,
  <Route path={PATH.TASK_HISTORY} element={<AreaManagementHistoryPage />} />,
  <Route path={PATH.PRODUCT_HISTORY} element={<AreaManagementHistoryPage />} />,
  <Route
    path={PATH.FERTILIZER_HISTORY}
    element={<AreaManagementHistoryPage />}
  />,
  <Route
    path={PATH.PESTICIDE_HISTORY}
    element={<AreaManagementHistoryPage />}
  />,
  <Route path={PATH.SUPPLY_HISTORY} element={<AreaManagementHistoryPage />} />,
  <Route path={PATH.COMPANY_HISTORY} element={<AreaManagementHistoryPage />} />,
  <Route path={PATH.HR_HISTORY} element={<AreaManagementHistoryPage />} />,
  <Route
    path={PATH.CONTRACT_HISTORY}
    element={<AreaManagementHistoryPage />}
  />,
  <Route
    path={PATH.PURCHASE_MANAGEMENT_HISTORY}
    element={<AreaManagementHistoryPage />}
  />,
  <Route
    path={PATH.ORDER_MANAGEMENT_HISTORY}
    element={<AreaManagementHistoryPage />}
  />,
  <Route
    path={PATH.FINANCE_PURPOSE_EXPENSE}
    element={<FinancePurposeExpensePage />}
  />,
  <Route
    path={PATH.FINANCE_PURPOSE_EXPENSE_ADD}
    element={<FinancePurposeExpenseAddPage />}
  />,
  <Route
    path={PATH.FINANCE_PURPOSE_RECEIVE}
    element={<FinancePurposeReceivePage />}
  />,
  <Route
    path={PATH.FINANCE_PURPOSE_RECEIVE_ADD}
    element={<FinancePurposeReceiveAddPage />}
  />,
  <Route
    path={PATH.FINANCE_PURPOSE_STATISTIC}
    element={<FinancePurposeStatisticPage />}
  />,
  <Route
    path={PATH.FINANCE_PURPOSE_HISTORY}
    element={<FinancePurposeHistoryPage />}
  />,
  <Route
    path={PATH.FINANCE_PURPOSE_MANAGEMENT}
    element={<FinancePurposeManagementPage />}
  />,
  <Route path={PATH.CONTACT_LIST} element={<ContactPage />} />,
];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider
        theme={theme}
        withCssVariables
        withGlobalClasses
        withStaticClasses
      >
        <ModalsProvider>
          <Routes>
            <Route index path={PATH.AUTH} element={<AuthPage />} />
            <Route path={"/"} element={<App />}>
              <Route path="*" element={<Navigate to={PATH.HOME} replace />} />
              {ROUTES.map((item) => item)}
            </Route>
          </Routes>
        </ModalsProvider>
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>
);
