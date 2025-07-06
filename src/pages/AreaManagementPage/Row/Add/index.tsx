import {
  Button,
  Card,
  Group,
  Stack,
  Title,
  Select,
  TextInput,
  Stepper,
  Text,
  Badge,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AreaManagementRowAddPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const form = useForm({
    initialValues: {
      regionId: "",
      areaId: "",
      code: "",
      name: "",
      area: "",
      mainCrops: [],
      irrigation: "",
      farming: "",
      gps: "",
      rows: [
        {
          name: "",
          code: "",
          crop: "",
          treeCount: "",
          gps: "",
        },
      ],
    },
  });
  const handleSubmit = () => {
    console.log("✅ Dữ liệu lô & hàng:", form.values);
  };

  const addRow = () => {
    form.insertListItem("rows", {
      name: "",
      code: "",
      crop: "",
      treeCount: "",
      gps: "",
    });
  };

  return (
    <Card withBorder shadow="md" radius={12} p="xl">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>📋 Tạo mới Hàng</Title>
      </Group>

      <Stepper
        active={activeStep}
        onStepClick={setActiveStep}
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="Vùng trồng" />
        <Stepper.Step label="Khu vực" />
        <Stepper.Step label="Lô" />
        <Stepper.Step label="Tạo hàng" />
      </Stepper>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {activeStep === 0 && (
          <Stack mt="md">
            <Select
              label="Chọn vùng trồng"
              placeholder="Chọn vùng"
              data={["RG001 - Vùng A", "RG002 - Vùng B"]}
              {...form.getInputProps("regionId")}
              radius={4}
            />
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack mt="md">
            <Select
              label="Chọn khu vực"
              placeholder="Chọn khu vực"
              data={["KV001 - Khu vực A1", "KV002 - Khu vực B1"]}
              {...form.getInputProps("areaId")}
              radius={4}
            />
          </Stack>
        )}

        {activeStep === 2 && (
          <Stack mt={"md"}>
            <Select
              label="Chọn lô"
              placeholder="Chọn lô"
              data={["Lô A"]}
              {...form.getInputProps("areaId")}
              radius={4}
            />
          </Stack>
        )}

        {activeStep === 3 && (
          <Stack mt="md">
            {form.values.rows.map((row, index) => (
              <Card key={index} p="md" radius={4} withBorder>
                <Stack gap={"xs"}>
                  <TextInput
                    label="Tên hàng"
                    radius={4}
                    {...form.getInputProps(`rows.${index}.name`)}
                  />
                  {/**Cây trồng filter trước */}
                  <Stack gap={"xs"}>
                    <Text fw={"500"} fz={14}>
                      Cây trồng
                    </Text>
                    <Group>
                      {["Sầu riêng", "Xoài", "Mãng cầu", "Chuối"].map(
                        (item) => (
                          <Badge size="md" radius={100}>
                            {item}
                          </Badge>
                        )
                      )}
                    </Group>
                  </Stack>
                  <Stack gap={"xs"}>
                    <Text fw={"500"} fz={14}>
                      Giống cây
                    </Text>
                    <Group>
                      {["Giống cây A", "Giống cây B"].map((item) => (
                        <Badge size="md" radius={100}>
                          {item}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                  {form.getValues().farming === "Xen canh" && (
                    <Select
                      radius={4}
                      label="Chọn hạt giống cây"
                      data={["Giống A", "Giống B"]}
                      {...form.getInputProps(`rows.${index}.crop`)}
                    />
                  )}
                  <TextInput
                    radius={4}
                    label="Số lượng cây"
                    type="number"
                    {...form.getInputProps(`rows.${index}.treeCount`)}
                  />
                </Stack>
              </Card>
            ))}
            <Button radius={4} variant="light" mt="md" onClick={addRow}>
              + Thêm hàng
            </Button>
          </Stack>
        )}

        <Group justify="space-between" mt="xl">
          <Button
            variant="default"
            radius={4}
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => prev - 1)}
          >
            Quay lại
          </Button>
          {activeStep < 3 ? (
            <Button
              radius={4}
              onClick={() => setActiveStep((prev) => prev + 1)}
            >
              Tiếp theo
            </Button>
          ) : (
            <Button radius={4} color="green">
              Lưu
            </Button>
          )}
        </Group>
      </form>
    </Card>
  );
};

export default AreaManagementRowAddPage;
