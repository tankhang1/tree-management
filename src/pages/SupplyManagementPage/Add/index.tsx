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
  LoadingOverlay,
  ActionIcon,
  Badge,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  type FileWithPath,
} from "@mantine/dropzone";
import {
  IconArrowLeft,
  IconCheck,
  IconPhoto,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

// Components
import Scrollable from "../../../components/Scrollable";

// Stores
import {
  useSupplyStore,
  type Supply,
  type SupplySupplier,
} from "../../zustand/supplyStore";
import { useCompanyStore } from "../../zustand/companyStore";

// Helper Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function SupplyManagementPage() {
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  const { addSupply, isLoading } = useSupplyStore();
  const { companies } = useCompanyStore();

  const [active, setActive] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 2. KHỞI TẠO FORM
  const form = useForm({
    initialValues: {
      code: "VT-" + Math.floor(Math.random() * 1000),
      name: "",
      type: "",
      note: "",
      image: "", // Base64 string
      hashtags: [] as string[],
      suppliers: [] as SupplySupplier[], // Danh sách đã chọn
    },
    validate: {
      code: (value) => (value.trim().length < 2 ? "Mã vật tư quá ngắn" : null),
      name: (value) => (value.trim().length < 2 ? "Tên vật tư quá ngắn" : null),
      type: (value) => (!value ? "Vui lòng chọn loại vật tư" : null),
    },
  });

  // State Tạm (Bước 2 - Chọn NCC để thêm vào list)
  const [tempSupplierId, setTempSupplierId] = useState<string | null>(null);
  const [tempQty, setTempQty] = useState<number>(1);
  const [tempUnit, setTempUnit] = useState<string | null>(null);
  const [tempSpecs, setTempSpecs] = useState<string[]>([]);
  const supplierOptions = useMemo(
    () => companies.map((c) => ({ value: c.id, label: c.name })),
    [companies]
  );
  // --- HANDLERS ---

  // Upload Ảnh
  const handleDropImage = async (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      form.setFieldValue("image", base64);
    }
  };

  // Xóa ảnh
  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setFieldValue("image", "");
  };

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

  // Submit
  const handleFinish = async () => {
    const values = form.values;

    const payload: Omit<Supply, "createdAt"> = {
      id: values.code,
      code: values.code,
      name: values.name,
      type: values.type,
      note: values.note,
      image: values.image,
      hashtags: values.hashtags,
      suppliers: values.suppliers,
    };

    const success = await addSupply(payload);
    if (success) {
      notifications.show({
        title: "Thành công",
        message: "Thêm vật tư mới thành công",
        color: "green",
        icon: <IconCheck />,
      });
      setActive(3); // Chuyển sang bước hoàn tất
    }
  };

  const nextStep = () => {
    // Validate Bước 1
    if (active === 0) {
      const validation = form.validate();
      if (validation.hasErrors) return;
    }
    setActive((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setActive((prev) => Math.max(prev - 1, 0));

  return (
    <Card shadow="sm" withBorder radius="md" p="lg" pos="relative">
      <LoadingOverlay visible={isLoading} />
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
              src={imagePreview || "https://placehold.co/200x200?text=Success"}
              w={200}
              fit="cover"
              radius="md"
            />
            <Text fz={"h2"} ta="center">
              Thêm mới vật tư thành công!
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Vật tư <b>{form.values.name}</b> đã được thêm thành công.
            </Text>

            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Quay về danh sách
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
                required
                radius={4}
                {...form.getInputProps("code")}
              />

              <TextInput
                label="Tên vật tư"
                required
                radius={4}
                {...form.getInputProps("name")}
              />
              <Select
                searchable
                clearable
                label="Loại vật tư"
                required
                radius={4}
                data={[
                  { value: "Phân bón", label: "Phân bón" },
                  {
                    value: "Thuốc BVTV",
                    label: "Thuốc bảo vệ thực vật (BVTV)",
                  },
                  { value: "Hạt giống", label: "Hạt giống" },
                  { value: "Dụng cụ", label: "Dụng cụ nông nghiệp" },
                  { value: "Khay nhựa", label: "Khay nhựa, khay gieo hạt" },
                  { value: "Tưới tiêu", label: "Thiết bị tưới tiêu" },
                  { value: "Bao bì", label: "Bao bì, vật liệu đóng gói" },
                  { value: "Bảo hộ", label: "Đồ bảo hộ lao động" },
                ]}
                {...form.getInputProps("type")}
              />
              <Textarea
                label="Ghi chú"
                radius={4}
                {...form.getInputProps("note")}
              />
            </Stack>
            <Stack gap={"xs"}>
              <Input.Wrapper label="Ảnh vật tư">
                <Dropzone
                  accept={IMAGE_MIME_TYPE}
                  onDrop={handleDropImage}
                  maxSize={5 * 1024 ** 2}
                >
                  <Group
                    justify="center"
                    mih={150}
                    style={{ pointerEvents: "none" }}
                  >
                    <IconPhoto size={40} color="gray" />
                    <Text>Kéo thả ảnh tại đây</Text>
                  </Group>
                </Dropzone>
              </Input.Wrapper>

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
                    h={150}
                    fit="contain"
                    radius="md"
                    bg="gray.1"
                    style={{ border: "1px solid #eee" }}
                  />
                  <ActionIcon
                    variant="filled"
                    color="red"
                    radius="xl"
                    size="sm"
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

              <MultiSelect
                label="HashTag"
                data={["Sử dụng thường xuyên", "Mùa vụ mới", "Hàng nhập khẩu"]}
                searchable
                radius={4}
                {...form.getInputProps("hashtags")}
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
                  data={["Hàng mới", "Hàng cũ", "Bảo hành 12T", "Bảo hành 24T"]}
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
            <Button radius={4} variant="default" onClick={prevStep}>
              Quay lại
            </Button>
            <Button radius={4} onClick={nextStep} color="green">
              Tiếp tục
            </Button>
          </Group>
        </Stack>
      )}

      {/* Bước 3 */}
      {active === 2 && (
        <Stack gap="md">
          <Title order={4}>📝 Xác nhận thông tin</Title>

          <Group align="stretch" grow>
            <Card withBorder shadow="sm" radius={4} p="md" h={300}>
              <Stack justify="space-between" h="100%">
                <Stack gap="xs">
                  <Title order={5}>Thông tin vật tư</Title>
                  <Text size="sm">
                    <strong>Mã:</strong> {form.values.code}
                  </Text>
                  <Text size="sm">
                    <strong>Tên:</strong> {form.values.name}
                  </Text>
                  <Text size="sm">
                    <strong>Loại:</strong> {form.values.type}
                  </Text>
                  <Text size="sm">
                    <strong>Ghi chú:</strong> {form.values.note || "Không có"}
                  </Text>
                  <Group gap="xs">
                    {form.values.hashtags.map((t) => (
                      <Badge key={t} variant="light" size="sm">
                        {t}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              </Stack>
            </Card>
            <Card h={300} withBorder radius={4} p="md" style={{ flex: 1 }}>
              <Stack align="center" h="100%">
                <Title order={5} w="100%">
                  Hình ảnh
                </Title>
                {imagePreview ? (
                  <Image src={imagePreview} h={200} fit="contain" radius="md" />
                ) : (
                  <Text c="dimmed">Chưa có ảnh</Text>
                )}
              </Stack>
            </Card>
          </Group>

          <Divider
            label={`Nhà cung cấp (${form.values.suppliers.length})`}
            labelPosition="center"
          />
          <Scrollable h={120}>
            <Group align="flex-start" gap={"md"} wrap="wrap">
              {form.values.suppliers.length > 0 ? (
                form.values.suppliers.map((item, index) => (
                  <Card
                    key={index}
                    withBorder
                    shadow="sm"
                    radius={4}
                    miw={300}
                    h={120}
                    p="md"
                  >
                    <Stack gap="xs">
                      <Text fw="bold">{item.supplierName}</Text>
                      <Text size="sm">
                        Cung cấp: {item.quantity} {item.unit}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {item.spec}
                      </Text>
                    </Stack>
                  </Card>
                ))
              ) : (
                <Text c="dimmed" fs="italic">
                  Chưa chọn nhà cung cấp nào
                </Text>
              )}
            </Group>
          </Scrollable>

          <Group justify="space-between" mt="md">
            <Button radius={4} variant="default" onClick={prevStep}>
              Quay lại
            </Button>
            <Button
              radius={4}
              onClick={handleFinish}
              color="green"
              loading={isLoading}
            >
              Hoàn thành & Lưu
            </Button>
          </Group>
        </Stack>
      )}
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
            Vật tư mới đã được thêm thành công vào hệ thống.
          </Text>
          <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
            Quay về danh sách
          </Button>
        </Stack>
      </Stepper.Completed>
    </Card>
  );
}
