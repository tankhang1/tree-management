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
import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
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

const MapManagementAddAreaPage = () => {
  const [
    openedAddLocation,
    { open: openAddLocation, close: closeAddLocation },
  ] = useDisclosure(false);

  const navigate = useNavigate();
  const { regions, updateRegion } = useRegionStore();

  const [form, setForm] = useState<AreaForm>(defaultForm);
  const [active, setActive] = useState(0);
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [coords, setCoords] = useState<LatLng[]>([]);

  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [regionKeyword, setRegionKeyword] = useState("");
  const [stepError, setStepError] = useState<string | null>(null);

  const handleChange = <K extends keyof AreaForm>(
    key: K,
    value: AreaForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateGpsString = (points: LatLng[]) => {
    const gpsStr = points.map(([la, lo]) => `${la},${lo}`).join(" ");
    setForm((prev) => ({ ...prev, gps: gpsStr }));
  };

  const handleAddPoint = () => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      const nextCoords: LatLng[] = [...coords, [parsedLat, parsedLng]];
      setCoords(nextCoords);
      updateGpsString(nextCoords);
      setLat("");
      setLng("");
    }
  };

  const handleRemove = (index: number) => {
    const nextCoords = coords.filter((_, i) => i !== index);
    setCoords(nextCoords);
    updateGpsString(nextCoords);
  };

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
    if (!form.soilType) {
      setStepError("Vui lòng chọn loại đất.");
      return false;
    }
    if (!form.terrain.length) {
      setStepError("Vui lòng chọn ít nhất một địa hình.");
      return false;
    }
    setStepError(null);
    return true;
  };

  const validateStep1 = () => {
    if (coords.length < 3) {
      setStepError("Cần ít nhất 3 điểm toạ độ để tạo đa giác khu vực.");
      return false;
    }
    setStepError(null);
    return true;
  };

  const validateStep2 = () => {
    // hiện tại chưa có form lô chi tiết, tạm thời luôn true
    setStepError(null);
    return true;
  };

  const handleSaveArea = () => {
    if (!selectedRegionId) {
      setStepError("Không tìm thấy vùng trồng để gắn khu vực.");
      return false;
    }

    const region = regions.find((r) => r.id === selectedRegionId);
    if (!region) {
      setStepError("Vùng trồng đã chọn không tồn tại trong dữ liệu.");
      return false;
    }

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
  }, [regionKeyword]);

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
        {/* BƯỚC 1 */}
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
                onSelect={(id: string) => setSelectedRegionId(id)}
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

        {/* BƯỚC 2 */}
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
                {coords.map(([latVal, lngVal], i) => (
                  <Group key={i} gap="xs">
                    <Text size="sm" w={"40%"}>
                      {i + 1}. {latVal}, {lngVal}
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
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Polygon positions={coords} color="green" />
            </MapContainer>
          </Stack>
        </Stepper.Step>

        {/* BƯỚC 3 */}
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
                <TextInput label="Đường bình độ (cao độ)" radius={4} />
                <Button
                  onClick={openAddLocation}
                  my={"sm"}
                  radius={4}
                  variant="outline"
                  leftSection={<IconMap />}
                >
                  Tạo bảng đồ
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

        {/* BƯỚC 4 */}
        <Stepper.Step label="Bước 4" description="Xác nhận thông tin">
          <Stack gap="md" mt="md">
            <Card withBorder radius="md" padding="md">
              <Stack gap="xs">
                <Title order={5}>📍 Thông tin khu vực</Title>
                <Group justify="space-between">
                  <Text fw={500}>Tên khu vực:</Text>
                  <Text>{form.name || "Chưa nhập"}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>Diện tích:</Text>
                  <Text>{form.area ? form.area.toLocaleString() : 0} m²</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>Loại đất:</Text>
                  <Text>{form.soilType || "Chưa chọn"}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>Địa hình:</Text>
                  <Text>
                    {form.terrain.length
                      ? form.terrain.join(", ")
                      : "Chưa chọn"}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>Thuộc vùng:</Text>
                  <Text>{selectedRegionLabel}</Text>
                </Group>
              </Stack>
            </Card>

            <Card withBorder radius="md" padding="md">
              <Stack gap="xs">
                <Title order={5}>🧭 Toạ độ khu vực</Title>
                {coords.length >= 3 ? (
                  coords.map(([latVal, lngVal], i) => (
                    <Text size="sm" key={i}>
                      {i + 1}. Lat: {latVal} – Lng: {lngVal}
                    </Text>
                  ))
                ) : (
                  <Text size="sm" c="red">
                    ⚠ Chưa đủ điểm để tạo đa giác!
                  </Text>
                )}
              </Stack>
            </Card>

            <Card withBorder radius="md" padding="md">
              <Title order={5} mb="xs">
                🗺 Xem trước khu vực trên bản đồ
              </Title>
              <MapContainer
                center={
                  coords.length >= 1 ? coords[0] : [10.762622, 106.660172]
                }
                zoom={16}
                style={{ height: "200px", width: "100%", borderRadius: 8 }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polygon positions={coords} color="green" />
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
            <Text fz={"md"} ta="center" c="dimmed">
              Khu vực trồng mới đã được thêm thành công. Vui lòng kiểm tra lại
              thông tin để đảm bảo tính chính xác.
            </Text>

            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Xác nhận
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

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
          {active < 3 ? (
            <Button radius={4} onClick={nextStep}>
              Tiếp tục
            </Button>
          ) : (
            <Button radius={4} onClick={nextStep}>
              Hoàn thành
            </Button>
          )}
        </Group>
      )}

      <Modal
        opened={openedAddLocation}
        onClose={closeAddLocation}
        title={<Text fw={"bold"}>Bản đồ lô</Text>}
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
              {coords.map(([latVal, lngVal], i) => (
                <Group key={i} gap="xs">
                  <Text size="sm" w={"40%"}>
                    {i + 1}. {latVal}, {lngVal}
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
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polygon positions={coords} color="green" />
          </MapContainer>
        </Stack>
      </Modal>
    </Paper>
  );
};

export default MapManagementAddAreaPage;
