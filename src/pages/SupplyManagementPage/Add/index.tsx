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
import { IconArrowLeft, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectableSupplierCards } from "./components/SelectableSupplierCards";

export default function SupplyManagementPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const [formData, setFormData] = useState({
    code: "VT001",
    name: "Phân NPK 16-16-8",
    note: "Sử dụng cho cây ăn trái giai đoạn phát triển",
    image: null,
  });

  const nextStep = () => setActive((prev) => Math.min(prev + 1, 2));
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
                label="Danh mục vật tư"
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
              <MultiSelect
                label="Hashtag"
                data={["Sử dụng thường xuyên", "Sử dụng mùa hè"]}
                radius={4}
              />
            </Stack>
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
          <TextInput
            radius={4}
            placeholder="Chọn nhà cung cấp"
            label="Danh sách nhà cung cấp (Chọn nhiều)"
            leftSection={<IconSearch size={18} />}
          />
          <SelectableSupplierCards isCheckbox={true} />
          <NumberInput
            label="Số lượng"
            placeholder="Nhập số lượng"
            min={1}
            radius={4}
          />
          <Select
            label="Đơn vị tính"
            placeholder="VD: kg, lít, cái..."
            radius={4}
            data={[
              { value: "kg", label: "kg" },
              { value: "g", label: "g" },
              { value: "l", label: "lít" },
              { value: "ml", label: "ml" },
              { value: "chai", label: "Chai" },
              { value: "bao", label: "Bao" },
              { value: "bình", label: "Bình" },
              { value: "cái", label: "Cái" },
              { value: "bộ", label: "Bộ" },
              { value: "gói", label: "Gói" },
              { value: "thùng", label: "Thùng" },
              { value: "lọ", label: "Lọ" },
            ]}
          />

          <Select
            label="Quy cách"
            radius={4}
            data={[
              { value: "25kg/bao", label: "25kg/bao" },
              { value: "50kg/bao", label: "50kg/bao" },
              { value: "1 lít/chai", label: "1 lít/chai" },
              { value: "500ml/chai", label: "500ml/chai" },
              { value: "100ml/lọ", label: "100ml/lọ" },
              { value: "10 gói/thùng", label: "10 gói/thùng" },
              { value: "1 bộ/đơn vị", label: "1 bộ/đơn vị" },
            ]}
          />
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

          <Group align="flex-start">
            <Card withBorder flex={1} h={300}>
              <Stack>
                <Title order={4}>Thông tin vật tư</Title>
                <Text>
                  <strong>Mã vật tư:</strong> {formData.code}
                </Text>
                <Text>
                  <strong>Tên vật tư:</strong> {formData.name}
                </Text>
                <Text>
                  <strong>Danh mục vật tư:</strong> Thiết bị tưới tiêu
                </Text>
                <Text>
                  <strong>Số lượng:</strong> 100
                </Text>
                <Text>
                  <strong>Đơn vị tính:</strong> cái
                </Text>
                <Text>
                  <strong>Quy cách:</strong> 1 bộ/đơn vị
                </Text>
                <Text>
                  <strong>Ghi chú:</strong> {formData.note}
                </Text>
              </Stack>
            </Card>
            <Card withBorder flex={1} h={300}>
              <Stack flex={1}>
                <Title order={4}>Ảnh vật tư</Title>
                <Stack justify="center" align="center">
                  <Image
                    src={
                      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQHUVFr-uUHq8EgkgEc-KvQnK1Sw1jvIVax8B4kebK98FtujU5D2n3_mZ8ib6LoLZPk9eGKlOr3ZVslkIrWYU6VjTByZJiIpTvMqGqiK1Ds8kWIra4f2kxZ4w&usqp=CAc"
                    }
                    alt="Preview"
                    radius="md"
                    mt="sm"
                    h={200}
                    fit="contain"
                  />
                </Stack>
              </Stack>
            </Card>
          </Group>

          <Divider label="🏪 Nhà cung cấp" labelPosition="center" />

          <SelectableSupplierCards isCheckbox={false} />
          <Group justify="space-between" mt="md">
            <Button radius={4} variant="default" onClick={prevStep}>
              Quay lại
            </Button>
            <Button
              radius={4}
              color="teal"
              onClick={() => alert("✅ Đã thêm vật tư!")}
            >
              Xác nhận & Lưu
            </Button>
          </Group>
        </Stack>
      )}
    </Card>
  );
}
