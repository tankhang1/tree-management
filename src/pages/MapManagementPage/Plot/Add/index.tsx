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
import { useState } from "react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { ConfirmStep } from "./components/ConfirmStep";
import RegionCardSelector from "../../../AreaManagementPage/Region/Add/components/RegionCards";
import { regionOptions } from "../../../AreaManagementPage/Block/Add";
import AreaCards from "../../../AreaManagementPage/Zone/Add/components/AreaCards";
import { areaOptions } from "../../../AreaManagementPage/Row/Add";
type LatLng = [number, number];

const MapManagementPlotAddPage = () => {
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
        {/* <Stepper.Step label="Bước 4" description="Tạo hàng" /> */}
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
        {activeStep === 0 && (
          <Stack mt="md">
            <Stack gap={"xs"}>
              <Text fw={500} fz={15}>
                Vùng Trồng (chọn một)
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
            <Stack gap={"xs"}>
              <Text fw={500} fz={15}>
                Khu vực (chọn một)
              </Text>
              <TextInput
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
          </Stack>
        )}

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
            <TextInput label="Thông tin dường bình độ" radius={4} />
            <NumberInput label="Cao độ (m)" radius={4} />
          </Stack>
        )}
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
        {/* {activeStep === 3 && (
          <Stack mt="md">
            {form.values.rows.map((row, index) => (
              <Card key={index} p="md" radius={4} withBorder>
                <Stack gap={"xs"}>
                  <TextInput
                    label="Tên hàng"
                    radius={4}
                    {...form.getInputProps(`rows.${index}.name`)}
                  />
                </Stack>
              </Card>
            ))}
            <Button radius={4} variant="light" mt="md" onClick={addRow}>
              + Thêm hàng
            </Button>
          </Stack>
        )} */}
        {activeStep === 3 && (
          <ConfirmStep
            region="Vùng ĐBSCL"
            zone="Khu A1"
            block="Lô 01"
            area={4500}
            contour="Địa hình thấp, thoát nước tốt"
            elevation={15}
            gps={[
              { lat: 10.762622, lng: 106.660172 },
              { lat: 10.762655, lng: 106.66019 },
            ]}
            rows={[
              {
                name: "Hàng A",
                plantType: "Sầu riêng",
                seed: "Ri6 F1",
                quantity: 20,
              },
              {
                name: "Hàng B",
                plantType: "Xoài",
                seed: "Cát Chu",
                quantity: 18,
              },
              {
                name: "Hàng C",
                plantType: "Bưởi",
                seed: "Da xanh",
                quantity: 25,
              },
            ]}
          />
        )}
        {activeStep < 4 && (
          <Group justify="space-between" mt="xl">
            <Button
              variant="default"
              radius={4}
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => prev - 1)}
            >
              Quay lại
            </Button>
            {activeStep < 3 ? (
              <Button
                radius={4}
                onClick={() => setActiveStep((prev) => prev + 1)}
              >
                Tiếp theo
              </Button>
            ) : (
              <Button
                radius={4}
                onClick={() => setActiveStep((prev) => prev + 1)}
                color="green"
              >
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
