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
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import L from "leaflet";
import { IconPlus, IconTrash } from "@tabler/icons-react";
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
        <Accordion multiple variant="contained" radius={4}>
          {form.values.allocation.selectedPlots.map((p) => {
            const pts = form.values.gps.byPlot[p.id] || [];
            const buf = form.values.gps.inputBuffer.byPlot[p.id] || {
              code: "",
              lat: undefined,
              lng: undefined,
              plantedAt: null,
            };
            const center: [number, number] =
              pts[0]?.lat && pts[0]?.lng
                ? [pts[0].lat!, pts[0].lng!]
                : defaultCenter;

            return (
              <Accordion.Item key={p.id} value={p.id}>
                <Accordion.Control>
                  <Group justify="space-between">
                    <Stack gap={2}>
                      <Title order={5}>
                        {p.name}{" "}
                        <Text span c="dimmed">
                          ({p.code})
                        </Text>
                      </Title>
                      <Text c="dimmed" fz="sm">
                        {p.mainCrop} • {p.areaM2.toLocaleString("vi-VN")} m² •{" "}
                        {p.rowsCount} hàng • {p.irrigation} • {p.cultivation}
                      </Text>
                    </Stack>
                    <Badge variant="light">{p.terrainLabel}</Badge>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Card withBorder radius="sm" shadow="xs" p="md">
                    {/* Form nhập 1 điểm, bấm Thêm để append */}
                    <Group align="flex-end" wrap="wrap">
                      <TextInput
                        label="Mã cây"
                        placeholder="A1-001"
                        value={buf.code || ""}
                        onChange={(e) =>
                          form.setFieldValue("gps.inputBuffer.byPlot", {
                            ...form.values.gps.inputBuffer.byPlot,
                            [p.id]: { ...buf, code: e.currentTarget.value },
                          })
                        }
                        w={200}
                        radius={4}
                      />
                      <TextInput
                        label="Latitude"
                        placeholder="10.762622"
                        value={buf.lat ?? ""}
                        onChange={(e) => {
                          const v = e.currentTarget.value;
                          form.setFieldValue("gps.inputBuffer.byPlot", {
                            ...form.values.gps.inputBuffer.byPlot,
                            [p.id]: {
                              ...buf,
                              lat: v === "" ? undefined : Number(v),
                            },
                          });
                        }}
                        w={200}
                        radius={4}
                      />
                      <TextInput
                        label="Longitude"
                        placeholder="106.660172"
                        value={buf.lng ?? ""}
                        onChange={(e) => {
                          const v = e.currentTarget.value;
                          form.setFieldValue("gps.inputBuffer.byPlot", {
                            ...form.values.gps.inputBuffer.byPlot,
                            [p.id]: {
                              ...buf,
                              lng: v === "" ? undefined : Number(v),
                            },
                          });
                        }}
                        w={200}
                        radius={4}
                      />
                      <DatePickerInput
                        label="Thời gian trồng"
                        placeholder="Chọn ngày"
                        value={buf.plantedAt ?? null}
                        radius={4}
                      />
                      <Button
                        leftSection={<IconPlus size={16} />}
                        variant="light"
                        radius={4}
                        onClick={() => {
                          if (buf.lat == null || buf.lng == null) return;
                          const next = [...pts, { ...buf }];
                          form.setFieldValue(`gps.byPlot.${p.id}`, next);
                          const cloned = {
                            ...form.values.gps.inputBuffer.byPlot,
                          };
                          delete cloned[p.id];
                          form.setFieldValue("gps.inputBuffer.byPlot", cloned);
                        }}
                      >
                        Thêm
                      </Button>
                    </Group>

                    <Stack mt="md" gap="xs">
                      <MapContainer
                        center={center}
                        zoom={18}
                        style={{ height: 320, width: "100%", borderRadius: 8 }}
                        scrollWheelZoom={false}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {/* Nếu có polygon biên lô, bạn có thể thêm <Polygon positions={...} /> ở đây */}
                        {pts.map((pt, i) =>
                          pt.lat && pt.lng ? (
                            <Marker
                              key={i}
                              position={[pt.lat, pt.lng]}
                              draggable
                              icon={iconFor(false)}
                              eventHandlers={{
                                dragend: (e) => {
                                  const latLng = e.target.getLatLng();
                                  const next = [...pts];
                                  next[i] = {
                                    ...pt,
                                    lat: latLng.lat,
                                    lng: latLng.lng,
                                  };
                                  form.setFieldValue(
                                    `gps.byPlot.${p.id}`,
                                    next
                                  );
                                },
                              }}
                            />
                          ) : null
                        )}
                      </MapContainer>

                      {/* Danh sách điểm */}
                      {pts.length > 0 && (
                        <Stack gap={6}>
                          {pts.map((pt, i) => (
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
                              <Button
                                size="xs"
                                variant="subtle"
                                color="red"
                                leftSection={<IconTrash size={14} />}
                                onClick={() => {
                                  const next = [...pts];
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

      {/* ========= THEO HÀNG ========= */}
      {form.values.allocation.type === "row" && (
        <Accordion multiple variant="contained" radius={4}>
          {form.values.allocation.rows.map((r, idx) => {
            const key = r.id;
            const pts = form.values.gps.byRow[key] || [];
            const buf = form.values.gps.inputBuffer.byRow[key] || {
              code: "",
              lat: undefined,
              lng: undefined,
              plantedAt: null,
            };
            const center: [number, number] =
              pts[0]?.lat && pts[0]?.lng
                ? [pts[0].lat!, pts[0].lng!]
                : defaultCenter;

            return (
              <Accordion.Item key={key} value={key}>
                <Accordion.Control>
                  <Text fw={600}>{r.rowName || `Hàng ${idx + 1}`}</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Card withBorder radius="sm" shadow="xs" p="md">
                    <Group align="flex-end" wrap="wrap">
                      <TextInput
                        label="Mã cây"
                        placeholder="R1-001"
                        value={buf.code || ""}
                        onChange={(e) =>
                          form.setFieldValue("gps.inputBuffer.byRow", {
                            ...form.values.gps.inputBuffer.byRow,
                            [key]: { ...buf, code: e.currentTarget.value },
                          })
                        }
                        w={200}
                        radius={4}
                      />
                      <TextInput
                        label="Latitude"
                        placeholder="10.762622"
                        value={buf.lat ?? ""}
                        onChange={(e) => {
                          const v = e.currentTarget.value;
                          form.setFieldValue("gps.inputBuffer.byRow", {
                            ...form.values.gps.inputBuffer.byRow,
                            [key]: {
                              ...buf,
                              lat: v === "" ? undefined : Number(v),
                            },
                          });
                        }}
                        w={200}
                        radius={4}
                      />
                      <TextInput
                        label="Longitude"
                        placeholder="106.660172"
                        value={buf.lng ?? ""}
                        onChange={(e) => {
                          const v = e.currentTarget.value;
                          form.setFieldValue("gps.inputBuffer.byRow", {
                            ...form.values.gps.inputBuffer.byRow,
                            [key]: {
                              ...buf,
                              lng: v === "" ? undefined : Number(v),
                            },
                          });
                        }}
                        w={200}
                        radius={4}
                      />
                      <DatePickerInput
                        label="Thời gian trồng"
                        placeholder="Chọn ngày"
                        value={buf.plantedAt ?? null}
                        radius={4}
                      />
                      <Button
                        leftSection={<IconPlus size={16} />}
                        variant="light"
                        radius={4}
                        onClick={() => {
                          if (buf.lat == null || buf.lng == null) return;
                          const next = [...pts, { ...buf }];
                          form.setFieldValue(`gps.byRow.${key}`, next);
                          const cloned = {
                            ...form.values.gps.inputBuffer.byRow,
                          };
                          delete cloned[key];
                          form.setFieldValue("gps.inputBuffer.byRow", cloned);
                        }}
                      >
                        Thêm
                      </Button>
                    </Group>

                    <Stack mt="md" gap="xs">
                      <MapContainer
                        center={center}
                        zoom={18}
                        style={{ height: 320, width: "100%", borderRadius: 8 }}
                        scrollWheelZoom={false}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {/* Nếu có polyline theo hàng, có thể render */}
                        {pts.length > 1 && (
                          <Polyline
                            positions={pts
                              .filter((p) => p.lat && p.lng)
                              .map((p) => [p.lat!, p.lng!])}
                            color="blue"
                          />
                        )}
                        {pts.map((pt, i) =>
                          pt.lat && pt.lng ? (
                            <Marker
                              key={i}
                              position={[pt.lat, pt.lng]}
                              draggable
                              icon={iconFor(false)}
                              eventHandlers={{
                                dragend: (e) => {
                                  const latLng = e.target.getLatLng();
                                  const next = [...pts];
                                  next[i] = {
                                    ...pt,
                                    lat: latLng.lat,
                                    lng: latLng.lng,
                                  };
                                  form.setFieldValue(`gps.byRow.${key}`, next);
                                },
                              }}
                            />
                          ) : null
                        )}
                      </MapContainer>

                      {pts.length > 0 && (
                        <Stack gap={6}>
                          {pts.map((pt, i) => (
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
                              <Button
                                size="xs"
                                variant="subtle"
                                color="red"
                                leftSection={<IconTrash size={14} />}
                                onClick={() => {
                                  const next = [...pts];
                                  next.splice(i, 1);
                                  form.setFieldValue(`gps.byRow.${key}`, next);
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
