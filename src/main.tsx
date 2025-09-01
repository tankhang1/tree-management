// index.tsx (hoặc main.tsx)
import { StrictMode, Suspense, lazy, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "@mantine/dates/styles.css"; // if using mantine date picker features
import "mantine-react-table/styles.css"; // import MRT styles
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "dayjs/locale/vi";
import "leaflet/dist/leaflet.css";
import "suneditor/dist/css/suneditor.min.css";

import {
  Image,
  MantineProvider,
  Stack,
  type MantineThemeOverride,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { PATH } from "./constants/path.constants";
import Loading from "./assets/loading.svg";
import FertilizerManagementMainDetailPage from "./pages/FertilizerManagementPage/Main/Detail";
// =============================
// Theme (giữ nguyên như bạn có)
// =============================
const theme: MantineThemeOverride = {
  fontFamily: "MyFont, sans-serif",
  primaryColor: "brand",
  colors: {
    brand: [
      "#E6F4EC",
      "#C1E4D1",
      "#9CD4B7",
      "#76C59C",
      "#51B581",
      "#4CAF50",
      "#3D9E45",
      "#2E873A",
      "#1F7030",
      "#1A5013",
    ],
    accent: [
      "#FFF3E0",
      "#FFE0B2",
      "#FFCC80",
      "#FFB74D",
      "#FFA726",
      "#FB8C00",
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
            backgroundColor: "#E8F5E9",
            color: "#388E3C",
            borderColor: "#388E3C",
          },
        },
      }),
    },
  },
  headings: { fontFamily: "MyFont, sans-serif" },
  defaultRadius: "md",
};

// =============================
// Helpers
// =============================
function PageLoader() {
  return (
    <Stack justify="center" align="center" style={{ height: "100vh" }}>
      <Image src={Loading} w={100} h={100} />
    </Stack>
  );
}

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{node}</Suspense>
);

// Generic lazy helper (để có type tốt với TS)
const L = <T extends ComponentType<unknown>>(
  imp: () => Promise<{ default: T }>
) => lazy(imp);

// =============================
// Lazy imports (toàn bộ pages)
// =============================

// Shell
const App = L(() => import("./App"));

// Top-level
const AuthPage = L(() => import("./pages/AuthPage"));
const HomePage = L(() => import("./pages/HomePage"));
const SchedulePage = L(() => import("./pages/SchedulePage"));
const ScheduleAddPage = L(() => import("./pages/SchedulePage/Add"));
const ContactPage = L(() => import("./pages/ContactPage"));

// Area Management
const AreaManagementPage = L(() => import("./pages/AreaManagementPage"));
const AreaSearchPage = L(() => import("./pages/AreaManagementPage/Search"));
const AreaSearchAreaPage = L(
  () => import("./pages/AreaManagementPage/SearchArea")
);
const AreaManagementRegionPage = L(
  () => import("./pages/AreaManagementPage/Region")
);
const AreaManagementZonePage = L(
  () => import("./pages/AreaManagementPage/Zone")
);
const AreaManagementBlockPage = L(
  () => import("./pages/AreaManagementPage/Block")
);
const AreaManagementRowPage = L(() => import("./pages/AreaManagementPage/Row"));
const AreaManagementTreePage = L(
  () => import("./pages/AreaManagementPage/Tree")
);
const AreaManagementTreev2Page = L(
  () => import("./pages/AreaManagementPage/Tree_v2")
);
const AreaManagementTreeAddv2Page = L(
  () => import("./pages/AreaManagementPage/Tree_v2/Add")
);
const AreaManagementMapPage = L(() => import("./pages/AreaManagementPage/Map"));
const AreaManagementSoilTypePage = L(
  () => import("./pages/AreaManagementPage/SoilType")
);
const AreaManagementTerrainPage = L(
  () => import("./pages/AreaManagementPage/Terrain")
);
const AreaManagementCultivationMethodPage = L(
  () => import("./pages/AreaManagementPage/CultivationMethod")
);
const AreaManagementHistoryPage = L(
  () => import("./pages/AreaManagementPage/History")
);
const AreaManagementAddRegionPage = L(
  () => import("./pages/AreaManagementPage/Region/Add")
);
const AreaManagementRegionDetailPage = L(
  () => import("./pages/AreaManagementPage/Region/Detail")
);
const AreaManagementAddZonePage = L(
  () => import("./pages/AreaManagementPage/Zone/Add")
);
const AreaManagementZoneDetailPage = L(
  () => import("./pages/AreaManagementPage/Zone/Detail")
);
const AreaManagementBlockDetailPage = L(
  () => import("./pages/AreaManagementPage/Block/Detail")
);
const AreaManagementBlockAddPage = L(
  () => import("./pages/AreaManagementPage/Block/Add")
);
const AreaManagementRowDetailPage = L(
  () => import("./pages/AreaManagementPage/Row/Detail")
);
const AreaManagementRowAddPage = L(
  () => import("./pages/AreaManagementPage/Row/Add")
);
const AreaManagementTreeAddPage = L(
  () => import("./pages/AreaManagementPage/Tree/Add")
);
const AreaManagementCultivationMethodAddPage = L(
  () => import("./pages/AreaManagementPage/CultivationMethod/Add")
);

// Plant Management
const PlantManagementPage = L(() => import("./pages/PlantManagementPage"));
const PlantManagementTreePage = L(
  () => import("./pages/PlantManagementPage/Tree")
);
const PlantManagementGroupPage = L(
  () => import("./pages/PlantManagementPage/Group")
);
const PlantManagementVarietyPage = L(
  () => import("./pages/PlantManagementPage/Variety")
);
const PlantManagementSeedPage = L(
  () => import("./pages/PlantManagementPage/Seed")
);
const PlantManagementTechnicalDocPage = L(
  () => import("./pages/PlantManagementPage/TechnicalDoc")
);
const PlantManagementTreeAddPage = L(
  () => import("./pages/PlantManagementPage/Tree/Add")
);
const PlantManagementTreeDetailPage = L(
  () => import("./pages/PlantManagementPage/Tree/Detail")
);
const PlantManagementCatalogPage = L(
  () => import("./pages/PlantManagementPage/Catalog")
);
const PlantManagementSeedAddPage = L(
  () => import("./pages/PlantManagementPage/Seed/Add")
);
const PlantManagementTechnicalDocDetailPage = L(
  () => import("./pages/PlantManagementPage/TechnicalDoc/Detail")
);
const PlantManagementTechnicalDocAddPage = L(
  () => import("./pages/PlantManagementPage/TechnicalDoc/Add")
);

// Season Management
const SeasonManagementPage = L(() => import("./pages/SeasonManagementPage"));
const SeasonManagementGrowthPage = L(
  () => import("./pages/SeasonManagementPage/Growth")
);
const SeasonManagementCyclePage = L(
  () => import("./pages/SeasonManagementPage/Cycle")
);
const SeasonManagementGrowthDetailPage = L(
  () => import("./pages/SeasonManagementPage/Growth/Detail")
);
const SeasonManagementGrowthAddPage = L(
  () => import("./pages/SeasonManagementPage/Growth/Add")
);
const SeasonManagementCycleDetailPage = L(
  () => import("./pages/SeasonManagementPage/Cycle/Detail")
);
const SeasonManagementCycleAddPage = L(
  () => import("./pages/SeasonManagementPage/Cycle/Add")
);

// Plan Management
const PlanManagementPage = L(() => import("./pages/PlanManagementPage"));
const PlanManagementMainPage = L(
  () => import("./pages/PlanManagementPage/Main")
);
const PlanManagementAssignPage = L(
  () => import("./pages/PlanManagementPage/Assign")
);
const PlanManagementUnplannedPage = L(
  () => import("./pages/PlanManagementPage/Unplanned")
);
const PlanManagementHistoryPage = L(
  () => import("./pages/PlanManagementPage/History")
);
const PlanManagementMainDetailPage = L(
  () => import("./pages/PlanManagementPage/Main/Detail")
);
const PlanManagementMainAddPage = L(
  () => import("./pages/PlanManagementPage/Main/Add")
);
const PlanManagementAssignDetailPage = L(
  () => import("./pages/PlanManagementPage/Assign/Detail")
);
const PlanManagementAssignAddPage = L(
  () => import("./pages/PlanManagementPage/Assign/Add")
);
const PlanManagementUnplannedDetailPage = L(
  () => import("./pages/PlanManagementPage/Unplanned/Detail")
);
const PlanManagementUnplannedAddPage = L(
  () => import("./pages/PlanManagementPage/Unplanned/Add")
);

