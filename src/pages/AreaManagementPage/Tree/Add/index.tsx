import {
  Stepper,
  Button,
  Group,
  Select,
  Stack,
  TextInput,
  ActionIcon,
  Card,
  Title,
  Text,
  ThemeIcon,
  Input,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconLeaf,
  IconPhoto,
  IconPlant,
  IconPlus,
  IconSeeding,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import ConfirmStep from "./components/ConfirmStep";
const regions = [
  {
    value: "R01",
    label: "Vùng A",
    areas: [
      {
        value: "A01",
        label: "Khu vực A1",
        plots: [
          {
            value: "P001",
            label: "Lô A1 - Vùng A",
            rows: [
              { value: "R001", label: "Hàng 1 - Lô A1" },
              { value: "R002", label: "Hàng 2 - Lô A1" },
            ],
          },
        ],
      },
      {
        value: "A02",
        label: "Khu vực A2",
        plots: [
          {
            value: "P002",
            label: "Lô A2 - Vùng A",
            rows: [{ value: "R003", label: "Hàng 1 - Lô A2" }],
          },
        ],
      },
    ],
  },
  {
    value: "R02",
    label: "Vùng B",
    areas: [
      {
        value: "A03",
        label: "Khu vực B1",
        plots: [
          {
            value: "P003",
            label: "Lô B1 - Vùng B",
            rows: [
              { value: "R004", label: "Hàng 1 - Lô B1" },
              { value: "R005", label: "Hàng 2 - Lô B1" },
            ],
          },
        ],
      },
    ],
  },
];
type LatLng = [number, number];

const AreaManagementTreeAddPage = () => {
  const [treeId, setTreeId] = useState<number | null>(null);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [coords, setCoords] = useState<LatLng[]>([]);

  const form = useForm({
    initialValues: {
      selectType: "plot",
      region: "",
      area: "",
      plot: "",
      row: "",
      plantedAt: "",
      trees: [{ gps: "" }],
    },
  });

  const [plotInfo] = useState({
    treeType: "Sầu riêng Ri6",
    method: "Trồng theo hố, cách 6m",
  });

  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  // Vùng
  const regionOptions = regions.map((r) => ({
    value: r.value,
    label: r.label,
  }));
  const selectedRegion = regions.find((r) => r.value === form.values.region);

  // Khu vực
  const areaOptions = useMemo(() => {
    return (
      selectedRegion?.areas.map((a) => ({ value: a.value, label: a.label })) ||
      []
    );
  }, [form.values.region]);

  const selectedArea = selectedRegion?.areas.find(
    (a) => a.value === form.values.area
  );

  // Lô
  const plotOptions = useMemo(() => {
    return (
      selectedArea?.plots.map((p) => ({ value: p.value, label: p.label })) || []
    );
  }, [form.values.area]);

  const selectedPlot = selectedArea?.plots.find(
    (p) => p.value === form.values.plot
  );
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
  // Hàng
  const rowOptions = useMemo(() => {
    return (
      selectedPlot?.rows.map((r) => ({ value: r.value, label: r.label })) || []
    );
  }, [form.values.plot]);

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
        <Title order={3}>Thêm mới cây</Title>
      </Group>
      <form>
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
        >
          {/* STEP 1: CHỌN LÔ / HÀNG */}
          <Stepper.Step label="Bước 1" description="Vị trí trồng">
            <Stack>
              <Select
                label="Vùng"
                placeholder="Chọn vùng"
                data={regionOptions}
                {...form.getInputProps("region")}
                radius={4}
                onChange={(value) => {
                  form.setValues({
                    region: value!,
                    area: "",
                    plot: "",
                    row: "",
                  });
                }}
                required
              />

              <Select
                label="Khu vực"
                placeholder="Chọn khu vực"
                data={areaOptions}
                {...form.getInputProps("area")}
                radius={4}
                onChange={(value) => {
                  form.setValues({
                    ...form.values,
                    area: value!,
                    plot: "",
                    row: "",
                  });
                }}
                disabled={!form.values.region}
                required
              />

              <Select
                label="Lô"
                placeholder="Chọn lô"
                radius={4}
                data={plotOptions}
                {...form.getInputProps("plot")}
                onChange={(value) => {
                  form.setValues({ ...form.values, plot: value!, row: "" });
                }}
                disabled={!form.values.area}
                required
              />

              <Select
                label="Hàng"
                placeholder="Chọn hàng"
                radius={4}
                data={rowOptions}
                {...form.getInputProps("row")}
                disabled={!form.values.plot}
              />
              <TextInput
                label="Ngày trồng"
                type="date"
                radius={4}
                {...form.getInputProps("plantedAt")}
              />

              <Group justify="flex-end" mt="md">
                <Button onClick={nextStep} radius={4}>
                  Tiếp theo
                </Button>
              </Group>
            </Stack>
          </Stepper.Step>

          {/* STEP 2: XEM THÔNG TIN */}
          <Stepper.Step label="Bước 2" description="Cây trồng">
            <Stack>
              <Stack>
                <Select
                  label="Phương pháp canh tác"
                  radius={4}
                  value={plotInfo.method}
                  data={[
                    { value: "hole_6m", label: "Trồng theo hố, cách 6m" },
                    { value: "line_3m", label: "Trồng theo hàng, cách 3m" },
                    { value: "random", label: "Trồng tự do" },
                  ]}
                  readOnly
                />
                <Select
                  label="Phương pháp tưới tiêu"
                  radius={4}
                  value={plotInfo.method}
                  data={[
                    { value: "hole_6m", label: "Trồng theo hố, cách 6m" },
                    { value: "line_3m", label: "Trồng theo hàng, cách 3m" },
                    { value: "random", label: "Trồng tự do" },
                  ]}
                  readOnly
                />
                <Text fw={"500"} fz={14}>
                  Danh sách cây trồng
                </Text>

                <Group>
                  <Card
                    w={200}
                    radius="md"
                    withBorder
                    shadow="sm"
                    padding="lg"
                    style={{
                      transition: "box-shadow 0.25s ease, transform 0.25s ease",
                      cursor: "default",
                      borderColor: treeId === 1 ? "green" : undefined,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(0,0,0,0.08)";
                      e.currentTarget.style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "var(--mantine-shadow-sm)";
                      e.currentTarget.style.transform = "none";
                    }}
                    onClick={() => setTreeId(1)}
                  >
                    <Stack gap="sm">
                      <Group align="flex-start">
                        <ThemeIcon
                          variant="light"
                          color="green"
                          size="lg"
                          radius="xl"
                        >
                          <IconPlant size={20} />
                        </ThemeIcon>
                        <Stack gap={0} style={{ flex: 1 }}>
                          <Text size="sm" c="dimmed">
                            Loại cây trồng
                          </Text>
                          <Text fw={500}>Cây sầu riêng</Text>
                        </Stack>
                      </Group>

                      <Group align="flex-start">
                        <ThemeIcon
                          variant="light"
                          color="teal"
                          size="lg"
                          radius="xl"
                        >
                          <IconLeaf size={20} />
                        </ThemeIcon>
                        <Stack gap={0} style={{ flex: 1 }}>
                          <Text size="sm" c="dimmed">
                            Giống cây
                          </Text>
                          <Text fw={500}>Sầu riêng Ri6</Text>
                        </Stack>
                      </Group>

                      <Group align="flex-start">
                        <ThemeIcon
                          variant="light"
                          color="lime"
                          size="lg"
                          radius="xl"
                        >
                          <IconSeeding size={20} />
                        </ThemeIcon>
                        <Stack gap={0} style={{ flex: 1 }}>
                          <Text size="sm" c="dimmed">
                            Hạt giống
                          </Text>
                          <Text fw={500}>Hạt giống Ri6 F1</Text>
                        </Stack>
                      </Group>
                    </Stack>
                  </Card>
                  <Card
                    radius="md"
                    withBorder
                    shadow="sm"
                    padding="lg"
                    style={{
                      transition: "box-shadow 0.25s ease, transform 0.25s ease",
                      cursor: "default",
                      borderColor: treeId === 2 ? "green" : undefined,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(0,0,0,0.08)";
                      e.currentTarget.style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "var(--mantine-shadow-sm)";
                      e.currentTarget.style.transform = "none";
                    }}
                    w={200}
                    onClick={() => setTreeId(2)}
                  >
                    <Stack gap="sm">
                      <Group align="flex-start">
                        <ThemeIcon
                          variant="light"
                          color="green"
                          size="lg"
                          radius="xl"
                        >
                          <IconPlant size={20} />
                        </ThemeIcon>
                        <Stack gap={0} style={{ flex: 1 }}>
                          <Text size="sm" c="dimmed">
                            Loại cây trồng
                          </Text>
                          <Text fw={500}>Cây cà phê</Text>
                        </Stack>
                      </Group>

                      <Group align="flex-start">
                        <ThemeIcon
                          variant="light"
                          color="teal"
                          size="lg"
                          radius="xl"
                        >
                          <IconLeaf size={20} />
                        </ThemeIcon>
                        <Stack gap={0} style={{ flex: 1 }}>
                          <Text size="sm" c="dimmed">
                            Giống cây
                          </Text>
                          <Text fw={500}>Cà phê</Text>
                        </Stack>
                      </Group>

                      <Group align="flex-start">
                        <ThemeIcon
                          variant="light"
                          color="lime"
                          size="lg"
                          radius="xl"
                        >
                          <IconSeeding size={20} />
                        </ThemeIcon>
                        <Stack gap={0} style={{ flex: 1 }}>
                          <Text size="sm" c="dimmed">
                            Hạt giống
                          </Text>
                          <Text fw={500}>Hạt giống F1</Text>
                        </Stack>
                      </Group>
                    </Stack>
                  </Card>
                </Group>
                <Input.Wrapper label="Hình ảnh cây trồng">
                  <Dropzone
                    onDrop={(files) => console.log("accepted files", files)}
                    onReject={(files) => console.log("rejected files", files)}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                  >
                    <Group
                      justify="center"
                      gap="xl"
                      mih={220}
                      style={{ pointerEvents: "none" }}
                    >
                      <Dropzone.Accept>
                        <IconUpload
                          size={52}
                          color="var(--mantine-color-blue-6)"
                          stroke={1.5}
                        />
                      </Dropzone.Accept>
                      <Dropzone.Reject>
                        <IconX
                          size={52}
                          color="var(--mantine-color-red-6)"
                          stroke={1.5}
                        />
                      </Dropzone.Reject>
                      <Dropzone.Idle>
                        <IconPhoto
                          size={52}
                          color="var(--mantine-color-dimmed)"
                          stroke={1.5}
                        />
                      </Dropzone.Idle>

                      <div>
                        <Text size="xl" inline>
                          Kéo hoặc chọn ảnh tại đây
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          Đính kèm file ảnh dưới 5Mb
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                </Input.Wrapper>
              </Stack>

              <Group justify="space-between" mt="md">
                <Button variant="default" onClick={prevStep}>
                  Quay lại
                </Button>
                <Button onClick={nextStep} radius={4}>
                  Tiếp theo
                </Button>
              </Group>
            </Stack>
          </Stepper.Step>

          {/* STEP 3: NHẬP TOẠ ĐỘ */}
          <Stepper.Step label="Bước 3" description="Định vị GPS">
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
              Bản đồ Leaflet với polygon
              <MapContainer
                center={
                  coords.length >= 1 ? coords[0] : [10.762622, 106.660172]
                }
                zoom={16}
                style={{ height: "300px", width: "100%", borderRadius: 8 }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polygon positions={coords} color="green" />
              </MapContainer>
              <Group justify="space-between" mt="md">
                <Button variant="default" onClick={prevStep} radius={4}>
                  Quay lại
                </Button>
                <Button onClick={nextStep} radius={4}>
                  Tiếp theo
                </Button>
              </Group>
            </Stack>
          </Stepper.Step>
          <Stepper.Step label="Bước 4" description="Xác nhận">
            <ConfirmStep
              area="Vùng Tây Nguyên"
              zone="Khu A1"
              block="Lô 05"
              row="Hàng 3"
              plantingDate="12/07/2025"
              farmingMethod="Hữu cơ"
              irrigation="Tưới nhỏ giọt"
              tree={{
                type: "Cây sầu riêng",
                variety: "Sầu riêng Ri6",
                seed: "Hạt giống Ri6 F1",
              }}
              locations={[
                { lat: 10.762622, lng: 106.660172 },
                { lat: 10.7627, lng: 106.66018 },
                { lat: 10.76275, lng: 106.66022 },
              ]}
              imageUrls={[
                "https://sauriengoi.vn/wp-content/uploads/2023/08/AdobeStock-93Q2EVldRH-e1697079899709.jpg",
              ]}
            />
            <Group justify="space-between" mt="md">
              <Button variant="default" onClick={prevStep} radius={4}>
                Quay lại
              </Button>
              <Button onClick={nextStep} radius={4}>
                Tiếp theo
              </Button>
            </Group>
          </Stepper.Step>
        </Stepper>
      </form>
    </Card>
  );
};

export default AreaManagementTreeAddPage;
