import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Select,
  Text,
  Modal,
  Radio,
  MultiSelect,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { DepartmentCardList } from "../../../HRManagementPage/Team/Add/components/DepartmentCardList";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";

const AddEquipmentUsageForm = () => {
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);
  const [mode, setMode] = useState<"group" | "dept">("group");
  const form = useForm({
    initialValues: {
      id: "",
      machineId: "",
      startTime: new Date(),
      endTime: new Date(),
      usedBy: "",
      purpose: "",
      location: "",
    },

    validate: {
      id: (val) => (!val ? "Vui lòng nhập mã sử dụng" : null),
      machineId: (val) => (!val ? "Chọn mã máy" : null),
      usedBy: (val) => (!val ? "Vui lòng nhập người sử dụng" : null),
      purpose: (val) => (!val ? "Vui lòng nhập mục đích" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("📦 Thêm mới lịch sử sử dụng:", values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Mã sử dụng"
          {...form.getInputProps("id")}
          required
          radius={4}
        />

        <Select
          label="Mã máy"
          placeholder="Chọn mã máy"
          data={["MC001", "MC002", "MC003"]}
          radius={4}
          {...form.getInputProps("machineId")}
          required
        />

        <Group grow>
          <DateTimePicker
            label="Thời gian bắt đầu"
            radius={4}
            {...form.getInputProps("startTime")}
            locale="vi"
          />
          <DateTimePicker
            label="Thời gian kết thúc"
            radius={4}
            {...form.getInputProps("endTime")}
            locale="vi"
          />
        </Group>

        <Group>
          <Text fw={"500"} fz={14}>
            Chọn nhân sự thực hiện
          </Text>
          <Button
            variant="light"
            radius={4}
            leftSection={<IconFilter size={18} />}
            onClick={openFilterEmployee}
          >
            Lọc nhân sự
          </Button>
        </Group>
        <TextInput
          label="Vị trí sử dụng"
          placeholder="Vị trí thực tế"
          radius={4}
          {...form.getInputProps("location")}
        />

        <Textarea
          label="Mục đích sử dụng"
          autosize
          radius={4}
          minRows={3}
          {...form.getInputProps("purpose")}
          required
        />

        <Group mt="md" justify="flex-end">
          <Button type="submit" radius={4}>
            Thêm mới
          </Button>
        </Group>
      </Stack>
      <Modal
        opened={openedFilterEmployee}
        onClose={closeFilterEmployee}
        title={<Text fw={"bold"}>Lọc nhân sự</Text>}
      >
        <Stack gap={"xs"}>
          <Radio.Group
            label="Phương thức lọc"
            value={mode}
            onChange={(val) => setMode(val as "group" | "dept")}
          >
            <Radio value="group" mb={"xs"} label="Chọn theo đội nhóm" />
            <Radio value="dept" label="Chọn theo phòng ban và vai trò" />
          </Radio.Group>

          {mode === "group" && (
            <MultiSelect
              label="Chọn đội nhóm"
              radius={4}
              data={["Nhóm Canh tác", "Nhóm Vật tư"]}
            />
          )}

          {mode === "dept" && (
            <>
              <TextInput
                label="Phòng ban"
                placeholder="Tìm kiếm phòng ban liên quan"
                leftSection={<IconSearch size={16} />}
                radius={4}
              />
              <DepartmentCardList />
              <MultiSelect
                label="Chọn vai trò"
                radius={4}
                data={["Giám đốc", "Tổ trưởng", "Trưởng phòng"]}
              />
            </>
          )}
          <TextInput
            label="Tìm kiếm nhân viên"
            placeholder="Chọn thành viên từ nhân sự"
            leftSection={<IconSearch size={16} />}
            radius={4}
          />
          <EmployeeCardList />
        </Stack>

        <Group mt="md" justify="flex-end">
          <Button
            radius={4}
            variant="outline"
            color="red"
            onClick={closeFilterEmployee}
          >
            Huỷ
          </Button>
          <Button radius={4}>Xác nhận</Button>
        </Group>
      </Modal>
    </form>
  );
};

export default AddEquipmentUsageForm;
