import {
  Stack,
  Card,
  Group,
  Text,
  Title,
  Divider,
  Badge,
  Button,
  TextInput,
  Accordion,
  Select,
  ActionIcon,
  SegmentedControl,
  Image,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useForm } from "@mantine/form";
import {
  sampleGpsData,
  samplePlots,
  sampleRows,
  selectedAreas,
  selectedRegions,
} from "..";

/** Types khớp với các bước trước */
type TreePoint = {
  code?: string;
  lat?: number;
  lng?: number;
  plantedAt?: Date | null;
};
type PlotInfo = {
  id: string;
  code: string;
  name: string;
  mainCrop: string;
  areaM2: number;
  rowsCount: number;
  irrigation: string;
  cultivation: string;
  terrainLabel: string;
  treeCount?: number;
};
type RowAlloc = {
  id: string;
  rowId?: string;
  rowName?: string;
  treeCount: number;
};

type FormValues = {
  allocation: {
    type: "plot" | "row";
    selectedPlots: PlotInfo[];
    rows: RowAlloc[];
    selectedRegions: [];
    selectedAreas: [];
  };
  gps: {
    byPlot: Record<string, TreePoint[]>;
    byRow: Record<string, TreePoint[]>;
    inputBuffer: {
      byPlot: Record<string, TreePoint>;
      byRow: Record<string, TreePoint>;
    };
  };
};
const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("vi-VN") : "—";

