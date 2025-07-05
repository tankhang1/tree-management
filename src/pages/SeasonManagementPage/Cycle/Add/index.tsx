import {
  Button,
  Group,
  Stack,
  TextInput,
  NumberInput,
  Textarea,
  Title,
  Stepper,
  Paper,
  Card,
  Select,
  FileInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconFileTypePdf } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const SeasonManagementCycleAddPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const form = useForm({
    initialValues: {
      varietyId: "",
      duration: 0,
      stages: [
        {
          name: "",
          duration: 0,
          conditionNote: "",
          document: null as File | null,
        },
      ],
    },
    validate: {
      varietyId: (val) => (!val ? "Vui lòng chọn giống cây" : null),
    },
  });

  const handleAddStage = () => {
    form.insertListItem("stages", {
      name: "",
      duration: 0,
      conditionNote: "",
      document: null,
    });
  };
  return (
    <Card withBorder shadow="sm" radius={4} p="lg">
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
          <Stepper active={active} onStepClick={setActive}>
            <Stepper.Step label="Thông tin chung" />
            <Stepper.Step label="Danh sách giai đoạn" />
          </Stepper>

          {active === 0 && (
            <Stack gap={"xs"}>
              <Select
                label="Nhóm cây trồng"
                placeholder="Chọn nhóm cây trồng"
                {...form.getInputProps("varietyId")}
                radius={4}
              />
              <Select
                label="Danh mục cây trồng"
                placeholder="Chọn danh mục cây trồng"
                {...form.getInputProps("varietyId")}
                radius={4}
              />
              <Select
                label="Giống cây trồng"
                placeholder="VRI-001"
                {...form.getInputProps("varietyId")}
                radius={4}
              />
              <NumberInput
                label="Tổng thời gian phát triển"
                placeholder="Nhập số ngày"
                min={1}
                {...form.getInputProps("duration")}
                radius={4}
              />
            </Stack>
          )}

          {active === 1 && (
            <Stack gap={"xs"}>
              {form.values.stages.map((stage, index) => (
                <Paper key={index} withBorder p="md" radius={4}>
                  <Title order={5}>Giai đoạn {index + 1}</Title>
                  <TextInput
                    mt="xs"
                    label="Tên giai đoạn"
                    placeholder="Ví dụ: Nảy mầm"
                    {...form.getInputProps(`stages.${index}.name`)}
                    radius={4}
                  />
                  <NumberInput
                    mt="xs"
                    label="Thời gian (ngày)"
                    placeholder="10"
                    min={1}
                    {...form.getInputProps(`stages.${index}.duration`)}
                    radius={4}
                  />
                  <Textarea
                    mt="xs"
                    label="Điều kiện đặc thù"
                    placeholder="Độ ẩm, ánh sáng..."
                    {...form.getInputProps(`stages.${index}.conditionNote`)}
                    radius={4}
                  />
                  <FileInput
                    mt="xs"
                    leftSection={<IconFileTypePdf />}
                    label="Tài liệu đính kèm"
                    placeholder="Chọn file PDF"
                    accept="application/pdf"
                    {...form.getInputProps(`stages.${index}.document`)}
                    radius={4}
                  />
                </Paper>
              ))}
              <Button variant="light" onClick={handleAddStage} radius={4}>
                + Thêm giai đoạn
              </Button>
            </Stack>
          )}

          <Group justify="space-between" mt="md">
            <Button
              variant="default"
              onClick={() => setActive(Math.max(active - 1, 0))}
              disabled={active === 0}
              radius={4}
            >
              Quay lại
            </Button>
            {active < 1 ? (
              <Button onClick={() => setActive(active + 1)} radius={4}>
                Tiếp tục
              </Button>
            ) : (
              <Button color="green" radius={4}>
                Tạo mới
              </Button>
            )}
          </Group>
        </Stack>
      </form>
    </Card>
  );
};
export default SeasonManagementCycleAddPage;
