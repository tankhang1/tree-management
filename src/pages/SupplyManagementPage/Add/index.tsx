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
  Input,
  Select,
  NumberInput,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconArrowLeft, IconPlus, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectableSupplierCards } from "./components/SelectableSupplierCards";
import Scrollable from "../../../components/Scrollable";
export const companies = [
  {
    companyName: "Công ty TNHH Nông Nghiệp Xanh",
    businessType: "Cá nhân",
    representative: "Nguyễn Văn A",
    phoneNumber: "0912345678",
    unit: "cái",
    specification: "1 bộ/đơn vị",
    quantity: 120,
    note: "",
  },
  {
    companyName: "Công ty TNHH Hoa Lúa",
    businessType: "Hộ kinh doanh",
    representative: "Trần Thị B",
    phoneNumber: "0988111222",
    unit: "kg",
    specification: "10kg/bao",
    quantity: 850,
    note: "Ưu tiên giao trước 10h",
  },
  {
    companyName: "Công ty Cổ phần Trái Cây Việt",
    businessType: "Công ty cổ phần",
    representative: "Lê Văn C",
    phoneNumber: "0938999777",
    unit: "thùng",
    specification: "12 hộp/thùng",
    quantity: 65,
    note: "Giao theo đơn đặt trước",
  },
  {
    companyName: "Công ty TNHH Gạo Sạch",
    businessType: "Cá nhân",
    representative: "Phạm Thị D",
    phoneNumber: "0977666555",
    unit: "bao",
    specification: "25kg/bao",
    quantity: 340,
    note: "",
  },
  {
    companyName: "Công ty TNHH Rau Quả An Toàn",
    businessType: "Hộ kinh doanh",
    representative: "Ngô Minh E",
    phoneNumber: "0909988776",
    unit: "giỏ",
    specification: "5kg/giỏ",
    quantity: 200,
    note: "Chỉ giao nội thành",
  },
];

