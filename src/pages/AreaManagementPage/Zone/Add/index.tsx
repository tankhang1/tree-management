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
} from "@mantine/core";
import { useState } from "react";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { IconAlertTriangle, IconPlus, IconTrash } from "@tabler/icons-react";

type AreaForm = {
  code: string;
  name: string;
  area: number;
  soilType: string;
  terrain: string[];
  mainCrop: string;
  orgUnit: string;
  employee: string;
  gps: string;
};

const defaultForm: AreaForm = {
  code: "",
  name: "",
  area: 0,
  soilType: "",
  terrain: [],
  mainCrop: "",
  orgUnit: "",
  employee: "",
  gps: "",
};
type LatLng = [number, number];

const AreaManagementAddZonePage = () => {
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

  const nextStep = () => setActive((cur) => Math.min(cur + 1, 3));
  const prevStep = () => setActive((cur) => Math.max(cur - 1, 0));

  const handleChange = <K extends keyof AreaForm>(
    key: K,
    value: AreaForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Paper shadow="md" radius={8} p="xl" withBorder>
      <Title order={3} mb="md">
        Tạo mới khu vực trồng
      </Title>

      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
      >
        {/* BƯỚC 1 */}
        <Stepper.Step label="Thông tin">
          <Stack gap="xs" mt="md">
            <Select
              placeholder="Chọn vùng trồng"
              label="Chọn vùng trồng"
              radius={4}
            />
            <TextInput
              label="Mã khu vực"
              radius={4}
              required
              value={form.code}
              onChange={(e) => handleChange("code", e.currentTarget.value)}
            />
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
              label="Loại đất"
              radius={4}
              data={["Đất thịt", "Đất cát", "Đất đỏ", "Đất sét"]}
              value={form.soilType}
              onChange={(value) => handleChange("soilType", value || "")}
              placeholder="Chọn loại đất"
            />
            <Select label="Cây trồng chính" radius={4} value={form.mainCrop} />
            <MultiSelect
              label="Địa hình"
              radius={4}
              data={["Cao", "Thấp", "Dốc", "Bằng phẳng"]}
              value={form.terrain}
              onChange={(value) => handleChange("terrain", value)}
              placeholder="Chọn nhiều địa hình"
            />
            <Select label="Đơn vị quản lý" radius={4} value={form.orgUnit} />
            <Select
              label="Nhân viên phụ trách"
              radius={4}
              value={form.employee}
            />
          </Stack>
        </Stepper.Step>

        {/* BƯỚC 2 */}
        <Stepper.Step label="Tọa độ GPS">
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

            {/* Bản đồ Leaflet với polygon */}
            {coords.length >= 3 && (
              <MapContainer
                center={coords[0]}
                zoom={16}
                style={{ height: "300px", width: "100%", borderRadius: 8 }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polygon positions={coords} color="green" />
              </MapContainer>
            )}
          </Stack>
        </Stepper.Step>

        {/* BƯỚC 3 */}
        <Stepper.Step label="Lô">
          <Text mt="md">
            Bạn có thể thêm danh sách lô sau khi tạo khu vực thành công.
          </Text>
        </Stepper.Step>

        {/* BƯỚC 4 */}
        <Stepper.Step label="Xác nhận">
          <Stack gap={4} mt="md">
            <Text>
              <b>Mã:</b> {form.code}
            </Text>
            <Text>
              <b>Tên:</b> {form.name}
            </Text>
            <Text>
              <b>Diện tích:</b> {form.area.toLocaleString()} m²
            </Text>
            <Text>
              <b>Loại đất:</b> {form.soilType}
            </Text>
            <Text>
              <b>Cây trồng chính:</b> {form.mainCrop}
            </Text>
            <Text>
              <b>Địa hình:</b> {form.terrain.join(", ")}
            </Text>
            <Text>
              <b>Đơn vị:</b> {form.orgUnit}
            </Text>
            <Text>
              <b>Nhân viên:</b> {form.employee}
            </Text>
            <Text>
              <b>GPS:</b> {form.gps}
            </Text>
          </Stack>
        </Stepper.Step>
      </Stepper>

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
          <Button
            radius={4}
            color="green"
            onClick={() => console.log("Submitted", form)}
          >
            Hoàn tất
          </Button>
        )}
      </Group>
    </Paper>
  );
};

export default AreaManagementAddZonePage;
