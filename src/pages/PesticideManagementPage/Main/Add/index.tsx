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
  NumberInput,
  Radio,
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
import SunEditor from "suneditor-react";

const pesticideTypes = [
  { value: "TYPE01", label: "Thuốc trừ sâu" },
  { value: "TYPE02", label: "Thuốc trừ bệnh" },
  { value: "TYPE03", label: "Phân bón lá" },
  { value: "TYPE04", label: "Chất kích thích sinh trưởng" },
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

  const nextStep = () => setActive((cur) => (cur < 4 ? cur + 1 : cur));
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
                <MultiSelect
                  label="Quy cách"
                  radius={4}
                  placeholder="Quy cách"
                  value={["PKG005", "PKG006"]}
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
              </Stack>
              <Stack gap={"xs"}>
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
                <Textarea
                  label="Ghi chú"
                  radius={4}
                  {...form.getInputProps("note")}
                />
                <MultiSelect
                  label="HashTag"
                  data={["Sử dụng thường xuyên", "Sử dụng mùa hè"]}
                  radius={4}
                />
              </Stack>
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
                <Title order={4}>Thùng carton lớn (20 cái)</Title>
                <TextInput
                  label="Nhà cung cấp"
                  radius={4}
                  placeholder="Chọn nhà cung cấp"
                  {...form.getInputProps("suppliers")}
                />
                <SelectableSupplierCards isCheckbox={true} />
                <NumberInput
                  label="Số lượng"
                  placeholder="Số lượng"
                  radius={4}
                />
              </Stack>
            </Card>
            <Card withBorder radius={4} p="md">
              <Stack gap={"xs"}>
                <Title order={4}>Hộp nhựa 500 ml (30 cái)</Title>
                <TextInput
                  label="Nhà cung cấp"
                  radius={4}
                  placeholder="Chọn nhà cung cấp"
                  {...form.getInputProps("suppliers")}
                />
                <SelectableSupplierCards isCheckbox={true} />
                <NumberInput
                  label="Số lượng"
                  placeholder="Số lượng"
                  radius={4}
                />
              </Stack>
            </Card>
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
              Thêm mới thuốc bảo vệ thực vật thành công!
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Thuốc mới đã được tạo thành công. Bạn có thể xem lại thông tin chi
              tiết trong danh sách thuốc bảo vệ thực vật.
            </Text>

            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Xác nhận
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      {active < 4 && (
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
          {active === 3 && (
            <Button onClick={nextStep} radius={4}>
              Hoàn thành
            </Button>
          )}
        </Group>
      )}
    </Card>
  );
};

export default PesticideManagementMainAddPage;
