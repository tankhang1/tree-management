// CẬP NHẬT: Giao diện thêm mới cây trồng
// - Bước 2: chia 2 cột: thông tin cây bên trái, hạt giống bên phải, có hình ảnh
// - Bước 4: thêm nhiều chu kỳ sinh trưởng (n chu kỳ)

import {
  Button,
  Card,
  Group,
  Stack,
  Title,
  TextInput,
  Select,
  Stepper,
  Textarea,
  MultiSelect,
  Image,
  SimpleGrid,
  Text,
  NumberInput,
  ScrollAreaAutosize,
  Input,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconPhoto,
  IconSearch,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SeedCard from "./components/SeedCard";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import ConfirmStep from "./components/ConfirmStep";
import { cropOptions } from "../../../AreaManagementPage/Block/Add";
import CropCards from "../../../AreaManagementPage/Region/Add/components/CropCards";
import SeedCards from "../../../AreaManagementPage/Region/Add/components/SeedCards";
import { seedOptions } from "../../../AreaManagementPage/Row/Add";
const plantVarieties = [
  {
    id: "v1",
    name: "Giống Ri6",
    image:
      "https://giongcaytrongeakmat.com/wp-content/uploads/giong-sau-rieng-ri6-2.jpg",
  },
  {
    id: "v2",
    name: "Giống Cát Chu",
    image:
      "https://giongcaytrong.com/wp-content/uploads/2017/06/xoai-cat-chu1.jpg",
  },
];
const PlantManagementTreeAddPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSeedId, setSelectedSeedId] = useState<string | null>(null);

  const [plantImagePreview, setPlantImagePreview] = useState<string | null>(
    null
  );

  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      type: "",
      note: "",
      seedCode: "",
      seedName: "",
      supplier: "",
      origin: "",
      germinationRate: "",
      uniformRate: "",
      yield: "",
      seedNote: "",
      seedDoc: null,
      seedImage: null as File | null,
      harvestMethod: "",
      growthCycles: [],
    },
  });

  const handleSubmit = () => {
    console.log("🌱 Dữ liệu cây trồng:", form.values);
  };

  return (
    <Card withBorder shadow="md" radius={12} p="xl">
      <Group mb="md">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>🌿 Thêm mới cây trồng</Title>
      </Group>
      <Stepper active={activeStep} onStepClick={setActiveStep} mt="xs">
        <Stepper.Step label="Bước 1" description="Thông tin cây" />
        <Stepper.Step label="Bước 2" description="Hạt giống" />
        <Stepper.Step label="Bước 3" description="Hình thức thu hoạch" />
        <Stepper.Step label="Bước 4" description="Chu kỳ sinh trưởng" />
        <Stepper.Step label="Bước 5" description="Xác nhận" />
      </Stepper>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {activeStep === 0 && (
          <Stack mt="md" gap="xs">
            <Select
              label="Nhóm cây trồng"
              placeholder="Chọn nhóm cây trồng"
              radius={4}
            />
            <Text fw={500} fz={15}>
              Danh mục cây trồng (chọn một)
            </Text>
            <TextInput
              placeholder="Tìm kiếm danh mục cây"
              radius={4}
              leftSection={<IconSearch size={18} />}
            />
            <CropCards selected="" plants={cropOptions} onSelect={() => {}} />
            <Text fw={500} fz={15}>
              Giống cây trồng (chọn một)
            </Text>
            <TextInput
              leftSection={<IconSearch size={18} />}
              radius={4}
              placeholder="Tìm kiếm giống cây trồng"
            />
            <SeedCards selected="" seeds={seedOptions} onSelect={() => {}} />
            <TextInput
              label="Mã cây"
              placeholder="Mã cây"
              required
              {...form.getInputProps("id")}
              radius={4}
            />
            <Stack>
              <Select
                label="Hạt giống cây (chọn một)"
                placeholder="Chọn giống cây"
                radius={4}
              />
              <ScrollAreaAutosize>
                <Group wrap="nowrap">
                  <SeedCard
                    backgroundImage="https://food-map.s3.ap-southeast-1.amazonaws.com/news/2021/03/sau-rieng-ri6-3.jpg"
                    seedCode="SR-RI6"
                    name="Hạt giống RI6"
                    provider="Công ty giống cây trồng"
                    origin="Việt Nam"
                    germinationRate={85}
                    yield={25}
                    description="Giống RI6 cho năng suất cao, cơm vàng đậm, vị ngọt thơm"
                  />
                  <SeedCard
                    backgroundImage="https://food-map.s3.ap-southeast-1.amazonaws.com/news/2021/03/sau-rieng-ri6-3.jpg"
                    seedCode="SR-RI4"
                    name="Hạt giống RI4"
                    provider="Công ty giống cây trồng"
                    origin="Việt Nam"
                    germinationRate={85}
                    yield={25}
                    description="Giống RI6 cho năng suất cao, cơm vàng đậm, vị ngọt thơm"
                  />

                  <SeedCard
                    backgroundImage="https://food-map.s3.ap-southeast-1.amazonaws.com/news/2021/03/sau-rieng-ri6-3.jpg"
                    seedCode="SR-RI3"
                    name="Hạt giống RI3"
                    provider="Công ty giống cây trồng"
                    origin="Việt Nam"
                    germinationRate={85}
                    yield={25}
                    description="Giống RI6 cho năng suất cao, cơm vàng đậm, vị ngọt thơm"
                  />
                  <SeedCard
                    backgroundImage="https://food-map.s3.ap-southeast-1.amazonaws.com/news/2021/03/sau-rieng-ri6-3.jpg"
                    seedCode="SR-RI3"
                    name="Hạt giống RI3"
                    provider="Công ty giống cây trồng"
                    origin="Việt Nam"
                    germinationRate={85}
                    yield={25}
                    description="Giống RI6 cho năng suất cao, cơm vàng đậm, vị ngọt thơm"
                  />
                  <SeedCard
                    backgroundImage="https://food-map.s3.ap-southeast-1.amazonaws.com/news/2021/03/sau-rieng-ri6-3.jpg"
                    seedCode="SR-RI3"
                    name="Hạt giống RI3"
                    provider="Công ty giống cây trồng"
                    origin="Việt Nam"
                    germinationRate={85}
                    yield={25}
                    description="Giống RI6 cho năng suất cao, cơm vàng đậm, vị ngọt thơm"
                  />
                </Group>
              </ScrollAreaAutosize>
            </Stack>

            <Input.Wrapper label="Ảnh cây trồng">
              <Dropzone
                onDrop={(files) => console.log("accepted files", files)}
                onReject={(files) => console.log("rejected files", files)}
                maxSize={5 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
                onChange={() => setPlantImagePreview("")}
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
                      Kéo hoặc chọn để tải ảnh lên
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Giới hạn kích thước ảnh khoản 5MB
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            </Input.Wrapper>

            <Textarea
              label="Mô tả"
              {...form.getInputProps("note")}
              radius={4}
            />
          </Stack>
        )}

        {activeStep === 1 && (
          <Group mt="md" align="flex-start" grow>
            {/* Cây trồng bên trái */}
            <Stack gap="xs" style={{ flex: 1 }}>
              <Title order={5}>🌳 Cây trồng</Title>
              {plantImagePreview && (
                <Image
                  src={plantImagePreview}
                  alt="Ảnh cây trồng"
                  width={220}
                  height={140}
                  radius="md"
                  fit="contain"
                />
              )}
              <TextInput
                label="Mã cây"
                disabled
                {...form.getInputProps("id")}
                radius={4}
              />
              <TextInput
                label="Tên cây"
                disabled
                {...form.getInputProps("name")}
                radius={4}
              />
              <Textarea
                label="Mô tả cây"
                disabled
                {...form.getInputProps("note")}
                radius={4}
              />
            </Stack>

            {/* Giống cây bên phải: chọn bằng card */}
            <Stack gap="xs" style={{ flex: 1 }}>
              <Title order={5}>🌱 Giống cây</Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                {plantVarieties.map((seed) => (
                  <Card
                    key={seed.id}
                    withBorder
                    shadow="sm"
                    radius="md"
                    padding="sm"
                    style={{
                      cursor: "pointer",
                      borderColor:
                        selectedSeedId === seed.id ? "green" : undefined,
                      transition: "transform 0.2s ease",
                    }}
                    onClick={() => setSelectedSeedId(seed.id)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "none")
                    }
                  >
                    <Image
                      src={seed.image}
                      height={220}
                      fit="cover"
                      radius="md"
                      mb={8}
                    />
                    <Text ta="center" fw={500}>
                      {seed.name}
                    </Text>
                  </Card>
                ))}
              </SimpleGrid>
            </Stack>
          </Group>
        )}

        {activeStep === 2 && (
          <Stack mt="md" gap="xs">
            <Select
              label="Đơn vị tính toán khi thu hoạch"
              placeholder="Chọn phương pháp"
              data={["Theo quả", "Kg", "Tấn", "Thùng / Sọt"]}
              required
              {...form.getInputProps("harvestMethod")}
              radius={4}
            />
          </Stack>
        )}

        {activeStep === 3 && (
          <Stack mt="md" gap="xs">
            {/**Drag and drop và theo thứ tự */}
            {form.values.growthCycles.map((cycle, index) => (
              <Card key={index} withBorder radius="md" shadow="xs" p="md">
                <Stack gap="xs">
                  <Select label={"Chu kì sinh trưởng"} radius={4} />
                  <MultiSelect
                    label="Giai đoạn sinh trưởng"
                    data={[
                      "Gieo trồng",
                      "Ra rễ",
                      "Phát triển thân lá",
                      "Ra hoa",
                      "Đậu quả",
                      "Thu hoạch",
                    ]}
                    onChange={(val) =>
                      form.setFieldValue(`growthCycles.${index}.stages`, val)
                    }
                    radius={4}
                  />
                  <NumberInput
                    label="Thời gian diễn ra chu kỳ ( ngày )"
                    placeholder="VD: 180 ngày"
                    radius={4}
                  />
                  <Group justify="right">
                    <Button
                      color="red"
                      variant="light"
                      radius={4}
                      onClick={() => form.removeListItem("growthCycles", index)}
                    >
                      Xoá
                    </Button>
                  </Group>
                </Stack>
              </Card>
            ))}

            <Group justify="right">
              <Button
                radius={4}
                onClick={() =>
                  form.insertListItem("growthCycles", {
                    id: crypto.randomUUID(),
                    name: "",
                    stages: [],
                    estimatedTime: "",
                  })
                }
              >
                + Thêm chu kỳ
              </Button>
            </Group>
          </Stack>
        )}
        {activeStep === 4 && <ConfirmStep />}

        <Group justify="space-between" mt="xl">
          <Button
            variant="default"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((p) => p - 1)}
            radius={4}
          >
            Quay lại
          </Button>
          {activeStep < 4 ? (
            <Button onClick={() => setActiveStep((p) => p + 1)} radius={4}>
              Tiếp theo
            </Button>
          ) : (
            <Button type="submit" color="green" radius={4}>
              Lưu
            </Button>
          )}
        </Group>
      </form>
    </Card>
  );
};

export default PlantManagementTreeAddPage;
