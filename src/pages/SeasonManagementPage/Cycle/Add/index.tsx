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
  FileInput,
  Radio,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconFileTypePdf } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import ConfirmStep from "./components/ConfirmStep";
import CatalogList from "../../../../components/CatalogList";
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
          document: "",
          documentType: "",
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
            <Stepper.Step label="Bước 1" description="Thông tin chung" />
            <Stepper.Step label="Bước 2" description="Danh sách giai đoạn" />
            <Stepper.Step label="Bước 3" description="Xác nhận" />
          </Stepper>

          {active === 0 && (
            <Stack gap={"xs"}>
              <Select
                label="Nhóm cây cây trồng"
                placeholder="Nhóm cây trồng"
                {...form.getInputProps("varietyId")}
                radius={4}
              />

              <CatalogList />
              <NumberInput
                label="Thời gian diễn ra chu kì ( ngày )"
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
                  <Stack gap={"xs"}>
                    <Radio.Group
                      label="Tài liệu kỹ thuật"
                      value={stage.documentType}
                      onChange={(val) =>
                        form.setFieldValue(`stages.${index}.documentType`, val)
                      }
                    >
                      <Group mt="xs">
                        <Radio value="file" label="Tải file PDF" />
                        <Radio value="editor" label="Tài liệu kỹ thuật" />
                      </Group>
                    </Radio.Group>

                    {stage.documentType === "file" ? (
                      <FileInput
                        label="Tài liệu kỹ thuật (PDF)"
                        placeholder="Chọn tài liệu"
                        accept="application/pdf"
                        leftSection={<IconFileTypePdf size={18} />}
                        radius={4}
                        {...form.getInputProps("technicalDoc")}
                      />
                    ) : (
                      <Stack>
                        <Text style={{ fontSize: 14, fontWeight: 500 }}>
                          Nội dung kỹ thuật
                        </Text>
                        <SunEditor
                          setOptions={{ height: "200px" }}
                          setContents={stage.document}
                          onChange={(val) =>
                            form.setFieldValue("document", val)
                          }
                        />
                      </Stack>
                    )}
                  </Stack>
                </Paper>
              ))}
              <Button variant="light" onClick={handleAddStage} radius={4}>
                + Thêm giai đoạn
              </Button>
            </Stack>
          )}
          {active === 2 && <ConfirmStep />}
          <Group justify="space-between" mt="md">
            <Button
              variant="default"
              onClick={() => setActive(Math.max(active - 1, 0))}
              disabled={active === 0}
              radius={4}
            >
              Quay lại
            </Button>
            {active < 2 ? (
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
