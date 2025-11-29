import {
  Button,
  Group,
  Stepper,
  TextInput,
  Select,
  NumberInput,
  Stack,
  Text,
  Card,
  Title,
  Radio,
  Input,
  Image,
  MultiSelect,
  Divider,
  LoadingOverlay,
  ActionIcon,
  SimpleGrid,
  Badge,
  Paper,
} from "@mantine/core";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  type FileWithPath,
} from "@mantine/dropzone";
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
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import { notifications } from "@mantine/notifications";
import "suneditor/dist/css/suneditor.min.css";

// Component con
import { SelectableSupplierCards } from "../../../SupplyManagementPage/Add/components/SelectableSupplierCards";
import Scrollable from "../../../../components/Scrollable";
import { useMachineStore } from "../../../zustand/machineStore";
import { useMachineCategoryStore } from "../../../zustand/machineCategoryStore";
import { useCompanyStore } from "../../../zustand/companyStore";

// Helper Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const MachineManagementMainAddPage = () => {
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  const { addMachine, isLoading } = useMachineStore();
  const { machines: categories } = useMachineCategoryStore();
  const { companies } = useCompanyStore();

  const [active, setActive] = useState(0);

  // State Preview Ảnh/File
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [manualPreviewUrl, setManualPreviewUrl] = useState<string | null>(null);
  const [inspectionPreviewUrl, setInspectionPreviewUrl] = useState<
    string | null
  >(null);
  const [techDocName, setTechDocName] = useState<string>("");

  // State tạm cho phần thêm Nhà cung cấp
  const [tempSupplierId, setTempSupplierId] = useState<string | null>(null);
  const [tempQty, setTempQty] = useState<number>(1);
  const [tempUnit, setTempUnit] = useState<string | null>(null);
  const [tempSpecs, setTempSpecs] = useState<string[]>([]);

  // 2. FORM SETUP
  const form = useForm({
    initialValues: {
      id: `MC-${Math.floor(Math.random() * 10000)}`,
      name: "",
      type: "",
      status: "Đang vận hành",
      price: 0,
      quantity: 1,
      hashtags: [] as string[],
      specs: "", // Lưu mô tả hoặc thông số

      // File Logic
      image: "",
      fileType: "0", // 0: PDF, 1: Editor
      technicalDoc: "", // Content HTML hoặc Base64 PDF
      manualFile: "",
      inspectionFile: "",

      // Danh sách nhà cung cấp
      suppliers: [] as any[],
    },
    validate: {
      id: (val) => (!val ? "Vui lòng nhập mã máy" : null),
      name: (val) => (!val ? "Vui lòng nhập tên máy" : null),
      type: (val) => (!val ? "Vui lòng chọn loại máy" : null),
    },
  });

  // --- LOGIC OPTIONS ---
  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.name, label: c.name })),
    [categories]
  );
  const supplierOptions = useMemo(
    () => companies.map((c) => ({ value: c.id, label: c.name })),
    [companies]
  );

  // --- HANDLERS ---

  // Upload Ảnh chính
  const handleDropImage = async (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      form.setFieldValue("image", base64);
    }
  };

  // Xóa ảnh chính
  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setFieldValue("image", "");
  };

  // Upload Tài liệu (Generic)
  const handleDropFile = async (
    files: FileWithPath[],
    field: string,
    setPreview: (val: string) => void,
    isPdfName: boolean = false
  ) => {
    const file = files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      form.setFieldValue(field, base64);
      if (isPdfName) {
        setPreview(file.name); // Lưu tên file để hiển thị
      } else {
        setPreview(base64); // Lưu base64 để preview iframe
      }
      notifications.show({ message: "Đã tải file lên", color: "blue" });
    }
  };

  // Xóa tài liệu kỹ thuật
  const handleRemoveTechDoc = () => {
    setTechDocName("");
    form.setFieldValue("technicalDoc", "");
  };
  const handleRemoveGuideDoc = () => {
    setManualPreviewUrl("");
    form.setFieldValue("manualFile", "");
  };
  const handleRemoveInspectionFile = () => {
    setInspectionPreviewUrl("");
    form.setFieldValue("inspectionFile", "");
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
  const handleSubmit = async (values: typeof form.values) => {
    //@ts-expect-error no check
    const success = await addMachine(values);
    if (success) {
      notifications.show({
        title: "Thành công",
        message: "Thêm máy móc thành công",
        color: "green",
        icon: <IconCheck />,
      });
      navigate(-1);
    } else {
      notifications.show({
        title: "Lỗi",
        message: "Có lỗi xảy ra",
        color: "red",
      });
    }
  };

  const nextStep = () => {
    if (active === 0) {
      const { hasErrors } = form.validate();
      if (hasErrors) return;
    }
    setActive((current) => (current < 4 ? current + 1 : current));
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Card shadow="sm" p="lg" radius={4} pos="relative">
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
        <Title order={3}>Thêm mới máy móc</Title>
      </Group>

      <Stepper active={active} onStepClick={setActive}>
        {/* BƯỚC 1: THÔNG TIN */}
        <Stepper.Step label="Bước 1" description="Thông tin">
          <Group grow align="flex-start">
            <Stack gap={"xs"}>
              <TextInput
                label="Mã máy"
                radius={4}
                {...form.getInputProps("id")}
                required
              />
              <TextInput
                label="Tên máy móc"
                {...form.getInputProps("name")}
                required
                radius={4}
              />
              <Select
                searchable
                clearable
                required
                label="Loại máy móc/thiết bị"
                placeholder="Chọn loại máy"
                data={categoryOptions} // Data động từ Store Category
                {...form.getInputProps("type")}
                radius={4}
              />
              <NumberInput
                label="Giá nhập (VND)"
                thousandSeparator
                {...form.getInputProps("price")}
                radius={4}
              />
              <MultiSelect
                label="HashTag"
                data={[
                  "Sử dụng thường xuyên",
                  "Sử dụng mùa hè",
                  "Máy mới",
                  "Máy cũ",
                ]}
                {...form.getInputProps("hashtags")}
                radius={4}
              />
            </Stack>

            <Stack>
              <Input.Wrapper label="Ảnh máy móc">
                <Dropzone
                  onDrop={handleDropImage}
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
                      <IconUpload size={52} color="blue" />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX size={52} color="red" />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconPhoto size={52} color="gray" />
                    </Dropzone.Idle>
                    <div>
                      <Text size="xl" inline>
                        Bỏ và thả ảnh máy móc tại đây
                      </Text>
                      <Text size="sm" c="dimmed">
                        Đính kèm ảnh máy móc (tối đa 5MB)
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
              </Input.Wrapper>

              {/* --- PHẦN HIỂN THỊ ẢNH + NÚT XÓA --- */}
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
                    onClick={handleRemoveImage} // Gọi hàm xóa
                  >
                    <IconX size={14} />
                  </ActionIcon>
                </div>
              )}
            </Stack>
          </Group>
        </Stepper.Step>

        {/* BƯỚC 2: TÀI LIỆU KỸ THUẬT */}
        <Stepper.Step label="Bước 2" description="Tài liệu kỹ thuật">
          <Stack gap={"xs"}>
            <Radio.Group
              label="Tài liệu kỹ thuật chính"
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
                  onDrop={(f) =>
                    handleDropFile(f, "technicalDoc", setTechDocName, true)
                  }
                  maxSize={5 * 1024 ** 2}
                  accept={["application/pdf"]}
                >
                  <Group
                    justify="center"
                    gap="xl"
                    mih={150}
                    style={{ pointerEvents: "none" }}
                  >
                    <Dropzone.Idle>
                      <IconUpload size={52} color="gray" />
                    </Dropzone.Idle>
                    <div>
                      <Text size="lg" inline>
                        Bỏ và thả tài liệu kỹ thuật (PDF)
                      </Text>
                    </div>
                  </Group>
                </Dropzone>

                {/* --- PREVIEW PDF + NÚT XÓA --- */}
                {form.values.technicalDoc && form.values.fileType === "0" && (
                  <div style={{ position: "relative", marginTop: "1rem" }}>
                    <iframe
                      src={form.values.technicalDoc}
                      width="100%"
                      height="800px"
                      style={{
                        border: "1px solid #dee2e6",
                        borderRadius: "8px",
                      }}
                      title="PDF Preview"
                    />
                    <ActionIcon
                      color="red"
                      variant="filled"
                      radius="xl"
                      style={{ position: "absolute", top: 10, right: 10 }}
                      onClick={handleRemoveTechDoc}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                    <Text size="sm" ta="center" mt={4} c="dimmed">
                      {techDocName || "Tài liệu kỹ thuật"}
                    </Text>
                  </div>
                )}
              </Stack>
            ) : (
              <Stack>
                <Text style={{ fontSize: 14, fontWeight: 500 }}>
                  Nội dung chi tiết
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

            <Divider my="md" label="Tài liệu bổ sung" labelPosition="center" />

            <SimpleGrid cols={2}>
              <Stack gap={2}>
                <Text fw={500} size="sm">
                  Sổ tay hướng dẫn (PDF)
                </Text>
                <Dropzone
                  onDrop={(f) =>
                    handleDropFile(f, "manualFile", setManualPreviewUrl, false)
                  }
                  maxSize={5 * 1024 ** 2}
                  accept={["application/pdf"]}
                >
                  <Group
                    justify="center"
                    mih={80}
                    style={{ pointerEvents: "none" }}
                  >
                    <IconUpload size={30} color="gray" />
                    <Text size="sm">Upload file</Text>
                  </Group>
                </Dropzone>

                {manualPreviewUrl && (
                  <div style={{ position: "relative", marginTop: "1rem" }}>
                    <iframe
                      src={manualPreviewUrl}
                      width="100%"
                      height="400px"
                      style={{
                        border: "1px solid #dee2e6",
                        borderRadius: "8px",
                      }}
                      title="PDF Preview"
                    />
                    <ActionIcon
                      color="red"
                      variant="filled"
                      radius="xl"
                      style={{ position: "absolute", top: 10, right: 10 }}
                      onClick={handleRemoveGuideDoc}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                    <Text size="sm" ta="center" mt={4} c="dimmed">
                      Tài liệu hướng dẫn
                    </Text>
                  </div>
                )}
              </Stack>
              <Stack gap={2}>
                <Text fw={500} size="sm">
                  Biên bản đăng kiểm (PDF/Image)
                </Text>
                <Dropzone
                  onDrop={(f) =>
                    handleDropFile(
                      f,
                      "inspectionFile",
                      setInspectionPreviewUrl,
                      false
                    )
                  }
                  maxSize={5 * 1024 ** 2}
                  accept={["application/pdf"]}
                >
                  <Group
                    justify="center"
                    mih={80}
                    style={{ pointerEvents: "none" }}
                  >
                    <IconUpload size={30} color="gray" />
                    <Text size="sm">Upload file</Text>
                  </Group>
                </Dropzone>
                {inspectionPreviewUrl && (
                  <div style={{ position: "relative", marginTop: "1rem" }}>
                    <iframe
                      src={inspectionPreviewUrl}
                      width="100%"
                      height="400px"
                      style={{
                        border: "1px solid #dee2e6",
                        borderRadius: "8px",
                      }}
                      title="PDF Preview"
                    />
                    <ActionIcon
                      color="red"
                      variant="filled"
                      radius="xl"
                      style={{ position: "absolute", top: 10, right: 10 }}
                      onClick={handleRemoveInspectionFile}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                    <Text size="sm" ta="center" mt={4} c="dimmed">
                      Biên bảng đăng kiểm
                    </Text>
                  </div>
                )}
              </Stack>
            </SimpleGrid>
          </Stack>
        </Stepper.Step>

        {/* BƯỚC 3: NHÀ CUNG CẤP */}
        <Stepper.Step label="Bước 3" description="Nhà cung cấp">
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
          </Stack>
        </Stepper.Step>

        {/* BƯỚC 4: XÁC NHẬN */}
        <Stepper.Step label="Bước 4" description="Xác nhận thông tin">
          <Stack>
            <Title order={5}>📄 Thông tin tổng quan</Title>
            <Group grow align="flex-start">
              <Card h={300} withBorder radius={4} p="md" style={{ flex: 1 }}>
                <Stack gap={"xs"}>
                  <Title order={4}>Thông tin cơ bản</Title>
                  <Text>
                    <b>Mã máy:</b> {form.values.id}
                  </Text>
                  <Text>
                    <b>Tên máy:</b> {form.values.name}
                  </Text>
                  <Text>
                    <b>Loại:</b> {form.values.type}
                  </Text>
                  <Text>
                    <b>Giá ước tính:</b> {form.values.price.toLocaleString()}{" "}
                    VND
                  </Text>
                  <Group gap="xs">
                    {form.values.hashtags.map((t) => (
                      <Badge key={t} variant="light" color="gray">
                        {t}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              </Card>
              <Card h={300} withBorder radius={4} p="md" style={{ flex: 1 }}>
                <Stack align="center" justify="center" h="100%">
                  <Title order={5} w="100%" ta="left">
                    Hình ảnh
                  </Title>
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      h={220}
                      fit="contain"
                      radius="md"
                      bg="gray.1"
                    />
                  ) : (
                    <Text c="dimmed">Chưa có ảnh</Text>
                  )}
                </Stack>
              </Card>
            </Group>

            <Divider label="Nhà cung cấp" />
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

            <Divider label="Tài liệu & Hồ sơ" />

            {/* 1. TÀI LIỆU KỸ THUẬT CHÍNH */}
            <Card withBorder radius={4} p="md">
              <Group justify="space-between" mb="sm">
                <Text fw={600}>📘 Tài liệu kỹ thuật chính</Text>
                <Badge
                  variant="light"
                  color={form.values.fileType === "0" ? "blue" : "orange"}
                >
                  {form.values.fileType === "0" ? "File PDF" : "Soạn thảo"}
                </Badge>
              </Group>

              {form.values.fileType === "0" ? (
                form.values.technicalDoc ? (
                  <iframe
                    src={form.values.technicalDoc}
                    width="100%"
                    height="500px"
                    style={{ border: "1px solid #dee2e6", borderRadius: 8 }}
                    title="Technical Doc Preview"
                  />
                ) : (
                  <Text c="dimmed" fs="italic" ta="center" py="xl">
                    Chưa tải tài liệu lên
                  </Text>
                )
              ) : (
                // Nếu là soạn thảo thì hiển thị nội dung HTML
                <Paper
                  withBorder
                  p="md"
                  bg="gray.0"
                  mah={400}
                  style={{ overflowY: "auto" }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: form.values.technicalDoc,
                    }}
                  />
                </Paper>
              )}
            </Card>

            {/* 2. TÀI LIỆU BỔ SUNG (HIỂN THỊ 2 CỘT) */}
            {(form.values.manualFile || form.values.inspectionFile) && (
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                {/* Sổ tay */}
                {form.values.manualFile && (
                  <Card withBorder radius={4} p="md">
                    <Text fw={600} mb="xs">
                      📕 Sổ tay hướng dẫn
                    </Text>
                    <iframe
                      src={form.values.manualFile}
                      width="100%"
                      height="300px"
                      style={{ border: "1px solid #dee2e6", borderRadius: 8 }}
                      title="Manual Preview"
                    />
                  </Card>
                )}

                {/* Đăng kiểm */}
                {form.values.inspectionFile && (
                  <Card withBorder radius={4} p="md">
                    <Text fw={600} mb="xs">
                      📑 Biên bản đăng kiểm
                    </Text>
                    <iframe
                      src={form.values.inspectionFile}
                      width="100%"
                      height="300px"
                      style={{ border: "1px solid #dee2e6", borderRadius: 8 }}
                      title="Inspection Preview"
                    />
                  </Card>
                )}
              </SimpleGrid>
            )}
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
              Thêm mới máy móc thành công!
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Máy móc mới đã được thêm thành công vào hệ thống.
            </Text>
            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Quay về danh sách
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      {active < 4 && (
        <Group mt="xl" justify="space-between">
          <Button
            radius={4}
            variant="default"
            onClick={prevStep}
            disabled={active === 0}
          >
            Quay lại
          </Button>

          {active < 3 ? (
            <Button radius={4} onClick={nextStep}>
              Tiếp theo
            </Button>
          ) : (
            <Button
              radius={4}
              onClick={() => form.onSubmit(handleSubmit)()}
              loading={isLoading}
              color="green"
            >
              Hoàn thành & Lưu
            </Button>
          )}
        </Group>
      )}
    </Card>
  );
};

export default MachineManagementMainAddPage;
