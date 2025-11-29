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
  Select,
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
import SunEditor from "suneditor-react";
import Scrollable from "../../../../components/Scrollable";
import { notifications } from "@mantine/notifications";
import "suneditor/dist/css/suneditor.min.css";

// STORES
import { useCompanyStore } from "../../../zustand/companyStore";
import {
  usePesticideStore,
  type Pesticide,
  type PesticideSupplier,
} from "../../../zustand/pesticideStore";
import { usePesticideTypeStore } from "../../../zustand/pesticideTypeStore";

// Helper Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const PesticideManagementMainAddPage = () => {
  const navigate = useNavigate();
  const { types } = usePesticideTypeStore();
  // 1. Kết nối Store
  const { addPesticide, isLoading } = usePesticideStore();
  const { companies } = useCompanyStore();

  const [active, setActive] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [techDocName, setTechDocName] = useState<string>("");

  // 2. Form Setup
  const form = useForm({
    initialValues: {
      id: "TH-" + Math.floor(Math.random() * 1000),
      name: "",
      typeIds: [] as string[],
      ingredients: "",
      usage: "",
      note: "",
      image: "", // Base64
      hashtags: [] as string[],

      // Tài liệu
      fileType: "0",
      technicalDoc: "",

      // Nhà cung cấp
      suppliers: [] as PesticideSupplier[],
    },
    validate: {
      id: (val) => (!val ? "Vui lòng nhập mã thuốc" : null),
      name: (val) => (!val ? "Vui lòng nhập tên thuốc" : null),
      typeIds: (val) => (val.length === 0 ? "Chọn ít nhất 1 loại thuốc" : null),
    },
  });

  // State tạm cho bước NCC
  const [tempSupplierId, setTempSupplierId] = useState<string | null>(null);
  const [tempQty, setTempQty] = useState<number>(1);
  const [tempUnit, setTempUnit] = useState<string | null>(null);
  const [tempSpec, setTempSpec] = useState<string[]>([]);

  // --- HANDLERS ---

  const handleDropImage = async (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      form.setFieldValue("image", previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setFieldValue("image", "");
  };

  const handleDropDoc = async (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setTechDocName(file.name);
      form.setFieldValue("technicalDoc", base64 as any);
      notifications.show({ message: "Đã tải tài liệu lên", color: "blue" });
    }
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
      unit: tempUnit || "Chai",
      spec: tempSpec.join(", "),
    });

    // Reset temp inputs
    setTempSupplierId(null);
    setTempQty(1);
    setTempUnit(null);
    setTempSpec([]);
    notifications.show({ message: "Đã thêm nhà cung cấp", color: "green" });
  };

  const removeSupplier = (index: number) => {
    form.removeListItem("suppliers", index);
  };

  const handleFinish = async () => {
    const values = form.values;

    const payload: Omit<Pesticide, "createdAt"> = {
      id: values.id,
      name: values.name,
      typeIds: values.typeIds,
      ingredients: values.ingredients,
      usage: values.usage,
      note: values.note,
      image: values.image,
      hashtags: values.hashtags,
      fileType: values.fileType,
      technicalDoc: values.technicalDoc,
      suppliers: values.suppliers,
    };

    const success = await addPesticide(payload);
    if (success) {
      notifications.show({
        title: "Thành công",
        message: "Đã thêm thuốc BVTV mới",
        color: "green",
        icon: <IconCheck />,
      });
      setActive(4); // Chuyển sang bước hoàn tất
    }
  };

  const nextStep = () => {
    if (active === 0) {
      const validation = form.validate();
      if (validation.hasErrors) return;
    }
    setActive((cur) => (cur < 4 ? cur + 1 : cur));
  };
  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));

  // Options cho Select NCC
  const supplierOptions = useMemo(
    () => companies.map((c) => ({ value: c.id, label: c.name })),
    [companies]
  );

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
        <Title order={3}>🌿 Thêm thuốc bảo vệ thực vật</Title>
      </Group>

      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
      >
        {/* Step 1: Thông tin cơ bản */}
        <Stepper.Step label="Bước 1" description="Thông tin cơ bản">
          <Stack gap={"xs"}>
            <Group grow align="flex-start">
              <Stack gap={"xs"}>
                <TextInput
                  label="Mã thuốc"
                  withAsterisk
                  radius={4}
                  {...form.getInputProps("id")}
                />
                <TextInput
                  label="Tên thuốc"
                  withAsterisk
                  radius={4}
                  {...form.getInputProps("name")}
                />
                <MultiSelect
                  label="Loại thuốc"
                  data={types.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  withAsterisk
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
              </Stack>

              <Stack gap={"xs"}>
                <Input.Wrapper label="Ảnh thuốc">
                  <Dropzone
                    onDrop={handleDropImage}
                    accept={IMAGE_MIME_TYPE}
                    maxSize={5 * 1024 ** 2}
                  >
                    <Group
                      justify="center"
                      gap="xl"
                      mih={220}
                      style={{ pointerEvents: "none" }}
                    >
                      <Dropzone.Idle>
                        <IconPhoto size={52} color="gray" />
                      </Dropzone.Idle>
                      <div>
                        <Text size="xl" inline>
                          Kéo hoặc chọn ảnh thuốc
                        </Text>
                        <Text size="sm" c="dimmed">
                          Tối đa 5MB
                        </Text>
                      </div>
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
                      h={200}
                      fit="contain"
                      radius="md"
                      bg="gray.1"
                    />
                    <ActionIcon
                      color="red"
                      variant="filled"
                      radius="xl"
                      style={{ position: "absolute", top: 5, right: 5 }}
                      onClick={handleRemoveImage}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  </div>
                )}

                <Textarea
                  label="Ghi chú"
                  radius={4}
                  {...form.getInputProps("note")}
                />
                <MultiSelect
                  label="HashTag"
                  data={["Sử dụng thường xuyên", "Sử dụng mùa hè", "Hữu cơ"]}
                  {...form.getInputProps("hashtags")}
                  searchable
                  radius={4}
                />
              </Stack>
            </Group>
          </Stack>
        </Stepper.Step>

        {/* Step 2: Tài liệu kỹ thuật */}
        <Stepper.Step label="Bước 2" description="Tài liệu kỹ thuật">
          <Stack gap={"xs"}>
            <Radio.Group
              label="Tài liệu kỹ thuật"
              value={form.values.fileType}
              onChange={(val) => form.setFieldValue(`fileType`, val)}
            >
              <Group mt="xs">
                <Radio value="0" label="Tải file PDF" />
                <Radio value="1" label="Soạn thảo nội dung" />
              </Group>
            </Radio.Group>

            {form.values.fileType === "0" ? (
              <Stack>
                <Dropzone
                  onDrop={handleDropDoc}
                  accept={["application/pdf"]}
                  maxSize={5 * 1024 ** 2}
                >
                  <Group
                    justify="center"
                    gap="xl"
                    mih={220}
                    style={{ pointerEvents: "none" }}
                  >
                    <Dropzone.Idle>
                      <IconUpload size={52} color="gray" />
                    </Dropzone.Idle>
                    <div>
                      <Text size="xl" inline>
                        Upload tài liệu PDF
                      </Text>
                      <Text size="sm" c="dimmed">
                        Kéo thả hoặc click để chọn
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
                {form.values.technicalDoc && (
                  <iframe
                    src={form.values.technicalDoc}
                    width="100%"
                    height="500px"
                    style={{ border: "1px solid #dee2e6", borderRadius: 8 }}
                    title="Tài liệu kỹ thuật"
                  />
                )}
              </Stack>
            ) : (
              <Stack>
                <Text style={{ fontSize: 14, fontWeight: 500 }}>
                  Nội dung kỹ thuật
                </Text>
                <SunEditor
                  setOptions={{ height: "200px" }}
                  setContents={form.values.technicalDoc}
                  onChange={(content) =>
                    form.setFieldValue("technicalDoc", content)
                  }
                />
              </Stack>
            )}
          </Stack>
        </Stepper.Step>

        {/* Step 3: Nhà cung cấp */}
        <Stepper.Step label="Bước 3" description="Nhà cung cấp">
          <Stack gap={"xs"}>
            <Card withBorder radius={4} p="md" bg="gray.0">
              <Stack gap={"xs"}>
                <Select
                  label="Nhà cung cấp"
                  placeholder="Chọn NCC"
                  radius={4}
                  searchable
                  data={supplierOptions}
                  value={tempSupplierId}
                  onChange={setTempSupplierId}
                />
                {/* <SelectableSupplierCards isCheckbox={false} isMultiple={false} /> */}

                <Group grow align="flex-end">
                  <NumberInput
                    label="Số lượng"
                    min={1}
                    radius={4}
                    value={tempQty}
                    onChange={(v) => setTempQty(Number(v))}
                  />
                  <Select
                    label="Đơn vị"
                    data={["Chai", "Gói", "Thùng"]}
                    radius={4}
                    value={tempUnit}
                    onChange={setTempUnit}
                  />
                  <MultiSelect
                    label="Quy cách"
                    data={["Chai 500ml", "Gói 1kg"]}
                    searchable
                    radius={4}
                    value={tempSpec}
                    onChange={setTempSpec}
                  />
                </Group>
                <Button
                  variant="outline"
                  radius={4}
                  leftSection={<IconPlus size={18} />}
                  onClick={handleAddSupplier}
                  disabled={!tempSupplierId}
                >
                  Thêm vào danh sách
                </Button>
              </Stack>
            </Card>

            <Divider label="Danh sách đã chọn" labelPosition="left" />
            <Scrollable h={200}>
              <Group align="flex-start" gap="xs">
                {form.values.suppliers.length === 0 && (
                  <Text c="dimmed" fs="italic">
                    Chưa có nhà cung cấp.
                  </Text>
                )}
                {form.values.suppliers.map((s, idx) => (
                  <Card key={idx} withBorder p="xs" radius="md" miw={300}>
                    <Group justify="space-between">
                      <Stack gap={0}>
                        <Text fw={600}>{s.supplierName}</Text>
                        <Text size="xs" c="dimmed">
                          Cung ứng: {s.quantity} {s.unit} | {s.spec}
                        </Text>
                      </Stack>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() => removeSupplier(idx)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Card>
                ))}
              </Group>
            </Scrollable>
          </Stack>
        </Stepper.Step>

        {/* Step 4: Xác nhận */}
        <Stepper.Step label="Bước 4" description="Xác nhận thông tin">
          <Stack gap="sm">
            <Title order={4}>📦 Thông tin chung</Title>
            <Group align="flex-start" grow>
              <Paper p="md" withBorder radius="md" h={300}>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text c="dimmed">Mã:</Text>
                    <Text fw={500}>{form.values.id}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text c="dimmed">Tên:</Text>
                    <Text fw={500}>{form.values.name}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text c="dimmed">Loại:</Text>
                    <Group gap={4}>
                      {form.values.typeIds.map((id) => {
                        const label = types.find((t) => t.id === id)?.name;
                        return (
                          <Badge key={id} size="sm" variant="light">
                            {label}
                          </Badge>
                        );
                      })}
                    </Group>
                  </Group>
                  <Divider />
                  <Text size="sm">
                    <b>Hoạt chất:</b> {form.values.ingredients}
                  </Text>
                  <Text size="sm">
                    <b>Công dụng:</b> {form.values.usage}
                  </Text>
                  <Text size="sm" c="dimmed">
                    <b>Ghi chú:</b> {form.values.note}
                  </Text>
                </Stack>
              </Paper>
              <Paper p="md" withBorder radius="md" h={300}>
                <Stack align="center" justify="center" h="100%">
                  <Text fw={500}>Hình ảnh minh họa</Text>
                  {imagePreview ? (
                    <Image src={imagePreview} h={200} fit="contain" />
                  ) : (
                    <Text c="dimmed">Chưa có ảnh</Text>
                  )}
                </Stack>
              </Paper>
            </Group>

            <Divider label="Nhà cung cấp" labelPosition="center" my="md" />
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

        <Stepper.Completed>
          <Stack align="center" justify="center" mt="xl">
            <IconCheck size={60} color="green" />
            <Text fz={"h2"} ta="center">
              Thêm mới thuốc bảo vệ thực vật thành công!
            </Text>
            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Xác nhận
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      {active < 3 && (
        <Group mt="xl" justify="space-between">
          <Button
            variant="default"
            radius={4}
            onClick={prevStep}
            disabled={active === 0}
          >
            Quay lại
          </Button>
          {active < 3 ? (
            <Button onClick={nextStep} radius={4}>
              Tiếp theo
            </Button>
          ) : null}
        </Group>
      )}
    </Card>
  );
};

export default PesticideManagementMainAddPage;
