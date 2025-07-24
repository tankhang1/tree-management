// Updated: PesticideManagementMainAddPage to match Fertilizer-style step-by-step form

import {
  Button,
  Card,
  Group,
  Paper,
  Select,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
  Textarea,
  Input,
  Image,
  Divider,
  MultiSelect,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconPhoto,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectableSupplierCards } from "../../../SupplyManagementPage/Add/components/SelectableSupplierCards";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
const pesticideTypes = [
  {
    value: "Hữu cơ",
    label: "Hữu cơ",
    image:
      "https://makagarden.vn/wp-content/uploads/2023/06/cac-loai-phan-bon-huu-co-duoc-su-dung-pho-bien-nhat-hien-nay.jpg",
  },
  {
    value: "Vô cơ",
    label: "Vô cơ",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq_l-0ogNl_hTwySfEfMO8cFa0VtMETY6DYA&s",
  },
  {
    value: "Vi sinh",
    label: "Vi sinh",
    image: "https://xuannong.vn/images/phan_bon_vi_sinh.png",
  },
];

const units = ["kg", "bao", "gói", "lít"];

const FertilizerManagementMainAddPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const form = useForm({
    initialValues: {
      name: "Phân NPK",
      type: "Hữu cơ",
      nutrientContent: "NPK 16-16-8",
      unit: "kg",
      manufacturer: "Công ty Phân bón Miền Nam",
      description: "Dùng cho cây ăn trái giai đoạn phát triển tán lá.",
    },
    validate: {
      name: (v) => (!v ? "Vui lòng nhập tên phân bón" : null),
      type: (v) => (!v ? "Vui lòng chọn loại phân bón" : null),
      nutrientContent: (v) =>
        !v ? "Vui lòng nhập hàm lượng dinh dưỡng" : null,
      unit: (v) => (!v ? "Vui lòng chọn đơn vị" : null),
      manufacturer: (v) => (!v ? "Vui lòng nhập nhà sản xuất" : null),
    },
  });

  const nextStep = () => setActive((cur) => (cur < 3 ? cur + 1 : cur));
  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group mb="xs">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>🌿 Tạo phân bón mới</Title>
      </Group>

      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={true}
      >
        <Stepper.Step label="Bước 1" description="Thông tin cơ bản">
          <Stack gap={"xs"}>
            <Input.Wrapper label="Ảnh phân bón">
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
                      Bỏ và thả ảnh phân bón tại đây
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Đính kèm ảnh phân bón (tối đa 5MB)
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            </Input.Wrapper>
            <TextInput
              label="Tên phân bón"
              placeholder="VD: Phân NPK, Phân Urê"
              withAsterisk
              radius={4}
              {...form.getInputProps("name")}
            />
            <Input.Wrapper label="Loại phân bón">
              <Group gap="sm">
                {pesticideTypes.map((item) => (
                  <Paper
                    key={item.value}
                    withBorder
                    p="xs"
                    radius="md"
                    shadow={form.values.type === item.value ? "md" : "xs"}
                    style={{
                      cursor: "pointer",
                      borderColor:
                        form.values.type === item.value ? "green" : undefined,
                    }}
                    onClick={() => form.setFieldValue("type", item.value)}
                  >
                    <Stack align="center" gap={4}>
                      <Image
                        src={item.image}
                        width={60}
                        height={60}
                        fit="contain"
                      />
                      <Text
                        size="sm"
                        fw={form.values.type === item.value ? 600 : 400}
                      >
                        {item.label}
                      </Text>
                    </Stack>
                  </Paper>
                ))}
              </Group>
            </Input.Wrapper>
            <TextInput
              label="Hàm lượng dinh dưỡng"
              placeholder="VD: NPK 16-16-8, Đạm 46%"
              radius={4}
              withAsterisk
              {...form.getInputProps("nutrientContent")}
            />
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Bước 2" description="Đóng gói & sản xuất">
          <Stack gap={"xs"}>
            <TextInput
              label="Nhà cung cấp"
              radius={4}
              placeholder="Chọn nhà cung cấp"
              {...form.getInputProps("suppliers")}
            />
            <SelectableSupplierCards isCheckbox={true} />
            <Select
              label="Đơn vị"
              placeholder="Chọn đơn vị tính"
              data={units}
              withAsterisk
              radius={4}
              {...form.getInputProps("unit")}
            />
            <MultiSelect
              label="Quy cách đóng gói"
              placeholder="Chọn quy cách đóng gói"
              data={["Bao 50kg", "Gói 1kg", "Thùng 10kg"]}
              withAsterisk
              radius={4}
            />
            <Textarea
              label="Ghi chú"
              placeholder="Mô tả thêm (tuỳ chọn)"
              radius={4}
              minRows={2}
              autosize
              {...form.getInputProps("description")}
            />
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Bước 3" description="Xác nhận thông tin">
          <Stack gap="xs">
            <Title order={4}>📄 Thông tin phân bón</Title>
            <Group grow align="flex-start">
              <Paper p="md" withBorder radius="md" h={300}>
                <Stack gap="xs">
                  <Text>
                    <b>Tên:</b> {form.values.name}
                  </Text>
                  <Text>
                    <b>Loại:</b> {form.values.type}
                  </Text>
                  <Text>
                    <b>Hàm lượng:</b> {form.values.nutrientContent}
                  </Text>
                  <Text>
                    <b>Đơn vị:</b> {form.values.unit}
                  </Text>
                  <Text>
                    <b>Ghi chú:</b> {form.values.description || "(Không có)"}
                  </Text>
                </Stack>
              </Paper>
              <Paper p="md" withBorder radius="md" h={300}>
                <Stack gap="xs">
                  <Title order={4}>Hình ảnh minh hoạ</Title>
                  <Image
                    src={
                      "https://product.hstatic.net/1000269461/product/kali-bot-mop-phu-my-bao-50kg_1_b44d5c566ca84922aa7b3f505334b057_7ccb2df2abdd4ce29fd88f65203960f0_large.jpg"
                    }
                    h={200}
                    fit="contain"
                  />
                </Stack>
              </Paper>
            </Group>
            <Divider
              label="Nhà cung cấp & đóng gói"
              labelPosition="center"
              my="md"
            />

            <SelectableSupplierCards isCheckbox={false} />
          </Stack>
        </Stepper.Step>
      </Stepper>

      <Group mt="xl" justify="space-between">
        <Button
          variant="default"
          radius={4}
          onClick={prevStep}
          disabled={active === 0}
        >
          Quay lại
        </Button>
        {active < 2 && (
          <Button onClick={nextStep} radius={4}>
            Tiếp theo
          </Button>
        )}
        {active === 2 && <Button radius={4}>Lưu</Button>}
      </Group>
    </Card>
  );
};

export default FertilizerManagementMainAddPage;
