import {
  Button,
  Card,
  Group,
  Stack,
  Title,
  Select,
  TextInput,
  Stepper,
  Text,
  ActionIcon,
  Alert,
  NumberInput,
  Badge,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
type LatLng = [number, number];

const AreaManagementBlockAddPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
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
  const form = useForm({
    initialValues: {
      regionId: "",
      areaId: "",
      code: "",
      name: "",
      area: "",
      mainCrops: [],
      irrigation: "",
      farming: "",
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
  const handleSubmit = () => {
    console.log("✅ Dữ liệu lô & hàng:", form.values);
  };

  const addRow = () => {
    form.insertListItem("rows", {
      name: "",
      code: "",
      crop: "",
      treeCount: "",
      gps: "",
    });
  };

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
        <Title order={3}>📋 Tạo mới Lô và Hàng</Title>
      </Group>

      <Stepper
        active={activeStep}
        onStepClick={setActiveStep}
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="Vùng trồng" />
        <Stepper.Step label="Khu vực" />
        <Stepper.Step label="Tạo lô" />
        <Stepper.Step label="Bản đồ lô" />
        <Stepper.Step label="Tạo hàng" />
      </Stepper>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {activeStep === 0 && (
          <Stack mt="md">
            <Select
              label="Chọn vùng trồng"
              placeholder="Chọn vùng"
              data={["RG001 - Vùng A", "RG002 - Vùng B"]}
              {...form.getInputProps("regionId")}
              radius={4}
            />
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack mt="md">
            <Select
              label="Chọn khu vực"
              placeholder="Chọn khu vực"
              data={["KV001 - Khu vực A1", "KV002 - Khu vực B1"]}
              {...form.getInputProps("areaId")}
              radius={4}
            />
          </Stack>
        )}

        {activeStep === 2 && (
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
            {/**Auto fill  */}
            <Stack gap={"xs"}>
              <Text fw={"500"} fz={14}>
                Cây trồng chính
              </Text>
              <Group>
                {["Sầu riêng", "Xoài", "Mãng cầu", "Chuối"].map((item) => (
                  <Badge size="md" radius={100}>
                    {item}
                  </Badge>
                ))}
              </Group>
            </Stack>
            {/**Nếu là xen canh thì giống cây 1-n, ngược lại 1-1*/}
            <Select
              label="Phương pháp canh tác"
              data={["Xen canh", "Truyền thống", "Công nghệ cao"]}
              {...form.getInputProps("farming")}
              radius={4}
            />
            <Stack gap={"xs"}>
              <Group>
                <Text fw={"500"} fz={14}>
                  {form.getValues().farming === "Xen canh"
                    ? "Danh danh sách cây trồng"
                    : "Thông tin cây trồng"}
                </Text>
                {form.getValues().farming === "Xen canh" && (
                  <Button radius={4}>Thêm mới</Button>
                )}
              </Group>
              <Group>
                <Card w={300}>
                  <Stack gap={"xs"}>
                    {/**Chọn từ cây trồng */}
                    <Select
                      searchable
                      label="Giống cây"
                      data={["Giống A", "Giống B"]}
                      radius={4}
                    />
                    <Select
                      searchable
                      label="Hạt giống"
                      data={["Hạt giống A", "Hạt giống B"]}
                      radius={4}
                    />
                    <Select
                      label="Phương pháp tưới tiêu"
                      data={["Tưới nhỏ giọt", "Tưới phun mưa", "Tưới tràn"]}
                      {...form.getInputProps("irrigation")}
                      radius={4}
                    />
                  </Stack>
                </Card>
                {form.getValues().farming === "Xen canh" && (
                  <Card w={300}>
                    <Stack gap={"xs"}>
                      {/**Chọn từ cây trồng */}
                      <Select
                        searchable
                        label="Giống cây"
                        data={["Giống A", "Giống B"]}
                        radius={4}
                      />
                      <Select
                        searchable
                        label="Hạt giống"
                        data={["Hạt giống A", "Hạt giống B"]}
                        radius={4}
                      />
                      <Select
                        label="Phương pháp tưới tiêu"
                        data={["Tưới nhỏ giọt", "Tưới phun mưa", "Tưới tràn"]}
                        {...form.getInputProps("irrigation")}
                        radius={4}
                      />
                    </Stack>
                  </Card>
                )}
              </Group>
            </Stack>

            <TextInput label="Thông tin dường bình độ" radius={4} />
            <NumberInput label="Cao độ (m)" radius={4} />
          </Stack>
        )}
        {activeStep === 3 && (
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
                    <ActionIcon color="red" variant="light" radius={4}>
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
        {activeStep === 4 && (
          <Stack mt="md">
            {form.values.rows.map((row, index) => (
              <Card key={index} p="md" radius={4} withBorder>
                <Stack gap={"xs"}>
                  <TextInput
                    label="Tên hàng"
                    radius={4}
                    {...form.getInputProps(`rows.${index}.name`)}
                  />
                  {/**Cây trồng filter trước */}
                  <Stack gap={"xs"}>
                    <Text fw={"500"} fz={14}>
                      Cây trồng
                    </Text>
                    <Group>
                      {["Sầu riêng", "Xoài", "Mãng cầu", "Chuối"].map(
                        (item) => (
                          <Badge size="md" radius={100}>
                            {item}
                          </Badge>
                        )
                      )}
                    </Group>
                  </Stack>
                  <Stack gap={"xs"}>
                    <Text fw={"500"} fz={14}>
                      Giống cây
                    </Text>
                    <Group>
                      {["Giống cây A", "Giống cây B"].map((item) => (
                        <Badge size="md" radius={100}>
                          {item}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                  {form.getValues().farming === "Xen canh" && (
                    <Select
                      radius={4}
                      label="Chọn hạt giống cây"
                      data={["Giống A", "Giống B"]}
                      {...form.getInputProps(`rows.${index}.crop`)}
                    />
                  )}
                  <TextInput
                    radius={4}
                    label="Số lượng cây"
                    type="number"
                    {...form.getInputProps(`rows.${index}.treeCount`)}
                  />
                </Stack>
              </Card>
            ))}
            <Button radius={4} variant="light" mt="md" onClick={addRow}>
              + Thêm hàng
            </Button>
          </Stack>
        )}

        <Group justify="space-between" mt="xl">
          <Button
            variant="default"
            radius={4}
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => prev - 1)}
          >
            Quay lại
          </Button>
          {activeStep < 4 ? (
            <Button
              radius={4}
              onClick={() => setActiveStep((prev) => prev + 1)}
            >
              Tiếp theo
            </Button>
          ) : (
            <Button radius={4} color="green">
              Lưu
            </Button>
          )}
        </Group>
      </form>
    </Card>
  );
};

export default AreaManagementBlockAddPage;
