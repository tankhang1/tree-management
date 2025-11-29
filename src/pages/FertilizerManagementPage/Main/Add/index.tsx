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
  LoadingOverlay,
  ActionIcon,
  Badge,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconCheck,
  IconPhoto,
  IconPlus,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SelectableSupplierCards } from "../../../SupplyManagementPage/Add/components/SelectableSupplierCards";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  type FileWithPath,
} from "@mantine/dropzone";
import Scrollable from "../../../../components/Scrollable";
import { notifications } from "@mantine/notifications";

// Stores
import { useCompanyStore } from "../../../zustand/companyStore";
import {
  useFertilizerStore,
  type Fertilizer,
  type FertilizerSupplier,
} from "../../../zustand/fertilizerStore";
import { useFertilizerTypeStore } from "../../../zustand/fertilizerTypeStore";

// Helper Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const FertilizerManagementMainAddPage = () => {
  const navigate = useNavigate();

  // 1. Kết nối Store
  const { addFertilizer, isLoading } = useFertilizerStore();
  const { companies } = useCompanyStore();
  const { types } = useFertilizerTypeStore();

  const [active, setActive] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 2. Form Setup (Sử dụng useForm thay vì useState)
  const form = useForm({
    initialValues: {
      code: "PB-" + Math.floor(Math.random() * 1000),
      name: "",
      type: "",
      nutrientContent: "",
      unit: "kg", // Đơn vị cơ sở
      manufacturer: "",
      description: "",
      image: "", // Base64 string
      hashtags: [] as string[],
      suppliers: [] as FertilizerSupplier[], // Danh sách nhà cung cấp đã chọn
    },
    validate: {
      code: (v) => (v.trim().length < 2 ? "Mã phân bón không hợp lệ" : null),
      name: (v) => (!v ? "Vui lòng nhập tên phân bón" : null),
      type: (v) => (!v ? "Vui lòng chọn loại phân bón" : null),
      nutrientContent: (v) => (!v ? "Vui lòng nhập hàm lượng" : null),
    },
  });

  // State tạm cho bước thêm NCC (Bước 2)
  const [tempSupplierId, setTempSupplierId] = useState<string | null>(null);
  const [tempQty, setTempQty] = useState<number>(1);
  const [tempUnit, setTempUnit] = useState<string | null>(null);
  const [tempSpecs, setTempSpecs] = useState<string[]>([]);
  const supplierOptions = useMemo(
    () => companies.map((c) => ({ value: c.id, label: c.name })),
    [companies]
  );
  // --- HANDLERS ---

  // Xử lý upload ảnh
  const handleDropImage = async (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      form.setFieldValue("image", base64);
    }
  };

  // Xử lý xóa ảnh
  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setFieldValue("image", "");
  };

  // Thêm Nhà cung cấp vào danh sách
  const handleAddSupplier = () => {
    if (!tempSupplierId) {
      notifications.show({
        message: "Vui lòng chọn nhà cung cấp",
        color: "red",
      });
      return;
    }
    const supObj = companies.find((c) => c.id === tempSupplierId);

    form.insertListItem("suppliers", {
      supplierId: tempSupplierId,
      supplierName: supObj?.name || "N/A",
      quantity: tempQty,
      unit: tempUnit || "Cái",
      spec: tempSpecs.join(", "),
    });

    // Reset temp inputs
    setTempSupplierId(null);
    setTempQty(1);
    setTempUnit(null);
    setTempSpecs([]);
  };

  // Submit Form
  const handleFinish = async () => {
    const values = form.values;

    // Map dữ liệu sang cấu trúc Store
    const payload: Omit<Fertilizer, "createdAt"> = {
      id: values.code, // Dùng mã làm ID
      code: values.code,
      name: values.name,
      type: values.type,
      nutrientContent: values.nutrientContent,
      unit: values.unit,
      manufacturer: values.manufacturer,
      description: values.description,
      image: values.image,
      hashtags: values.hashtags,
      suppliers: values.suppliers,
    };

    const success = await addFertilizer(payload);
    if (success) {
      notifications.show({
        title: "Thành công",
        message: "Đã tạo phân bón mới",
        color: "green",
        icon: <IconCheck />,
      });
      setActive(3); // Chuyển sang bước hoàn thành
    }
  };

  // Logic chuyển bước
  const nextStep = () => {
    if (active === 0) {
      const validation = form.validate();
      if (validation.hasErrors) return;
    }
    setActive((cur) => (cur < 3 ? cur + 1 : cur));
  };

  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder pos="relative">
      <LoadingOverlay visible={isLoading} />
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
        allowNextStepsSelect={false}
      >
        {/* BƯỚC 1 */}
        <Stepper.Step label="Bước 1" description="Thông tin cơ bản">
          <Group grow gap={"xs"} align="flex-start">
            <Stack gap={"xs"}>
              <TextInput
                label="Mã phân bón"
                withAsterisk
                radius={4}
                {...form.getInputProps("code")}
              />
              <TextInput
                label="Tên phân bón"
                placeholder="VD: Phân NPK"
                withAsterisk
                radius={4}
                {...form.getInputProps("name")}
              />
              <Select
                searchable
                clearable
                label="Loại phân bón"
                placeholder="Chọn loại"
                radius={4}
                data={types.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                {...form.getInputProps("type")}
              />
              <TextInput
                label="Hàm lượng dinh dưỡng"
                placeholder="VD: NPK 16-16-8"
                radius={4}
                withAsterisk
                {...form.getInputProps("nutrientContent")}
              />
              <TextInput
                label="Nhà sản xuất"
                placeholder="VD: Bình Điền"
                radius={4}
                {...form.getInputProps("manufacturer")}
              />
              <MultiSelect
                label="HashTag"
                data={["Sử dụng thường xuyên", "Sử dụng mùa hè"]}
                {...form.getInputProps("hashtags")}
                searchable
                radius={4}
              />
            </Stack>

            <Stack gap={"xs"}>
              <Input.Wrapper label="Ảnh phân bón">
                <Dropzone
                  onDrop={handleDropImage}
                  onReject={() =>
                    notifications.show({
                      message: "File không hợp lệ",
                      color: "red",
                    })
                  }
                  maxSize={5 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                >
                  <Group
                    justify="center"
                    gap="xl"
                    mih={150}
                    style={{ pointerEvents: "none" }}
                  >
                    <Dropzone.Idle>
                      <IconPhoto size={52} color="gray" />
                    </Dropzone.Idle>
                    <div>
                      <Text size="sm" inline>
                        Kéo thả ảnh tại đây
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
              </Input.Wrapper>

              {/* Preview Ảnh */}
              {imagePreview && (
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    alignSelf: "center",
                  }}
                >
                  <Image
                    src={imagePreview}
                    h={200}
                    fit="contain"
                    radius="md"
                    bg="gray.1"
                    style={{ border: "1px solid #eee" }}
                  />
                  <ActionIcon
                    color="red"
                    variant="filled"
                    radius="xl"
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      zIndex: 10,
                    }}
                    onClick={handleRemoveImage}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                </div>
              )}

              <Textarea
                label="Mô tả"
                placeholder="Công dụng, hướng dẫn sử dụng..."
                radius={4}
                minRows={4}
                {...form.getInputProps("description")}
              />
            </Stack>
          </Group>

          <Group justify="flex-end" mt="md">
            <Button radius={4} onClick={nextStep}>
              Tiếp theo
            </Button>
          </Group>
        </Stepper.Step>

        {/* BƯỚC 2 */}
        <Stepper.Step label="Bước 2" description="Đóng gói & sản xuất">
          <Stack gap={"xs"}>
            <Card withBorder radius={4} p="md" bg="gray.0">
              <Stack gap={"xs"}>
                <Select
                  label="Nhà cung cấp"
                  radius={4}
                  placeholder="Chọn nhà cung cấp"
                  data={supplierOptions} // Data động từ Store Company
                  searchable
                  value={tempSupplierId}
                  onChange={setTempSupplierId}
                />

                <Group grow align="flex-end">
                  <NumberInput
                    label="Số lượng"
                    placeholder="Số lượng"
                    radius={4}
                    value={tempQty}
                    onChange={(v) => setTempQty(Number(v))}
                    min={1}
                  />
                  <Select
                    label="Đơn vị"
                    data={["Chiếc", "Cái", "Bộ", "Hệ thống"]}
                    radius={4}
                    value={tempUnit}
                    onChange={setTempUnit}
                  />
                  <MultiSelect
                    label="Quy cách / Ghi chú"
                    data={[
                      "Hàng mới",
                      "Hàng cũ",
                      "Bảo hành 12T",
                      "Bảo hành 24T",
                    ]}
                    value={tempSpecs}
                    onChange={setTempSpecs}
                    searchable
                    radius={4}
                  />
                </Group>
                <Group justify="flex-end">
                  <Button
                    radius={4}
                    variant="outline"
                    leftSection={<IconPlus size={18} />}
                    onClick={handleAddSupplier}
                    disabled={!tempSupplierId}
                  >
                    Thêm vào danh sách
                  </Button>
                </Group>
              </Stack>
            </Card>

            {/* Danh sách nhà cung cấp đã chọn */}
            <Divider label="Danh sách đã chọn" labelPosition="left" />
            {form.values.suppliers.length === 0 ? (
              <Text c="dimmed" fs="italic">
                Chưa có nhà cung cấp.
              </Text>
            ) : (
              <Scrollable h={80}>
                <Group gap="xs">
                  {form.values.suppliers.map((sup, idx) => (
                    <Card
                      key={idx}
                      withBorder
                      shadow="xs"
                      p="sm"
                      radius={4}
                      h={80}
                    >
                      <Group justify="space-between">
                        <Stack gap={0}>
                          <Text fw={600}>{sup.supplierName}</Text>
                          <Text size="sm" c="dimmed">
                            SL: {sup.quantity} {sup.unit} | {sup.spec}
                          </Text>
                        </Stack>
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          onClick={() => form.removeListItem("suppliers", idx)}
                        >
                          <IconX size={18} />
                        </ActionIcon>
                      </Group>
                    </Card>
                  ))}
                </Group>
              </Scrollable>
            )}
            <Group justify="space-between" mt="md">
              <Button variant="default" radius={4} onClick={prevStep}>
                Quay lại
              </Button>
              <Button color="green" radius={4} onClick={nextStep}>
                Tiếp theo
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>

        {/* BƯỚC 3 */}
        <Stepper.Step label="Bước 3" description="Xác nhận thông tin">
          <Stack gap="xs">
            <Title order={4}>📄 Xác nhận thông tin</Title>
            <Group grow align="flex-start">
              <Paper p="md" withBorder radius="md" h={300}>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text c="dimmed">Mã:</Text>
                    <Text fw={500}>{form.values.code}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text c="dimmed">Tên:</Text>
                    <Text fw={500}>{form.values.name}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text c="dimmed">Loại:</Text>
                    <Badge>{form.values.type}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text c="dimmed">Hàm lượng:</Text>
                    <Text>{form.values.nutrientContent}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text c="dimmed">NSX:</Text>
                    <Text>{form.values.manufacturer}</Text>
                  </Group>
                  <Divider />
                  <Text size="sm" lineClamp={3}>
                    {form.values.description || "(Không có mô tả)"}
                  </Text>
                </Stack>
              </Paper>
              <Paper p="md" withBorder radius="md" h={300}>
                <Stack align="center" justify="center" h="100%">
                  <Text fw={500} size="sm">
                    Hình ảnh minh hoạ
                  </Text>
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      h={200}
                      fit="contain"
                      radius="md"
                    />
                  ) : (
                    <Text c="dimmed">Chưa có ảnh</Text>
                  )}
                </Stack>
              </Paper>
            </Group>

            <Divider
              label={`Nhà cung cấp (${form.values.suppliers.length})`}
              labelPosition="center"
            />
            <Scrollable h={200}>
              <Group gap="xs">
                {form.values.suppliers.map((s, i) => (
                  <Card
                    key={i}
                    withBorder
                    shadow="sm"
                    p="sm"
                    radius={4}
                    miw={250}
                  >
                    <Text fw={600} size="sm">
                      {s.supplierName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {s.quantity} {s.unit} • {s.spec}
                    </Text>
                  </Card>
                ))}
              </Group>
            </Scrollable>

            <Group justify="space-between" mt="md">
              <Button variant="default" radius={4} onClick={prevStep}>
                Quay lại
              </Button>
              <Button
                color="green"
                radius={4}
                onClick={handleFinish}
                loading={isLoading}
              >
                Hoàn thành & Lưu
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>

        {/* BƯỚC HOÀN THÀNH */}
        <Stepper.Completed>
          <Stack align="center" justify="center" mt="xl">
            <IconCheck size={60} color="green" />
            <Text fz={"h2"} ta="center">
              Thêm mới thành công!
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Phân bón <b>{form.values.name}</b> đã được lưu vào hệ thống.
            </Text>
            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Quay về danh sách
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>
    </Card>
  );
};

export default FertilizerManagementMainAddPage;
