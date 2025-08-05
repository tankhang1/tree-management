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
  NumberInput,
  Modal,
  Image,
  Radio,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconLeaf,
  IconPlant,
  IconPlus,
  IconSearch,
  IconSeeding,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import ConfirmStep from "./components/ConfirmStep";
import RegionCardSelector from "../../Row/Add/components/RegionCards";
import { regionOptions } from "../../Block/Add";
import AreaCards from "../../Zone/Add/components/AreaCards";
import { areaOptions, plotOptions } from "../../Row/Add";
import PlotCardSelector from "../../Row/Add/components/PlotCards";

type LatLng = [number, number];

const AreaManagementTreeAddPage = () => {
  const [treeId, setTreeId] = useState<number>();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [coords, setCoords] = useState<LatLng[]>([]);
  const [openedTreeMap, setOpenTreeMap] = useState(false);
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

  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleAddPoint = () => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      setCoords((prev) => [...prev, [parsedLat, parsedLng]]);
      setLat("");
      setLng("");
    }
  };
  const handleSelectTree = (id: number) => {
    setTreeId(id);
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
        <Title order={3}>Thêm mới phân bổ cây trồng</Title>
      </Group>
      <form>
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
        >
          {/* STEP 1: Lô / HÀNG */}
          <Stepper.Step label="Bước 1" description="Vị trí trồng">
            <Stack>
              <Stack gap={"xs"}>
                <TextInput
                  label="Vùng trồng"
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
              <Stack gap={"xs"}>
                <TextInput
                  label="Khu vực"
                  placeholder="Tìm kiếm khu vực"
                  radius={4}
                  leftSection={<IconSearch size={18} />}
                />
                <AreaCards
                  areas={areaOptions}
                  selected={""}
                  onSelect={() => {}}
                />
              </Stack>

              <Stack gap={"xs"}>
                <TextInput
                  label="Lô"
                  placeholder="Tìm kiếm lô"
                  radius={4}
                  leftSection={<IconSearch size={18} />}
                />
                <PlotCardSelector
                  lots={plotOptions}
                  selected={""}
                  onSelect={() => {}}
                />
              </Stack>

              {/* <Select
                label="Hàng"
                placeholder="Hàng"
                radius={4}
                data={rowOptions}
                {...form.getInputProps("row")}
                readOnly={!form.values.plot}
              /> */}

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
              <Card withBorder radius={4}>
                <Stack>
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
                        transition:
                          "box-shadow 0.25s ease, transform 0.25s ease",
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
                      onClick={() => handleSelectTree(1)}
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
                            color="green"
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
                        transition:
                          "box-shadow 0.25s ease, transform 0.25s ease",
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
                      onClick={() => handleSelectTree(2)}
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
                            color="green"
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
                  <Radio.Group label="Phân bổ cây trồng" mt="md">
                    <Stack mt={"xs"}>
                      <Radio
                        value="plot"
                        label="Phân bổ theo lô"
                        checked={form.values.selectType === "plot"}
                        onChange={() =>
                          form.setFieldValue("selectType", "plot")
                        }
                      />
                      <Radio
                        value="row"
                        label="Phân bổ theo hàng"
                        checked={form.values.selectType === "row"}
                        onChange={() => form.setFieldValue("selectType", "row")}
                      />
                    </Stack>
                  </Radio.Group>
                  {form.values.selectType === "row" && (
                    <TextInput
                      label="Hàng"
                      placeholder="Nhập tên hàng"
                      radius={4}
                      {...form.getInputProps("row")}
                      flex={1}
                    />
                  )}
                  <Select
                    label="Phương pháp canh tác"
                    radius={4}
                    value={"line_3m"}
                    data={[
                      { value: "hole_6m", label: "Xen canh" },
                      { value: "line_3m", label: "Truyền thống" },
                    ]}
                  />
                  <Select
                    label="Phương pháp tưới tiêu"
                    radius={4}
                    value={"random"}
                    data={[{ value: "random", label: "Tưới nhỏ giọt" }]}
                  />

                  <NumberInput label="Số lượng cây" radius={4} />
                </Stack>
              </Card>
              <Button
                radius={4}
                variant="outline"
                leftSection={<IconPlus size={16} />}
              >
                Thêm cây trồng
              </Button>
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
              <Stack>
                <Card withBorder>
                  <Text fw={"600"}>Hàng 1</Text>
                  <Group mt={"md"} align="flex-end">
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
                  </Group>
                  <Group mt={"md"} align="flex-end">
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
                  </Group>
                  <Button
                    mt={"md"}
                    onClick={handleAddPoint}
                    radius={4}
                    variant="light"
                    leftSection={<IconPlus size={16} />}
                  >
                    Thêm
                  </Button>
                  <Stack mt={"md"}>
                    <MapContainer
                      center={
                        coords.length >= 1 ? coords[0] : [10.762622, 106.660172]
                      }
                      zoom={16}
                      style={{
                        height: "300px",
                        width: "100%",
                        borderRadius: 8,
                      }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Polygon positions={coords} color="green" />
                    </MapContainer>
                  </Stack>
                </Card>
                <Card withBorder>
                  <Text fw={"600"}>Hàng 2</Text>
                  <Group mt={"md"} align="flex-end">
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
                  </Group>
                  <Group mt={"md"} align="flex-end">
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
                  </Group>
                  <Button
                    mt={"md"}
                    onClick={handleAddPoint}
                    radius={4}
                    variant="light"
                    leftSection={<IconPlus size={16} />}
                  >
                    Thêm
                  </Button>
                  <Stack mt={"md"}>
                    <MapContainer
                      center={
                        coords.length >= 1 ? coords[0] : [10.762622, 106.660172]
                      }
                      zoom={16}
                      style={{
                        height: "300px",
                        width: "100%",
                        borderRadius: 8,
                      }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Polygon positions={coords} color="green" />
                    </MapContainer>
                  </Stack>
                </Card>
              </Stack>
              <Card withBorder>
                <Group mt={"md"} align="flex-end">
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
                </Group>
                <Group mt={"md"} align="flex-end">
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
                </Group>
                <Button
                  mt={"md"}
                  onClick={handleAddPoint}
                  radius={4}
                  variant="light"
                  leftSection={<IconPlus size={16} />}
                >
                  Thêm
                </Button>
                <Stack mt={"md"}>
                  <MapContainer
                    center={
                      coords.length >= 1 ? coords[0] : [10.762622, 106.660172]
                    }
                    zoom={16}
                    style={{
                      height: "300px",
                      width: "100%",
                      borderRadius: 8,
                    }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Polygon positions={coords} color="green" />
                  </MapContainer>
                </Stack>
              </Card>
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
              type={0}
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
                Thêm cây canh tác mới thành công!
              </Text>
              <Text fz={"md"} ta="center" c="dimmed">
                Cây canh tác mới đã được thêm thành công. Vui lòng kiểm tra lại
                thông tin để đảm bảo tính chính xác.
              </Text>

              <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
                Xác nhận
              </Button>
            </Stack>
          </Stepper.Completed>
        </Stepper>
      </form>
      <Modal
        opened={openedTreeMap}
        onClose={() => setOpenTreeMap(false)}
        title={<Text fw={"600"}>Tạo bản đồ cây</Text>}
      >
        <Stack gap={"xs"}>
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

export default AreaManagementTreeAddPage;
