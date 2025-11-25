"use client";

import { useState } from "react";
import {
  Stepper,
  Button,
  TextInput,
  Stack,
  Group,
  Title,
  Card,
  Text,
  Textarea,
  Divider,
  Image,
  MultiSelect,
  Select,
  NumberInput,
  Container,
  Paper,
  SimpleGrid,
  ActionIcon,
  Badge,
  ThemeIcon,
  FileInput,
  Box,
  ScrollArea,
  Avatar,
  Grid,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { DateInput } from "@mantine/dates";
import {
  IconArrowLeft,
  IconPlus,
  IconSearch,
  IconCheck,
  IconPhoto,
  IconTrash,
  IconLeaf,
  IconBug,
  IconPrescription,
  IconListCheck,
  IconShieldCheck,
  IconClock,
  IconInfoCircle,
  IconUpload,
  IconCalendarEvent,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom"; // Hoặc 'next/navigation'

// --- HELPER COMPONENTS ---

// Component nhập liệu cho 1 bước trong lộ trình
const StepItemInput = ({
  index,
  onDelete,
}: {
  index: number;
  onDelete: () => void;
}) => (
  <Card withBorder padding="sm" radius="md" bg="gray.0" mb="sm">
    <Group justify="space-between" mb="xs">
      <Group gap="xs">
        <ThemeIcon color="teal" size="sm" radius="xl">
          <IconClock size={12} />
        </ThemeIcon>
        <Text size="sm" fw={600}>
          Bước {index + 1}
        </Text>
      </Group>
      <ActionIcon color="red" variant="subtle" size="sm" onClick={onDelete}>
        <IconTrash size={14} />
      </ActionIcon>
    </Group>
    <SimpleGrid cols={2} spacing="xs">
      <TextInput placeholder="Tên hành động (VD: Phun lần 1)" radius="md" />
      <Select
        placeholder="Loại"
        data={["Phun thuốc", "Bón phân", "Cắt tỉa", "Theo dõi"]}
        radius="md"
      />
      <TextInput placeholder="Thời điểm (VD: Ngày 1)" radius="md" />
      <TextInput placeholder="Mô tả kỹ thuật..." radius="md" />
    </SimpleGrid>
  </Card>
);

// Component nhập liệu cho thuốc
const MedicineItemInput = ({
  index,
  onDelete,
}: {
  index: number;
  onDelete: () => void;
}) => (
  <Paper withBorder p="sm" radius="md" bg="white" mb="sm">
    <Group justify="space-between" mb="xs">
      <Group gap="xs">
        <ThemeIcon color="blue" size="sm" variant="light">
          <IconPrescription size={14} />
        </ThemeIcon>
        <Text size="sm" fw={500}>
          Vật tư #{index + 1}
        </Text>
      </Group>
      <ActionIcon color="gray" variant="subtle" size="sm" onClick={onDelete}>
        <IconTrash size={14} />
      </ActionIcon>
    </Group>
    <Group grow align="flex-start">
      <Select
        placeholder="Chọn thuốc/vật tư"
        searchable
        data={[
          "Tricyclazole 75WP",
          "Emamectin Benzoate",
          "Kali Silic",
          "Dầu khoáng",
        ]}
        radius="md"
      />
      <TextInput placeholder="Liều lượng (VD: 20ml/25L)" radius="md" />
    </Group>
  </Paper>
);

export default function CreateTreatmentProtocolPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "PD-AUTO-001",
    species: "",
    disease: "",
    note: "",
    image: null as File | null,
    steps: [1], // Mock list
    medicines: [1], // Mock list
    safety: "",
    withdrawalDays: 7,
  });

  const nextStep = () => setActive((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setActive((prev) => Math.max(prev - 1, 0));

  return (
    <Card shadow="sm" withBorder radius="md" p="lg">
      {/* HEADER */}
      <Group mb="lg">
        <Button
          variant="subtle"
          color="gray"
          radius="md"
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3} fw={700}>
          Tạo phác đồ điều trị mới
        </Title>
      </Group>

      {/* STEPPER */}
      <Stepper
        active={active}
        onStepClick={setActive}
        mb="xl"
        color="teal"
        radius="md"
      >
        <Stepper.Step
          label="Thông tin"
          description="Cây trồng & Bệnh"
          icon={<IconInfoCircle size={18} />}
        />
        <Stepper.Step
          label="Lộ trình"
          description="Các bước xử lý"
          icon={<IconListCheck size={18} />}
        />
        <Stepper.Step
          label="Vật tư"
          description="Thuốc & An toàn"
          icon={<IconShieldCheck size={18} />}
        />
        <Stepper.Completed>{/* Nội dung khi hoàn tất */}</Stepper.Completed>
      </Stepper>

      {/* --- BƯỚC 1: THÔNG TIN CƠ BẢN --- */}
      {active === 0 && (
        <Stack gap="md">
          <Group grow align="flex-start">
            {/* Cột trái: Form nhập liệu */}
            <Stack gap="xs">
              <TextInput
                label="Mã phác đồ"
                placeholder="VD: PD-LUA-01"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                required
                radius="md"
              />
              <TextInput
                label="Tên phác đồ"
                placeholder="VD: Quy trình quản lý Đạo ôn lá"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                radius="md"
              />
              <Group grow>
                <Select
                  label="Đối tượng cây trồng"
                  placeholder="Chọn cây"
                  data={["Lúa", "Bắp (Ngô)", "Sầu riêng", "Cà phê"]}
                  value={formData.species}
                  onChange={(v) =>
                    setFormData({ ...formData, species: v || "" })
                  }
                  radius="md"
                  leftSection={<IconLeaf size={16} />}
                />
                <Select
                  label="Giai đoạn sinh trưởng"
                  placeholder="VD: Cây con"
                  data={["Cây con", "Đẻ nhánh", "Ra hoa", "Nuôi trái"]}
                  radius="md"
                />
              </Group>

              <Select
                label="Đối tượng gây hại (Bệnh/Sâu)"
                placeholder="Chọn loại bệnh"
                searchable
                data={["Đạo ôn lá", "Rầy nâu", "Sâu keo", "Nứt thân xì mủ"]}
                value={formData.disease}
                onChange={(v) => setFormData({ ...formData, disease: v || "" })}
                radius="md"
                leftSection={<IconBug size={16} />}
              />

              <Textarea
                label="Mô tả / Triệu chứng"
                placeholder="Mô tả dấu hiệu nhận biết..."
                minRows={3}
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                radius="md"
              />
            </Stack>

            {/* Cột phải: Hình ảnh */}
            <Stack gap="xs">
              <Text size="sm" fw={500}>
                Hình ảnh minh họa
              </Text>
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                onDrop={(files) =>
                  setFormData({ ...formData, image: files[0] })
                }
                maxSize={5 * 1024 ** 2}
                radius="md"
                style={{
                  border: "1px dashed var(--mantine-color-gray-4)",
                  backgroundColor: "var(--mantine-color-gray-0)",
                }}
              >
                <Stack align="center" justify="center" mih={220}>
                  {formData.image ? (
                    <Stack align="center" gap="xs">
                      <Image
                        src={URL.createObjectURL(formData.image)}
                        w={180}
                        radius="md"
                      />
                      <Text size="xs" c="teal">
                        {formData.image.name}
                      </Text>
                    </Stack>
                  ) : (
                    <>
                      <ThemeIcon
                        size={50}
                        color="gray"
                        variant="light"
                        radius="xl"
                      >
                        <IconPhoto size={30} />
                      </ThemeIcon>
                      <Text size="sm" c="dimmed">
                        Kéo thả ảnh hoặc click để tải lên
                      </Text>
                    </>
                  )}
                </Stack>
              </Dropzone>
              <MultiSelect
                label="Gắn thẻ (Tags)"
                placeholder="VD: Mùa mưa, Kháng thuốc..."
                data={["Mùa mưa", "Kháng thuốc", "Hữu cơ"]}
                radius="md"
              />
            </Stack>
          </Group>

          <Group justify="flex-end" mt="md">
            <Button radius="md" color="teal" onClick={nextStep}>
              Tiếp theo
            </Button>
          </Group>
        </Stack>
      )}

      {/* --- BƯỚC 2: LỘ TRÌNH XỬ LÝ --- */}
      {active === 1 && (
        <Stack gap="md">
          <Group grow align="flex-start">
            {/* Cột trái: Danh sách bước */}
            <Stack gap="xs">
              <Group justify="space-between">
                <Title order={5}>Quy trình thực hiện</Title>
                <Button
                  size="xs"
                  variant="light"
                  color="teal"
                  leftSection={<IconPlus size={14} />}
                  onClick={() =>
                    setFormData({ ...formData, steps: [...formData.steps, 1] })
                  }
                >
                  Thêm bước
                </Button>
              </Group>
              <ScrollArea h={400} offsetScrollbars>
                {formData.steps.map((_, idx) => (
                  <StepItemInput key={idx} index={idx} onDelete={() => {}} />
                ))}
              </ScrollArea>
            </Stack>

            {/* Cột phải: Hướng dẫn */}
            <Card
              withBorder
              radius="md"
              bg="blue.0"
              padding="lg"
              style={{ borderColor: "var(--mantine-color-blue-2)" }}
            >
              <Title order={5} c="blue.8" mb="sm">
                Hướng dẫn xây dựng
              </Title>
              <Stack gap="sm">
                <Group align="flex-start" gap="sm">
                  <IconInfoCircle
                    size={20}
                    color="var(--mantine-color-blue-6)"
                    style={{ marginTop: 2 }}
                  />
                  <Text size="sm" c="blue.9" lh={1.4}>
                    <b>Phác đồ chuẩn</b> nên bắt đầu bằng các biện pháp canh tác
                    (rút nước, tỉa cành) trước khi dùng thuốc.
                  </Text>
                </Group>
                <Group align="flex-start" gap="sm">
                  <IconClock
                    size={20}
                    color="var(--mantine-color-blue-6)"
                    style={{ marginTop: 2 }}
                  />
                  <Text size="sm" c="blue.9" lh={1.4}>
                    Ghi rõ <b>thời điểm</b> (Ngày 1, Ngày 3...) để hệ thống tự
                    động nhắc nhở nông dân.
                  </Text>
                </Group>
                <Divider variant="dashed" color="blue.3" />
                <Text size="xs" c="blue.7" fs="italic">
                  Ví dụ: <br />
                  Bước 1: Cắt nước (Ngày 1)
                  <br />
                  Bước 2: Phun thuốc lần 1 (Ngày 1)
                  <br />
                  Bước 3: Kiểm tra vết bệnh (Ngày 5)
                </Text>
              </Stack>
            </Card>
          </Group>

          <Group justify="space-between" mt="md">
            <Button radius="md" variant="default" onClick={prevStep}>
              Quay lại
            </Button>
            <Button radius="md" color="teal" onClick={nextStep}>
              Tiếp theo
            </Button>
          </Group>
        </Stack>
      )}

      {/* --- BƯỚC 3: VẬT TƯ & AN TOÀN --- */}
      {active === 2 && (
        <Stack gap="md">
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Group justify="space-between" mb="xs">
                <Title order={5}>Danh mục thuốc / Vật tư</Title>
                <Button
                  size="xs"
                  variant="light"
                  color="blue"
                  leftSection={<IconPlus size={14} />}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      medicines: [...formData.medicines, 1],
                    })
                  }
                >
                  Thêm vật tư
                </Button>
              </Group>
              <Stack gap="xs">
                {formData.medicines.map((_, idx) => (
                  <MedicineItemInput
                    key={idx}
                    index={idx}
                    onDelete={() => {}}
                  />
                ))}
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5 }}>
              <Card withBorder radius="md" padding="lg">
                <Title order={5} mb="md">
                  Cấu hình an toàn
                </Title>
                <NumberInput
                  label="Thời gian cách ly (PHI)"
                  placeholder="Số ngày"
                  suffix=" ngày"
                  radius="md"
                  mb="md"
                  value={formData.withdrawalDays}
                  onChange={(v) =>
                    setFormData({ ...formData, withdrawalDays: Number(v) })
                  }
                />
                <Textarea
                  label="Lưu ý an toàn / Cảnh báo"
                  placeholder="VD: Độc cao với ong, cần đeo bảo hộ..."
                  minRows={4}
                  radius="md"
                  mb="md"
                />
                <Divider mb="md" />
                <TextInput
                  label="Chi phí ước tính / Ha"
                  placeholder="0"
                  rightSection={
                    <Text size="xs" c="dimmed">
                      VNĐ
                    </Text>
                  }
                  radius="md"
                />
              </Card>
            </Grid.Col>
          </Grid>

          <Group justify="space-between" mt="xl">
            <Button radius="md" variant="default" onClick={prevStep}>
              Quay lại
            </Button>
            <Button radius="md" color="teal" onClick={nextStep}>
              Xác nhận
            </Button>
          </Group>
        </Stack>
      )}

      {/* --- HOÀN TẤT --- */}
      {active === 3 && (
        <Stack align="center" justify="center" mt="xl" mb="xl">
          <ThemeIcon size={100} radius="100%" color="teal" variant="light">
            <IconCheck size={50} />
          </ThemeIcon>
          <Title order={2} ta="center" mt="md">
            Tạo phác đồ thành công!
          </Title>
          <Text c="dimmed" ta="center" maw={500}>
            Phác đồ <b>{formData.name}</b> đã được lưu vào hệ thống.
            <br />
            Bạn có thể gán phác đồ này cho các thửa ruộng hoặc chia sẻ cho kỹ
            thuật viên.
          </Text>

          <Group mt="lg">
            <Button
              size="md"
              radius="md"
              variant="default"
              onClick={() => navigate(-1)}
            >
              Về danh sách
            </Button>
            <Button
              size="md"
              radius="md"
              color="teal"
              onClick={() => setActive(0)}
            >
              Tạo thêm phác đồ
            </Button>
          </Group>
        </Stack>
      )}
    </Card>
  );
}
