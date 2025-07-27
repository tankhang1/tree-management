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
  NumberInput,
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
          <Group grow gap={"xs"} align="flex-start">
            <Stack gap={"xs"}>
              <TextInput
                label="Tên phân bón"
                placeholder="VD: Phân NPK, Phân Urê"
                withAsterisk
                radius={4}
                {...form.getInputProps("name")}
              />
              <Select
                label="Danh mục phân bón"
                placeholder="Danh mục phân bón"
                radius={4}
                data={[
                  { value: "npk", label: "Phân NPK" },
                  { value: "ure", label: "Phân ure" },
                  { value: "kali", label: "Phân kali" },
                  { value: "dap", label: "Phân DAP" },
                  { value: "lan", label: "Phân lân" },
                  { value: "hữu cơ", label: "Phân hữu cơ" },
                  { value: "vi sinh", label: "Phân vi sinh" },
                  { value: "vi lượng", label: "Phân vi lượng" },
                  { value: "bón lá", label: "Phân bón lá" },
                  { value: "chậm tan", label: "Phân chậm tan" },
                  { value: "bón rễ", label: "Phân bón gốc / bón rễ" },
                ]}
              />
              <TextInput
                label="Hàm lượng dinh dưỡng"
                placeholder="VD: NPK 16-16-8, Đạm 46%"
                radius={4}
                withAsterisk
                {...form.getInputProps("nutrientContent")}
              />
              <MultiSelect
                label="Quy cách"
                radius={4}
                placeholder="Quy cách"
                value={["PKG004", "PKG005"]}
                data={[
                  {
                    value: "PKG001",
                    label: "Hộp giấy nhỏ (50 cái)",
                  },
                  {
                    value: "PKG002",
                    label: "Túi nilon lớn (100 cái)",
                  },
                  {
                    value: "PKG003",
                    label: "Bao tải 25kg (25 cái)",
                  },
                  {
                    value: "PKG004",
                    label: "Bịch nhựa 1kg (10 cái)",
                  },
                  {
                    value: "PKG005",
                    label: "Thùng carton lớn (20 cái)",
                  },
                  {
                    value: "PKG006",
                    label: "Hộp nhựa 500ml (30 cái)",
                  },
                ]}
              />
              <MultiSelect
                label="HashTag"
                data={["Sử dụng thường xuyên", "Sử dụng mùa hè"]}
                radius={4}
              />
            </Stack>
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
          </Group>
        </Stepper.Step>

        <Stepper.Step label="Bước 2" description="Đóng gói & sản xuất">
          <Stack gap={"xs"}>
            <Card withBorder shadow="sm" radius={4} p="lg">
              <Stack gap={"xs"}>
                <Title order={4}>Bịch nhựa 1kg (10 cái)</Title>
                <TextInput
                  label="Nhà cung cấp"
                  radius={4}
                  placeholder="Chọn nhà cung cấp"
                  {...form.getInputProps("suppliers")}
                />
                <SelectableSupplierCards isCheckbox={true} />
                <NumberInput label="Số lượng" radius={4} />
              </Stack>
            </Card>
            <Card withBorder shadow="sm" radius={4} p="lg">
              <Stack gap={"xs"}>
                <Title order={4}>Thùng carton lớn (20 cái)</Title>
                <TextInput
                  label="Nhà cung cấp"
                  radius={4}
                  placeholder="Chọn nhà cung cấp"
                  {...form.getInputProps("suppliers")}
                />
                <SelectableSupplierCards isCheckbox={true} />
                <NumberInput label="Số lượng" radius={4} />
              </Stack>
            </Card>
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
                    <b>Quy cách:</b> Bao 50kg
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
