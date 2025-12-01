import {
  Button,
  Card,
  Group,
  Stack,
  Title,
  TextInput,
  Stepper,
  Text,
  ActionIcon,
  Alert,
  NumberInput,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { ConfirmStep } from "./components/ConfirmStep";
import RegionCardSelector from "../../../AreaManagementPage/Region/Add/components/RegionCards";
import AreaCards from "../../../AreaManagementPage/Zone/Add/components/AreaCards";
import { useRegionStore } from "../../../zustand/regionStore";
import type { AreaZone } from "../../Area";
import { usePlotStore } from "../../../zustand/plotStore";

type LatLng = [number, number];

const MapManagementPlotAddPage = () => {
  const navigate = useNavigate();
  const { regions } = useRegionStore();
  const { addPlot } = usePlotStore();

  const [activeStep, setActiveStep] = useState(0);
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [coords, setCoords] = useState<LatLng[]>([]);
  const areaZoneData = useMemo<AreaZone[]>(() => {
    if (!regions || regions.length === 0) return [];

    return regions.flatMap((regionEntity) => {
      const { region, areas } = regionEntity;

      return (areas || []).map<AreaZone>((area, idx) => ({
        id: area.code || `${regionEntity.id}-${idx + 1}`,
        code: area.code || `KV-${idx + 1}`,
        name: area.name || `Khu vực ${idx + 1}`,
        regionName: region.name,
        area: Number(area.area) || 0,
        soilType: area.soilType || region.soilType || "Chưa cập nhật",
        terrain:
          (area.terrain && area.terrain.length > 0
            ? area.terrain
            : region.terrain) || [],
        gps: area.gps || region.gps || "",
        numberOfLots: 0, // nếu sau này có store lô thì map thật
        mainCrop: area.mainCrop,
      }));
    });
  }, [regions]);
  // state chọn vùng / khu vực (dùng id trong regionOptions, areaOptions)
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");

  const form = useForm({
    initialValues: {
      regionId: "",
      areaId: "",
      code: "",
      name: "",
      area: "",
      contour: "",
      elevation: "",

      gps: "",
      rows: [
        {
          name: "",
          code: "",
          crop: "",
          treeCount: "",
          gps: "",
        },
      ],
    },
  });

  const handleAddPoint = () => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      setCoords((prev) => [...prev, [parsedLat, parsedLng]]);
      setLat("");
      setLng("");
    }
  };

  const handleRemovePoint = (index: number) => {
    setCoords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedRegionId) {
      alert("Vui lòng chọn Vùng trồng");
      return;
    }
    if (!selectedAreaId) {
      alert("Vui lòng chọn Khu vực");
      return;
    }
    if (coords.length < 3) {
      alert("Lô cần ít nhất 3 tọa độ để tạo polygon!");
      return;
    }
    const addRow = () => {
      form.insertListItem("rows", {
        name: "",
        code: "",
        crop: "",
        treeCount: "",
        gps: "",
      });
    };
    // convert coords -> "lat,lng lat,lng ..."
    const gpsString = coords.map(([la, lo]) => `${la},${lo}`).join(" ");

    const newPlotId = "PLOT-" + Date.now();

    const regionEntity = regions.find((r) => r.id === selectedRegionId);
    const areaEntity = areaZoneData.find((a) => a.id === selectedAreaId);

    const payload = {
      id: newPlotId,
      plot: {
        code: form.values.code || newPlotId,
        name: form.values.name,
        regionId: selectedRegionId,
        areaCode: selectedAreaId,
        areaName: areaEntity?.name ?? "",
        regionName: regionEntity?.region.name ?? "",
        area: String(form.values.area),
        contour: form.values.contour,
        elevation: Number(form.values.elevation),
        gps: gpsString,
      },
      rows: form.values.rows.map((r, i) => ({
        code: r.code || `ROW-${newPlotId}-${i + 1}`,
        name: r.name,
        crop: r.crop,
        seed: "",
        treeCount: Number(r.treeCount) || 0,
        gps: r.gps || "",
      })),
      coords: coords.map(([lat, lng]) => ({ lat, lng })),
    };

    addPlot(payload);

    console.log("📌 Plot saved:", payload);

    // next step → trang completed
    setActiveStep(4);
  };

  const nextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  // lấy object vùng / khu vực đang chọn để hiển thị ở ConfirmStep
  const selectedRegion = regions.find((r) => r.id === selectedRegionId) ?? null;

  const selectedArea =
    areaZoneData.find((a) => a.id === selectedAreaId) ?? null;

  return (
    <Card withBorder shadow="md" radius={12} p="xl">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>📋 Tạo mới phân bổ lô</Title>
      </Group>

      <Stepper
        active={activeStep}
        onStepClick={setActiveStep}
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="Bước 1" description="Vùng trồng & Khu vực" />
        <Stepper.Step label="Bước 2" description="Tạo lô" />
        <Stepper.Step label="Bước 3" description="Bản đồ lô" />
        <Stepper.Step label="Bước 4" description="Xác nhận" />
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
              Thêm mới phân bổ lô thành công!
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Phân bổ lô mới đã được thêm thành công. Vui lòng kiểm tra lại
              thông tin để đảm bảo tính chính xác.
            </Text>

            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Xác nhận
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {/* STEP 1: chọn vùng + khu vực */}
        {activeStep === 0 && (
          <Stack mt="md">
            <Stack gap={"xs"}>
              <Text fw={500} fz={15}>
                Vùng Trồng
              </Text>
              <TextInput
                placeholder="Tìm kiếm vùng trồng"
                radius={4}
                leftSection={<IconSearch size={18} />}
              />
              <RegionCardSelector
                regions={regions}
                selected={selectedRegionId}
                onSelect={(id) => {
                  setSelectedRegionId(id);
                  form.setFieldValue("regionId", id);
                }}
              />
            </Stack>
            <Stack gap={"xs"}>
              <Text fw={500} fz={15}>
                Khu vực
              </Text>
              <TextInput
                placeholder="Tìm kiếm khu vực"
                radius={4}
                leftSection={<IconSearch size={18} />}
              />
              <AreaCards
                areas={areaZoneData}
                selected={selectedAreaId}
                onSelect={(id) => {
                  setSelectedAreaId(id);
                  form.setFieldValue("areaId", id);

                  const area = areaZoneData.find((a) => a.id === id);
                  if (area) {
                    form.setFieldValue("area", area.area.toString());
                    form.setFieldValue("code", `LO-${area.code}-${Date.now()}`);
                  }
                }}
              />
            </Stack>
          </Stack>
        )}

        {/* STEP 2: thông tin lô */}
        {activeStep === 1 && (
          <Stack mt="md">
            <TextInput
              label="Tên lô"
              required
              {...form.getInputProps("name")}
              radius={4}
            />
            <NumberInput
              label="Diện tích (m²)"
              required
              {...form.getInputProps("area")}
              radius={4}
            />
            <TextInput
              label="Thông tin đường bình độ"
              radius={4}
              {...form.getInputProps("contour")}
            />
            <NumberInput
              label="Cao độ (m)"
              radius={4}
              {...form.getInputProps("elevation")}
            />
          </Stack>
        )}

        {/* STEP 3: toạ độ lô */}
        {activeStep === 2 && (
          <Stack mt="md" gap={"xs"}>
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
                {coords.map(([la, lo], i) => (
                  <Group key={i} gap="xs">
                    <Text size="sm" w={"40%"}>
                      {i + 1}. {la}, {lo}
                    </Text>
                    <ActionIcon
                      color="red"
                      variant="light"
                      radius={4}
                      onClick={() => handleRemovePoint(i)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ))}
              </Stack>
            )}
            {coords.length > 0 && coords.length < 3 && (
              <Alert icon={<IconAlertTriangle />} color="yellow" radius={4}>
                Cần ít nhất 3 điểm để tạo đa giác.
              </Alert>
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
        )}

        {/* STEP 4: xác nhận */}
        {activeStep === 3 && (
          <ConfirmStep
            region={selectedRegion?.region.name ?? "Chưa chọn vùng"}
            zone={selectedArea?.name ?? "Chưa chọn khu vực"}
            block={form.values.name || "Chưa đặt tên lô"}
            area={Number(form.values.area) || 0}
            contour={form.values.contour || ""}
            elevation={Number(form.values.elevation) || 0}
            gps={coords.map(([la, lo]) => ({ lat: la, lng: lo }))}
            rows={form.values.rows.map((row, idx) => ({
              name: row.name || `Hàng ${idx + 1}`,
              plantType: row.crop || undefined,
              seed: undefined, // nếu sau này có field hạt giống thì map thêm
              quantity: row.treeCount ? Number(row.treeCount) : undefined,
            }))}
          />
        )}

        {activeStep < 4 && (
          <Group justify="space-between" mt="xl">
            <Button
              variant="default"
              radius={4}
              disabled={activeStep === 0}
              onClick={prevStep}
            >
              Quay lại
            </Button>
            {activeStep < 3 ? (
              <Button radius={4} onClick={nextStep}>
                Tiếp theo
              </Button>
            ) : (
              <Button radius={4} onClick={nextStep} color="green" type="submit">
                Hoàn thành
              </Button>
            )}
          </Group>
        )}
      </form>
    </Card>
  );
};

export default MapManagementPlotAddPage;
