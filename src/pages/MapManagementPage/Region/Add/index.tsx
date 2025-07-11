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
import { useState } from "react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
type LatLng = [number, number];

const MapManagementAddRegionPage = () => {
  const [
    openedAddLocation,
    { open: openAddLocation, close: closeAddLocation },
  ] = useDisclosure(false);
  const navigate = useNavigate();
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [coords, setCoords] = useState<LatLng[]>([]);
  const [active, setActive] = useState(0);
  const [expandedAreas, setExpandedAreas] = useState<number[]>([]);

  const toggleArea = (index: number) => {
    setExpandedAreas((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const form = useForm({
    initialValues: {
      region: {
        codeSystem: "",
        codeGov: "",
        name: "",
        area: "",
        soilType: "",
        terrain: [],
        gps: "",
        note: "",
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
          gps: "",
        },
      ],
    },
  });

  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

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
      gps: "",
    });
    setExpandedAreas((prev) => [...prev, form.values.areas.length]);
  };

  const handleSubmit = () => {
    console.log("✅ Dữ liệu toàn bộ:", form.values);
  };
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
      </Stepper>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {active === 0 && (
          <Stack mt="md" gap={"xs"}>
            <TextInput
              radius={4}
              label="Mã vùng (hệ thống)"
              {...form.getInputProps("region.codeSystem")}
              disabled
            />
            <TextInput
              radius={4}
              label="Mã vùng (định danh nhà nước)"
              {...form.getInputProps("region.codeGov")}
            />
            <TextInput
              radius={4}
              label="Tên vùng trồng"
              required
              {...form.getInputProps("region.name")}
            />
            <Select
              radius={4}
              label="Doanh nghiệp / Hộ nông dân"
              searchable
              data={["Doanh nghiệp A - XXXX", "Nông hộ B - X01"]}
              {...form.getInputProps("region.orgUnit")}
            />
            <NumberInput
              radius={4}
              label="Diện tích (m²)"
              required
              {...form.getInputProps("region.area")}
            />
            <Select
              radius={4}
              label="Loại đất"
              data={["Đất thịt", "Đất cát", "Đất phù sa"]}
              {...form.getInputProps("region.soilType")}
            />
            <MultiSelect
              radius={4}
              label="Thông tin địa hình"
              data={["Cao", "Thấp", "Dốc", "Trũng"]}
              {...form.getInputProps("region.terrain")}
            />
            <Textarea
              radius={4}
              label="Toạ độ GPS (đa giác)"
              {...form.getInputProps("region.gps")}
            />
            <Textarea
              radius={4}
              label="Ghi chú"
              {...form.getInputProps("region.note")}
            />
          </Stack>
        )}
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
            {/* Cảnh báo nếu không đủ 3 điểm */}
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
        )}
        {active === 2 && (
          <Stack mt="md" gap={"xs"}>
            {form.values.areas.map((area, areaIdx) => (
              <Card key={areaIdx} withBorder radius={4} p="md" mb="md">
                <Group justify="space-between">
                  <TextInput
                    label="Nhập tên khu vực"
                    placeholder="Nhập tên khu vực"
                    defaultValue={`Khu vực ${areaIdx + 1}`}
                    radius={4}
                  />
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => toggleArea(areaIdx)}
                  >
                    {expandedAreas.includes(areaIdx) ? "Ẩn" : "Hiện"} khu vực
                  </Button>
                </Group>
                <Collapse in={expandedAreas.includes(areaIdx)}>
                  <NumberInput
                    radius={4}
                    label="Diện tích"
                    {...form.getInputProps(`areas.${areaIdx}.area`)}
                  />

                  <Select
                    radius={4}
                    label="Loại đất"
                    data={["Đất thịt", "Đất cát", "Đất phù sa"]}
                    {...form.getInputProps(`areas.${areaIdx}.soilType`)}
                  />
                  <MultiSelect
                    radius={4}
                    label="Địa hình"
                    data={["Cao", "Thấp", "Trũng"]}
                    {...form.getInputProps(`areas.${areaIdx}.terrain`)}
                  />

                  <Button
                    onClick={openAddLocation}
                    my={"sm"}
                    radius={4}
                    w={"100%"}
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
                </Collapse>
              </Card>
            ))}
            <Button radius={4} variant="outline" onClick={handleAddArea}>
              + Thêm khu vực
            </Button>
          </Stack>
        )}

        <Group mt="xl" justify="space-between">
          <Button
            radius={4}
            onClick={prevStep}
            disabled={active === 0}
            variant="default"
          >
            Quay lại
          </Button>
          {active < 2 ? (
            <Button radius={4} onClick={nextStep}>
              Tiếp theo
            </Button>
          ) : (
            <Button radius={4} type="submit" color="green">
              Lưu toàn bộ
            </Button>
          )}
        </Group>
      </form>
      <Modal
        opened={openedAddLocation}
        onClose={closeAddLocation}
        title={<Text fw={"bold"}>Bản đồ khu vực</Text>}
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
          {/* Cảnh báo nếu không đủ 3 điểm */}
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
    </Card>
  );
};

export default MapManagementAddRegionPage;
