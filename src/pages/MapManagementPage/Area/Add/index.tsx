import {
  Button,
  Group,
  Stack,
  TextInput,
  Select,
  NumberInput,
  MultiSelect,
  Text,
  Title,
  Stepper,
  Paper,
  Alert,
  ActionIcon,
  Modal,
  Card,
  Image,
} from "@mantine/core";
import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconMap,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import RegionCardSelector from "../../../AreaManagementPage/Region/Add/components/RegionCards";
import { regionOptions } from "../../../AreaManagementPage/Block/Add";
import { useRegionStore } from "../../../zustand/regionStore";

type AreaForm = {
  code: string;
  name: string;
  area: number;
  soilType: string;
  terrain: string[];
  orgUnit: string;
  gps: string;
};

const defaultForm: AreaForm = {
  code: "",
  name: "",
  area: 0,
  soilType: "",
  terrain: [],
  orgUnit: "",
  gps: "",
};

type LatLng = [number, number];
const MapUpdater = ({ coords }: { coords: LatLng[] }) => {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      map.setView(coords[coords.length - 1], map.getZoom());
    }
  }, [coords, map]);
  return null;
};

const MapManagementAddAreaPage = () => {
  const [
    openedAddLocation,
    { open: openAddLocation, close: closeAddLocation },
  ] = useDisclosure(false);

  const navigate = useNavigate();
  const { regions, updateRegion } = useRegionStore();

  const [form, setForm] = useState<AreaForm>(defaultForm);
  const [active, setActive] = useState(0);

  // Input tạm
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");

  // TÁCH BIỆT STATE TỌA ĐỘ
  const [areaCoords, setAreaCoords] = useState<LatLng[]>([]); // Tọa độ Khu vực (Bước 2)
  const [plotCoords, setPlotCoords] = useState<LatLng[]>([]); // Tọa độ Lô (Bước 3 - Modal)

  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [regionKeyword, setRegionKeyword] = useState("");
  const [stepError, setStepError] = useState<string | null>(null);

  const handleChange = <K extends keyof AreaForm>(
    key: K,
    value: AreaForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // --- LOGIC MAP KHU VỰC (BƯỚC 2) ---
  const handleAddAreaPoint = () => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      setAreaCoords((prev) => [...prev, [parsedLat, parsedLng]]);
      setLat("");
      setLng("");
    }
  };

  const handleRemoveAreaPoint = (index: number) => {
    setAreaCoords((prev) => prev.filter((_, i) => i !== index));
  };

  // --- LOGIC MAP LÔ (BƯỚC 3 - MODAL) ---
  const handleAddPlotPoint = () => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      setPlotCoords((prev) => [...prev, [parsedLat, parsedLng]]);
      setLat("");
      setLng("");
    }
  };

  const handleRemovePlotPoint = (index: number) => {
    setPlotCoords((prev) => prev.filter((_, i) => i !== index));
  };

  const updateGpsString = (points: LatLng[]) => {
    const gpsStr = points.map(([la, lo]) => `${la},${lo}`).join(" ");
    setForm((prev) => ({ ...prev, gps: gpsStr }));
  };

  // Cập nhật GPS String khi areaCoords thay đổi
  useEffect(() => {
    updateGpsString(areaCoords);
  }, [areaCoords]);

  const validateStep0 = () => {
    if (!selectedRegionId) {
      setStepError("Vui lòng chọn vùng trồng.");
      return false;
    }
    if (!form.name.trim()) {
      setStepError("Vui lòng nhập tên khu vực.");
      return false;
    }
    if (!form.area || form.area <= 0) {
      setStepError("Diện tích phải lớn hơn 0.");
      return false;
    }
    setStepError(null);
    return true;
  };

  const validateStep1 = () => {
    if (areaCoords.length < 3) {
      setStepError("Cần ít nhất 3 điểm toạ độ để tạo đa giác khu vực.");
      return false;
    }
    setStepError(null);
    return true;
  };

  const validateStep2 = () => {
    setStepError(null);
    return true;
  };

  const handleSaveArea = () => {
    console.log("sav", selectedRegionId);
    if (!selectedRegionId) return false;
    const region = regions.find(
      (r) => r.region.codeSystem === selectedRegionId
    );
    console.log("sav", region);

    if (!region) return false;

    const newArea = {
      code: form.code || `KV-${Date.now()}`,
      name: form.name,
      regionRef: selectedRegionId,
      orgUnit: form.orgUnit || region.region?.companyIds?.[0] || "",
      area: String(form.area),
      soilType: form.soilType,
      terrain: form.terrain,
      mainCrop: "",
      gps: form.gps,
    };
    console.log(newArea);
    const updatedAreas = [...region.areas, newArea];
    updateRegion(selectedRegionId, { areas: updatedAreas });
    setStepError(null);
    return true;
  };

  const nextStep = () => {
    if (active === 0 && !validateStep0()) return;
    if (active === 1 && !validateStep1()) return;
    if (active === 2 && !validateStep2()) return;
    if (active === 3) {
      const ok = handleSaveArea();
      if (!ok) return;
    }
    setActive((cur) => Math.min(cur + 1, 4));
  };

  const prevStep = () => setActive((cur) => Math.max(cur - 1, 0));

  const filteredRegions = useMemo(() => {
    const kw = regionKeyword.toLowerCase().trim();
    if (!kw) return regions;
    return regions.filter(
      (r: any) =>
        r.name?.toLowerCase().includes(kw) || r.code?.toLowerCase().includes(kw)
    );
  }, [regionKeyword, regions]);

  const selectedRegionLabel = useMemo(() => {
    if (!selectedRegionId) return "Chưa chọn";
    const found = regionOptions.find((r: any) => r.id === selectedRegionId);
    return found ? `${found.code} - ${found.name}` : selectedRegionId;
  }, [selectedRegionId]);

  return (
    <Paper shadow="md" radius={8} p="xl" withBorder>
      <Group mb="md">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Tạo mới khu vực trồng</Title>
      </Group>

      {stepError && (
        <Alert
          mb="md"
          icon={<IconAlertTriangle />}
          color="red"
          radius={4}
          title="Lỗi dữ liệu"
        >
          {stepError}
        </Alert>
      )}

      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
      >
        {/* BƯỚC 1: THÔNG TIN */}
        <Stepper.Step label="Bước 1" description="Thông tin">
          <Stack gap="xs" mt="md">
            <Stack gap={"xs"}>
              <Text fw={500} fz={15}>
                Vùng Trồng
              </Text>
              <TextInput
                placeholder="Tìm kiếm vùng trồng"
                radius={4}
                leftSection={<IconSearch size={18} />}
                value={regionKeyword}
                onChange={(e) => setRegionKeyword(e.currentTarget.value)}
              />
              <RegionCardSelector
                regions={filteredRegions}
                selected={selectedRegionId ?? ""}
                onSelect={(data) =>
                  setSelectedRegionId(
                    data.selectedIds?.[data.selectedIds.length - 1]
                  )
                }
              />
              <Text size="sm" c="dimmed">
                Đang chọn: <strong>{selectedRegionLabel}</strong>
              </Text>
            </Stack>
            <TextInput
              label="Tên khu vực"
              radius={4}
              required
              value={form.name}
              onChange={(e) => handleChange("name", e.currentTarget.value)}
            />
            <NumberInput
              label="Diện tích (m²)"
              radius={4}
              required
              value={form.area}
              onChange={(value) => handleChange("area", Number(value) || 0)}
              min={0}
            />
            <Select
              searchable
              clearable
              label="Loại đất"
              radius={4}
              data={["Đất thịt", "Đất cát", "Đất đỏ", "Đất sét"]}
              value={form.soilType}
              onChange={(value) => handleChange("soilType", value || "")}
              placeholder="Chọn loại đất"
            />
            <MultiSelect
              label="Địa hình"
              radius={4}
              data={["Cao", "Thấp", "Dốc", "Bằng phẳng"]}
              value={form.terrain}
              onChange={(value) => handleChange("terrain", value)}
              placeholder="Chọn nhiều địa hình"
            />
          </Stack>
        </Stepper.Step>

        {/* BƯỚC 2: BIỂU ĐỒ KHU VỰC (SỬ DỤNG areaCoords) */}
        <Stepper.Step label="Bước 2" description="Biểu đồ khu vực">
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
                onClick={handleAddAreaPoint}
                radius={4}
                leftSection={<IconPlus size={16} />}
              >
                Thêm
              </Button>
            </Group>
            {areaCoords.length > 0 && (
              <Stack gap={"xs"}>
                <Text size="sm" c="dimmed">
                  Danh sách tọa độ ({areaCoords.length}):
                </Text>
                {areaCoords.map(([latVal, lngVal], i) => (
                  <Group key={i} gap="xs">
                    <Text size="sm" w={"40%"}>
                      {i + 1}. {latVal}, {lngVal}
                    </Text>
                    <ActionIcon
                      color="red"
                      variant="light"
                      radius={4}
                      onClick={() => handleRemoveAreaPoint(i)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ))}
              </Stack>
            )}
            <MapContainer
              center={
                areaCoords.length >= 1 ? areaCoords[0] : [10.762622, 106.660172]
              }
              zoom={16}
              style={{ height: "600px", width: "100%", borderRadius: 8 }}
              attributionControl={false}
            >
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
              />
              <MapUpdater coords={areaCoords} />
              <Polygon positions={areaCoords} color="blue" />
              {/* Khu vực màu xanh dương */}
            </MapContainer>
          </Stack>
        </Stepper.Step>

        {/* BƯỚC 3: LÔ (SỬ DỤNG plotCoords TRONG MODAL) */}
        <Stepper.Step label="Bước 3" description="Lô">
          <Stack mt={"md"} gap={"xs"}>
            <Card withBorder radius={4} p="md" mb="md">
              <Stack gap={"xs"}>
                <TextInput radius={4} label="Mã lô" required />
                <TextInput label="Tên lô" required radius={4} />
                <TextInput
                  label="Diện tích (m²)"
                  type="number"
                  required
                  radius={4}
                />
                <Button
                  onClick={() => {
                    setLat("");
                    setLng("");
                    openAddLocation();
                  }}
                  my={"sm"}
                  radius={4}
                  variant="outline"
                  leftSection={<IconMap />}
                >
                  {plotCoords.length > 0
                    ? "Chỉnh sửa bản đồ Lô"
                    : "Tạo bản đồ Lô"}
                </Button>
                <Group mt={"xs"}>
                  <Button radius={4}>Lưu</Button>
                  <Button radius={4} color="red">
                    Xoá
                  </Button>
                </Group>
              </Stack>
            </Card>
            <Button radius={4} variant="outline">
              + Thêm lô
            </Button>
          </Stack>
        </Stepper.Step>

        {/* BƯỚC 4: XÁC NHẬN */}
        <Stepper.Step label="Bước 4" description="Xác nhận thông tin">
          <Stack gap="md" mt="md">
            <Card withBorder radius="md" padding="md">
              <Title order={5}>📍 Thông tin khu vực</Title>
              <Text>Tên: {form.name}</Text>
              <Text>Diện tích: {form.area} m²</Text>
            </Card>
            <Card withBorder radius="md" padding="md">
              <Title order={5} mb="xs">
                🗺 Xem trước khu vực trên bản đồ
              </Title>
              <MapContainer
                center={
                  areaCoords.length >= 1
                    ? areaCoords[0]
                    : [10.762622, 106.660172]
                }
                zoom={16}
                style={{ height: "600px", width: "100%", borderRadius: 8 }}
              >
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles &copy; Esri"
                />
                <Polygon positions={areaCoords} color="blue" />
                <Polygon positions={plotCoords} color="orange" />
              </MapContainer>
            </Card>
          </Stack>
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
              Thêm mới khu vực trồng thành công!
            </Text>
            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Xác nhận
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      {/* FOOTER BUTTONS */}
      {active < 4 && (
        <Group justify="space-between" mt="xl">
          <Button
            radius={4}
            variant="default"
            onClick={prevStep}
            disabled={active === 0}
          >
            Quay lại
          </Button>
          <Button radius={4} onClick={nextStep}>
            {active === 3 ? "Hoàn thành" : "Tiếp tục"}
          </Button>
        </Group>
      )}

      {/* MODAL BẢN ĐỒ LÔ (SỬ DỤNG plotCoords) */}
      <Modal
        opened={openedAddLocation}
        onClose={closeAddLocation}
        title={<Text fw={"bold"}>Bản đồ Lô</Text>}
        size="lg"
      >
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
              onClick={handleAddPlotPoint}
              radius={4}
              leftSection={<IconPlus size={16} />}
            >
              Thêm
            </Button>
          </Group>

          {plotCoords.length > 0 && (
            <Stack gap={"xs"}>
              <Text size="sm" c="dimmed">
                Danh sách tọa độ Lô ({plotCoords.length}):
              </Text>
              {plotCoords.map(([latVal, lngVal], i) => (
                <Group key={i} gap="xs">
                  <Text size="sm" w={"40%"}>
                    {i + 1}. {latVal}, {lngVal}
                  </Text>
                  <ActionIcon
                    color="red"
                    variant="light"
                    radius={4}
                    onClick={() => handleRemovePlotPoint(i)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          )}

          <MapContainer
            center={
              plotCoords.length >= 1
                ? plotCoords[0]
                : areaCoords[0] || [10.762622, 106.660172]
            }
            zoom={16}
            style={{ height: "600px", width: "100%", borderRadius: 8 }}
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri"
            />
            <MapUpdater coords={plotCoords} />
            {/* Hiển thị Khu vực mờ để làm nền */}
            {areaCoords.length > 0 && (
              <Polygon
                positions={areaCoords}
                color="blue"
                weight={1}
                fillOpacity={0.1}
              />
            )}
            {/* Hiển thị Lô đang vẽ */}
            <Polygon positions={plotCoords} color="orange" />
          </MapContainer>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={closeAddLocation}>
              Hủy
            </Button>
            <Button onClick={closeAddLocation}>Lưu bản đồ Lô</Button>
          </Group>
        </Stack>
      </Modal>
    </Paper>
  );
};

export default MapManagementAddAreaPage;
