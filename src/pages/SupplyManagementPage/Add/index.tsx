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

          <TextInput
            label="Mã vật tư"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
            radius={4}
          />

          <TextInput
            label="Tên vật tư"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            radius={4}
          />

          <Textarea
            label="Ghi chú"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            radius={4}
          />
          <MultiSelect
            label="Tài sản thuộc nhóm"
            data={["Sử dụng thường xuyên", "Sử dụng mùa hè"]}
            radius={4}
          />
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
          <SelectableSupplierCards />
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
                  <strong>Ghi chú:</strong> {formData.note}
                </Text>
              </Stack>
            </Card>
            <Stack flex={1} justify="center" align="center">
              <Image
                src={
                  "https://goldmax.com.vn/wp-content/uploads/2022/04/may-cay-zetor-2160-5.jpg"
                }
                alt="Preview"
                radius="md"
                mt="sm"
                w={400}
              />
            </Stack>
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
