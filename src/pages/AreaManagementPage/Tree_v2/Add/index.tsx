import {
  Stepper,
  Button,
  Group,
  Stack,
  TextInput,
  ActionIcon,
  Card,
  Title,
  Text,
  NumberInput,
  Modal,
  Image,
  Radio,
  SegmentedControl,
  Divider,
  Accordion,
  ScrollAreaAutosize,
  Badge,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { memo, useState } from "react";
import { MapContainer, Marker, Polygon, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import ConfirmStep from "./components/ConfirmStep";
import RegionCardSelector from "../../Row/Add/components/RegionCards";
import { regionOptions } from "../../Block/Add";
import AreaCards from "../../Zone/Add/components/AreaCards";
import { areaOptions, plotOptions } from "../../Row/Add";
import PlotCardSelector from "../../Row/Add/components/PlotCards";
import { DatePickerInput } from "@mantine/dates";
import SeedDetailCards from "../../Region/Add/components/SeedDetailCards";

type LatLng = [number, number];
type TreeRow = {
  name: string; // Hàng 1, Hàng 2...
  coords: [number, number][];
};

type TreePoint = {
  code?: string;
  lat?: number;
  lng?: number;
  plantedAt?: Date | null;
};
// ============ PLOTS (lô) ============ //
export const samplePlots = [
  {
    id: "LO-A1",
    code: "LO-A1",
    name: "Lô A1",
    mainCrop: "Đậu nành",
    areaM2: 1500,
    rowsCount: 10,
    irrigation: "Tưới nhỏ giọt",
    cultivation: "Hữu cơ",
    terrainLabel: "BẰNG PHẲNG (4–6M)",
    treeCount: 0, // lô cây hàng năm → không dùng 'treeCount'
    seeds: [
      {
        code: "DN001",
        seedName: "Đậu nành DT84",
        cropName: "Đậu nành",
        image:
          "https://hatgiongcaytrong.com.vn/wp-content/uploads/2023/01/hat-giong-dau-nanh-dx11.jpg",
        seedType: "Hạt giống",
      },
      {
        code: "DN003",
        seedName: "Đậu nành ĐX11",
        cropName: "Đậu nành",
        image:
          "https://www.greentechviet.com/uploads/images/hat-giong-dau-nanh.jpg",
        seedType: "Hạt giống",
      },
    ],
  },
  {
    id: "LO-B2",
    code: "LO-B2",
    name: "Lô B2",
    mainCrop: "Bắp (Ngô)",
    areaM2: 1800,
    rowsCount: 12,
    irrigation: "Tưới phun mưa",
    cultivation: "Luân canh",
    terrainLabel: "BẰNG PHẲNG (5–7M)",
    treeCount: 0,
    seeds: [
      {
        code: "BP001",
        seedName: "Bắp LVN10",
        cropName: "Bắp (Ngô)",
        image:
          "https://storage.ssc.com.vn/Data/2021/05/18/lvn10-3-637569497051796680.jpg?w=620&h=350",
        seedType: "Hạt giống",
      },
      {
        code: "BP003",
        seedName: "Bắp vàng VN886",
        cropName: "Bắp (Ngô)",
        image:
          "https://file.hstatic.net/1000344723/file/hat_giong_bap_vang_vn886.jpg",
        seedType: "Hạt giống",
      },
    ],
  },
];

// ============ DANH SÁCH CÂY (ghi nhận thực tế theo hàng/cụm) ============ //
const treeList = [
  {
    type: "Ngũ cốc – Hạt dầu",
    variety: "Đậu nành DT84",
    img: "https://hatgiongcaytrong.com.vn/wp-content/uploads/2023/01/hat-giong-dau-nanh-dx11.jpg",
    seed: "Đậu nành",
    method: "Hữu cơ",
    irrigation: "Tưới nhỏ giọt",
    plantedAt: "2024-03-15",
    region: "ĐBSCL",
    area: "1.5ha",
    plot: "A1",
    row: "R5",
    coords: [[10.1234, 105.5678]],
  },
  {
    type: "Ngũ cốc",
    variety: "Bắp LVN10",
    img: "https://storage.ssc.com.vn/Data/2021/05/18/lvn10-3-637569497051796680.jpg?w=620&h=350",
    seed: "Bắp (Ngô)",
    method: "Luân canh",
    irrigation: "Tưới phun mưa",
    plantedAt: "2023-11-20",
    region: "Đông Nam Bộ",
    area: "2ha",
    plot: "B2",
    row: "R2",
    coords: [[11.5678, 107.2345]],
  },
];

// ============ HÀNG (rows) – giữ cấu trúc như cũ ============ //
export const sampleRows = [
  { id: "row-1", rowId: "H1", rowName: "Hàng 1", treeCount: 12 },
  { id: "row-1", rowId: "H1", rowName: "Hàng 4", treeCount: 12 },
  { id: "row-1", rowId: "H1", rowName: "Hàng 5", treeCount: 12 },
  { id: "row-2", rowId: "H2", rowName: "Hàng 2", treeCount: 15 },
  { id: "row-3", rowId: "H3", rowName: "Hàng 3", treeCount: 10 },
];

// ============ GPS (giữ nguyên key để không vỡ UI), chỉ là dữ liệu tọa độ ============ //
export const sampleGpsData = {
  byPlot: {
    "LO-A1": [
      {
        code: "A1-001",
        lat: 10.762622,
        lng: 106.660172,
        plantedAt: new Date("2025-08-01"),
      },
      {
        code: "A1-002",
        lat: 10.7627,
        lng: 106.66025,
        plantedAt: new Date("2025-08-02"),
      },
      { code: "A1-003", lat: 10.76275, lng: 106.66028, plantedAt: null },
    ],
    "LO-B2": [
      {
        code: "B2-001",
        lat: 10.763,
        lng: 106.661,
        plantedAt: new Date("2025-08-03"),
      },
      {
        code: "B2-002",
        lat: 10.76305,
        lng: 106.66105,
        plantedAt: new Date("2025-08-04"),
      },
      { code: "B2-003", lat: 10.7631, lng: 106.6611, plantedAt: null },
    ],
    "LO-C3": [
      {
        code: "C3-001",
        lat: 10.764,
        lng: 106.662,
        plantedAt: new Date("2025-08-05"),
      },
      { code: "C3-002", lat: 10.76405, lng: 106.66205, plantedAt: null },
    ],
  },
  byArea: {
    "AREA-01": [
      {
        code: "AR1-001",
        lat: 10.765,
        lng: 106.662,
        plantedAt: new Date("2025-08-05"),
      },
      {
        code: "AR1-002",
        lat: 10.76505,
        lng: 106.66205,
        plantedAt: new Date("2025-08-06"),
      },
    ],
    "AREA-02": [
      { code: "AR2-001", lat: 10.766, lng: 106.663, plantedAt: null },
      {
        code: "AR2-002",
        lat: 10.76605,
        lng: 106.66305,
        plantedAt: new Date("2025-08-09"),
      },
    ],
    "AREA-03": [
      {
        code: "AR3-001",
        lat: 10.767,
        lng: 106.664,
        plantedAt: new Date("2025-08-10"),
      },
    ],
  },
  byRegion: {
    "REGION-01": [
      {
        code: "RG1-001",
        lat: 10.768,
        lng: 106.665,
        plantedAt: new Date("2025-08-07"),
      },
      { code: "RG1-002", lat: 10.76805, lng: 106.66505, plantedAt: null },
    ],
    "REGION-02": [
      {
        code: "RG2-001",
        lat: 10.769,
        lng: 106.666,
        plantedAt: new Date("2025-08-08"),
      },
      { code: "RG2-002", lat: 10.76905, lng: 106.66605, plantedAt: null },
    ],
    "REGION-03": [
      {
        code: "RG3-001",
        lat: 10.77,
        lng: 106.667,
        plantedAt: new Date("2025-08-11"),
      },
    ],
  },
  byRow: {
    "ROW-01": [
      {
        code: "R1-001",
        lat: 10.7629,
        lng: 106.6604,
        plantedAt: new Date("2025-08-01"),
      },
      { code: "R1-002", lat: 10.763, lng: 106.6605, plantedAt: null },
    ],
    "ROW-02": [
      {
        code: "R2-001",
        lat: 10.7635,
        lng: 106.6615,
        plantedAt: new Date("2025-08-03"),
      },
    ],
  },
  inputBuffer: {
    byPlot: {
      "LO-A1": { code: "A1-NEW", lat: 10.7628, lng: 106.6603, plantedAt: null },
      "LO-B2": { code: "B2-NEW", lat: 10.7632, lng: 106.6612, plantedAt: null },
    },
    byArea: {
      "AREA-01": {
        code: "AR1-NEW",
        lat: 10.7651,
        lng: 106.6621,
        plantedAt: null,
      },
      "AREA-02": {
        code: "AR2-NEW",
        lat: 10.7661,
        lng: 106.6631,
        plantedAt: null,
      },
    },
    byRegion: {
      "REGION-01": {
        code: "RG1-NEW",
        lat: 10.7681,
        lng: 106.6651,
        plantedAt: null,
      },
      "REGION-02": {
        code: "RG2-NEW",
        lat: 10.7691,
        lng: 106.6661,
        plantedAt: null,
      },
    },
    byRow: {
      "ROW-01": {
        code: "R1-NEW",
        lat: 10.7631,
        lng: 106.6606,
        plantedAt: null,
      },
    },
  },
};

// ============ VÙNG & KHU ĐANG CHỌN (chuyển sang đậu nành/bắp) ============ //
export const selectedRegions = [
  {
    id: "VT-001",
    name: "Vùng Trồng Đậu nành – Bắp (ĐBSCL)",
    areaM2: 50000,
    soilType: "Đất phù sa",
    terrain: "Bằng phẳng, Trũng nhẹ",
    seeds: [
      {
        code: "DN001",
        seedName: "Đậu nành DT84",
        cropName: "Đậu nành",
        image:
          "https://hatgiongcaytrong.com.vn/wp-content/uploads/2023/01/hat-giong-dau-nanh-dx11.jpg",
        seedType: "Hạt giống",
      },
      {
        code: "BP001",
        seedName: "Bắp LVN10",
        cropName: "Bắp (Ngô)",
        image:
          "https://storage.ssc.com.vn/Data/2021/05/18/lvn10-3-637569497051796680.jpg?w=620&h=350",
        seedType: "Hạt giống",
      },
    ],
  },
];

export const selectedAreas = [
  {
    id: "KV-001",
    name: "Khu vực 1 - Đậu nành",
    areaM2: 20000,
    soilType: "Đất thịt nhẹ",
    terrain: "Bằng phẳng",
    seeds: [
      {
        code: "DN003",
        seedName: "Đậu nành ĐX11",
        cropName: "Đậu nành",
        image:
          "https://www.greentechviet.com/uploads/images/hat-giong-dau-nanh.jpg",
        seedType: "Hạt giống",
      },
      {
        code: "DN004",
        seedName: "Đậu nành HL02",
        cropName: "Đậu nành",
        image: "https://nongnghiep.farm/files/hat-giong-dau-nanh-hl01.jpg",
        seedType: "Hạt giống",
      },
    ],
  },
];

const AreaManagementTreeAddv2Page = () => {
  const navigate = useNavigate();
  const [openedTreeList, setOpenedTreeList] = useState(false);
  const [active, setActive] = useState(0);
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [coords, setCoords] = useState<LatLng[]>([]);
  const [selectedTree, setSelectedTree] = useState<string>("");
  const [openedTreeMap, setOpenTreeMap] = useState(false);
  const [type, setType] = useState<"region" | "area" | "plot">("region");
  const form = useForm({
    initialValues: {
      selectType: "plot",
      region: "",
      area: "",
      plot: "",
      row: "",
      plantedAt: "",
      trees: [{ gps: "" }],
      allocation: {
        type: "plot", // hoặc "row"
        selectedPlots: samplePlots,
        rows: sampleRows,
        selectedRegions: selectedRegions,
        selectedAreas: selectedAreas,
      },
      gps: sampleGpsData,
    },
  });

  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleAddPoint = () => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      setCoords((prev) => [...prev, [parsedLat, parsedLng]]);
      setLat("");
      setLng("");
    }
  };

  const handleRemove = (index: number) => {
    setCoords((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card withBorder shadow="sm" radius={4} p="lg">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Thêm mới phân bổ cây trồng</Title>
      </Group>
      <form>
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
        >
          {/* STEP 1: Lô / HÀNG */}
          <Stepper.Step label="Bước 1" description="Vị trí trồng">
            <Stack>
              <SegmentedControl
                radius={4}
                value={type}
                onChange={(value) =>
                  setType(value as "region" | "area" | "plot")
                }
                data={[
                  { label: "Vùng trồng", value: "region" },
                  { label: "Khu vực", value: "area" },
                  { label: "Lô", value: "plot" },
                ]}
              />
              <Stack gap={"xs"}>
                <TextInput
                  label="Vùng trồng"
                  placeholder="Tìm kiếm vùng trồng"
                  radius={4}
                  leftSection={<IconSearch size={18} />}
                />
                <RegionCardSelector
                  regions={regionOptions}
                  selected={"12"}
                  onSelect={() => {}}
                />
              </Stack>
              {type !== "region" && (
                <Stack gap={"xs"}>
                  <TextInput
                    label="Khu vực"
                    placeholder="Tìm kiếm khu vực"
                    radius={4}
                    leftSection={<IconSearch size={18} />}
                  />
                  <AreaCards
                    areas={areaOptions}
                    selected={""}
                    onSelect={() => {}}
                  />
                </Stack>
              )}

              {type !== "region" && type !== "area" && (
                <Stack gap={"xs"}>
                  <TextInput
                    label="Lô"
                    placeholder="Tìm kiếm lô"
                    radius={4}
                    leftSection={<IconSearch size={18} />}
                  />
                  <PlotCardSelector
                    lots={plotOptions}
                    selected={""}
                    onSelect={() => {}}
                  />
                </Stack>
              )}

              {/* <Select
                label="Hàng"
                placeholder="Hàng"
                radius={4}
                data={rowOptions}
                {...form.getInputProps("row")}
                readOnly={!form.values.plot}
              /> */}

              <Group justify="flex-end" mt="md">
                <Button onClick={nextStep} radius={4}>
                  Tiếp theo
                </Button>
              </Group>
            </Stack>
          </Stepper.Step>

          {/* STEP 2: XEM THÔNG TIN */}
          <Stepper.Step label="Bước 2" description="Cây trồng">
            <Stack>
              <Title order={5}>Phân bổ cây trồng</Title>

              {/* ====== THEO LÔ ====== */}
              <Stack>
                <SegmentedControl
                  radius={4}
                  value={type}
                  onChange={(value) =>
                    setType(value as "region" | "area" | "plot")
                  }
                  data={[
                    { label: "Vùng trồng", value: "region" },
                    { label: "Khu vực", value: "area" },
                    { label: "Lô", value: "plot" },
                  ]}
                />

                <Title order={6}>
                  {type === "plot"
                    ? "Thông tin các lô đã chọn"
                    : type === "area"
                    ? "Thông tin các khu vực đã chọn"
                    : "Thông tin các vùng trồng đã chọn"}
                </Title>
                <Group align="stretch" wrap="wrap">
                  <Stack gap="xs">
                    <Group align="stretch" wrap="wrap">
                      {(type === "plot"
                        ? form.values.allocation.selectedPlots
                        : type === "area"
                        ? form.values.allocation.selectedAreas
                        : form.values.allocation.selectedRegions
                      ).map((item) => (
                        <Card
                          key={item.id}
                          withBorder
                          radius="md"
                          shadow="sm"
                          p="md"
                          w={300}
                          style={{ cursor: "pointer" }}
                        >
                          <Group justify="space-between" mb="sm">
                            <Text fw={700}>{item.name}</Text>
                            <Badge variant="filled" color="gray" radius="sm">
                              {item.id}
                            </Badge>
                          </Group>

                          {type === "plot" && (
                            <>
                              <Group gap="xs">
                                <Text fw={700}>Cây trồng chính:</Text>
                                <Text>{item.mainCrop}</Text>
                              </Group>
                              <Group gap="xs">
                                <Text fw={700}>Diện tích:</Text>
                                <Text>{item.areaM2} m²</Text>
                              </Group>
                              <Group gap="xs">
                                <Text fw={700}>Số hàng:</Text>
                                <Text>{item.rowsCount}</Text>
                              </Group>
                              <Group gap="xs">
                                <Text fw={700}>Tưới:</Text>
                                <Text>{item.irrigation}</Text>
                              </Group>
                              <Group gap="xs">
                                <Text fw={700}>Canh tác:</Text>
                                <Text>{item.cultivation}</Text>
                              </Group>
                              <Group gap="xs">
                                <Text fw={700}>Địa hình:</Text>
                                <Badge
                                  variant="light"
                                  color="green"
                                  radius="xl"
                                >
                                  {item.terrainLabel}
                                </Badge>
                              </Group>
                            </>
                          )}

                          {type === "area" && (
                            <>
                              <Group gap="xs">
                                <Text fw={700}>Số lô:</Text>
                                <Text>{item.plotsCount}</Text>
                              </Group>
                              <Group gap="xs">
                                <Text fw={700}>Tổng diện tích:</Text>
                                <Text>{item.totalAreaM2} m²</Text>
                              </Group>
                              {item.soilType && (
                                <Group gap="xs">
                                  <Text fw={700}>Loại đất:</Text>
                                  <Text>{item.soilType}</Text>
                                </Group>
                              )}
                              {item.terrain && (
                                <Group gap="xs">
                                  <Text fw={700}>Địa hình:</Text>
                                  <Text>{item.terrain}</Text>
                                </Group>
                              )}
                            </>
                          )}

                          {type === "region" && (
                            <>
                              <Group gap="xs">
                                <Text fw={700}>Số khu vực:</Text>
                                <Text>{item.areasCount}</Text>
                              </Group>
                              <Group gap="xs">
                                <Text fw={700}>Tổng diện tích:</Text>
                                <Text>{item.totalAreaM2} m²</Text>
                              </Group>
                              {item.soilType && (
                                <Group gap="xs">
                                  <Text fw={700}>Loại đất:</Text>
                                  <Text>{item.soilType}</Text>
                                </Group>
                              )}
                              {item.terrain && (
                                <Group gap="xs">
                                  <Text fw={700}>Địa hình:</Text>
                                  <Text>{item.terrain}</Text>
                                </Group>
                              )}
                            </>
                          )}
                        </Card>
                      ))}
                    </Group>

                    <Radio.Group
                      value={form.values.allocation.type}
                      onChange={(v: string) =>
                        form.setFieldValue("allocation.type", v)
                      }
                    >
                      <Stack gap="xs">
                        <Radio
                          value="plot"
                          label={
                            type === "plot"
                              ? "Phân bổ theo lô"
                              : type === "area"
                              ? "Phân bổ theo khu vực"
                              : "Phân bổ theo vùng trồng"
                          }
                        />
                        <Radio value="row" label="Phân bổ theo hàng" />
                      </Stack>
                    </Radio.Group>
                  </Stack>
                  <Card withBorder radius={4} shadow="sm" p="md" flex={1}>
                    <Title order={6} mb="xs">
                      Danh sách hạt giống
                    </Title>
                    <SeedDetailCards isTouchable={false} />
                  </Card>

                  {/* {form.values.allocation.type === "row" && (
                    <Card withBorder radius={4} shadow="sm" p="md" flex={1}>
                      <Group justify="space-between" align="center">
                        <Title order={6} mb="xs">
                          Danh sách hàng
                        </Title>
                        <Button radius={4} variant="light">
                          Thêm mới
                        </Button>
                      </Group>
                      <Group wrap="nowrap" gap={"xs"}>
                        <Card withBorder radius={4} p="md" w={250}>
                          <Stack gap="xs">
                            <Text fw={600}>Hàng 1</Text>

                            <TextInput
                              label="Tên hàng"
                              placeholder="VD: Hàng 1"
                              radius={4}
                              value="Hàng 1"
                            />
                            <NumberInput
                              label="Số cây"
                              min={0}
                              radius={4}
                              value={12}
                              w={220}
                            />
                            <ActionIcon
                              pos={"absolute"}
                              top={10}
                              right={10}
                              variant="light"
                              radius={4}
                              color="red"
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Stack>
                        </Card>
                      </Group>
                    </Card>
                  )} */}
                </Group>

                {form.values.allocation.type === "plot" && (
                  <Stack gap={"xs"}>
                    {/* Nhập số cây theo lô */}
                    <Divider
                      my="sm"
                      label="Danh sách cây trồng theo lô"
                      labelPosition="center"
                    />
                    <Stack gap={0}>
                      <Group align="center">
                        <Title order={6} mb="xs">
                          {type === "plot"
                            ? "Danh sách cây trồng theo lô"
                            : type === "area"
                            ? "Danh sách cây trồng theo khu vực"
                            : "Danh sách cây trồng theo vùng trồng"}
                        </Title>
                        <Button radius={4} variant="light">
                          Thêm mới
                        </Button>
                      </Group>
                      <Text c="dimmed" fz="sm">
                        Chọn lô để xem danh sách cây trồng đã phân bổ
                      </Text>
                    </Stack>
                    <Group gap="xs">
                      {form.values.allocation.selectedPlots[0].seeds.map(
                        (p) => (
                          <Card
                            withBorder
                            radius={4}
                            p="md"
                            miw={250}
                            key={p.code}
                          >
                            <Stack gap="xs" key={p.code} mt={"md"}>
                              <Select
                                searchable
                                clearable
                                radius={4}
                                label="Giống cây"
                                data={[
                                  {
                                    label: "Giống Ri6",
                                    value: "SDR-RI6",
                                  },
                                  {
                                    label: "Giống Ri6-2",
                                    value: "SDR-RI6-2",
                                  },

                                  {
                                    label: "Giống Monthong",
                                    value: "SDR-Monthong",
                                  },
                                ]}
                              />
                              <Select
                                searchable
                                clearable
                                radius={4}
                                label="Hạt giống"
                                data={samplePlots[0].seeds.map((seed) => ({
                                  value: seed.code,
                                  label: seed.seedName,
                                }))}
                              />
                              <NumberInput
                                label="Số cây"
                                min={0}
                                radius={4}
                                value={0}
                                w={220}
                              />
                              <ActionIcon
                                pos={"absolute"}
                                top={10}
                                right={10}
                                variant="light"
                                radius={4}
                                color="red"
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Stack>
                          </Card>
                        )
                      )}
                    </Group>

                    {/* Tổng theo lô */}
                    <Group mt="sm">
                      <Text fw={500}>Tổng số cây</Text>
                      <Text fw={700} c="green">
                        {form.values.allocation.selectedPlots.reduce(
                          (s, pl) => s + (Number(pl.treeCount) || 0),
                          0
                        )}
                      </Text>
                    </Group>
                  </Stack>
                )}
              </Stack>

              {/* ====== THEO HÀNG ====== */}
              {form.values.allocation.type === "row" && (
                <Stack>
                  <Group align="center">
                    <Title order={6}>Danh sách cây trồng theo hàng</Title>
                    <Button radius={4} variant="light">
                      Thêm mới
                    </Button>
                  </Group>
                  <Accordion variant="contained" multiple radius={4}>
                    <Accordion.Item value="row-1">
                      <Accordion.Control>
                        <Group justify="space-between">
                          <Text fw={600}>Hàng 1</Text>
                          <Text c="dimmed" fz="sm">
                            12 cây
                          </Text>
                        </Group>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Stack gap={"xs"}>
                          <Title order={6} mt="xs">
                            Danh sách cây trồng
                          </Title>
                          <Card withBorder radius={4} p="md">
                            <Group align="flex-end" gap={"xs"}>
                              <Select
                                searchable
                                clearable
                                radius={4}
                                label="Hạt giống"
                                data={samplePlots[0].seeds.map((seed) => ({
                                  value: seed.code,
                                  label: seed.seedName,
                                }))}
                                flex={1}
                              />
                              <NumberInput
                                flex={1}
                                radius={4}
                                label="Số lượng cây"
                              />
                              <ActionIcon
                                variant="light"
                                color="red"
                                radius={4}
                                mt="md"
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Group>
                            <Group align="flex-end" gap={"xs"}>
                              <Select
                                searchable
                                clearable
                                radius={4}
                                label="Hạt giống"
                                data={samplePlots[0].seeds.map((seed) => ({
                                  value: seed.code,
                                  label: seed.seedName,
                                }))}
                                flex={1}
                              />
                              <NumberInput
                                flex={1}
                                radius={4}
                                label="Số lượng cây"
                              />
                              <ActionIcon
                                variant="light"
                                color="red"
                                radius={4}
                                mt="md"
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Group>
                            <Button variant="outline" radius={4} mt="md">
                              Thêm mới
                            </Button>
                          </Card>
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Stack>
              )}

              {/* Actions */}
              <Group justify="space-between" mt="md">
                <Button variant="default" onClick={prevStep}>
                  Quay lại
                </Button>
                <Button onClick={nextStep} radius={4}>
                  Tiếp theo
                </Button>
              </Group>
            </Stack>
          </Stepper.Step>

          {/* STEP 3: NHẬP TOẠ ĐỘ */}

          <Stepper.Step label="Bước 3" description="Định vị GPS">
            <Stack gap="md">
              <SegmentedControl
                radius={4}
                value={type}
                onChange={(value) =>
                  setType(value as "region" | "area" | "plot")
                }
                data={[
                  { label: "Vùng trồng", value: "region" },
                  { label: "Khu vực", value: "area" },
                  { label: "Lô", value: "plot" },
                ]}
              />
              <Title order={5}>
                Định vị GPS theo{" "}
                {form.values.allocation.type === "plot"
                  ? type === "region"
                    ? "vùng"
                    : type === "area"
                    ? "khu vực"
                    : type === "plot"
                    ? "lô"
                    : "hàng"
                  : "hàng"}
              </Title>

              {/* ====== THEO LÔ ====== */}
              {form.values.allocation.type === "plot" && type === "plot" && (
                <Accordion variant="contained" multiple radius={4}>
                  {form.values.allocation.selectedPlots.map((p) => {
                    const points = form.values.gps.byPlot[p.id] || [];
                    // input buffer (tránh ghi trực tiếp): lưu tạm theo plotId
                    const buf =
                      form.values.gps.inputBuffer?.byPlot?.[p.id] ??
                      ({
                        code: "",
                        lat: undefined,
                        lng: undefined,
                        plantedAt: null,
                      } as TreePoint);

                    return (
                      <Accordion.Item key={p.id} value={p.id}>
                        <Accordion.Control>
                          <Group justify="space-between">
                            <Text fw={600}>
                              {p.name}{" "}
                              <Text span c="dimmed">
                                ({p.code})
                              </Text>
                            </Text>
                            <Text c="dimmed" fz="sm">
                              {p.mainCrop} • {p.areaM2} m² • {p.rowsCount} hàng
                            </Text>
                          </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Card
                            withBorder
                            radius="sm"
                            shadow="xs"
                            p="md"
                            style={{ position: "relative", zIndex: 1 }}
                          >
                            <Group align="flex-start">
                              {/* Form nhập 1 điểm rồi Thêm */}
                              <Stack gap={"xs"}>
                                <Group flex={2} align="flex-end">
                                  <Select
                                    searchable
                                    clearable
                                    label="Hạt giống"
                                    placeholder="Chọn hạt giống"
                                    radius={4}
                                    data={p.seeds.map((seed) => ({
                                      value: seed.code,
                                      label: seed.seedName,
                                    }))}
                                    disabled
                                    value={"SDR-RI6"}
                                    onChange={(v) => {
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byPlot: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byPlot ?? {}),
                                          [p.id]: {
                                            ...buf,
                                            seedCode: v ?? "",
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Mã cây"
                                    placeholder="T001"
                                    radius={4}
                                    value={buf.code || ""}
                                    onChange={(e) => {
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byPlot: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byPlot ?? {}),
                                          [p.id]: {
                                            ...buf,
                                            code: e.currentTarget.value,
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Latitude"
                                    placeholder="10.762622"
                                    radius={4}
                                    value={buf.lat ?? ""}
                                    onChange={(e) => {
                                      const v = e.currentTarget.value;
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byPlot: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byPlot ?? {}),
                                          [p.id]: {
                                            ...buf,
                                            lat:
                                              v === "" ? undefined : Number(v),
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Longitude"
                                    placeholder="106.660172"
                                    radius={4}
                                    value={buf.lng ?? ""}
                                    onChange={(e) => {
                                      const v = e.currentTarget.value;
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byPlot: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byPlot ?? {}),
                                          [p.id]: {
                                            ...buf,
                                            lng:
                                              v === "" ? undefined : Number(v),
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <DatePickerInput
                                    radius={4}
                                    label="Thời gian trồng"
                                    placeholder="Chọn ngày"
                                    locale="vi"
                                    clearable
                                    popoverProps={{ withinPortal: true }}
                                    value={buf.plantedAt ?? null}
                                    onChange={(d) => {
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byPlot: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byPlot ?? {}),
                                          [p.id]: {
                                            ...buf,
                                            plantedAt: d ?? null,
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                </Group>

                                <Group flex={2} align="flex-end">
                                  <Select
                                    searchable
                                    clearable
                                    label="Hạt giống"
                                    placeholder="Chọn hạt giống"
                                    radius={4}
                                    data={p.seeds.map((seed) => ({
                                      value: seed.code,
                                      label: seed.seedName,
                                    }))}
                                    disabled
                                    value={"SDR-RI6"}
                                    onChange={(v) => {
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byPlot: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byPlot ?? {}),
                                          [p.id]: {
                                            ...buf,
                                            seedCode: v ?? "",
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Mã cây"
                                    placeholder="T001"
                                    radius={4}
                                    value={buf.code || ""}
                                    onChange={(e) => {
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byPlot: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byPlot ?? {}),
                                          [p.id]: {
                                            ...buf,
                                            code: e.currentTarget.value,
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Latitude"
                                    placeholder="10.762622"
                                    radius={4}
                                    value={buf.lat ?? ""}
                                    onChange={(e) => {
                                      const v = e.currentTarget.value;
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byPlot: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byPlot ?? {}),
                                          [p.id]: {
                                            ...buf,
                                            lat:
                                              v === "" ? undefined : Number(v),
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Longitude"
                                    placeholder="106.660172"
                                    radius={4}
                                    value={buf.lng ?? ""}
                                    onChange={(e) => {
                                      const v = e.currentTarget.value;
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byPlot: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byPlot ?? {}),
                                          [p.id]: {
                                            ...buf,
                                            lng:
                                              v === "" ? undefined : Number(v),
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <DatePickerInput
                                    radius={4}
                                    label="Thời gian trồng"
                                    placeholder="Chọn ngày"
                                    locale="vi"
                                    clearable
                                    popoverProps={{ withinPortal: true }}
                                    value={buf.plantedAt ?? null}
                                    onChange={(d) => {
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byPlot: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byPlot ?? {}),
                                          [p.id]: {
                                            ...buf,
                                            plantedAt: d ?? null,
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                </Group>
                              </Stack>
                              {/* Map + list điểm đã thêm */}
                              <Stack flex={1} mt="md" gap="xs">
                                <MapContainer
                                  center={[
                                    points[0]?.lat ?? 10.762622,
                                    points[0]?.lng ?? 106.660172,
                                  ]}
                                  zoom={16}
                                  style={{
                                    height: 260,
                                    width: "100%",
                                    borderRadius: 8,
                                  }}
                                  attributionControl={false}
                                >
                                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                  {/* Nếu bạn có polygon của lô, render Polygon ở đây */}
                                  {points.map((pt, i) =>
                                    pt.lat && pt.lng ? (
                                      <Marker
                                        key={i}
                                        position={[pt.lat, pt.lng]}
                                      />
                                    ) : null
                                  )}
                                </MapContainer>

                                {points.length > 0 && (
                                  <Stack gap={4}>
                                    {points.map((pt, i) => (
                                      <Group key={i} justify="space-between">
                                        <Text fz="sm">
                                          <b>{pt.code || `Cây ${i + 1}`}</b> —{" "}
                                          {pt.lat}, {pt.lng} •{" "}
                                          {pt.plantedAt
                                            ? new Date(
                                                pt.plantedAt
                                              ).toLocaleDateString("vi-VN")
                                            : "—"}
                                        </Text>
                                      </Group>
                                    ))}
                                  </Stack>
                                )}
                              </Stack>
                            </Group>
                          </Card>
                        </Accordion.Panel>
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
              )}
              {form.values.allocation.type === "plot" && type === "area" && (
                <Accordion variant="contained" multiple radius={4}>
                  {form.values.allocation.selectedAreas.map((a) => {
                    const points = form.values.gps.byArea?.[a.id] || [];
                    const buf =
                      form.values.gps.inputBuffer?.byArea?.[a.id] ??
                      ({
                        code: "",
                        lat: undefined,
                        lng: undefined,
                        plantedAt: null,
                      } as TreePoint);

                    return (
                      <Accordion.Item key={a.id} value={a.id}>
                        <Accordion.Control>
                          <Group justify="space-between">
                            <Text fw={600}>
                              {a.name}{" "}
                              <Text span c="dimmed">
                                ({a.id})
                              </Text>
                            </Text>
                            <Text c="dimmed" fz="sm">
                              {a.areaM2} m²
                            </Text>
                          </Group>
                        </Accordion.Control>

                        <Accordion.Panel>
                          <Card withBorder radius="sm" shadow="xs" p="md">
                            <Group align="flex-start">
                              {/* Input form for new point */}
                              <Stack gap="xs" flex={2}>
                                <Group align="flex-end">
                                  <Select
                                    searchable
                                    clearable
                                    label="Hạt giống"
                                    placeholder="Chọn hạt giống"
                                    radius={4}
                                    data={a.seeds.map((seed) => ({
                                      value: seed.code,
                                      label: seed.seedName,
                                    }))}
                                    disabled
                                    value={"SDR-RI6"}
                                    onChange={(v) => {
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byPlot: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byPlot ?? {}),
                                          [a.id]: {
                                            ...buf,
                                            seedCode: v ?? "",
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Mã cây"
                                    placeholder="T001"
                                    radius={4}
                                    value={buf.code || ""}
                                    onChange={(e) => {
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byArea: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byArea ?? {}),
                                          [a.id]: {
                                            ...buf,
                                            code: e.currentTarget.value,
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Latitude"
                                    placeholder="10.762622"
                                    radius={4}
                                    value={buf.lat ?? ""}
                                    onChange={(e) => {
                                      const v = e.currentTarget.value;
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byArea: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byArea ?? {}),
                                          [a.id]: {
                                            ...buf,
                                            lat:
                                              v === "" ? undefined : Number(v),
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Longitude"
                                    placeholder="106.660172"
                                    radius={4}
                                    value={buf.lng ?? ""}
                                    onChange={(e) => {
                                      const v = e.currentTarget.value;
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byArea: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byArea ?? {}),
                                          [a.id]: {
                                            ...buf,
                                            lng:
                                              v === "" ? undefined : Number(v),
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <DatePickerInput
                                    radius={4}
                                    label="Thời gian trồng"
                                    placeholder="Chọn ngày"
                                    locale="vi"
                                    clearable
                                    popoverProps={{ withinPortal: true }}
                                    value={buf.plantedAt ?? null}
                                    onChange={(d) => {
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byArea: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byArea ?? {}),
                                          [a.id]: {
                                            ...buf,
                                            plantedAt: d ?? null,
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                </Group>
                              </Stack>

                              {/* Map + existing points */}
                              <Stack flex={1} mt="md" gap="xs">
                                <MapContainer
                                  center={[
                                    points[0]?.lat ?? 10.762622,
                                    points[0]?.lng ?? 106.660172,
                                  ]}
                                  zoom={16}
                                  style={{
                                    height: 260,
                                    width: "100%",
                                    borderRadius: 8,
                                  }}
                                  attributionControl={false}
                                >
                                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                  {points.map((pt, i) =>
                                    pt.lat && pt.lng ? (
                                      <Marker
                                        key={i}
                                        position={[pt.lat, pt.lng]}
                                      />
                                    ) : null
                                  )}
                                </MapContainer>

                                {points.length > 0 && (
                                  <Stack gap={4}>
                                    {points.map((pt, i) => (
                                      <Group key={i} justify="space-between">
                                        <Text fz="sm">
                                          <b>{pt.code || `Cây ${i + 1}`}</b> —{" "}
                                          {pt.lat}, {pt.lng} •{" "}
                                          {pt.plantedAt
                                            ? new Date(
                                                pt.plantedAt
                                              ).toLocaleDateString("vi-VN")
                                            : "—"}
                                        </Text>
                                      </Group>
                                    ))}
                                  </Stack>
                                )}
                              </Stack>
                            </Group>
                          </Card>
                        </Accordion.Panel>
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
              )}

              {form.values.allocation.type === "plot" && type === "region" && (
                <Accordion variant="contained" multiple radius={4}>
                  {form.values.allocation.selectedRegions.map((r) => {
                    const points = form.values.gps.byRegion?.[r.id] || [];
                    const buf =
                      form.values.gps.inputBuffer?.byRegion?.[r.id] ??
                      ({
                        code: "",
                        lat: undefined,
                        lng: undefined,
                        plantedAt: null,
                      } as TreePoint);

                    return (
                      <Accordion.Item key={r.id} value={r.id}>
                        <Accordion.Control>
                          <Group justify="space-between">
                            <Text fw={600}>
                              {r.name}{" "}
                              <Text span c="dimmed">
                                ({r.id})
                              </Text>
                            </Text>
                            <Text c="dimmed" fz="sm">
                              {r.areaM2} m²
                            </Text>
                          </Group>
                        </Accordion.Control>

                        <Accordion.Panel>
                          <Card withBorder radius="sm" shadow="xs" p="md">
                            <Group align="flex-start">
                              {/* Input form for new point */}
                              <Stack gap="xs" flex={2}>
                                <Group align="flex-end">
                                  <Select
                                    searchable
                                    clearable
                                    label="Hạt giống"
                                    placeholder="Chọn hạt giống"
                                    radius={4}
                                    data={r.seeds.map((seed) => ({
                                      value: seed.code,
                                      label: seed.seedName,
                                    }))}
                                    disabled
                                    value={"SDR-RI6"}
                                    onChange={(v) => {
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byPlot: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byPlot ?? {}),
                                          [p.id]: {
                                            ...buf,
                                            seedCode: v ?? "",
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Mã cây"
                                    placeholder="T001"
                                    radius={4}
                                    value={buf.code || ""}
                                    onChange={(e) => {
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byArea: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byArea ?? {}),
                                          [a.id]: {
                                            ...buf,
                                            code: e.currentTarget.value,
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Latitude"
                                    placeholder="10.762622"
                                    radius={4}
                                    value={buf.lat ?? ""}
                                    onChange={(e) => {
                                      const v = e.currentTarget.value;
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byArea: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byArea ?? {}),
                                          [a.id]: {
                                            ...buf,
                                            lat:
                                              v === "" ? undefined : Number(v),
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Longitude"
                                    placeholder="106.660172"
                                    radius={4}
                                    value={buf.lng ?? ""}
                                    onChange={(e) => {
                                      const v = e.currentTarget.value;
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byArea: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byArea ?? {}),
                                          [a.id]: {
                                            ...buf,
                                            lng:
                                              v === "" ? undefined : Number(v),
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <DatePickerInput
                                    radius={4}
                                    label="Thời gian trồng"
                                    placeholder="Chọn ngày"
                                    locale="vi"
                                    clearable
                                    popoverProps={{ withinPortal: true }}
                                    value={buf.plantedAt ?? null}
                                    onChange={(d) => {
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byArea: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byArea ?? {}),
                                          [a.id]: {
                                            ...buf,
                                            plantedAt: d ?? null,
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                </Group>
                              </Stack>

                              {/* Map + existing points */}
                              <Stack flex={1} mt="md" gap="xs">
                                <MapContainer
                                  center={[
                                    points[0]?.lat ?? 10.762622,
                                    points[0]?.lng ?? 106.660172,
                                  ]}
                                  zoom={16}
                                  style={{
                                    height: 260,
                                    width: "100%",
                                    borderRadius: 8,
                                  }}
                                  attributionControl={false}
                                >
                                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                  {points.map((pt, i) =>
                                    pt.lat && pt.lng ? (
                                      <Marker
                                        key={i}
                                        position={[pt.lat, pt.lng]}
                                      />
                                    ) : null
                                  )}
                                </MapContainer>

                                {points.length > 0 && (
                                  <Stack gap={4}>
                                    {points.map((pt, i) => (
                                      <Group key={i} justify="space-between">
                                        <Text fz="sm">
                                          <b>{pt.code || `Cây ${i + 1}`}</b> —{" "}
                                          {pt.lat}, {pt.lng} •{" "}
                                          {pt.plantedAt
                                            ? new Date(
                                                pt.plantedAt
                                              ).toLocaleDateString("vi-VN")
                                            : "—"}
                                        </Text>
                                        <ActionIcon
                                          size="xs"
                                          variant="subtle"
                                          color="red"
                                          onClick={() => {
                                            const next = [...points];
                                            next.splice(i, 1);
                                            form.setFieldValue(
                                              `gps.byArea.${a.id}`,
                                              next
                                            );
                                          }}
                                        >
                                          <IconTrash size={16} />
                                        </ActionIcon>
                                      </Group>
                                    ))}
                                  </Stack>
                                )}
                              </Stack>
                            </Group>
                          </Card>
                        </Accordion.Panel>
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
              )}

              {/* ====== THEO HÀNG ====== */}
              {form.values.allocation.type === "row" && (
                <Accordion variant="contained" multiple radius={4}>
                  {form.values.allocation.rows.map((r, idx) => {
                    const rowKey = r.id; // dùng id duy nhất của hàng
                    const points = form.values.gps.byRow[rowKey] || [];
                    const buf =
                      form.values.gps.inputBuffer?.byRow?.[rowKey] ??
                      ({
                        code: "",
                        lat: undefined,
                        lng: undefined,
                        plantedAt: null,
                      } as TreePoint);

                    return (
                      <Accordion.Item key={rowKey} value={rowKey}>
                        <Accordion.Control>
                          <Text fw={600}>{r.rowName || `Hàng ${idx + 1}`}</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Card
                            withBorder
                            radius="sm"
                            shadow="xs"
                            p="md"
                            style={{ position: "relative", zIndex: 1 }}
                          >
                            <Group gap={"xs"} align="flex-start">
                              <Stack flex={2} gap={"xs"}>
                                <Group align="flex-end">
                                  <Select
                                    searchable
                                    clearable
                                    label="Hạt giống"
                                    placeholder="Chọn hạt giống"
                                    radius={4}
                                    value={"SDR-RI6"}
                                    disabled
                                    data={samplePlots[0].seeds.map((seed) => ({
                                      value: seed.code,
                                      label: seed.seedName,
                                    }))}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Mã cây"
                                    placeholder="R1-001"
                                    radius={4}
                                    value={buf.code || ""}
                                    onChange={(e) => {
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byRow: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byRow ?? {}),
                                          [rowKey]: {
                                            ...buf,
                                            code: e.currentTarget.value,
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Latitude"
                                    placeholder="10.762622"
                                    radius={4}
                                    value={buf.lat ?? ""}
                                    onChange={(e) => {
                                      const v = e.currentTarget.value;
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byRow: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byRow ?? {}),
                                          [rowKey]: {
                                            ...buf,
                                            lat:
                                              v === "" ? undefined : Number(v),
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Longitude"
                                    placeholder="106.660172"
                                    radius={4}
                                    value={buf.lng ?? ""}
                                    onChange={(e) => {
                                      const v = e.currentTarget.value;
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byRow: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byRow ?? {}),
                                          [rowKey]: {
                                            ...buf,
                                            lng:
                                              v === "" ? undefined : Number(v),
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <DatePickerInput
                                    radius={4}
                                    label="Thời gian trồng"
                                    placeholder="Chọn ngày"
                                    locale="vi"
                                    clearable
                                    popoverProps={{ withinPortal: true }}
                                    value={buf.plantedAt ?? null}
                                    onChange={(d) => {
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byRow: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byRow ?? {}),
                                          [rowKey]: {
                                            ...buf,
                                            plantedAt: d ?? null,
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  {/* <Button
                                variant="light"
                                leftSection={<IconPlus size={16} />}
                                radius={4}
                                onClick={() => {
                                  if (!buf.lat || !buf.lng) return;
                                  const next = [...points, { ...buf }];
                                  form.setFieldValue(
                                    `gps.byRow.${rowKey}`,
                                    next
                                  );
                                  // clear buffer
                                  const allBuf = {
                                    ...(form.values.gps.inputBuffer?.byRow ??
                                      {}),
                                  };
                                  delete allBuf[rowKey];
                                  form.setFieldValue("gps.inputBuffer", {
                                    ...form.values.gps.inputBuffer,
                                    byRow: allBuf,
                                  });
                                }}
                              >
                                Thêm
                              </Button> */}
                                </Group>
                                <Group align="flex-end">
                                  <Select
                                    searchable
                                    clearable
                                    label="Hạt giống"
                                    placeholder="Chọn hạt giống"
                                    radius={4}
                                    value={"SDR-RI6"}
                                    disabled
                                    data={samplePlots[0].seeds.map((seed) => ({
                                      value: seed.code,
                                      label: seed.seedName,
                                    }))}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Mã cây"
                                    placeholder="R1-001"
                                    radius={4}
                                    value={buf.code || ""}
                                    onChange={(e) => {
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byRow: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byRow ?? {}),
                                          [rowKey]: {
                                            ...buf,
                                            code: e.currentTarget.value,
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Latitude"
                                    placeholder="10.762622"
                                    radius={4}
                                    value={buf.lat ?? ""}
                                    onChange={(e) => {
                                      const v = e.currentTarget.value;
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byRow: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byRow ?? {}),
                                          [rowKey]: {
                                            ...buf,
                                            lat:
                                              v === "" ? undefined : Number(v),
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <TextInput
                                    label="Longitude"
                                    placeholder="106.660172"
                                    radius={4}
                                    value={buf.lng ?? ""}
                                    onChange={(e) => {
                                      const v = e.currentTarget.value;
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byRow: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byRow ?? {}),
                                          [rowKey]: {
                                            ...buf,
                                            lng:
                                              v === "" ? undefined : Number(v),
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  <DatePickerInput
                                    radius={4}
                                    label="Thời gian trồng"
                                    placeholder="Chọn ngày"
                                    locale="vi"
                                    clearable
                                    popoverProps={{ withinPortal: true }}
                                    value={buf.plantedAt ?? null}
                                    onChange={(d) => {
                                      form.setFieldValue("gps.inputBuffer", {
                                        ...form.values.gps.inputBuffer,
                                        byRow: {
                                          ...(form.values.gps.inputBuffer
                                            ?.byRow ?? {}),
                                          [rowKey]: {
                                            ...buf,
                                            plantedAt: d ?? null,
                                          },
                                        },
                                      });
                                    }}
                                    flex={1}
                                  />
                                  {/* <Button
                                variant="light"
                                leftSection={<IconPlus size={16} />}
                                radius={4}
                                onClick={() => {
                                  if (!buf.lat || !buf.lng) return;
                                  const next = [...points, { ...buf }];
                                  form.setFieldValue(
                                    `gps.byRow.${rowKey}`,
                                    next
                                  );
                                  // clear buffer
                                  const allBuf = {
                                    ...(form.values.gps.inputBuffer?.byRow ??
                                      {}),
                                  };
                                  delete allBuf[rowKey];
                                  form.setFieldValue("gps.inputBuffer", {
                                    ...form.values.gps.inputBuffer,
                                    byRow: allBuf,
                                  });
                                }}
                              >
                                Thêm
                              </Button> */}
                                </Group>
                              </Stack>

                              <Stack flex={1} gap="xs">
                                <MapContainer
                                  center={[
                                    points[0]?.lat ?? 10.762622,
                                    points[0]?.lng ?? 106.660172,
                                  ]}
                                  zoom={16}
                                  style={{
                                    height: 260,
                                    width: "100%",
                                    borderRadius: 8,
                                  }}
                                  attributionControl={false}
                                >
                                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                  {points.map((pt, i) =>
                                    pt.lat && pt.lng ? (
                                      <Marker
                                        key={i}
                                        position={[pt.lat, pt.lng]}
                                      />
                                    ) : null
                                  )}
                                </MapContainer>

                                {points.length > 0 && (
                                  <Stack gap={4}>
                                    {points.map((pt, i) => (
                                      <Group key={i} justify="space-between">
                                        <Text fz="sm">
                                          <b>{pt.code || `Cây ${i + 1}`}</b> —{" "}
                                          {pt.lat}, {pt.lng} •{" "}
                                          {pt.plantedAt
                                            ? new Date(
                                                pt.plantedAt
                                              ).toLocaleDateString("vi-VN")
                                            : "—"}
                                        </Text>
                                        <ActionIcon
                                          size="xs"
                                          variant="subtle"
                                          color="red"
                                          onClick={() => {
                                            const next = [...points];
                                            next.splice(i, 1);
                                            form.setFieldValue(
                                              `gps.byRow.${rowKey}`,
                                              next
                                            );
                                          }}
                                        >
                                          <IconTrash size={16} />
                                        </ActionIcon>
                                      </Group>
                                    ))}
                                  </Stack>
                                )}
                              </Stack>
                            </Group>
                          </Card>
                        </Accordion.Panel>
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
              )}

              <Group justify="space-between" mt="md">
                <Button variant="default" radius={4} onClick={prevStep}>
                  Quay lại
                </Button>
                <Button radius={4} onClick={nextStep}>
                  Tiếp theo
                </Button>
              </Group>
            </Stack>
          </Stepper.Step>
          <Stepper.Step label="Bước 4" description="Xác nhận">
            <ConfirmStep
              area="Vùng Tây Nguyên"
              zone="Khu A1"
              block="Lô 05"
              type={form.values.allocation.type as "plot" | "row"}
              row="Hàng 3"
              plantingDate="12/07/2025"
            />
            <Group justify="space-between" mt="md">
              <Button variant="default" onClick={prevStep} radius={4}>
                Quay lại
              </Button>
              <Button onClick={nextStep} radius={4}>
                Tiếp theo
              </Button>
            </Group>
          </Stepper.Step>
          <Stepper.Completed>
            <Stack align="center" justify="center" mt="xl">
              <Image
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPNbBpZeXnXfTuA6AWek-Kj8NYEVbYdG6ayi5bIWarDuryXDrILdKMTd597quLD0PBKM&usqp=CAU"
                }
                w={200}
                fit="cover"
              />
              <Text fz={"h2"} ta="center">
                Thêm cây canh tác mới thành công!
              </Text>
              <Text fz={"md"} ta="center" c="dimmed">
                Cây canh tác mới đã được thêm thành công. Vui lòng kiểm tra lại
                thông tin để đảm bảo tính chính xác.
              </Text>

              <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
                Xác nhận
              </Button>
            </Stack>
          </Stepper.Completed>
        </Stepper>
      </form>
      <Modal
        opened={openedTreeMap}
        onClose={() => setOpenTreeMap(false)}
        title={<Text fw={"600"}>Tạo bản đồ cây</Text>}
      >
        <Stack gap={"xs"}>
          <Group align="flex-end">
            <TextInput
              label="Latitude"
              value={lat}
              onChange={(e) => setLat(e.currentTarget.value)}
              placeholder="10.762622"
              radius={4}
              flex={1}
            />
            <TextInput
              label="Longitude"
              value={lng}
              onChange={(e) => setLng(e.currentTarget.value)}
              placeholder="106.660172"
              radius={4}
              flex={1}
            />
            <Button
              onClick={handleAddPoint}
              radius={4}
              leftSection={<IconPlus size={16} />}
            >
              Thêm
            </Button>
          </Group>
          {coords.length > 0 && (
            <Stack gap={"xs"}>
              <Text size="sm" c="dimmed">
                Danh sách tọa độ ({coords.length}):
              </Text>
              {coords.map(([lat, lng], i) => (
                <Group key={i} gap="xs">
                  <Text size="sm" w={"40%"}>
                    {i + 1}. {lat}, {lng}
                  </Text>
                  <ActionIcon
                    color="red"
                    variant="light"
                    radius={4}
                    onClick={() => handleRemove(i)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          )}
          Bản đồ Leaflet với polygon
          <MapContainer
            center={coords.length >= 1 ? coords[0] : [10.762622, 106.660172]}
            zoom={16}
            style={{ height: "300px", width: "100%", borderRadius: 8 }}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polygon positions={coords} color="green" />
          </MapContainer>
        </Stack>
      </Modal>
      <Modal
        opened={openedTreeList}
        onClose={() => setOpenedTreeList(false)}
        title={<Text fw={"600"}>Danh sách cây</Text>}
      >
        <Stack gap={"xs"}>
          <TextInput placeholder="Tìm kiếm theo mã cây..." radius={4} />

          <ScrollAreaAutosize>
            <Group wrap="nowrap" gap="md">
              {treeList.map((tree, index) => (
                <Card
                  key={index}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  w={300}
                  style={{
                    borderColor:
                      selectedTree === tree.seed ? "green" : undefined,
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                  }}
                  onClick={() => {
                    setSelectedTree(tree.seed);
                  }}
                >
                  <Card.Section>
                    <Image src={tree.img} height={160} alt={tree.variety} />
                  </Card.Section>

                  <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>{tree.variety}</Text>
                    <Badge color="green" variant="light">
                      {tree.type}
                    </Badge>
                  </Group>

                  <Text size="sm" c="dimmed">
                    Seed: {tree.seed}
                    <br />
                    Method: {tree.method}
                    <br />
                    Irrigation: {tree.irrigation}
                    <br />
                    Planted: {tree.plantedAt}
                    <br />
                    Region: {tree.region}
                    <br />
                    Area: {tree.area}
                    <br />
                    Plot: {tree.plot} - Row: {tree.row}
                  </Text>
                </Card>
              ))}
            </Group>
          </ScrollAreaAutosize>
        </Stack>
      </Modal>
    </Card>
  );
};

export default memo(AreaManagementTreeAddv2Page);