// Task Management
const TaskManagementPage = L(() => import("./pages/TaskManagementPage"));
const TaskManagementMainPage = L(
  () => import("./pages/TaskManagementPage/Main")
);
const TaskManagementBatmanPage = L(
  () => import("./pages/TaskManagementPage/Batman")
);
const TaskManagementMainDetailPage = L(
  () => import("./pages/TaskManagementPage/Main/Detail")
);

// Harvest Management
const HarvestManagementPage = L(() => import("./pages/HarvestManagementPage"));
const HarvestManagementReportPage = L(
  () => import("./pages/HarvestManagementPage/Report")
);
const HarvestManagementQueryMapPage = L(
  () => import("./pages/HarvestManagementPage/QueryMap")
);
// Production forecast
const ProductionForecastPage = L(
  () => import("./pages/ProductionForecastPage")
);
// Product Management
const ProductManagementPage = L(() => import("./pages/ProductManagementPage"));
const ProductManagementItemPage = L(
  () => import("./pages/ProductManagementPage/Item")
);
const ProductManagementBOMPage = L(
  () => import("./pages/ProductManagementPage/BOM")
);
const ProductManagementRawMaterialPage = L(
  () => import("./pages/ProductManagementPage/RawMaterial")
);
const ProductManagementItemAddPage = L(
  () => import("./pages/ProductManagementPage/Item/Add")
);
const ProductManagementItemDetailPage = L(
  () => import("./pages/ProductManagementPage/Item/Detail")
);
const ProductManagementRawMaterialTypePage = L(
  () => import("./pages/ProductManagementPage/RawMaterial/Type")
);
const ProductManagementRawMaterialAddPage = L(
  () => import("./pages/ProductManagementPage/RawMaterial/Add")
);
const ProductManagementRawMaterialDetailPage = L(
  () => import("./pages/ProductManagementPage/RawMaterial/Detail")
);
const ProductManagementTypePage = L(
  () => import("./pages/ProductManagementPage/Type")
);

// Contract Management
const ContractManagementPage = L(
  () => import("./pages/ContractManagementPage")
);
const ContractManagementDetailPage = L(
  () => import("./pages/ContractManagementPage/Detail")
);
const ContractManagementAddPage = L(
  () => import("./pages/ContractManagementPage/Add")
);

// HR Management
const HRManagementPage = L(() => import("./pages/HRManagementPage"));
const HRManagementDepartmentPage = L(
  () => import("./pages/HRManagementPage/Department")
);
const HRManagementPositionPage = L(
  () => import("./pages/HRManagementPage/Position")
);
const HRManagementTeamPage = L(() => import("./pages/HRManagementPage/Team"));
const HRManagementEmployeePage = L(
  () => import("./pages/HRManagementPage/Employee")
);
const HRManagementTeamDetailPage = L(
  () => import("./pages/HRManagementPage/Team/Detail")
);
const HRManagementTeamAddPage = L(
  () => import("./pages/HRManagementPage/Team/Add")
);
const HRManagementEmployeeAddPage = L(
  () => import("./pages/HRManagementPage/Employee/Add")
);
const HRManagementEmployeeDetailPage = L(
  () => import("./pages/HRManagementPage/Employee/Detail")
);

// Factory Management
const FactoryManagementPage = L(() => import("./pages/FactoryManagementPage"));
const FactoryManagementMainPage = L(
  () => import("./pages/FactoryManagementPage/Main")
);
const FactoryManagementHistoryPage = L(
  () => import("./pages/FactoryManagementPage/History")
);
const FactoryManagementMainAddPage = L(
  () => import("./pages/FactoryManagementPage/Main/Add")
);
const FactoryManagementMainDetailPage = L(
  () => import("./pages/FactoryManagementPage/Main/Detail")
);

// Machine Management
const MachineManagementPage = L(() => import("./pages/MachineManagementPage"));
const MachineManagementMainPage = L(
  () => import("./pages/MachineManagementPage/Main")
);
const MachineManagementUsageHistoryPage = L(
  () => import("./pages/MachineManagementPage/UsageHistory")
);
const MachineManagementMaintenanceHistoryPage = L(
  () => import("./pages/MachineManagementPage/MaintenanceHistory")
);
const MachineManagementDisposalHistoryPage = L(
  () => import("./pages/MachineManagementPage/Disposal")
);
const MachineManagementMainDetailPage = L(
  () => import("./pages/MachineManagementPage/Main/Detail")
);
const MachineManagementMainAddPage = L(
  () => import("./pages/MachineManagementPage/Main/Add")
);
const MachineManagementCategoryPage = L(
  () => import("./pages/MachineManagementPage/Type")
);

// Pesticide Management
const PesticideManagementPage = L(
  () => import("./pages/PesticideManagementPage")
);
const PesticideManagementMainPage = L(
  () => import("./pages/PesticideManagementPage/Main")
);
const PesticideManagementCategoryPage = L(
  () => import("./pages/PesticideManagementPage/Category")
);
const PesticideManagementMainDetailPage = L(
  () => import("./pages/PesticideManagementPage/Main/Detail")
);
const PesticideManagementMainAddPage = L(
  () => import("./pages/PesticideManagementPage/Main/Add")
);
const PesticideManagementDisposalPage = L(
  () => import("./pages/PesticideManagementPage/Disposal")
);
const PesticideUsageHistoryPage = L(
  () => import("./pages/PesticideManagementPage/MaintenanceHistory")
);

// Supply / Stock / Fertilizer
const SupplyManagementPage = L(() => import("./pages/SupplyManagementPage"));
const StockManagementPage = L(() => import("./pages/StockManagementPage"));
const StockManagementSupplyPage = L(
  () => import("./pages/StockManagementPage/Supply")
);
const StockManagementSupplyDetailPage = L(
  () => import("./pages/StockManagementPage/Supply/Detail")
);
const StockManagementPesticidePage = L(
  () => import("./pages/StockManagementPage/Pesticide")
);
const StockManagementMachinePage = L(
  () => import("./pages/StockManagementPage/Machine")
);
const StockManagementSeedPage = L(
  () => import("./pages/StockManagementPage/Seed")
);
const FarmingFormEmployeeEvaluationPage = L(
  () => import("./pages/FarmingFormPage/Employee-Evaluation")
);
const FarmingFormHistoryPage = L(
  () => import("./pages/FarmingFormPage/History")
);
const FarmingFormBatmanPage = L(() => import("./pages/FarmingFormPage/Batman"));
const FarmingFormUnPlannedPage = L(
  () => import("./pages/FarmingFormPage/UnPlanned")
);
const StockManagementAreaPage = L(
  () => import("./pages/StockManagementPage/Area")
);
const StockManagementAddAreaPage = L(
  () => import("./pages/StockManagementPage/Area/Add")
);
const StockManagementAreaDetailPage = L(
  () => import("./pages/StockManagementPage/Area/Detail")
);
const StockManagementFertilizerPage = L(
  () => import("./pages/StockManagementPage/Fertilizer")
);
const FertilizerManagementTypePage = L(
  () => import("./pages/FertilizerManagementPage/Type")
);
const FertilizerManagementMainPage = L(
  () => import("./pages/FertilizerManagementPage/Main")
);
const StockManagementDeliveryPage = L(
  () => import("./pages/StockManagementPage/Delivery")
);
const StockManagementAddDeliveryPage = L(
  () => import("./pages/StockManagementPage/Delivery/Add")
);
const StockManagementDeliveryDetailPage = L(
  () => import("./pages/StockManagementPage/Delivery/Detail")
);
const FertilizerManagementMainAddPage = L(
  () => import("./pages/FertilizerManagementPage/Main/Add")
);
const StockManagementIOPage = L(
  () => import("./pages/StockManagementPage/Supply/Add")
);
const SupplyManagementCategoryPage = L(
  () => import("./pages/SupplyManagementPage/Type")
);
const SupplyManagementUsageHistoryPage = L(
  () => import("./pages/SupplyManagementPage/UsageHistory")
);
const FertilizerManagementUsageHistoryPage = L(
  () => import("./pages/FertilizerManagementPage/UsageHistory")
);
const SupplyManagementDisposalPage = L(
  () => import("./pages/SupplyManagementPage/Disposal")
);
const FertilizerManagementDisposalPage = L(
  () => import("./pages/FertilizerManagementPage/Disposal")
);

