// Updated: PesticideManagementMainAddPage with new requirements

import {
  Button,
  Card,
  Group,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
  MultiSelect,
  Textarea,
  Input,
  Paper,
  Divider,
  Image,
  Select,
  NumberInput,
  Radio,
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
import SunEditor from "suneditor-react";

const pesticideTypes = [
  { value: "TYPE01", label: "Thuốc trừ sâu" },
  { value: "TYPE02", label: "Thuốc trừ bệnh" },
  { value: "TYPE03", label: "Phân bón lá" },
  { value: "TYPE04", label: "Chất kích thích sinh trưởng" },
];

const unitOptions = [
  { value: "chai", label: "Chai" },
  { value: "kg", label: "Kilogram" },
  { value: "gói", label: "Gói" },
  { value: "lít", label: "Lít" },
];

const packageOptions = [
  { value: "100ml", label: "100ml" },
  { value: "500ml", label: "500ml" },
  { value: "1L", label: "1 Lít" },
  { value: "thùng 12 chai", label: "Thùng 12 chai" },
];
const PesticideManagementMainAddPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const form = useForm({
    initialValues: {
      image: null,
      id: "TH001",
      name: "Thuốc trừ sâu sinh học Bio-X",
      typeIds: ["sinh-hoc", "hữu-cơ"], // phải khớp với pesticideTypes
      ingredients: "Azadirachtin 0.15%",
      usage: "Phòng và trị sâu cuốn lá, rệp sáp, bọ trĩ",
      note: "Sử dụng vào sáng sớm hoặc chiều mát. Không trộn với thuốc có tính kiềm.",
      suppliers: [],
      units: [],
      packages: [],
      fileType: "0",
    },
    validate: {
      id: (val) => (!val ? "Vui lòng nhập mã thuốc" : null),
      name: (val) => (!val ? "Vui lòng nhập tên thuốc" : null),
      typeIds: (val) => (val.length === 0 ? "Chọn ít nhất 1 loại thuốc" : null),
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
        <Title order={3}>🌿 Thêm thuốc bảo vệ thực vật</Title>
      </Group>

      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
      >
        {/* Step 1 */}
        <Stepper.Step label="Bước 1" description="Thông tin cơ bản">
          <Stack gap={"xs"}>
            <Group grow align="flex-start">
              <Stack gap={"xs"}>
                <TextInput
                  label="Mã thuốc"
                  required
                  radius={4}
                  {...form.getInputProps("id")}
                />
                <TextInput
                  label="Tên thuốc"
                  required
                  radius={4}
                  {...form.getInputProps("name")}
                />
                <MultiSelect
                  label="Loại thuốc"
                  data={pesticideTypes}
                  required
                  radius={4}
                  {...form.getInputProps("typeIds")}
                />
                <Textarea
                  label="Công thức hoạt chất"
                  radius={4}
                  {...form.getInputProps("ingredients")}
                />
                <Textarea
                  label="Công dụng"
                  radius={4}
                  {...form.getInputProps("usage")}
                />
                <Textarea
                  label="Ghi chú"
                  radius={4}
                  {...form.getInputProps("note")}
                />
                <MultiSelect
                  label="Hashtag"
                  data={["Sử dụng thường xuyên", "Sử dụng mùa hè"]}
                  radius={4}
                />
              </Stack>
              <Input.Wrapper label="Ảnh thuốc">
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
                        Bỏ và thả ảnh thuốc tại đây
                      </Text>
                      <Text size="sm" c="dimmed" inline mt={7}>
                        Đính kèm ảnh thuốc (tối đa 5MB)
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
              </Input.Wrapper>
            </Group>
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Bước 2" description="Tài liệu kỹ thuật">
          <Stack gap={"xs"}>
            <Radio.Group
              label="Tài liệu kỹ thuật"
              onChange={(val) => form.setFieldValue(`fileType`, val)}
            >
              <Group mt="xs">
                <Radio value="0" label="Tải file PDF" />
                <Radio value="1" label="Tài liệu kỹ thuật" />
              </Group>
            </Radio.Group>

            {form.getValues().fileType === "0" ? (
              <Dropzone
                onDrop={(files) => console.log("accepted files", files)}
                onReject={(files) => console.log("rejected files", files)}
                maxSize={5 * 1024 ** 2}
                accept={["application/pdf"]}
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
                      Bỏ và thả tài liệu kỹ thuật tại đây
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Đính kèm tài liệu (tối đa 5MB)
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            ) : (
              <Stack>
                <Text style={{ fontSize: 14, fontWeight: 500 }}>
                  Tài liệu kỹ thuật
                </Text>
                <SunEditor setOptions={{ height: "200px" }} />
              </Stack>
            )}
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Bước 3" description="Nhà cung cấp">
          <Stack gap={"xs"}>
            <Card withBorder radius={4} p="md">
              <Stack gap={"xs"}>
                <TextInput
                  label="Nhà cung cấp"
                  radius={4}
                  placeholder="Chọn nhà cung cấp"
                  {...form.getInputProps("suppliers")}
                />
                <SelectableSupplierCards isCheckbox={false} />
                <Group grow>
                  <NumberInput
                    label="Đơn giá"
                    placeholder="Giá tiền"
                    radius={4}
                  />
                  <NumberInput
                    label="Số lượng"
                    placeholder="Số lượng"
                    radius={4}
                  />
                  <Select
                    label="Đơn vị"
                    data={unitOptions}
                    placeholder="Đơn vị"
                    radius={4}
                  />
                  <MultiSelect
                    label="Quy cách đóng gói"
                    data={packageOptions}
                    radius={4}
                  />
                </Group>
              </Stack>
            </Card>
            <Button
              radius={4}
              variant="outline"
              leftSection={<IconPlus size={18} />}
            >
              Thêm mới
            </Button>
          </Stack>
        </Stepper.Step>

        {/* Step 3 */}
        <Stepper.Step label="Bước 4" description="Xác nhận thông tin">
          <Stack gap="sm">
            <Title order={4}>📦 Thông tin chung</Title>
            <Group align="flex-start" grow>
              <Paper p="md" withBorder radius="md" h={300}>
                <Stack gap="xs">
                  <Text>
                    <b>Mã thuốc:</b> {form.values.id}
                  </Text>
                  <Text>
                    <b>Tên thuốc:</b> {form.values.name}
                  </Text>
                  <Text>
                    <b>Loại thuốc:</b>{" "}
                    {form.values.typeIds
                      .map(
                        (v) => pesticideTypes.find((t) => t.value === v)?.label
                      )
                      .join(", ")}
                  </Text>
                  <Text>
                    <b>Hoạt chất:</b> {form.values.ingredients}
                  </Text>
                  <Text>
                    <b>Công dụng:</b> {form.values.usage}
                  </Text>
                  <Text>
                    <b>Ghi chú:</b> {form.values.note}
                  </Text>
                </Stack>
              </Paper>
              <Paper p="md" withBorder radius="md" h={300}>
                <Title order={5} mb="xs">
                  🖼 Hình ảnh sản phẩm
                </Title>
                <Stack justify="center" align="center" h="100%">
                  <Image
                    src={
                      "https://product.hstatic.net/200000722083/product/hinh_thuoc___41__fefe01ef5e524613a722da13c8250a50_1024x1024.png"
                    }
                    alt="Hình ảnh sản phẩm"
                    width={100}
                    height={200}
                    fit="contain"
                    radius="md"
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
        {active < 3 && (
          <Button onClick={nextStep} radius={4}>
            Tiếp theo
          </Button>
        )}
        {active === 3 && <Button radius={4}>Lưu</Button>}
      </Group>
    </Card>
  );
};

export default PesticideManagementMainAddPage;