type ConfirmPlantingProps = {
  area: string;
  zone: string;
  block: string;
  row?: string;
  type: "plot" | "row";
  plantingDate?: string;
};
const plot = {
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
};
const ConfirmStep = (props: ConfirmPlantingProps) => {
  const [type, setType] = useState<"region" | "area" | "plot">("region");
  const form = useForm<FormValues>({
    initialValues: {
      allocation: {
        type: props.type, // hoặc "row"
        selectedPlots: samplePlots,
        rows: sampleRows,
        selectedRegions: selectedRegions,
        selectedAreas: selectedAreas,
      },
      gps: sampleGpsData,
    },
  });

  // center map mặc định nếu chưa có điểm

  return (
    <Stack gap="xl" mt="md">
      <SegmentedControl
        value={type}
        onChange={(value) => setType(value as "region" | "area" | "plot")}
        data={[
          { label: "Theo vùng", value: "region" },
          { label: "Theo khu vực", value: "area" },
          { label: "Theo lô", value: "plot" },
        ]}
        fullWidth
        radius={4}
        mb="md"
      />
      <Title order={3}>Xác nhận thông tin trồng cây</Title>

      {/* Thông tin khu vực */}
      <Card withBorder radius="md" shadow="sm" p="md">
        <Stack gap="sm">
          {/* Header */}
          <Group justify="space-between">
            <Text fw={700} size="lg">
              {type === "plot"
                ? `Lô A01`
                : type === "area"
                ? `Khu vực Tây nguyên`
                : `Vùng trồng Tây nguyên`}
            </Text>
            <Badge color="gray" variant="filled">
              {plot.code}
            </Badge>
          </Group>

          {/* Thông tin chính */}
          <Group gap="xs">
            <Text fw={500}>Cây trồng chính:</Text>
            <Text>{plot.mainCrop}</Text>
          </Group>

          <Group gap="xl">
            <Group gap="xs">
              <Text fw={500}>Diện tích:</Text>
              <Text>{plot.areaM2.toLocaleString("vi-VN")} m²</Text>
            </Group>
            <Group gap="xs">
              <Text fw={500}>Số hàng:</Text>
              <Text>{plot.rowsCount}</Text>
            </Group>
          </Group>

          <Group gap="xl">
            <Group gap="xs">
              <Text fw={500}>Tưới:</Text>
              <Text>{plot.irrigation}</Text>
            </Group>
            <Group gap="xs">
              <Text fw={500}>Canh tác:</Text>
              <Text>{plot.cultivation}</Text>
            </Group>
          </Group>

          <Group gap="xs">
            <Text fw={500}>Địa hình:</Text>
            <Badge variant="light" color="green" radius="xl">
              {plot.terrainLabel}
            </Badge>
          </Group>

          <Group gap="xs">
            <Text fw={500}>Số cây:</Text>
            <Text>{plot.treeCount}</Text>
          </Group>

          {/* Giống cây */}
          <Stack gap="xs">
            <Text fw={600}>Giống cây:</Text>
            <Group>
              {plot.seeds.map((seed) => (
                <Card key={seed.code} withBorder radius="sm" shadow="xs" p={0}>
                  <Group>
                    <Image
                      src={seed.image}
                      alt={seed.seedName}
                      w={"40%"}
                      height={100}
                      radius="sm"
                    />
                    <Stack gap={"xs"} p="xs" flex={1}>
                      <Text fw={500}>{seed.seedName}</Text>
                      <Text size="sm" c="dimmed">
                        {seed.cropName} - {seed.seedType}
                      </Text>
                    </Stack>
                  </Group>
                </Card>
              ))}
            </Group>
          </Stack>
        </Stack>
      </Card>

      <Divider
        label={`Định vị GPS theo ${
          form.values.allocation.type === "plot" ? "Lô" : "Hàng"
        }`}
        labelPosition="center"
      />

      {/* ========= THEO LÔ ========= */}
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
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          {/* Nếu bạn có polygon của lô, render Polygon ở đây */}
                          {points.map((pt, i) =>
                            pt.lat && pt.lng ? (
                              <Marker key={i} position={[pt.lat, pt.lng]} />
                            ) : null
                          )}
                        </MapContainer>

                        {points.length > 0 && (
                          <Stack gap={4}>
                            {points.map((pt, i) => (
                              <Group key={i} justify="space-between">
                                <Text fz="sm">
                                  <b>{pt.code || `Cây ${i + 1}`}</b> — {pt.lat},{" "}
                                  {pt.lng} •{" "}
                                  {pt.plantedAt
                                    ? new Date(pt.plantedAt).toLocaleDateString(
                                        "vi-VN"
                                      )
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
                                      `gps.byPlot.${p.id}`,
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
                                  ...(form.values.gps.inputBuffer?.byPlot ??
                                    {}),
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
                                  ...(form.values.gps.inputBuffer?.byArea ??
                                    {}),
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
                                  ...(form.values.gps.inputBuffer?.byArea ??
                                    {}),
                                  [a.id]: {
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
                                byArea: {
                                  ...(form.values.gps.inputBuffer?.byArea ??
                                    {}),
                                  [a.id]: {
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
                                byArea: {
                                  ...(form.values.gps.inputBuffer?.byArea ??
                                    {}),
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
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          {points.map((pt, i) =>
                            pt.lat && pt.lng ? (
                              <Marker key={i} position={[pt.lat, pt.lng]} />
                            ) : null
                          )}
                        </MapContainer>

                        {points.length > 0 && (
                          <Stack gap={4}>
                            {points.map((pt, i) => (
                              <Group key={i} justify="space-between">
                                <Text fz="sm">
                                  <b>{pt.code || `Cây ${i + 1}`}</b> — {pt.lat},{" "}
                                  {pt.lng} •{" "}
                                  {pt.plantedAt
                                    ? new Date(pt.plantedAt).toLocaleDateString(
                                        "vi-VN"
                                      )
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
                                  ...(form.values.gps.inputBuffer?.byPlot ??
                                    {}),
                                  [r.id]: {
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
                                  ...(form.values.gps.inputBuffer?.byArea ??
                                    {}),
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
                                  ...(form.values.gps.inputBuffer?.byArea ??
                                    {}),
                                  [a.id]: {
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
                                byArea: {
                                  ...(form.values.gps.inputBuffer?.byArea ??
                                    {}),
                                  [a.id]: {
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
                                byArea: {
                                  ...(form.values.gps.inputBuffer?.byArea ??
                                    {}),
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
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          {points.map((pt, i) =>
                            pt.lat && pt.lng ? (
                              <Marker key={i} position={[pt.lat, pt.lng]} />
                            ) : null
                          )}
                        </MapContainer>

                        {points.length > 0 && (
                          <Stack gap={4}>
                            {points.map((pt, i) => (
                              <Group key={i} justify="space-between">
                                <Text fz="sm">
                                  <b>{pt.code || `Cây ${i + 1}`}</b> — {pt.lat},{" "}
                                  {pt.lng} •{" "}
                                  {pt.plantedAt
                                    ? new Date(pt.plantedAt).toLocaleDateString(
                                        "vi-VN"
                                      )
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

      {/* ========= THEO HÀNG ========= */}
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
                                  ...(form.values.gps.inputBuffer?.byRow ?? {}),
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
                                  ...(form.values.gps.inputBuffer?.byRow ?? {}),
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
                                  ...(form.values.gps.inputBuffer?.byRow ?? {}),
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
                                  ...(form.values.gps.inputBuffer?.byRow ?? {}),
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
                                  ...(form.values.gps.inputBuffer?.byRow ?? {}),
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
                                  ...(form.values.gps.inputBuffer?.byRow ?? {}),
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
                                  ...(form.values.gps.inputBuffer?.byRow ?? {}),
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
                                  ...(form.values.gps.inputBuffer?.byRow ?? {}),
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
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          {points.map((pt, i) =>
                            pt.lat && pt.lng ? (
                              <Marker key={i} position={[pt.lat, pt.lng]} />
                            ) : null
                          )}
                        </MapContainer>

                        {points.length > 0 && (
                          <Stack gap={4}>
                            {points.map((pt, i) => (
                              <Group key={i} justify="space-between">
                                <Text fz="sm">
                                  <b>{pt.code || `Cây ${i + 1}`}</b> — {pt.lat},{" "}
                                  {pt.lng} •{" "}
                                  {pt.plantedAt
                                    ? new Date(pt.plantedAt).toLocaleDateString(
                                        "vi-VN"
                                      )
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
    </Stack>
  );
};

export default ConfirmStep;