// Garden Management
const GardenManagementPage = L(() => import("./pages/GardenManagementPage"));
const GardenManagementTypePage = L(
  () => import("./pages/GardenManagementPage/Type")
);
const GardenManagementTypeDetailPage = L(
  () => import("./pages/GardenManagementPage/Type/Detail")
);
const GardenManagementAreaPage = L(
  () => import("./pages/GardenManagementPage/Area")
);
const GardenManagementAreaDetailPage = L(
  () => import("./pages/GardenManagementPage/Area/Detail")
);
const GardenManagementMapPage = L(
  () => import("./pages/GardenManagementPage/Map")
);

// Farming Management
const FarmingManagementPage = L(() => import("./pages/FarmingManagementPage"));
const FarmingManagementPlanPage = L(
  () => import("./pages/FarmingManagementPage/Plan")
);
const FarmingManagementTaskByPlanPage = L(
  () => import("./pages/FarmingManagementPage/TaskByPlan")
);
const FarmingManagementUnPlannedTaskPage = L(
  () => import("./pages/FarmingManagementPage/UnPlannedTask")
);
const FarmingManagementBatmanPlanPage = L(
  () => import("./pages/FarmingManagementPage/BatmanPlan")
);
const FarmingManagementYieldForecastPage = L(
  () => import("./pages/FarmingManagementPage/YieldForecast")
);

// Farming Form by Plan
const FarmingFormPlanPage = L(() => import("./pages/FarmingFormPage/Plan"));

// Map Management
const MapManagementAreaPage = L(() => import("./pages/MapManagementPage/Area"));
const MapManagementPlotPage = L(() => import("./pages/MapManagementPage/Plot"));
const MapManagementMapPage = L(() => import("./pages/MapManagementPage/Map"));
const MapManagementTerrainPage = L(
  () => import("./pages/MapManagementPage/Terrain")
);
const MapManagementRegionPage = L(
  () => import("./pages/MapManagementPage/Region")
);
const MapManagementAddRegionPage = L(
  () => import("./pages/MapManagementPage/Region/Add")
);
const MapManagementRegionDetailPage = L(
  () => import("./pages/MapManagementPage/Region/Detail")
);
const MapManagementAddAreaPage = L(
  () => import("./pages/MapManagementPage/Area/Add")
);
const MapManagementAreaDetailPage = L(
  () => import("./pages/MapManagementPage/Area/Detail")
);
const MapManagementPlotAddPage = L(
  () => import("./pages/MapManagementPage/Plot/Add")
);
const MapManagementDetailPlotPage = L(
  () => import("./pages/MapManagementPage/Plot/Detail")
);

// Purchase / Sell / Finance
const PurchasePage = L(() => import("./pages/PurchasePage"));
const SellPage = L(() => import("./pages/SellPage"));
const FinanceAccountPage = L(() => import("./pages/FinanceAccountPage"));
const FinancePurposeExpensePage = L(
  () => import("./pages/FinancePage/PurposeExpense")
);
const FinancePurposeExpenseAddPage = L(
  () => import("./pages/FinancePage/PurposeExpense/Add")
);
const FinancePurposeReceivePage = L(
  () => import("./pages/FinancePage/PurposeReceive")
);
const FinancePurposeReceiveAddPage = L(
  () => import("./pages/FinancePage/PurposeReceive/Add")
);
const FinancePurposeHistoryPage = L(
  () => import("./pages/FinancePage/History")
);
const FinancePurposeStatisticPage = L(
  () => import("./pages/FinancePage/Statistics")
);
const FinancePurposeManagementPage = L(
  () => import("./pages/FinancePage/Purpose")
);

// Company / Vendor / Order / Bill / Debt / Packaging
const CompanyPage = L(() => import("./pages/CompanyPage"));
const VendorPage = L(() => import("./pages/VendorPage"));
const CompanyDetailPage = L(() => import("./pages/CompanyPage/Detail"));
const CompanyAddPage = L(() => import("./pages/CompanyPage/Add"));
const HRManagementEmployeeAddPage2 = HRManagementEmployeeAddPage; // alias tránh nhầm tên
const HRManagementEmployeeDetailPage2 = HRManagementEmployeeDetailPage; // alias
const SupplyManagementAddPage = L(
  () => import("./pages/SupplyManagementPage/Add")
);
const PurchaseManagementProductPage = L(
  () => import("./pages/PurchaseManagementPage/Product")
);
const PurchaseManagementMaterialPage = L(
  () => import("./pages/PurchaseManagementPage/Material")
);
const PurchaseManagementProductAddPage = L(
  () => import("./pages/PurchaseManagementPage/Product/Add")
);
const PurchaseManagementMaterialAddPage = L(
  () => import("./pages/PurchaseManagementPage/Material/Add")
);
const OrderManagememtQuickPage = L(
  () => import("./pages/OrderManagementPage/Quick")
);
const OrderManagementAddressPage = L(
  () => import("./pages/OrderManagementPage/Address")
);
const BillManagementUserPage = L(
  () => import("./pages/BillManagementPage/User")
);
const BillManagementUserDetailPage = L(
  () => import("./pages/BillManagementPage/User/Detail")
);
const BillManagementCompanyPage = L(
  () => import("./pages/BillManagementPage/Company")
);
const BillManagementCompanyDetailPage = L(
  () => import("./pages/BillManagementPage/Company/Detail")
);
const DebtManagementReceivablePage = L(
  () => import("./pages/DebtManagementPage/Receivable")
);
const DebtManagementReceivableAddPage = L(
  () => import("./pages/DebtManagementPage/Receivable/Add")
);
const DebtManagementReceivableDetailPage = L(
  () => import("./pages/DebtManagementPage/Receivable/Detail")
);
const DebtManagementPayablePage = L(
  () => import("./pages/DebtManagementPage/Payable")
);
const DebtManagementPayableAddPage = L(
  () => import("./pages/DebtManagementPage/Payable/Add")
);
const DebtManagementPayableDetailPage = L(
  () => import("./pages/DebtManagementPage/Payable/Detail")
);
const PackagingSpecificationPage = L(
  () => import("./pages/PackagingSpecificationPage")
);
const BillManagementCompanyAddPage = L(
  () => import("./pages/BillManagementPage/Company/Add")
);
const OrderManagementCreatePage = L(
  () => import("./pages/OrderManagementPage/Create")
);
const CompanyAddressPage = L(() => import("./pages/CompanyPage/Address"));
const CompanyAddressAddPage = L(
  () => import("./pages/CompanyPage/Address/Add")
);
const BankManagementPage = L(() => import("./pages/BankManagementPage"));

const CertificatePage = L(() => import("./pages/CertificatePage"));
const CertificateAddPage = L(() => import("./pages/CertificatePage/Add"));

const CompanyAddPage2 = CompanyAddPage; // alias giữ tên cũ
const BusinessReportPage = L(() => import("./pages/BusinessReportPage"));
const PurchaseReportPage = L(() => import("./pages/PurchaseReportPage"));
const CashFlowReportPage = L(() => import("./pages/CashFlowReportPage"));
const ProductionReportPage = L(() => import("./pages/ProductionReportPage"));
// Map/Season/Plan History aliases (trong code gốc đều dùng AreaManagementHistoryPage)
const MapHistoryPage = AreaManagementHistoryPage;
const SeasonHistoryPage = AreaManagementHistoryPage;
const PlanHistoryPageAlias = AreaManagementHistoryPage;
const TaskHistoryPage = AreaManagementHistoryPage;
const ProductHistoryPage = AreaManagementHistoryPage;
const FertilizerHistoryAlias = AreaManagementHistoryPage;
const PesticideHistoryAlias = AreaManagementHistoryPage;
const SupplyHistoryPage = AreaManagementHistoryPage;
const CompanyHistoryPage = AreaManagementHistoryPage;
const HRHistoryPage = AreaManagementHistoryPage;
const ContractHistoryPage = AreaManagementHistoryPage;
const PurchaseManagementHistoryPage = AreaManagementHistoryPage;
const OrderManagementHistoryPage = AreaManagementHistoryPage;

