import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Text,
  Modal,
  Radio,
  MultiSelect,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconFilter, IconSearch } from "@tabler/icons-react";
import { DepartmentCardList } from "../../../HRManagementPage/Team/Add/components/DepartmentCardList";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

// Dữ liệu mẫu (có thể load từ API)
const materialOptions = [
  { value: "MAT001", label: "Phân NPK 16-16-8" },
  { value: "MAT002", label: "Thuốc bảo vệ thực vật" },
  { value: "MAT003", label: "Bao bì 50kg" },
];

const disposalReasons = [
  { value: "expired", label: "Hết hạn sử dụng" },
  { value: "damaged", label: "Hư hỏng, mốc, ẩm" },
  { value: "recalled", label: "Thu hồi do lỗi lô sản xuất" },
  { value: "other", label: "Lý do khác" },
];

const AddDisposalForm = () => {
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);

  const [mode, setMode] = useState<"group" | "dept">("group");

  const form = useForm({
    initialValues: {
      id: "",
      materialId: "",
      disposalDate: new Date(),
      staffId: "",
      reason: "",
      quantity: 0,
      notes: "",
    },
    validate: {
      id: (v) => (!v ? "Vui lòng nhập mã phiếu" : null),
      materialId: (v) => (!v ? "Chọn vật tư cần thanh lý" : null),
      staffId: (v) => (!v ? "Chọn người thực hiện" : null),
      reason: (v) => (!v ? "Vui lòng chọn lý do" : null),
      quantity: (v) => (v <= 0 ? "Số lượng phải lớn hơn 0" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("Phiếu thanh lý vật tư:", values);
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Mã phiếu"
          placeholder="VD: MDIS005"
          withAsterisk
          radius={4}
          {...form.getInputProps("id")}
        />

        <Select
          label="Vật tư cần thanh lý"
          placeholder="Chọn vật tư"
          data={materialOptions}
          withAsterisk
          radius={4}
          {...form.getInputProps("materialId")}
        />

        <DateTimePicker
          label="Ngày thanh lý"
          withAsterisk
          radius={4}
          {...form.getInputProps("disposalDate")}
        />

        <Group>
          <Text fw={500} fz={14}>
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
          label="Lý do thanh lý"
          placeholder="Chọn lý do"
          data={disposalReasons}
          withAsterisk
          radius={4}
          {...form.getInputProps("reason")}
        />

        <NumberInput
          label="Số lượng thanh lý"
          placeholder="Nhập số lượng"
          withAsterisk
          radius={4}
          min={1}
          {...form.getInputProps("quantity")}
        />

        <Textarea
          label="Ghi chú"
          placeholder="Ghi chú thêm (nếu có)"
          autosize
          minRows={2}
          radius={4}
          {...form.getInputProps("notes")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit" radius={4}>
            Lưu phiếu
          </Button>
        </Group>
      </Stack>

      <Modal
        opened={openedFilterEmployee}
        onClose={closeFilterEmployee}
        title={<Text fw={700}>Lọc nhân sự</Text>}
      >
        <Stack gap="xs">
          <Radio.Group
            label="Phương thức lọc"
            value={mode}
            onChange={(val) => setMode(val as "group" | "dept")}
          >
            <Radio value="group" label="Chọn theo đội nhóm" />
            <Radio value="dept" label="Chọn theo phòng ban và vai trò" />
          </Radio.Group>

          {mode === "group" && (
            <MultiSelect
              label="Đội nhóm"
              radius={4}
              data={["Nhóm kho", "Nhóm vật tư", "Nhóm vận hành"]}
            />
          )}

          {mode === "dept" && (
            <>
              <TextInput
                label="Phòng ban"
                placeholder="Tìm kiếm phòng ban"
                leftSection={<IconSearch size={16} />}
                radius={4}
              />
              <DepartmentCardList />
              <MultiSelect
                label="Vai trò"
                radius={4}
                data={["Tổ trưởng", "Nhân viên", "Thủ kho"]}
              />
            </>
          )}

          <TextInput
            label="Tìm kiếm nhân viên"
            placeholder="Chọn nhân sự"
            leftSection={<IconSearch size={16} />}
            radius={4}
          />
          <EmployeeCardList />
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button
            variant="outline"
            color="red"
            radius={4}
            onClick={closeFilterEmployee}
          >
            thanh lý
          </Button>
          <Button radius={4}>Xác nhận</Button>
        </Group>
      </Modal>
    </form>
  );
};

export default AddDisposalForm;
