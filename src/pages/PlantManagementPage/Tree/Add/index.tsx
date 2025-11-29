import {
  Button,
  Card,
  Group,
  Stack,
  Title,
  TextInput,
  Select,
  Stepper,
  Textarea,
  MultiSelect,
  Text,
  NumberInput,
  Input,
  Radio,
  LoadingOverlay,
  SimpleGrid,
  Badge,
  ActionIcon,
  Image, // Thêm Image, ActionIcon
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconPhoto,
  IconSearch,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  type FileWithPath,
} from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

// Components
import SeedCard from "./components/SeedCard";
import Scrollable from "../../../../components/Scrollable";
import ConfirmStep from "./components/ConfirmStep";

// Store
import { useTreeStore, type Tree } from "../../../zustand/treeStore";
import { useCropGroupStore } from "../../../zustand/cropGroupStore";
import { useSeedStore } from "../../../zustand/seedStore";
import { useVarietyStore } from "../../../zustand/varietyStore";

// Helper Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });
};

const PlantManagementTreeAddPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // STORE
  const {
    addTree,
    updateTree,
    getTreeById,
    isLoading: loadingTree,
  } = useTreeStore();
  const { groups } = useCropGroupStore();
  const { seeds } = useSeedStore();
  const { varieties } = useVarietyStore();

  const [activeStep, setActiveStep] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [seedSearch, setSeedSearch] = useState("");

  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      group: "",
      type: "",
      variety: "",
      note: "",
      imgUrl: "",
      seedCode: "",
      harvestMethod: "",
      growthCycles: [] as {
        id: string;
        name: string;
        stages: string[];
        estimatedTime: number;
      }[],
      techDocType: "editor",
      techDocContent: "",
      standardDocType: "editor",
      standardDocContent: "",
      pestDocType: "editor",
      pestDocContent: "",
    },
    validate: {
      id: (val) => (val.trim().length === 0 ? "Vui lòng nhập mã" : null),
      name: (val) => (val.trim().length === 0 ? "Vui lòng nhập tên" : null),
      type: (val) => (!val ? "Vui lòng chọn loại cây" : null),
      variety: (val) => (!val ? "Vui lòng chọn giống cây" : null),
    },
  });

  // LOAD DATA EDIT
  useEffect(() => {
    if (isEdit && id) {
      const data = getTreeById(id);
      if (data) {
        form.setValues({
          ...data,
          seedCode: data.seedCode || "",
          growthCycles: data.growthCycles || [],
        });
        setImagePreview(data.imgUrl);
      }
    } else {
      form.setFieldValue("id", `TREE-${Math.floor(Math.random() * 10000)}`);
    }
  }, [id]);

  // OPTIONS LOGIC
  const cropTypeOptions = useMemo(
    () => groups.map((g) => ({ value: g.name, label: g.name })),
    [groups]
  );

  const varietyOptions = useMemo(() => {
    if (!form.values.type) return [];
    return varieties
      .filter((v) => v.treeName === form.values.type)
      .map((v) => ({ value: v.name, label: v.name }));
  }, [varieties, form.values.type]);

  const filteredSeeds = useMemo(() => {
    return seeds.filter(
      (s) =>
        s.name.toLowerCase().includes(seedSearch.toLowerCase()) ||
        s.id.toLowerCase().includes(seedSearch.toLowerCase())
    );
  }, [seeds, seedSearch]);

  const selectedSeedObj = useMemo(
    () => seeds.find((s) => s.id === form.values.seedCode),
    [seeds, form.values.seedCode]
  );

  // HANDLERS
  const handleDropImage = async (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      form.setFieldValue("imgUrl", base64);
    }
  };

  // --- LOGIC XÓA ẢNH ---
  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setFieldValue("imgUrl", "");
  };

  // VALIDATE NEXT STEP
  const handleNextStep = () => {
    if (activeStep === 0) {
      const { hasErrors } = form.validate();
      if (hasErrors) return;
    }
    setActiveStep((current) => current + 1);
  };

  const handleSubmit = async () => {
    const values = form.getValues();
    const payload: Tree = {
      ...values,
      seedName: selectedSeedObj ? selectedSeedObj.name : "",
    };

    let success = false;
    if (isEdit && id) {
      success = await updateTree(id, payload);
    } else {
      success = await addTree(payload);
    }

    if (success) {
      notifications.show({
        title: "Thành công",
        message: isEdit ? "Đã cập nhật" : "Đã thêm mới",
        color: "green",
      });
      navigate(-1);
    }
  };

  return (
    <Card withBorder shadow="md" radius={12} p="xl" pos="relative">
      <LoadingOverlay visible={loadingTree} />
      <Group mb="md">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>
          🌿 {isEdit ? "Cập nhật cây trồng" : "Thêm mới cây trồng"}
        </Title>
      </Group>

      <Stepper
        active={activeStep}
        onStepClick={setActiveStep}
        mt="xs"
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="Bước 1" description="Thông tin cây" />
        <Stepper.Step label="Bước 2" description="Hạt giống" />
        <Stepper.Step label="Bước 3" description="Thu hoạch" />
        <Stepper.Step label="Bước 4" description="Sinh trưởng" />
        <Stepper.Step label="Bước 5" description="Tài liệu" />
        <Stepper.Step label="Bước 6" description="Xác nhận" />
      </Stepper>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {/* --- BƯỚC 1 --- */}
        {activeStep === 0 && (
          <Group grow align="flex-start" mt="md" gap="xs">
            <Stack gap={"xs"}>
              <TextInput
                label="Mã cây"
                required
                {...form.getInputProps("id")}
                radius={4}
                readOnly={isEdit}
              />
              <TextInput
                label="Tên cây"
                required
                {...form.getInputProps("name")}
                radius={4}
              />
              <Select
                label="Nhóm cây trồng"
                placeholder="Chọn nhóm"
                data={[
                  "Cây ăn trái",
                  "Cây công nghiệp",
                  "Cây lương thực",
                  "Rau màu",
                  "Cây dược liệu",
                ]}
                {...form.getInputProps("group")}
                radius={4}
              />
              <Select
                label="Loại cây"
                placeholder="Chọn loại cây"
                data={cropTypeOptions}
                searchable
                nothingFoundMessage="Không tìm thấy"
                {...form.getInputProps("type")}
                radius={4}
                withAsterisk
                onChange={(val) => {
                  form.setFieldValue("type", val || "");
                  form.setFieldValue("variety", "");
                }}
              />
              <Select
                label="Giống cây"
                placeholder={
                  form.values.type
                    ? "Chọn giống cây"
                    : "Vui lòng chọn loại cây trước"
                }
                data={varietyOptions}
                disabled={!form.values.type}
                searchable
                nothingFoundMessage="Không tìm thấy"
                {...form.getInputProps("variety")}
                radius={4}
                withAsterisk
              />
            </Stack>

            <Stack gap={"xs"}>
              <Input.Wrapper label="Ảnh cây trồng">
                <Dropzone
                  onDrop={handleDropImage}
                  maxSize={5 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                >
                  <Group
                    justify="center"
                    gap="xl"
                    mih={180}
                    style={{ pointerEvents: "none" }}
                  >
                    <Dropzone.Idle>
                      <IconPhoto size={50} color="gray" />
                    </Dropzone.Idle>
                    <div>
                      <Text size="sm" inline>
                        Kéo thả ảnh tại đây
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
              </Input.Wrapper>

              {/* --- PHẦN HIỂN THỊ ẢNH CÓ NÚT XÓA --- */}
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
                    alt="Preview"
                    h={150}
                    w="auto"
                    fit="cover"
                    radius="md"
                    style={{ border: "1px solid #eee" }}
                  />
                  <ActionIcon
                    variant="filled"
                    color="red"
                    size="sm"
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
                {...form.getInputProps("note")}
                radius={4}
                minRows={3}
              />
            </Stack>
          </Group>
        )}

        {/* --- CÁC BƯỚC KHÁC (GIỮ NGUYÊN NHƯ CŨ) --- */}
        {activeStep === 1 && (
          <Stack mt="md">
            <Group justify="space-between">
              <Text fw={500}>Hạt giống</Text>
              {form.values.seedCode && (
                <Badge size="lg" color="green" variant="light">
                  Đang chọn: {selectedSeedObj?.name || form.values.seedCode}
                </Badge>
              )}
            </Group>
            <TextInput
              placeholder="Tìm kiếm hạt giống..."
              leftSection={<IconSearch size={16} />}
              value={seedSearch}
              onChange={(e) => setSeedSearch(e.currentTarget.value)}
            />
            <Scrollable h={450}>
              <Group p="xs" align="flex-start">
                {filteredSeeds.length > 0 ? (
                  filteredSeeds.map((seed) => (
                    <SeedCard
                      key={seed.id}
                      seedCode={seed.id}
                      name={seed.name}
                      provider={seed.supplier}
                      origin={seed.origin}
                      germinationRate={seed.germinationRate}
                      yield={Number(seed.yield)}
                      backgroundImage={seed.imgUrl}
                      isActive={form.values.seedCode === seed.id}
                      onSelect={(code) => form.setFieldValue("seedCode", code)}
                    />
                  ))
                ) : (
                  <Text c="dimmed" size="sm" ta="center" w="100%" py="xl">
                    Chưa có dữ liệu hạt giống.
                  </Text>
                )}
              </Group>
            </Scrollable>
          </Stack>
        )}

        {activeStep === 2 && (
          <Stack mt="md">
            <Select
              label="Phương pháp thu hoạch"
              placeholder="Chọn phương pháp"
              data={[
                "Thu hoạch thủ công (Hái tay)",
                "Thu hoạch cơ giới (Máy gặt)",
                "Thu hoạch bán cơ giới",
              ]}
              {...form.getInputProps("harvestMethod")}
              radius={4}
            />
          </Stack>
        )}

        {activeStep === 3 && (
          <Stack mt="md">
            {form.values.growthCycles.map((cycle, index) => (
              <Card key={index} withBorder radius="md" p="sm" bg="gray.0">
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text fw={500} size="sm">
                      Chu kỳ #{index + 1}
                    </Text>
                    <Button
                      color="red"
                      variant="subtle"
                      size="compact-xs"
                      onClick={() => form.removeListItem("growthCycles", index)}
                    >
                      <IconX size={14} /> Xóa
                    </Button>
                  </Group>
                  <Select
                    label="Tên chu kỳ"
                    placeholder="Chọn hoặc nhập"
                    searchable
                    data={[
                      "Kiến thiết cơ bản",
                      "Kinh doanh (Ra hoa - Thu hoạch)",
                      "Phục hồi sau thu hoạch",
                    ]}
                    {...form.getInputProps(`growthCycles.${index}.name`)}
                  />
                  <MultiSelect
                    label="Giai đoạn chi tiết"
                    placeholder="Chọn các giai đoạn"
                    data={[
                      "Gieo hạt",
                      "Nảy mầm",
                      "Cây con",
                      "Phát triển thân lá",
                      "Ra hoa",
                      "Đậu quả",
                      "Nuôi quả",
                      "Chín",
                      "Thu hoạch",
                    ]}
                    {...form.getInputProps(`growthCycles.${index}.stages`)}
                  />
                  <NumberInput
                    label="Thời gian ước tính (ngày)"
                    min={0}
                    {...form.getInputProps(
                      `growthCycles.${index}.estimatedTime`
                    )}
                  />
                </Stack>
              </Card>
            ))}
            <Button
              variant="outline"
              radius={4}
              onClick={() =>
                form.insertListItem("growthCycles", {
                  id: crypto.randomUUID(),
                  name: "",
                  stages: [],
                  estimatedTime: 0,
                })
              }
            >
              + Thêm chu kỳ sinh trưởng
            </Button>
          </Stack>
        )}

        {activeStep === 4 && (
          <Stack mt="md">
            <Card withBorder radius="md" p="sm">
              <Text fw={500} mb="xs">
                1. Kỹ thuật canh tác
              </Text>
              <Radio.Group
                value={form.values.techDocType}
                onChange={(val) => form.setFieldValue("techDocType", val)}
                mb="xs"
              >
                <Group>
                  <Radio value="editor" label="Soạn thảo nội dung" />
                  <Radio value="file" label="Upload PDF" />
                </Group>
              </Radio.Group>
              {form.values.techDocType === "editor" ? (
                <SunEditor
                  setContents={form.values.techDocContent}
                  onChange={(c) => form.setFieldValue("techDocContent", c)}
                  setOptions={{ height: "150px" }}
                />
              ) : (
                <TextInput
                  leftSection={<IconUpload size={16} />}
                  placeholder="Nhập tên file hoặc URL (Demo)"
                  {...form.getInputProps("techDocContent")}
                />
              )}
            </Card>

            <Card withBorder radius="md" p="sm">
              <Text fw={500} mb="xs">
                2. Tiêu chuẩn chất lượng
              </Text>
              <Radio.Group
                value={form.values.standardDocType}
                onChange={(val) => form.setFieldValue("standardDocType", val)}
                mb="xs"
              >
                <Group>
                  <Radio value="editor" label="Soạn thảo nội dung" />
                  <Radio value="file" label="Upload PDF" />
                </Group>
              </Radio.Group>
              {form.values.standardDocType === "editor" ? (
                <SunEditor
                  setContents={form.values.standardDocContent}
                  onChange={(c) => form.setFieldValue("standardDocContent", c)}
                  setOptions={{ height: "150px" }}
                />
              ) : (
                <TextInput
                  leftSection={<IconUpload size={16} />}
                  placeholder="Nhập tên file hoặc URL (Demo)"
                  {...form.getInputProps("standardDocContent")}
                />
              )}
            </Card>
          </Stack>
        )}

        {activeStep === 5 && (
          <ConfirmStep
            data={form.values}
            imagePreview={imagePreview}
            seedName={selectedSeedObj?.name || form.values.seedCode}
          />
        )}

        {/* --- NAVIGATION BUTTONS --- */}
        <Group justify="space-between" mt="xl">
          <Button
            variant="default"
            type="button"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((p) => p - 1)}
            radius={4}
          >
            Quay lại
          </Button>
          {activeStep < 5 ? (
            <Button type="button" onClick={handleNextStep} radius={4}>
              Tiếp theo
            </Button>
          ) : (
            <Button onClick={handleSubmit} color="green" radius={4}>
              Lưu & Hoàn tất
            </Button>
          )}
        </Group>
      </form>
    </Card>
  );
};

export default PlantManagementTreeAddPage;