// Finance Purpose (đã import ở trên)

// =============================
// ROUTES
// =============================
const ROUTES = [
  <Route key="auth" path={PATH.AUTH} element={withSuspense(<AuthPage />)} />,

  <Route key="home" path={PATH.HOME} element={withSuspense(<HomePage />)} />,

  <Route
    key="schedule"
    path={PATH.SCHEDULE}
    element={withSuspense(<SchedulePage />)}
  />,
  <Route
    key="schedule_add"
    path={PATH.SCHEDULE_ADD}
    element={withSuspense(<ScheduleAddPage />)}
  />,

  <Route
    key="garden_mgmt"
    path={PATH.GARDEN_MANAGEMENT}
    element={withSuspense(<GardenManagementPage />)}
  />,
  <Route
    key="garden_type"
    path={PATH.GARDEN_MANAGEMENT_TYPE}
    element={withSuspense(<GardenManagementTypePage />)}
  />,
  <Route
    key="garden_type_detail"
    path={PATH.GARDEN_MANAGEMENT_TYPE_DETAIL}
    element={withSuspense(<GardenManagementTypeDetailPage />)}
  />,
  <Route
    key="garden_area"
    path={PATH.GARDEN_MANAGEMENT_AREA}
    element={withSuspense(<GardenManagementAreaPage />)}
  />,
  <Route
    key="garden_area_detail"
    path={PATH.GARDEN_MANAGEMENT_AREA_DETAIL}
    element={withSuspense(<GardenManagementAreaDetailPage />)}
  />,
  <Route
    key="garden_map"
    path={PATH.GARDEN_MANAGEMENT_MAP}
    element={withSuspense(<GardenManagementMapPage />)}
  />,

  <Route
    key="farming_mgmt"
    path={PATH.FARMING_MANAGEMENT}
    element={withSuspense(<FarmingManagementPage />)}
  />,
  <Route
    key="farming_plan"
    path={PATH.FARMING_PLAN}
    element={withSuspense(<FarmingManagementPlanPage />)}
  />,
  <Route
    key="farming_task_by_plan"
    path={PATH.FARMING_TASK_BY_PLAN}
    element={withSuspense(<FarmingManagementTaskByPlanPage />)}
  />,
  <Route
    key="farming_unplanned_task"
    path={PATH.FARMING_UNPLANNED_TASK}
    element={withSuspense(<FarmingManagementUnPlannedTaskPage />)}
  />,
  <Route
    key="farming_batman_plan"
    path={PATH.FARMING_BATMAN_PLAN}
    element={withSuspense(<FarmingManagementBatmanPlanPage />)}
  />,
  <Route
    key="farming_yield"
    path={PATH.FARMING_YIELD_FORECAST}
    element={withSuspense(<FarmingManagementYieldForecastPage />)}
  />,

  <Route
    key="farming_form_by_plan"
    path={PATH.FARMING_FORM_BY_PLAN}
    element={withSuspense(<FarmingFormPlanPage />)}
  />,
  <Route
    key="farming_form_unplanned"
    path={PATH.FARMING_FORM_UNPLANNED}
    element={withSuspense(<FarmingFormUnPlannedPage />)}
  />,
  <Route
    key="farming_form_batman"
    path={PATH.FARMING_FORM_BATMAN}
    element={withSuspense(<FarmingFormBatmanPage />)}
  />,
  <Route
    key="farming_form_history"
    path={PATH.FARMING_FORM_HISTORY}
    element={withSuspense(<FarmingFormHistoryPage />)}
  />,
  <Route
    key="farming_form_employee_evaluation"
    path={PATH.FARMING_FORM_EMPLOYEE_EVALUATION}
    element={withSuspense(<FarmingFormEmployeeEvaluationPage />)}
  />,

  <Route
    key="area_mgmt"
    path={PATH.AREA_MANAGEMENT}
    element={withSuspense(<AreaManagementPage />)}
  />,
  <Route
    key="area_region"
    path={PATH.AREA_REGION}
    element={withSuspense(<AreaManagementRegionPage />)}
  />,
  <Route
    key="area_add_region"
    path={PATH.AREA_ADD_REGION}
    element={withSuspense(<AreaManagementAddRegionPage />)}
  />,
  <Route
    key="area_region_detail"
    path={PATH.AREA_REGION_DETAIL}
    element={withSuspense(<AreaManagementRegionDetailPage />)}
  />,
  <Route
    key="area_zone"
    path={PATH.AREA_ZONE}
    element={withSuspense(<AreaManagementZonePage />)}
  />,
  <Route
    key="area_add_zone"
    path={PATH.AREA_ADD_ZONE}
    element={withSuspense(<AreaManagementAddZonePage />)}
  />,
  <Route
    key="area_zone_detail"
    path={PATH.AREA_ZONE_DETAIL}
    element={withSuspense(<AreaManagementZoneDetailPage />)}
  />,
  <Route
    key="area_block"
    path={PATH.AREA_BLOCK}
    element={withSuspense(<AreaManagementBlockPage />)}
  />,
  <Route
    key="area_add_block"
    path={PATH.AREA_ADD_BLOCK}
    element={withSuspense(<AreaManagementBlockAddPage />)}
  />,
  <Route
    key="area_block_detail"
    path={PATH.AREA_BLOCK_DETAIL}
    element={withSuspense(<AreaManagementBlockDetailPage />)}
  />,
  <Route
    key="area_row"
    path={PATH.AREA_ROW}
    element={withSuspense(<AreaManagementRowPage />)}
  />,
  <Route
    key="area_row_detail"
    path={PATH.AREA_ROW_DETAIL}
    element={withSuspense(<AreaManagementRowDetailPage />)}
  />,
  <Route
    key="area_add_row"
    path={PATH.AREA_ADD_ROW}
    element={withSuspense(<AreaManagementRowAddPage />)}
  />,
  <Route
    key="area_search"
    path={PATH.AREA_SEARCH_TREE}
    element={withSuspense(<AreaSearchPage />)}
  />,
  <Route
    key="area_search_area"
    path={PATH.AREA_SEARCH}
    element={withSuspense(<AreaSearchAreaPage />)}
  />,
  <Route
    key="area_tree"
    path={PATH.AREA_TREE}
    element={withSuspense(<AreaManagementTreePage />)}
  />,
  <Route
    key="area_add_tree"
    path={PATH.AREA_ADD_TREE}
    element={withSuspense(<AreaManagementTreeAddPage />)}
  />,
  <Route
    key="area_tree_v2"
    path={PATH.AREA_TREE_v2}
    element={withSuspense(<AreaManagementTreev2Page />)}
  />,
  <Route
    key="area_add_tree_v2"
    path={PATH.AREA_ADD_TREE_v2}
    element={withSuspense(<AreaManagementTreeAddv2Page />)}
  />,
  <Route
    key="area_map"
    path={PATH.AREA_MAP}
    element={withSuspense(<AreaManagementMapPage />)}
  />,
  <Route
    key="area_soil"
    path={PATH.AREA_SOIL}
    element={withSuspense(<AreaManagementSoilTypePage />)}
  />,
  <Route
    key="area_terrain"
    path={PATH.AREA_TERRAIN}
    element={withSuspense(<AreaManagementTerrainPage />)}
  />,
  <Route
    key="area_cultivation_method"
    path={PATH.AREA_CULTIVATION_METHOD}
    element={withSuspense(<AreaManagementCultivationMethodPage />)}
  />,
  <Route
    key="area_add_cultivation_method"
    path={PATH.AREA_ADD_CULTIVATION_METHOD}
    element={withSuspense(<AreaManagementCultivationMethodAddPage />)}
  />,
  <Route
    key="area_history"
    path={PATH.AREA_HISTORY}
    element={withSuspense(<AreaManagementHistoryPage />)}
  />,

  // Map Management
  <Route
    key="map_area"
    path={PATH.MAP_AREA}
    element={withSuspense(<MapManagementAreaPage />)}
  />,
  <Route
    key="map_add_area"
    path={PATH.MAP_ADD_AREA}
    element={withSuspense(<MapManagementAddAreaPage />)}
  />,
  <Route
    key="map_area_detail"
    path={PATH.MAP_AREA_DETAIL}
    element={withSuspense(<MapManagementAreaDetailPage />)}
  />,
  <Route
    key="map_plot"
    path={PATH.MAP_PLOT}
    element={withSuspense(<MapManagementPlotPage />)}
  />,
  <Route
    key="map_add_plot"
    path={PATH.MAP_ADD_PLOT}
    element={withSuspense(<MapManagementPlotAddPage />)}
  />,
  <Route
    key="map_plot_detail"
    path={PATH.MAP_PLOT_DETAIL}
    element={withSuspense(<MapManagementDetailPlotPage />)}
  />,
  <Route
    key="map_map"
    path={PATH.MAP_MAP}
    element={withSuspense(<MapManagementMapPage />)}
  />,
  <Route
    key="map_terrain"
    path={PATH.MAP_TERRAIN}
    element={withSuspense(<MapManagementTerrainPage />)}
  />,
  <Route
    key="map_region"
    path={PATH.MAP_REGION}
    element={withSuspense(<MapManagementRegionPage />)}
  />,
  <Route
    key="map_add_region"
    path={PATH.MAP_ADD_REGION}
    element={withSuspense(<MapManagementAddRegionPage />)}
  />,
  <Route
    key="map_region_detail"
    path={PATH.MAP_REGION_DETAIL}
    element={withSuspense(<MapManagementRegionDetailPage />)}
  />,

  // Plant Management
  <Route
    key="plant_mgmt"
    path={PATH.PLANT_MANAGEMENT}
    element={withSuspense(<PlantManagementPage />)}
  />,
  <Route
    key="plant_tree"
    path={PATH.PLANT_TREE}
    element={withSuspense(<PlantManagementTreePage />)}
  />,
  <Route
    key="plant_add_tree"
    path={PATH.PLANT_ADD_TREE}
    element={withSuspense(<PlantManagementTreeAddPage />)}
  />,
  <Route
    key="plant_tree_detail"
    path={PATH.PLANT_TREE_DETAIL}
    element={withSuspense(<PlantManagementTreeDetailPage />)}
  />,
  <Route
    key="plant_group"
    path={PATH.PLANT_GROUP}
    element={withSuspense(<PlantManagementGroupPage />)}
  />,
  <Route
    key="plant_variety"
    path={PATH.PLANT_VARIETY}
    element={withSuspense(<PlantManagementVarietyPage />)}
  />,
  <Route
    key="plant_seed"
    path={PATH.PLANT_SEED}
    element={withSuspense(<PlantManagementSeedPage />)}
  />,
  <Route
    key="plant_add_seed"
    path={PATH.PLANT_ADD_SEED}
    element={withSuspense(<PlantManagementSeedAddPage />)}
  />,
  <Route
    key="plant_catalog"
    path={PATH.PLANT_CATALOG}
    element={withSuspense(<PlantManagementCatalogPage />)}
  />,
  <Route
    key="plant_tech_doc"
    path={PATH.PLANT_TECHNICAL_DOC}
    element={withSuspense(<PlantManagementTechnicalDocPage />)}
  />,
  <Route
    key="plant_tech_doc_detail"
    path={PATH.PLANT_TECHNICAL_DOC_DETAIL}
    element={withSuspense(<PlantManagementTechnicalDocDetailPage />)}
  />,
  <Route
    key="plant_add_tech_doc"
    path={PATH.PLANT_ADD_TECHNICAL_DOC}
    element={withSuspense(<PlantManagementTechnicalDocAddPage />)}
  />,

  // Season Management
  <Route
    key="season_mgmt"
    path={PATH.SEASON_MANAGEMENT}
    element={withSuspense(<SeasonManagementPage />)}
  />,
  <Route
    key="season_growth"
    path={PATH.SEASON_GROWTH}
    element={withSuspense(<SeasonManagementGrowthPage />)}
  />,
  <Route
    key="season_growth_detail"
    path={PATH.SEASON_GROWTH_DETAIL}
    element={withSuspense(<SeasonManagementGrowthDetailPage />)}
  />,
  <Route
    key="season_add_growth"
    path={PATH.SEASON_ADD_GROWTH}
    element={withSuspense(<SeasonManagementGrowthAddPage />)}
  />,
  <Route
    key="season_cycle"
    path={PATH.SEASON_CYCLE}
    element={withSuspense(<SeasonManagementCyclePage />)}
  />,
  <Route
    key="season_cycle_detail"
    path={PATH.SEASON_CYCLE_DETAIL}
    element={withSuspense(<SeasonManagementCycleDetailPage />)}
  />,
  <Route
    key="season_add_cycle"
    path={PATH.SEASON_ADD_CYCLE}
    element={withSuspense(<SeasonManagementCycleAddPage />)}
  />,

  // Plan Management
  <Route
    key="plan_mgmt"
    path={PATH.PLAN_MANAGEMENT}
    element={withSuspense(<PlanManagementPage />)}
  />,
  <Route
    key="plan_main"
    path={PATH.PLAN_MAIN}
    element={withSuspense(<PlanManagementMainPage />)}
  />,
  <Route
    key="plan_main_detail"
    path={PATH.PLAN_MAIN_DETAIL}
    element={withSuspense(<PlanManagementMainDetailPage />)}
  />,
  <Route
    key="plan_add_main"
    path={PATH.PLAN_ADD_MAIN}
    element={withSuspense(<PlanManagementMainAddPage />)}
  />,
  <Route
    key="plan_assign"
    path={PATH.PLAN_ASSIGN}
    element={withSuspense(<PlanManagementAssignPage />)}
  />,
  <Route
    key="plan_assign_detail"
    path={PATH.PLAN_ASSIGN_DETAIL}
    element={withSuspense(<PlanManagementAssignDetailPage />)}
  />,
  <Route
    key="plan_add_assign"
    path={PATH.PLAN_ADD_ASSIGN}
    element={withSuspense(<PlanManagementAssignAddPage />)}
  />,
  <Route
    key="plan_unplanned"
    path={PATH.PLAN_UNPLANNED}
    element={withSuspense(<PlanManagementUnplannedPage />)}
  />,
  <Route
    key="plan_unplanned_detail"
    path={PATH.PLAN_UNPLANNED_DETAIL}
    element={withSuspense(<PlanManagementUnplannedDetailPage />)}
  />,
  <Route
    key="plan_add_unplanned"
    path={PATH.PLAN_ADD_UNPLANNED}
    element={withSuspense(<PlanManagementUnplannedAddPage />)}
  />,
  <Route
    key="plan_history"
    path={PATH.PLAN_HISTORY}
    element={withSuspense(<PlanManagementHistoryPage />)}
  />,

  // Task
  <Route
    key="task_mgmt"
    path={PATH.TASK_MANAGEMENT}
    element={withSuspense(<TaskManagementPage />)}
  />,
  <Route
    key="task_main"
    path={PATH.TASK_MAIN}
    element={withSuspense(<TaskManagementMainPage />)}
  />,
  <Route
    key="task_main_detail"
    path={PATH.TASK_MAIN_DETAIL}
    element={withSuspense(<TaskManagementMainDetailPage />)}
  />,
  <Route
    key="task_batman"
    path={PATH.TASK_BATMAN}
    element={withSuspense(<TaskManagementBatmanPage />)}
  />,

  // Harvest
  <Route
    key="harvest_mgmt"
    path={PATH.HARVEST_MANAGEMENT}
    element={withSuspense(<HarvestManagementPage />)}
  />,
  <Route
    key="harvest_report"
    path={PATH.HARVEST_REPORT}
    element={withSuspense(<HarvestManagementReportPage />)}
  />,
  <Route
    key="harvest_query"
    path={PATH.HARVEST_QUERY}
    element={withSuspense(<HarvestManagementQueryMapPage />)}
  />,
  // Production forecast
  <Route
    key="production_forecast"
    path={PATH.PRODUCTION_FORECAST}
    element={withSuspense(<ProductionForecastPage />)}
  />,
  // Product
  <Route
    key="product_mgmt"
    path={PATH.PRODUCT_MANAGEMENT}
    element={withSuspense(<ProductManagementPage />)}
  />,
  <Route
    key="product_item"
    path={PATH.PRODUCT_ITEM}
    element={withSuspense(<ProductManagementItemPage />)}
  />,
  <Route
    key="product_add_item"
    path={PATH.PRODUCT_ADD_ITEM}
    element={withSuspense(<ProductManagementItemAddPage />)}
  />,
  <Route
    key="product_item_detail"
    path={PATH.PRODUCT_ITEM_DETAIL}
    element={withSuspense(<ProductManagementItemDetailPage />)}
  />,
  <Route
    key="product_bom"
    path={PATH.PRODUCT_BOM}
    element={withSuspense(<ProductManagementBOMPage />)}
  />,
  <Route
    key="product_raw"
    path={PATH.PRODUCT_RAW_MATERIAL}
    element={withSuspense(<ProductManagementRawMaterialPage />)}
  />,
  <Route
    key="product_raw_detail"
    path={PATH.PRODUCT_RAW_MATERIAL_DETAIL}
    element={withSuspense(<ProductManagementRawMaterialDetailPage />)}
  />,
  <Route
    key="product_raw_add"
    path={PATH.PRODUCT_RAW_MATERIAL_ADD}
    element={withSuspense(<ProductManagementRawMaterialAddPage />)}
  />,
  <Route
    key="product_raw_type"
    path={PATH.PRODUCT_RAW_MATERIAL_TYPE}
    element={withSuspense(<ProductManagementRawMaterialTypePage />)}
  />,
  <Route
    key="product_type"
    path={PATH.PRODUCT_TYPE}
    element={withSuspense(<ProductManagementTypePage />)}
  />,

  // Contract
  <Route
    key="contract_sale"
    path={PATH.CONTRACT_SALE}
    element={withSuspense(<ContractManagementPage />)}
  />,
  <Route
    key="contract_exchange"
    path={PATH.CONTRACT_EXCHANGE}
    element={withSuspense(<ContractManagementPage />)}
  />,
  <Route
    key="contract_gift"
    path={PATH.CONTRACT_GIFT}
    element={withSuspense(<ContractManagementPage />)}
  />,
  <Route
    key="contract_loan"
    path={PATH.CONTRACT_LOAN}
    element={withSuspense(<ContractManagementPage />)}
  />,
  <Route
    key="contract_rent"
    path={PATH.CONTRACT_RENT}
    element={withSuspense(<ContractManagementPage />)}
  />,
  <Route
    key="contract_borrow"
    path={PATH.CONTRACT_BORROW}
    element={withSuspense(<ContractManagementPage />)}
  />,
  <Route
    key="contract_service"
    path={PATH.CONTRACT_SERVICE}
    element={withSuspense(<ContractManagementPage />)}
  />,
  <Route
    key="contract_transport"
    path={PATH.CONTRACT_TRANSPORT}
    element={withSuspense(<ContractManagementPage />)}
  />,
  <Route
    key="contract_processing"
    path={PATH.CONTRACT_PROCESSING}
    element={withSuspense(<ContractManagementPage />)}
  />,
  <Route
    key="contract_storage"
    path={PATH.CONTRACT_STORAGE}
    element={withSuspense(<ContractManagementPage />)}
  />,
  <Route
    key="contract_authorization"
    path={PATH.CONTRACT_AUTHORIZATION}
    element={withSuspense(<ContractManagementPage />)}
  />,
  <Route
    key="contract_partnership"
    path={PATH.CONTRACT_PARTNERSHIP}
    element={withSuspense(<ContractManagementPage />)}
  />,
  <Route
    key="contract_detail"
    path={PATH.CONTRACT_MANAGEMENT_DETAIL}
    element={withSuspense(<ContractManagementDetailPage />)}
  />,
  <Route
    key="contract_add"
    path={PATH.CONTRACT_ADD_MANAGEMENT}
    element={withSuspense(<ContractManagementAddPage />)}
  />,

  // HR
  <Route
    key="hr_mgmt"
    path={PATH.HR_MANAGEMENT}
    element={withSuspense(<HRManagementPage />)}
  />,
  <Route
    key="hr_dept"
    path={PATH.HR_DEPARTMENT}
    element={withSuspense(<HRManagementDepartmentPage />)}
  />,
  <Route
    key="hr_position"
    path={PATH.HR_POSITION}
    element={withSuspense(<HRManagementPositionPage />)}
  />,
  <Route
    key="hr_team"
    path={PATH.HR_TEAM}
    element={withSuspense(<HRManagementTeamPage />)}
  />,
  <Route
    key="hr_team_detail"
    path={PATH.HR_TEAM_DETAIL}
    element={withSuspense(<HRManagementTeamDetailPage />)}
  />,
  <Route
    key="hr_add_team"
    path={PATH.HR_ADD_TEAM}
    element={withSuspense(<HRManagementTeamAddPage />)}
  />,
  <Route
    key="hr_employee"
    path={PATH.HR_EMPLOYEE}
    element={withSuspense(<HRManagementEmployeePage />)}
  />,
  <Route
    key="hr_add_employee"
    path={PATH.HR_ADD_EMPLOYEE}
    element={withSuspense(<HRManagementEmployeeAddPage2 />)}
  />,
  <Route
    key="hr_employee_detail"
    path={PATH.HR_EMPLOYEE_DETAIL}
    element={withSuspense(<HRManagementEmployeeDetailPage2 />)}
  />,

  // Factory
  <Route
    key="factory_mgmt"
    path={PATH.FACTORY_MANAGEMENT}
    element={withSuspense(<FactoryManagementPage />)}
  />,
  <Route
    key="factory_main"
    path={PATH.FACTORY_MAIN}
    element={withSuspense(<FactoryManagementMainPage />)}
  />,
  <Route
    key="factory_add_main"
    path={PATH.FACTORY_ADD_MAIN}
    element={withSuspense(<FactoryManagementMainAddPage />)}
  />,
  <Route
    key="factory_main_detail"
    path={PATH.FACTORY_MAIN_DETAIL}
    element={withSuspense(<FactoryManagementMainDetailPage />)}
  />,
  <Route
    key="factory_history"
    path={PATH.FACTORY_HISTORY}
    element={withSuspense(<FactoryManagementHistoryPage />)}
  />,

  // Machine
  <Route
    key="machine_mgmt"
    path={PATH.MACHINE_MANAGEMENT}
    element={withSuspense(<MachineManagementPage />)}
  />,
  <Route
    key="machine_main"
    path={PATH.MACHINE_MAIN}
    element={withSuspense(<MachineManagementMainPage />)}
  />,
  <Route
    key="machine_main_detail"
    path={PATH.MACHINE_MAIN_DETAIL}
    element={withSuspense(<MachineManagementMainDetailPage />)}
  />,
  <Route
    key="machine_add_main"
    path={PATH.MACHINE_ADD_MAIN}
    element={withSuspense(<MachineManagementMainAddPage />)}
  />,
  <Route
    key="machine_type"
    path={PATH.MACHINE_TYPE}
    element={withSuspense(<MachineManagementCategoryPage />)}
  />,
  <Route
    key="machine_usage_history"
    path={PATH.MACHINE_USAGE_HISTORY}
    element={withSuspense(<MachineManagementUsageHistoryPage />)}
  />,
  <Route
    key="machine_maintenance_history"
    path={PATH.MACHINE_MAINTENANCE_HISTORY}
    element={withSuspense(<MachineManagementMaintenanceHistoryPage />)}
  />,
  <Route
    key="machine_disposal_history"
    path={PATH.MACHINE_DISPOSAL_HISTORY}
    element={withSuspense(<MachineManagementDisposalHistoryPage />)}
  />,

  // Pesticide
  <Route
    key="pesticide_mgmt"
    path={PATH.PESTICIDE_MANAGEMENT}
    element={withSuspense(<PesticideManagementPage />)}
  />,
  <Route
    key="pesticide_history"
    path={PATH.PESTICIDE_HISTORY}
    element={withSuspense(<PesticideUsageHistoryPage />)}
  />,
  <Route
    key="pesticide_main"
    path={PATH.PESTICIDE_MAIN}
    element={withSuspense(<PesticideManagementMainPage />)}
  />,
  <Route
    key="pesticide_main_detail"
    path={PATH.PESTICIDE_MAIN_DETAIL}
    element={withSuspense(<PesticideManagementMainDetailPage />)}
  />,
  <Route
    key="pesticide_add_main"
    path={PATH.PESTICIDE_ADD_MAIN}
    element={withSuspense(<PesticideManagementMainAddPage />)}
  />,
  <Route
    key="pesticide_category"
    path={PATH.PESTICIDE_CATEGORY}
    element={withSuspense(<PesticideManagementCategoryPage />)}
  />,
  <Route
    key="pesticide_disposal_history"
    path={PATH.PESTICIDE_DISPOSAL_HISTORY}
    element={withSuspense(<PesticideManagementDisposalPage />)}
  />,

  // Supply / Stock / Fertilizer
  <Route
    key="supply_main"
    path={PATH.SUPPLY_MAIN}
    element={withSuspense(<SupplyManagementPage />)}
  />,
  <Route
    key="supply_add_main"
    path={PATH.SUPPLY_ADD_MAIN}
    element={withSuspense(<SupplyManagementAddPage />)}
  />,
  <Route
    key="supply_type"
    path={PATH.SUPPLY_TYPE}
    element={withSuspense(<SupplyManagementCategoryPage />)}
  />,
  <Route
    key="supply_disposal_history"
    path={PATH.SUPPLY_DISPOSAL_HISTORY}
    element={withSuspense(<SupplyManagementDisposalPage />)}
  />,
  <Route
    key="supply_history"
    path={PATH.SUPPLY_HISTORY}
    element={withSuspense(<SupplyManagementUsageHistoryPage />)}
  />,

  <Route
    key="stock_area"
    path={PATH.STOCK_AREA}
    element={withSuspense(<StockManagementAreaPage />)}
  />,
  <Route
    key="stock_add_area"
    path={PATH.STOCK_ADD_AREA}
    element={withSuspense(<StockManagementAddAreaPage />)}
  />,
  <Route
    key="stock_area_detail"
    path={PATH.STOCK_AREA_DETAIL}
    element={withSuspense(<StockManagementAreaDetailPage />)}
  />,
  <Route
    key="stock_management"
    path={PATH.STOCK_MANAGEMENT}
    element={withSuspense(<StockManagementPage />)}
  />,
  <Route
    key="stock_supply"
    path={PATH.STOCK_SUPPLY}
    element={withSuspense(<StockManagementSupplyPage />)}
  />,
  <Route
    key="stock_management_supply_detail"
    path={PATH.STOCK_SUPPLY_DETAIL}
    element={withSuspense(<StockManagementSupplyDetailPage />)}
  />,
  <Route
    key="stock_management_io"
    path={PATH.STOCK_MANAGEMENT_IO}
    element={withSuspense(<StockManagementIOPage />)}
  />,
  <Route
    key="stock_pesticide"
    path={PATH.STOCK_PESTICIDE}
    element={withSuspense(<StockManagementPesticidePage />)}
  />,
  <Route
    key="stock_fertilizer"
    path={PATH.STOCK_FERTILIZER}
    element={withSuspense(<StockManagementFertilizerPage />)}
  />,
  <Route
    key="stock_machine"
    path={PATH.STOCK_MACHINE}
    element={withSuspense(<StockManagementMachinePage />)}
  />,
  <Route
    key="stock_seed"
    path={PATH.STOCK_SEED}
    element={withSuspense(<StockManagementSeedPage />)}
  />,

  // Purchase / Sell / Finance
  <Route
    key="purchase"
    path={PATH.PURCHASE}
    element={withSuspense(<PurchasePage />)}
  />,
  <Route key="sell" path={PATH.SELL} element={withSuspense(<SellPage />)} />,
  <Route
    key="finance_account"
    path={PATH.FINANCE_ACCOUNT}
    element={withSuspense(<FinanceAccountPage />)}
  />,

  <Route
    key="fertilizer_type"
    path={PATH.FERTILIZER_TYPE}
    element={withSuspense(<FertilizerManagementTypePage />)}
  />,
  <Route
    key="fertilizer_main"
    path={PATH.FERTILIZER_MAIN}
    element={withSuspense(<FertilizerManagementMainPage />)}
  />,
  <Route
    key="fertilizer_main_add"
    path={PATH.FERTILIZER_MAIN_ADD}
    element={withSuspense(<FertilizerManagementMainAddPage />)}
  />,
  <Route
    key="fertilizer_main_detail"
    path={PATH.FERTILIZER_MAIN_DETAIL}
    element={withSuspense(<FertilizerManagementMainDetailPage />)}
  />,
  <Route
    key="fertilizer_usage_history"
    path={PATH.FERTILIZER_HISTORY}
    element={withSuspense(<FertilizerManagementUsageHistoryPage />)}
  />,
  <Route
    key="fertilizer_disposal_history"
    path={PATH.FERTILIZER_DISPOSAL_HISTORY}
    element={withSuspense(<FertilizerManagementDisposalPage />)}
  />,

  <Route
    key="stock_delivery"
    path={PATH.STOCK_DELIVERY}
    element={withSuspense(<StockManagementDeliveryPage />)}
  />,
  <Route
    key="stock_add_delivery"
    path={PATH.STOCK_ADD_DELIVERY}
    element={withSuspense(<StockManagementAddDeliveryPage />)}
  />,
  <Route
    key="stock_delivery_detail"
    path={PATH.STOCK_DELIVERY_DETAIL}
    element={withSuspense(<StockManagementDeliveryDetailPage />)}
  />,

  // Company / Vendor / Order / Bill / Debt / Packaging
  <Route
    key="company"
    path={PATH.COMPANY}
    element={withSuspense(<CompanyPage />)}
  />,
  <Route
    key="company_address"
    path={PATH.COMPANY_ADDRESS}
    element={withSuspense(<CompanyAddressPage />)}
  />,
  <Route
    key="company_address_add"
    path={PATH.COMPANY_ADDRESS_ADD}
    element={withSuspense(<CompanyAddressAddPage />)}
  />,
  <Route
    key="company_customer"
    path={PATH.COMPANY_CUSTOMER}
    element={withSuspense(<CompanyPage />)}
  />,
  <Route
    key="company_partner"
    path={PATH.COMPANY_PARTNER}
    element={withSuspense(<CompanyPage />)}
  />,
  <Route
    key="company_detail"
    path={PATH.COMPANY_DETAIL}
    element={withSuspense(<CompanyDetailPage />)}
  />,
  <Route
    key="company_add"
    path={PATH.COMPANY_ADD}
    element={withSuspense(<CompanyAddPage2 />)}
  />,
  <Route
    key="vendor"
    path={PATH.VENDOR}
    element={withSuspense(<VendorPage />)}
  />,
  <Route
    key="purchase_mgmt_product"
    path={PATH.PURCHASE_MANAGEMENT_PRODUCT}
    element={withSuspense(<PurchaseManagementProductPage />)}
  />,
  <Route
    key="purchase_mgmt_product_add"
    path={PATH.PURCHASE_MANAGEMENT_PRODUCT_ADD}
    element={withSuspense(<PurchaseManagementProductAddPage />)}
  />,
  <Route
    key="purchase_mgmt_material"
    path={PATH.PURCHASE_MANAGEMENT_RAW_MATERIAL}
    element={withSuspense(<PurchaseManagementMaterialPage />)}
  />,
  <Route
    key="purchase_mgmt_material_add"
    path={PATH.PURCHASE_MANAGEMENT_RAW_MATERIAL_ADD}
    element={withSuspense(<PurchaseManagementMaterialAddPage />)}
  />,
  <Route
    key="order_mgmt_quick"
    path={PATH.ORDER_MANAGEMENT_QUICK}
    element={withSuspense(<OrderManagememtQuickPage />)}
  />,
  <Route
    key="order_mgmt_create"
    path={PATH.ORDER_MANAGEMENT_CREATE}
    element={withSuspense(<OrderManagementCreatePage />)}
  />,
  <Route
    key="order_mgmt_address"
    path={PATH.ORDER_MANAGEMENT_ADDRESS}
    element={withSuspense(<OrderManagementAddressPage />)}
  />,

  <Route
    key="bill_user"
    path={PATH.BILL_MANAGEMENT_USER}
    element={withSuspense(<BillManagementUserPage />)}
  />,
  <Route
    key="bill_user_detail"
    path={PATH.BILL_MANAGEMENT_USER_DETAIL}
    element={withSuspense(<BillManagementUserDetailPage />)}
  />,
  <Route
    key="bill_company"
    path={PATH.BILL_MANAGEMENT_COMPANY}
    element={withSuspense(<BillManagementCompanyPage />)}
  />,
  <Route
    key="bill_company_detail"
    path={PATH.BILL_MANAGEMENT_COMPANY_DETAIL}
    element={withSuspense(<BillManagementCompanyDetailPage />)}
  />,
  <Route
    key="bill_company_add"
    path={PATH.BILL_MANAGEMENT_COMPANY_ADD}
    element={withSuspense(<BillManagementCompanyAddPage />)}
  />,

  <Route
    key="debt_receivable"
    path={PATH.DEBT_RECEIVABLE}
    element={withSuspense(<DebtManagementReceivablePage />)}
  />,
  <Route
    key="debt_receivable_add"
    path={PATH.DEBT_RECEIVABLE_ADD}
    element={withSuspense(<DebtManagementReceivableAddPage />)}
  />,
  <Route
    key="debt_receivable_detail"
    path={PATH.DEBT_RECEIVABLE_DETAIL}
    element={withSuspense(<DebtManagementReceivableDetailPage />)}
  />,
  <Route
    key="debt_payable"
    path={PATH.DEBT_PAYABLE}
    element={withSuspense(<DebtManagementPayablePage />)}
  />,
  <Route
    key="debt_payable_add"
    path={PATH.DEBT_PAYABLE_ADD}
    element={withSuspense(<DebtManagementPayableAddPage />)}
  />,
  <Route
    key="debt_payable_detail"
    path={PATH.DEBT_PAYABLE_DETAIL}
    element={withSuspense(<DebtManagementPayableDetailPage />)}
  />,

  <Route
    key="packaging_spec"
    path={PATH.PACKAGING_SPECIFICATION}
    element={withSuspense(<PackagingSpecificationPage />)}
  />,

  // Bank
  <Route
    key="bank_mgmt"
    path={PATH.BANK_MANAGEMENT}
    element={withSuspense(<BankManagementPage />)}
  />,

  // History aliases mapping to AreaManagementHistoryPage
  <Route
    key="map_history"
    path={PATH.MAP_HISTORY}
    element={withSuspense(<MapHistoryPage />)}
  />,
  <Route
    key="season_history_alias"
    path={PATH.SEASON_HISTORY}
    element={withSuspense(<SeasonHistoryPage />)}
  />,
  <Route
    key="plan_history_alias"
    path={PATH.PLAN_HISTORY}
    element={withSuspense(<PlanHistoryPageAlias />)}
  />,
  <Route
    key="task_history"
    path={PATH.TASK_HISTORY}
    element={withSuspense(<TaskHistoryPage />)}
  />,
  <Route
    key="product_history"
    path={PATH.PRODUCT_HISTORY}
    element={withSuspense(<ProductHistoryPage />)}
  />,
  <Route
    key="fertilizer_history_alias"
    path={PATH.FERTILIZER_HISTORY}
    element={withSuspense(<FertilizerHistoryAlias />)}
  />,
  <Route
    key="pesticide_history_alias"
    path={PATH.PESTICIDE_HISTORY}
    element={withSuspense(<PesticideHistoryAlias />)}
  />,
  <Route
    key="supply_history_alias"
    path={PATH.SUPPLY_HISTORY}
    element={withSuspense(<SupplyHistoryPage />)}
  />,
  <Route
    key="company_history"
    path={PATH.COMPANY_HISTORY}
    element={withSuspense(<CompanyHistoryPage />)}
  />,
  <Route
    key="hr_history"
    path={PATH.HR_HISTORY}
    element={withSuspense(<HRHistoryPage />)}
  />,
  <Route
    key="contract_history"
    path={PATH.CONTRACT_HISTORY}
    element={withSuspense(<ContractHistoryPage />)}
  />,
  <Route
    key="purchase_mgmt_history"
    path={PATH.PURCHASE_MANAGEMENT_HISTORY}
    element={withSuspense(<PurchaseManagementHistoryPage />)}
  />,
  <Route
    key="order_mgmt_history"
    path={PATH.ORDER_MANAGEMENT_HISTORY}
    element={withSuspense(<OrderManagementHistoryPage />)}
  />,

  // Finance purpose pages
  <Route
    key="finance_purpose_expense"
    path={PATH.FINANCE_PURPOSE_EXPENSE}
    element={withSuspense(<FinancePurposeExpensePage />)}
  />,
  <Route
    key="finance_purpose_expense_add"
    path={PATH.FINANCE_PURPOSE_EXPENSE_ADD}
    element={withSuspense(<FinancePurposeExpenseAddPage />)}
  />,
  <Route
    key="finance_purpose_receive"
    path={PATH.FINANCE_PURPOSE_RECEIVE}
    element={withSuspense(<FinancePurposeReceivePage />)}
  />,
  <Route
    key="finance_purpose_receive_add"
    path={PATH.FINANCE_PURPOSE_RECEIVE_ADD}
    element={withSuspense(<FinancePurposeReceiveAddPage />)}
  />,
  <Route
    key="finance_purpose_statistic"
    path={PATH.FINANCE_PURPOSE_STATISTIC}
    element={withSuspense(<FinancePurposeStatisticPage />)}
  />,
  <Route
    key="finance_purpose_history"
    path={PATH.FINANCE_PURPOSE_HISTORY}
    element={withSuspense(<FinancePurposeHistoryPage />)}
  />,
  <Route
    key="finance_purpose_mgmt"
    path={PATH.FINANCE_PURPOSE_MANAGEMENT}
    element={withSuspense(<FinancePurposeManagementPage />)}
  />,

  // Contact
  <Route
    key="contact_list"
    path={PATH.CONTACT_LIST}
    element={withSuspense(<ContactPage />)}
  />,

  // Certificate
  <Route
    key="certificate_list"
    path={PATH.CERTIFICATION}
    element={withSuspense(<CertificatePage />)}
  />,
  <Route
    key="certificate_add"
    path={PATH.CERTIFICATION_ADD}
    element={withSuspense(<CertificateAddPage />)}
  />,
  <Route
    key="business_report"
    path={PATH.BUSINESS_REPORT}
    element={withSuspense(<BusinessReportPage />)}
  />,
  <Route
    key="purchase_report"
    path={PATH.PURCHASE_REPORT}
    element={withSuspense(<PurchaseReportPage />)}
  />,
  <Route
    key="cash_flow_report"
    path={PATH.CASH_FLOW_REPORT}
    element={withSuspense(<CashFlowReportPage />)}
  />,
  <Route
    key="production_report"
    path={PATH.PRODUCTION_REPORT}
    element={withSuspense(<ProductionReportPage />)}
  />,
];

// =============================
// Render
// =============================
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
          {/* Fallback chung cho toàn bộ route */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* index route */}
              <Route
                index
                path={PATH.AUTH}
                element={withSuspense(<AuthPage />)}
              />

              {/* Shell */}
              <Route path="/" element={withSuspense(<App />)}>
                <Route path="*" element={<Navigate to={PATH.HOME} replace />} />
                {ROUTES.map((item) => item)}
              </Route>
            </Routes>
          </Suspense>
        </ModalsProvider>
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>
);
