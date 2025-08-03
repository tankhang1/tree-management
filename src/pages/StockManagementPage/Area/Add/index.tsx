import {
  Stepper,
  Button,
  Group,
  TextInput,
  NumberInput,
  Textarea,
  Stack,
  Checkbox,
  Card,
  Title,
  Divider,
  Image,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { IconMapPin, IconRuler, IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";

interface SubArea {
  id: string;
  latitude: number;
  longitude: number;
  area: number;
  note?: string;
}

interface Area {
  name: string;
  latitude: number;
  longitude: number;
  area: number;
  note?: string;
  subAreas: SubArea[];
}

export default function StockManagementAddAreaPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [hasSubArea, setHasSubArea] = useState(false);
  const [subAreas, setSubAreas] = useState<SubArea[]>([]);

  const form = useForm<Area>({
    initialValues: {
      name: "",
      latitude: 0,
      longitude: 0,
      area: 0,
      note: "",
      subAreas: [],
    },
  });

  useEffect(() => {
    const mockMainArea = {
      name: "Khu A1",
      latitude: 10.762622,
      longitude: 106.660172,
      area: 1500,
      note: "Khu chính gần hồ trung tâm",
    };

    const mockSubAreas: SubArea[] = [
      {
        id: "PHU-1",
        latitude: 10.7628,
        longitude: 106.6603,
        area: 500,
        note: "Khu phụ phía Bắc",
      },
      {
        id: "PHU-2",
        latitude: 10.7625,
        longitude: 106.66,
        area: 600,
        note: "Khu phụ phía Nam",
      },
    ];

    form.setValues({
      ...mockMainArea,
      subAreas: mockSubAreas,
    });
    setSubAreas(mockSubAreas);
    setHasSubArea(true);
    // setActive(2); // Bỏ comment nếu muốn tự vào bước xác nhận
  }, []);

  const nextStep = () => {
    if (active === 1) {
      form.setFieldValue("subAreas", hasSubArea ? subAreas : []);
    }
    setActive((prev) => (prev < 3 ? prev + 1 : prev));
  };

  const prevStep = () => setActive((prev) => (prev > 0 ? prev - 1 : prev));

  const addSubArea = () => {
    setSubAreas((prev) => [
      ...prev,
      {
        id: `PHU-${prev.length + 1}`,
        latitude: 0,
        longitude: 0,
        area: 0,
        note: "",
      },
    ]);
  };

  const updateSubArea = (index: number, key: keyof SubArea, value: any) => {
    const updated = [...subAreas];
    //@ts-expect-error no check
    updated[index][key] = value;
    setSubAreas(updated);
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
        <Title order={3}>Tạo mới khu vực quản lý</Title>
      </Group>
      <Stepper active={active} onStepClick={setActive} mb="xl">
        <Stepper.Step label="Bước 1" description="Thông tin chính" />
        <Stepper.Step label="Bước 2" description="Phân chia khu vực phụ" />
        <Stepper.Step label="Bước 3" description="Xác nhận" />
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
              Thêm mới khu vực quản lý thành công!
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Khu vực mới đã được thêm thành công. Bạn có thể xem lại thông tin
              chi tiết trong danh sách khu vực.
            </Text>

            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Xác nhận
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      {active === 0 && (
        <Stack gap={"xs"}>
          <Title order={4} mb="md">
            📍 Thông tin khu vực
          </Title>
          <TextInput
            leftSection={<IconMapPin size={18} />}
            radius={4}
            label="Tên khu vực"
            required
            {...form.getInputProps("name")}
          />
          <Group align="flex-end">
            <TextInput
              label="Latitude"
              placeholder="10.762622"
              radius={4}
              flex={1}
            />
            <TextInput
              label="Longitude"
              placeholder="106.660172"
              radius={4}
              flex={1}
            />
          </Group>

          <Stack mt={"md"}>
            <MapContainer
              center={[10.762622, 106.660172]}
              zoom={16}
              style={{
                height: "300px",
                width: "100%",
                borderRadius: 8,
              }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Polygon positions={[]} color="green" />
            </MapContainer>
          </Stack>
          <NumberInput
            radius={4}
            leftSection={<IconRuler size={18} />}
            label="Diện tích (m²)"
            required
            {...form.getInputProps("area")}
          />
          <Textarea
            radius={4}
            label="Ghi chú"
            h={200}
            {...form.getInputProps("note")}
          />
        </Stack>
      )}

      {active === 1 && (
        <Stack gap={"xs"}>
          <Title order={4} mb="md">
            🧭 Phân chia khu phụ
          </Title>
          <Checkbox
            radius={4}
            label="Tôi muốn phân chia khu vực"
            checked={hasSubArea}
            onChange={(e) => setHasSubArea(e.currentTarget.checked)}
          />
          {hasSubArea && (
            <Stack gap={"xs"}>
              {subAreas.map((sub, index) => (
                <Card key={sub.id} shadow="xs" radius="xs" withBorder>
                  <TextInput
                    radius={4}
                    label={`Tên khu vực phụ ${index + 1}`}
                  ></TextInput>
                  <Group mt="xs" align="flex-end">
                    <TextInput
                      label="Latitude"
                      placeholder="10.762622"
                      radius={4}
                      flex={1}
                    />
                    <TextInput
                      label="Longitude"
                      placeholder="106.660172"
                      radius={4}
                      flex={1}
                    />
                  </Group>

                  <Stack mt={"md"}>
                    <MapContainer
                      center={[10.762622, 106.660172]}
                      zoom={16}
                      style={{
                        height: "300px",
                        width: "100%",
                        borderRadius: 8,
                      }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Polygon positions={[]} color="green" />
                    </MapContainer>
                  </Stack>
                  <NumberInput
                    mt="xs"
                    radius={4}
                    label="Diện tích (m²)"
                    value={sub.area}
                    onChange={(v) => updateSubArea(index, "area", v)}
                  />
                  <Textarea
                    mt="xs"
                    radius={4}
                    label="Ghi chú"
                    value={sub.note}
                    onChange={(e) =>
                      updateSubArea(index, "note", e.currentTarget.value)
                    }
                  />
                </Card>
              ))}
              <Button variant="light" radius={4} onClick={addSubArea}>
                + Thêm khu phụ
              </Button>
            </Stack>
          )}
        </Stack>
      )}

      {active === 2 && (
        <Stack gap={"xs"}>
          <Title order={4} mb="sm">
            📦 Xác nhận khu vực
          </Title>
          <Card withBorder mb="md" shadow="sm" radius="md">
            <Title order={5} mb="xs">
              Khu vực chính
            </Title>
            <Stack gap="xs">
              <TextInput
                label="Tên"
                value={form.values.name}
                readOnly
                radius={4}
                w="100%"
              />
              <Group grow>
                <TextInput
                  radius={4}
                  label="Vĩ độ"
                  value={form.values.latitude.toString()}
                  readOnly
                />
                <TextInput
                  radius={4}
                  label="Kinh độ"
                  value={form.values.longitude.toString()}
                  readOnly
                />
              </Group>
              <Stack mt={"md"}>
                <MapContainer
                  center={[10.762622, 106.660172]}
                  zoom={16}
                  style={{
                    height: "300px",
                    width: "100%",
                    borderRadius: 8,
                  }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Polygon positions={[]} color="green" />
                </MapContainer>
              </Stack>
              <NumberInput
                radius={4}
                label="Diện tích (m²)"
                value={form.values.area}
                readOnly
              />
              <Textarea
                radius={4}
                label="Ghi chú"
                value={form.values.note || ""}
                readOnly
              />
            </Stack>
          </Card>

          {form.values.subAreas.length > 0 && (
            <Stack gap="md">
              <Divider
                label={`Danh sách ${form.values.subAreas.length} khu phụ`}
                labelPosition="center"
              />
              {form.values.subAreas.map((s, idx) => (
                <Card key={s.id} withBorder shadow="xs" radius="md">
                  <Title order={6}>Khu phụ {idx + 1}</Title>
                  <Stack gap="xs" mt="xs">
                    <Group grow>
                      <TextInput
                        label="Vĩ độ"
                        radius={4}
                        value={s.latitude.toString()}
                        readOnly
                      />
                      <TextInput
                        label="Kinh độ"
                        radius={4}
                        value={s.longitude.toString()}
                        readOnly
                      />
                    </Group>
                    <Stack mt={"md"}>
                      <MapContainer
                        center={[10.762622, 106.660172]}
                        zoom={16}
                        style={{
                          height: "300px",
                          width: "100%",
                          borderRadius: 8,
                        }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Polygon positions={[]} color="green" />
                      </MapContainer>
                    </Stack>
                    <NumberInput
                      label="Diện tích (m²)"
                      value={s.area}
                      radius={4}
                      readOnly
                    />
                    <Textarea
                      radius={4}
                      label="Ghi chú"
                      value={s.note || ""}
                      readOnly
                    />
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      )}

      {active < 3 && (
        <Group justify="space-between" mt="xl">
          <Button
            radius={4}
            variant="default"
            onClick={prevStep}
            disabled={active === 0}
          >
            Quay lại
          </Button>
          {active < 2 ? (
            <Button radius={4} onClick={nextStep}>
              Tiếp tục
            </Button>
          ) : (
            <Button radius={4} color="green" onClick={nextStep}>
              Hoàn thành
            </Button>
          )}
        </Group>
      )}
    </Card>
  );
}
