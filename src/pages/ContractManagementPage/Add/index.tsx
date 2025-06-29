import {
  Button,
  Card,
  FileInput,
  Group,
  NumberInput,
  Select,
  Stack,
  Stepper,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconArrowLeft,
  IconCalendar,
  IconFileTypePdf,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ContractManagementAddPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    type: "",
    summary: "",
    items: [],
    quantity: 0,
    unit: "",
    value: 0,
    currency: "",
    startDate: null,
    endDate: null,
    partner: "",
    file: null,
  });

  const contractTypes = ["Thu", "Mua"];
  const units = ["Kg", "Lít", "Cái", "Tấn"];
  const currencies = ["VND", "USD"];
  const nextStep = () => setActiveStep((current) => Math.min(current + 1, 2));
  const prevStep = () => setActiveStep((current) => Math.max(current - 1, 0));

  return (
    <Card withBorder radius={4} p="lg">
      <Stack>
        <Group mb={"md"}>
          <Button
            variant="subtle"
            radius={4}
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title order={3}>Tạo mới hợp đồng</Title>
        </Group>
        <Stepper active={activeStep} onStepClick={setActiveStep} size="sm">
          <Stepper.Step label="Thông tin chính">
            <Stack>
              <TextInput
                label="Tên hợp đồng"
                placeholder="VD: Hợp đồng thu mua..."
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.currentTarget.value })
                }
                radius={4}
              />
              <Select
                label="Loại hợp đồng"
                placeholder="Chọn loại"
                data={contractTypes}
                value={form.type}
                onChange={(val) => setForm({ ...form, type: val || "" })}
                radius={4}
              />
              <Textarea
                label="Nội dung tóm tắt"
                placeholder="Mô tả ngắn gọn nội dung hợp đồng"
                value={form.summary}
                onChange={(e) =>
                  setForm({ ...form, summary: e.currentTarget.value })
                }
                radius={4}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Chi tiết hợp đồng">
            <Stack>
              <Group align="flex-end">
                <Select
                  label="Vật tư / thiết bị / thành phẩm"
                  placeholder="Nhập tên các mục liên quan"
                  value={form.items.join(", ")}
                  radius={4}
                  flex={1}
                />
                <NumberInput
                  label="Sản lượng"
                  min={0}
                  value={form.quantity}
                  radius={4}
                  flex={1}
                />
                <Select
                  label="Đơn vị tính"
                  data={units}
                  value={form.unit}
                  onChange={(val) => setForm({ ...form, unit: val || "" })}
                  radius={4}
                  flex={1}
                />
                <Button radius={4}>Thêm mới</Button>
              </Group>
              <Group grow>
                <NumberInput
                  label="Giá trị hợp đồng"
                  min={0}
                  value={form.value}
                  radius={4}
                />
                <Select
                  label="Tiền tệ"
                  data={currencies}
                  value={form.currency}
                  onChange={(val) => setForm({ ...form, currency: val || "" })}
                  radius={4}
                />
              </Group>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Thời gian & đối tác">
            <Stack>
              <Group grow>
                <DatePickerInput
                  label="Ngày hiệu lực"
                  placeholder="Chọn ngày"
                  value={form.startDate}
                  locale="vi"
                  leftSection={<IconCalendar size={18} />}
                  radius={4}
                />
                <DatePickerInput
                  label="Ngày kết thúc"
                  placeholder="Chọn ngày"
                  value={form.endDate}
                  locale="vi"
                  leftSection={<IconCalendar size={18} />}
                  radius={4}
                />
              </Group>
              <Select
                label="Thông tin đối tác / khách hàng"
                placeholder="VD: Cty ABC"
                value={form.partner}
                radius={4}
              />
              <FileInput
                label="Hồ sơ hợp đồng (PDF)"
                placeholder="Tải lên tập tin"
                value={form.file}
                leftSection={<IconFileTypePdf />}
                accept=".pdf"
                radius={4}
              />
            </Stack>
          </Stepper.Step>
        </Stepper>

        <Group justify="space-between" mt="xl">
          <Button
            radius={4}
            variant="default"
            onClick={prevStep}
            disabled={activeStep === 0}
          >
            Quay lại
          </Button>
          {activeStep < 2 ? (
            <Button radius={4} onClick={nextStep}>
              Tiếp theo
            </Button>
          ) : (
            <Button radius={4} type="submit" color="green">
              Tạo mới
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
  );
};
export default ContractManagementAddPage;
