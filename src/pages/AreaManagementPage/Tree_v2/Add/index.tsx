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
  },
  {
    id: "LO-B2",
    code: "LO-B2",
    name: "Lô B2",
    mainCrop: "Mãng cầu",
    areaM2: 2200,
    rowsCount: 10,
    irrigation: "Tưới phun mưa",
    cultivation: "Truyền thống",
    terrainLabel: "DỐC TRUNG BÌNH (50–60M)",
    treeCount: 65,
  },
];

// Danh sách hàng
export const sampleRows = [
  { id: "row-1", rowId: "H1", rowName: "Hàng 1", treeCount: 12 },
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
  const [active, setActive] = useState(0);
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [coords, setCoords] = useState<LatLng[]>([]);
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

              {/* ====== THEO LÔ ====== */}
              {form.values.allocation.type === "plot" && (
                <Stack>
                  {/* Thông tin lô (read-only) */}
                  <Title order={6}>Thông tin các lô đã chọn</Title>
                  <ScrollAreaAutosize h={240}>
                    <Group align="stretch" wrap="wrap">
                      {form.values.allocation.selectedPlots.map((p) => (
                        <Card
                          key={p.id}
                          withBorder
                          radius={12}
                          shadow="sm"
                          p="md"
                          w={360}
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
                                <Text>
                                  {p.areaM2.toLocaleString("vi-VN")} m²
                                </Text>
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
                    </Group>
                  </ScrollAreaAutosize>

                  {/* Nhập số cây theo lô */}
                  <Divider
                    my="sm"
                    label="Nhập số cây theo lô"
                    labelPosition="center"
                  />
                  <Stack gap="xs">
                    {form.values.allocation.selectedPlots.map((p, idx) => (
                      <Group
                        key={p.id}
                        justify="space-between"
                        align="flex-end"
                      >
                        <Stack gap={2} w="50%">
                          <Text fw={600}>
                            {p.name} ({p.code})
                          </Text>
                          <Text c="dimmed" fz="sm">
                            {p.mainCrop} • {p.areaM2.toLocaleString("vi-VN")} m²
                            • {p.rowsCount} hàng
                          </Text>
                        </Stack>
                        <NumberInput
                          label="Số cây"
                          min={0}
                          radius={4}
                          value={p.treeCount ?? 0}
                          onChange={(val) => {
                            const v = Number(val) || 0;
                            const next = [
                              ...form.values.allocation.selectedPlots,
                            ];
                            next[idx] = { ...p, treeCount: v };
                            form.setFieldValue(
                              "allocation.selectedPlots",
                              next
                            );
                          }}
                          w={220}
                        />
                      </Group>
                    ))}
                  </Stack>

                  {/* Tổng theo lô */}
                  <Group justify="space-between" mt="sm">
                    <Text fw={500}>Tổng số cây</Text>
                    <Text fw={700} c="green">
                      {form.values.allocation.selectedPlots
                        .reduce((s, pl) => s + (Number(pl.treeCount) || 0), 0)
                        .toLocaleString("vi-VN")}
                    </Text>
                  </Group>
                </Stack>
              )}

              {/* ====== THEO HÀNG ====== */}
              {form.values.allocation.type === "row" && (
                <Stack>
                  <Group justify="space-between" align="center">
                    <Title order={6}>Danh sách hàng</Title>
                    <Button
                      size="xs"
                      variant="light"
                      radius={4}
                      onClick={() =>
                        form.setFieldValue("allocation.rows", [
                          ...form.values.allocation.rows,
                          {
                            id:
                              crypto.randomUUID?.() ??
                              Math.random().toString(36).slice(2, 9),
                            rowId: undefined,
                            rowName: "",
                            treeCount: 0,
                          },
                        ])
                      }
                    >
                      Thêm hàng
                    </Button>
                  </Group>

                  <ScrollAreaAutosize h={320}>
                    <Group align="stretch" wrap="wrap">
                      {form.values.allocation.rows.map((r, idx) => (
                        <Card key={r.id} withBorder radius={12} p="md" w={300}>
                          <Stack gap="xs">
                            <Group justify="space-between" align="center">
                              <Text fw={700}>
                                {r.rowName || `Hàng ${idx + 1}`}
                              </Text>
                              <ActionIcon
                                variant="light"
                                color="red"
                                radius={4}
                                size="sm"
                                onClick={() => {
                                  const next = [...form.values.allocation.rows];
                                  next.splice(idx, 1);
                                  form.setFieldValue("allocation.rows", next);
                                }}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Group>

                            {/* Tuỳ bạn đang chọn hàng từ đâu: Select hay TextInput.
                      Ở đây mình dùng TextInput để linh hoạt */}
                            <TextInput
                              label="Tên hàng"
                              placeholder="VD: Hàng 1"
                              radius={4}
                              value={r.rowName || ""}
                              onChange={(e) => {
                                const next = [...form.values.allocation.rows];
                                next[idx] = {
                                  ...r,
                                  rowName: e.currentTarget.value,
                                };
                                form.setFieldValue("allocation.rows", next);
                              }}
                            />

                            <NumberInput
                              label="Số cây"
                              min={0}
                              radius={4}
                              value={r.treeCount}
                              onChange={(val) => {
                                const v = Number(val) || 0;
                                const next = [...form.values.allocation.rows];
                                next[idx] = { ...r, treeCount: v };
                                form.setFieldValue("allocation.rows", next);
                              }}
                            />
                          </Stack>
                        </Card>
                      ))}
                    </Group>
                  </ScrollAreaAutosize>

                  {/* Tổng theo hàng */}
                  <Group justify="space-between" mt="sm">
                    <Text fw={500}>Tổng số cây</Text>
                    <Text fw={700} c="green">
                      {form.values.allocation.rows
                        .reduce((s, row) => s + (Number(row.treeCount) || 0), 0)
                        .toLocaleString("vi-VN")}
                    </Text>
                  </Group>
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
                              <Button
                                variant="light"
                                leftSection={<IconPlus size={16} />}
                                radius={4}
                                onClick={() => {
                                  if (!buf.lat || !buf.lng) return; // optional: validate
                                  const next = [...points, { ...buf }];
                                  form.setFieldValue(
                                    `gps.byPlot.${p.id}`,
                                    next
                                  );
                                  // clear buffer
                                  const allBuf = {
                                    ...(form.values.gps.inputBuffer?.byPlot ??
                                      {}),
                                  };
                                  delete allBuf[p.id];
                                  form.setFieldValue("gps.inputBuffer", {
                                    ...form.values.gps.inputBuffer,
                                    byPlot: allBuf,
                                  });
                                }}
                              >
                                Thêm
                              </Button>
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
                              <Button
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
                              </Button>
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
    </Card>
  );
};

export default AreaManagementTreeAddv2Page;