export default function SupplyManagementPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const [formData, setFormData] = useState({
    code: "VT001",
    name: "Phân NPK 16-16-8",
    note: "Sử dụng cho cây ăn trái giai đoạn phát triển",
    image: null,
  });

  const nextStep = () => setActive((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setActive((prev) => Math.max(prev - 1, 0));

  return (
    <Card shadow="sm" withBorder radius="md" p="lg">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Thêm mới vật tư</Title>
      </Group>
      <Stepper active={active} onStepClick={setActive} mb="lg">
        <Stepper.Step label="Bước 1" description="Thông tin cơ bản" />
        <Stepper.Step label="Bước 2" description="Nhà cung cấp" />
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
              Thêm mới vật tư thành công!
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Vật tư mới đã được thêm thành công. Bạn có thể xem lại thông tin
              chi tiết trong danh sách vật tư.
            </Text>

            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Xác nhận
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      {/* Bước 1 */}
      {active === 0 && (
        <Stack gap="sm">
          <Group grow align="flex-start">
            <Stack gap={"xs"}>
              <TextInput
                label="Mã vật tư"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                required
                radius={4}
              />

              <TextInput
                label="Tên vật tư"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                radius={4}
              />
              <Select
                searchable
                clearable
                label="Loại vật tư"
                value={formData.name}
                required
                radius={4}
                data={[
                  { value: "fertilizer", label: "Phân bón" },
                  { value: "pesticide", label: "Thuốc bảo vệ thực vật (BVTV)" },
                  { value: "seed", label: "Hạt giống" },
                  { value: "agri_tools", label: "Dụng cụ nông nghiệp" },
                  { value: "plastic_tray", label: "Khay nhựa, khay gieo hạt" },
                  { value: "irrigation", label: "Thiết bị tưới tiêu" },
                  { value: "agri_machinery", label: "Máy móc nông nghiệp" },
                  { value: "organic_material", label: "Vật tư hữu cơ vi sinh" },
                  { value: "packaging", label: "Bao bì, vật liệu đóng gói" },
                  { value: "protective", label: "Đồ bảo hộ lao động" },
                ]}
              />
              <Textarea
                label="Ghi chú"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                radius={4}
              />
            </Stack>
            <Stack gap={"xs"}>
              <Input.Wrapper label="Ảnh vật tư">
                <Dropzone
                  accept={IMAGE_MIME_TYPE}
                  onDrop={(files) =>
                    setFormData({
                      ...formData,
                      //@ts-expect-error no check
                      image: files[0]!,
                    })
                  }
                  maxSize={5 * 1024 ** 2}
                >
                  <Group justify="center" mih={150}>
                    <Text>📷 Thêm ảnh vật tư (tối đa 5MB)</Text>
                  </Group>
                </Dropzone>
              </Input.Wrapper>

              <MultiSelect
                label="HashTag"
                data={["Sử dụng thường xuyên", "Sử dụng mùa hè"]}
                radius={4}
              />
            </Stack>
          </Group>
          <Group justify="space-between" mt="md">
            <div />
            <Button radius={4} onClick={nextStep}>
              Tiếp theo
            </Button>
          </Group>
        </Stack>
      )}

      {/* Bước 2 */}
      {active === 1 && (
        <Stack gap="sm">
          <Card withBorder shadow="sm" radius={4} p="lg">
            <Stack gap="xs">
              <TextInput
                radius={4}
                placeholder="Chọn nhà cung cấp"
                label="Danh sách nhà cung cấp"
                leftSection={<IconSearch size={18} />}
              />
              <SelectableSupplierCards isMultiple={false} isCheckbox={false} />
              <Group grow>
                <NumberInput
                  label="Số lượng"
                  placeholder="Nhập số lượng"
                  min={1}
                  radius={4}
                />
                <MultiSelect
                  label="Đơn vị"
                  radius={4}
                  clearable
                  placeholder="Chọn đơn vị"
                  data={[
                    { value: "kg", label: "Kilogram (kg)" },
                    { value: "litre", label: "Lít (l)" },
                    { value: "piece", label: "Cái (cái)" },
                    { value: "set", label: "Bộ (bộ)" },
                  ]}
                />
                <MultiSelect
                  label="Quy cách"
                  radius={4}
                  placeholder="Chọn quy cách"
                  searchable
                  clearable
                  data={[
                    { value: "1 bộ/đơn vị", label: "1 bộ/đơn vị" },
                    { value: "1 chai/đơn vị", label: "1 chai/đơn vị" },
                    { value: "1 túi/đơn vị", label: "1 túi/đơn vị" },
                  ]}
                />
              </Group>
            </Stack>
          </Card>
          <Button
            variant="outline"
            leftSection={<IconPlus size={18} />}
            radius={4}
          >
            Thêm mới
          </Button>

          <Group justify="space-between" mt="md">
            <Button radius={4} variant="default" onClick={prevStep}>
              Quay lại
            </Button>
            <Button radius={4} onClick={nextStep}>
              Tiếp theo
            </Button>
          </Group>
        </Stack>
      )}

      {/* Bước 3 */}
      {active === 2 && (
        <Stack gap="md">
          <Title order={4}>📝 Xác nhận thông tin</Title>

          <Group align="stretch" grow>
            {/* Thông tin vật tư */}
            <Card withBorder shadow="sm" radius={4} p="md" h={300}>
              <Stack justify="space-between" h="100%">
                <Stack gap="xs">
                  <Title order={4}>Thông tin vật tư</Title>
                  <Text size="sm">
                    <strong>Mã vật tư:</strong> {formData.code}
                  </Text>
                  <Text size="sm">
                    <strong>Tên vật tư:</strong> {formData.name}
                  </Text>
                  <Text size="sm">
                    <strong>Loại vật tư:</strong> Thiết bị tưới tiêu
                  </Text>
                </Stack>
              </Stack>
            </Card>
            <Card h={300} withBorder radius={4} p="md" style={{ flex: 1 }}>
              <Stack>
                <Title order={4}>Hình ảnh vật tư</Title>
                <Image
                  src="https://hoasenviet.net/uploads/images/thiet-bi-tuoi-1.jpg"
                  h={200}
                  fit="contain"
                />
              </Stack>
            </Card>
          </Group>

          <Divider label="🏪 Nhà cung cấp" labelPosition="center" />
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
          <Group justify="space-between" mt="md">
            <Button radius={4} variant="default" onClick={prevStep}>
              Quay lại
            </Button>
            <Button radius={4} onClick={nextStep}>
              Hoàn thành
            </Button>
          </Group>
        </Stack>
      )}
    </Card>
  );
}
