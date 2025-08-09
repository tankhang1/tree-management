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
import { useState } from "react";
import { MapContainer, Marker, Polygon, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import ConfirmStep from "./components/ConfirmStep";
import RegionCardSelector from "../../Row/Add/components/RegionCards";
import { regionOptions } from "../../Block/Add";
import AreaCards from "../../Zone/Add/components/AreaCards";
import { areaOptions, plotOptions } from "../../Row/Add";
import PlotCardSelector from "../../Row/Add/components/PlotCards";
import { DatePickerInput } from "@mantine/dates";
import TreeDetailView from "../components/TreeView";
import dayjs from "dayjs";
import SeedCards from "../../Row/Add/components/SeedCards";
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

const uid = () => Math.random().toString(36).slice(2, 9);

type CropGroup = {
  cropName: string; // Ví dụ: "Cây sầu riêng Ri6"
  rows: TreeRow[];
};
const cropGroups: CropGroup[] = [
  {
    cropName: "Cây sầu riêng Ri6",
    rows: [
      {
        name: "Hàng 1",
        coords: [
          [10.762622, 106.660172],
          [10.7628, 106.6603],
        ],
      },
      {
        name: "Hàng 2",
        coords: [
          [10.7629, 106.660172],
          [10.763, 106.6603],
        ],
      },
    ],
  },
  {
    cropName: "Cây xoài cát",
    rows: [
      {
        name: "Hàng 1",
        coords: [
          [10.7632, 106.6605],
          [10.7633, 106.66065],
        ],
      },
    ],
  },
];
export const samplePlots = [
  {
    id: "LO-A1",
    code: "LO-A1",
    name: "Lô A1",
    mainCrop: "Sầu riêng",
    areaM2: 1500,
    rowsCount: 8,
    irrigation: "Tưới nhỏ giọt",
    cultivation: "Hữu cơ",
    terrainLabel: "DỐC NHẸ (48–56M)",
    treeCount: 50,
    seeds: [
      {
        code: "SDR-RI6",
        seedName: "Sầu riêng Ri6 - SR-RI6",
        cropName: "Sầu riêng",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_lo7BwRUzpkCiruaT48T5-8HZ8_7_sNxH0w&s",
        seedType: "Hạt giống",
      },
      {
        code: "SDR-RI6-2",
        seedName: "Sầu riêng Ri6 - SR-RI6-2",
        cropName: "Sầu riêng",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_lo7BwRUzpkCiruaT48T5-8HZ8_7_sNxH0w&s",
        seedType: "Hạt giống",
      },
    ],
  },
];
const treeList = [
  {
    type: "Trái cây",
    variety: "Xoài cát",
    img: "data:image/jpeg;base64,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",
    seed: "Xoài cát",
    method: "Hữu cơ",
    irrigation: "Tưới nhỏ giọt",
    plantedAt: "2024-03-15",
    region: "Miền Nam",
    area: "2ha",
    plot: "A1",
    row: "R5",
    coords: [[10.1234, 105.5678]],
  },
  {
    type: "Trái cây",
    variety: "Cam sành",
    img: "data:image/jpeg;base64,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",
    seed: "Cam sành",
    method: "Hữu cơ",
    irrigation: "Tưới nhỏ giọt",
    plantedAt: "2023-11-20",
    region: "Miền Trung",
    area: "1.5ha",
    plot: "B2",
    row: "R2",
    coords: [[11.5678, 107.2345]],
  },
];
// Danh sách hàng
export const sampleRows = [
  { id: "row-1", rowId: "H1", rowName: "Hàng 1", treeCount: 12 },
  { id: "row-1", rowId: "H1", rowName: "Hàng 4", treeCount: 12 },
  { id: "row-1", rowId: "H1", rowName: "Hàng 5", treeCount: 12 },
  { id: "row-2", rowId: "H2", rowName: "Hàng 2", treeCount: 15 },
  { id: "row-3", rowId: "H3", rowName: "Hàng 3", treeCount: 10 },
];
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
      { code: "B2-003", lat: 10.7631, lng: 106.6611, plantedAt: null }, // chưa nhập ngày
    ],
  },
  byRow: {}, // nếu đang phân bổ theo hàng thì sẽ chứa dữ liệu ở đây
  inputBuffer: {
    byPlot: {
      "LO-A1": { code: "A1-NEW", lat: 10.7628, lng: 106.6603, plantedAt: null },
    },
    byRow: {},
  },
};
const sampleGpsDataRow = {
  byPlot: {},
  byRow: {
    "row-1": [
      {
        code: "R1-001",
        lat: 10.764,
        lng: 106.662,
        plantedAt: new Date("2025-08-05"),
      },
      { code: "R1-002", lat: 10.76405, lng: 106.66205, plantedAt: null },
    ],
    "row-2": [
      {
        code: "R2-001",
        lat: 10.765,
        lng: 106.663,
        plantedAt: new Date("2025-08-06"),
      },
    ],
  },
  inputBuffer: {
    byPlot: {},
    byRow: {
      "row-1": { code: "R1-NEW", lat: 10.7641, lng: 106.6621, plantedAt: null },
    },
  },
};
const AreaManagementTreeAddv2Page = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>(
    cropGroups[0].cropName
  );
  const navigate = useNavigate();
  const [openedTreeList, setOpenedTreeList] = useState(false);
  const [active, setActive] = useState(0);
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [coords, setCoords] = useState<LatLng[]>([]);
  const [selectedTree, setSelectedTree] = useState<string>("");
  const [openedTreeMap, setOpenTreeMap] = useState(false);
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
                {/* Thông tin lô (read-only) */}
                <Title order={6}>Thông tin các lô đã chọn</Title>
                <Group align="stretch" wrap="wrap">
                  <Stack gap="xs">
                    {form.values.allocation.selectedPlots.map((p) => (
                      <Card
                        key={p.id}
                        withBorder
                        radius={4}
                        shadow="sm"
                        p="md"
                        w={360}
                        h={200}
                      >
                        <Stack gap={6}>
                          <Group justify="space-between">
                            <Text fw={700}>{p.name}</Text>
                            <Badge variant="filled" color="gray" radius="sm">
                              {p.code}
                            </Badge>
                          </Group>
                          <Group gap="xs">
                            <Text fw={700}>Cây trồng chính:</Text>
                            <Text>{p.mainCrop}</Text>
                          </Group>
                          <Group gap="xl">
                            <Group gap="xs">
                              <Text fw={700}>Diện tích:</Text>
                              <Text>{p.areaM2.toLocaleString("vi-VN")} m²</Text>
                            </Group>
                            <Group gap="xs">
                              <Text fw={700}>Số hàng:</Text>
                              <Text>{p.rowsCount}</Text>
                            </Group>
                          </Group>
                          <Group gap="xl">
                            <Group gap="xs">
                              <Text fw={700}>Tưới:</Text>
                              <Text>{p.irrigation}</Text>
                            </Group>
                            <Group gap="xs">
                              <Text fw={700}>Canh tác:</Text>
                              <Text>{p.cultivation}</Text>
                            </Group>
                          </Group>
                          <Group gap="xs">
                            <Text fw={700}>Địa hình:</Text>
                            <Badge variant="light" color="green" radius="xl">
                              {p.terrainLabel}
                            </Badge>
                          </Group>
                        </Stack>
                      </Card>
                    ))}
                    <Radio.Group
                      value={form.values.allocation.type}
                      onChange={(v: string) =>
                        form.setFieldValue("allocation.type", v)
                      }
                    >
                      <Stack gap="xs">
                        <Radio value="plot" label="Phân bổ theo lô" />
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
                          Danh sách cây trồng theo lô
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
                        {form.values.allocation.selectedPlots
                          .reduce((s, pl) => s + (Number(pl.treeCount) || 0), 0)
                          .toLocaleString("vi-VN")}
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
                              <Button
                                variant="light"
                                color="red"
                                radius={4}
                                mt="md"
                                w={100}
                              >
                                Xóa
                              </Button>
                            </Group>
                            <Group align="flex-end" gap={"xs"}>
                              <Select
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
                              <Button
                                w={100}
                                variant="outline"
                                radius={4}
                                mt="md"
                              >
                                Thêm mới
                              </Button>
                            </Group>
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
              <Title order={5}>
                Định vị GPS theo{" "}
                {form.values.allocation.type === "plot" ? "Lô" : "Hàng"}
              </Title>

              {/* ====== THEO LÔ ====== */}
              {form.values.allocation.type === "plot" && (
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
                              {p.mainCrop} • {p.areaM2.toLocaleString("vi-VN")}{" "}
                              m² • {p.rowsCount} hàng
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
                            {/* Form nhập 1 điểm rồi Thêm */}
                            <Group align="flex-end">
                              <Select
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
                                      ...(form.values.gps.inputBuffer?.byPlot ??
                                        {}),
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
                                      ...(form.values.gps.inputBuffer?.byPlot ??
                                        {}),
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
                                      ...(form.values.gps.inputBuffer?.byPlot ??
                                        {}),
                                      [p.id]: {
                                        ...buf,
                                        lat: v === "" ? undefined : Number(v),
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
                                      ...(form.values.gps.inputBuffer?.byPlot ??
                                        {}),
                                      [p.id]: {
                                        ...buf,
                                        lng: v === "" ? undefined : Number(v),
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
                                      ...(form.values.gps.inputBuffer?.byPlot ??
                                        {}),
                                      [p.id]: { ...buf, plantedAt: d ?? null },
                                    },
                                  });
                                }}
                                flex={1}
                              />
                            </Group>

                            {/* Map + list điểm đã thêm */}
                            <Stack mt="md" gap="xs">
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
                                      <Button
                                        size="xs"
                                        variant="subtle"
                                        color="red"
                                        onClick={() => {
                                          const next = [...points];
                                          next.splice(i, 1);
                                          form.setFieldValue(
                                            `gps.byPlot.${p.id}`,
                                            next
                                          );
                                        }}
                                      >
                                        Xóa
                                      </Button>
                                    </Group>
                                  ))}
                                </Stack>
                              )}
                            </Stack>
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
                            <Group align="flex-end">
                              <Select
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
                                      ...(form.values.gps.inputBuffer?.byRow ??
                                        {}),
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
                                      ...(form.values.gps.inputBuffer?.byRow ??
                                        {}),
                                      [rowKey]: {
                                        ...buf,
                                        lat: v === "" ? undefined : Number(v),
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
                                      ...(form.values.gps.inputBuffer?.byRow ??
                                        {}),
                                      [rowKey]: {
                                        ...buf,
                                        lng: v === "" ? undefined : Number(v),
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
                                      ...(form.values.gps.inputBuffer?.byRow ??
                                        {}),
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

                            <Stack mt="md" gap="xs">
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
                                      <Button
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
                                        Xóa
                                      </Button>
                                    </Group>
                                  ))}
                                </Stack>
                              )}
                            </Stack>
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
              type={form.values.allocation.type as string}
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

export default AreaManagementTreeAddv2Page;
