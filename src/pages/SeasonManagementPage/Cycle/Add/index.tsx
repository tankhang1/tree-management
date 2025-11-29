import {
  Button,
  Group,
  Stack,
  TextInput,
  NumberInput,
  Title,
  Stepper,
  Paper,
  Card,
  Select,
  Radio,
  Text,
  Image,
  ActionIcon,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconPhoto,
  IconPlus,
  IconTrash,
  IconUpload,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import { Dropzone, type FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import "suneditor/dist/css/suneditor.min.css";

// Components
import ConfirmStep from "./components/ConfirmStep";

// Stores
import { useVarietyStore } from "../../../zustand/varietyStore";
import {
  useGrowthCycleStore,
  type GrowthCycle,
} from "../../../zustand/growthCycleStore";

// Helper Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const SeasonManagementCycleAddPage = () => {
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  const { varieties } = useVarietyStore(); // Lấy danh sách giống cây
  const { addCycle, isLoading } = useGrowthCycleStore();

  const [active, setActive] = useState(0);

  // 2. FORM SETUP
  const form = useForm({
    initialValues: {
      varietyId: "",
      duration: 0,
      stages: [
        {
          name: "Giai đoạn 1",
          duration: 0,
          conditionNote: "",
          documentType: "editor", // Mặc định là editor
          documentContent: "", // Chứa HTML hoặc Base64 file
          fileName: "", // Chỉ dùng để hiển thị tên file nếu là upload
        },
      ],
    },
    validate: {
      varietyId: (val) => (!val ? "Vui lòng chọn giống cây" : null),
      duration: (val) => (val <= 0 ? "Thời gian phải lớn hơn 0" : null),
    },
  });

  // --- HANDLERS ---

  // Thêm giai đoạn
  const handleAddStage = () => {
    form.insertListItem("stages", {
      name: "",
      duration: 0,
      conditionNote: "",
      documentType: "editor",
      documentContent: "",
      fileName: "",
    });
  };

  // Xóa giai đoạn
  const handleRemoveStage = (index: number) => {
    form.removeListItem("stages", index);
  };

  // Upload file cho từng giai đoạn
  const handleDropFile = async (files: FileWithPath[], index: number) => {
    const file = files[0];
    if (file) {
      try {
        // Trong thực tế nên upload lên server lấy URL, ở đây demo dùng base64
        // const base64 = await fileToBase64(file);
        // Để tránh quota exceeded với file lớn, ta giả lập lưu tên file

        form.setFieldValue(
          `stages.${index}.documentContent`,
          "Giả lập file content (Base64 quá nặng)"
        );
        form.setFieldValue(`stages.${index}.fileName`, file.name);

        notifications.show({ message: "Đã tải file lên", color: "green" });
      } catch (e) {
        notifications.show({ message: "Lỗi tải file", color: "red" });
      }
    }
  };

  // Submit
  const handleFinish = async () => {
    // Lấy tên giống cây từ ID
    const selectedVariety = varieties.find(
      (v) => v.id === form.values.varietyId
    );

    const payload: Omit<GrowthCycle, "createdAt" | "id"> = {
      varietyId: form.values.varietyId,
      name: selectedVariety ? selectedVariety.name : "Unknown",
      duration: form.values.duration,
      // Map lại stage cho đúng chuẩn Store
      stages: form.values.stages.map((s) => ({
        name: s.name,
        duration: s.duration,
        conditionNote: s.conditionNote,
        documentType: s.documentType as "file" | "editor",
        documentContent: s.documentContent,
      })),
    };

    //@ts-expect-error no check
    const success = await addCycle(payload);
    if (success) {
      notifications.show({
        title: "Thành công",
        message: "Đã tạo chu kỳ sinh trưởng",
        color: "green",
        icon: <IconCheck />,
      });
      setActive(3);
    }
  };

  const nextStep = () => {
    if (active === 0) {
      const validation = form.validate();
      if (validation.hasErrors) return;
    }
    setActive((cur) => Math.min(cur + 1, 3));
  };
  const prevStep = () => setActive((cur) => Math.max(cur - 1, 0));

  // Options cho Select Giống cây
  const varietyOptions = useMemo(
    () =>
      varieties.map((v) => ({
        value: v.id,
        label: `${v.name} (${v.treeName})`,
      })),
    [varieties]
  );

  return (
    <Card withBorder shadow="sm" radius={4} p="lg" pos="relative">
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
        <Title order={3}>Thêm mới chu kì sinh trưởng</Title>
      </Group>

      <form>
        <Stack gap={"xs"}>
          <Stepper
            active={active}
            onStepClick={setActive}
            allowNextStepsSelect={false}
          >
            <Stepper.Step label="Bước 1" description="Thông tin chung" />
            <Stepper.Step label="Bước 2" description="Danh sách giai đoạn" />
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
                  Thêm mới chu kì sinh trưởng thành công!
                </Text>
                <Text fz={"md"} ta="center" c="dimmed">
                  Chu kì sinh trưởng mới đã được thêm thành công.
                </Text>

                <Button
                  size="md"
                  mt="md"
                  radius={4}
                  onClick={() => navigate(-1)}
                >
                  Quay về danh sách
                </Button>
              </Stack>
            </Stepper.Completed>
          </Stepper>

          {/* BƯỚC 1 */}
          {active === 0 && (
            <Stack gap={"xs"} mt="md">
              <Select
                searchable
                clearable
                label="Giống cây trồng"
                placeholder="Chọn giống cây"
                {...form.getInputProps("varietyId")}
                radius={4}
                data={varietyOptions}
                nothingFoundMessage="Không tìm thấy giống cây"
              />

              <NumberInput
                label="Tổng thời gian chu kì (ngày)"
                placeholder="Nhập số ngày"
                min={1}
                {...form.getInputProps("duration")}
                radius={4}
              />
            </Stack>
          )}

          {/* BƯỚC 2: DANH SÁCH GIAI ĐOẠN */}
          {active === 1 && (
            <Stack gap={"xs"} mt="md">
              {form.values.stages.map((stage, index) => (
                <Paper key={index} withBorder p="md" radius={4} shadow="xs">
                  <Group justify="space-between" mb="xs">
                    <Title order={5}>Giai đoạn {index + 1}</Title>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => handleRemoveStage(index)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>

                  <Group grow>
                    <TextInput
                      label="Tên giai đoạn"
                      placeholder="Ví dụ: Nảy mầm"
                      {...form.getInputProps(`stages.${index}.name`)}
                      radius={4}
                    />
                    <NumberInput
                      label="Thời gian (ngày)"
                      placeholder="10"
                      min={1}
                      {...form.getInputProps(`stages.${index}.duration`)}
                      radius={4}
                    />
                  </Group>

                  <Stack gap={"xs"} mt="sm">
                    <Radio.Group
                      label="Tài liệu kỹ thuật"
                      value={stage.documentType}
                      onChange={(val) =>
                        form.setFieldValue(`stages.${index}.documentType`, val)
                      }
                    >
                      <Group mt="xs">
                        <Radio value="file" label="Tải file PDF" />
                        <Radio value="editor" label="Soạn thảo" />
                      </Group>
                    </Radio.Group>

                    {stage.documentType === "file" ? (
                      <Dropzone
                        onDrop={(files) => handleDropFile(files, index)}
                        maxSize={5 * 1024 ** 2}
                        accept={["application/pdf"]}
                        multiple={false}
                      >
                        <Group
                          justify="center"
                          gap="xl"
                          mih={120}
                          style={{ pointerEvents: "none" }}
                        >
                          <Dropzone.Idle>
                            <IconUpload size={40} color="gray" />
                          </Dropzone.Idle>
                          <div>
                            <Text size="sm" inline>
                              Kéo và thả file tại đây
                            </Text>
                            <Text size="xs" c="dimmed">
                              Đính kèm file (tối đa 5MB)
                            </Text>
                          </div>
                        </Group>
                      </Dropzone>
                    ) : (
                      <Stack gap={2}>
                        <Text style={{ fontSize: 14, fontWeight: 500 }}>
                          Nội dung kỹ thuật
                        </Text>
                        <SunEditor
                          setOptions={{ height: "150px" }}
                          setContents={stage.documentContent}
                          onChange={(val) =>
                            form.setFieldValue(
                              `stages.${index}.documentContent`,
                              val
                            )
                          }
                        />
                      </Stack>
                    )}
                    {/* Hiển thị tên file nếu đã upload */}
                    {stage.documentType === "file" && stage.fileName && (
                      <Text size="xs" c="green" mt={-5}>
                        File đã chọn: {stage.fileName}
                      </Text>
                    )}
                  </Stack>
                </Paper>
              ))}
              <Button
                variant="outline"
                onClick={handleAddStage}
                radius={4}
                leftSection={<IconPlus size={16} />}
              >
                Thêm giai đoạn
              </Button>
            </Stack>
          )}

          {/* BƯỚC 3: CONFIRM */}
          {active === 2 && (
            <ConfirmStep
              data={{
                varietyId: form.values.varietyId,
                // Tìm tên giống để hiển thị đẹp hơn
                varietyLabel: varieties.find(
                  (v) => v.id === form.values.varietyId
                )?.name,
                duration: form.values.duration,
                stages: form.values.stages,
              }}
            />
          )}

          {/* NAVIGATION */}
          {active < 3 && (
            <Group justify="space-between" mt="md">
              <Button
                variant="default"
                onClick={prevStep}
                disabled={active === 0}
                radius={4}
              >
                Quay lại
              </Button>
              {active < 2 ? (
                <Button onClick={nextStep} radius={4}>
                  Tiếp tục
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  radius={4}
                  color="green"
                  loading={isLoading}
                >
                  Hoàn thành
                </Button>
              )}
            </Group>
          )}
        </Stack>
      </form>
    </Card>
  );
};
export default SeasonManagementCycleAddPage;
