import {
  Button,
  Group,
  Stepper,
  TextInput,
  Textarea,
  Select,
  MultiSelect,
  Stack,
  Card,
  Title,
  Collapse,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AreaManagementAddRegionPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [expandedAreas, setExpandedAreas] = useState<number[]>([]);

  const toggleArea = (index: number) => {
    setExpandedAreas((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const form = useForm({
    initialValues: {
      region: {
        codeSystem: "",
        codeGov: "",
        name: "",
        orgUnit: "",
        employee: "",
        area: "",
        soilType: "",
        terrain: [],
        gps: "",
        note: "",
      },
      areas: [
        {
          code: "",
          name: "",
          regionRef: "",
          orgUnit: "",
          employee: "",
          area: "",
          soilType: "",
          terrain: [],
          mainCrop: "",
          gps: "",
        },
      ],
    },
  });

  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleAddArea = () => {
    form.insertListItem("areas", {
      code: "",
      name: "",
      regionRef: "",
      orgUnit: "",
      area: "",
      soilType: "",
      terrain: [],
      mainCrop: "",
      gps: "",
    });
    setExpandedAreas((prev) => [...prev, form.values.areas.length]);
  };

  const handleSubmit = () => {
    console.log("✅ Dữ liệu toàn bộ:", form.values);
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
        <Title order={3}>Thêm mới vùng trồng theo từng bước</Title>
      </Group>
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={true}
      >
        <Stepper.Step label="Vùng trồng" />
        <Stepper.Step label="Khu vực" />
      </Stepper>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {active === 0 && (
          <Stack mt="md" gap={"xs"}>
            <TextInput
              radius={4}
              label="Mã vùng (hệ thống)"
              required
              {...form.getInputProps("region.codeSystem")}
            />
            <TextInput
              radius={4}
              label="Mã vùng (định danh nhà nước)"
              {...form.getInputProps("region.codeGov")}
            />
            <TextInput
              radius={4}
              label="Tên vùng trồng"
              required
              {...form.getInputProps("region.name")}
            />
            <Select
              radius={4}
              label="Doanh nghiệp / Hộ nông dân"
              {...form.getInputProps("region.orgUnit")}
            />
            <Select
              radius={4}
              label="Chọn nhân viên quản lý"
              {...form.getInputProps("region.employee")}
            />
            <TextInput
              radius={4}
              label="Diện tích (m²)"
              required
              {...form.getInputProps("region.area")}
            />
            <Select
              radius={4}
              label="Loại đất"
              data={["Đất thịt", "Đất cát", "Đất phù sa"]}
              {...form.getInputProps("region.soilType")}
            />
            <MultiSelect
              radius={4}
              label="Thông tin địa hình"
              data={["Cao", "Thấp", "Dốc", "Trũng"]}
              {...form.getInputProps("region.terrain")}
            />
            <Textarea
              radius={4}
              label="Toạ độ GPS (đa giác)"
              {...form.getInputProps("region.gps")}
            />
            <Textarea
              radius={4}
              label="Ghi chú"
              {...form.getInputProps("region.note")}
            />
          </Stack>
        )}

        {active === 1 && (
          <Stack mt="md" gap={"xs"}>
            {form.values.areas.map((area, areaIdx) => (
              <Card key={areaIdx} withBorder radius={4} p="md" mb="md">
                <Group justify="space-between">
                  <TextInput
                    placeholder="Nhập tên khu vực"
                    value={`Khu vực ${areaIdx + 1}`}
                    radius={4}
                  />
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => toggleArea(areaIdx)}
                  >
                    {expandedAreas.includes(areaIdx) ? "Ẩn" : "Hiện"} khu vực
                  </Button>
                </Group>
                <Collapse in={expandedAreas.includes(areaIdx)}>
                  <TextInput
                    mt={"xs"}
                    radius={4}
                    label="Mã khu vực"
                    {...form.getInputProps(`areas.${areaIdx}.code`)}
                  />
                  <TextInput
                    radius={4}
                    label="Tên khu vực"
                    {...form.getInputProps(`areas.${areaIdx}.name`)}
                  />
                  <TextInput
                    radius={4}
                    label="Diện tích"
                    {...form.getInputProps(`areas.${areaIdx}.area`)}
                  />
                  <Select
                    radius={4}
                    label="Loại đất"
                    data={["Đất thịt", "Đất cát", "Đất phù sa"]}
                    {...form.getInputProps(`areas.${areaIdx}.soilType`)}
                  />
                  <MultiSelect
                    radius={4}
                    label="Địa hình"
                    data={["Cao", "Thấp", "Trũng"]}
                    {...form.getInputProps(`areas.${areaIdx}.terrain`)}
                  />
                  <Textarea
                    radius={4}
                    label="Toạ độ GPS"
                    {...form.getInputProps(`areas.${areaIdx}.gps`)}
                  />
                  <Group mt={"xs"}>
                    <Button radius={4}>Lưu</Button>
                    <Button radius={4} color="red">
                      Xoá
                    </Button>
                  </Group>
                </Collapse>
              </Card>
            ))}
            <Button radius={4} variant="outline" onClick={handleAddArea}>
              + Thêm khu vực
            </Button>
          </Stack>
        )}

        <Group mt="xl" justify="space-between">
          <Button
            radius={4}
            onClick={prevStep}
            disabled={active === 0}
            variant="default"
          >
            Quay lại
          </Button>
          {active < 1 ? (
            <Button radius={4} onClick={nextStep}>
              Tiếp theo
            </Button>
          ) : (
            <Button radius={4} type="submit" color="green">
              Lưu toàn bộ
            </Button>
          )}
        </Group>
      </form>
    </Card>
  );
};

export default AreaManagementAddRegionPage;
