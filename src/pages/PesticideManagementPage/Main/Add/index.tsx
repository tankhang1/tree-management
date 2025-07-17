import {
  Button,
  Card,
  Group,
  Paper,
  Select,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "suneditor/dist/css/suneditor.min.css";
import Document from "../../../../components/Document";

// Giả lập loại thuốc từ danh mục V.1
const pesticideTypes = [
  { value: "TYPE01", label: "Thuốc trừ sâu" },
  { value: "TYPE02", label: "Thuốc trừ bệnh" },
  { value: "TYPE03", label: "Phân bón lá" },
];

const units = ["ml", "lit", "g", "kg"];

const PesticideManagementMainAddPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      typeId: "",
      unit: "",
      info: "",
      ingredients: "",
      usage: "",
    },
    validate: {
      id: (val) => (!val ? "Vui lòng nhập mã thuốc" : null),
      name: (val) => (!val ? "Vui lòng nhập tên thuốc" : null),
      typeId: (val) => (!val ? "Chọn loại thuốc" : null),
      unit: (val) => (!val ? "Chọn đơn vị tính" : null),
    },
  });

  const nextStep = () => setActive((cur) => (cur < 3 ? cur + 1 : cur));
  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group mb={"xs"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>🌿 Tạo thuốc mới</Title>
      </Group>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="Bước 1" description="Thông tin chung">
          <Stack gap={"xs"}>
            <TextInput
              label="Mã thuốc"
              required
              {...form.getInputProps("id")}
              radius={4}
            />
            <TextInput
              label="Tên thuốc"
              required
              radius={4}
              {...form.getInputProps("name")}
            />
            <Select
              label="Loại thuốc"
              data={pesticideTypes}
              required
              radius={4}
              {...form.getInputProps("typeId")}
            />
            <Select
              label="Đơn vị tính"
              data={units}
              required
              radius={4}
              {...form.getInputProps("unit")}
            />
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Bước 2" description="Thông tin thuốc">
          <Stack>
            {/**Filter theo loại thuốc */}
            <Select label="Hoạt chất" radius={4} />
            <Document title1="Thông tin thuốc" title2="Nội dung thuốc" />
            <Document
              title1="Thành phần công thức"
              title2="Nội dung công thức"
            />
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Bước 3" description="Hướng dẫn sử dụng">
          <Document title1="Hướng dẫn sử dụng" title2="Nội dung" />
        </Stepper.Step>
        <Stepper.Step label="Bước 4" description="Xác nhận thông tin">
          <Stack gap="xs">
            <Title order={5}>📦 Thông tin chung</Title>
            <Text>
              <b>Mã thuốc:</b> {form.values.id}
            </Text>
            <Text>
              <b>Tên thuốc:</b> {form.values.name}
            </Text>
            <Text>
              <b>Loại thuốc:</b>{" "}
              {pesticideTypes.find((t) => t.value === form.values.typeId)
                ?.label || form.values.typeId}
            </Text>
            <Text>
              <b>Đơn vị:</b> {form.values.unit}
            </Text>
            <Text>
              <b>Hoạt chất:</b>
            </Text>
            <Title order={5} mt="sm">
              🧪 Thông tin thuốc
            </Title>

            <Paper
              shadow="xs"
              radius="4"
              p="md"
              withBorder
              style={{
                backgroundColor: "#f9f9f9",
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: form.values.info }}
                style={{
                  lineHeight: 1.6,
                }}
              />
            </Paper>
            <Title order={5} mt="sm">
              🧬 Thành phần
            </Title>
            <Paper
              shadow="xs"
              radius="4"
              p="md"
              withBorder
              style={{
                backgroundColor: "#f9f9f9",
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: form.values.info }}
                style={{
                  lineHeight: 1.6,
                }}
              />
            </Paper>
            <Title order={5} mt="sm">
              📋 Hướng dẫn sử dụng
            </Title>
            <Paper
              shadow="xs"
              radius="4"
              p="md"
              withBorder
              style={{
                backgroundColor: "#f9f9f9",
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: form.values.info }}
                style={{
                  lineHeight: 1.6,
                }}
              />
            </Paper>
          </Stack>
        </Stepper.Step>
      </Stepper>

      <Group mt="xl" justify="space-between">
        <Button variant="default" radius={4} onClick={prevStep}>
          Quay lại
        </Button>
        {active < 3 && (
          <Button onClick={nextStep} radius={4}>
            Tiếp theo
          </Button>
        )}
        {active === 3 && <Button radius={4}>Lưu</Button>}
      </Group>
    </Card>
  );
};

export default PesticideManagementMainAddPage;
