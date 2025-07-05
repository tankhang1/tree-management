import {
  Button,
  Card,
  Group,
  Stack,
  Title,
  Select,
  TextInput,
  Textarea,
  MultiSelect,
  Stepper,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AreaManagementBlockAddPage = () => {
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
        <Title order={3}>📋 Tạo mới Lô và Hàng</Title>
      </Group>

      <Stepper
        active={activeStep}
        onStepClick={setActiveStep}
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="Vùng trồng" />
        <Stepper.Step label="Khu vực" />
        <Stepper.Step label="Tạo lô" />
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
          <Stack mt="md">
            <TextInput
              radius={4}
              label="Mã lô"
              required
              {...form.getInputProps("code")}
            />
            <TextInput
              label="Tên lô"
              required
              {...form.getInputProps("name")}
              radius={4}
            />
            <TextInput
              label="Diện tích (m²)"
              type="number"
              required
              {...form.getInputProps("area")}
              radius={4}
            />
            <MultiSelect
              label="Cây trồng chính"
              placeholder="Chọn 1 hoặc nhiều loại"
              data={["Sầu riêng", "Xoài", "Mãng cầu", "Chuối"]}
              {...form.getInputProps("mainCrops")}
              radius={4}
            />
            <Select
              label="Phương pháp tưới tiêu"
              data={["Tưới nhỏ giọt", "Tưới phun mưa", "Tưới tràn"]}
              {...form.getInputProps("irrigation")}
              radius={4}
            />
            <Select
              label="Phương pháp canh tác"
              data={["Hữu cơ", "Truyền thống", "Công nghệ cao"]}
              {...form.getInputProps("farming")}
              radius={4}
            />
            <TextInput label="Đường bình độ (cao độ)" radius={4} />
            <Textarea
              label="Toạ độ GPS (đa giác)"
              placeholder="VD: 10.77,106.69 10.78,106.70"
              {...form.getInputProps("gps")}
              radius={4}
            />
          </Stack>
        )}

        {activeStep === 3 && (
          <Stack mt="md">
            {form.values.rows.map((row, index) => (
              <Card key={index} p="md" radius={4} withBorder>
                <TextInput
                  label="Tên hàng"
                  radius={4}
                  {...form.getInputProps(`rows.${index}.name`)}
                />
                <TextInput
                  radius={4}
                  label="Mã hàng"
                  {...form.getInputProps(`rows.${index}.code`)}
                />
                <Select
                  radius={4}
                  label="Chọn cây"
                  data={["Sầu riêng", "Xoài", "Chuối"]}
                  {...form.getInputProps(`rows.${index}.crop`)}
                />
                <TextInput
                  radius={4}
                  label="Số cây"
                  type="number"
                  {...form.getInputProps(`rows.${index}.treeCount`)}
                />
                <Textarea
                  radius={4}
                  label="Toạ độ GPS (x1y1 x2y2)"
                  {...form.getInputProps(`rows.${index}.gps`)}
                />
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

export default AreaManagementBlockAddPage;
