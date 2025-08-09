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
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import L from "leaflet";
import { IconTrash } from "@tabler/icons-react";
import { useMemo } from "react";
import { useForm } from "@mantine/form";
import { sampleGpsData, samplePlots, sampleRows } from "..";

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

type ConfirmPlantingProps = {
  area: string;
  zone: string;
  block: string;
  row?: string;
  type: "plot" | "row";
  plantingDate?: string;
};

const iconFor = (selected: boolean) =>
  L.divIcon({
    className: "custom-tree-point",
    html: `<div style="
      width: 14px; height: 14px; background-color: ${
        selected ? "#1c7ed6" : "#74c0fc"
      };
      border-radius: 4px; border: 1px solid #ffffff; box-shadow: 0 0 2px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const ConfirmStep = (props: ConfirmPlantingProps) => {
  const form = useForm<FormValues>({
    initialValues: {
      allocation: {
        type: props.type, // hoặc "row"
        selectedPlots: samplePlots,
        rows: sampleRows,
      },
      gps: sampleGpsData,
    },
  });

  // center map mặc định nếu chưa có điểm
  const defaultCenter: [number, number] = [10.762622, 106.660172];

  return (
    <Stack gap="xl" mt="md">
      <Title order={3}>Xác nhận thông tin trồng cây</Title>

      {/* Thông tin khu vực */}
      <Card withBorder radius="md" shadow="xs" p="md">
        <Group grow align="flex-start" justify="space-between">
          <Stack gap="xs" flex={1}>
            <Group justify="apart">
              <Text fw={500}>Vùng trồng:</Text>
              <Badge>{props.area}</Badge>
            </Group>
            <Group justify="apart">
              <Text fw={500}>Khu vực:</Text>
              <Badge>{props.zone}</Badge>
            </Group>
            <Group justify="apart">
              <Text fw={500}>Lô:</Text>
              <Badge>{props.block}</Badge>
            </Group>
            {props.row && (
              <Group justify="apart">
                <Text fw={500}>Hàng:</Text>
                <Badge>{props.row}</Badge>
              </Group>
            )}
            {props.plantingDate && (
              <Group justify="apart">
                <Text fw={500}>Ngày trồng:</Text>
                <Text>{props.plantingDate}</Text>
              </Group>
            )}
          </Stack>
        </Group>
      </Card>

      <Divider
        label={`Định vị GPS theo ${
          form.values.allocation.type === "plot" ? "Lô" : "Hàng"
        }`}
        labelPosition="center"
      />

      {/* ========= THEO LÔ ========= */}
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
                      {p.mainCrop} • {p.areaM2.toLocaleString("vi-VN")} m² •{" "}
                      {p.rowsCount} hàng
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
                          <ActionIcon variant="light" color="red" radius={4}>
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>

                        <Group flex={2} align="flex-end">
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
                                  [p.id]: {
                                    ...buf,
                                    plantedAt: d ?? null,
                                  },
                                },
                              });
                            }}
                            flex={1}
                          />
                          <ActionIcon variant="light" color="red" radius={4}>
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                        <Button radius={4} variant="outline">
                          Thêm mới
                        </Button>
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
                          <ActionIcon radius={4} variant="light" color="red">
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
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
                          <ActionIcon radius={4} variant="light" color="red">
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                        <Button radius={4} variant="outline">
                          Thêm mới
                        </Button>
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
      <Group justify="space-between">
        <Text fw={500}>Tổng số điểm GPS</Text>
        <Text fw={700} c="green">
          {useMemo(() => {
            if (form.values.allocation.type === "plot") {
              return Object.values(form.values.gps.byPlot).reduce(
                (s, arr) => s + arr.length,
                0
              );
            }
            return Object.values(form.values.gps.byRow).reduce(
              (s, arr) => s + arr.length,
              0
            );
          }, [form.values.allocation.type, form.values.gps])}
        </Text>
      </Group>
    </Stack>
  );
};

export default ConfirmStep;
