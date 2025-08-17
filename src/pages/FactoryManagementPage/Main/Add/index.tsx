import {
  Button,
  Card,
  Stack,
  TextInput,
  Select,
  Textarea,
  MultiSelect,
  Group,
  Title,
  NumberInput,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import RegionCardSelector from "../../../AreaManagementPage/Region/Add/components/RegionCards";
import { regionOptions } from "../../../AreaManagementPage/Block/Add";
const FactoryManagementMainAddPage = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      factoryId: "",
      area: "",
      name: "",
      location: "",
      areaSize: "",
      manager: "",
      departments: [],
      establishedDate: null,
      status: "",
    },
  });
  const handleSubmit = () => {};
  return (
    <Card shadow="sm" p="lg" radius={4}>
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Thêm mới nhà máy</Title>
      </Group>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap={"xs"}>
          <TextInput
            label="Mã nhà máy"
            {...form.getInputProps("factoryId")}
            placeholder="Mã nhà máy"
            required
            radius={4}
          />
          <TextInput
            label="Tên nhà máy"
            {...form.getInputProps("name")}
            required
            placeholder="Tên nhà máy"
            radius={4}
          />
          <Stack gap={"xs"}>
            <Text fw={500} fz={15}>
              Vùng Trồng
            </Text>
            <TextInput
              placeholder="Tìm kiếm vùng trồng"
              radius={4}
              leftSection={<IconSearch size={18} />}
            />
            <RegionCardSelector
              regions={regionOptions}
              selected={"12"}
              onSelect={() => {}}
            />
          </Stack>
          <Textarea
            label="Địa chỉ"
            autosize
            minRows={2}
            placeholder="Địa chỉ"
            {...form.getInputProps("location")}
            required
            radius={4}
          />
          <NumberInput
            label="Diện tích (m²)"
            placeholder="Diện tích (m²)"
            {...form.getInputProps("areaSize")}
            required
            radius={4}
          />
          <Select
            searchable
            clearable
            label="Người quản lý"
            {...form.getInputProps("manager")}
            radius={4}
            placeholder="Người quản lý"
          />
          <MultiSelect
            label="Phòng ban"
            data={["Sản xuất", "Kho", "QA/QC", "Kỹ thuật", "Hành chính"]}
            {...form.getInputProps("departments")}
            searchable
            clearable
            radius={4}
          />
          <DateInput
            label="Ngày thành lập"
            {...form.getInputProps("establishedDate")}
            required
            radius={4}
            placeholder="DD/MM/YYYY"
            locale="vi"
          />
          <Select
            searchable
            clearable
            label="Trạng thái"
            data={[
              { value: "Đang hoạt động", label: "Đang hoạt động" },
              { value: "Ngưng hoạt động", label: "Ngưng hoạt động" },
            ]}
            {...form.getInputProps("status")}
            required
            radius={4}
          />
          <Group>
            <Button variant="outline" w={"100%"} type="submit" radius={4}>
              🚀 Tạo nhà máy
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
};
export default FactoryManagementMainAddPage;
