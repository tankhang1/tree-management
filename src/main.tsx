import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/index.tsx";
import { PATH } from "./constants/path.constants.ts";
import SchedulePage from "./pages/SchedulePage/index.tsx";
import GardenManagementPage from "./pages/GardenManagementPage/index.tsx";
import FarmingManagementPage from "./pages/FarmingManagementPage/index.tsx";
import InventoryAndAssetManagementPage from "./pages/InventoryAndAssetManagementPage/index.tsx";
import PurchasePage from "./pages/PurchasePage/index.tsx";
import SellPage from "./pages/SellPage/index.tsx";
import FinanceAccountPage from "./pages/FinanceAccountPage/index.tsx";
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css"; //import MRT styles
import "@mantine/core/styles.css";
import "dayjs/locale/vi";
import FarmingManagementPlanPage from "./pages/FarmingManagementPage/Plan/index.tsx";
import FarmingManagementTaskByPlanPage from "./pages/FarmingManagementPage/TaskByPlan/index.tsx";
import FarmingManagementUnPlannedTaskPage from "./pages/FarmingManagementPage/UnPlannedTask/index.tsx";
import FarmingManagementBatmanPlanPage from "./pages/FarmingManagementPage/BatmanPlan/index.tsx";
import FarmingManagementYieldForecastPage from "./pages/FarmingManagementPage/YieldForecast/index.tsx";
import FarmingManagementMenuPage from "./pages/FarmingManagementPage/Menu/index.tsx";
import QueenFarmPage from "./pages/QueenFarmPage/index.tsx";
import FarmingFormByPlanPage from "./pages/FarmingFormPage/Plan/index.tsx";
import FarmingFormUnPlannedPage from "./pages/FarmingFormPage/UnPlanned/index.tsx";
import FarmingFormBatmanPage from "./pages/FarmingFormPage/Batman/index.tsx";
import FarmingFormHistoryPage from "./pages/FarmingFormPage/History/index.tsx";
import FarmingFormEmployeeEvaluationPage from "./pages/FarmingFormPage/Employee-Evaluation/index.tsx";
import GardenManagementTypePage from "./pages/GardenManagementPage/Type/index.tsx";
import GardenManagementAreaPage from "./pages/GardenManagementPage/Area/index.tsx";
import GardenManagementMapPage from "./pages/GardenManagementPage/Map/index.tsx";
import GardenManagementTypeDetailPage from "./pages/GardenManagementPage/Type/Detail/index.tsx";
import GardenManagementAreaDetailPage from "./pages/GardenManagementPage/Area/Detail/index.tsx";
import "leaflet/dist/leaflet.css";
import { MantineProvider, type MantineThemeOverride } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
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
            <Route path={"/"} element={<App />}>
              <Route index path={PATH.HOME} element={<HomePage />} />
              <Route path={PATH.SCHEDULE} element={<SchedulePage />} />
              <Route
                path={PATH.GARDEN_MANAGEMENT}
                element={<GardenManagementPage />}
              />
              <Route
                path={PATH.GARDEN_MANAGEMENT_TYPE}
                element={<GardenManagementTypePage />}
              />
              <Route
                path={PATH.GARDEN_MANAGEMENT_TYPE_DETAIL}
                element={<GardenManagementTypeDetailPage />}
              />
              <Route
                path={PATH.GARDEN_MANAGEMENT_AREA}
                element={<GardenManagementAreaPage />}
              />
              <Route
                path={PATH.GARDEN_MANAGEMENT_AREA_DETAIL}
                element={<GardenManagementAreaDetailPage />}
              />
              <Route
                path={PATH.GARDEN_MANAGEMENT_MAP}
                element={<GardenManagementMapPage />}
              />
              {/* Farming Management */}
              <Route
                path={PATH.FARMING_MANAGEMENT}
                element={<FarmingManagementPage />}
              />
              <Route
                path={PATH.FARMING_PLAN}
                element={<FarmingManagementPlanPage />}
              />
              <Route
                path={PATH.FARMING_TASK_BY_PLAN}
                element={<FarmingManagementTaskByPlanPage />}
              />
              <Route
                path={PATH.FARMING_UNPLANNED_TASK}
                element={<FarmingManagementUnPlannedTaskPage />}
              />
              <Route
                path={PATH.FARMING_BATMAN_PLAN}
                element={<FarmingManagementBatmanPlanPage />}
              />
              <Route
                path={PATH.FARMING_YIELD_FORECAST}
                element={<FarmingManagementYieldForecastPage />}
              />
              <Route
                path={PATH.FARMING_MENU}
                element={<FarmingManagementMenuPage />}
              />

              <Route
                path={PATH.FARMING_FORM_BY_PLAN}
                element={<FarmingFormByPlanPage />}
              />
              <Route
                path={PATH.FARMING_FORM_UNPLANNED}
                element={<FarmingFormUnPlannedPage />}
              />
              <Route
                path={PATH.FARMING_FORM_BATMAN}
                element={<FarmingFormBatmanPage />}
              />
              <Route
                path={PATH.FARMING_FORM_HISTORY}
                element={<FarmingFormHistoryPage />}
              />
              <Route
                path={PATH.FARMING_FORM_EMPLOYEE_EVALUATION}
                element={<FarmingFormEmployeeEvaluationPage />}
              />
              <Route
                path={PATH.INVENTORY_AND_ASSET_MANAGEMENT}
                element={<InventoryAndAssetManagementPage />}
              />
              <Route path={PATH.PURCHASE} element={<PurchasePage />} />
              <Route path={PATH.SELL} element={<SellPage />} />
              <Route
                path={PATH.FINANCE_ACCOUNT}
                element={<FinanceAccountPage />}
              />
              <Route path={PATH.QUEEN_FARM} element={<QueenFarmPage />} />
            </Route>
          </Routes>
        </ModalsProvider>
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>
);
