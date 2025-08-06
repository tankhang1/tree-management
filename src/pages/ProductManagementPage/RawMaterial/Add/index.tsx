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

export default function ProductManagementRawMaterialAddPage() {
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
        <Title order={3}>Thêm mới nguyên vật liệu</Title>
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
              Thêm mới nguyên vật liệu thành công!
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Nguyên vật liệu mới đã được thêm thành công. Bạn có thể xem lại
              thông tin chi tiết trong danh sách nguyên vật liệu.
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
                label="Mã nguyên vật liệu"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                required
                radius={4}
              />

              <TextInput
                label="Tên nguyên vật liệu"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                radius={4}
              />
              <Select
                label="Loại nguyên vật liệu"
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
                  {
                    value: "organic_material",
                    label: "nguyên vật liệu hữu cơ vi sinh",
                  },
                  { value: "packaging", label: "Bao bì, vật liệu đóng gói" },
                  { value: "protective", label: "Đồ bảo hộ lao động" },
                ]}
              />
              <MultiSelect
                label="Quy cách"
                radius={4}
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

              <Textarea
                label="Ghi chú"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                radius={4}
              />
            </Stack>
            <Stack>
              <Input.Wrapper label="Ảnh nguyên vật liệu">
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
                    <Text>📷 Thêm ảnh nguyên vật liệu (tối đa 5MB)</Text>
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
            <Stack gap={"xs"}>
              <TextInput
                radius={4}
                placeholder="Chọn nhà cung cấp"
                label="Danh sách nhà cung cấp"
                leftSection={<IconSearch size={18} />}
              />
              <SelectableSupplierCards isMultiple={false} isCheckbox={false} />
              <NumberInput
                label="Số lượng"
                radius={4}
                placeholder="Nhập số lượng"
                min={1}
              />
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

          <Group align="flex-start">
            <Card withBorder flex={1} h={300}>
              <Stack>
                <Title order={4}>Thông tin nguyên vật liệu</Title>
                <Text>
                  <strong>Mã nguyên vật liệu:</strong> {formData.code}
                </Text>
                <Text>
                  <strong>Tên nguyên vật liệu:</strong> {formData.name}
                </Text>
                <Text>
                  <strong>Loại nguyên vật liệu:</strong> Thiết bị tưới tiêu
                </Text>
                <Text>
                  <strong>Quy cách:</strong> Bao 5kg, Thùng 20kg
                </Text>

                <Text>
                  <strong>Ghi chú:</strong> {formData.note}
                </Text>
              </Stack>
            </Card>
            <Card withBorder flex={1} h={300}>
              <Stack flex={1}>
                <Title order={4}>Ảnh nguyên vật liệu</Title>
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
            <Button radius={4} onClick={nextStep}>
              Hoàn thành
            </Button>
          </Group>
        </Stack>
      )}
    </Card>
  );
}
