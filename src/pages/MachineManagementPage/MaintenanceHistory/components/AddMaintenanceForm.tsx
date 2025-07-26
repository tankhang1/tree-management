import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Text,
  Modal,
  Radio,
  MultiSelect,
  FileInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconFilter, IconSearch, IconUpload } from "@tabler/icons-react";
import { DepartmentCardList } from "../../../HRManagementPage/Team/Add/components/DepartmentCardList";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

// Giả lập danh sách mã máy và nhân viên
const machineOptions = [
  { value: "MC001", label: "Xe tải Hino 5 tấn" },
  { value: "MC002", label: "Máy cày Kubota" },
];

const AddMaintenanceForm = () => {
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
      staffId: "",
      reason: "",
      cost: 0,
      description: "",
    },

    validate: {
      id: (val) => (!val ? "Vui lòng nhập mã bảo trì" : null),
      machineId: (val) => (!val ? "Vui lòng chọn máy" : null),
      staffId: (val) => (!val ? "Chọn nhân viên thực hiện" : null),
      reason: (val) => (!val ? "Vui lòng nhập lý do" : null),
      cost: (val) => (val < 0 ? "Chi phí không hợp lệ" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("📋 Thêm mới bảo trì:", values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="xs">
        <TextInput
          label="Mã phiếu"
          placeholder="PU001"
          radius={4}
          {...form.getInputProps("id")}
        />

        <Select
          label="Máy móc"
          placeholder="Chọn máy"
          data={machineOptions}
          {...form.getInputProps("machineId")}
          required
          radius={4}
        />

        <Group grow>
          <DateTimePicker
            label="Thời gian bắt đầu"
            {...form.getInputProps("startTime")}
            locale="vi"
            radius={4}
          />
          <DateTimePicker
            label="Thời gian kết thúc"
            {...form.getInputProps("endTime")}
            locale="vi"
            radius={4}
          />
        </Group>

        <Group>
          <Text fw={"500"} fz={14}>
            Nhân sự thực hiện
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
        <Select
          label="Lý do bảo trì"
          placeholder="Ví dụ: Thay nhớt, kiểm tra động cơ"
          {...form.getInputProps("reason")}
          required
          data={[
            { value: "oil_change", label: "Thay nhớt định kỳ" },
            { value: "engine_check", label: "Kiểm tra động cơ" },
            { value: "transmission_service", label: "Bảo trì hộp số" },
            { value: "filter_cleaning", label: "Vệ sinh lọc gió/lọc dầu" },
            { value: "brake_adjustment", label: "Điều chỉnh phanh" },
            { value: "tire_inspection", label: "Kiểm tra lốp/áp suất bánh xe" },
            { value: "electrical_check", label: "Kiểm tra hệ thống điện" },
            { value: "general_inspection", label: "Bảo trì tổng thể" },
            {
              value: "hydraulic_maintenance",
              label: "Bảo trì hệ thống thuỷ lực",
            },
            { value: "cooling_system", label: "Vệ sinh hệ thống làm mát" },
          ]}
          radius={4}
        />

        <NumberInput
          label="Chi phí bảo trì (VND)"
          min={0}
          thousandSeparator
          hideControls
          {...form.getInputProps("cost")}
          radius={4}
        />

        <Textarea
          label="Nội dung bảo trì"
          autosize
          minRows={3}
          {...form.getInputProps("description")}
          radius={4}
        />
        <FileInput
          label="Thông tin liên quan (Hoá đơn/ Chứng từ)"
          radius={4}
          leftSection={<IconUpload size={18} />}
        />
        <Group
          mt="md"
          justify="flex-end
        "
        >
          <Button type="submit" radius={4}>
            Lưu
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

export default AddMaintenanceForm;
