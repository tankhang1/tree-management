import {
  Button,
  Group,
  Stepper,
  TextInput,
  Textarea,
  Select,
  MultiSelect,
  Stack,
  Card,
  Title,
  Collapse,
  NumberInput,
  Text,
  ActionIcon,
  Alert,
  Modal,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconMap,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { MapContainer, Polygon, TileLayer, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { ConfirmStep } from "./components/ConfirmStep"; // Giả định component này đã có
import { CompanyList } from "../../../../components/CompanyList"; // Giả định component này đã có
import {
  useRegionStore,
  type LatLngPoint,
  type RegionEntity,
} from "../../../zustand/regionStore";

// --- TYPES & HELPER ---
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

const MapManagementAddRegionPage = () => {
  const navigate = useNavigate();
  const addRegion = useRegionStore((s) => s.addRegion);

  // --- UI STATES ---
  const [active, setActive] = useState(0);
  const [
    openedAddLocation,
    { open: openAddLocation, close: closeAddLocation },
  ] = useDisclosure(false);
  const [expandedAreas, setExpandedAreas] = useState<number[]>([]);

  // --- DATA STATES ---
  const [companyIds, setCompanyIds] = useState<string[]>([]);

  // Inputs tạm cho Lat/Lng
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");

  // 1. Tọa độ VÙNG TRỒNG (Dùng cho Bước 2)
  const [regionCoords, setRegionCoords] = useState<LatLng[]>([]);

  // 2. Tọa độ KHU VỰC TẠM THỜI (Dùng cho Modal)
  const [areaCoords, setAreaCoords] = useState<LatLng[]>([]);
  const [editingAreaIndex, setEditingAreaIndex] = useState<number | null>(null);

  // --- FORM SETUP ---
  const form = useForm({
    initialValues: {
      region: {
        codeSystem: `A-${Math.floor(Math.random() * 1000)}`,
        codeGov: "",
        name: "",
        area: "",
        soilType: "",
        terrain: [],
        companyIds: [],
        gps: "", // LƯU Ý: GPS LÀ STRING
        note: "",
        province: "",
        address: "",
        ward: "",
      },
      areas: [
        {
          code: "",
          name: "",
          regionRef: "",
          orgUnit: "",
          area: "",
          soilType: "",
          terrain: [],
          mainCrop: "",
          gps: "", // LƯU Ý: GPS LÀ STRING
          province: "",
          address: "",
          ward: "",
        },
      ],
    },
  });

  // --- HANDLERS NAVIGATION ---
  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const toggleArea = (index: number) => {
    setExpandedAreas((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // --- LOGIC MAP VÙNG TRỒNG (STEP 2) ---
  const handleAddRegionPoint = () => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      const newCoords = [...regionCoords, [parsedLat, parsedLng] as LatLng];
      setRegionCoords(newCoords);
      // Cập nhật luôn vào form dưới dạng string (nếu muốn realtime)
      form.setFieldValue("region.gps", JSON.stringify(newCoords));
      setLat("");
      setLng("");
    }
  };

  const handleRemoveRegionPoint = (index: number) => {
    const newCoords = regionCoords.filter((_, i) => i !== index);
    setRegionCoords(newCoords);
    form.setFieldValue("region.gps", JSON.stringify(newCoords));
  };

  // --- LOGIC MAP KHU VỰC (MODAL) ---
  const handleAddArea = () => {
    form.insertListItem("areas", {
      code: "",
      name: "",
      regionRef: "",
      orgUnit: "",
      area: "",
      soilType: "",
      terrain: [],
      mainCrop: "",
      gps: "", // Init string rỗng
      province: "",
      address: "",
      ward: "",
    });
    setExpandedAreas((prev) => [...prev, form.values.areas.length]);
  };

  const handleOpenAreaModal = (index: number) => {
    setEditingAreaIndex(index);
    const gpsString = form.values.areas[index].gps;

    // Logic Parse: String -> Array để hiển thị lên Map
    let parsedCoords: LatLng[] = [];
    try {
      if (gpsString && gpsString.trim() !== "") {
        parsedCoords = JSON.parse(gpsString);
      }
    } catch (error) {
      console.error("Lỗi parse GPS:", error);
      parsedCoords = [];
    }

    setAreaCoords(parsedCoords);
    setLat("");
    setLng("");
    openAddLocation();
  };

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

  const handleSaveAreaMap = () => {
    if (editingAreaIndex !== null) {
      // Logic Stringify: Array -> String để lưu vào Form
      const gpsString = JSON.stringify(areaCoords);
      form.setFieldValue(`areas.${editingAreaIndex}.gps`, gpsString);
    }
    closeAddLocation();
  };

  // --- SUBMIT ---
  const handleSubmit = () => {
    const values = form.getValues();
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Date.now().toString();

    // Chuẩn bị dữ liệu cho Store
    // Lưu ý: Store của bạn đang yêu cầu coords là LatLngPoint[] (Object) cho Region
    // Nhưng form lại lưu string. Ta cần convert cho đúng type của Store.

    const coordsForStore: LatLngPoint[] = regionCoords.map(([la, ln]) => ({
      lat: la,
      lng: ln,
    }));

    const entity: RegionEntity = {
      id,
      region: {
        ...values.region,
        companyIds: companyIds,
        gps: JSON.stringify(regionCoords), // Đảm bảo lưu string vào field gps
      },
      areas: values.areas, // areas.gps đã là string do logic handleSaveAreaMap
      coords: coordsForStore, // Field này dành riêng cho logic hiển thị của Store (nếu có)
    };

    console.log("Submitting Entity:", entity);
    addRegion(entity);
    setActive(4);
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
        <Title order={3}>Thêm mới vùng trồng theo từng bước</Title>
      </Group>

      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={true}
      >
        <Stepper.Step label="Bước 1" description="Vùng trồng" />
        <Stepper.Step label="Bước 2" description="Biểu đồ vùng trồng" />
        <Stepper.Step label="Bước 3" description="Khu vực" />
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
              Thêm vùng trồng mới thành công!
            </Text>
            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Xác nhận
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {/* STEP 0: INFO VÙNG TRỒNG */}
        {active === 0 && (
          <Stack mt="md" gap={"xs"}>
            <TextInput
              radius={4}
              label="Mã vùng (hệ thống)"
              {...form.getInputProps("region.codeSystem")}
              readOnly
              variant="filled"
            />
            <TextInput
              radius={4}
              label="Tên vùng trồng"
              required
              {...form.getInputProps("region.name")}
            />
            <CompanyList
              isMultiple
              value={companyIds}
              onChange={setCompanyIds}
            />
            <NumberInput
              radius={4}
              label="Diện tích (m²)"
              required
              {...form.getInputProps("region.area")}
            />
            <Select
              searchable
              clearable
              radius={4}
              label="Loại đất"
              data={["Đất thịt", "Đất cát", "Đất phù sa"]}
              {...form.getInputProps("region.soilType")}
            />
            <MultiSelect
              searchable
              clearable
              radius={4}
              label="Thông tin địa hình"
              data={["Cao", "Thấp", "Dốc", "Trũng"]}
              {...form.getInputProps("region.terrain")}
            />
            <Textarea
              radius={4}
              label="Ghi chú"
              {...form.getInputProps("region.note")}
            />
            {/* Input GPS ẩn hoặc readOnly để debug */}
            <TextInput
              radius={4}
              label="Dữ liệu GPS (String)"
              {...form.getInputProps("region.gps")}
              readOnly
              variant="filled"
              style={{ display: "none" }}
            />
          </Stack>
        )}

        {/* STEP 1: MAP VÙNG TRỒNG */}
        {active === 1 && (
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
                onClick={handleAddRegionPoint}
                radius={4}
                leftSection={<IconPlus size={16} />}
              >
                Thêm
              </Button>
            </Group>
            {regionCoords.length > 0 && (
              <Stack gap={"xs"}>
                <Text size="sm" c="dimmed">
                  Tọa độ vùng trồng ({regionCoords.length} điểm):
                </Text>
                {regionCoords.map(([la, lo], i) => (
                  <Group key={i} gap="xs">
                    <Text size="sm" w={"40%"}>
                      {i + 1}. {la}, {lo}
                    </Text>
                    <ActionIcon
                      color="red"
                      variant="light"
                      radius={4}
                      onClick={() => handleRemoveRegionPoint(i)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ))}
              </Stack>
            )}
            {regionCoords.length > 0 && regionCoords.length < 3 && (
              <Alert icon={<IconAlertTriangle />} color="yellow" radius={4}>
                Cần ít nhất 3 điểm.
              </Alert>
            )}
            <MapContainer
              center={
                regionCoords.length >= 1
                  ? regionCoords[0]
                  : [10.762622, 106.660172]
              }
              zoom={16}
              style={{ height: "500px", width: "100%", borderRadius: 8 }}
              attributionControl={false}
            >
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
              />
              <MapUpdater coords={regionCoords} />
              <Polygon positions={regionCoords} color="green" weight={2} />
            </MapContainer>
          </Stack>
        )}

        {/* STEP 2: AREAS */}
        {active === 2 && (
          <Stack mt="md" gap={"xs"}>
            {form.values.areas.map((area, areaIdx) => (
              <Card key={areaIdx} withBorder radius={4} p="md" mb="md">
                <Group justify="space-between">
                  <TextInput
                    label="Tên khu vực"
                    placeholder="Nhập tên khu vực"
                    radius={4}
                    {...form.getInputProps(`areas.${areaIdx}.name`)}
                  />
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => toggleArea(areaIdx)}
                  >
                    {expandedAreas.includes(areaIdx) ? "Ẩn" : "Hiện"}
                  </Button>
                </Group>
                <Collapse in={expandedAreas.includes(areaIdx)}>
                  <NumberInput
                    radius={4}
                    label="Diện tích (m²)"
                    {...form.getInputProps(`areas.${areaIdx}.area`)}
                  />
                  <Select
                    searchable
                    clearable
                    radius={4}
                    label="Loại đất"
                    data={["Đất thịt", "Đất cát"]}
                    {...form.getInputProps(`areas.${areaIdx}.soilType`)}
                  />

                  {/* Nút mở Modal Bản đồ */}
                  <Button
                    onClick={() => handleOpenAreaModal(areaIdx)}
                    my={"sm"}
                    radius={4}
                    w={"100%"}
                    variant="outline"
                    leftSection={<IconMap />}
                  >
                    {form.values.areas[areaIdx].gps
                      ? "Đã có bản đồ (Chỉnh sửa)"
                      : "Tạo bản đồ khu vực"}
                  </Button>

                  <Group mt={"xs"}>
                    <Button
                      radius={4}
                      color="red"
                      onClick={() => form.removeListItem("areas", areaIdx)}
                    >
                      Xoá
                    </Button>
                  </Group>
                </Collapse>
              </Card>
            ))}
            <Button radius={4} variant="outline" onClick={handleAddArea}>
              + Thêm khu vực
            </Button>

            {/* MODAL AREA MAP */}
            <Modal
              opened={openedAddLocation}
              onClose={closeAddLocation}
              title={<Text fw={"bold"}>Bản đồ khu vực</Text>}
              size="lg"
            >
              <Stack mt="md" gap={"xs"}>
                <Group align="flex-end">
                  <TextInput
                    label="Latitude"
                    value={lat}
                    onChange={(e) => setLat(e.currentTarget.value)}
                    placeholder="Lat"
                    radius={4}
                    flex={1}
                  />
                  <TextInput
                    label="Longitude"
                    value={lng}
                    onChange={(e) => setLng(e.currentTarget.value)}
                    placeholder="Lng"
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
                      Đang vẽ ({areaCoords.length} điểm):
                    </Text>
                    {areaCoords.map(([la, lo], i) => (
                      <Group key={i} gap="xs">
                        <Text size="sm">
                          {i + 1}. {la}, {lo}
                        </Text>
                        <ActionIcon
                          color="red"
                          variant="light"
                          size="sm"
                          onClick={() => handleRemoveAreaPoint(i)}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Group>
                    ))}
                  </Stack>
                )}

                {areaCoords.length > 0 && areaCoords.length < 3 && (
                  <Alert icon={<IconAlertTriangle />} color="yellow" radius={4}>
                    Cần ít nhất 3 điểm.
                  </Alert>
                )}

                <MapContainer
                  center={
                    areaCoords.length >= 1
                      ? areaCoords[0]
                      : regionCoords[0] || [10.762622, 106.660172]
                  }
                  zoom={16}
                  style={{ height: "400px", width: "100%", borderRadius: 8 }}
                  attributionControl={false}
                >
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles &copy; Esri"
                  />
                  <MapUpdater coords={areaCoords} />
                  {/* Hiển thị vùng lớn mờ để tham chiếu */}
                  {regionCoords.length > 0 && (
                    <Polygon
                      positions={regionCoords}
                      color="green"
                      weight={1}
                      fillOpacity={0.1}
                    />
                  )}
                  {/* Hiển thị khu vực đang vẽ */}
                  <Polygon positions={areaCoords} color="blue" />
                </MapContainer>
                {areaCoords.length > 0 && areaCoords.length < 3 && (
                  <Alert icon={<IconAlertTriangle />} color="yellow" radius={4}>
                    Cần ít nhất 3 điểm.
                  </Alert>
                )}
                <Group justify="flex-end" mt="md">
                  <Button variant="default" onClick={closeAddLocation}>
                    Hủy
                  </Button>
                  <Button onClick={handleSaveAreaMap}>Lưu bản đồ</Button>
                </Group>
              </Stack>
            </Modal>
          </Stack>
        )}

        {/* STEP 3: CONFIRM */}
        {active === 3 && (
          <ConfirmStep
            // Basic Info
            code={form.values.region.codeSystem}
            govCode={form.values.region.codeGov}
            name={form.values.region.name || "Chưa đặt tên vùng"}
            farmer={
              companyIds.length > 0 ? "Đã chọn doanh nghiệp" : "Chưa chọn"
            } // Or map company names if you have them
            size={Number(form.values.region.area) || 0}
            // Soil & Terrain
            soilType={form.values.region.soilType || "Chưa chọn"}
            terrain={
              Array.isArray(form.values.region.terrain)
                ? form.values.region.terrain.join(", ")
                : "Chưa chọn"
            }
            note={form.values.region.note}
            // Map Data: Transform [lat, lng] array to {lat, lng} object array
            gps={regionCoords.map(([lat, lng]) => ({ lat, lng }))}
            // Area List Mapping
            zones={form.values.areas.map((area, idx) => ({
              name: area.name || `Khu vực ${idx + 1}`,
              area: area.area || "0",
              soilType: area.soilType || "Chưa chọn",
              terrain: Array.isArray(area.terrain)
                ? area.terrain.join(", ")
                : "Chưa chọn",
            }))}
          />
        )}
        {/* NAV BUTTONS */}
        {active < 4 && (
          <Group mt="xl" justify="space-between">
            <Button
              radius={4}
              onClick={prevStep}
              disabled={active === 0}
              variant="default"
            >
              Quay lại
            </Button>
            <Button radius={4} onClick={active === 3 ? handleSubmit : nextStep}>
              {active === 3 ? "Hoàn thành" : "Tiếp tục"}
            </Button>
          </Group>
        )}
      </form>
    </Card>
  );
};

export default MapManagementAddRegionPage;
