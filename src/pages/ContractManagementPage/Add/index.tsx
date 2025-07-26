// ContractManagementAddPage – rewritten with full 5-step logic based on user request

import {
  Button,
  Card,
  Group,
  NumberInput,
  Radio,
  Select,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
  Divider,
  Paper,
  Input,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconArrowLeft,
  IconPhoto,
  IconPlant2,
  IconSearch,
  IconSettings,
  IconSpray,
  IconTools,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectableEnterpriseCards } from "../../StockManagementPage/Delivery/Add/components/SelectableEnterpriseCards";
import { Dropzone } from "@mantine/dropzone";
const itemTypes = [
  {
    label: "Máy móc thiết bị",
    value: "Máy móc thiết bị",
    icon: <IconSettings size={18} />,
  },
  { label: "Thuốc", value: "Thuốc", icon: <IconSpray size={18} /> },
  { label: "Phân", value: "Phân", icon: <IconPlant2 size={18} /> },
  { label: "Vật tư", value: "Vật tư", icon: <IconTools size={18} /> },
];
const contractTypes = [
  "Hợp đồng mua bán",
  "Hợp đồng trao đổi",
  "Hợp đồng cho tặng",
  "Hợp đồng vay",
  "Hợp đồng thuê",
  "Hợp đồng mượn",
  "Hợp đồng dịch vụ",
  "Hợp đồng vận chuyển",
  "Hợp đồng gia công",
  "Hợp đồng gửi giữ tài sản",
  "Hợp đồng ủy quyền",
  "Hợp đồng hợp tác",
];
const units = ["Kg", "Lít", "Cái", "Tấn"];

const ContractManagementAddPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    code: "HD-2025-001",
    name: "Hợp đồng mua máy cày Kubota",
    signDate: new Date("2025-07-01"),
    type: "Hợp đồng mua bán",
    isAppendix: "Hợp đồng mới",
    mode: "Chi tiết",
    items: [
      {
        type: "Máy móc thiết bị",
        quantity: 2,
        unit: "Cái",
        spec: "Kubota L5018",
      },
      { type: "Phân", quantity: 1000, unit: "Kg", spec: "NPK 16-16-8" },
    ],
    partyA: "Doanh nghiệp",
    partyB: "Nông hộ",
    summary:
      "Cung cấp thiết bị canh tác và phân bón cho dự án cải tạo đất năm 2025",
    file: null,
  });

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { type: "", quantity: 0, unit: "", spec: "" }],
    });
  };

  const updateItem = (index: number, key: string, value: string) => {
    const updated = [...form.items];
    updated[index][key] = value;
    setForm({ ...form, items: updated });
  };

  return (
    <Card withBorder radius={4} p="lg">
      <Stack>
        <Group mb="md">
          <Button
            variant="subtle"
            radius={4}
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title order={3}>📄 Tạo mới hợp đồng</Title>
        </Group>

        <Stepper active={activeStep} onStepClick={setActiveStep} size="sm">
          {/* Step 1 */}
          <Stepper.Step label="Bước 1" description="Thông tin cơ bản">
            <Stack>
              <TextInput
                label="Mã hợp đồng"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                radius={4}
              />
              <TextInput
                label="Tên hợp đồng"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                radius={4}
              />
              <DatePickerInput
                label="Ngày ký kết"
                value={form.signDate}
                locale="vi"
                onChange={(val) => setForm({ ...form, signDate: val })}
                radius={4}
              />
              <Select
                label="Loại hợp đồng"
                data={contractTypes}
                value={form.type}
                onChange={(val) => setForm({ ...form, type: val })}
                radius={4}
              />
            </Stack>
          </Stepper.Step>

          {/* Step 2 */}
          <Stepper.Step label="Bước 2" description="Nội dung liên quan">
            <Stack>
              <Radio.Group
                label="Loại hợp đồng"
                value={form.isAppendix}
                onChange={(val) => setForm({ ...form, isAppendix: val })}
              >
                <Stack gap={"xs"}>
                  <Radio value="Hợp đồng mới" label="Hợp đồng mới" />
                  <Radio value="Phụ lục" label="Phụ lục hợp đồng" />
                </Stack>
              </Radio.Group>
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
                      Bỏ và thả hợp đồng tại đây
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Đính kèm hợp đồng (tối đa 5MB)
                    </Text>
                  </div>
                </Group>
              </Dropzone>
              <Radio.Group
                label="Hình thức trình bày"
                value={form.mode}
                onChange={(val) => setForm({ ...form, mode: val })}
              >
                <Stack gap={"xs"}>
                  <Radio value="Tổng quan" label="Tổng quan" />
                  <Radio value="Chi tiết" label="Chi tiết" />
                </Stack>
              </Radio.Group>

              <Divider
                label="Danh sách vật tư / thiết bị"
                labelPosition="center"
                my="xs"
              />
              {form.items.map((item, index) => (
                <Card withBorder radius={4} key={index} p="md">
                  <Stack gap={"xs"}>
                    <Input.Wrapper label="Loại vật tư / thiết bị">
                      <Group gap="xs" wrap="wrap">
                        {itemTypes.map((item, index) => (
                          <Button
                            key={item.value}
                            radius={4}
                            p="xs"
                            variant={index === 0 ? "filled" : "outline"}
                          >
                            <Group>
                              {item.icon}
                              <Text size="sm" fw={500}>
                                {item.label}
                              </Text>
                            </Group>
                          </Button>
                        ))}
                      </Group>
                    </Input.Wrapper>
                    <Group grow key={index} align="flex-end">
                      <NumberInput
                        label="Số lượng"
                        value={item.quantity}
                        onChange={(val) => updateItem(index, "quantity", val)}
                        radius={4}
                      />
                      <Select
                        label="Đơn vị"
                        data={units}
                        value={item.unit}
                        onChange={(val) => updateItem(index, "unit", val)}
                        radius={4}
                      />
                      <Select label="Quy cách" value={item.spec} radius={4} />
                    </Group>
                  </Stack>
                </Card>
              ))}
              <Button variant="light" onClick={addItem} radius={4} mt="xs">
                + Thêm vật tư
              </Button>
            </Stack>
          </Stepper.Step>

          {/* Step 3 */}
          <Stepper.Step label="Bước 3" description="Thông tin bên A">
            <Stack gap={"xs"}>
              <Title order={4}>Thông tin bên A</Title>
              <TextInput
                label="Chọn doanh nghiệp / hộ nông dân (chọn một)"
                placeholder="Tìm kiếm doanh nghiệp"
                radius={4}
                leftSection={<IconSearch size={18} />}
              />
              <SelectableEnterpriseCards />
            </Stack>
          </Stepper.Step>

          {/* Step 4 */}
          <Stepper.Step label="Bước 4" description="Thông tin bên B">
            <Stack gap={"xs"}>
              <Title order={4}>Thông tin bên B</Title>
              <TextInput
                label="Chọn doanh nghiệp / hộ nông dân (chọn một)"
                placeholder="Tìm kiếm doanh nghiệp"
                radius={4}
                leftSection={<IconSearch size={18} />}
              />
              <SelectableEnterpriseCards />
            </Stack>
          </Stepper.Step>

          {/* Step 5 */}
          <Stepper.Step label="Bước 5" description="Xác nhận">
            <Paper withBorder radius={4} p="md">
              <Stack>
                <Title order={5}>📌 Thông tin hợp đồng</Title>
                <Text>
                  <b>Mã:</b> {form.code}
                </Text>
                <Text>
                  <b>Tên:</b> {form.name}
                </Text>
                <Text>
                  <b>Ngày ký:</b> {form.signDate?.toLocaleDateString()}
                </Text>
                <Text>
                  <b>Loại:</b> {form.type}
                </Text>
                <Text>
                  <b>Kiểu:</b> {form.isAppendix}
                </Text>
                <Text>
                  <b>Trình bày:</b> {form.mode}
                </Text>

                <Divider
                  label="Chi tiết vật tư"
                  labelPosition="center"
                  my="xs"
                />
                {form.items.map((item, i) => (
                  <Text size="sm" key={i}>
                    🔹 {item.type} – {item.quantity} {item.unit} – {item.spec}
                  </Text>
                ))}

                <Divider label="Đối tác" labelPosition="center" my="xs" />
                <SelectableEnterpriseCards isCheckbox={false} />

                {form.summary && (
                  <>
                    <Divider label="Mô tả" labelPosition="center" my="xs" />
                    <Text size="sm">📝 {form.summary}</Text>
                  </>
                )}
              </Stack>
            </Paper>
          </Stepper.Step>
        </Stepper>

        <Group justify="space-between" mt="xl">
          <Button
            radius={4}
            variant="default"
            onClick={() => setActiveStep((p) => Math.max(p - 1, 0))}
            disabled={activeStep === 0}
          >
            Quay lại
          </Button>
          {activeStep < 4 ? (
            <Button radius={4} onClick={() => setActiveStep((p) => p + 1)}>
              Tiếp theo
            </Button>
          ) : (
            <Button radius={4} color="green">
              Tạo hợp đồng
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
  );
};

export default ContractManagementAddPage;
