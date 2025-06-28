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
import { useState } from "react";

const AreaManagementBlockAddPage = () => {
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
      <Title order={3} mb="lg">
        📋 Tạo mới Lô và Hàng
      </Title>

      <Stepper
        active={activeStep}
        onStepClick={setActiveStep}
        allowNextStepsSelect={false}
        radius={4}
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
            />
          </Stack>
        )}

        {activeStep === 2 && (
          <Stack mt="md">
            <TextInput label="Mã lô" required {...form.getInputProps("code")} />
            <TextInput
              label="Tên lô"
              required
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Diện tích (m²)"
              type="number"
              required
              {...form.getInputProps("area")}
            />
            <MultiSelect
              label="Cây trồng chính"
              placeholder="Chọn 1 hoặc nhiều loại"
              data={["Sầu riêng", "Xoài", "Mãng cầu", "Chuối"]}
              {...form.getInputProps("mainCrops")}
            />
            <Select
              label="Phương pháp tưới tiêu"
              data={["Tưới nhỏ giọt", "Tưới phun mưa", "Tưới tràn"]}
              {...form.getInputProps("irrigation")}
            />
            <Select
              label="Phương pháp canh tác"
              data={["Hữu cơ", "Truyền thống", "Công nghệ cao"]}
              {...form.getInputProps("farming")}
            />
            <Textarea
              label="Toạ độ GPS (đa giác)"
              placeholder="VD: 10.77,106.69 10.78,106.70"
              {...form.getInputProps("gps")}
            />
          </Stack>
        )}

        {activeStep === 3 && (
          <Stack mt="md">
            {form.values.rows.map((row, index) => (
              <Stack
                key={index}
                p="md"
                style={{ border: "1px solid #ccc", borderRadius: 8 }}
              >
                <TextInput
                  label="Tên hàng"
                  {...form.getInputProps(`rows.${index}.name`)}
                />
                <TextInput
                  label="Mã hàng"
                  {...form.getInputProps(`rows.${index}.code`)}
                />
                <Select
                  label="Chọn cây"
                  data={["Sầu riêng", "Xoài", "Chuối"]}
                  {...form.getInputProps(`rows.${index}.crop`)}
                />
                <TextInput
                  label="Số cây"
                  type="number"
                  {...form.getInputProps(`rows.${index}.treeCount`)}
                />
                <Textarea
                  label="Toạ độ GPS (x1y1 x2y2)"
                  {...form.getInputProps(`rows.${index}.gps`)}
                />
              </Stack>
            ))}
            <Button variant="light" mt="md" onClick={addRow}>
              + Thêm hàng
            </Button>
          </Stack>
        )}

        <Group justify="space-between" mt="xl">
          <Button
            variant="default"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => prev - 1)}
          >
            Quay lại
          </Button>
          {activeStep < 3 ? (
            <Button onClick={() => setActiveStep((prev) => prev + 1)}>
              Tiếp theo
            </Button>
          ) : (
            <Button type="submit" color="green">
              Lưu
            </Button>
          )}
        </Group>
      </form>
    </Card>
  );
};

export default AreaManagementBlockAddPage;
