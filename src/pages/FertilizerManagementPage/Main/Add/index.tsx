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
  IconPlus,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectableSupplierCards } from "../../../SupplyManagementPage/Add/components/SelectableSupplierCards";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { companies } from "../../../SupplyManagementPage/Add";
import Scrollable from "../../../../components/Scrollable";

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
                label="Loại phân bón"
                placeholder="Loại phân bón"
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
            <Input.Wrapper label="Danh sách nhà cung cấp">
              <Stack gap={"xs"}>
                <Card withBorder shadow="sm" radius={4} p="lg">
                  <Stack gap={"xs"}>
                    <TextInput
                      label="Nhà cung cấp"
                      radius={4}
                      placeholder="Chọn nhà cung cấp"
                      {...form.getInputProps("suppliers")}
                    />
                    <SelectableSupplierCards
                      isCheckbox={false}
                      isMultiple={false}
                    />
                    <Group grow>
                      <NumberInput label="Số lượng" radius={4} />
                      <MultiSelect
                        label="Đơn vị"
                        radius={4}
                        clearable
                        placeholder="Chọn đơn vị"
                        data={[
                          { value: "kg", label: "Kilogram (kg)" },
                          { value: "g", label: "Gram (g)" },
                          { value: "tấn", label: "Tấn (tấn)" },
                          { value: "bao", label: "Bao (bao)" },
                          { value: "thùng", label: "Thùng (thùng)" },
                        ]}
                      />
                      <MultiSelect
                        label="Quy cách"
                        radius={4}
                        clearable
                        placeholder="Quy cách"
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
                    </Group>
                  </Stack>
                </Card>
                <Button
                  variant="outline"
                  radius={4}
                  leftSection={<IconPlus size={18} />}
                  onClick={prevStep}
                >
                  Thêm mới
                </Button>
              </Stack>
            </Input.Wrapper>
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

            <Scrollable h={300}>
              <Group align="flex-start" gap={"md"} wrap="nowrap">
                {companies.map((item, index) => (
                  <Card
                    key={index}
                    withBorder
                    shadow="sm"
                    radius={4}
                    miw={400}
                    p="md"
                    mb="sm"
                  >
                    <Stack gap="xs">
                      <Text fw="bold">{item.companyName}</Text>
                      <Text>
                        <strong>Loại doanh nghiệp:</strong> {item.businessType}
                      </Text>
                      <Text>
                        <strong>Người đại diện:</strong> {item.representative}
                      </Text>
                      <Text>
                        <strong>SĐT:</strong> {item.phoneNumber}
                      </Text>
                      <Text>
                        <strong>Đơn vị tính:</strong> {item.unit}
                      </Text>
                      <Text>
                        <strong>Quy cách:</strong> {item.specification}
                      </Text>
                      <Text>
                        <strong>Số lượng:</strong> {item.quantity}
                      </Text>
                      <Text>
                        <strong>Ghi chú:</strong> {item.note || "Không có"}
                      </Text>
                    </Stack>
                  </Card>
                ))}
              </Group>
            </Scrollable>
          </Stack>
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
              Thêm mới phân bón thành công!
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Phân bón mới đã được thêm thành công. Bạn có thể xem lại thông tin
              chi tiết trong danh sách phân bón.
            </Text>

            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Xác nhận
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>
      {active < 3 && (
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
          {active === 2 && (
            <Button onClick={nextStep} radius={4}>
              Hoàn thành
            </Button>
          )}
        </Group>
      )}
    </Card>
  );
};

export default FertilizerManagementMainAddPage;
