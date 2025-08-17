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
import { useState } from "react";
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
  const [form, setForm] = useState<AreaForm>(defaultForm);
  const [active, setActive] = useState(0);
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [coords, setCoords] = useState<LatLng[]>([]);

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

  const nextStep = () => setActive((cur) => Math.min(cur + 1, 4));
  const prevStep = () => setActive((cur) => Math.max(cur - 1, 0));

  const handleChange = <K extends keyof AreaForm>(
    key: K,
    value: AreaForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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
              />
              <RegionCardSelector
                regions={regionOptions}
                selected={"12"}
                onSelect={() => {}}
              />
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
              onChange={(value) => handleChange("area", +value || 0)}
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
                  <Text>Khu vực D4</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>Diện tích:</Text>
                  <Text>11200 m²</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>Loại đất:</Text>
                  <Text>Đất đỏ</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>Địa hình:</Text>
                  <Text>Bằng phẳng</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>Đơn vị quản lý:</Text>
                  <Text>Công ty Nông sản Nam Bộ</Text>
                </Group>
              </Stack>
            </Card>

            <Card withBorder radius="md" padding="md">
              <Stack gap="xs">
                <Title order={5}>🧭 Toạ độ khu vực</Title>
                {coords.length >= 3 ? (
                  coords.map(([lat, lng], i) => (
                    <Text size="sm" key={i}>
                      {i + 1}. Lat: {lat} – Lng: {lng}
                    </Text>
                  ))
                ) : (
                  <Text size="sm" c="red">
                    ⚠ Chưa đủ điểm để tạo đa giác!
                  </Text>
                )}
              </Stack>
            </Card>

            {/* Optional: Preview mini bản đồ nếu muốn */}
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
    </Paper>
  );
};

export default MapManagementAddAreaPage;
