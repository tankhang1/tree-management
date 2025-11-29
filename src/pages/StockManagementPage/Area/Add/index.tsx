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
  LoadingOverlay,
  ActionIcon,
  Box,
  Badge,
  Grid,
  ThemeIcon,
  ScrollArea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import {
  IconMapPin,
  IconRuler,
  IconArrowLeft,
  IconCheck,
  IconTrash,
  IconInfoCircle,
  IconMap,
  IconListDetails,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useStockAreaStore, type Area } from "../../../zustand/stockAreaStore";

// IMPORT STORE

export default function StockManagementAddAreaPage() {
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  const { addArea, isLoading } = useStockAreaStore();

  const [active, setActive] = useState(0);
  const [hasSubArea, setHasSubArea] = useState(false);

  // 2. FORM SETUP
  const form = useForm<Omit<Area, "id">>({
    initialValues: {
      name: "",
      latitude: 10.762622, // Default HCM coordinate
      longitude: 106.660172,
      area: 0,
      note: "",
      subAreas: [],
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Tên khu vực phải có ít nhất 2 ký tự" : null,
      area: (value) => (value <= 0 ? "Diện tích phải lớn hơn 0" : null),
    },
  });

  // --- HANDLERS ---

  const nextStep = () => {
    // Validate Bước 1
    if (active === 0) {
      const validation = form.validate();
      if (validation.hasErrors) return;
    }

    // Nếu không chọn phân chia khu phụ, xóa dữ liệu subAreas
    if (active === 1 && !hasSubArea) {
      form.setFieldValue("subAreas", []);
    }

    setActive((prev) => (prev < 3 ? prev + 1 : prev));
  };

  const prevStep = () => setActive((prev) => (prev > 0 ? prev - 1 : prev));

  const addSubArea = () => {
    form.insertListItem("subAreas", {
      id: `PHU-${Date.now()}`, // Temp ID
      latitude: form.values.latitude, // Kế thừa tọa độ cha để dễ sửa
      longitude: form.values.longitude,
      area: 0,
      note: "",
    });
  };

  // Submit Handler
  const handleFinish = async () => {
    const newArea: Area = {
      id: `KV-${Math.floor(Math.random() * 10000)}`, // Auto ID
      ...form.values,
      // Đảm bảo subAreas không null
      subAreas: hasSubArea ? form.values.subAreas : [],
    };

    const success = await addArea(newArea);

    if (success) {
      notifications.show({
        title: "Thành công",
        message: "Đã tạo khu vực mới",
        color: "green",
        icon: <IconCheck />,
      });
      setActive(3); // Chuyển sang bước hoàn tất
    } else {
      notifications.show({
        title: "Lỗi",
        message: "Có lỗi xảy ra",
        color: "red",
      });
    }
  };

  return (
    <Card withBorder shadow="sm" radius={4} p="lg" pos="relative">
      <LoadingOverlay visible={isLoading} />

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

      <Stepper
        active={active}
        onStepClick={setActive}
        mb="xl"
        allowNextStepsSelect={false}
      >
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
              Quay về danh sách
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      {/* BƯỚC 1: THÔNG TIN CHÍNH */}
      {active === 0 && (
        <Stack gap={"xs"}>
          <Title order={4} mb="md">
            📍 Thông tin khu vực
          </Title>
          <TextInput
            leftSection={<IconMapPin size={18} />}
            radius={4}
            label="Tên khu vực"
            placeholder="Ví dụ: Khu A"
            withAsterisk
            {...form.getInputProps("name")}
          />
          <Group align="flex-end">
            <NumberInput
              label="Vĩ độ (Latitude)"
              placeholder="10.762622"
              decimalScale={6}
              radius={4}
              flex={1}
              {...form.getInputProps("latitude")}
            />
            <NumberInput
              label="Kinh độ (Longitude)"
              placeholder="106.660172"
              decimalScale={6}
              radius={4}
              flex={1}
              {...form.getInputProps("longitude")}
            />
          </Group>

          {/* Map Preview Iframe */}
          <Box
            mt="xs"
            style={{
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid #eee",
            }}
          >
            <iframe
              title="map-main"
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${form.values.latitude},${form.values.longitude}&z=16&output=embed`}
            />
          </Box>
          <Text size="xs" c="dimmed">
            * Bản đồ cập nhật tự động khi thay đổi tọa độ.
          </Text>

          <NumberInput
            radius={4}
            leftSection={<IconRuler size={18} />}
            label="Diện tích (m²)"
            min={0}
            withAsterisk
            {...form.getInputProps("area")}
          />
          <Textarea
            radius={4}
            label="Ghi chú"
            minRows={3}
            {...form.getInputProps("note")}
          />
        </Stack>
      )}

      {/* BƯỚC 2: KHU VỰC PHỤ */}
      {active === 1 && (
        <Stack gap={"xs"}>
          <Title order={4} mb="md">
            🧭 Phân chia khu phụ
          </Title>
          <Checkbox
            radius={4}
            label="Tôi muốn phân chia khu vực này thành các khu phụ"
            checked={hasSubArea}
            onChange={(e) => setHasSubArea(e.currentTarget.checked)}
          />

          {hasSubArea && (
            <Stack gap={"md"} mt="md">
              {form.values.subAreas.map((sub, index) => (
                <Card key={index} shadow="xs" radius="md" withBorder p="md">
                  <Group justify="space-between" mb="xs">
                    <Text fw={500}>Khu phụ #{index + 1}</Text>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => form.removeListItem("subAreas", index)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>

                  <Group mt="xs" grow>
                    <NumberInput
                      label="Vĩ độ"
                      decimalScale={6}
                      radius={4}
                      {...form.getInputProps(`subAreas.${index}.latitude`)}
                    />
                    <NumberInput
                      label="Kinh độ"
                      decimalScale={6}
                      radius={4}
                      {...form.getInputProps(`subAreas.${index}.longitude`)}
                    />
                  </Group>

                  {/* Sub Area Map Preview */}
                  <Box
                    mt="xs"
                    style={{
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid #eee",
                    }}
                  >
                    <iframe
                      title={`map-sub-${index}`}
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${sub.latitude},${sub.longitude}&z=16&output=embed`}
                    />
                  </Box>

                  <NumberInput
                    mt="xs"
                    radius={4}
                    label="Diện tích (m²)"
                    min={0}
                    {...form.getInputProps(`subAreas.${index}.area`)}
                  />
                  <Textarea
                    mt="xs"
                    radius={4}
                    label="Ghi chú"
                    autosize
                    minRows={2}
                    {...form.getInputProps(`subAreas.${index}.note`)}
                  />
                </Card>
              ))}

              <Button
                variant="dashed"
                radius={4}
                onClick={addSubArea}
                fullWidth
                leftSection={<IconMapPin size={16} />}
              >
                + Thêm khu phụ
              </Button>
            </Stack>
          )}
        </Stack>
      )}

      {/* BƯỚC 3: XÁC NHẬN */}
      {active === 2 && (
        <Stack gap="lg">
          <Title order={4} c="blue.8">
            🚀 Xác nhận thông tin khu vực
          </Title>

          <Grid gutter="md">
            {/* Cột trái: Thông tin chính */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder shadow="sm" radius="md" h="100%">
                <Group mb="md">
                  <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                    <IconInfoCircle style={{ width: "70%", height: "70%" }} />
                  </ThemeIcon>
                  <Text fw={700} size="lg">
                    Thông tin chung
                  </Text>
                </Group>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text c="dimmed" size="sm">
                      Tên khu vực
                    </Text>
                    <Text fw={600}>{form.values.name}</Text>
                  </Group>
                  <Divider variant="dashed" />
                  <Group justify="space-between">
                    <Text c="dimmed" size="sm">
                      Diện tích
                    </Text>
                    <Badge size="lg" variant="light">
                      {form.values.area} m²
                    </Badge>
                  </Group>
                  <Divider variant="dashed" />
                  <Stack gap={4}>
                    <Text c="dimmed" size="sm">
                      Ghi chú
                    </Text>
                    <Text size="sm" style={{ whiteSpace: "pre-line" }}>
                      {form.values.note || "Không có"}
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            </Grid.Col>

            {/* Cột phải: Bản đồ & Tọa độ */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder shadow="sm" radius="md" h="100%">
                <Group mb="md">
                  <ThemeIcon size="lg" radius="md" variant="light" color="red">
                    <IconMap style={{ width: "70%", height: "70%" }} />
                  </ThemeIcon>
                  <Text fw={700} size="lg">
                    Vị trí địa lý
                  </Text>
                </Group>

                <Box
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid #eee",
                    height: 200,
                    marginBottom: 12,
                  }}
                >
                  <iframe
                    title="map-confirm"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${form.values.latitude},${form.values.longitude}&z=16&output=embed`}
                  />
                </Box>

                <Group justify="space-between">
                  <Badge
                    variant="outline"
                    color="gray"
                    leftSection={<IconMapPin size={12} />}
                  >
                    Lat: {form.values.latitude}
                  </Badge>
                  <Badge
                    variant="outline"
                    color="gray"
                    leftSection={<IconMapPin size={12} />}
                  >
                    Lng: {form.values.longitude}
                  </Badge>
                </Group>
              </Card>
            </Grid.Col>
          </Grid>

          {/* DANH SÁCH KHU VỰC PHỤ */}
          {hasSubArea && form.values.subAreas.length > 0 && (
            <Card withBorder shadow="sm" radius="md">
              <Group mb="md">
                <ThemeIcon size="lg" radius="md" variant="light" color="teal">
                  <IconListDetails style={{ width: "70%", height: "70%" }} />
                </ThemeIcon>
                <Text fw={700} size="lg">
                  Danh sách khu phụ ({form.values.subAreas.length})
                </Text>
              </Group>

              <ScrollArea h={400} offsetScrollbars>
                <Grid>
                  {form.values.subAreas.map((s, idx) => (
                    <Grid.Col span={{ base: 12, sm: 6 }} key={idx}>
                      <Card withBorder p="sm" radius="md" bg="gray.0">
                        <Group justify="space-between" mb={4}>
                          <Text fw={600} size="sm">
                            Khu phụ #{idx + 1}
                          </Text>
                          <Badge color="teal" size="sm" variant="white">
                            {s.area} m²
                          </Badge>
                        </Group>

                        {/* Map Preview cho SubArea */}
                        <Box
                          my="xs"
                          style={{
                            borderRadius: 6,
                            overflow: "hidden",
                            border: "1px solid #dee2e6",
                            height: 150,
                          }}
                        >
                          <iframe
                            title={`map-sub-confirm-${idx}`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            src={`https://maps.google.com/maps?q=${s.latitude},${s.longitude}&z=17&output=embed`}
                          />
                        </Box>

                        <Group justify="space-between" mb={4}>
                          <Badge variant="outline" color="gray" size="xs">
                            Lat: {s.latitude}
                          </Badge>
                          <Badge variant="outline" color="gray" size="xs">
                            Lng: {s.longitude}
                          </Badge>
                        </Group>

                        {s.note && (
                          <Text
                            size="xs"
                            bg="white"
                            p={6}
                            style={{
                              borderRadius: 4,
                              border: "1px solid #eee",
                            }}
                            c="dimmed"
                          >
                            📝 {s.note}
                          </Text>
                        )}
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              </ScrollArea>
            </Card>
          )}
        </Stack>
      )}

      {/* NÚT ĐIỀU HƯỚNG */}
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
            <Button
              radius={4}
              color="green"
              onClick={handleFinish}
              loading={isLoading}
            >
              Hoàn thành & Lưu
            </Button>
          )}
        </Group>
      )}
    </Card>
  );
}
